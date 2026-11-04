"use client";

import React, { useState, useEffect, useRef } from "react";
import { BoxTarget } from "../types/swarm";
import { SWARM_COLORS } from "../utils/swarmGenerator";
import { Activity, ShieldCheck, Eye, ExternalLink } from "lucide-react";

interface LiveSessionTableProps {
  onRegisterBox: (box: BoxTarget) => void;
  onUnregisterBox: (id: string) => void;
}

interface SessionRow {
  id: string;
  user: string;
  avatar: string;
  role: string;
  color: string;
  location: string;
  action: string;
  latency: string;
  status: "Active" | "Idle" | "Reviewing";
}

const INITIAL_SESSIONS: SessionRow[] = [
  {
    id: "s-101",
    user: "Aria Chen",
    avatar: "AC",
    role: "Staff Analyst",
    color: "#00f0ff",
    location: "San Francisco, US",
    action: "Inspecting Latency Spike",
    latency: "12ms",
    status: "Active",
  },
  {
    id: "s-102",
    user: "Kenji Sato",
    avatar: "KS",
    role: "ML Engineer",
    color: "#10b981",
    location: "Tokyo, JP",
    action: "Filtering Asia-East Traffic",
    latency: "34ms",
    status: "Active",
  },
  {
    id: "s-103",
    user: "Elena Rostova",
    avatar: "ER",
    role: "Data Scientist",
    color: "#a855f7",
    location: "Zurich, CH",
    action: "Hovering Retention Curve",
    latency: "19ms",
    status: "Reviewing",
  },
  {
    id: "s-104",
    user: "Dev-042",
    avatar: "D4",
    role: "System Bot",
    color: "#f59e0b",
    location: "Frankfurt, DE",
    action: "Pinning Live Node",
    latency: "8ms",
    status: "Active",
  },
  {
    id: "s-105",
    user: "Maya Patel",
    avatar: "MP",
    role: "Product Lead",
    color: "#ff3366",
    location: "London, UK",
    action: "Checking Memory Pressure",
    latency: "21ms",
    status: "Idle",
  },
  {
    id: "s-106",
    user: "Sora Kim",
    avatar: "SK",
    role: "Infra SRE",
    color: "#38bdf8",
    location: "Seoul, KR",
    action: "Verifying Cache Hit Rate",
    latency: "28ms",
    status: "Active",
  },
  {
    id: "s-107",
    user: "Mateo Rossi",
    avatar: "MR",
    role: "UX Researcher",
    color: "#e11d48",
    location: "Milan, IT",
    action: "Watching Conversion Funnel",
    latency: "25ms",
    status: "Reviewing",
  },
];

export const LiveSessionTable: React.FC<LiveSessionTableProps> = ({
  onRegisterBox,
  onUnregisterBox,
}) => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>(INITIAL_SESSIONS);

  // Periodically update active status and latency slightly to show live dynamism
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prev) =>
        prev.map((s, idx) => {
          if (idx === Math.floor(Math.random() * prev.length)) {
            const latencies = ["11ms", "14ms", "18ms", "22ms", "27ms", "31ms"];
            return {
              ...s,
              latency: latencies[Math.floor(Math.random() * latencies.length)],
            };
          }
          return s;
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Register the table as a swarm box target
  useEffect(() => {
    const updateBounds = () => {
      if (!tableContainerRef.current) return;
      const rect = tableContainerRef.current.getBoundingClientRect();
      onRegisterBox({
        id: "live-sessions-table",
        title: "Active Cursor Stream Table",
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      });
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    window.addEventListener("scroll", updateBounds);

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds);
      onUnregisterBox("live-sessions-table");
    };
  }, [onRegisterBox, onUnregisterBox]);

  return (
    <div
      ref={tableContainerRef}
      className="glass-panel rounded-2xl p-6 border border-slate-800/80 my-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 id="sessions-table-caption" className="text-base font-semibold text-white">
              Live Swarm Participant Directory
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Realtime session audit of 100+ concurrent simulated users navigating the interface
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            {sessions.length} High-Ranked Nodes
          </span>
        </div>
      </div>

      {/* Accessible Table Wrapper following modern-web-guidance:
          - tabindex="0" for keyboard scrollability
          - role="region"
          - aria-labelledby matching caption
          - container-type: inline-size for responsive query
      */}
      <div
        tabIndex={0}
        role="region"
        aria-labelledby="sessions-table-caption"
        className="table-wrapper overflow-auto max-w-full max-h-[380px] rounded-xl border border-slate-800/60 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        style={{
          containerType: "inline-size",
        }}
      >
        <table className="w-full text-left border-collapse border-spacing-0 text-xs">
          {/* Sticky column headers */}
          <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md text-slate-400 font-medium uppercase tracking-wider text-[11px] border-b border-slate-800">
            <tr>
              <th scope="col" className="py-3 px-4">
                Participant
              </th>
              <th scope="col" className="py-3 px-4">
                Role / Type
              </th>
              <th scope="col" className="py-3 px-4">
                Cluster Region
              </th>
              <th scope="col" className="py-3 px-4">
                Live Swarm Action
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Node Latency
              </th>
              <th scope="col" className="py-3 px-4 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {sessions.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-800/30 transition-colors group"
              >
                {/* Sticky row header */}
                <th
                  scope="row"
                  className="py-3.5 px-4 font-normal text-white sticky left-0 bg-slate-950/90 backdrop-blur-sm group-hover:bg-slate-900/90 z-[2]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-slate-950 text-xs"
                      style={{ backgroundColor: row.color }}
                    >
                      {row.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {row.user}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {row.id}
                      </div>
                    </div>
                  </div>
                </th>

                <td className="py-3.5 px-4 text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/60 text-[11px]">
                    {row.role}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-slate-400 font-mono">
                  {row.location}
                </td>

                <td className="py-3.5 px-4 text-cyan-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: row.color }}
                    />
                    {row.action}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-bold">
                  {row.latency}
                </td>

                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      row.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : row.status === "Reviewing"
                        ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                        : "bg-slate-700/40 text-slate-400 border border-slate-600/30"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

