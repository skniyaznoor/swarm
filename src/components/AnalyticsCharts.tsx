"use client";

import React, { useState, useRef, useEffect } from "react";
import { BoxTarget } from "../types/swarm";
import { Globe2, Activity, ArrowUpRight, Zap, ShieldCheck, Cpu } from "lucide-react";

interface AnalyticsChartsProps {
  onRegisterBox: (box: BoxTarget) => void;
  onUnregisterBox: (id: string) => void;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  onRegisterBox,
  onUnregisterBox,
}) => {
  const chartBoxRef = useRef<HTMLDivElement | null>(null);
  const geoBoxRef = useRef<HTMLDivElement | null>(null);

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Register the chart card and geo card as targets
  useEffect(() => {
    const updateBounds = () => {
      if (chartBoxRef.current) {
        const rect = chartBoxRef.current.getBoundingClientRect();
        onRegisterBox({
          id: "traffic-chart",
          title: "Real-time Telemetry Graph",
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        });
      }
      if (geoBoxRef.current) {
        const rect = geoBoxRef.current.getBoundingClientRect();
        onRegisterBox({
          id: "geo-distribution",
          title: "Edge Node Swarm Distribution",
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    window.addEventListener("scroll", updateBounds);

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds);
      onUnregisterBox("traffic-chart");
      onUnregisterBox("geo-distribution");
    };
  }, [onRegisterBox, onUnregisterBox]);

  // Telemetry time points (24 hours)
  const dataPoints = [
    { time: "00:00", cursors: 42, reqs: 410, latency: 14 },
    { time: "02:00", cursors: 38, reqs: 380, latency: 12 },
    { time: "04:00", cursors: 31, reqs: 320, latency: 11 },
    { time: "06:00", cursors: 49, reqs: 490, latency: 15 },
    { time: "08:00", cursors: 85, reqs: 820, latency: 22 },
    { time: "10:00", cursors: 112, reqs: 1180, latency: 26 },
    { time: "12:00", cursors: 128, reqs: 1340, latency: 29 },
    { time: "14:00", cursors: 145, reqs: 1520, latency: 31 },
    { time: "16:00", cursors: 134, reqs: 1410, latency: 27 },
    { time: "18:00", cursors: 118, reqs: 1250, latency: 24 },
    { time: "20:00", cursors: 96, reqs: 990, latency: 19 },
    { time: "22:00", cursors: 72, reqs: 750, latency: 16 },
  ];

  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;

  const maxCursors = 160;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  // Generate path
  const points = dataPoints.map((d, i) => {
    const x = paddingX + (i / (dataPoints.length - 1)) * chartW;
    const y = paddingY + chartH - (d.cursors / maxCursors) * chartH;
    return { x, y, ...d };
  });

  const pathD = `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`;
  const areaD = `${pathD} L ${points[points.length - 1].x},${paddingY + chartH} L ${points[0].x},${paddingY + chartH} Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Real-time Telemetry Graph */}
      <div
        ref={chartBoxRef}
        className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800/80 relative"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-base font-semibold text-white">
                Live Swarm Concurrency & Throughput
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time cursor clustering across 100+ simulated edge worker nodes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Swarm Density (100+ cursors)
            </span>
            <span className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Throughput (req/s)
            </span>
          </div>
        </div>

        {/* SVG Interactive Area Chart */}
        <div className="relative w-full aspect-[8/2.6] select-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = paddingY + chartH * pct;
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {Math.round(maxCursors * (1 - pct))}
                  </text>
                </g>
              );
            })}

            {/* Gradient Area Fill */}
            <path d={areaD} fill="url(#areaGradient)" />

            {/* Main Primary Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points & Interactive Hover targets */}
            {points.map((p, idx) => (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
              >
                {/* Background hover column hit zone */}
                <rect
                  x={p.x - 20}
                  y={paddingY}
                  width="40"
                  height={chartH}
                  fill="transparent"
                />

                {/* Vertical cursor guide */}
                {hoveredIdx === idx && (
                  <line
                    x1={p.x}
                    y1={paddingY}
                    x2={p.x}
                    y2={paddingY + chartH}
                    stroke="#00f0ff"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIdx === idx ? 6 : 3.5}
                  fill="#080a0f"
                  stroke="#00f0ff"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                />
              </g>
            ))}

            {/* X-axis labels */}
            {points.map((p, idx) => (
              <text
                key={idx}
                x={p.x}
                y={svgHeight - 6}
                textAnchor="middle"
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
              >
                {p.time}
              </text>
            ))}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredIdx !== null && (
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-full mb-3 glass-panel-glow px-3 py-2 rounded-xl text-xs z-30 shadow-xl border border-cyan-500/40"
              style={{
                left: `${((points[hoveredIdx].x) / svgWidth) * 100}%`,
                top: `${((points[hoveredIdx].y) / svgHeight) * 100}%`,
              }}
            >
              <div className="font-mono text-[10px] text-cyan-300 font-bold mb-1">
                {points[hoveredIdx].time} UTC
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-bold">
                  {points[hoveredIdx].cursors} Cursors
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-purple-300 font-bold">
                  {points[hoveredIdx].reqs} req/s
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Canvas 60 FPS Engine</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Drop Telemetry</span>
            </span>
          </div>
          <span className="text-cyan-400 font-mono text-[11px]">
            Peak: 145 Cursors Simultaneous
          </span>
        </div>
      </div>

      {/* Global Regional Distribution */}
      <div
        ref={geoBoxRef}
        className="glass-panel rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-semibold text-white">Edge Regions</h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              4 Clusters
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-5">
            Active cursor populations partitioned by low-latency server clusters
          </p>

          <div className="space-y-4">
            {[
              {
                region: "North America (US-East)",
                pct: 42,
                cursors: 48,
                latency: "14ms",
                color: "bg-cyan-400",
              },
              {
                region: "Europe (Frankfurt)",
                pct: 28,
                cursors: 32,
                latency: "22ms",
                color: "bg-purple-400",
              },
              {
                region: "Asia-Pacific (Tokyo)",
                pct: 22,
                cursors: 26,
                latency: "38ms",
                color: "bg-emerald-400",
              },
              {
                region: "South America (São Paulo)",
                pct: 8,
                cursors: 10,
                latency: "64ms",
                color: "bg-amber-400",
              },
            ].map((r, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-200">{r.region}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">{r.cursors} cursors</span>
                    <span className="text-cyan-400">{r.latency}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full ${r.color} transition-all duration-500`}
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Mesh Latency (P95)</span>
            <span className="font-mono font-bold text-emerald-400">18.4 ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

