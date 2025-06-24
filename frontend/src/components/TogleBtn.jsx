import React from 'react'
import { Sun, Moon } from "lucide-react";
import { useTheme } from './theme-provider';
const TogleBtn = () => {
    const { theme, setTheme } = useTheme();

  return (
    <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-10 h-10 absolute top-2 right-2 flex items-center justify-center rounded-full border border-border bg-background/30 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
  )
}

export default TogleBtn;