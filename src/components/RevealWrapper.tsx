"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ReactNode } from "react";

interface RevealWrapperProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
  stagger?: boolean;
}

const RevealWrapper = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 60,
  className = "",
  threshold = 0.1,
  once = true,
  stagger = false,
}: RevealWrapperProps) => {
  const { ref, isVisible } = useScrollReveal({ threshold, once });

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, opacity: 0 };
      case "down":
        return { y: -distance, opacity: 0 };
      case "left":
        return { x: distance, opacity: 0 };
      case "right":
        return { x: -distance, opacity: 0 };
      case "scale":
        return { scale: 0.8, opacity: 0 };
      case "fade":
        return { opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case "up":
      case "down":
        return { y: 0, opacity: 1 };
      case "left":
      case "right":
        return { x: 0, opacity: 1 };
      case "scale":
        return { scale: 1, opacity: 1 };
      case "fade":
        return { opacity: 1 };
      default:
        return { y: 0, opacity: 1 };
    }
  };

  const springTransition = {
    type: "spring" as const,
    damping: 25,
    stiffness: 120,
    delay,
  };

  const easeTransition = {
    duration,
    delay,
    ease: [0.25, 0.1, 0.25, 1] as const,
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialPosition()}
      animate={isVisible ? getAnimatePosition() : getInitialPosition()}
      transition={direction === "scale" ? springTransition : easeTransition}
      whileInView={stagger ? getAnimatePosition() : undefined}
      viewport={{ once, amount: threshold }}
    >
      {children}
    </motion.div>
  );
};

export default RevealWrapper;
