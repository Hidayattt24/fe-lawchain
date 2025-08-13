"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface SplashContextType {
  showSplash: boolean;
  setSplashComplete: () => void;
  isFirstLoad: boolean;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

interface SplashProviderProps {
  children: ReactNode;
}

export const SplashProvider: React.FC<SplashProviderProps> = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Check if this is the first load
    const hasLoadedBefore = sessionStorage.getItem("lawchain-loaded");

    if (hasLoadedBefore) {
      // If already loaded in this session, skip splash
      setShowSplash(false);
      setIsFirstLoad(false);
    } else {
      // First load, show splash
      setIsFirstLoad(true);
    }
  }, []);

  const setSplashComplete = () => {
    setShowSplash(false);
    // Mark as loaded in this session
    sessionStorage.setItem("lawchain-loaded", "true");
  };

  return (
    <SplashContext.Provider
      value={{ showSplash, setSplashComplete, isFirstLoad }}
    >
      {children}
    </SplashContext.Provider>
  );
};

export const useSplash = () => {
  const context = useContext(SplashContext);
  if (context === undefined) {
    throw new Error("useSplash must be used within a SplashProvider");
  }
  return context;
};
