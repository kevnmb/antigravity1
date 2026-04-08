import React, { useState } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import LoadingIndicator from './components/LoadingIndicator';
import AudioPlayer from './components/AudioPlayer';
import ToastNotification from './components/ToastNotification';

function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [songData, setSongData] = useState(null);
  const [toast, setToast] = useState(null);

  const handleGenerate = async (prompt) => {
    setIsGenerating(true);
    setSongData(null);
    setToast(null);

    try {
      const resp = await fetch('/api/generateSong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${resp.status}`);
      }

      const data = await resp.json();
      
      // Suno API wrapper might return the actual track or an array
      setSongData(data);
      setToast({ message: 'Song generated successfully!', type: 'success' });
      
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Failed to generate song. Please try again.', type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="bg-gradient"></div>
      <div className="container">
        <Header />
        <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
        
        {isGenerating && <LoadingIndicator />}
        
        {songData && !isGenerating && (
          <AudioPlayer songData={songData} />
        )}
      </div>

      {toast && (
        <div className="toast-container">
          <ToastNotification 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        </div>
      )}
    </>
  );
}

export default App;
