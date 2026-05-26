"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-24 pb-16 text-center sm:px-8 sm:pt-32 sm:pb-24"
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]"
      >
        {profile.grade} · {profile.school}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
        className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight text-[var(--color-fg)] sm:text-6xl md:text-7xl"
      >
        {profile.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
        className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-muted)] sm:text-xl"
      >
        {profile.tagline}
      </motion.p>
    </section>
  );
}
