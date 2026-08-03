import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  applyAccentTheme,
  getAccentTheme,
  getSavedAccentThemeId,
  THEME_ACCENT_OPTIONS,
  THEME_ACCENT_STORAGE_KEY
} from "./themeAccent.js";
import "./accentThemePicker.css";

function AccentThemePicker() {
  const [selectedId, setSelectedId] = useState(getSavedAccentThemeId);
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);
  const selectedTheme = useMemo(() => getAccentTheme(selectedId), [selectedId]);

  useEffect(() => {
    applyAccentTheme(selectedTheme);
    try {
      window.localStorage.setItem(THEME_ACCENT_STORAGE_KEY, selectedTheme.id);
    } catch {
      // Keep the theme live even when persistence is unavailable.
    }
  }, [selectedTheme]);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!pickerRef.current || pickerRef.current.contains(event.target)) return;
      setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="accent-theme-picker" ref={pickerRef}>
      <button
        className="accent-theme-trigger"
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`App highlight color: ${selectedTheme.name}`}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="accent-theme-swatch" style={{ background: selectedTheme.accent }} />
        <span className="accent-theme-trigger-label">Aesthetic</span>
      </button>

      {open ? (
        <div className="accent-theme-menu" role="menu" aria-label="Select app highlight gradient color">
          <div className="accent-theme-grid">
            {THEME_ACCENT_OPTIONS.map((option) => (
              <button
                key={option.id}
                className={option.id === selectedTheme.id ? "is-selected" : ""}
                type="button"
                role="menuitemradio"
                aria-checked={option.id === selectedTheme.id}
                title={option.name}
                style={{ background: `linear-gradient(145deg, rgba(255, 255, 255, 0.22), rgba(0, 0, 0, 0.18)), ${option.accent}` }}
                onClick={() => {
                  setSelectedId(option.id);
                  setOpen(false);
                }}
              >
                <span className="sr-only">{option.name}</span>
              </button>
            ))}
          </div>
          <strong>{selectedTheme.name}</strong>
        </div>
      ) : null}
    </div>
  );
}

export default AccentThemePicker;
