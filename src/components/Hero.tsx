"use client";

import { motion, useReducedMotion } from "motion/react";
import HeroVideo from "./HeroVideo";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      <HeroVideo
        src="/videos/hero.mp4"
        poster="/videos/hero-poster.jpg"
        still="/videos/hero-still.jpg"
        className="absolute inset-0 h-full w-full"
      />
      {/* Darken the lower-left where the headline sits */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/30 to-transparent" />
      {/* Scrim under the nav — the clip's sky is too bright for light text */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 via-black/35 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 h-full flex flex-col justify-end pb-24">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-mono font-bold text-accent-bright text-scrim text-sm tracking-[0.3em] uppercase mb-4"
        >
          Family-owned. On the road since day one.
        </motion.p>
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="text-5xl sm:text-7xl font-semibold tracking-tight max-w-3xl text-balance"
        >
          Freight that never stops moving.
        </motion.h1>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-6 max-w-xl text-muted text-lg"
        >
          NCMT moves general freight and dedicated loads across Australia -
          reliably, on time, and with the care only a family business brings.
        </motion.p>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-10 flex gap-4"
        >
          <a
            href="#contact"
            className="bg-accent hover:bg-accent-dim transition-colors text-background font-medium rounded-full px-6 py-3"
          >
            Get a quote
          </a>
          <a
            href="#services"
            className="border border-white/20 hover:border-white/50 transition-colors rounded-full px-6 py-3"
          >
            What we carry
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted/60 text-xs font-mono tracking-widest uppercase"
      >
        scroll
      </motion.div>
    </section>
  );
}
