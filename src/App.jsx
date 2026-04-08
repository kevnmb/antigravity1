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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${resp.status}`);
      }

      const initialData = await resp.json();
      const taskId = initialData?.data?.taskId;

      // If the provider returned the song immediately instead
      if (!taskId) {
        setSongData(initialData);
        setToast({ message: 'Song generated successfully!', type: 'success' });
        setIsGenerating(false);
        return;
      }

      setToast({ message: 'Request accepted! Composing your song (usually takes ~30 seconds)...', type: 'success' });

      // The provider uses an async background task. Let's poll for the result.
      const pollInterval = setInterval(async () => {
        try {
          const statusResp = await fetch(`/api/checkStatus?taskId=${taskId}`);
          if (!statusResp.ok) return; // ignore temporary network errors
          
          const statusData = await statusResp.json();
          const currentState = statusData?.data?.status;

          if (currentState === 'SUCCESS') {
            clearInterval(pollInterval);
            setIsGenerating(false);
            
            // Extract the actual generated track metadata
            const trackList = statusData.data.response?.sunoData;
            setSongData(trackList);
            setToast({ message: 'Masterpiece completed!', type: 'success' });
            
          } else if (currentState && currentState.includes('FAILED') || currentState === 'SENSITIVE_WORD_ERROR') {
            clearInterval(pollInterval);
            setIsGenerating(false);
            setToast({ message: `Generation Failed: ${currentState}`, type: 'error' });
          }
          // If PENDING, TEXT_SUCCESS, FIRST_SUCCESS -> keep polling
        } catch (pollErr) {
          console.error("Polling error:", pollErr);
        }
      }, 5000); // Check every 5 seconds so we don't spam their API

    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Failed to request song. Please try again.', type: 'error' });
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
