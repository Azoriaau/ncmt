"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Scroll-scrubbed video: the section pins while the user scrolls through
 * `viewportHeights` screens of scroll distance, and the video's currentTime
 * is driven by scroll progress.
 *
 * The source clip must be encoded for scrubbing (keyframe every frame):
 *   ffmpeg -i in.mp4 -g 1 -crf 20 -movflags +faststart journey.mp4
 *
 * Falls back to a plain autoplay loop when prefers-reduced-motion is set,
 * and to a gradient placeholder when the file is missing.
 */
export default function ScrollScrubVideo({
  src,
  viewportHeights = 3,
  children,
}: {
  src: string;
  viewportHeights?: number;
  children?: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || failed) return;
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let raf = 0;
    let target = 0;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      target = Math.min(1, Math.max(0, -rect.top / scrollable));
    };

    // Ease currentTime toward the scroll target each frame — writing
    // currentTime directly on every scroll event stutters in most browsers.
    const tick = () => {
      if (video.duration) {
        const current = video.currentTime / video.duration;
        const next = current + (target - current) * 0.15;
        if (Math.abs(next - current) > 0.0005) {
          video.currentTime = next * video.duration;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion, failed]);

  return (
    <div
      ref={containerRef}
      style={{ height: `${viewportHeights * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {failed ? (
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-background to-black flex items-center justify-center">
            <span className="text-muted/60 font-mono text-xs tracking-widest uppercase">
              journey.mp4 — scroll-scrub clip
            </span>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={src}
            muted
            playsInline
            preload="auto"
            autoPlay={reduceMotion ?? false}
            loop={reduceMotion ?? false}
            onError={() => setFailed(true)}
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </div>
  );
}
