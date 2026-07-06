"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const steps = [
  { at: 0.1, title: "Picked up", body: "Your freight is loaded and strapped by people who own the outcome." },
  { at: 0.45, title: "On the road", body: "Tracked door to door on routes we have run for years." },
  { at: 0.8, title: "Delivered", body: "Unloaded, on time, signed and confirmed." },
];

// The route: two cubic segments joined at the middle waypoint so all three
// node positions sit exactly on the path. The wide layout squeezed into a
// phone renders labels at ~5px, so small screens get a portrait route.
const WIDE = {
  viewBox: "0 0 1200 520",
  nodes: [
    { x: 100, y: 400, label: "Depot" },
    { x: 620, y: 250, label: "Highway" },
    { x: 1100, y: 170, label: "Door" },
  ],
  route: "M 100 400 C 280 160, 470 130, 620 250 C 770 350, 950 380, 1100 170",
};
const TALL = {
  viewBox: "0 0 400 640",
  nodes: [
    { x: 90, y: 70, label: "Depot" },
    { x: 300, y: 320, label: "Highway" },
    { x: 130, y: 570, label: "Door" },
  ],
  route: "M 90 70 C 290 100, 380 190, 300 320 C 220 450, 150 460, 130 570",
};

// Scroll progress ranges become WAAPI keyframe offsets when Motion uses the
// native ScrollTimeline, so they must stay within [0, 1].
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Line starts drawing after the section pins and finishes before it unpins.
const DRAW_START = 0.08;
const DRAW_END = 0.85;

function Step({
  progress,
  at,
  title,
  body,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  at: number;
  title: string;
  body: string;
}) {
  const opacity = useTransform(
    progress,
    [at - 0.12, at, at + 0.12, at + 0.24].map(clamp01),
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [clamp01(at - 0.12), at], [30, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-0 bottom-24 mx-auto max-w-6xl px-6"
    >
      <p className="font-mono text-accent-bright text-sm tracking-[0.3em] uppercase mb-2">
        {title}
      </p>
      <p className="text-2xl sm:text-4xl font-medium max-w-xl text-balance">
        {body}
      </p>
    </motion.div>
  );
}

function Waypoint({
  progress,
  node,
  at,
  children,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  node: { x: number; y: number; label: string };
  at: number;
  children: React.ReactNode;
}) {
  const activation = [clamp01(at - 0.03), clamp01(at + 0.03)];
  const opacity = useTransform(progress, activation, [0.35, 1]);
  const scale = useTransform(progress, activation, [0.85, 1]);

  return (
    <motion.g
      // Scale around the node centre, not the SVG origin
      style={{ opacity, scale, transformOrigin: `${node.x}px ${node.y}px` }}
    >
      <circle
        cx={node.x}
        cy={node.y}
        r="26"
        className="fill-surface stroke-accent-bright"
        strokeWidth="2"
      />
      {children}
      <text
        x={node.x}
        y={node.y + 52}
        textAnchor="middle"
        className="fill-muted font-mono uppercase"
        fontSize="13"
        letterSpacing="0.15em"
      >
        {node.label}
      </text>
    </motion.g>
  );
}

export default function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { viewBox, nodes, route } = isMobile ? TALL : WIDE;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const dashOffset = useTransform(
    scrollYProgress,
    [DRAW_START, DRAW_END],
    [1, 0]
  );

  // Glowing dot rides the tip of the drawn line. Driven imperatively from
  // the MotionValue so it doesn't re-render per scroll frame.
  useEffect(() => {
    if (reduceMotion) return;
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;
    const total = path.getTotalLength();
    const update = (v: number) => {
      const t = clamp01((v - DRAW_START) / (DRAW_END - DRAW_START));
      const p = path.getPointAtLength(t * total);
      dot.setAttribute("cx", String(p.x));
      dot.setAttribute("cy", String(p.y));
    };
    update(scrollYProgress.get());
    return scrollYProgress.on("change", update);
  }, [scrollYProgress, reduceMotion, route]);

  return (
    <section id="journey" ref={ref}>
      <div style={{ height: "280vh" }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden bg-surface border-y border-white/5">
          {/* Accent wash so the section reads as its own space */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 65% at 50% 38%, rgb(15 59 214 / 0.14), transparent 70%)",
            }}
          />
          {/* Faint dot grid so the route has something to sit in */}
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgb(139 150 173 / 0.25) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative h-full flex items-center justify-center">
            <svg
              viewBox={viewBox}
              className={
                isMobile
                  ? "h-full max-h-[60vh] px-4 -mt-20"
                  : "w-full max-w-6xl px-6 -mt-24"
              }
              fill="none"
              aria-hidden
            >
              {/* Full route, faint — the road ahead */}
              <path
                d={route}
                className="stroke-white/10"
                strokeWidth="2"
                strokeDasharray="6 10"
                strokeLinecap="round"
              />
              {/* Drawn route */}
              <motion.path
                ref={pathRef}
                d={route}
                pathLength={1}
                strokeDasharray="1"
                style={{
                  strokeDashoffset: reduceMotion ? 0 : dashOffset,
                }}
                className="stroke-accent-bright"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#route-glow)"
              />
              {!reduceMotion && (
                <circle
                  ref={dotRef}
                  cx={nodes[0].x}
                  cy={nodes[0].y}
                  r="7"
                  className="fill-accent-bright"
                  filter="url(#route-glow)"
                />
              )}

              <defs>
                <filter id="route-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Depot: shed roof + door */}
              <Waypoint progress={scrollYProgress} node={nodes[0]} at={steps[0].at}>
                <path
                  d={`M ${nodes[0].x - 12} ${nodes[0].y + 9} v -11 l 12 -8 12 8 v 11 h -7 v -8 h -10 v 8 z`}
                  className="fill-accent-bright"
                />
              </Waypoint>

              {/* Highway: truck silhouette */}
              <Waypoint progress={scrollYProgress} node={nodes[1]} at={steps[1].at}>
                <g className="fill-accent-bright">
                  <path
                    d={`M ${nodes[1].x - 14} ${nodes[1].y - 7} h 17 v 12 h -17 z M ${nodes[1].x + 5} ${nodes[1].y - 3} h 6 l 4 5 v 3 h -10 z`}
                  />
                  <circle cx={nodes[1].x - 8} cy={nodes[1].y + 8} r="2.6" className="fill-surface" stroke="currentColor" />
                  <circle cx={nodes[1].x + 9} cy={nodes[1].y + 8} r="2.6" className="fill-surface" stroke="currentColor" />
                </g>
              </Waypoint>

              {/* Door: tick */}
              <Waypoint progress={scrollYProgress} node={nodes[2]} at={steps[2].at}>
                <path
                  d={`M ${nodes[2].x - 9} ${nodes[2].y} l 6 7 l 12 -13`}
                  className="stroke-accent-bright"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Waypoint>
            </svg>
          </div>

          {steps.map((s) => (
            <Step key={s.title} progress={scrollYProgress} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
