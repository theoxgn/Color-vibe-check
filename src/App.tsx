import React, { useState } from 'react';
import './App.css';
import PhotoUpload from './components/PhotoUpload';
import ColorAnalysis from './components/ColorAnalysis';
import Results from './components/Results';

export interface PersonalColorAnalysis {
  season: string;
  undertone: 'warm' | 'cool';
  value: 'light' | 'medium' | 'deep';
  chroma: 'clear' | 'muted' | 'bright';
  skinTone: 'light' | 'medium' | 'dark';
  description: string;
  bestColors: string[];
  avoidColors: string[];
}

export interface ColorData {
  dominantColors: string[];
  colorPalette: string[];
  mood: string;
  season: string;
  image: string;
  personalColor?: PersonalColorAnalysis;
}

function App() {
  const [step, setStep] = useState<'upload' | 'analysis' | 'results'>('upload');
  const [imageData, setImageData] = useState<string>('');
  const [colorData, setColorData] = useState<ColorData | null>(null);

  const handleImageUpload = (image: string) => {
    setImageData(image);
    setStep('analysis');
  };

  const handleAnalysisComplete = (data: ColorData) => {
    setColorData(data);
    setStep('results');
  };

  const handleReset = () => {
    setStep('upload');
    setImageData('');
    setColorData(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">✨ Color Vibe Check ✨</h1>
        <p className="app-subtitle">discover your aesthetic energy 🌈</p>
      </header>

      <main className="app-main">
        {step === 'upload' && (
          <PhotoUpload onImageUpload={handleImageUpload} />
        )}
        
        {step === 'analysis' && (
          <ColorAnalysis 
            imageData={imageData}
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}
        
        {step === 'results' && colorData && (
          <Results 
            colorData={colorData}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}

export default App;
