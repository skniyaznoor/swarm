"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Shield, Zap, Sparkles } from "lucide-react";
import { SWARM_COLORS } from "../utils/swarmGenerator";

interface SwarmLogItem {
  id: string;
  time: string;
  user: string;
  action: string;
  tag: string;
  color: string;
}

const INITIAL_LOGS: SwarmLogItem[] = [
  {
    id: "l-1",
    time: "15:24:02",
    user: "Aria Chen",
    action: "Aligned perimeter vertex on Metric #ActiveSwarms",
    tag: "BOX_PATROL",
    color: "#00f0ff",
  },
  {
    id: "l-2",
    time: "15:24:01",
    user: "Kenji Sato",
    action: "Swarmed Asia-East node cluster (26 cursors)",
    tag: "CLUSTER",
    color: "#10b981",
  },
  {
    id: "l-3",
    time: "15:23:59",
    user: "Dev-042",
    action: "Executed telemetry query for P95 latency (18.4ms)",
    tag: "QUERY",
    color: "#f59e0b",
  },
  {
    id: "l-4",
    time: "15:23:57",
    user: "Elena Rostova",
    action: "Synchronized with murmuration wave vector #7",
    tag: "FLOCK",
    color: "#a855f7",
  },
];

const RANDOM_ACTIONS = [
  { action: "Formed tight bounding box perimeter on Traffic Chart", tag: "BOX_LOCK" },
  { action: "Dispatched click ripple on Revenue Metric ($42,890)", tag: "CLICK" },
  { action: "Traversing left vertical border of Regional Nodes", tag: "TRACE" },
  { action: "Entered orbital cyclone formation around focal stats", tag: "VORTEX" },
  { action: "Attracted to real user mouse coordinate", tag: "MAGNET" },
  { action: "Generated synthetic load test beacon across Edge CDN", tag: "LOAD_TEST" },
];

const USERS = [
  "Nova-7", "Lucas Silva", "Zoe Vance", "Mateo Rossi", "Sora Kim",
  "Nadia Al-Mansoor", "Felix Weber", "Chloe Dubois", "Tariq Vance", "Axel Finch"
];

export const LiveEventStream: React.FC = () => {
  const [logs, setLogs] = useState<SwarmLogItem[]>(INITIAL_LOGS);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const randomUser = USERS[Math.floor(Math.random() * USERS.length)];
      const randomAct = RANDOM_ACTIONS[Math.floor(Math.random() * RANDOM_ACTIONS.length)];
      const randomColor = SWARM_COLORS[Math.floor(Math.random() * SWARM_COLORS.length)];

      const newLog: SwarmLogItem = {
        id: `l-${Date.now()}`,
        time: timeStr,
        user: randomUser,
        action: randomAct.action,
        tag: randomAct.tag,
        color: randomColor,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 my-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white">Live Swarm Event Feed</h2>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          STREAMING 100+ CO-WORKERS
        </span>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-950/40 border border-slate-800/40 hover:border-slate-700/60 transition-colors"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="text-slate-500 text-[10px] flex-shrink-0">{log.time}</span>
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: log.color }}
              />
              <span className="text-slate-300 font-semibold flex-shrink-0">{log.user}:</span>
              <span className="text-slate-400 truncate">{log.action}</span>
            </div>

            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex-shrink-0">
              {log.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

