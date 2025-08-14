"use client";

import { motion, useInView } from "motion/react";
import { useRef, useMemo } from "react";

type AnimateBy = "words" | "letters";
type Direction = "top" | "bottom";
type AnimationSnapshot = Record<string, string | number>;

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: AnimateBy;
  direction?: Direction;
  threshold?: number;
  animationFrom?: AnimationSnapshot;
  animationTo?: AnimationSnapshot[];
  onAnimationComplete?: () => void;
  stepDuration?: number;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 0.02,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  animationFrom,
  animationTo,
  onAnimationComplete,
  stepDuration = 0.35,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
  });

  const elements = useMemo(
    () => (animateBy === "words" ? text.split(" ") : text.split("")),
    [text, animateBy]
  );

  const defaultFrom = useMemo<AnimationSnapshot>(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo<AnimationSnapshot[]>(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      {
        filter: "blur(0px)",
        opacity: 1,
        y: 0,
      },
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  const buildKeyframes = (
    from: AnimationSnapshot,
    steps: AnimationSnapshot[]
  ): Record<string, Array<string | number>> => {
    const keys = new Set<string>([
      ...Object.keys(from),
      ...steps.flatMap((step) => Object.keys(step)),
    ]);

    const keyframes: Record<string, Array<string | number>> = {};

    for (const key of keys) {
      keyframes[key] = [from[key], ...steps.map((step) => step[key])];
    }

    return keyframes;
  };

  const getAnimateKeyframes = () => {
    return buildKeyframes(fromSnapshot, toSnapshots);
  };

  const getTransition = (index: number) => {
    return {
      duration: totalDuration,
      times,
      delay: index * delay,
      ease: "easeOut" as const,
    };
  };

  return (
    <div
      ref={ref}
      className={`blur-text flex flex-wrap justify-center ${className}`}
    >
      {elements.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          initial={fromSnapshot}
          animate={isInView ? getAnimateKeyframes() : fromSnapshot}
          transition={getTransition(index)}
          style={{
            display: "inline-block",
            willChange: "transform, filter, opacity",
          }}
          onAnimationComplete={() => {
            if (index === elements.length - 1 && onAnimationComplete) {
              onAnimationComplete();
            }
          }}
        >
          {segment === " " ? "\u00A0" : segment}
          {animateBy === "words" && index < elements.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </div>
  );
};

export default BlurText;
