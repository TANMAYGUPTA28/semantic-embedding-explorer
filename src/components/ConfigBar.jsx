import React from 'react';
import { Sliders, RefreshCw, Trash2, Info, Sparkles, Activity } from 'lucide-react';

export default function ConfigBar({
  embeddingModel,
  setEmbeddingModel,
  method,
  setMethod,
  perplexity,
  setPerplexity,
  neighbors,
  setNeighbors,
  topK,
  setTopK,
  isComputing,
  onUpdateVisualization,
  onClearAll
}) {
  return (
    <section className="config-card">
      <div className="config-header-row">
        <div className="config-title-badge">
          <Sliders size={14} />
          <span>Configuration</span>
        </div>
      </div>

      <div className="config-controls-grid">
        {/* 1. Embedding Model Selector */}
        <div className="control-group">
          <label className="control-label">Embedding Model</label>
          <div className="select-wrapper">
            <Sparkles size={14} className="select-icon" />
            <select
              className="ui-select"
              value={embeddingModel}
              onChange={(e) => setEmbeddingModel(e.target.value)}
            >
              <option value="CLIP ViT-L/14">CLIP ViT-L/14</option>
              <option value="ResNet-50">ResNet-50</option>
              <option value="DINOv2">DINOv2 ViT-B/14</option>
              <option value="EfficientNet-B7">EfficientNet-B7</option>
            </select>
          </div>
        </div>

        {/* 2. Visualization Method */}
        <div className="control-group">
          <label className="control-label">Visualization</label>
          <div className="select-wrapper">
            <Activity size={14} className="select-icon" />
            <select
              className="ui-select"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="t-SNE">t-SNE</option>
              <option value="UMAP">UMAP</option>
            </select>
          </div>
        </div>

        {/* 3. Dynamic Method Parameter */}
        {method === 't-SNE' ? (
          <div className="control-group">
            <div className="label-with-info">
              <label className="control-label">t-SNE Parameter</label>
              <span className="info-icon" title="Perplexity balances attention between local and global aspects of your data.">
                <Info size={12} />
              </span>
            </div>
            <div className="slider-row">
              <span className="slider-sublabel">Perplexity</span>
              <span className="range-min">5</span>
              <input
                type="range"
                className="ui-slider"
                min="5"
                max="50"
                step="1"
                value={perplexity}
                onChange={(e) => setPerplexity(+e.target.value)}
              />
              <span className="range-max">50</span>
              <span className="value-box">{perplexity}</span>
            </div>
          </div>
        ) : (
          <div className="control-group">
            <div className="label-with-info">
              <label className="control-label">UMAP Parameter</label>
              <span className="info-icon" title="Number of nearest neighbors controls how UMAP balances local versus global structure.">
                <Info size={12} />
              </span>
            </div>
            <div className="slider-row">
              <span className="slider-sublabel">Number of Neighbors</span>
              <span className="range-min">5</span>
              <input
                type="range"
                className="ui-slider"
                min="5"
                max="50"
                step="1"
                value={neighbors}
                onChange={(e) => setNeighbors(+e.target.value)}
              />
              <span className="range-max">50</span>
              <span className="value-box">{neighbors}</span>
            </div>
          </div>
        )}

        {/* 4. Top-K Selector */}
        <div className="control-group topk-group">
          <label className="control-label">Top K</label>
          <select
            className="ui-select topk-select"
            value={topK}
            onChange={(e) => setTopK(+e.target.value)}
          >
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="10">10</option>
            <option value="12">12</option>
            <option value="15">15</option>
          </select>
        </div>

        {/* 5. Action Buttons */}
        <div className="action-buttons-group">
          <button
            className="btn-update-viz"
            disabled={isComputing}
            onClick={onUpdateVisualization}
          >
            <RefreshCw size={15} className={isComputing ? 'spin-anim' : ''} />
            <span>{isComputing ? 'Computing...' : 'Update Visualization'}</span>
          </button>

          <button className="btn-clear-all" onClick={onClearAll} title="Reset to initial query and default settings">
            <Trash2 size={15} />
            <span>Clear All</span>
          </button>
        </div>
      </div>
    </section>
  );
}
