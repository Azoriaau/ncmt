"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pinned full-screen video: the section stays stuck while the user scrolls
 * through `viewportHeights` screens (the captions animate on that scroll).
 * The video plays once when the section comes into view, then freezes on
 * its last frame. Falls back to a gradient placeholder if the file is
 * missing.
 */
export default function PinnedVideo({
  src,
  viewportHeights = 3,
  children,
}: {
  src: string;
  viewportHeights?: number;
  children?: React.ReactNode;
}) {
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const started = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (failed) return;
    const sticky = stickyRef.current;
    const video = videoRef.current;
    if (!sticky || !video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          video.play().catch(() => {
            // Autoplay blocked — the poster/first frame just stays put.
          });
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(sticky);
    return () => io.disconnect();
  }, [failed]);

  return (
    <div style={{ height: `${viewportHeights * 100}vh` }} className="relative">
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
        {failed ? (
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-background to-black flex items-center justify-center">
            <span className="text-muted/60 font-mono text-xs tracking-widest uppercase">
              journey.mp4 — journey clip
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
            onError={() => setFailed(true)}
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </div>
  );
}
