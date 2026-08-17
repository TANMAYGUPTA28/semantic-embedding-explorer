import React from 'react';
import { Upload, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function QueryDeck({ activeQuery, onFileUpload }) {
  return (
    <section className="query-deck hyper-glass">
      <div className="hologram-avatar-wrap">
        <div className="hologram-ring"></div>
        <span className="hologram-badge">ACTIVE QUERY</span>
        <img
          className="hologram-img"
          src={activeQuery?.thumb}
          alt={activeQuery?.filename || 'Query Node'}
        />
      </div>

      <div className="query-meta-details">
        <div className="query-tagline">
          <Sparkles size={13} />
          <span>SEED EMBEDDING VECTOR #{activeQuery?.id}</span>
          <span>• 108-DIM TENSOR</span>
        </div>
        <div className="query-title">
          {activeQuery?.filename || 'Loading vector...'}
        </div>
        <div className="query-subdesc">
          Domain category <strong>{activeQuery?.category}</strong>. Click any node in the scatter coordinate field or top-ranked sidebar to relocate the anchor.
        </div>
      </div>

      <label
        className="dropzone-trigger"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('dragover');
        }}
        onDragLeave={(e) => e.currentTarget.classList.remove('dragover')}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('dragover');
          if (e.dataTransfer.files?.[0]) onFileUpload(e.dataTransfer.files[0]);
        }}
      >
        <Upload size={22} />
        <span>Upload Custom Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFileUpload(e.target.files?.[0])}
        />
      </label>
    </section>
  );
}
