"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

const stars = [
  { left: "8%", top: "18%", size: 2, delay: 0 },
  { left: "15%", top: "72%", size: 1, delay: 1.4 },
  { left: "24%", top: "36%", size: 1, delay: 0.8 },
  { left: "31%", top: "12%", size: 2, delay: 2.1 },
  { left: "42%", top: "58%", size: 1, delay: 0.3 },
  { left: "49%", top: "28%", size: 1, delay: 1.8 },
  { left: "57%", top: "80%", size: 2, delay: 1.1 },
  { left: "66%", top: "20%", size: 1, delay: 2.8 },
  { left: "74%", top: "48%", size: 1, delay: 0.5 },
  { left: "83%", top: "14%", size: 2, delay: 1.7 },
  { left: "89%", top: "65%", size: 1, delay: 0.2 },
  { left: "94%", top: "34%", size: 1, delay: 2.4 },
];

export default function AnimatedBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 90 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 90 });

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set((event.clientX / window.innerWidth - 0.5) * 36);
      mouseY.set((event.clientY / window.innerHeight - 0.5) * 36);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#f7f8fb] dark:bg-[#03040a]">
      <motion.div
        style={{ x: springX, y: springY }}
        className="absolute inset-[-12%] opacity-90 dark:opacity-100"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(125deg, rgba(255,255,255,0.94) 0%, rgba(228,235,246,0.74) 38%, rgba(210,230,226,0.48) 70%, rgba(247,248,251,0.96) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background:
              "linear-gradient(128deg, #03040a 0%, #09111e 34%, #0f1126 56%, #071b1d 78%, #03040a 100%)",
          }}
        />
        <motion.div
          animate={{ backgroundPosition: ["0% 45%", "100% 55%", "0% 45%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 opacity-75 mix-blend-multiply dark:opacity-70 dark:mix-blend-screen"
          style={{
            background:
              "linear-gradient(115deg, transparent 4%, rgba(45, 212, 191, 0.22) 24%, transparent 43%, rgba(251, 191, 36, 0.18) 58%, rgba(244, 114, 182, 0.16) 74%, transparent 92%)",
            backgroundSize: "220% 220%",
          }}
        />
      </motion.div>

      <div
        className="absolute inset-0 opacity-[0.34] dark:opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20, 28, 45, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 28, 45, 0.18) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, transparent, black 14%, black 74%, transparent)",
        }}
      />

      <motion.div
        animate={{ y: ["-8%", "8%", "-8%"], opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-18%] top-[18%] h-[42rem] w-[136%] rotate-[-14deg] border-y border-cyan-500/20 bg-cyan-300/10 blur-sm dark:border-cyan-300/20 dark:bg-cyan-300/5"
      />

      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute right-[-12rem] top-[-14rem] h-[42rem] w-[42rem] rounded-full border border-white/30 dark:border-white/10"
      />
      <motion.div
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 95, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20rem] left-[-12rem] h-[54rem] w-[54rem] rounded-full border border-amber-300/30 dark:border-amber-300/10"
      />

      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.span
            key={`${star.left}-${star.top}`}
            animate={{ opacity: [0.18, 0.9, 0.18], scale: [1, 1.6, 1] }}
            transition={{
              duration: 3.8,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-slate-700 shadow-[0_0_14px_rgba(20,184,166,0.45)] dark:bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 opacity-[0.055] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/90" />
    </div>
  );
}
