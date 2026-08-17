import React from 'react';

export default function Tooltip({ tooltipData, tooltipPos }) {
  if (!tooltipData) return null;

  const { isQuery, filename, score, category, thumb } = tooltipData;

  return (
    <div
      className="floating-inspector-tooltip"
      style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
    >
      <div className="tooltip-inner-flex">
        <img src={thumb} alt="" className="tooltip-preview-img" />
        <div className="tooltip-info-col">
          {isQuery ? (
            <span className="tooltip-tag query-tag">⭐ QUERY IMAGE</span>
          ) : score ? (
            <span className="tooltip-tag rank-tag">★ RANK #{score.rank}</span>
          ) : (
            <span className="tooltip-tag corpus-tag">DATASET IMAGE</span>
          )}

          <div className="tooltip-filename">{filename}</div>

          {score ? (
            <div className="tooltip-metrics">
              <span className="metric-item">Similarity: <b>{score.cos.toFixed(4)}</b></span>
              <span className="metric-item">L2 Dist: <b>{score.l2.toFixed(4)}</b></span>
            </div>
          ) : (
            <div className="tooltip-metrics">
              <span className="metric-item">Domain: <b>{category}</b></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
