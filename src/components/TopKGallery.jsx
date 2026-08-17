import React from 'react';
import { Lightbulb, Layers } from 'lucide-react';
import { AudioEngine } from '../utils/audioEngine';

export default function TopKGallery({ topKResults, topKCount, onSelectQuery }) {
  return (
    <div className="gallery-card-panel">
      {/* Header */}
      <div className="panel-top-bar">
        <div className="panel-title-with-info">
          <Layers size={16} className="panel-icon" />
          <h2 className="panel-title">Top-K Retrieved Images (K = {topKCount})</h2>
        </div>
      </div>

      {/* Grid of Retrieved Image Cards */}
      <div className="retrieved-grid-container">
        {topKResults.map((res) => (
          <div
            key={res.item.id}
            className="image-card-node"
            onClick={() => {
              AudioEngine.playQuerySelect();
              onSelectQuery(res.item.id);
            }}
            title={`Click to set ${res.item.filename} as query`}
          >
            {/* Purple Rank Badge */}
            <div className="rank-badge-bubble">
              {res.rank}
            </div>

            {/* Realistic Landscape Photo */}
            <div className="card-img-wrapper">
              <img src={res.item.thumb} alt={res.item.filename} className="card-thumb-photo" />
            </div>

            {/* Score Pill Footer */}
            <div className="card-score-pill">
              Score: {res.cos.toFixed(4)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Hint */}
      <div className="gallery-bottom-hint">
        <Lightbulb size={14} className="hint-bulb-icon" />
        <span>Click on any image to view details and locate it in the embedding space.</span>
      </div>
    </div>
  );
}
