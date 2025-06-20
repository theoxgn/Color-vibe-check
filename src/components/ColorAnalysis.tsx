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

  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const getColorDistance = (color1: number[], color2: number[]): number => {
    return Math.sqrt(
      Math.pow(color1[0] - color2[0], 2) +
      Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2)
    );
  };

  const getDominantColors = (imageData: ImageData, numColors: number = 5): string[] => {
    const pixels = imageData.data;
    const colorCounts: { [key: string]: number } = {};
    
    for (let i = 0; i < pixels.length; i += 16) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const alpha = pixels[i + 3];
      
      if (alpha > 200) {
        const hex = rgbToHex(r, g, b);
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }
    }

    return Object.entries(colorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, numColors)
      .map(([color]) => color);
  };

  const getColorMood = (colors: string[]): string => {
    type ColorName = 'red' | 'orange' | 'blue' | 'teal' | 'green' | 'purple' | 'pink' | 'yellow' | 'brown' | 'beige' | 'black' | 'white' | 'gray';
    
    const moods = [
      { colors: ['red', 'orange'] as ColorName[], mood: 'fiery & passionate 🔥' },
      { colors: ['blue', 'teal'] as ColorName[], mood: 'calm & serene 🌊' },
      { colors: ['green'] as ColorName[], mood: 'fresh & nature-loving 🌿' },
      { colors: ['purple'] as ColorName[], mood: 'mystical & creative 🔮' },
      { colors: ['pink'] as ColorName[], mood: 'soft & romantic 🌸' },
      { colors: ['yellow'] as ColorName[], mood: 'bright & cheerful ☀️' },
      { colors: ['brown', 'beige'] as ColorName[], mood: 'earthy & grounded 🌰' },
      { colors: ['black', 'white', 'gray'] as ColorName[], mood: 'minimalist & chic 🖤' }
    ];

    const colorNames: ColorName[] = colors.map(hex => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      
      if (r > 200 && g < 100 && b < 100) return 'red';
      if (r > 200 && g > 150 && b < 100) return 'orange';
      if (r > 200 && g > 150 && b > 150) return 'pink';
      if (r < 100 && g < 100 && b > 200) return 'blue';
      if (r < 100 && g > 200 && b > 200) return 'teal';
      if (r < 100 && g > 200 && b < 100) return 'green';
      if (r > 150 && g < 100 && b > 150) return 'purple';
      if (r > 200 && g > 200 && b < 100) return 'yellow';
      if (r > 100 && g > 50 && b < 50) return 'brown';
      if (r > 200 && g > 180 && b > 150) return 'beige';
      if (r < 50 && g < 50 && b < 50) return 'black';
      if (r > 200 && g > 200 && b > 200) return 'white';
      return 'gray';
    });

    for (const moodData of moods) {
      if (moodData.colors.some(color => colorNames.includes(color))) {
        return moodData.mood;
      }
    }
    
    return 'unique & mysterious ✨';
  };

  const getColorSeason = (colors: string[]): string => {
    const avgBrightness = colors.reduce((sum, hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return sum + (r + g + b) / 3;
    }, 0) / colors.length;

    const hasWarm = colors.some(hex => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      return r > g + 30;
    });

    if (avgBrightness > 180) {
      return hasWarm ? 'spring vibes 🌸' : 'summer energy ☀️';
    } else {
      return hasWarm ? 'autumn feels 🍂' : 'winter mood ❄️';
    }
  };

  const generatePalette = (dominantColors: string[]): string[] => {
    const palette = [...dominantColors];
    
    while (palette.length < 8) {
      const baseColor = palette[Math.floor(Math.random() * dominantColors.length)];
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
      
      const variation = Math.random() > 0.5 ? 30 : -30;
      const newR = Math.max(0, Math.min(255, r + variation));
      const newG = Math.max(0, Math.min(255, g + variation));
      const newB = Math.max(0, Math.min(255, b + variation));
      
      const newColor = rgbToHex(newR, newG, newB);
      if (!palette.includes(newColor)) {
        palette.push(newColor);
      }
    }
    
    return palette;
  };

  useEffect(() => {
    const analyzeImage = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        setProgress(20);
        setCurrentStep('Processing pixels...');

        canvas.width = Math.min(img.width, 800);
        canvas.height = Math.min(img.height, 600);
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        setTimeout(() => {
          setProgress(50);
          setCurrentStep('Extracting dominant colors...');
          
          setTimeout(() => {
            const canvasImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const dominantColors = getDominantColors(canvasImageData);
            
            setProgress(75);
            setCurrentStep('Analyzing color harmony...');
            
            setTimeout(() => {
              const colorPalette = generatePalette(dominantColors);
              const mood = getColorMood(dominantColors);
              const season = getColorSeason(dominantColors);
              
              setProgress(85);
              setCurrentStep('Analyzing personal color season...');
              
              setTimeout(() => {
                const personalColor = analyzePersonalColor(canvasImageData);
                
                setProgress(100);
                setCurrentStep('Analysis complete! ✨');
                
                setTimeout(() => {
                  onAnalysisComplete({
                    dominantColors,
                    colorPalette,
                    mood,
                    season,
                    image: imageData,
                    personalColor
                  });
                }, 500);
              }, 800);
            }, 800);
          }, 800);
        }, 800);
      };

      img.src = imageData;
    };

    analyzeImage();
  }, [imageData, onAnalysisComplete]);

  return (
    <div className="color-analysis">
      <div className="analysis-container">
        <h2 className="analysis-title">Analyzing your aesthetic... ✨</h2>
        
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