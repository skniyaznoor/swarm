import { SwarmCursor, BoxTarget, SwarmFormation } from "../types/swarm";

const NAMES = [
  "Aria Chen", "Liam Smith", "Kenji Sato", "Elena Rostova", "Dev-042",
  "Maya Patel", "Lucas Silva", "Zoe Vance", "Mateo Rossi", "Sora Kim",
  "Nadia Al-Mansoor", "Felix Weber", "Chloe Dubois", "Kaelen Voss", "Nova-7",
  "Tariq Vance", "Astrid Lind", "Bao Nguyen", "Dante Cruz", "Yuki Tanaka",
  "Cyber-99", "Leila Haddad", "Sam Rivers", "Mira Thorne", "Oskar Brandt",
  "Freja Holm", "Zack Ward", "Amara Okonjo", "Julian Zhang", "Byte-512",
  "Tessa Gray", "Nikolai Volkov", "Camila Gomez", "Hassan Raza", "Axel Finch",
  "Clara Bell", "Rowan Hayes", "Sienna Brooks", "Elias Vance", "Vector-01",
];

const ROLES = [
  "Staff Analyst", "ML Engineer", "Product Lead", "Data Scientist", "System Bot",
  "Security Audit", "UX Researcher", "Growth Ops", "Infra SRE", "Quant Trader"
];

const STATUS_ACTIONS = [
  "Inspecting Latency Spike",
  "Filtering Asia-East Traffic",
  "Watching Conversion Funnel",
  "Hovering Retention Curve",
  "Checking Memory Pressure",
  "Verifying Cache Hit Rate",
  "Pinning Live Node",
  "Annotating Anomaly #412",
  "Expanding Geo Cluster",
  "Exporting Realtime Telemetry",
];

export const SWARM_COLORS = [
  "#00f0ff", // Neon Cyan
  "#10b981", // Emerald
  "#a855f7", // Violet
  "#f59e0b", // Amber
  "#ff3366", // Neon Crimson
  "#38bdf8", // Sky Blue
  "#e11d48", // Rose
  "#8b5cf6", // Indigo
  "#14b8a6", // Teal
  "#ec4899", // Pink
  "#06b6d4", // Electric Blue
];

export function createInitialCursors(count: number, width: number, height: number): SwarmCursor[] {
  const cursors: SwarmCursor[] = [];

  for (let i = 0; i < count; i++) {
    const name = `${NAMES[i % NAMES.length]} ${i >= NAMES.length ? `#${i + 1}` : ""}`;
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    const color = SWARM_COLORS[i % SWARM_COLORS.length];
    const role = ROLES[i % ROLES.length];

    const x = Math.random() * (width || 1200);
    const y = Math.random() * (height || 800);

    cursors.push({
      id: i,
      name,
      avatar: initials,
      color,
      role,
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      targetX: x,
      targetY: y,
      state: "moving",
      clickTimer: 0,
      trail: [],
      assignedBoxId: "",
      perimeterT: Math.random(),
      perimeterSpeed: 0.002 + Math.random() * 0.003,
      orbitAngle: (i / count) * Math.PI * 2,
      orbitRadius: 80 + (i % 6) * 35,
      orbitSpeed: 0.015 + (i % 3) * 0.005,
      gridRow: Math.floor(i / 10),
      gridCol: i % 10,
      statusText: STATUS_ACTIONS[i % STATUS_ACTIONS.length],
    });
  }

  return cursors;
}

/**
 * Calculates (x, y) along a box perimeter given t in [0, 1]
 */
export function getPointOnBoxPerimeter(box: BoxTarget, t: number): { x: number; y: number } {
  const { x, y, width: w, height: h } = box;
  const perimeter = 2 * (w + h);
  const normalized = ((t % 1) + 1) % 1; // wrap 0 to 1
  const dist = normalized * perimeter;

  // Top edge: (x, y) to (x + w, y)
  if (dist < w) {
    return { x: x + dist, y };
  }
  // Right edge: (x + w, y) to (x + w, y + h)
  if (dist < w + h) {
    return { x: x + w, y: y + (dist - w) };
  }
  // Bottom edge: (x + w, y + h) to (x, y + h)
  if (dist < 2 * w + h) {
    return { x: x + w - (dist - (w + h)), y: y + h };
  }
  // Left edge: (x, y + h) to (x, y)
  return { x, y: y + h - (dist - (2 * w + h)) };
}

/**
 * Update step for the 100+ swarm cursor physics
 */
export function updateSwarmPhysics(
  cursors: SwarmCursor[],
  formation: SwarmFormation,
  boxes: BoxTarget[],
  mouseX: number,
  mouseY: number,
  width: number,
  height: number,
  speedMultiplier: number,
  isMouseInside: boolean
): void {
  const numCursors = cursors.length;
  const numBoxes = boxes.length;

  for (let i = 0; i < numCursors; i++) {
    const c = cursors[i];

    // Decrement click timer
    if (c.clickTimer > 0) {
      c.clickTimer--;
      if (c.clickTimer === 0) c.state = "moving";
    }

    // Occasional random simulated click
    if (Math.random() < 0.003 && c.clickTimer === 0) {
      c.state = "clicking";
      c.clickTimer = 35;
    }

    // Determine target based on formation mode
    switch (formation) {
      case "boxes": {
        if (numBoxes > 0) {
          // Distribute cursors evenly among available boxes
          const boxIndex = i % numBoxes;
          const box = boxes[boxIndex];
          c.assignedBoxId = box.id;

          // Advance along the perimeter
          c.perimeterT = (c.perimeterT + c.perimeterSpeed * speedMultiplier) % 1;
          const pt = getPointOnBoxPerimeter(box, c.perimeterT);

          // Add slight organic breathing jitter
          const jitterX = Math.sin(Date.now() * 0.003 + i) * 3;
          const jitterY = Math.cos(Date.now() * 0.003 + i) * 3;

          c.targetX = pt.x + jitterX;
          c.targetY = pt.y + jitterY;
        } else {
          // Fallback box if no HTML cards registered
          const defaultBox: BoxTarget = {
            id: "fallback",
            title: "Main Dashboard",
            x: width * 0.15,
            y: height * 0.15,
            width: width * 0.7,
            height: height * 0.7,
          };
          c.perimeterT = (c.perimeterT + c.perimeterSpeed * speedMultiplier) % 1;
          const pt = getPointOnBoxPerimeter(defaultBox, c.perimeterT);
          c.targetX = pt.x;
          c.targetY = pt.y;
        }
        break;
      }

      case "flock": {
        // Craig Reynolds Boids behavior
        let alignX = 0, alignY = 0;
        let cohesionX = 0, cohesionY = 0;
        let separationX = 0, separationY = 0;
        let neighbors = 0;

        const perceptionRadius = 90;

        for (let j = 0; j < numCursors; j++) {
          if (i === j) continue;
          const other = cursors[j];
          const dx = other.x - c.x;
          const dy = other.y - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 0 && dist < perceptionRadius) {
            alignX += other.vx;
            alignY += other.vy;
            cohesionX += other.x;
            cohesionY += other.y;
            neighbors++;

            if (dist < 40) {
              separationX -= dx / dist;
              separationY -= dy / dist;
            }
          }
        }

        if (neighbors > 0) {
          alignX /= neighbors;
          alignY /= neighbors;
          cohesionX = cohesionX / neighbors - c.x;
          cohesionY = cohesionY / neighbors - c.y;

          c.vx += (alignX * 0.05 + cohesionX * 0.002 + separationX * 0.12) * speedMultiplier;
          c.vy += (alignY * 0.05 + cohesionY * 0.002 + separationY * 0.12) * speedMultiplier;
        }

        // Screen boundary repulsion
        const margin = 80;
        if (c.x < margin) c.vx += 0.4;
        if (c.x > width - margin) c.vx -= 0.4;
        if (c.y < margin) c.vy += 0.4;
        if (c.y > height - margin) c.vy -= 0.4;

        // Mouse slight attraction if inside
        if (isMouseInside) {
          const mdx = mouseX - c.x;
          const mdy = mouseY - c.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 300) {
            c.vx += (mdx / mdist) * 0.15;
            c.vy += (mdy / mdist) * 0.15;
          }
        }
        break;
      }

      case "matrix-grid": {
        // Arrange into holographic geometric matrix boxes
        const cols = Math.ceil(Math.sqrt(numCursors * 1.5));
        const cellW = (width * 0.8) / cols;
        const cellH = 65;
        const startX = width * 0.1;
        const startY = height * 0.15;

        const row = Math.floor(i / cols);
        const col = i % cols;

        // Wave distortion over grid
        const wave = Math.sin(Date.now() * 0.002 + col * 0.4 + row * 0.3) * 12;

        c.targetX = startX + col * cellW;
        c.targetY = startY + row * cellH + wave;
        break;
      }

      case "vortex": {
        // Dual spiral cyclones
        const isLeftSpiral = i % 2 === 0;
        const centerX = isLeftSpiral ? width * 0.32 : width * 0.68;
        const centerY = height * 0.45;

        c.orbitAngle += (c.orbitSpeed * (isLeftSpiral ? 1 : -1)) * speedMultiplier;
        const breathingRadius = c.orbitRadius + Math.sin(Date.now() * 0.002 + i) * 15;

        c.targetX = centerX + Math.cos(c.orbitAngle) * breathingRadius;
        c.targetY = centerY + Math.sin(c.orbitAngle) * breathingRadius * 0.75;
        break;
      }

      case "mouse-magnet": {
        // Orbit and swarm directly around real user mouse
        const targetPointX = isMouseInside ? mouseX : width * 0.5;
        const targetPointY = isMouseInside ? mouseY : height * 0.45;

        c.orbitAngle += c.orbitSpeed * speedMultiplier;
        const radius = 40 + (i % 12) * 18;

        c.targetX = targetPointX + Math.cos(c.orbitAngle + i * 0.2) * radius;
        c.targetY = targetPointY + Math.sin(c.orbitAngle + i * 0.2) * radius;
        break;
      }

      case "free-roam":
      default: {
        // Semi-random exploration with periodic targeting of cards
        if (Math.random() < 0.02 || !c.targetX) {
          if (numBoxes > 0 && Math.random() < 0.7) {
            const randomBox = boxes[Math.floor(Math.random() * numBoxes)];
            c.targetX = randomBox.x + 15 + Math.random() * (randomBox.width - 30);
            c.targetY = randomBox.y + 15 + Math.random() * (randomBox.height - 30);
          } else {
            c.targetX = Math.random() * width;
            c.targetY = Math.random() * height;
          }
        }
        break;
      }
    }

    // Physics integration for target-based formations
    if (formation !== "flock") {
      const dx = c.targetX - c.x;
      const dy = c.targetY - c.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Smooth damped spring acceleration
      const springStrength = 0.04 * speedMultiplier;
      c.vx += dx * springStrength;
      c.vy += dy * springStrength;

      // Friction damping
      c.vx *= 0.82;
      c.vy *= 0.82;
    }

    // Limit maximum velocity
    const maxSpeed = 7 * speedMultiplier;
    const speed = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
    if (speed > maxSpeed) {
      c.vx = (c.vx / speed) * maxSpeed;
      c.vy = (c.vy / speed) * maxSpeed;
    }

    // Move cursor
    c.x += c.vx;
    c.y += c.vy;

    // Wrap / bounce boundaries
    if (c.x < 0) { c.x = 0; c.vx = Math.abs(c.vx) * 0.5; }
    if (c.x > width) { c.x = width; c.vx = -Math.abs(c.vx) * 0.5; }
    if (c.y < 0) { c.y = 0; c.vy = Math.abs(c.vy) * 0.5; }
    if (c.y > height) { c.y = height; c.vy = -Math.abs(c.vy) * 0.5; }

    // Update motion trail history
    if (i % 2 === 0) { // Keep performance high by sampling trails
      c.trail.unshift({ x: c.x, y: c.y, opacity: 1 });
      if (c.trail.length > 8) {
        c.trail.pop();
      }
      for (const t of c.trail) {
        t.opacity *= 0.85;
      }
    }
  }
}

