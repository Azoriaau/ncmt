"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import PinnedVideo from "./PinnedVideo";

const steps = [
  { at: 0.1, title: "Picked up", body: "Your freight is loaded and strapped by people who own the outcome." },
  { at: 0.45, title: "On the road", body: "Tracked door to door on routes we have run for years." },
  { at: 0.8, title: "Delivered", body: "Unloaded, on time, signed and confirmed." },
];

// Scroll progress ranges become WAAPI keyframe offsets when Motion uses the
// native ScrollTimeline, so they must stay within [0, 1].
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

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
      <p className="font-mono text-accent text-sm tracking-[0.3em] uppercase mb-2">
        {title}
      </p>
      <p className="text-2xl sm:text-4xl font-medium max-w-xl text-balance">
        {body}
      </p>
    </motion.div>
  );
}

export default function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section id="journey" ref={ref}>
      <PinnedVideo src="/videos/journey.mp4" viewportHeights={4}>
        {steps.map((s) => (
          <Step key={s.title} progress={scrollYProgress} {...s} />
        ))}
      </PinnedVideo>
    </section>
  );
}
