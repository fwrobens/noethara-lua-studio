import { useEffect, useState } from "react";

export const themes = [
  { id: "charcoal", label: "Charcoal" },
  { id: "midnight", label: "Midnight" },
  { id: "obsidian", label: "Obsidian" },
] as const;
export type ThemeId = (typeof themes)[number]["id"];

export function useTheme() {
  const [theme, setTheme] = useState<ThemeId>("charcoal");
  useEffect(() => {
    const t = localStorage.getItem("noethara-theme") as ThemeId | null;
    if (t && themes.some((x) => x.id === t)) setTheme(t);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("noethara-theme", theme);
  }, [theme]);
  return [theme, setTheme] as const;
}
