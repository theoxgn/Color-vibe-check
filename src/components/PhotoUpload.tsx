import React, { useRef, useState, useEffect } from 'react';
import './PhotoUpload.css';

interface PhotoUploadProps {
  onImageUpload: (image: string) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageUpload(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const startCamera = async () => {
    console.log('🎥 Starting camera...');
    console.log('📍 Location:', window.location.href);
    console.log('🔒 Secure context:', window.isSecureContext);
    console.log('🌐 Protocol:', window.location.protocol);
    
    // Check basic support
    if (!navigator.mediaDevices) {
      alert('❌ Camera not supported by your browser!');
      return;
    }
    
    if (!navigator.mediaDevices.getUserMedia) {
      alert('❌ Camera access not available. Please use HTTPS!');
      return;
    }

    // Check permissions first
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('📷 Camera permission:', permission.state);
      
      if (permission.state === 'denied') {
        alert('❌ Camera permission denied. Please enable camera access in your browser settings.');
        return;
      }
    } catch (permError) {
      console.log('⚠️ Could not check camera permission:', permError);
    }

    try {
      console.log('🔍 Getting media devices...');
      
      // Start with the most basic constraints
      console.log('📱 Trying basic camera access...');
      let mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      
      console.log('✅ Camera access granted!');
      console.log('📺 Stream:', mediaStream);
      console.log('🎬 Video tracks:', mediaStream.getVideoTracks());
      
      setStream(mediaStream);
      setShowCamera(true);
      
      // Set up video element
      if (videoRef.current) {
        console.log('📽️ Setting up video element...');
        videoRef.current.srcObject = mediaStream;
        
        // Add event listeners for debugging
        videoRef.current.onloadstart = () => console.log('📹 Video load start');
        videoRef.current.onloadedmetadata = () => {
          console.log('📐 Video metadata loaded:', {
            width: videoRef.current?.videoWidth,
            height: videoRef.current?.videoHeight,
            duration: videoRef.current?.duration
          });
          // Force re-render to update resolution display
          setStream(mediaStream);
        };
        videoRef.current.oncanplay = () => {
          console.log('▶️ Video can play');
          // Force re-render when video is ready
          setStream(mediaStream);
        };
        videoRef.current.onplay = () => {
          console.log('🎬 Video playing');
          // Force re-render when playing
          setStream(mediaStream);
        };
        videoRef.current.onerror = (e) => console.error('❌ Video error:', e);
        
        // Wait for metadata before playing
        const waitForMetadata = new Promise((resolve) => {
          if (videoRef.current!.videoWidth > 0) {
            resolve(true);
          } else {
            videoRef.current!.addEventListener('loadedmetadata', () => resolve(true), { once: true });
          }
        });
        
        // Force play
        try {
          await videoRef.current.play();
          console.log('✅ Video playing successfully!');
          
          // Wait for metadata with timeout
          const metadataTimeout = setTimeout(() => {
            console.log('⚠️ Metadata timeout, but continuing...');
          }, 3000);
          
          await Promise.race([waitForMetadata, new Promise(resolve => setTimeout(resolve, 3000))]);
          clearTimeout(metadataTimeout);
          
        } catch (playError) {
          console.error('❌ Video play error:', playError);
          // Try to play anyway
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.log('⚠️ Delayed play failed:', e));
            }
          }, 1000);
        }
      }
      
    } catch (error) {
      console.error('❌ Camera error:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      let errorMessage = '📷 Camera access failed!';
      
      if (error instanceof Error) {
        switch (error.name) {
          case 'NotAllowedError':
          case 'PermissionDeniedError':
            errorMessage = '🚫 Camera permission denied. Please:\n\n1. Click the camera icon in your browser address bar\n2. Allow camera access\n3. Refresh the page and try again';
            break;
          case 'NotFoundError':
          case 'DevicesNotFoundError':
            errorMessage = '📷 No camera found. Please check if your device has a working camera.';
            break;
          case 'NotSupportedError':
            errorMessage = '⚠️ Camera not supported. Please use a modern browser with HTTPS.';
            break;
          case 'NotReadableError':
            errorMessage = '🔒 Camera is busy. Please close other apps using the camera and try again.';
            break;
          case 'OverconstrainedError':
            errorMessage = '⚙️ Camera settings not supported. Trying with basic settings...';
            // Try again with minimal constraints
            setTimeout(() => startCameraBasic(), 1000);
            return;
          default:
            errorMessage = `❌ Camera error: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    }
  };
  
  // Fallback function with minimal constraints
  const startCameraBasic = async () => {
    try {
      console.log('🔄 Trying basic camera...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(e => console.log('Basic play error:', e));
      }
    } catch (basicError) {
      console.error('❌ Basic camera also failed:', basicError);
      alert('❌ Could not access camera with any settings. Please check your browser permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    console.log('📸 Capture photo called');
    console.log('📹 Video element:', video);
    console.log('🎨 Canvas element:', canvas);
    console.log('📐 Video dimensions:', video?.videoWidth, 'x', video?.videoHeight);
    console.log('🎥 Video ready state:', video?.readyState);
    console.log('⏰ Video current time:', video?.currentTime);
    
    if (!video || !canvas) {
      alert('📷 Camera not ready. Please try again!');
      return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert('⏳ Camera is still loading. Please wait a moment and try again!\\n\\nTip: Try refreshing the page if this persists.');
      return;
    }
    
    if (video.readyState < 2) {
      alert('📱 Video not ready yet. Please wait a few seconds and try again.');
      return;
    }
    
    try {
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Cannot get canvas context');
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
      
      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      console.log('Image captured, data URL length:', imageDataUrl.length);
      
      if (imageDataUrl.length < 100) {
        throw new Error('Image capture failed - data too small');
      }
      
      onImageUpload(imageDataUrl);
      stopCamera();
      
    } catch (error) {
      console.error('Error capturing photo:', error);
      alert('Failed to capture photo. Please try again! 📸');
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="photo-upload">
      {!showCamera ? (
        <>
          <div className="upload-container">
            <div 
              className={`upload-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <div className="upload-icon">📸</div>
              <h2 className="upload-title">Drop your pic here bestie!</h2>
              <p className="upload-subtitle">or click to browse ✨</p>
              <div className="upload-formats">
                <span className="format-tag">JPG</span>
                <span className="format-tag">PNG</span>
                <span className="format-tag">WEBP</span>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
          </div>

          <div className="camera-section">
            <button 
              className="camera-button"
              onClick={startCamera}
              style={{position: 'relative'}}
            >
              📷 Take Photo
              <div style={{
                fontSize: '0.7rem', 
                marginTop: '0.3rem', 
                opacity: 0.8,
                fontWeight: 'normal'
              }}>
                {window.isSecureContext ? '🔒 Secure' : '⚠️ Needs HTTPS'}
              </div>
            </button>
            <p className="camera-text">or snap a fresh pic! 📱</p>
          </div>
          
          <div className="upload-tips">
            <h3>💡 Pro tips for the best vibes:</h3>
            <ul>
              <li>🌟 Use good lighting for accurate colors</li>
              <li>🎨 Clear, high-quality images work best</li>
              <li>✨ Try different angles and compositions!</li>
            </ul>
          </div>
        </>
      ) : (
        <div className="camera-container">
          <div className="camera-header">
            <h2 className="camera-title">📷 Strike a pose! ✨</h2>
            <button 
              className="close-camera-btn"
              onClick={stopCamera}
            >
              ✖️
            </button>
          </div>
          
          <div className="camera-preview">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-video"
              style={{
                width: '100%',
                height: 'auto',
                minHeight: '200px',
                backgroundColor: '#000'
              }}
              onLoadedMetadata={(e) => {
                console.log('📐 Video metadata loaded from video element');
                const video = e.target as HTMLVideoElement;
                console.log('📏 Dimensions:', video.videoWidth, 'x', video.videoHeight);
              }}
              onCanPlay={() => console.log('▶️ Video can play from video element')}
              onError={(e) => console.error('❌ Video error from video element:', e)}
              onTimeUpdate={() => {
                if (videoRef.current && videoRef.current.videoWidth > 0) {
                  // Force update when we have dimensions
                  setStream(current => current);
                }
              }}
            />
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="camera-status">
            <p style={{fontSize: '0.8rem', color: 'rgba(248, 250, 252, 0.6)', textAlign: 'center', marginBottom: '1rem'}}>
              Status: {stream ? '🟢 Active' : '🔴 Inactive'} | 
              Resolution: {videoRef.current && videoRef.current.videoWidth > 0 ? `${videoRef.current.videoWidth}x${videoRef.current.videoHeight}` : 'Loading...'} |
              Protocol: {window.location.protocol} |
              Secure: {window.isSecureContext ? '🔒 Yes' : '⚠️ No'}
            </p>
            {stream && videoRef.current && videoRef.current.videoWidth === 0 && (
              <p style={{fontSize: '0.7rem', color: 'orange', textAlign: 'center', marginBottom: '1rem'}}>
                📱 Video loading... If this persists, try refreshing the page or check camera permissions.
              </p>
            )}
          </div>

          <div className="camera-controls">
            <button 
              className="capture-button"
              onClick={capturePhoto}
            >
              📸 Capture
            </button>
            <button 
              className="cancel-button"
              onClick={stopCamera}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;