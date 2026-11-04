"use client";

import React, { useRef, useEffect } from "react";
import { BoxTarget } from "../types/swarm";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  description: string;
  chartData: number[];
  color: string;
  onRegisterBox: (box: BoxTarget) => void;
  onUnregisterBox: (id: string) => void;
  activeCursorsCount?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  change,
  trend,
  description,
  chartData,
  color,
  onRegisterBox,
  onUnregisterBox,
  activeCursorsCount = 0,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Measure and register bounding box
  useEffect(() => {
    const updateBounds = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      onRegisterBox({
        id,
        title,
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
        color,
        activeCursorsCount,
      });
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    window.addEventListener("scroll", updateBounds);

    const observer = new ResizeObserver(updateBounds);
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds);
      observer.disconnect();
      onUnregisterBox(id);
    };
  }, [id, title, color, activeCursorsCount, onRegisterBox, onUnregisterBox]);

  // Generate SVG sparkline path
  const minVal = Math.min(...chartData);
  const maxVal = Math.max(...chartData);
  const range = maxVal - minVal || 1;
  const svgWidth = 120;
  const svgHeight = 38;

  const points = chartData.map((val, idx) => {
    const px = (idx / (chartData.length - 1)) * svgWidth;
    const py = svgHeight - ((val - minVal) / range) * (svgHeight - 10) - 5;
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  });

  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

  return (
    <div
      ref={cardRef}
      className="glass-panel relative rounded-2xl p-5 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 group overflow-hidden"
    >
      {/* Background glow accent */}
      <div
        className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition-opacity"
        style={{ backgroundColor: color }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
              trend === "up"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : trend === "down"
                ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                : "bg-slate-500/15 text-slate-400 border border-slate-500/30"
            }`}
          >
            {trend === "up" && <TrendingUp className="w-3 h-3" />}
            {trend === "down" && <TrendingDown className="w-3 h-3" />}
            {trend === "neutral" && <Minus className="w-3 h-3" />}
            {change}
          </span>
        </div>
      </div>

      {/* Main value and Sparkline */}
      <div className="flex items-baseline justify-between gap-4 mt-1">
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
            {value}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
        </div>

        {/* Mini Sparkline Chart */}
        <div className="relative w-[120px] h-[38px] flex-shrink-0">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={color} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#grad-${id})`} />
            <path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Pulsing endpoint */}
            {points.length > 0 && (
              <circle
                cx={points[points.length - 1].split(",")[0]}
                cy={points[points.length - 1].split(",")[1]}
                r="3"
                fill={color}
                className="animate-ping"
              />
            )}
          </svg>
        </div>
      </div>

      {/* Card Footer with Swarm Lock indicator */}
      <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span>Swarm Anchor: #{id}</span>
        </span>
        <span className="text-cyan-400/80 font-medium group-hover:text-cyan-300">
          Trace Box ↗
        </span>
      </div>
    </div>
  );
};

