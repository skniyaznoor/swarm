"use client";

import React, { useState } from "react";
import { SwarmConfig, SwarmFormation, SwarmTelemetry } from "../types/swarm";
import {
  Boxes,
  Users,
  Grid3X3,
  Orbit,
  MousePointer2,
  Sparkles,
  Play,
  Pause,
  Sliders,
  Radio,
  Eye,
  Activity,
  Zap,
} from "lucide-react";

interface SwarmControlDeckProps {
  config: SwarmConfig;
  onChangeConfig: (updater: (prev: SwarmConfig) => SwarmConfig) => void;
  telemetry: SwarmTelemetry;
  onTriggerBurst: () => void;
}

export const SwarmControlDeck: React.FC<SwarmControlDeckProps> = ({
  config,
  onChangeConfig,
  telemetry,
  onTriggerBurst,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formations: Array<{
    id: SwarmFormation;
    label: string;
    icon: React.ReactNode;
    desc: string;
  }> = [
    {
      id: "boxes",
      label: "Box Formation",
      icon: <Boxes className="w-4 h-4 text-cyan-400" />,
      desc: "Cursors frame & trace bounding boxes around dashboard cards",
    },
    {
      id: "flock",
      label: "Murmuration",
      icon: <Users className="w-4 h-4 text-emerald-400" />,
      desc: "Organic Reynolds boids flocking across the screen",
    },
    {
      id: "matrix-grid",
      label: "Holo Grid",
      icon: <Grid3X3 className="w-4 h-4 text-purple-400" />,
      desc: "Structured geometric lattice with matrix lines",
    },
    {
      id: "vortex",
      label: "Cyclone Vortex",
      icon: <Orbit className="w-4 h-4 text-amber-400" />,
      desc: "Dual rotating orbital cyclones around stats",
    },
    {
      id: "mouse-magnet",
      label: "Follow My Mouse",
      icon: <MousePointer2 className="w-4 h-4 text-rose-400" />,
      desc: "Swarm converges on and orbits your actual cursor",
    },
    {
      id: "free-roam",
      label: "Free Roam",
      icon: <Sparkles className="w-4 h-4 text-sky-400" />,
      desc: "Autonomous telemetry browsing and live clicking",
    },
  ];

  return (
    <aside
      aria-label="Swarm Simulation Control Panel"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4 pointer-events-auto"
    >
      <div className="glass-panel-glow rounded-2xl p-3 border border-cyan-500/30 shadow-2xl backdrop-blur-xl">
        {/* Top summary bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Swarm Live Telemetry Pill */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
                  Swarm Engine
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {telemetry.activeCount} CURSORS
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {telemetry.fps} FPS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Mode: <span className="text-slate-200 capitalize font-medium">{config.formation.replace("-", " ")}</span> • Cohesion: {(telemetry.cohesionIndex * 100).toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Quick Formation Switcher Pills */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            {formations.map((f) => {
              const active = config.formation === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onChangeConfig((prev) => ({ ...prev, formation: f.id }))}
                  title={f.desc}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {f.icon}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Wave Burst Button */}
            <button
              onClick={onTriggerBurst}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-95 transition-transform"
              title="Send a kinetic shockwave through all 100+ cursors"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Click Wave</span>
            </button>

            {/* Pause / Play */}
            <button
              onClick={() => onChangeConfig((prev) => ({ ...prev, isPaused: !prev.isPaused }))}
              className={`p-2 rounded-lg border transition-colors ${
                config.isPaused
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white"
              }`}
              title={config.isPaused ? "Resume simulation" : "Pause simulation"}
              aria-label={config.isPaused ? "Resume simulation" : "Pause simulation"}
            >
              {config.isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            </button>

            {/* Expand Settings Drawer */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg border transition-colors ${
                isOpen
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                  : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white"
              }`}
              title="Open Swarm Configuration Parameters"
              aria-expanded={isOpen}
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown for formations */}
        <div className="md:hidden mt-2 flex flex-wrap gap-1">
          {formations.map((f) => {
            const active = config.formation === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onChangeConfig((prev) => ({ ...prev, formation: f.id }))}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] ${
                  active
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "text-slate-400 bg-slate-800/40"
                }`}
              >
                {f.icon}
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Expanded Controls Drawer */}
        {isOpen && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Cursor density selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span>Cursor Count</span>
                <span className="font-mono text-cyan-400 font-bold">{config.cursorCount} cursors</span>
              </div>
              <div className="flex gap-1.5">
                {[50, 100, 150, 200].map((count) => (
                  <button
                    key={count}
                    onClick={() => onChangeConfig((prev) => ({ ...prev, cursorCount: count }))}
                    className={`flex-1 py-1 px-2 rounded font-mono text-[11px] border transition-colors ${
                      config.cursorCount === count
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold"
                        : "bg-slate-800/40 text-slate-400 border-slate-700/60 hover:text-slate-200"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">
                Smooth 60 FPS Canvas vector pipeline with dynamic DPR scaling
              </p>
            </div>

            {/* Speed & Kinetics */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span>Simulation Speed</span>
                <span className="font-mono text-cyan-400 font-bold">{config.speed.toFixed(1)}x</span>
              </div>
              <div className="flex gap-1.5">
                {[0.5, 1.0, 1.5, 2.2].map((s) => (
                  <button
                    key={s}
                    onClick={() => onChangeConfig((prev) => ({ ...prev, speed: s }))}
                    className={`flex-1 py-1 px-2 rounded font-mono text-[11px] border transition-colors ${
                      config.speed === s
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold"
                        : "bg-slate-800/40 text-slate-400 border-slate-700/60 hover:text-slate-200"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">
                Adjusts particle acceleration, orbital radius velocity, and damping
              </p>
            </div>

            {/* Visual Overlays & Toggles */}
            <div className="space-y-1.5">
              <span className="text-slate-300 font-medium block">Visual Overlays</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => onChangeConfig((prev) => ({ ...prev, showLabels: !prev.showLabels }))}
                  className={`px-2 py-1 rounded text-[11px] border flex items-center justify-between ${
                    config.showLabels
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-slate-800/30 text-slate-500 border-slate-800"
                  }`}
                >
                  <span>User Badges</span>
                  <span className="font-mono text-[9px]">{config.showLabels ? "ON" : "OFF"}</span>
                </button>

                <button
                  onClick={() =>
                    onChangeConfig((prev) => ({ ...prev, showConnections: !prev.showConnections }))
                  }
                  className={`px-2 py-1 rounded text-[11px] border flex items-center justify-between ${
                    config.showConnections
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-slate-800/30 text-slate-500 border-slate-800"
                  }`}
                >
                  <span>Mesh Lines</span>
                  <span className="font-mono text-[9px]">{config.showConnections ? "ON" : "OFF"}</span>
                </button>

                <button
                  onClick={() => onChangeConfig((prev) => ({ ...prev, showTrails: !prev.showTrails }))}
                  className={`px-2 py-1 rounded text-[11px] border flex items-center justify-between ${
                    config.showTrails
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-slate-800/30 text-slate-500 border-slate-800"
                  }`}
                >
                  <span>Motion Trails</span>
                  <span className="font-mono text-[9px]">{config.showTrails ? "ON" : "OFF"}</span>
                </button>

                <button
                  onClick={() =>
                    onChangeConfig((prev) => ({ ...prev, showBoxOutlines: !prev.showBoxOutlines }))
                  }
                  className={`px-2 py-1 rounded text-[11px] border flex items-center justify-between ${
                    config.showBoxOutlines
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-slate-800/30 text-slate-500 border-slate-800"
                  }`}
                >
                  <span>Box Wireframe</span>
                  <span className="font-mono text-[9px]">{config.showBoxOutlines ? "ON" : "OFF"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

