"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParticlesProps {
  count?: number;
  color?: string;
  className?: string;
  minSize?: number;
  maxSize?: number;
  maxOpacity?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
}

function generateParticles(
  count: number,
  minSize: number,
  maxSize: number,
  maxOpacity: number
): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: minSize + Math.random() * (maxSize - minSize),
    opacity: 0.1 + Math.random() * (maxOpacity - 0.1),
    driftX: (Math.random() - 0.5) * 60,
    driftY: (Math.random() - 0.5) * 60,
    duration: 15 + Math.random() * 25,
    delay: Math.random() * 10,
  }));
}

export function Particles({
  count = 30,
  color = "rgba(139, 164, 120, 0.3)",
  className,
  minSize = 2,
  maxSize = 6,
  maxOpacity = 0.35,
}: ParticlesProps) {
  const [mounted, setMounted] = useState(false);

  // Generate stable particles only on mount to avoid hydration mismatch
  const particles = useMemo(
    () => (mounted ? generateParticles(count, minSize, maxSize, maxOpacity) : []),
    [mounted, count, minSize, maxSize, maxOpacity]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
          }}
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: [0, particle.opacity, particle.opacity, 0],
            scale: [0.5, 1, 1, 0.5],
            x: [0, particle.driftX * 0.5, particle.driftX, 0],
            y: [0, particle.driftY * 0.5, particle.driftY, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default Particles;
