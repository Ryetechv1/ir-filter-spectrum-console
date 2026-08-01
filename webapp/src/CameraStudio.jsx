import {
  Camera,
  Download,
  FlipHorizontal,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  X
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./cameraStudio.css";

const STUDIO_UNLOCK_KEY = "ir-filter-camera-studio-unlocked";
const TRUSTED_ACCESS = [
  {
    name: "Khiimori",
    handle: "mayaniorgthe1st444",
    profileUrl: "https://www.instagram.com/mayaniorgthe1st444?igsh=MXV6a2VobzBlNXJrbw==",
    sha256: "41c2f45346727de86a361d793c1be4ac005f9d4b3d071dfd9433df206ba90874"
  }
];

const DEFAULT_SETTINGS = {
  brightness: 100,
  contrast: 100,
  exposure: 0,
  saturation: 100,
  hue: 0,
  temperature: 0,
  tint: 0,
  blur: 0,
  vignette: 12,
  grain: 0,
  duotone: 0,
  glow: 0,
  sepia: 0,
  grayscale: 0,
  invert: 0
};

const EFFECT_FAMILIES = [
  {
    category: "Clean Studio",
    names: ["Neutral", "Soft Key", "Clear Lens", "Pearl Lift", "Fresh Glass", "Bright Desk", "True Tone", "Air Light", "Silver Skin", "Lucid Day"],
    color: "rgba(255,255,255,0.08)",
    blendMode: "screen",
    settings: { brightness: 108, contrast: 104, saturation: 102, exposure: 5 }
  },
  {
    category: "IR Simulations",
    names: ["Nite IR", "Ghost IR", "Infra Silver", "Soft 950", "Moon Sensor", "Black Forest", "Pale Foliage", "Spectral White", "Noir Sensor", "Deep IR"],
    color: "rgba(165,240,255,0.22)",
    blendMode: "screen",
    settings: { brightness: 112, contrast: 128, saturation: 10, grayscale: 78, glow: 8 }
  },
  {
    category: "UVA / Fluorescence",
    names: ["UVA Bloom", "Violet Scan", "Fluoro Edge", "Blacklight Pop", "Indigo Glass", "Mineral Glow", "Neon Violet", "Purple Lab", "UV Mist", "Amethyst"],
    color: "rgba(178,72,255,0.26)",
    blendMode: "screen",
    settings: { brightness: 106, contrast: 116, saturation: 138, hue: 18, tint: 24, glow: 14 }
  },
  {
    category: "Cinematic",
    names: ["Teal Orange", "Low Key", "Cinema Warm", "Matte Film", "Steel Scene", "Black Chrome", "Drama Soft", "Late Night", "Soft Focus", "Anamorphic"],
    color: "rgba(255,126,44,0.15)",
    blendMode: "overlay",
    settings: { brightness: 96, contrast: 126, saturation: 112, temperature: 18, vignette: 28, grain: 8 }
  },
  {
    category: "Cyber Neon",
    names: ["Cyber Cyan", "Magenta Drive", "Blue Relay", "Laser Pink", "Vaporwave", "Ion Blue", "Electric Club", "Data Rain", "Chrome Neon", "Arcade"],
    color: "rgba(21,205,255,0.26)",
    blendMode: "screen",
    settings: { brightness: 105, contrast: 132, saturation: 158, hue: 22, duotone: 22, glow: 22 }
  },
  {
    category: "Black & White",
    names: ["Silver Mono", "High Contrast BW", "Soft Noir", "Newsprint", "Old Lab", "Graphite", "Wet Plate", "Shadow Map", "Clean Mono", "White Flash"],
    color: "rgba(255,255,255,0.05)",
    blendMode: "screen",
    settings: { brightness: 103, contrast: 138, saturation: 0, grayscale: 100, grain: 12 }
  },
  {
    category: "Duotone",
    names: ["Blue Gold", "Red Cyan", "Violet Lime", "Pink Amber", "Aqua Rose", "Green Steel", "Copper Blue", "Ruby Slate", "Ice Flame", "Deep Split"],
    color: "rgba(255,64,128,0.24)",
    blendMode: "soft-light",
    settings: { brightness: 104, contrast: 121, saturation: 132, duotone: 46, tint: 20 }
  },
  {
    category: "Retro Film",
    names: ["Kodachrome Mood", "Sepia Plate", "Faded 90s", "Polaroid Warm", "Dusty Blue", "Home Movie", "Analog Push", "Contact Sheet", "Golden Fade", "Expired Roll"],
    color: "rgba(255,198,98,0.18)",
    blendMode: "overlay",
    settings: { brightness: 101, contrast: 92, saturation: 84, sepia: 28, grain: 18, temperature: 18 }
  },
  {
    category: "Night Vision",
    names: ["Matrix Green", "Scope Green", "Thermal Green", "Forest Scope", "Phosphor", "Tactical Low", "Monochrome NV", "Radar Green", "Glow Lens", "Dark Field"],
    color: "rgba(65,255,110,0.28)",
    blendMode: "screen",
    settings: { brightness: 96, contrast: 145, saturation: 44, hue: 68, grayscale: 44, glow: 18 }
  },
  {
    category: "Thermal Looks",
    names: ["Heat Map", "Solar Scan", "Amber Thermal", "Plasma Core", "Ember Field", "Radiant Skin", "Blue Heat", "Thermal Edge", "White Hot", "Black Hot"],
    color: "rgba(255,76,18,0.28)",
    blendMode: "color-dodge",
    settings: { brightness: 115, contrast: 152, saturation: 170, hue: -18, duotone: 36, glow: 20 }
  },
  {
    category: "Exposure Tools",
    names: ["Low Exposure", "High Exposure", "Shadow Lift", "Highlight Guard", "Contrast Pull", "Gamma Lift", "Soft HDR", "Hard HDR", "Backlight Save", "Window Light"],
    color: "rgba(255,255,255,0.1)",
    blendMode: "screen",
    settings: { brightness: 104, contrast: 116, saturation: 108, exposure: 14, vignette: 8 }
  },
  {
    category: "Color Lab",
    names: ["Hue Spin", "Warm Shift", "Cool Shift", "Tint Rose", "Tint Green", "Saturation Pop", "Muted Palette", "Deep Color", "Pastel Wash", "Prism"],
    color: "rgba(64,180,255,0.2)",
    blendMode: "overlay",
    settings: { brightness: 102, contrast: 108, saturation: 146, hue: 34, tint: 10 }
  }
];

const CAMERA_EFFECTS = EFFECT_FAMILIES.flatMap((family, familyIndex) =>
  family.names.map((name, index) => {
    const wave = index - 4.5;
    return {
      id: `${family.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
      name,
      category: family.category,
      overlayColor: family.color,
      blendMode: family.blendMode,
      favorite: index === 0 || index === 5,
      settings: {
        ...DEFAULT_SETTINGS,
        ...family.settings,
        brightness: clamp((family.settings.brightness ?? 100) + Math.round(wave * 1.5), 20, 220),
        contrast: clamp((family.settings.contrast ?? 100) + Math.round((index % 5) * 3), 20, 220),
        saturation: clamp((family.settings.saturation ?? 100) + Math.round((index % 4) * 5), 0, 260),
        hue: clamp((family.settings.hue ?? 0) + ((familyIndex * 17 + index * 9) % 82) - 41, -180, 180),
        vignette: clamp((family.settings.vignette ?? 12) + (index % 3) * 5, 0, 90),
        grain: clamp((family.settings.grain ?? 0) + (index % 4) * 2, 0, 80),
        glow: clamp((family.settings.glow ?? 0) + (index % 3) * 3, 0, 60)
      }
    };
  })
);

const CATEGORIES = ["All Presets", "Favorites", ...EFFECT_FAMILIES.map((family) => family.category)];

const ADJUSTMENTS = [
  ["brightness", "Brightness", 20, 220, "%"],
  ["contrast", "Contrast", 20, 220, "%"],
  ["exposure", "Exposure", -80, 80, ""],
  ["saturation", "Saturation", 0, 260, "%"],
  ["hue", "Hue", -180, 180, "deg"],
  ["temperature", "Temperature", -80, 80, ""],
  ["tint", "Tint", -80, 80, ""],
  ["blur", "Blur", 0, 12, "px"],
  ["vignette", "Vignette", 0, 90, "%"],
  ["grain", "Grain", 0, 80, "%"],
  ["duotone", "Duotone", 0, 100, "%"],
  ["glow", "Glow", 0, 60, "px"]
];

function CameraStudio() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [authorized, setAuthorized] = useState(() => window.sessionStorage.getItem(STUDIO_UNLOCK_KEY) === "true");
  const [accessCode, setAccessCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [cameraStatus, setCameraStatus] = useState("Enter the trusted access code, then allow camera permission.");
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [selectedCategory, setSelectedCategory] = useState("All Presets");
  const [search, setSearch] = useState("");
  const [selectedEffectId, setSelectedEffectId] = useState(CAMERA_EFFECTS[0].id);
  const [manualSettings, setManualSettings] = useState(CAMERA_EFFECTS[0].settings);
  const [snapshotUrl, setSnapshotUrl] = useState("");

  const selectedEffect = useMemo(
    () => CAMERA_EFFECTS.find((effect) => effect.id === selectedEffectId) || CAMERA_EFFECTS[0],
    [selectedEffectId]
  );

  const visibleEffects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return CAMERA_EFFECTS.filter((effect) => {
      const categoryMatch =
        selectedCategory === "All Presets" ||
        (selectedCategory === "Favorites" && effect.favorite) ||
        effect.category === selectedCategory;
      const queryMatch = !query || `${effect.name} ${effect.category}`.toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });
  }, [search, selectedCategory]);

  const filterCss = useMemo(() => buildFilterCss(manualSettings), [manualSettings]);
  const overlayStyle = useMemo(() => buildOverlayStyle(selectedEffect, manualSettings), [manualSettings, selectedEffect]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(
    async (nextFacingMode = facingMode) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraStatus("Camera access is not supported in this browser.");
        return;
      }
      stopCamera();
      setCameraStatus("Requesting camera permission...");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: nextFacingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setFacingMode(nextFacingMode);
        setCameraActive(true);
        setCameraStatus("Camera active. The video is local to this device and is not uploaded.");
      } catch (error) {
        setCameraActive(false);
        setCameraStatus(`Camera permission failed: ${error.message || error}`);
      }
    },
    [facingMode, stopCamera]
  );

  useEffect(() => () => stopCamera(), [stopCamera]);

  async function unlockStudio(event) {
    event.preventDefault();
    setAuthError("");
    if (!window.crypto?.subtle) {
      setAuthError("Secure access-code verification requires HTTPS or a modern local browser.");
      return;
    }
    const hash = await sha256(accessCode.trim());
    const trustedUser = TRUSTED_ACCESS.find((user) => user.sha256 === hash);
    if (!trustedUser) {
      setAuthError("Access code rejected. Ask the code holder for the current trusted code.");
      return;
    }
    window.sessionStorage.setItem(STUDIO_UNLOCK_KEY, "true");
    setAuthorized(true);
    setCameraStatus(`Access granted for ${trustedUser.name}. Requesting camera permission...`);
    await startCamera();
  }

  function selectEffect(effect) {
    setSelectedEffectId(effect.id);
    setManualSettings(effect.settings);
  }

  function updateSetting(key, value) {
    setManualSettings((current) => ({ ...current, [key]: Number(value) }));
  }

  async function flipCamera() {
    const nextFacingMode = facingMode === "user" ? "environment" : "user";
    await startCamera(nextFacingMode);
  }

  function resetStudio() {
    setSelectedEffectId(CAMERA_EFFECTS[0].id);
    setManualSettings(CAMERA_EFFECTS[0].settings);
    setSnapshotUrl("");
  }

  async function captureSnapshot() {
    const video = videoRef.current;
    if (!video || !cameraActive) {
      setCameraStatus("Start the camera before taking a snapshot.");
      return;
    }
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.filter = filterCss;
    context.drawImage(video, 0, 0, width, height);
    paintOverlay(context, width, height, selectedEffect, manualSettings);
    canvas.toBlob((blob) => {
      if (!blob) return;
      if (snapshotUrl) URL.revokeObjectURL(snapshotUrl);
      const url = URL.createObjectURL(blob);
      setSnapshotUrl(url);
      const link = document.createElement("a");
      link.href = url;
      link.download = `khiimori-camera-studio-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
      link.click();
      setCameraStatus("Snapshot downloaded locally.");
    }, "image/png");
  }

  return (
    <main className="camera-studio-shell">
      <header className="camera-studio-topbar">
        <div className="camera-studio-title">
          <Camera size={22} />
          <div>
            <h1>ESP32 IR Filter Console • Camera Studio</h1>
            <span>Secure local photo booth with virtual filters</span>
          </div>
        </div>
        <div className="studio-secure-pill">
          <ShieldCheck size={17} />
          Local device only
          <span>No uploads. No external camera required.</span>
        </div>
        <a className="trusted-user-pill" href={TRUSTED_ACCESS[0].profileUrl} target="_blank" rel="noreferrer">
          <UserRound size={16} />
          Trusted user: <strong>Khiimori</strong>
        </a>
        <button type="button" className="studio-close" onClick={closeStudioWindow} title="Close studio">
          <X size={22} />
        </button>
      </header>

      <section className="camera-studio-grid">
        <aside className="effect-browser studio-panel">
          <div className="studio-panel-heading">
            <h2>Effect Presets</h2>
            <span>{CAMERA_EFFECTS.length}</span>
          </div>
          <label className="studio-search">
            <Search size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search presets..." />
          </label>
          <div className="effect-category-list">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={category === selectedCategory ? "active" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                <Sparkles size={15} />
                <span>{category}</span>
                <strong>{countCategory(category)}</strong>
              </button>
            ))}
          </div>
          <div className="effect-preset-grid">
            {visibleEffects.map((effect) => (
              <button
                key={effect.id}
                type="button"
                className={effect.id === selectedEffectId ? "active" : ""}
                onClick={() => selectEffect(effect)}
              >
                <span style={{ background: effect.overlayColor }} />
                <strong>{effect.name}</strong>
                <small>{effect.category}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="camera-preview-panel studio-panel">
          <div className="camera-frame">
            <video ref={videoRef} playsInline muted style={{ filter: filterCss }} />
            <div className="studio-color-overlay" style={overlayStyle} />
            <div className="studio-grain" style={{ opacity: manualSettings.grain / 160 }} />
            <div className="studio-vignette" style={{ opacity: manualSettings.vignette / 100 }} />
            {!cameraActive && (
              <div className="camera-placeholder">
                <LockKeyhole size={40} />
                <strong>{authorized ? "Camera is waiting" : "Access code required"}</strong>
                <span>{authorized ? "Start camera to trigger the browser permission popup." : "Unlock the studio to request device camera access."}</span>
              </div>
            )}
            <div className="camera-corners" aria-hidden="true" />
            <div className="camera-live-badge">{cameraActive ? "Live" : "Locked"}</div>
            <div className="camera-meta-row">
              <span>{cameraActive ? "Local camera stream" : "No stream active"}</span>
              <span>{window.location.host || "local device"}</span>
              <span>{selectedEffect.name}</span>
            </div>
          </div>

          <div className="studio-action-row">
            <button type="button" onClick={() => startCamera()}>
              <Camera size={18} />
              {cameraActive ? "Restart Camera" : "Start Camera"}
            </button>
            <button type="button" onClick={flipCamera} disabled={!authorized}>
              <FlipHorizontal size={18} />
              Flip Camera
            </button>
            <button type="button" className="studio-snapshot" onClick={captureSnapshot} disabled={!cameraActive}>
              <Download size={19} />
              Snapshot
            </button>
            <button type="button" onClick={resetStudio}>
              <RefreshCw size={18} />
              Reset
            </button>
          </div>

          <p className="studio-status">{cameraStatus}</p>
          {snapshotUrl && (
            <a className="snapshot-review" href={snapshotUrl} target="_blank" rel="noreferrer">
              Open last local snapshot
            </a>
          )}
        </section>

        <aside className="adjustments-panel studio-panel">
          <div className="studio-panel-heading">
            <h2>Adjustments</h2>
            <button type="button" onClick={resetStudio}>Reset all</button>
          </div>
          <div className="adjustment-list">
            {ADJUSTMENTS.map(([key, label, min, max, unit]) => (
              <label key={key} className="studio-adjustment">
                <span>
                  <SlidersHorizontal size={15} />
                  {label}
                  <output>{manualSettings[key]}{unit}</output>
                </span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={manualSettings[key]}
                  onChange={(event) => updateSetting(key, event.target.value)}
                  style={{ "--value": `${((manualSettings[key] - min) / (max - min)) * 100}%` }}
                />
              </label>
            ))}
          </div>
          <div className="studio-reference-note">
            <KeyRound size={17} />
            <span>PineTools-style image operations and Canva-like filter intensity controls, rendered locally on live video.</span>
          </div>
        </aside>
      </section>

      {!authorized && (
        <div className="camera-access-overlay">
          <form className="camera-access-card" onSubmit={unlockStudio}>
            <LockKeyhole size={42} />
            <h2>Access Code Required</h2>
            <p>Enter the unique trusted code from the code holder. Camera permission is requested only after unlock.</p>
            <input
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              placeholder="KHIIMORI-XXXX-XXXX-..."
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
            {authError && <span className="camera-access-error">{authError}</span>}
            <button type="submit" className="studio-unlock-button">
              Unlock Studio
            </button>
            <button type="button" onClick={closeStudioWindow}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

function buildFilterCss(settings) {
  const brightness = clamp(settings.brightness + settings.exposure * 0.55, 5, 260);
  const contrast = clamp(settings.contrast + Math.abs(settings.exposure) * 0.12, 5, 260);
  return [
    `brightness(${brightness}%)`,
    `contrast(${contrast}%)`,
    `saturate(${settings.saturation}%)`,
    `hue-rotate(${settings.hue}deg)`,
    `blur(${settings.blur}px)`,
    `sepia(${settings.sepia}%)`,
    `grayscale(${settings.grayscale}%)`,
    `invert(${settings.invert}%)`,
    settings.glow ? `drop-shadow(0 0 ${settings.glow}px rgba(63,208,255,0.34))` : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function buildOverlayStyle(effect, settings) {
  const warm = settings.temperature > 0 ? `rgba(255,132,48,${settings.temperature / 260})` : `rgba(51,143,255,${Math.abs(settings.temperature) / 280})`;
  const tint = settings.tint > 0 ? `rgba(255,69,190,${settings.tint / 280})` : `rgba(67,255,122,${Math.abs(settings.tint) / 300})`;
  return {
    background: `linear-gradient(120deg, ${effect.overlayColor}, ${warm}), linear-gradient(300deg, ${tint}, transparent 62%)`,
    mixBlendMode: effect.blendMode,
    opacity: clamp(0.1 + settings.duotone / 150, 0, 0.92)
  };
}

function paintOverlay(context, width, height, effect, settings) {
  context.save();
  context.globalAlpha = clamp(0.08 + settings.duotone / 150, 0, 0.82);
  context.globalCompositeOperation = canvasCompositeMode(effect.blendMode);
  context.fillStyle = effect.overlayColor;
  context.fillRect(0, 0, width, height);
  if (settings.temperature !== 0) {
    context.globalAlpha = Math.abs(settings.temperature) / 220;
    context.fillStyle = settings.temperature > 0 ? "rgb(255,128,42)" : "rgb(54,138,255)";
    context.fillRect(0, 0, width, height);
  }
  if (settings.vignette > 0) {
    context.globalCompositeOperation = "multiply";
    const gradient = context.createRadialGradient(width / 2, height / 2, width * 0.12, width / 2, height / 2, width * 0.72);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(1, `rgba(0,0,0,${settings.vignette / 90})`);
    context.globalAlpha = 1;
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }
  context.restore();
}

function canvasCompositeMode(mode) {
  if (mode === "screen" || mode === "overlay" || mode === "soft-light" || mode === "color-dodge") return mode;
  return "source-over";
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await window.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function countCategory(category) {
  if (category === "All Presets") return CAMERA_EFFECTS.length;
  if (category === "Favorites") return CAMERA_EFFECTS.filter((effect) => effect.favorite).length;
  return CAMERA_EFFECTS.filter((effect) => effect.category === category).length;
}

function closeStudioWindow() {
  window.close();
  if (!window.closed) {
    const url = new URL(window.location.href);
    url.searchParams.delete("studio");
    window.location.href = url.toString();
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

export default CameraStudio;
