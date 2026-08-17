import React, { useRef } from 'react';
import { Upload, Sparkles, Activity, Image as ImageIcon, Cpu, Zap } from 'lucide-react';
import { AudioEngine } from '../utils/audioEngine';

export default function QueryDeckTop({
  activeQuery,
  method,
  perplexity,
  neighbors,
  embeddingModel,
  onUploadCustomQuery
}) {
  const fileInputRef = useRef(null);

  const handleChangeQueryClick = () => {
    AudioEngine.beep(800, 'sine', 0.08, 0.08);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadCustomQuery(file);
    }
  };

  return (
    <section className="query-deck-top hyper-glass">
      {/* Left: Active Query Image Preview & Details */}
      <div className="query-left-section">
        <div className="query-hologram-wrap">
          <div className="hologram-ring-glow"></div>
          <span className="query-badge-tag">ACTIVE QUERY</span>
          <img
            src={activeQuery?.thumb}
            alt={activeQuery?.filename || 'Query Image'}
            className="query-hero-thumb"
          />
        </div>

        <div className="query-hero-meta">
          <div className="query-tagline-row">
            <Sparkles size={13} className="sparkle-gold" />
            <span className="tagline-text">SEED EMBEDDING VECTOR #{activeQuery?.id}</span>
            <span className="tagline-badge">512-DIM TENSOR</span>
          </div>

          <h2 className="query-hero-title">{activeQuery?.filename || 'mountain_lake_query.jpg'}</h2>

          <div className="query-specs-row">
            <div className="spec-pill">
              <span className="spec-label">Resolution:</span>
              <span className="spec-val">{activeQuery?.width || 1024} × {activeQuery?.height || 768}</span>
            </div>
            <div className="spec-pill">
              <span className="spec-label">Category:</span>
              <span className="spec-val category-highlight">{activeQuery?.category || 'Alpine Lake'}</span>
            </div>
            <div className="spec-pill">
              <span className="spec-label">Source:</span>
              <span className="spec-val">{activeQuery?.source || 'Dataset'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Quick Upload Dropzone */}
      <div
        className="query-dropzone-box"
        onClick={handleChangeQueryClick}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('dragover');
        }}
        onDragLeave={(e) => e.currentTarget.classList.remove('dragover')}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('dragover');
          if (e.dataTransfer.files?.[0]) onUploadCustomQuery(e.dataTransfer.files[0]);
        }}
        title="Click or drag and drop an image to extract embeddings"
      >
        <Upload size={20} className="upload-cloud-icon" />
        <div className="upload-text-group">
          <span className="upload-primary-text">Upload New Query</span>
          <span className="upload-sub-text">Drag & drop or browse</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {/* Right: Real-time Telemetry Dashboard */}
      <div className="query-telemetry-hud">
        <div className="hud-title-row">
          <Activity size={14} className="hud-icon" />
          <span className="hud-title">LIVE MODEL TELEMETRY</span>
        </div>

        <div className="telemetry-grid">
          <div className="telemetry-item">
            <span className="tel-label">Encoder Model</span>
            <span className="tel-value text-purple">{embeddingModel}</span>
          </div>
          <div className="telemetry-item">
            <span className="tel-label">2D Manifold</span>
            <span className="tel-value text-cyan">
              {method} ({method === 't-SNE' ? `Perp: ${perplexity}` : `k: ${neighbors}`})
            </span>
          </div>
          <div className="telemetry-item">
            <span className="tel-label">FAISS Latency</span>
            <span className="tel-value text-emerald">0.82 ms</span>
          </div>
          <div className="telemetry-item">
            <span className="tel-label">Random Seed</span>
            <span className="tel-value">42</span>
          </div>
        </div>
      </div>
    </section>
  );
}
