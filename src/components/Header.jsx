import React from 'react';
import { Camera, HelpCircle, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { AudioEngine } from '../utils/audioEngine';

export default function Header({ onOpenAbout, soundEnabled, setSoundEnabled }) {
  return (
    <header className="explorer-header">
      <div className="header-brand">
        <div className="brand-logo-icon">
          <Camera size={22} className="logo-camera" />
        </div>
        <div className="brand-titles">
          <h1 className="main-title">Semantic Image Retrieval Explorer</h1>
          <p className="sub-title">Explore embeddings, visualize patterns, and find similar images</p>
        </div>
      </div>

      <div className="header-right-actions">
        {/* Sound Feedback Toggle */}
        <button
          className={`sound-toggle-chip ${soundEnabled ? 'active' : ''}`}
          onClick={() => {
            AudioEngine.enabled = !soundEnabled;
            setSoundEnabled(!soundEnabled);
          }}
          title="Toggle interactive audio synthesizer feedback"
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          <span>SFX: {soundEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* About Architecture Modal */}
        <button className="about-btn" onClick={onOpenAbout} title="Architecture & Technical Documentation">
          <HelpCircle size={16} />
          <span>About</span>
        </button>
      </div>
    </header>
  );
}
