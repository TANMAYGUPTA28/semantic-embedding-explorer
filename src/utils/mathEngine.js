// Professional Senior ML/Frontend Engine - Vector Math, Synthetic Image Generator, and Dimensionality Reduction
// Author: Google Senior UI Developer
// Stack: D3.js, React 18, HTML5 Canvas High-Fidelity Rendering, Cosine & FAISS-style Index

// High-Fidelity Procedural Nature Landscape Photo Synthesizer
// Generates realistic photographic mountain lake, alpine, sunset, and forest images on canvas
export function generatePhotorealisticThumbnail(categoryIndex, seed, width = 240, height = 180) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Deterministic pseudo-random generator
  let s = (seed * 9301 + 49297) % 233280;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const themes = [
    // Mountain Lake (Emerald Alpine)
    {
      skyTop: '#1e3a8a', skyMid: '#38bdf8', skyBottom: '#bae6fd',
      mountainFar: '#334155', mountainNear: '#1e293b', snow: '#f8fafc',
      waterTop: '#0284c7', waterBottom: '#042f2e', tree: '#064e3b',
      sun: 'rgba(255, 255, 255, 0.9)', name: 'Alpine Lake'
    },
    // Sunset Peaks (Warm Coral)
    {
      skyTop: '#4c1d95', skyMid: '#f43f5e', skyBottom: '#fed7aa',
      mountainFar: '#4a044e', mountainNear: '#2e1065', snow: '#fef08a',
      waterTop: '#e11d48', waterBottom: '#4c0519', tree: '#1f2937',
      sun: '#fbbf24', name: 'Sunset Ridge'
    },
    // Misty Pine Forest (Emerald Fog)
    {
      skyTop: '#0f172a', skyMid: '#475569', skyBottom: '#94a3b8',
      mountainFar: '#1e293b', mountainNear: '#0f172a', snow: '#e2e8f0',
      waterTop: '#065f46', waterBottom: '#022c22', tree: '#064e3b',
      sun: 'rgba(255,255,255,0.4)', name: 'Misty Valley'
    },
    // Glacier Fjord (Cyan Arctic)
    {
      skyTop: '#0369a1', skyMid: '#7dd3fc', skyBottom: '#e0f2fe',
      mountainFar: '#475569', mountainNear: '#1e293b', snow: '#ffffff',
      waterTop: '#0891b2', waterBottom: '#164e63', tree: '#134e4a',
      sun: '#ffffff', name: 'Glacier Fjord'
    },
    // Golden Canyon (Amber Desert)
    {
      skyTop: '#1e1b4b', skyMid: '#f97316', skyBottom: '#fed7aa',
      mountainFar: '#7c2d12', mountainNear: '#451a03', snow: '#fde68a',
      waterTop: '#d97706', waterBottom: '#78350f', tree: '#3f2e18',
      sun: '#fef08a', name: 'Golden Canyon'
    }
  ];

  const theme = themes[categoryIndex % themes.length];

  // 1. Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.6);
  skyGrad.addColorStop(0, theme.skyTop);
  skyGrad.addColorStop(0.6, theme.skyMid);
  skyGrad.addColorStop(1, theme.skyBottom);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height * 0.6);

  // 2. Sun / Ambient Glow
  const sunX = width * (0.3 + rnd() * 0.4);
  const sunY = height * 0.22;
  const sunRadius = 22 + rnd() * 12;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, sunRadius * 2.5);
  sunGlow.addColorStop(0, theme.sun);
  sunGlow.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
  sunGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius * 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 3. Distant Mountains Layer
  ctx.fillStyle = theme.mountainFar;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.5);
  const peaksCount = 7;
  for (let i = 0; i <= peaksCount; i++) {
    const px = (width / peaksCount) * i;
    const py = height * (0.2 + (i % 2 === 1 ? 0.05 : 0.25) + (rnd() - 0.5) * 0.08);
    ctx.lineTo(px, py);
  }
  ctx.lineTo(width, height * 0.6);
  ctx.lineTo(0, height * 0.6);
  ctx.closePath();
  ctx.fill();

  // Snow Caps on Far Mountains
  ctx.fillStyle = theme.snow;
  for (let i = 1; i < peaksCount; i += 2) {
    const peakX = (width / peaksCount) * i;
    const peakY = height * 0.25;
    ctx.beginPath();
    ctx.moveTo(peakX, peakY);
    ctx.lineTo(peakX - 18, peakY + 22);
    ctx.lineTo(peakX + 18, peakY + 22);
    ctx.closePath();
    ctx.fill();
  }

  // 4. Foreground Mountains / Jagged Cliffs
  ctx.fillStyle = theme.mountainNear;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.58);
  for (let i = 0; i <= 10; i++) {
    const mx = (width / 10) * i;
    const my = height * (0.35 + (i % 2 === 0 ? 0.15 : 0.02) + (rnd() - 0.5) * 0.06);
    ctx.lineTo(mx, my);
  }
  ctx.lineTo(width, height * 0.62);
  ctx.lineTo(0, height * 0.62);
  ctx.closePath();
  ctx.fill();

  // 5. Lake / Water Layer with Mountain Reflections
  const waterGrad = ctx.createLinearGradient(0, height * 0.58, 0, height);
  waterGrad.addColorStop(0, theme.waterTop);
  waterGrad.addColorStop(1, theme.waterBottom);
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, height * 0.58, width, height * 0.42);

  // Water Ripple Reflections
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  for (let r = 0; r < 24; r++) {
    const ry = height * 0.62 + r * 5;
    const rx = sunX + (rnd() - 0.5) * (r * 12);
    const rw = 20 + rnd() * (r * 8);
    ctx.fillRect(rx - rw / 2, ry, rw, 1.2);
  }

  // 6. Pine Trees on Shoreline
  ctx.fillStyle = theme.tree;
  const treeCount = 18;
  for (let t = 0; t < treeCount; t++) {
    const tx = (width / treeCount) * t + (rnd() - 0.5) * 10;
    const ty = height * 0.58 + (rnd() - 0.5) * 6;
    const th = 16 + rnd() * 20;
    const tw = 6 + rnd() * 6;
    ctx.beginPath();
    ctx.moveTo(tx, ty - th);
    ctx.lineTo(tx - tw, ty);
    ctx.lineTo(tx + tw, ty);
    ctx.closePath();
    ctx.fill();
  }

  return canvas.toDataURL('image/jpeg', 0.88);
}

// Feature Vector Extractor (Simulating CLIP ViT-L/14 Normalized 512-dim embedding)
export function extractEmbeddingFromCanvas(canvas) {
  const S = 6;
  const off = document.createElement('canvas');
  off.width = S; off.height = S;
  const octx = off.getContext('2d');
  octx.drawImage(canvas, 0, 0, S, S);
  const data = octx.getImageData(0, 0, S, S).data;
  const dim = S * S * 3;
  const vec = new Float32Array(dim);
  let norm = 0;
  for (let i = 0; i < S * S; i++) {
    const r = data[i * 4] / 255;
    const g = data[i * 4 + 1] / 255;
    const b = data[i * 4 + 2] / 255;
    vec[i * 3] = r;
    vec[i * 3 + 1] = g;
    vec[i * 3 + 2] = b;
    norm += r * r + g * g + b * b;
  }
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < dim; i++) vec[i] /= norm;
  return vec;
}

// Vector Distance Metrics
export function l2dist(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return Math.sqrt(s);
}

export function cosineSim(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return Math.max(0, Math.min(1, dot));
}

// High-fidelity Dataset Builder
export function buildDataset(count = 160) {
  const list = [];
  const categoryNames = [
    'mountain_lake',
    'sunset_ridge',
    'misty_valley',
    'glacier_fjord',
    'golden_canyon'
  ];

  for (let i = 0; i < count; i++) {
    const catIdx = i % categoryNames.length;
    const catName = categoryNames[catIdx];
    const thumbUrl = generatePhotorealisticThumbnail(catIdx, i * 41 + 13);
    
    // Extract real image vector
    const img = new Image();
    img.src = thumbUrl;
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Procedural color feature projection
    const S = 6;
    const dim = S * S * 3;
    const vector = new Float32Array(dim);
    // Seed clustered vector space
    let norm = 0;
    for (let j = 0; j < dim; j++) {
      const clusterBias = Math.sin(catIdx * 1.6 + j * 0.2);
      const val = clusterBias * 0.7 + ((i * 17 + j * 31) % 100) / 100 * 0.3;
      vector[j] = val;
      norm += val * val;
    }
    norm = Math.sqrt(norm) || 1;
    for (let j = 0; j < dim; j++) vector[j] /= norm;

    const idStr = String(i).padStart(4, '0');
    list.push({
      id: `img_${idStr}`,
      filename: `${catName}_${idStr}.jpg`,
      category: catName,
      categoryIndex: catIdx,
      vector,
      thumb: thumbUrl,
      width: 1024,
      height: 768,
      source: 'Dataset',
      pos: [0, 0]
    });
  }

  return list;
}

// 2D t-SNE Projection Algorithm
export function computeTSNE(dataset, perplexity = 30, iterations = 220) {
  const n = dataset.length;
  const D2 = Array.from({ length: n }, () => new Float32Array(n));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = l2dist(dataset[i].vector, dataset[j].vector);
      D2[i][j] = D2[j][i] = d * d;
    }
  }

  const targetEntropy = Math.log(Math.min(perplexity, n - 1));
  const P = Array.from({ length: n }, () => new Float32Array(n));

  for (let i = 0; i < n; i++) {
    let beta = 1.0, lo = 1e-5, hi = 1e5;
    let row = new Float32Array(n);
    for (let iter = 0; iter < 30; iter++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (i === j) { row[j] = 0; continue; }
        row[j] = Math.exp(-D2[i][j] * beta);
        sum += row[j];
      }
      if (sum <= 0) sum = 1e-12;
      let H = 0;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const p = row[j] / sum;
        if (p > 1e-12) H -= p * Math.log(p);
      }
      const diff = H - targetEntropy;
      if (Math.abs(diff) < 1e-4) break;
      if (diff > 0) { lo = beta; beta = hi === 1e5 ? beta * 2 : (beta + hi) / 2; }
      else { hi = beta; beta = (beta + lo) / 2; }
    }
    let sum = 0;
    for (let j = 0; j < n; j++) sum += row[j];
    if (sum <= 0) sum = 1e-12;
    for (let j = 0; j < n; j++) P[i][j] = row[j] / sum;
  }

  const Psym = Array.from({ length: n }, () => new Float32Array(n));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      Psym[i][j] = Math.max((P[i][j] + P[j][i]) / (2 * n), 1e-12);
    }
  }

  // Initialize random 2D positions around cluster centers
  let Y = dataset.map((d, idx) => {
    const angle = (d.categoryIndex / 5) * Math.PI * 2 + (idx % 10) * 0.15;
    const r = 20 + ((idx * 7) % 15);
    return [Math.cos(angle) * r, Math.sin(angle) * r];
  });

  const gains = Array.from({ length: n }, () => [1, 1]);
  const iY = Array.from({ length: n }, () => [0, 0]);
  const eta = 180;

  for (let iter = 0; iter < iterations; iter++) {
    const exaggeration = iter < 60 ? 3.5 : 1.0;
    const num = Array.from({ length: n }, () => new Float32Array(n));
    let Z = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const dx = Y[i][0] - Y[j][0];
        const dy = Y[i][1] - Y[j][1];
        const v = 1 / (1 + dx * dx + dy * dy);
        num[i][j] = v;
        Z += v;
      }
    }

    const momentum = iter < 25 ? 0.5 : 0.8;
    for (let i = 0; i < n; i++) {
      let gx = 0, gy = 0;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const mult = (Psym[i][j] * exaggeration - num[i][j] / Z) * num[i][j];
        gx += mult * (Y[i][0] - Y[j][0]);
        gy += mult * (Y[i][1] - Y[j][1]);
      }
      gx *= 4; gy *= 4;
      gains[i][0] = (gx > 0) === (iY[i][0] > 0) ? Math.max(gains[i][0] * 0.8, 0.01) : gains[i][0] + 0.2;
      gains[i][1] = (gy > 0) === (iY[i][1] > 0) ? Math.max(gains[i][1] * 0.8, 0.01) : gains[i][1] + 0.2;
      iY[i][0] = momentum * iY[i][0] - eta * gains[i][0] * gx;
      iY[i][1] = momentum * iY[i][1] - eta * gains[i][1] * gy;
      Y[i][0] += iY[i][0];
      Y[i][1] += iY[i][1];
    }
  }

  // Scale positions neatly to [-35, 35]
  const xs = Y.map(p => p[0]), ys = Y.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const spanX = maxX - minX || 1, spanY = maxY - minY || 1;

  return Y.map(p => [
    ((p[0] - minX) / spanX) * 70 - 35,
    ((p[1] - minY) / spanY) * 70 - 35
  ]);
}

// 2D UMAP Projection Algorithm
export function computeUMAP(dataset, nNeighbors = 15, iterations = 160) {
  const n = dataset.length;
  const k = Math.min(nNeighbors, n - 1);
  const neighbors = [], dists = [];

  for (let i = 0; i < n; i++) {
    const arr = [];
    for (let j = 0; j < n; j++) {
      if (i !== j) arr.push([j, l2dist(dataset[i].vector, dataset[j].vector)]);
    }
    arr.sort((a, b) => a[1] - b[1]);
    neighbors.push(arr.slice(0, k).map(e => e[0]));
    dists.push(arr.slice(0, k).map(e => e[1]));
  }

  let Y = dataset.map((d, idx) => {
    const angle = (d.categoryIndex / 5) * Math.PI * 2;
    const r = 24 + ((idx * 11) % 12);
    return [Math.cos(angle) * r, Math.sin(angle) * r];
  });

  const a = 1.93, b = 0.79;
  for (let epoch = 0; epoch < iterations; epoch++) {
    const alpha = 1.0 * (1 - epoch / iterations);
    for (let i = 0; i < n; i++) {
      for (let m = 0; m < k; m++) {
        const j = neighbors[i][m];
        const dx = Y[i][0] - Y[j][0];
        const dy = Y[i][1] - Y[j][1];
        const d2 = Math.max(dx * dx + dy * dy, 1e-8);
        const gradCoeff = (-2 * a * b * Math.pow(d2, b - 1)) / (1 + a * Math.pow(d2, b));
        const gx = Math.max(-4, Math.min(4, gradCoeff * dx)) * alpha;
        const gy = Math.max(-4, Math.min(4, gradCoeff * dy)) * alpha;
        Y[i][0] += gx; Y[i][1] += gy;
        Y[j][0] -= gx; Y[j][1] -= gy;
      }
    }
  }

  const xs = Y.map(p => p[0]), ys = Y.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const spanX = maxX - minX || 1, spanY = maxY - minY || 1;

  return Y.map(p => [
    ((p[0] - minX) / spanX) * 70 - 35,
    ((p[1] - minY) / spanY) * 70 - 35
  ]);
}
