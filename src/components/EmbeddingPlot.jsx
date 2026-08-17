import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RotateCcw, Download, Info } from 'lucide-react';
import { AudioEngine } from '../utils/audioEngine';

export default function EmbeddingPlot({
  dataset,
  activeQuery,
  topKResults,
  method,
  onSelectQuery,
  setTooltipData,
  setTooltipPos
}) {
  const svgRef = useRef(null);
  const zoomBehaviorRef = useRef(null);
  const prevPointsRef = useRef(new Map());

  const topKIdSet = new Set(topKResults.map((r) => r.item.id));
  const scoreLookup = new Map();
  topKResults.forEach((r) => scoreLookup.set(r.item.id, r));

  // Reset Camera Viewport with smooth 700ms cubic-out transition
  const handleResetView = () => {
    AudioEngine.beep(720, 'sine', 0.08, 0.08);
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(700)
        .ease(d3.easeCubicOut)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  // Export SVG / PNG
  const handleExportSVG = () => {
    AudioEngine.beep(900, 'sine', 0.1, 0.1);
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `embedding_${method.toLowerCase()}_visualization.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // D3 Rendering Pipeline with Smooth Interpolation
  useEffect(() => {
    if (!svgRef.current || dataset.length === 0) return;

    const svg = d3.select(svgRef.current);
    const VB = 600;
    const margin = { top: 25, right: 30, bottom: 45, left: 45 };
    const width = VB - margin.left - margin.right;
    const height = VB - margin.top - margin.bottom;

    svg.selectAll('*').remove();

    const defs = svg.append('defs');

    // Soft Glow filter
    const filter = defs.append('filter').attr('id', 'point-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', 3.5).attr('result', 'blur');
    const merge = filter.append('feMerge');
    merge.append('feMergeNode').attr('in', 'blur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Clipping path
    defs.append('clipPath').attr('id', 'plot-window')
      .append('rect').attr('width', width).attr('height', height);

    const rootG = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Standard -45 to +45 domain scales
    const xScale = d3.scaleLinear().domain([-45, 45]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-45, 45]).range([height, 0]);

    // Gridlines
    const makeXGrid = () => d3.axisBottom(xScale).ticks(5);
    const makeYGrid = () => d3.axisLeft(yScale).ticks(5);

    const gridG = rootG.append('g').attr('class', 'grid-lines');
    gridG.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(makeXGrid().tickSize(-height).tickFormat(''));

    gridG.append('g')
      .attr('class', 'grid')
      .call(makeYGrid().tickSize(-width).tickFormat(''));

    // Clip wrapper for zoom canvas
    const clipG = rootG.append('g').attr('clip-path', 'url(#plot-window)');
    const zoomG = clipG.append('g').attr('class', 'zoom-canvas');

    const connectorLayer = zoomG.append('g').attr('class', 'connector-layer');
    const pulseLayer = zoomG.append('g').attr('class', 'pulse-layer');
    const pointLayer = zoomG.append('g').attr('class', 'point-layer');

    // Axes
    const xAxisG = rootG.append('g').attr('class', 'axis x-axis').attr('transform', `translate(0,${height})`);
    const yAxisG = rootG.append('g').attr('class', 'axis y-axis');

    // Axis Titles
    rootG.append('text')
      .attr('class', 'axis-title-text')
      .attr('x', width / 2)
      .attr('y', height + 36)
      .attr('text-anchor', 'middle')
      .text('Dimension 1');

    rootG.append('text')
      .attr('class', 'axis-title-text')
      .attr('transform', `translate(-32, ${height / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text('Dimension 2');

    // 1. Flowing Animated Connectors to Top-K results
    if (activeQuery) {
      const qx = xScale(activeQuery.pos[0]);
      const qy = yScale(activeQuery.pos[1]);
      const topKNodes = dataset.filter((d) => topKIdSet.has(d.id));

      const lines = connectorLayer.selectAll('line.link-beam')
        .data(topKNodes, (d) => d.id);

      lines.enter()
        .append('line')
        .attr('class', 'link-beam flowing-laser-beam')
        .attr('x1', qx)
        .attr('y1', qy)
        .attr('x2', qx)
        .attr('y2', qy)
        .attr('stroke', '#c084fc')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5, 4')
        .attr('opacity', 0)
        .transition()
        .duration(650)
        .ease(d3.easeCubicOut)
        .attr('x2', (d) => xScale(d.pos[0]))
        .attr('y2', (d) => yScale(d.pos[1]))
        .attr('opacity', 0.65);
    }

    // 2. Render Scatter Dots with Silky Smooth Easing Transitions
    const nonQueryPoints = dataset.filter((d) => d.id !== activeQuery?.id);

    const dots = pointLayer.selectAll('circle.data-dot')
      .data(nonQueryPoints, (d) => d.id);

    // Enter selection
    const dotsEnter = dots.enter()
      .append('circle')
      .attr('class', 'data-dot')
      .attr('cx', (d) => {
        const prev = prevPointsRef.current.get(d.id);
        return prev ? prev[0] : xScale(d.pos[0]);
      })
      .attr('cy', (d) => {
        const prev = prevPointsRef.current.get(d.id);
        return prev ? prev[1] : yScale(d.pos[1]);
      })
      .attr('r', 0)
      .attr('fill', (d) => (topKIdSet.has(d.id) ? '#c084fc' : '#3b82f6'))
      .attr('stroke', (d) => (topKIdSet.has(d.id) ? '#d946ef' : '#1d4ed8'))
      .attr('stroke-width', (d) => (topKIdSet.has(d.id) ? 1.6 : 0.8))
      .attr('opacity', (d) => (topKIdSet.has(d.id) ? 0.95 : 0.75))
      .style('cursor', 'pointer');

    // Smooth Spring Glide Transition
    dots.merge(dotsEnter)
      .transition()
      .duration(750)
      .ease(d3.easeCubicInOut)
      .attr('cx', (d) => xScale(d.pos[0]))
      .attr('cy', (d) => yScale(d.pos[1]))
      .attr('r', (d) => (topKIdSet.has(d.id) ? 5.8 : 3.8))
      .attr('fill', (d) => (topKIdSet.has(d.id) ? '#c084fc' : '#3b82f6'))
      .attr('stroke', (d) => (topKIdSet.has(d.id) ? '#d946ef' : '#1d4ed8'))
      .attr('stroke-width', (d) => (topKIdSet.has(d.id) ? 1.6 : 0.8));

    dots.exit().remove();

    // Event listeners
    pointLayer.selectAll('circle.data-dot')
      .on('mouseenter', (event, d) => {
        AudioEngine.playHover();
        const score = scoreLookup.get(d.id);
        setTooltipData({ ...d, score });
        setTooltipPos({ x: event.clientX + 16, y: event.clientY + 16 });
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .ease(d3.easeBackOut)
          .attr('r', 8.5)
          .attr('stroke', '#10b981')
          .attr('stroke-width', 2.8);
      })
      .on('mousemove', (event) => {
        setTooltipPos({ x: event.clientX + 16, y: event.clientY + 16 });
      })
      .on('mouseleave', (event, d) => {
        setTooltipData(null);
        d3.select(event.currentTarget)
          .transition()
          .duration(250)
          .ease(d3.easeCubicOut)
          .attr('r', topKIdSet.has(d.id) ? 5.8 : 3.8)
          .attr('stroke', topKIdSet.has(d.id) ? '#d946ef' : '#1d4ed8')
          .attr('stroke-width', topKIdSet.has(d.id) ? 1.6 : 0.8);
      })
      .on('click', (event, d) => {
        onSelectQuery(d.id);
      });

    // 3. Render Query Image as Smooth Gold Star (⭐) with Expanding Soft Ripples
    if (activeQuery) {
      const qx = xScale(activeQuery.pos[0]);
      const qy = yScale(activeQuery.pos[1]);

      // Double Expanding Ripple Ring Wave
      for (let w = 0; w < 2; w++) {
        const ripple = pulseLayer.append('circle')
          .attr('cx', qx)
          .attr('cy', qy)
          .attr('r', 8)
          .attr('fill', 'none')
          .attr('stroke', '#fbbf24')
          .attr('stroke-width', 1.8)
          .attr('opacity', 0.8);

        ripple.transition()
          .delay(w * 220)
          .duration(1200)
          .ease(d3.easeCubicOut)
          .attr('r', 32)
          .attr('opacity', 0)
          .attr('stroke-width', 0.4)
          .on('end', function () {
            d3.select(this).remove();
          });
      }

      // Smooth Star Symbol
      const starSymbol = d3.symbol().type(d3.symbolStar).size(200);
      const starNode = pointLayer.append('path')
        .attr('class', 'active-query-star-node')
        .attr('d', starSymbol)
        .attr('transform', `translate(${qx},${qy}) scale(0)`)
        .attr('fill', '#fbbf24')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.8)
        .attr('filter', 'url(#point-glow)')
        .style('cursor', 'pointer');

      starNode.transition()
        .duration(450)
        .ease(d3.easeBackOut)
        .attr('transform', `translate(${qx},${qy}) scale(1)`);

      starNode
        .on('mouseenter', (event) => {
          AudioEngine.playHover();
          setTooltipData({ ...activeQuery, isQuery: true });
          setTooltipPos({ x: event.clientX + 16, y: event.clientY + 16 });
        })
        .on('mousemove', (event) => {
          setTooltipPos({ x: event.clientX + 16, y: event.clientY + 16 });
        })
        .on('mouseleave', () => setTooltipData(null));
    }

    // Cache positions for smooth morphing on next render
    dataset.forEach((d) => {
      prevPointsRef.current.set(d.id, [xScale(d.pos[0]), yScale(d.pos[1])]);
    });

    // Zoom and Pan Handlers
    const zoom = d3.zoom()
      .scaleExtent([0.6, 20])
      .on('zoom', (event) => {
        zoomG.attr('transform', event.transform);
        xAxisG.call(d3.axisBottom(event.transform.rescaleX(xScale)).ticks(5));
        yAxisG.call(d3.axisLeft(event.transform.rescaleY(yScale)).ticks(5));
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Initial Axes call
    xAxisG.call(d3.axisBottom(xScale).ticks(5));
    yAxisG.call(d3.axisLeft(yScale).ticks(5));
  }, [dataset, activeQuery, topKResults, method]);

  return (
    <div className="viz-card-panel">
      {/* Plot Header Bar */}
      <div className="panel-top-bar">
        <div className="panel-title-with-info">
          <h2 className="panel-title">Embedding Visualization ({method})</h2>
          <span className="info-badge" title="2D manifold projection computed via t-SNE / UMAP. Click any point to select as new query.">
            <Info size={13} />
          </span>
        </div>

        <div className="panel-actions">
          <button className="btn-panel-action" onClick={handleResetView} title="Reset Zoom & Pan">
            <RotateCcw size={13} />
            <span>Reset View</span>
          </button>
          <button className="btn-panel-action" onClick={handleExportSVG} title="Download SVG Chart">
            <Download size={13} />
          </button>
        </div>
      </div>

      {/* Plot Square Body with Embedded Legend */}
      <div className="plot-container-relative">
        <div className="svg-aspect-square">
          <svg ref={svgRef} id="main-embedding-svg" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" />
        </div>

        {/* Legend Box Overlay */}
        <div className="plot-legend-box">
          <div className="legend-row">
            <span className="legend-star">★</span>
            <span className="legend-label">Query Image</span>
          </div>
          <div className="legend-row">
            <span className="legend-dot dot-purple"></span>
            <span className="legend-label">Top-K Results</span>
          </div>
          <div className="legend-row">
            <span className="legend-dot dot-blue"></span>
            <span className="legend-label">Other Images</span>
          </div>
          <div className="legend-row">
            <span className="legend-dot dot-emerald"></span>
            <span className="legend-label">Selected Image</span>
          </div>
        </div>
      </div>

      <p className="plot-footer-caption">
        Each point represents one image embedding projected into 2D space using {method}.
      </p>
    </div>
  );
}
