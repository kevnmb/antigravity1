import React from 'react';

export default function LoadingIndicator() {
  return (
    <div className="loading-container glass-panel">
      <div className="visualizer">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <p className="loading-text">Composing your masterpiece...</p>
    </div>
  );
}
