import React from 'react';
import { RefreshCw, Sliders } from 'lucide-react';
import { AudioEngine } from '../utils/audioEngine';

export default function ControlBar({
  method,
  setMethod,
  perplexity,
  setPerplexity,
  neighbors,
  setNeighbors,
  topKCount,
  setTopKCount,
  isComputing,
  onRecompute
}) {
  return (
    <section className="controls-deck hyper-glass">
      <div className="control-item">
        <span className="control-label">Projection Method:</span>
        <select
          className="quantum-select"
          value={method}
          onChange={(e) => {
            AudioEngine.playToggle();
            setMethod(e.target.value);
          }}
        >
          <option value="tsne">t-SNE (Stochastic Neighbor)</option>
          <option value="umap">UMAP (Uniform Manifold)</option>
        </select>
      </div>

      {method === 'tsne' ? (
        <div className="control-item">
          <span className="control-label">Perplexity:</span>
          <input
            type="range"
            className="quantum-slider"
            min="5"
            max="50"
            step="1"
            value={perplexity}
            onChange={(e) => setPerplexity(+e.target.value)}
          />
          <span className="slider-val-badge">{perplexity}</span>
        </div>
      ) : (
        <div className="control-item">
          <span className="control-label">Neighbors (k):</span>
          <input
            type="range"
            className="quantum-slider"
            min="3"
            max="40"
            step="1"
            value={neighbors}
            onChange={(e) => setNeighbors(+e.target.value)}
          />
          <span className="slider-val-badge">{neighbors}</span>
        </div>
      )}

      <div className="control-item">
        <span className="control-label">Top-K Depth:</span>
        <input
          type="range"
          className="quantum-slider"
          min="3"
          max="15"
          step="1"
          value={topKCount}
          onChange={(e) => setTopKCount(+e.target.value)}
        />
        <span className="slider-val-badge">{topKCount}</span>
      </div>

      <button
        className="btn-hyper btn-hyper-primary"
        disabled={isComputing}
        onClick={onRecompute}
      >
        <RefreshCw size={15} className={isComputing ? 'spinning-icon' : ''} />
        <span>{isComputing ? 'PROJECTING...' : 'UPDATE MANIFOLD'}</span>
      </button>
    </section>
  );
}
