"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero background video that plays once, then fades to a still image
 * (the clip's final frame). Falls back to the still if the video fails
 * to load or the browser blocks autoplay.
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
  const [ended, setEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Kick playback once on mount only — re-running play() after the
  // "ended" re-render would restart the clip. Autoplay can be blocked
  // (e.g. data saver); show the still instead of a frozen first frame.
  useEffect(() => {
    videoRef.current?.play().catch(() => setEnded(true));
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
        onEnded={() => setEnded(true)}
        onError={() => setEnded(true)}
      />
      <img
        src={still}
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          ended ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
