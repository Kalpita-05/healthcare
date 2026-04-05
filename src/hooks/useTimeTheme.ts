import { useEffect, useState } from "react";

type TimeTheme = "morning" | "afternoon" | "evening" | "night";

function getTheme(): TimeTheme {
  const h = new Date().getHours();
  if (h >= 5 && h <= 11) return "morning";
  if (h >= 12 && h <= 16) return "afternoon";
  if (h >= 17 && h <= 19) return "evening";
  return "night";
}

export function getGreeting(): string {
  const t = getTheme();
  if (t === "morning") return "Good Morning ☀️";
  if (t === "afternoon") return "Good Afternoon 🌤️";
  if (t === "evening") return "Good Evening 🌅";
  return "Good Night 🌙";
}

export function useTimeTheme() {
  const [theme, setTheme] = useState<TimeTheme>(getTheme);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.remove("theme-morning", "theme-afternoon", "theme-evening", "theme-night");
    el.classList.add(`theme-${theme}`);

    const interval = setInterval(() => {
      const next = getTheme();
      if (next !== theme) setTheme(next);
    }, 60_000);
    return () => clearInterval(interval);
  }, [theme]);

  return theme;
}
