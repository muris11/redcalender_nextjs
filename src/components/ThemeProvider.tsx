"use client";

import { useAuthStore } from "@/store/authStore";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "kucing" | "gajah" | "unicorn";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const [theme, setThemeState] = useState<Theme>("kucing");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage first, then from user preference
    const savedTheme = localStorage.getItem("redcalendar_theme") as Theme;
    if (savedTheme && ["kucing", "gajah", "unicorn"].includes(savedTheme)) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Sync with user theme from database when user loads
    if (user?.theme && ["kucing", "gajah", "unicorn"].includes(user.theme)) {
      const userTheme = user.theme as Theme;
      setThemeState(userTheme);
      applyTheme(userTheme);
      localStorage.setItem("redcalendar_theme", userTheme);
    }
  }, [user?.theme]);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    // Remove all theme classes
    root.classList.remove("theme-kucing", "theme-gajah", "theme-unicorn");
    // Add new theme class
    root.classList.add(`theme-${newTheme}`);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("redcalendar_theme", newTheme);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
