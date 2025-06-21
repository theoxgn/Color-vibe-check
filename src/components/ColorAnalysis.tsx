import React, { useEffect, useRef, useState } from 'react';
import { ColorData } from '../App';
import { analyzePersonalColor } from '../utils/personalColorAnalysis';
import './ColorAnalysis.css';

interface ColorAnalysisProps {
  imageData: string;
  onAnalysisComplete: (data: ColorData) => void;
}

const ColorAnalysis: React.FC<ColorAnalysisProps> = ({ imageData, onAnalysisComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Loading image...');


  useEffect(() => {
    const analyzeImage = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        setProgress(25);
        setCurrentStep('Analyzing your features...');

        canvas.width = Math.min(img.width, 800);
        canvas.height = Math.min(img.height, 600);
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        setTimeout(() => {
          setProgress(50);
          setCurrentStep('Determining skin undertone...');
          
          setTimeout(() => {
            const canvasImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            setProgress(75);
            setCurrentStep('Calculating personal color season...');
            
            setTimeout(() => {
              const personalColor = analyzePersonalColor(canvasImageData);
              
              setProgress(100);
              setCurrentStep('Personal color analysis complete!');
              
              setTimeout(() => {
                onAnalysisComplete({
                  dominantColors: personalColor.bestColors.slice(0, 5),
                  colorPalette: [...personalColor.bestColors, ...personalColor.avoidColors].slice(0, 8),
                  mood: personalColor.season,
                  season: personalColor.description,
                  image: imageData,
                  personalColor
                });
              }, 500);
            }, 1000);
          }, 1000);
        }, 1000);
      };

      img.src = imageData;
    };

    analyzeImage();
  }, [imageData, onAnalysisComplete]);

  return (
    <div className="color-analysis">
      <div className="analysis-container">
        <h2 className="analysis-title">Analyzing your personal colors...</h2>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="progress-text">{progress}%</p>
        </div>
        
        <p className="current-step">{currentStep}</p>
        
        <div className="loading-animation">
          <div className="color-circles">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
            <div className="circle circle-4"></div>
          </div>
        </div>
        
        <canvas 
          ref={canvasRef} 
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default ColorAnalysis;