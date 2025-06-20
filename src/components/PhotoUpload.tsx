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
    // Check if we're in a secure context
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera not supported or not in secure context (HTTPS required)! 🔒');
      return;
    }

    console.log('Starting camera...');
    console.log('Secure context:', window?.isSecureContext);
    console.log('Location protocol:', window?.location?.protocol);

    try {
      // Try with back camera first
      let mediaStream;
      try {
        console.log('Trying back camera...');
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        console.log('Back camera success');
      } catch (backCameraError) {
        // If back camera fails, try with any available camera
        console.log('Back camera not available, trying any camera:', backCameraError);
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        console.log('Any camera success');
      }
      
      console.log('Media stream obtained:', mediaStream);
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        console.log('Video srcObject set');
        // Ensure video plays
        videoRef.current.play().catch(e => console.log('Video play error:', e));
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Unable to access camera. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage += 'Please allow camera permissions! 📷';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage += 'No camera found on your device! 📷';
        } else if (error.name === 'NotSupportedError') {
          errorMessage += 'Camera not supported! Try HTTPS! 🔒';
        } else {
          errorMessage += 'Please check camera permissions and try again! 📷';
        }
      } else {
        errorMessage += 'Please check camera permissions and try again! 📷';
      }
      
      alert(errorMessage);
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
    
    console.log('Capture photo called');
    console.log('Video element:', video);
    console.log('Canvas element:', canvas);
    
    if (!video || !canvas) {
      alert('Camera not ready. Please try again! 📷');
      return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert('Camera is still loading. Please wait a moment and try again! ⏳');
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
            >
              📷 Take Photo
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
              onLoadedMetadata={() => console.log('Video metadata loaded')}
              onCanPlay={() => console.log('Video can play')}
              onError={(e) => console.error('Video error:', e)}
            />
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="camera-status">
            <p style={{fontSize: '0.8rem', color: '#666', textAlign: 'center'}}>
              {stream ? `Camera active` : 'Camera inactive'} | 
              {videoRef.current ? ` Video: ${videoRef.current.videoWidth || 0}x${videoRef.current.videoHeight || 0}` : ' No video'}
            </p>
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