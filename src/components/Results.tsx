import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { ColorData } from '../App';
import './Results.css';

interface ResultsProps {
  colorData: ColorData;
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ colorData, onReset }) => {
  const resultsRef = useRef<HTMLDivElement>(null);

  const shareResults = async () => {
    if (!resultsRef.current) return;

    try {
      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'my-color-vibe-check.png';
          link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
    }
  };

  const copyToClipboard = () => {
    let text = `✨ My Color Vibe Check Results! ✨\n\n🎨 Mood: ${colorData.mood}\n🌟 Season: ${colorData.season}\n\n💫 Dominant Colors: ${colorData.dominantColors.join(', ')}`;
    
    if (colorData.personalColor) {
      text += `\n\n🎭 Personal Color Season: ${colorData.personalColor.season}\n💎 ${colorData.personalColor.description}`;
    }
    
    text += `\n\nDiscover your aesthetic at Color Vibe Check! 🌈`;
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard! 📋✨');
    });
  };

  return (
    <div className="results">
      <div className="results-container">
        <div className="results-content" ref={resultsRef}>
          <header className="results-header">
            <h1 className="results-title">✨ Your Color Vibe Check ✨</h1>
            <p className="results-subtitle">aesthetic energy revealed 🌈</p>
          </header>

          <div className="mood-section">
            <h2 className="section-title">Your Vibe</h2>
            <div className="mood-card">
              <p className="mood-text">{colorData.mood}</p>
            </div>
          </div>

          <div className="season-section">
            <h2 className="section-title">Your Season</h2>
            <div className="season-card">
              <p className="season-text">{colorData.season}</p>
            </div>
          </div>

          <div className="colors-section">
            <h2 className="section-title">Dominant Colors</h2>
            <div className="color-grid">
              {colorData.dominantColors.map((color, index) => (
                <div key={index} className="color-item">
                  <div 
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="color-code">{color}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="palette-section">
            <h2 className="section-title">Your Color Palette</h2>
            <div className="palette-grid">
              {colorData.colorPalette.map((color, index) => (
                <div 
                  key={index}
                  className="palette-swatch"
                  style={{ backgroundColor: color }}
                  title={color}
                ></div>
              ))}
            </div>
          </div>

          {colorData.personalColor && (
            <>
              <div className="personal-color-section">
                <h2 className="section-title">Your Personal Color Season</h2>
                <div className="personal-color-card">
                  <h3 className="personal-season-name">{colorData.personalColor.season}</h3>
                  <p className="personal-description">{colorData.personalColor.description}</p>
                  
                  <div className="color-traits">
                    <div className="trait-item">
                      <span className="trait-label">Undertone:</span>
                      <span className="trait-value">{colorData.personalColor.undertone}</span>
                    </div>
                    <div className="trait-item">
                      <span className="trait-label">Value:</span>
                      <span className="trait-value">{colorData.personalColor.value}</span>
                    </div>
                    <div className="trait-item">
                      <span className="trait-label">Chroma:</span>
                      <span className="trait-value">{colorData.personalColor.chroma}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="best-colors-section">
                <h2 className="section-title">Colors That Make You Glow ✨</h2>
                <div className="color-recommendation-grid">
                  {colorData.personalColor.bestColors.map((color, index) => (
                    <div key={index} className="recommendation-item">
                      <div 
                        className="recommendation-swatch"
                        style={{ backgroundColor: color }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="avoid-colors-section">
                <h2 className="section-title">Colors to Skip 🚫</h2>
                <div className="color-recommendation-grid">
                  {colorData.personalColor.avoidColors.map((color, index) => (
                    <div key={index} className="recommendation-item avoid">
                      <div 
                        className="recommendation-swatch avoid-swatch"
                        style={{ backgroundColor: color }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="inspiration-section">
            <h2 className="section-title">Style Inspo</h2>
            <div className="inspiration-tags">
              <span className="inspo-tag">aesthetic</span>
              <span className="inspo-tag">color theory</span>
              <span className="inspo-tag">fashion</span>
              <span className="inspo-tag">art</span>
              <span className="inspo-tag">design</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="share-button"
            onClick={shareResults}
          >
            📸 Save Results
          </button>
          <button 
            className="copy-button"
            onClick={copyToClipboard}
          >
            📋 Copy Text
          </button>
          <button 
            className="reset-button"
            onClick={onReset}
          >
            🔄 Try Another
          </button>
        </div>

        <div className="footer-text">
          <p>Share your vibe check with friends! 💕</p>
        </div>
      </div>
    </div>
  );
};

export default Results;