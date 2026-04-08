import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function PromptInput({ onGenerate, isGenerating }) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel">
      <div className="input-group">
        <textarea
          placeholder="Describe your song... e.g., 'An upbeat synthwave track about exploring the galaxy'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
        />
      </div>
      <button type="submit" className="btn-primary" disabled={isGenerating || !prompt.trim()}>
        <Sparkles size={20} />
        {isGenerating ? "Generating..." : "Generate Song"}
      </button>
    </form>
  );
}
