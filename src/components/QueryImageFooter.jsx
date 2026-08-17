import React, { useRef } from 'react';
import { Upload, Activity } from 'lucide-react';
import { AudioEngine } from '../utils/audioEngine';

export default function QueryImageFooter({
  activeQuery,
  method,
  perplexity,
  neighbors,
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
    <footer className="query-footer-card">
      {/* Left Column: Query Image Information */}
      <div className="footer-left-col">
        <h3 className="footer-section-title">Query Image</h3>

        <div className="query-display-flex">
          {/* Query Image Thumbnail */}
          <div className="query-image-thumb-box">
            <img
              src={activeQuery?.thumb}
              alt={activeQuery?.filename || 'Query Image'}
              className="query-footer-img"
            />
          </div>

          {/* Query Image Metadata Details */}
          <div className="query-footer-meta">
            <div className="meta-item">
              <span className="meta-label">Image Name</span>
              <span className="meta-value filename-val">
                {activeQuery?.filename || 'mountain_lake_query.jpg'}
              </span>
            </div>

            <div className="meta-sub-row">
              <div className="meta-sub-item">
                <span className="meta-label">Image Size</span>
                <span className="meta-value">
                  {activeQuery?.width || 1024} × {activeQuery?.height || 768}
                </span>
              </div>

              <div className="meta-sub-item">
                <span className="meta-label">Source</span>
                <span className="meta-value">{activeQuery?.source || 'Upload'}</span>
              </div>
            </div>

            <button className="btn-change-query" onClick={handleChangeQueryClick}>
              <Upload size={13} />
              <span>Change Query</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      {/* Right Column: Current Visualization Parameters */}
      <div className="footer-right-col">
        <div className="viz-status-header">
          <Activity size={15} className="status-icon" />
          <h3 className="footer-section-title">Current Visualization</h3>
        </div>

        <div className="viz-meta-table">
          <div className="viz-meta-row">
            <span className="viz-prop-label">Method</span>
            <span className="viz-prop-value">{method}</span>
          </div>

          {method === 't-SNE' ? (
            <div className="viz-meta-row">
              <span className="viz-prop-label">Perplexity</span>
              <span className="viz-prop-value">{perplexity}</span>
            </div>
          ) : (
            <div className="viz-meta-row">
              <span className="viz-prop-label">Neighbors (k)</span>
              <span className="viz-prop-value">{neighbors}</span>
            </div>
          )}

          <div className="viz-meta-row">
            <span className="viz-prop-label">Random State</span>
            <span className="viz-prop-value">42</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
