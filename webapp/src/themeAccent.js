export const THEME_ACCENT_STORAGE_KEY = "sw-spectral-image-studio-accent-theme";

export const THEME_ACCENT_OPTIONS = [
  {
    id: "red",
    name: "Red",
    accent: "#ff2b2b",
    strong: "#ff7a7a",
    deep: "#b91c1c",
    rgb: "255, 43, 43",
    contrast: "#050507"
  },
  {
    id: "scarlet",
    name: "Scarlet",
    accent: "#ff1744",
    strong: "#ff6f91",
    deep: "#be123c",
    rgb: "255, 23, 68",
    contrast: "#050507"
  },
  {
    id: "red-orange",
    name: "Red-Orange",
    accent: "#ff4d1f",
    strong: "#ff9a6d",
    deep: "#c2410c",
    rgb: "255, 77, 31",
    contrast: "#050507"
  },
  {
    id: "orange",
    name: "Orange",
    accent: "#ff8a00",
    strong: "#ffc266",
    deep: "#c15b00",
    rgb: "255, 138, 0",
    contrast: "#050507"
  },
  {
    id: "yellow-orange",
    name: "Yellow-Orange",
    accent: "#ffb000",
    strong: "#ffd166",
    deep: "#b87500",
    rgb: "255, 176, 0",
    contrast: "#050507"
  },
  {
    id: "yellow",
    name: "Yellow",
    accent: "#ffd84d",
    strong: "#fff3a3",
    deep: "#c49a00",
    rgb: "255, 216, 77",
    contrast: "#050507"
  },
  {
    id: "lime",
    name: "Yellow-Green/Lime",
    accent: "#a3ff12",
    strong: "#d8ff82",
    deep: "#65a30d",
    rgb: "163, 255, 18",
    contrast: "#050507"
  },
  {
    id: "green",
    name: "Green",
    accent: "#22c55e",
    strong: "#86efac",
    deep: "#15803d",
    rgb: "34, 197, 94",
    contrast: "#050507"
  },
  {
    id: "teal-cyan",
    name: "Green-Blue/Teal/Cyan",
    accent: "#22d3ee",
    strong: "#8ce8ff",
    deep: "#0891b2",
    rgb: "34, 211, 238",
    contrast: "#050507"
  },
  {
    id: "blue",
    name: "Blue",
    accent: "#3b82f6",
    strong: "#93c5fd",
    deep: "#1d4ed8",
    rgb: "59, 130, 246",
    contrast: "#f8fbff"
  },
  {
    id: "blue-purple",
    name: "Blue-Purple",
    accent: "#6366f1",
    strong: "#a5b4fc",
    deep: "#4338ca",
    rgb: "99, 102, 241",
    contrast: "#f8fbff"
  },
  {
    id: "purple-violet",
    name: "Purple/Violet",
    accent: "#8b5cf6",
    strong: "#c4b5fd",
    deep: "#6d28d9",
    rgb: "139, 92, 246",
    contrast: "#f8fbff"
  },
  {
    id: "magenta",
    name: "Magenta",
    accent: "#ec4899",
    strong: "#f9a8d4",
    deep: "#be185d",
    rgb: "236, 72, 153",
    contrast: "#050507"
  },
  {
    id: "white",
    name: "White",
    accent: "#f8fafc",
    strong: "#ffffff",
    deep: "#cbd5e1",
    rgb: "248, 250, 252",
    contrast: "#050507"
  },
  {
    id: "gray-50",
    name: "50% Gray",
    accent: "#808080",
    strong: "#c7c7c7",
    deep: "#545454",
    rgb: "128, 128, 128",
    contrast: "#f8fbff"
  }
];

export const DEFAULT_THEME_ACCENT_ID = "teal-cyan";

export function getAccentTheme(id = DEFAULT_THEME_ACCENT_ID) {
  return THEME_ACCENT_OPTIONS.find((option) => option.id === id) || THEME_ACCENT_OPTIONS.find((option) => option.id === DEFAULT_THEME_ACCENT_ID);
}

export function getSavedAccentThemeId() {
  try {
    return window.localStorage.getItem(THEME_ACCENT_STORAGE_KEY) || DEFAULT_THEME_ACCENT_ID;
  } catch {
    return DEFAULT_THEME_ACCENT_ID;
  }
}

export function applyAccentTheme(theme) {
  if (!theme || typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--theme-accent", theme.accent);
  root.style.setProperty("--theme-accent-strong", theme.strong);
  root.style.setProperty("--theme-accent-deep", theme.deep);
  root.style.setProperty("--theme-accent-rgb", theme.rgb);
  root.style.setProperty("--theme-accent-contrast", theme.contrast);
  root.style.setProperty("--cyan", theme.accent);
}
