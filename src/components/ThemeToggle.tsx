"use client";

import { IconSun, IconMoon } from "@tabler/icons-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 left-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <IconSun className="h-6 w-6 text-white" />
      ) : (
        <IconMoon className="h-6 w-6 text-black" />
      )}
    </button>
  );
};

export default ThemeToggle;
