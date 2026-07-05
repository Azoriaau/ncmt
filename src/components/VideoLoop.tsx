"use client";

import { useState } from "react";

/**
 * Autoplaying, muted, looping background video with a graceful fallback:
 * until the file exists (or if it fails to load) a gradient placeholder is
 * shown instead, so the site works before the Seedance clips are dropped in.
 */
export default function VideoLoop({
  src,
  poster,
  className = "",
  label,
}: {
  src: string;
  poster?: string;
  className?: string;
  label?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`bg-gradient-to-br from-surface via-background to-black flex items-center justify-center ${className}`}
      >
        {label && (
          <span className="text-muted/60 font-mono text-xs tracking-widest uppercase">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <video
      className={`object-cover ${className}`}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onError={() => setFailed(true)}
    />
  );
}
