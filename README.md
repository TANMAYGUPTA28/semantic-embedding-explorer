# 🚀 Semantic Image Retrieval & Vector Space Explorer

> An AI-powered **MERN Stack** (MongoDB Atlas Vector Search + Express + React 18 + Node.js) and **D3.js** high-dimensional embedding visualization platform.

[![Deploy to GitHub Pages](https://github.com/TANMAYGUPTA28/semantic-embedding-explorer/actions/workflows/deploy.yml/badge.svg)](https://github.com/TANMAYGUPTA28/semantic-embedding-explorer/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=flat&logo=vercel)](https://tanmaygupta28.github.io/semantic-embedding-explorer/)
[![Backend](https://img.shields.io/badge/MERN-Backend-blue?style=flat&logo=nodedotjs)](file:///server)

---

## 🌟 Full-Stack Architecture (MERN + Vector Search)

```
┌────────────────────────────────────────────────────────┐
│                   REACT 18 + D3 (M)                    │
│   • 1:1 Vector Space Manifold (t-SNE / UMAP)           │
│   • Holographic Query Deck & Drag-and-Drop Upload      │
│   • Top-K Retrieval Gallery & Telemetry HUD            │
└───────────────────────────▲────────────────────────────┘
                            │ REST API / Axios
┌───────────────────────────▼────────────────────────────┐
│               NODE.JS + EXPRESS (E & N)                │
│   • Vector Controller & Cosine Indexing                │
│   • Multer Multipart Image Processing                  │
│   • Express Routes: /api/retrieve, /api/ingest         │
└───────────────────────────▲────────────────────────────┘
                            │ MongoDB Vector Search Pipeline
┌───────────────────────────▼────────────────────────────┐
│               MONGODB ATLAS (M)                        │
│   • Mongoose ImageVector Documents (512-dim tensors)   │
│   • Native $vectorSearch HNSW Index (Cosine Similarity)│
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Key Components & Technologies

### 1. **Frontend (React 18 + D3.js + Vite)**
- **1:1 Dimensionality Reduction Manifold**: Interactive D3 scatter plot with Gold Star (`★`) query anchor, photon laser connectors, and cluster hulls.
- **Top-K Ranked Gallery**: 5-column responsive grid displaying photographic landscape results with Cosine Similarity confidence scores.
- **Upper Query Deck**: Real-time telemetry HUD with tensor dimensions (`512-DIM`), resolution, and drag-and-drop custom image encoder.
- **Audio Engine**: Futuristic Web Audio synthesizer with toggleable sound feedback (`SFX: ON/OFF`).

### 2. **Backend (Express + Node.js + MongoDB Vector Search)**
- **Location**: [`server/`](file:///server/)
- **MongoDB Atlas `$vectorSearch`**: HNSW index for sub-millisecond similarity search across thousands of images.
- **REST Endpoints**:
  - `GET /api/health` — Cluster status, device info, and indexed vector counts.
  - `POST /api/retrieve` — Sub-millisecond top-k nearest neighbor vector retrieval.
  - `POST /api/ingest` — Batch vector ingestion into MongoDB.
  - `GET /api/vectors` — Fetch all stored vector records.

---

## 🚀 Running the Full MERN Stack

### Step 1: Start the MERN Backend Server
```bash
cd server
npm install
npm start
```
*Server runs on `http://localhost:5000`*

### Step 2: Start the React Frontend
```bash
# In the root folder:
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 📜 License
MIT License © 2026 Tanmay Gupta
