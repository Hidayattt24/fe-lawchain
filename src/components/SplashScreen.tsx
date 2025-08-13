"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Aurora from "./Aurora";

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
  showDuration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 3000,
  showDuration = 2000,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(0);
  const [logoScale, setLogoScale] = useState(0.8);

  useEffect(() => {
    // Fade in animation
    const fadeInTimer = setTimeout(() => {
      setOpacity(1);
      setLogoScale(1);
    }, 100);

    // Start fade out animation
    const fadeOutTimer = setTimeout(() => {
      setOpacity(0);
      setLogoScale(1.1);
    }, showDuration);

    // Complete hide and call onComplete
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, duration, showDuration]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ease-in-out bg-black"
      style={{ opacity }}
    >
      {/* Splash Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo with scale animation */}
        <div
          className="transition-all duration-1000 ease-out mb-8 animate-glow"
          style={{
            transform: `scale(${logoScale})`,
          }}
        >
          <Image
            src="/logo.svg"
            alt="LawChain Logo"
            width={206}
            height={80}
            priority
            className="h-auto w-auto"
          />
        </div>

        {/* Welcome Text with slide up animation */}
        <div
          className="text-center animate-fade-in-up"
          style={{
            animationDelay: "500ms",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        ></div>

        {/* Loading animation */}
        <div
          className="mt-12 animate-fade-in-up"
          style={{
            animationDelay: "1000ms",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        ></div>
      </div>
    </div>
  );
};

export default SplashScreen;
