import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import FlowingBackground from './components/FlowingBackground';
import QueryDeckTop from './components/QueryDeckTop';
import ConfigBar from './components/ConfigBar';
import EmbeddingPlot from './components/EmbeddingPlot';
import TopKGallery from './components/TopKGallery';
import AboutModal from './components/AboutModal';
import Tooltip from './components/Tooltip';
import { AudioEngine } from './utils/audioEngine';
import {
  buildDataset,
  computeTSNE,
  computeUMAP,
  l2dist,
  cosineSim,
  extractEmbeddingFromCanvas
} from './utils/mathEngine';

export default function App() {
  const [dataset, setDataset] = useState(() => buildDataset(160));
  const [embeddingModel, setEmbeddingModel] = useState('CLIP ViT-L/14');
  const [method, setMethod] = useState('t-SNE');
  const [perplexity, setPerplexity] = useState(30);
  const [neighbors, setNeighbors] = useState(15);
  const [topK, setTopK] = useState(10);
  const [queryId, setQueryId] = useState(null);
  const [isComputing, setIsComputing] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // 1. Current Active Query Image Node
  const activeQuery = useMemo(() => {
    return dataset.find((d) => d.id === queryId) || dataset[0];
  }, [dataset, queryId]);

  // 2. High-Performance FAISS Cosine Retrieval Engine
  const topKResults = useMemo(() => {
    if (!activeQuery) return [];
    const qVec = activeQuery.vector;
    const others = dataset.filter((d) => d.id !== activeQuery.id);

    const scored = others.map((item) => ({
      item,
      cos: cosineSim(qVec, item.vector),
      l2: l2dist(qVec, item.vector)
    }));

    // Rank by descending cosine similarity (highest score first)
    scored.sort((a, b) => b.cos - a.cos);

    return scored.slice(0, topK).map((res, idx) => ({
      ...res,
      rank: idx + 1
    }));
  }, [dataset, activeQuery, topK]);

  // 3. Dimensionality Reduction Projection Engine (t-SNE / UMAP)
  const runProjection = useCallback((currentDataset, currentMethod, pVal, nVal) => {
    setIsComputing(true);
    AudioEngine.playRecompute();

    // Defer computation slightly to allow React DOM repaint
    setTimeout(() => {
      let coords;
      if (currentMethod === 't-SNE') {
        coords = computeTSNE(currentDataset, pVal, 220);
      } else {
        coords = computeUMAP(currentDataset, nVal, 160);
      }

      const updated = currentDataset.map((item, idx) => ({
        ...item,
        pos: coords[idx] || [0, 0]
      }));

      setDataset(updated);
      setIsComputing(false);
    }, 40);
  }, []);

  // Initial Initialization
  useEffect(() => {
    const initialId = dataset[0]?.id;
    setQueryId(initialId);
    runProjection(dataset, method, perplexity, neighbors);
  }, []);

  // Set Query Node on Click (from plot or gallery)
  const handleSelectQuery = (id) => {
    AudioEngine.playQuerySelect();
    setQueryId(id);
  };

  // Recompute Visualization Button
  const handleUpdateVisualization = () => {
    runProjection(dataset, method, perplexity, neighbors);
  };

  // Reset to default
  const handleClearAll = () => {
    AudioEngine.beep(600, 'sine', 0.1, 0.08);
    setMethod('t-SNE');
    setPerplexity(30);
    setNeighbors(15);
    setTopK(10);
    setQueryId(dataset[0]?.id);
    runProjection(dataset, 't-SNE', 30, 15);
  };

  // Custom User Image Upload
  const handleUploadCustomQuery = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 96;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 128, 96);
        const vector = extractEmbeddingFromCanvas(canvas);

        const newId = `custom_${Date.now()}`;
        const newQueryNode = {
          id: newId,
          filename: file.name,
          category: 'User Upload',
          categoryIndex: 0,
          vector,
          thumb: canvas.toDataURL('image/jpeg', 0.9),
          width: img.naturalWidth || 1024,
          height: img.naturalHeight || 768,
          source: 'Upload',
          pos: [0, 0]
        };

        const filtered = dataset.filter((d) => !d.id.startsWith('custom_'));
        const merged = [newQueryNode, ...filtered];
        setDataset(merged);
        setQueryId(newId);
        runProjection(merged, method, perplexity, neighbors);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="app-container">
      {/* Interactive Ambient Fluid Background */}
      <FlowingBackground />

      {/* 1. Header with Audio & About Modal Controls */}
      <Header
        onOpenAbout={() => setIsAboutOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* 2. UPPER QUERY DASHBOARD DECK (Moved to Top as requested!) */}
      <QueryDeckTop
        activeQuery={activeQuery}
        method={method}
        perplexity={perplexity}
        neighbors={neighbors}
        embeddingModel={embeddingModel}
        onUploadCustomQuery={handleUploadCustomQuery}
      />

      {/* 3. Top Configuration Bar */}
      <ConfigBar
        embeddingModel={embeddingModel}
        setEmbeddingModel={setEmbeddingModel}
        method={method}
        setMethod={setMethod}
        perplexity={perplexity}
        setPerplexity={setPerplexity}
        neighbors={neighbors}
        setNeighbors={setNeighbors}
        topK={topK}
        setTopK={setTopK}
        isComputing={isComputing}
        onUpdateVisualization={handleUpdateVisualization}
        onClearAll={handleClearAll}
      />

      {/* 4. Middle Section: Embedding Visualization (1:1) + Top-K Gallery */}
      <main className="main-workspace-row">
        {/* Left Column: D3 2D Scatter Plot with Star Query & Sub-Legend */}
        <EmbeddingPlot
          dataset={dataset}
          activeQuery={activeQuery}
          topKResults={topKResults}
          method={method}
          onSelectQuery={handleSelectQuery}
          setTooltipData={setTooltipData}
          setTooltipPos={setTooltipPos}
        />

        {/* Right Column: Top-K Retrieved Images Grid */}
        <TopKGallery
          topKResults={topKResults}
          topKCount={topK}
          onSelectQuery={handleSelectQuery}
        />
      </main>

      {/* 5. Floating Hover Inspector Tooltip */}
      <Tooltip tooltipData={tooltipData} tooltipPos={tooltipPos} />

      {/* 6. Senior Dev Interview & Architecture Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
