# SwarmAnalytics 🚀

A real-time telemetry, stats, and analytics platform built with **Next.js**, **TypeScript**, and **Tailwind CSS**, featuring **100+ simulated multiplayer cursors** forming geometric boxes, murmuration patterns, and synchronized scanning lattices.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

- **100+ Simulated Multiplayer Cursors (60 FPS Vector Canvas)**: Smooth, zero-DOM-reflow canvas rendering with dynamic DPR scaling.
- **Dynamic Swarm Formations**:
  - **Box Formation (`boxes`)**: Cursors automatically detect and outline HTML elements (KPI cards, telemetry chart, sessions table) with glowing bounding boxes and corner brackets.
  - **Murmuration (`flock`)**: Craig Reynolds Boids algorithm with separation, alignment, and cohesion physics.
  - **Holo Grid (`matrix-grid`)**: Structured 2D/3D geometric matrix boxes with connection lines.
  - **Cyclone Vortex (`vortex`)**: Twin orbital cyclones swirling around focal statistics.
  - **Follow My Mouse (`mouse-magnet`)**: Swarm converges and orbits around the user's real mouse cursor.
  - **Free Roam (`free-roam`)**: Autonomous browsing, inspecting, and clicking.
- **Interactive Control Deck**: Docked glassmorphism controls to adjust cursor density (50, 100, 150, 200), simulation speed, visual overlays (mesh lines, trails, badges), and a "Click Wave" shockwave button.
- **Comprehensive Analytics**:
  - Real-time Concurrency & Throughput chart with hover tooltips
  - 4 Key Metric KPIs with SVG sparklines
  - Global Edge Node Distribution with latency meters
  - Accessible Session Table with sticky headers
  - Live Ticking Event Log

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ (tested on Node 22)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/skniyaznoor/swarm.git
cd swarm

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## 📄 License

MIT

