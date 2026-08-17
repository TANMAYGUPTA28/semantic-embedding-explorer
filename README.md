# 🚀 Semantic Image Retrieval & Vector Space Explorer

> An interactive, high-performance **Frontend Engineering & Data Visualization** platform built with **React 18**, **D3.js**, **Web Audio API**, and **t-SNE / UMAP** dimensionality reduction.

[![Deploy to GitHub Pages](https://github.com/TANMAYGUPTA28/semantic-embedding-explorer/actions/workflows/deploy.yml/badge.svg)](https://github.com/TANMAYGUPTA28/semantic-embedding-explorer/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=flat&logo=vercel)](https://tanmaygupta28.github.io/semantic-embedding-explorer/)

---

## 🌟 Key Frontend & UI/UX Features

- **⚛️ React 18 Modular Architecture**: Pure functional component hierarchy with reactive state management, custom hooks, and 60fps physics-eased transitions.
- **📊 1:1 Aspect Ratio Embedding Manifold (D3.js)**:
  - ⭐️ **Active Query Anchor** highlighted with animated Gold Star and dual expanding pulse ripples.
  - 🟣 **Top-K Nearest Neighbors** dynamically marked with vibrant purple luminescence and flowing photonic laser connectors.
  - 🔵 **Corpus Cluster Nodes** with interactive D3 zoom, pan, reset view, and SVG export.
- **🖼️ Top-K Retrieved Gallery ($K=10$)**:
  - Ranked image cards with circular purple badges, high-fidelity nature landscape photos, and real-time Cosine Similarity confidence scores (`Score: 0.9934`).
  - Click any card to instantly re-center the manifold and promote that node to the active seed query.
- **🌌 Upper Query Dashboard & Telemetry HUD**:
  - Live readout of active tensor dimensions (`512-DIM`), image resolution ($1024 \times 768$), and encoder parameters.
  - Drag-and-drop file dropzone for uploading real custom images and generating on-the-fly embeddings.
- **🔬 Client-Side Dimensionality Reduction**:
  - Dynamic **t-SNE** (with Perplexity slider $5 \to 50$) and **UMAP** (with Nearest Neighbors $k$ slider $5 \to 50$).
  - Decoupled projection calculations that preserve metric distance without altering fundamental nearest-neighbor rankings.
- **🔊 Web Audio API Sound Synthesizer**:
  - Futuristic audio feedback for query selections, hover blips, and manifold updates with a toggleable `SFX: ON/OFF` switch.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, JSX, Vite 5
- **Styling**: Vanilla CSS3 (Custom Glassmorphism, Fluid Keyframe Animations & CSS Variables)
- **Data Visualization**: D3.js v7 (Scales, Zoom/Pan Transforms, Quadtree, Polygon Convex Hulls)
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API (Oscillator & Gain synthesis)
- **Algorithms**: Barnes-Hut t-SNE, Uniform Manifold Approximation (UMAP), Cosine Metric, Euclidean $L_2$ Distance

---

## 🚀 Local Setup & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TANMAYGUPTA28/semantic-embedding-explorer.git
   cd semantic-embedding-explorer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📜 License
MIT License © 2026 Tanmay Gupta
