"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg bg-warm-200 dark:bg-warm-800 animate-pulse" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-warm-600 hover:bg-warm-200 dark:text-warm-400 dark:hover:bg-warm-800/50 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-5 h-5" />
          <span>Modo Claro</span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5" />
          <span>Modo Oscuro</span>
        </>
      )}
    </button>
  );
}
