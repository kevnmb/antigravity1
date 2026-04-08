import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, Music, Download } from 'lucide-react';

export default function AudioPlayer({ songData }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const updateProgress = () => {
    const audio = audioRef.current;
    if (audio.duration) {
      const percentage = (audio.currentTime / audio.duration) * 100;
      setProgress(percentage);
      setCurrentTime(formatTime(audio.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio.duration) {
      setDuration(formatTime(audio.duration));
    }
  };

  const handleSeek = (e) => {
    const bar = e.currentTarget;
    const clickX = e.nativeEvent.offsetX;
    const newTime = (clickX / bar.offsetWidth) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Extract from probable response structure
  // Some wrappers return array `data`, some return single object.
  const info = Array.isArray(songData) ? songData[0] : songData?.data?.[0] || songData?.data || songData;
  const audioUrl = info?.audio_url || info?.audioUrl || info?.streamAudioUrl || info?.stream_audio_url;
  const imageUrl = info?.image_url || info?.imageUrl;
  const title = info?.title || "Generated Track";
  const tags = info?.tags || "";

  if (!audioUrl) {
    return (
      <div className="audio-player-wrapper">
         <div className="glass-panel audio-player-glass" style={{textAlign: 'center'}}>
            <p>Processing complete, but no audio URL was returned. (API may still be generating in the background).</p>
         </div>
      </div>
    );
  }

  return (
    <div className="audio-player-wrapper">
      <div className="glass-panel audio-player-glass">
        <div className="track-info">
          {imageUrl ? (
            <img src={imageUrl} alt="Album Art" className="album-art" />
          ) : (
             <div className="album-art-placeholder">
               <Music color="white" size={32} />
             </div>
          )}
          <div className="track-details">
            <h3>{title}</h3>
            <p>{tags}</p>
          </div>
          <a href={audioUrl} download target="_blank" rel="noreferrer" className="control-btn" style={{marginLeft: 'auto'}} title="Download">
            <Download size={20} />
          </a>
        </div>
        
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onTimeUpdate={updateProgress}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="custom-controls">
          <button className="control-btn play-btn" onClick={togglePlay}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} style={{marginLeft: '4px'}}/>}
          </button>
          
          <div className="progress-container">
            <span>{currentTime}</span>
            <div className="progress-bar-bg" onClick={handleSeek}>
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span>{duration}</span>
          </div>
          
          <button className="control-btn" title="Volume">
            <Volume2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
