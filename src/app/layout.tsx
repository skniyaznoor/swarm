import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwarmAnalytics | 100+ Cursor Swarm & Realtime Stats",
  description:
    "Next.js analytics and stats dashboard powered by an interactive 100+ cursor swarm simulation forming geometric boxes, murmuration patterns, and synchronized scanning lattices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#06080e] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}

