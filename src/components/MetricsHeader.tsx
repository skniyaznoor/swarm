"use client";

import React from "react";
import { Sparkles, Terminal, Activity, Layers, Download, RefreshCw } from "lucide-react";

interface MetricsHeaderProps {
  timeframe: string;
  setTimeframe: (tf: string) => void;
  activeCursorsCount: number;
  onRefresh: () => void;
}

export const MetricsHeader: React.FC<MetricsHeaderProps> = ({
  timeframe,
  setTimeframe,
  activeCursorsCount,
  onRefresh,
}) => {
  return (
    <header className="mb-8">
      {/* Top Banner announcement */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>LIVE SWARM NETWORK</span>
          </div>
          <span className="text-slate-500 text-xs hidden sm:inline">•</span>
          <span className="text-slate-400 text-xs hidden sm:inline">
            Autonomous multi-agent cursor coordination demo
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>UPTIME: 99.99%</span>
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:flex items-center gap-1.5 text-cyan-300">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>100+ ACTIVE CURSORS</span>
          </span>
        </div>
      </div>

      {/* Main Title and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Swarm<span className="text-cyan-400">Analytics</span>
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
              v2.4 NEXT.JS
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Real-time telemetry and stats platform swarmed by 100+ simulated multiplayer cursors
            forming geometric boxes, murmuration patterns, and synchronized scanning lattices.
          </p>
        </div>

        {/* Timeframe Filter & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {["15m", "1h", "24h", "7d"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeframe === tf
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Sync Metrics"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>
      </div>
    </header>
  );
};

