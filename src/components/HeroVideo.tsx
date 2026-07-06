"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero background video that plays once, then fades to a still image
 * (the clip's final frame). If autoplay is blocked (low power mode,
 * data saver, strict browser settings) playback retries on the first
 * user gesture; the still only takes over on a media error or when
 * the clip ends.
 */
export default function HeroVideo({
  src,
  poster,
  still,
  className = "",
}: {
  src: string;
  poster?: string;
  still: string;
  className?: string;
}) {
  const [showStill, setShowStill] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Kick playback once on mount only — re-running play() after the
  // "ended" re-render would restart the clip. Autoplay rejection isn't
  // fatal: the same play() call is allowed once the user interacts, so
  // retry on the first gesture rather than freezing on the poster.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const events = ["pointerdown", "touchend", "keydown", "scroll"] as const;
    const cleanup = () => {
      for (const e of events) window.removeEventListener(e, retry);
    };
    const retry = () => {
      if (video.ended) {
        cleanup();
        return;
      }
      video.play().then(cleanup).catch(() => {});
    };

    video.play().catch(() => {
      for (const e of events)
        window.addEventListener(e, retry, { passive: true });
    });

    // A stalled media fetch (flaky network, poisoned media cache) never
    // fires ended or error — swap to the still rather than sit on the
    // poster. onPlaying flips back if playback recovers later.
    const watchdog = setTimeout(() => {
      if (video.readyState < 2) setShowStill(true);
    }, 4000);

    return () => {
      cleanup();
      clearTimeout(watchdog);
    };
  }, []);

  return (
    <div className={`overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => setShowStill(true)}
        onError={() => setShowStill(true)}
        onPlaying={() => setShowStill(false)}
      />
      <img
        src={still}
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          showStill ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
