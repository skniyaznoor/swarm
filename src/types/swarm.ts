export type SwarmFormation =
  | "boxes"         // Cursors outline and march around UI cards and nested geometric boxes
  | "flock"         // Craig Reynolds boids murmuration across the screen
  | "matrix-grid"   // Form holographic 2D/3D bounding grids
  | "vortex"        // Twin cyclones rotating around central stats
  | "mouse-magnet"  // Flocking to and orbiting the user's cursor
  | "free-roam";    // Autonomous browsing, inspecting, and clicking

export interface SwarmCursor {
  id: number;
  name: string;
  avatar: string;
  color: string;
  role: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  state: "idle" | "moving" | "clicking" | "patrolling";
  clickTimer: number;
  trail: Array<{ x: number; y: number; opacity: number }>;
  assignedBoxId: string;
  perimeterT: number; // 0 to 1 along perimeter
  perimeterSpeed: number;
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
  gridRow: number;
  gridCol: number;
  statusText: string;
}

export interface BoxTarget {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  activeCursorsCount?: number;
}

export interface SwarmConfig {
  cursorCount: number;
  formation: SwarmFormation;
  speed: number;
  showLabels: boolean;
  showTrails: boolean;
  showConnections: boolean;
  showBoxOutlines: boolean;
  isPaused: boolean;
}

export interface SwarmTelemetry {
  fps: number;
  activeCount: number;
  cohesionIndex: number;
  totalClicks: number;
  currentFormation: SwarmFormation;
  spatialNodes: number;
}

export interface AnalyticsMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  chartData: number[];
  color: string;
  description: string;
}

export interface LiveSwarmEvent {
  id: string;
  timestamp: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  region: string;
  badgeColor: string;
}

