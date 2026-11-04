"use client";

import React, { useState, useCallback } from "react";
import { BoxTarget, SwarmConfig, SwarmTelemetry } from "../types/swarm";
import { MetricsHeader } from "./MetricsHeader";
import { MetricCard } from "./MetricCard";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { LiveSessionTable } from "./LiveSessionTable";
import { LiveEventStream } from "./LiveEventStream";
import { SwarmCanvas } from "./SwarmCanvas";
import { SwarmControlDeck } from "./SwarmControlDeck";

export const AnalyticsDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>("24h");
  const [burstTimestamp, setBurstTimestamp] = useState<number>(0);

  // Swarm configuration
  const [config, setConfig] = useState<SwarmConfig>({
    cursorCount: 100, // Nearly 100+ cursors as requested!
    formation: "boxes", // Starts in box pattern formation!
    speed: 1.0,
    showLabels: true,
    showTrails: true,
    showConnections: true,
    showBoxOutlines: true,
    isPaused: false,
  });

  // Telemetry reported from canvas
  const [telemetry, setTelemetry] = useState<SwarmTelemetry>({
    fps: 60,
    activeCount: 100,
    cohesionIndex: 0.94,
    totalClicks: 1420,
    currentFormation: "boxes",
    spatialNodes: 6,
  });

  // Registered HTML bounding box targets
  const [boxes, setBoxes] = useState<BoxTarget[]>([]);

  const handleRegisterBox = useCallback((box: BoxTarget) => {
    setBoxes((prev) => {
      const filtered = prev.filter((b) => b.id !== box.id);
      return [...filtered, box];
    });
  }, []);

  const handleUnregisterBox = useCallback((id: string) => {
    setBoxes((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleTriggerBurst = useCallback(() => {
    setBurstTimestamp(Date.now());
  }, []);

  const handleTelemetryUpdate = useCallback((t: SwarmTelemetry) => {
    setTelemetry(t);
  }, []);

  const handleRefresh = useCallback(() => {
    handleTriggerBurst();
  }, [handleTriggerBurst]);

  return (
    <div className="relative min-h-screen bg-[#06080e] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 pb-28">
      {/* Dynamic Background Grid Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Decorative ambient radial glows */}
      <div
        className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* 100+ Cursors Swarm Canvas Layer */}
      <SwarmCanvas
        config={config}
        boxes={boxes}
        onTelemetryUpdate={handleTelemetryUpdate}
        triggerBurstTimestamp={burstTimestamp}
      />

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header & Controls */}
        <MetricsHeader
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          activeCursorsCount={config.cursorCount}
          onRefresh={handleRefresh}
        />

        {/* Top 4 Metrics Cards Grid */}
        <section aria-label="Key Performance Indicators" className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <MetricCard
              id="active-swarms"
              title="Active Swarm Concurrency"
              value={`${config.cursorCount}+`}
              change="+28.4%"
              trend="up"
              description="Live synchronized cursor agents"
              chartData={[45, 52, 60, 78, 92, 110, 128, 142]}
              color="#00f0ff"
              onRegisterBox={handleRegisterBox}
              onUnregisterBox={handleUnregisterBox}
            />

            <MetricCard
              id="conversion-rate"
              title="Global Conversion Rate"
              value="4.82%"
              change="+0.64%"
              trend="up"
              description="User journey completion speed"
              chartData={[3.9, 4.1, 4.2, 4.4, 4.3, 4.6, 4.7, 4.82]}
              color="#10b981"
              onRegisterBox={handleRegisterBox}
              onUnregisterBox={handleUnregisterBox}
            />

            <MetricCard
              id="mesh-latency"
              title="P95 Mesh Latency"
              value="18.4ms"
              change="-2.1ms"
              trend="down"
              description="Roundtrip node synchronization"
              chartData={[24, 23, 21, 20, 22, 19, 18.8, 18.4]}
              color="#a855f7"
              onRegisterBox={handleRegisterBox}
              onUnregisterBox={handleUnregisterBox}
            />

            <MetricCard
              id="revenue-velocity"
              title="Platform Gross Volume"
              value="$42,890"
              change="+14.2%"
              trend="up"
              description="Realtime processed event value"
              chartData={[32000, 34500, 36000, 38200, 39500, 41000, 42890]}
              color="#f59e0b"
              onRegisterBox={handleRegisterBox}
              onUnregisterBox={handleUnregisterBox}
            />
          </div>
        </section>

        {/* Charts & Edge Clusters */}
        <section aria-label="Telemetry and Regional Distribution" className="mb-8">
          <AnalyticsCharts
            onRegisterBox={handleRegisterBox}
            onUnregisterBox={handleUnregisterBox}
          />
        </section>

        {/* Accessible Responsive Live Session Directory */}
        <section aria-label="Live Cursor Sessions" className="mb-8">
          <LiveSessionTable
            onRegisterBox={handleRegisterBox}
            onUnregisterBox={handleUnregisterBox}
          />
        </section>

        {/* Live Swarm Event Stream */}
        <section aria-label="Real-time Event Stream">
          <LiveEventStream />
        </section>
      </main>

      {/* Floating Interactive Swarm Controller Deck */}
      <SwarmControlDeck
        config={config}
        onChangeConfig={setConfig}
        telemetry={telemetry}
        onTriggerBurst={handleTriggerBurst}
      />
    </div>
  );
};

