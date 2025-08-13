"use client";

import React from "react";
import { SplashScreen } from "@/components";
import { useSplash } from "@/contexts/SplashContext";

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { showSplash, setSplashComplete, isFirstLoad } = useSplash();

  return (
    <>
      {/* Splash Screen - only show on first load */}
      {showSplash && isFirstLoad && (
        <SplashScreen
          onComplete={setSplashComplete}
          duration={3000}
          showDuration={2000}
        />
      )}

      {/* Main Application Content */}
      {(!showSplash || !isFirstLoad) && children}
    </>
  );
};

export default AppWrapper;
