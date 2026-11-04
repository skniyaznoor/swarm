"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { SwarmCursor, BoxTarget, SwarmConfig, SwarmTelemetry } from "../types/swarm";
import { createInitialCursors, updateSwarmPhysics } from "../utils/swarmGenerator";

interface SwarmCanvasProps {
  config: SwarmConfig;
  boxes: BoxTarget[];
  onTelemetryUpdate?: (telemetry: SwarmTelemetry) => void;
  triggerBurstTimestamp?: number;
}

export const SwarmCanvas: React.FC<SwarmCanvasProps> = ({
  config,
  boxes,
  onTelemetryUpdate,
  triggerBurstTimestamp,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorsRef = useRef<SwarmCursor[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isInside: false });
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const framesCountRef = useRef<number>(0);
  const fpsTimerRef = useRef<number>(performance.now());
  const totalClicksRef = useRef<number>(1420);

  // Initialize cursors when count changes
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const current = cursorsRef.current;

    if (current.length < config.cursorCount) {
      const added = createInitialCursors(
        config.cursorCount - current.length,
        width,
        height
      );
      // Remap IDs
      added.forEach((c, idx) => {
        c.id = current.length + idx;
      });
      cursorsRef.current = [...current, ...added];
    } else if (current.length > config.cursorCount) {
      cursorsRef.current = current.slice(0, config.cursorCount);
    }
  }, [config.cursorCount]);

  // Handle sudden wave/burst triggers
  useEffect(() => {
    if (!triggerBurstTimestamp) return;
    const cursors = cursorsRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    cursors.forEach((c) => {
      const angle = Math.random() * Math.PI * 2;
      const force = 8 + Math.random() * 12;
      c.vx = Math.cos(angle) * force;
      c.vy = Math.sin(angle) * force;
      c.state = "clicking";
      c.clickTimer = 45;
    });
    totalClicksRef.current += cursors.length;
  }, [triggerBurstTimestamp]);

  // Track window resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = Math.max(window.innerHeight, document.documentElement.scrollHeight);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      // Initialize cursors if empty
      if (cursorsRef.current.length === 0) {
        cursorsRef.current = createInitialCursors(config.cursorCount, width, height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [config.cursorCount]);

  // Track user mouse
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY + window.scrollY;
      mouseRef.current.isInside = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.isInside = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  // Main rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isRunning = true;

    const render = (now: number) => {
      if (!isRunning) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = Math.max(window.innerHeight, document.documentElement.scrollHeight);

      // FPS calculation
      framesCountRef.current++;
      if (now - fpsTimerRef.current >= 500) {
        const fps = Math.round((framesCountRef.current * 1000) / (now - fpsTimerRef.current));
        framesCountRef.current = 0;
        fpsTimerRef.current = now;

        if (onTelemetryUpdate) {
          onTelemetryUpdate({
            fps: Math.min(fps, 60),
            activeCount: cursorsRef.current.length,
            cohesionIndex:
              config.formation === "boxes"
                ? 0.94
                : config.formation === "matrix-grid"
                ? 0.98
                : config.formation === "flock"
                ? 0.88
                : 0.65,
            totalClicks: totalClicksRef.current,
            currentFormation: config.formation,
            spatialNodes: boxes.length,
          });
        }
      }

      // Physics update unless paused
      if (!config.isPaused) {
        updateSwarmPhysics(
          cursorsRef.current,
          config.formation,
          boxes,
          mouseRef.current.x,
          mouseRef.current.y,
          width,
          height,
          config.speed,
          mouseRef.current.isInside
        );
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      const cursors = cursorsRef.current;
      const cursorCount = cursors.length;

      // 1. Draw glowing perimeter bounding boxes when in 'boxes' mode or showBoxOutlines
      if (config.showBoxOutlines || config.formation === "boxes") {
        ctx.save();
        boxes.forEach((box) => {
          const { x, y, width: bw, height: bh } = box;

          // Box border with subtle glowing dash
          ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([8, 8]);
          ctx.lineDashOffset = -(now * 0.02) % 16;
          ctx.strokeRect(x, y, bw, bh);

          // Glowing corner brackets
          const cornerLen = 14;
          ctx.setLineDash([]);
          ctx.strokeStyle = "#00f0ff";
          ctx.lineWidth = 2.5;

          // Top-Left
          ctx.beginPath();
          ctx.moveTo(x, y + cornerLen);
          ctx.lineTo(x, y);
          ctx.lineTo(x + cornerLen, y);
          ctx.stroke();

          // Top-Right
          ctx.beginPath();
          ctx.moveTo(x + bw - cornerLen, y);
          ctx.lineTo(x + bw, y);
          ctx.lineTo(x + bw, y + cornerLen);
          ctx.stroke();

          // Bottom-Right
          ctx.beginPath();
          ctx.moveTo(x + bw, y + bh - cornerLen);
          ctx.lineTo(x + bw, y + bh);
          ctx.lineTo(x + bw - cornerLen, y + bh);
          ctx.stroke();

          // Bottom-Left
          ctx.beginPath();
          ctx.moveTo(x + cornerLen, y + bh);
          ctx.lineTo(x, y + bh);
          ctx.lineTo(x, y + bh - cornerLen);
          ctx.stroke();

          // Box label tag
          ctx.fillStyle = "rgba(0, 240, 255, 0.15)";
          ctx.fillRect(x, y - 22, 160, 20);
          ctx.fillStyle = "#00f0ff";
          ctx.font = "bold 10px monospace";
          ctx.fillText(`BOX // ${box.title.toUpperCase()}`, x + 6, y - 8);
        });
        ctx.restore();
      }

      // 2. Draw Inter-cursor connection mesh if enabled
      if (config.showConnections) {
        ctx.save();
        const maxDist = config.formation === "matrix-grid" ? 140 : 85;
        const maxDistSq = maxDist * maxDist;

        // Sample connections for optimal 60 FPS
        const step = cursorCount > 100 ? 2 : 1;
        for (let i = 0; i < cursorCount; i += step) {
          const c1 = cursors[i];
          for (let j = i + 1; j < cursorCount; j += step) {
            const c2 = cursors[j];
            const dx = c1.x - c2.x;
            const dy = c1.y - c2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistSq) {
              const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.35;
              ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(c1.x, c1.y);
              ctx.lineTo(c2.x, c2.y);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      // 3. Draw trails
      if (config.showTrails) {
        ctx.save();
        cursors.forEach((c) => {
          if (c.trail.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(c.trail[0].x, c.trail[0].y);
          for (let t = 1; t < c.trail.length; t++) {
            ctx.lineTo(c.trail[t].x, c.trail[t].y);
          }
          ctx.strokeStyle = c.color;
          ctx.globalAlpha = 0.25;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
        ctx.restore();
      }

      // 4. Draw click ripples
      cursors.forEach((c) => {
        if (c.clickTimer > 0) {
          const progress = 1 - c.clickTimer / 45;
          const radius = progress * 32;
          const alpha = (1 - progress) * 0.8;

          ctx.save();
          ctx.strokeStyle = c.color;
          ctx.lineWidth = 2;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
          ctx.stroke();

          // Second inner ripple
          ctx.beginPath();
          ctx.arc(c.x, c.y, radius * 0.5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      });

      // 5. Render individual cursors and labels
      for (let i = 0; i < cursorCount; i++) {
        const c = cursors[i];
        const { x, y, color, name, avatar, statusText } = c;

        ctx.save();

        // High precision cursor path
        // Standard Figma/OS-style pointer
        ctx.translate(x, y);

        // Click bounce effect
        if (c.clickTimer > 25) {
          ctx.scale(0.85, 0.85);
        }

        // Drop shadow for pointer
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 2;

        // Draw pointer shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 15);
        ctx.lineTo(4, 11.5);
        ctx.lineTo(8, 19);
        ctx.lineTo(10.5, 17.5);
        ctx.lineTo(6.5, 10);
        ctx.lineTo(12, 10);
        ctx.closePath();

        // Fill with user color
        ctx.fillStyle = color;
        ctx.fill();

        // Crisp dark outline
        ctx.strokeStyle = "#080a0f";
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.restore();

        // 6. Draw User Pill Tag
        if (config.showLabels) {
          ctx.save();
          const pillX = x + 14;
          const pillY = y + 14;

          // Render only avatar badge for high cursor counts to keep clutter low,
          // or show full badge for prime cursors
          const showFullLabel = cursorCount <= 60 || i % 2 === 0;

          if (showFullLabel) {
            const labelText = name;
            ctx.font = "600 11px system-ui, sans-serif";
            const textWidth = ctx.measureText(labelText).width;
            const badgeW = textWidth + 30;
            const badgeH = 20;

            // Pill background
            ctx.fillStyle = "rgba(10, 15, 29, 0.88)";
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.2;

            // Rounded pill
            const r = 4;
            ctx.beginPath();
            ctx.moveTo(pillX + r, pillY);
            ctx.lineTo(pillX + badgeW - r, pillY);
            ctx.quadraticCurveTo(pillX + badgeW, pillY, pillX + badgeW, pillY + r);
            ctx.lineTo(pillX + badgeW, pillY + badgeH - r);
            ctx.quadraticCurveTo(pillX + badgeW, pillY + badgeH, pillX + badgeW - r, pillY + badgeH);
            ctx.lineTo(pillX + r, pillY + badgeH);
            ctx.quadraticCurveTo(pillX, pillY + badgeH, pillX, pillY + badgeH - r);
            ctx.lineTo(pillX, pillY + r);
            ctx.quadraticCurveTo(pillX, pillY, pillX + r, pillY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Avatar circle
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(pillX + 10, pillY + 10, 6, 0, Math.PI * 2);
            ctx.fill();

            // Avatar text
            ctx.fillStyle = "#000000";
            ctx.font = "bold 8px system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(avatar[0] || "U", pillX + 10, pillY + 10.5);

            // User Name
            ctx.fillStyle = "#ffffff";
            ctx.font = "600 11px system-ui, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(labelText, pillX + 22, pillY + 10.5);

            // If clicking, render floating activity bubble above
            if (c.clickTimer > 10) {
              const actW = ctx.measureText(statusText).width + 16;
              ctx.fillStyle = color;
              ctx.fillRect(x - 10, y - 22, actW, 16);
              ctx.fillStyle = "#000";
              ctx.font = "bold 9px system-ui, sans-serif";
              ctx.fillText(statusText, x - 2, y - 11);
            }
          } else {
            // Compact dot tag for secondary cursors
            ctx.fillStyle = "rgba(10, 15, 29, 0.85)";
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(pillX + 4, pillY + 4, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = color;
            ctx.font = "bold 9px system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(avatar[0] || "•", pillX + 4, pillY + 4.5);
          }

          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [config, boxes, onTelemetryUpdate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-300"
      style={{
        opacity: config.isPaused ? 0.4 : 1,
      }}
      aria-hidden="true"
    />
  );
};

