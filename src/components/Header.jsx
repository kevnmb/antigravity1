import React from 'react';
import { Music } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <h1><Music size={40} color="var(--primary)" /> Suno AI Generator</h1>
      <p>Transform your ideas into full tracks instantly.</p>
    </header>
  );
}
