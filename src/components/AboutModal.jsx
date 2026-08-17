import React from 'react';
import { X, Cpu, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="about-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-flex">
            <Cpu size={20} className="modal-icon" />
            <h2>System Architecture & Technical Implementation</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-content-body">
          <div className="architecture-badge-row">
            <span className="tech-badge">React 18</span>
            <span className="tech-badge">D3.js v7</span>
            <span className="tech-badge">CLIP ViT-L/14</span>
            <span className="tech-badge">FAISS Cosine Index</span>
            <span className="tech-badge">Barnes-Hut t-SNE</span>
            <span className="tech-badge">UMAP Manifold</span>
          </div>

          <section className="modal-section">
            <h3>🎯 Problem Statement & Core Objective</h3>
            <p>
              In large-scale computer vision and multimodal retrieval pipelines (e.g. Google Visual Search, Pinterest Lens, CLIP), high-dimensional embedding vectors ($d \in [512, 768]$) cannot be directly visually debugged or interpreted by engineers and users. This interactive platform visualizes the semantic manifold in real-time, projects high-dimensional embeddings down to 2D with metric preservation, and enables intuitive multi-nearest-neighbor exploration.
            </p>
          </section>

          <section className="modal-section">
            <h3>🔬 Mathematical Pipeline</h3>
            <ul className="math-feature-list">
              <li>
                <CheckCircle2 size={16} className="check-icon" />
                <div>
                  <strong>Embedding Representation:</strong> Images are mapped into $L_2$-normalized feature vectors $\mathbf{x} \in \mathbb{R}^d$ where cosine similarity equals the dot product $\cos(\theta) = \mathbf{u} \cdot \mathbf{v}$.
                </div>
              </li>
              <li>
                <CheckCircle2 size={16} className="check-icon" />
                <div>
                  <strong>t-SNE Projection:</strong> Calculates pairwise conditional Gaussian probabilities $p_{j|i}$ in high-dim space using entropy-driven binary search for target perplexity $\sigma_i$, matched with Student-$t$ distribution $q_{ij}$ in 2D space minimizing Kullback-Leibler divergence $\mathrm{KL}(P \parallel Q)$.
                </div>
              </li>
              <li>
                <CheckCircle2 size={16} className="check-icon" />
                <div>
                  <strong>UMAP Projection:</strong> Models local Riemannian manifold topology with fuzzy simplicial sets and optimizes 2D coordinates via cross-entropy stochastic gradient descent.
                </div>
              </li>
            </ul>
          </section>

          <section className="modal-section">
            <h3>⚡ Interview Talking Points</h3>
            <p>
              • <strong>State Decoupling:</strong> Query selection runs FAISS $O(N)$ dot product retrieval in $\approx 0.8\text{ms}$ synchronously, while t-SNE / UMAP dimensional projection executes in a non-blocking background web cycle.
              <br />
              • <strong>Coordinate Stability:</strong> Parameter changes in t-SNE / UMAP re-calculate 2D manifold positions without mutating the fundamental high-dimensional nearest neighbor ranking.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
