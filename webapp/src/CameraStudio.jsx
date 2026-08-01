import {
  Brush,
  Camera,
  Download,
  Eye,
  EyeOff,
  ExternalLink,
  FlipHorizontal,
  Film,
  KeyRound,
  Layers,
  LockKeyhole,
  Mail,
  MousePointerClick,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Square,
  Target,
  Trash2,
  Video,
  WandSparkles,
  Youtube,
  X
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./cameraStudio.css";

const APP_NAME = "༄SW’s SPECTRAL IMAGE STUDIO𒀼";
const STUDIO_UNLOCK_KEY = "ir-filter-camera-studio-unlocked";
const YOUTUBE_CHANNEL_URL = "https://youtube.com/@azel222?si=ytU4AFS_aaEr-NNA";
const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed?listType=user_uploads&list=azel222";
const CONTACT_EMAIL = "alola99990@gmail.com";
const CAPTURE_LIBRARY_LIMIT = 3;
const MAX_RECORDING_MS = 180000;
const ROI_LIMIT = 15;
const SMART_RECOGNITION_INTERVAL_MS = 900;
const RECORDING_RESOLUTIONS = {
  "1080p": { label: "1080P", width: 1920, height: 1080 },
  "2k": { label: "2K", width: 2560, height: 1440 }
};
const MP4_MIME_TYPES = [
  "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
  "video/mp4;codecs=h264",
  "video/mp4"
];
const TRUSTED_ACCESS = [
  {
    name: "Studio Access Holder",
    sha256: "89bf6309ac1633d01b1fc6af1c3e79fcb55464450e6db4534fd01084375c4a65"
  }
];

const RGBW_MIXERS = [
  { key: "main", label: "Main", defaults: { R: 64, G: 196, B: 255, W: 40 } },
  { key: "secondary", label: "Secondary", defaults: { R: 255, G: 78, B: 180, W: 24 } },
  { key: "third", label: "Third", defaults: { R: 132, G: 90, B: 255, W: 14 } },
  { key: "highlights", label: "Highlights", defaults: { R: 255, G: 238, B: 180, W: 96 } }
];

const RGBW_CHANNELS = [
  { key: "R", label: "Red", min: 0, max: 255, color: "#ff4d66" },
  { key: "G", label: "Green", min: 0, max: 255, color: "#61df7d" },
  { key: "B", label: "Blue", min: 0, max: 255, color: "#4cc7ff" },
  { key: "W", label: "White", min: 0, max: 255, color: "#f5f8fb" }
];

const AREA_MODES = [
  { key: "all", label: "All", description: "Edit the entire frame." },
  { key: "foreground", label: "Foreground", description: "Edit the detected main subject." },
  { key: "background", label: "Background", description: "Edit everything behind the subject." },
  { key: "click", label: "Click", description: "Click the camera preview to add a range of interest." },
  { key: "brush", label: "Brush", description: "Paint a range of interest directly on the preview." }
];

const INVERSION_ADJUSTMENTS = [
  ["classicInvert", "Classic RGB Invert", 0, 100, "%", 0],
  ["lumaInvert", "Luma Negative", 0, 100, "%", 0],
  ["channelInvert", "Channel Swap Invert", 0, 100, "%", 0],
  ["spectralInvert", "Spectral Invert", 0, 100, "%", 0],
  ["thermalInvert", "Thermal Black-Hot Invert", 0, 100, "%", 0]
];

const CORE_ADJUSTMENTS = [
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

const EXTRA_ADJUSTMENTS = [
  ["gamma", "Gamma", -100, 100, "", 0],
  ["shadows", "Shadows", -100, 100, "", 0],
  ["highlights", "Highlights", -100, 100, "", 0],
  ["whites", "Whites", -100, 100, "", 0],
  ["blacks", "Blacks", -100, 100, "", 0],
  ["clarity", "Clarity", -100, 100, "", 0],
  ["dehaze", "Dehaze", -100, 100, "", 0],
  ["fade", "Fade", 0, 100, "%", 0],
  ["vibrance", "Vibrance", -100, 100, "", 0],
  ["sharpen", "Sharpen", 0, 100, "%", 0],
  ["pixelate", "Pixelate", 0, 100, "%", 0],
  ["posterize", "Posterize", 0, 100, "%", 0],
  ["solarize", "Solarize", 0, 100, "%", 0],
  ["threshold", "Threshold", 0, 100, "%", 0],
  ["noiseReduction", "Noise Reduction", 0, 100, "%", 0],
  ["edgeEnhance", "Edge Enhance", 0, 100, "%", 0],
  ["emboss", "Emboss", 0, 100, "%", 0],
  ["bloom", "Bloom", 0, 100, "%", 0],
  ["halo", "Halo", 0, 100, "%", 0],
  ["lensFlare", "Lens Flare", 0, 100, "%", 0],
  ["chromaticAberration", "Chromatic", 0, 100, "%", 0],
  ["colorizeHue", "Colorize Hue", -180, 180, "deg", 0],
  ["colorizeStrength", "Colorize Strength", 0, 100, "%", 0],
  ["cyanBalance", "Cyan Balance", -100, 100, "", 0],
  ["magentaBalance", "Magenta Balance", -100, 100, "", 0],
  ["yellowBalance", "Yellow Balance", -100, 100, "", 0],
  ["redChannel", "Red Channel", 0, 200, "%", 100],
  ["greenChannel", "Green Channel", 0, 200, "%", 100],
  ["blueChannel", "Blue Channel", 0, 200, "%", 100],
  ["whiteBalance", "White Balance", -100, 100, "", 0],
  ["midtoneLift", "Midtone Lift", -100, 100, "", 0],
  ["shadowCrush", "Shadow Crush", 0, 100, "%", 0],
  ["matte", "Matte", 0, 100, "%", 0],
  ["glowRadius", "Glow Radius", 0, 80, "px", 0],
  ["glowStrength", "Glow Strength", 0, 100, "%", 0],
  ["softFocus", "Soft Focus", 0, 100, "%", 0],
  ["tiltShift", "Tilt Shift", 0, 100, "%", 0],
  ["radialBlur", "Radial Blur", 0, 100, "%", 0],
  ["motionBlur", "Motion Blur", 0, 100, "%", 0],
  ["filmGrainSize", "Film Grain Size", 0, 100, "%", 0],
  ["scanlines", "Scanlines", 0, 100, "%", 0],
  ["crtCurve", "CRT Curve", 0, 100, "%", 0],
  ["halation", "Halation", 0, 100, "%", 0],
  ["prismSplit", "Prism Split", 0, 100, "%", 0],
  ["infraredWash", "Infrared Wash", 0, 100, "%", 0],
  ["ultravioletWash", "Ultraviolet Wash", 0, 100, "%", 0],
  ["thermalBlend", "Thermal Blend", 0, 100, "%", 0],
  ["splitTone", "Split Tone", -100, 100, "", 0],
  ["colorDodge", "Color Dodge", 0, 100, "%", 0],
  ["overlayStrength", "Overlay Strength", 0, 100, "%", 28]
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
  invert: 0,
  ...Object.fromEntries(INVERSION_ADJUSTMENTS.map(([key, , , , , initial = 0]) => [key, initial])),
  ...Object.fromEntries(EXTRA_ADJUSTMENTS.map(([key, , , , , initial = 0]) => [key, initial])),
  ...Object.fromEntries(
    RGBW_MIXERS.flatMap((group) =>
      RGBW_CHANNELS.map((channel) => [`${group.key}${channel.key}`, group.defaults[channel.key]])
    )
  )
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

function CameraStudio() {
  const videoRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const cameraFrameAnchorRef = useRef(null);
  const previewFrameRef = useRef(0);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const recordingCanvasRef = useRef(null);
  const recordingFrameRef = useRef(0);
  const recordingTimerRef = useRef(null);
  const recordingStartedAtRef = useRef(0);
  const captureShelfRef = useRef([]);
  const brushPaintingRef = useRef(false);
  const foregroundBoxRef = useRef(null);
  const renderStateRef = useRef({
    selectedEffect: CAMERA_EFFECTS[0],
    manualSettings: CAMERA_EFFECTS[0].settings,
    foregroundSettings: CAMERA_EFFECTS[0].settings,
    backgroundSettings: CAMERA_EFFECTS[0].settings,
    roiRegions: [],
    foregroundEnabled: true,
    backgroundEnabled: true,
    autoDetectForeground: true,
    foregroundBox: null,
    cameraFacing: "user"
  });
  const [authorized, setAuthorized] = useState(() => window.sessionStorage.getItem(STUDIO_UNLOCK_KEY) === "true");
  const [accessCode, setAccessCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [cameraStatus, setCameraStatus] = useState("Enter the trusted access code. After unlock, use Start Camera to request browser permission.");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("user");
  const [recording, setRecording] = useState(false);
  const [recordingResolution, setRecordingResolution] = useState("1080p");
  const [recordingElapsed, setRecordingElapsed] = useState(0);
  const [recordingMimeType, setRecordingMimeType] = useState("");
  const [captureShelf, setCaptureShelf] = useState([]);
  const [youtubeWindowOpen, setYoutubeWindowOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Presets");
  const [search, setSearch] = useState("");
  const [selectedEffectId, setSelectedEffectId] = useState(CAMERA_EFFECTS[0].id);
  const [manualSettings, setManualSettings] = useState(CAMERA_EFFECTS[0].settings);
  const [foregroundSettings, setForegroundSettings] = useState(CAMERA_EFFECTS[0].settings);
  const [backgroundSettings, setBackgroundSettings] = useState(CAMERA_EFFECTS[0].settings);
  const [areaMode, setAreaMode] = useState("all");
  const [foregroundEnabled, setForegroundEnabled] = useState(true);
  const [backgroundEnabled, setBackgroundEnabled] = useState(true);
  const [autoDetectForeground, setAutoDetectForeground] = useState(true);
  const [smartRecognitionEnabled, setSmartRecognitionEnabled] = useState(true);
  const [smartAnalysis, setSmartAnalysis] = useState(() => fallbackSmartAnalysis(false));
  const [brushSize, setBrushSize] = useState(40);
  const [roiRegions, setRoiRegions] = useState([]);
  const [activeRoiId, setActiveRoiId] = useState("");
  const [snapshotUrl, setSnapshotUrl] = useState("");
  const [cameraHudActive, setCameraHudActive] = useState(false);
  const [cameraFrameHeight, setCameraFrameHeight] = useState(0);

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

  const activeRoi = useMemo(
    () => roiRegions.find((region) => region.id === activeRoiId) || null,
    [activeRoiId, roiRegions]
  );

  const activeEditSettings = useMemo(
    () => activeSettingsForMode(areaMode, manualSettings, foregroundSettings, backgroundSettings, activeRoi),
    [activeRoi, areaMode, backgroundSettings, foregroundSettings, manualSettings]
  );

  const smartRegions = smartAnalysis.regions || [];

  useEffect(() => {
    document.title = APP_NAME;
  }, []);

  useEffect(() => {
    const updateCameraHud = () => {
      const anchor = cameraFrameAnchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const anchorHeight = anchor.offsetHeight || rect.height || cameraFrameHeight;
      if (anchorHeight && !cameraHudActive) setCameraFrameHeight(anchorHeight);
      const activationDistance = Math.min(220, Math.max(96, anchorHeight * 0.28));
      const shouldFloat = rect.top < -activationDistance;
      setCameraHudActive(shouldFloat);
    };
    updateCameraHud();
    window.addEventListener("scroll", updateCameraHud, { passive: true });
    window.addEventListener("resize", updateCameraHud);
    return () => {
      window.removeEventListener("scroll", updateCameraHud);
      window.removeEventListener("resize", updateCameraHud);
    };
  }, [cameraFrameHeight, cameraHudActive]);

  useEffect(() => {
    renderStateRef.current = {
      selectedEffect,
      manualSettings,
      foregroundSettings,
      backgroundSettings,
      roiRegions,
      foregroundEnabled,
      backgroundEnabled,
      autoDetectForeground,
      foregroundBox: foregroundBoxRef.current,
      cameraFacing
    };
  }, [
    autoDetectForeground,
    backgroundEnabled,
    backgroundSettings,
    cameraFacing,
    foregroundEnabled,
    foregroundSettings,
    manualSettings,
    roiRegions,
    selectedEffect
  ]);

  const attachCameraStream = useCallback(async (stream, nextFacing = cameraFacing) => {
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
    setCameraFacing(nextFacing);
    setCameraActive(true);
    setCameraStatus("Camera active. The video is local to this device and is not uploaded.");
  }, [cameraFacing]);

  const updateActiveSettings = useCallback((updater) => {
    const apply = (current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      return { ...current, ...next };
    };
    if (areaMode === "foreground") {
      setForegroundSettings((current) => apply(current));
      return;
    }
    if (areaMode === "background") {
      setBackgroundSettings((current) => apply(current));
      return;
    }
    if ((areaMode === "click" || areaMode === "brush") && activeRoiId) {
      setRoiRegions((current) =>
        current.map((region) =>
          region.id === activeRoiId ? { ...region, settings: apply(region.settings), updatedAt: new Date().toISOString() } : region
        )
      );
      return;
    }
    if (areaMode === "click" || areaMode === "brush") {
      setCameraStatus("Select or paint a range of interest before changing range-only adjustments.");
      return;
    }
    setManualSettings((current) => apply(current));
  }, [activeRoiId, areaMode]);

  const ensureActiveRoi = useCallback((mode = areaMode) => {
    let existing = null;
    setRoiRegions((current) => {
      if (activeRoiId) {
        existing = current.find((region) => region.id === activeRoiId && region.mode === mode) || null;
        if (existing) return current;
      }
      if (current.length >= ROI_LIMIT) {
        existing = current[0] || null;
        if (existing) setActiveRoiId(existing.id);
        return current;
      }
      const region = createRoiRegion(current.length, mode);
      existing = region;
      setActiveRoiId(region.id);
      return [region, ...current];
    });
    return existing;
  }, [activeRoiId, areaMode]);

  const createNewRoi = useCallback((mode = areaMode) => {
    const nextMode = mode === "click" ? "click" : "brush";
    setRoiRegions((current) => {
      if (current.length >= ROI_LIMIT) {
        setCameraStatus("15 ranges of interest are already active. Remove one before adding another.");
        return current;
      }
      const region = createRoiRegion(current.length, nextMode);
      setActiveRoiId(region.id);
      setAreaMode(nextMode);
      return [region, ...current];
    });
  }, [areaMode]);

  const addRoiPoint = useCallback((point, mode = areaMode) => {
    let regionId = activeRoiId;
    setRoiRegions((current) => {
      let next = current;
      let region = regionId ? current.find((candidate) => candidate.id === regionId && candidate.mode === mode && !candidate.smartRegion) : null;
      if (!region) {
        if (current.length >= ROI_LIMIT) {
          setCameraStatus("15 ranges of interest are already active. Remove one before adding another.");
          return current;
        }
        region = createRoiRegion(current.length, mode);
        regionId = region.id;
        setActiveRoiId(region.id);
        next = [region, ...current];
      }
      return next.map((candidate) =>
        candidate.id === region.id
          ? {
              ...candidate,
              mode,
              enabled: true,
              points: [...candidate.points, point].slice(-700),
              updatedAt: new Date().toISOString()
            }
          : candidate
      );
    });
  }, [activeRoiId, areaMode]);

  const addCaptureToShelf = useCallback((capture) => {
    setCaptureShelf((current) => {
      const next = [capture, ...current].slice(0, CAPTURE_LIBRARY_LIMIT);
      const keptUrls = new Set(next.map((item) => item.url));
      current.forEach((item) => {
        if (!keptUrls.has(item.url)) URL.revokeObjectURL(item.url);
      });
      captureShelfRef.current = next;
      return next;
    });
  }, []);

  const removeCaptureFromShelf = useCallback((id) => {
    setCaptureShelf((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      const next = current.filter((item) => item.id !== id);
      captureShelfRef.current = next;
      return next;
    });
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("Camera access is not supported in this browser.");
      return;
    }
    stopCamera();
    setCameraStatus("Requesting camera permission...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      await attachCameraStream(stream, "user");
    } catch (error) {
      setCameraActive(false);
      setCameraStatus(`Camera permission failed: ${error.message || error}`);
    }
  }, [attachCameraStream, stopCamera]);

  const flipCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("Camera access is not supported in this browser.");
      return;
    }
    const nextFacing = cameraFacing === "user" ? "environment" : "user";
    stopCamera();
    setCameraStatus(`Requesting ${nextFacing === "user" ? "front" : "rear"} camera...`);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: nextFacing } });
      await attachCameraStream(stream, nextFacing);
      setCameraStatus(`${nextFacing === "user" ? "Front" : "Rear"} camera active. Local-only stream.`);
    } catch (error) {
      setCameraActive(false);
      setCameraStatus(`Camera flip failed: ${error.message || error}`);
    }
  }, [attachCameraStream, cameraFacing, stopCamera]);

  const stopRecording = useCallback((message = "Recording stopped.") => {
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (recordingFrameRef.current) {
      window.cancelAnimationFrame(recordingFrameRef.current);
      recordingFrameRef.current = 0;
    }
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      setCameraStatus(message);
      recorder.stop();
      return;
    }
    setRecording(false);
    setRecordingElapsed(0);
    recorderRef.current = null;
  }, []);

  const startRecording = useCallback(() => {
    if (!cameraActive || !videoRef.current) {
      setCameraStatus("Start the camera before recording video.");
      return;
    }
    if (recording) {
      setCameraStatus("Recording is already active.");
      return;
    }
    if (typeof MediaRecorder === "undefined") {
      setCameraStatus("MP4 recording is not supported in this browser.");
      return;
    }
    const mimeType = supportedMp4MimeType();
    if (!mimeType) {
      setCameraStatus("This browser does not expose MP4 MediaRecorder support. Try Safari, Edge, or a Chromium build with MP4 recording enabled.");
      return;
    }
    const resolution = RECORDING_RESOLUTIONS[recordingResolution] || RECORDING_RESOLUTIONS["1080p"];
    const canvas = document.createElement("canvas");
    canvas.width = resolution.width;
    canvas.height = resolution.height;
    recordingCanvasRef.current = canvas;
    const context = canvas.getContext("2d", { alpha: false });
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: recordingResolution === "2k" ? 14000000 : 8000000
    });
    recordingChunksRef.current = [];
    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data?.size) recordingChunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      if (recordingFrameRef.current) {
        window.cancelAnimationFrame(recordingFrameRef.current);
        recordingFrameRef.current = 0;
      }
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(recordingChunksRef.current, { type: mimeType });
      if (blob.size) {
        const url = URL.createObjectURL(blob);
        addCaptureToShelf({
          id: `video-${Date.now()}`,
          kind: "video",
          url,
          type: mimeType,
          extension: "mp4",
          label: `${resolution.label} MP4`,
          size: blob.size,
          createdAt: new Date().toISOString()
        });
      }
      recorderRef.current = null;
      recordingCanvasRef.current = null;
      recordingChunksRef.current = [];
      setRecording(false);
      setRecordingElapsed(0);
      setRecordingMimeType("");
      setCameraStatus(blob.size ? "MP4 recording saved to the local capture shelf." : "Recording stopped without saved video data.");
    };

    const drawFrame = () => {
      const video = videoRef.current;
      const renderState = { ...renderStateRef.current, foregroundBox: foregroundBoxRef.current };
      drawStudioFrame(context, resolution.width, resolution.height, video, renderState);
      recordingFrameRef.current = window.requestAnimationFrame(drawFrame);
    };
    drawFrame();
    recordingStartedAtRef.current = Date.now();
    recorder.start(1000);
    setRecording(true);
    setRecordingElapsed(0);
    setRecordingMimeType(mimeType);
    setCameraStatus(`Recording ${resolution.label} MP4 locally. Maximum length is 3 minutes.`);
    recordingTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - recordingStartedAtRef.current;
      setRecordingElapsed(Math.min(elapsed, MAX_RECORDING_MS));
      if (elapsed >= MAX_RECORDING_MS) stopRecording("Maximum 3-minute recording length reached.");
    }, 500);
  }, [addCaptureToShelf, cameraActive, recording, recordingResolution, stopRecording]);

  useEffect(
    () => () => {
      if (previewFrameRef.current) {
        window.cancelAnimationFrame(previewFrameRef.current);
        previewFrameRef.current = 0;
      }
      stopRecording("Recording stopped because the studio closed.");
      stopCamera();
      captureShelfRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    },
    [stopCamera, stopRecording]
  );

  useEffect(() => {
    if (!cameraActive) {
      if (previewFrameRef.current) {
        window.cancelAnimationFrame(previewFrameRef.current);
        previewFrameRef.current = 0;
      }
      return undefined;
    }
    const drawPreview = () => {
      const canvas = previewCanvasRef.current;
      const video = videoRef.current;
      if (canvas && video) {
        const width = video.videoWidth || 1280;
        const height = video.videoHeight || 720;
        if (canvas.width !== width) canvas.width = width;
        if (canvas.height !== height) canvas.height = height;
        const context = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
        drawStudioFrame(context, width, height, video, {
          ...renderStateRef.current,
          foregroundBox: foregroundBoxRef.current
        });
      }
      previewFrameRef.current = window.requestAnimationFrame(drawPreview);
    };
    drawPreview();
    return () => {
      if (previewFrameRef.current) {
        window.cancelAnimationFrame(previewFrameRef.current);
        previewFrameRef.current = 0;
      }
    };
  }, [cameraActive]);

  useEffect(() => {
    if (!cameraActive || !autoDetectForeground || typeof window.FaceDetector !== "function") {
      foregroundBoxRef.current = null;
      return undefined;
    }
    let cancelled = false;
    const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
    const detect = async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || cancelled) return;
      try {
        const faces = await detector.detect(video);
        const face = faces?.[0]?.boundingBox;
        foregroundBoxRef.current = face
          ? {
              x: face.x,
              y: face.y,
              width: face.width,
              height: face.height,
              sourceWidth: video.videoWidth || 1,
              sourceHeight: video.videoHeight || 1
            }
          : null;
      } catch {
        foregroundBoxRef.current = null;
      }
    };
    const timer = window.setInterval(detect, 1000);
    detect();
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [autoDetectForeground, cameraActive]);

  useEffect(() => {
    if (!cameraActive || !smartRecognitionEnabled) {
      setSmartAnalysis(fallbackSmartAnalysis(cameraActive));
      return undefined;
    }
    const analyze = () => {
      const video = videoRef.current;
      setSmartAnalysis(analyzeCameraFrame(video, foregroundBoxRef.current));
    };
    analyze();
    const timer = window.setInterval(analyze, SMART_RECOGNITION_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [cameraActive, smartRecognitionEnabled]);

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
    setCameraStatus("Access granted. Press Start Camera to trigger the browser permission popup.");
  }

  function selectEffect(effect) {
    setSelectedEffectId(effect.id);
    updateActiveSettings(effect.settings);
  }

  function updateSetting(key, value) {
    updateActiveSettings((current) => ({ ...current, [key]: Number(value) }));
  }

  function handleStopCamera() {
    stopRecording("Recording stopped because the camera was stopped.");
    stopCamera();
    setCameraStatus("Camera stopped. Press Start Camera to request camera access again.");
  }

  function resetStudio() {
    setSelectedEffectId(CAMERA_EFFECTS[0].id);
    setManualSettings(CAMERA_EFFECTS[0].settings);
    setForegroundSettings(CAMERA_EFFECTS[0].settings);
    setBackgroundSettings(CAMERA_EFFECTS[0].settings);
    setAreaMode("all");
    setForegroundEnabled(true);
    setBackgroundEnabled(true);
    setAutoDetectForeground(true);
    setBrushSize(40);
    setRoiRegions([]);
    setActiveRoiId("");
    setSnapshotUrl("");
  }

  function returnToFullCameraFrame() {
    setCameraHudActive(false);
    cameraFrameAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setCameraStatus("Returned to the full camera window for ROI editing, download, and capture controls.");
  }

  function setAreaModeAndScope(mode) {
    setAreaMode(mode);
    if (mode === "click") {
      setCameraStatus("Click mode ready. Tap the preview to select the best matching smart-recognized area.");
    } else if (mode === "brush") {
      setCameraStatus("Brush mode ready. Drag on the preview to paint a local range of interest.");
    } else {
      setCameraStatus(`${activeScopeLabel(mode)} adjustments are active.`);
    }
  }

  function autoAdjustActiveScope() {
    updateActiveSettings((current) => ({
      ...current,
      brightness: clamp(setting(current, "brightness", 100) + 8, 20, 220),
      contrast: clamp(setting(current, "contrast", 100) + 12, 20, 220),
      highlights: clamp(setting(current, "highlights") + 10, -100, 100),
      shadows: clamp(setting(current, "shadows") + 6, -100, 100),
      clarity: clamp(setting(current, "clarity") + 12, -100, 100),
      dehaze: clamp(setting(current, "dehaze") + 8, -100, 100)
    }));
    setCameraStatus(`Auto-adjust applied to ${activeScopeLabel(areaMode)}.`);
  }

  function deleteActiveRoi() {
    if (!activeRoiId) return;
    setRoiRegions((current) => current.filter((region) => region.id !== activeRoiId));
    setActiveRoiId("");
    setAreaMode("all");
    setCameraStatus("Range of interest removed.");
  }

  function toggleActiveRoi() {
    if (!activeRoiId) return;
    setRoiRegions((current) =>
      current.map((region) => (region.id === activeRoiId ? { ...region, enabled: !region.enabled } : region))
    );
  }

  function handlePreviewPointerDown(event) {
    if (!cameraActive || (areaMode !== "click" && areaMode !== "brush")) return;
    event.preventDefault();
    const point = pointerToCanvasPoint(event, previewCanvasRef.current, brushSize);
    if (!point) return;
    if (areaMode === "click") {
      createSmartRoiFromPoint(point);
      return;
    }
    addRoiPoint(point, areaMode);
    if (areaMode === "brush") {
      brushPaintingRef.current = true;
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }
  }

  function handlePreviewPointerMove(event) {
    if (!brushPaintingRef.current || areaMode !== "brush") return;
    event.preventDefault();
    const point = pointerToCanvasPoint(event, previewCanvasRef.current, brushSize);
    if (point) addRoiPoint(point, "brush");
  }

  function handlePreviewPointerUp(event) {
    brushPaintingRef.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

  function createSmartRoiFromPoint(point) {
    const selectedSmartRegion = selectSmartRegionAtPoint(point, smartRegions);
    const smartRegion = selectedSmartRegion || clickSpotSmartRegion(point);
    setRoiRegions((current) => {
      if (current.length >= ROI_LIMIT) {
        setCameraStatus("15 ranges of interest are already active. Remove one before adding another.");
        return current;
      }
      const region = createSmartRoiRegion(current.length, smartRegion);
      setActiveRoiId(region.id);
      setAreaMode("click");
      setCameraStatus(`Click selected smart area: ${smartRegion.label}.`);
      return [region, ...current];
    });
  }

  function createSmartRoiFromRegion(region) {
    setRoiRegions((current) => {
      if (current.length >= ROI_LIMIT) {
        setCameraStatus("15 ranges of interest are already active. Remove one before adding another.");
        return current;
      }
      const roi = createSmartRoiRegion(current.length, region);
      setActiveRoiId(roi.id);
      setAreaMode("click");
      setCameraStatus(`Smart recognition selected: ${region.label}.`);
      return [roi, ...current];
    });
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
    drawStudioFrame(context, width, height, video, {
      ...renderStateRef.current,
      foregroundBox: foregroundBoxRef.current
    });
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setSnapshotUrl(url);
      addCaptureToShelf({
        id: `photo-${Date.now()}`,
        kind: "photo",
        url,
        type: "image/png",
        extension: "png",
        label: "Photo PNG",
        size: blob.size,
        createdAt: new Date().toISOString()
      });
      const link = document.createElement("a");
      link.href = url;
      link.download = `spectral-imaging-studio-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
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
            <h1>{APP_NAME}</h1>
            <span>Secure local photo booth with virtual filters</span>
          </div>
        </div>
        <div className="studio-secure-pill">
          <ShieldCheck size={17} />
          Local device only
          <span>No uploads. No external camera required.</span>
        </div>
        <button type="button" className="trusted-user-pill" onClick={() => setYoutubeWindowOpen(true)}>
          <Youtube size={16} />
          YouTube channel
        </button>
        <button type="button" className="studio-close" onClick={closeStudioWindow} title="Close studio">
          <X size={22} />
        </button>
      </header>

      <section className="studio-intro-box" aria-labelledby="studioWelcomeTitle">
        <div className="studio-welcome-copy">
          <h2 id="studioWelcomeTitle">Welcome to Supernatural World’s Free Spectral Imaging Studio!</h2>
          <p>
            Make sure to ➠SUBSCRIBE ▶︎ to my YOUTUBE CHANNEL<br />
            ➥ SUPERNATURAL WORLD—@:<br />
            ⇲<a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer">https://youtube.com/@azel222?si=ytU4AFS_aaEr-NNA</a> ↸
          </p>
        </div>
        <div className="studio-disclosure-box">
          <h3>Privacy, Camera Access, And Local Recording Disclosure</h3>
          <p>
            This studio asks for camera access only after you unlock the page and press Start Camera. Your camera stream stays on your own
            device, inside your browser. The site does not upload, transmit, store, or remotely view your camera feed, photos, or recordings.
            Captures and recordings are created locally as browser object URLs and remain visible only in this browser session unless you
            download or share them yourself.
          </p>
          <p>
            Camera permission is controlled by your browser and operating system. You can stop the stream with Stop Camera or revoke site
            permission from your browser settings at any time. MP4 recording depends on your browser’s MediaRecorder support and automatically
            stops at 3 minutes.
          </p>
        </div>
        <div className="studio-guide-box">
          <h3>What The Studio Offers</h3>
          <ul>
            <li>120 local visual presets for IR-style, UVA-style, thermal, cinematic, monochrome, duotone, retro, and color-lab looks.</li>
            <li>Four RGBW gradient mixers for Main, Secondary, Third, and Highlights color layers.</li>
            <li>12 core photo controls plus 50 advanced sliders for exposure, color channels, glow, scanlines, IR/UVA washes, and more.</li>
            <li>Processed PNG snapshots and 1080P or 2K MP4 recordings with the studio effects applied.</li>
            <li>A local shelf for the latest 3 photos/videos, with preview, download, and remove controls.</li>
          </ul>
          <a href={`mailto:${CONTACT_EMAIL}`}><Mail size={15} /> {CONTACT_EMAIL}</a>
        </div>
      </section>

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

        <section className={`camera-preview-panel studio-panel${cameraHudActive ? " has-camera-hud" : ""}`}>
          <div
            ref={cameraFrameAnchorRef}
            className={`camera-frame-anchor${cameraHudActive ? " hud-active" : ""}`}
            style={cameraHudActive && cameraFrameHeight ? { minHeight: `${cameraFrameHeight}px` } : undefined}
          >
          <div className={`camera-frame${cameraHudActive ? " camera-frame-hud" : ""}`}>
            <video ref={videoRef} className={`source-camera-video${cameraFacing === "user" ? " is-mirrored" : ""}`} autoPlay playsInline muted />
            <canvas
              ref={previewCanvasRef}
              className="processed-preview-canvas"
              aria-label="Processed local camera preview"
              onPointerDown={handlePreviewPointerDown}
              onPointerMove={handlePreviewPointerMove}
              onPointerUp={handlePreviewPointerUp}
              onPointerCancel={handlePreviewPointerUp}
              onPointerLeave={handlePreviewPointerUp}
            />
            <div className="roi-visual-overlay" aria-hidden="true">
              {(areaMode === "foreground" || areaMode === "background") && <div className={`subject-outline ${areaMode}`} />}
              {roiRegions
                .filter((region) => region.enabled)
                .map((region) => (
                  <div className={`roi-region-visual${region.id === activeRoiId ? " active" : ""}`} key={region.id}>
                    {region.smartRegion ? (
                      <span className="smart-mask-dot" style={roiSmartVisualStyle(region.smartRegion)} />
                    ) : (
                      region.points.map((point, index) => <span key={`${region.id}-${index}`} style={roiPointVisualStyle(point)} />)
                    )}
                  </div>
                ))}
            </div>
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
              <span>{cameraFacing === "user" ? "Front camera" : "Rear camera"}</span>
              <span>{selectedEffect.name}</span>
            </div>
            {cameraHudActive && (
              <button type="button" className="camera-hud-tap-target" onClick={returnToFullCameraFrame} aria-label="Return to full camera editor">
                <span>Camera HUD</span>
                <strong>Tap to return to full editor</strong>
              </button>
            )}
          </div>
          </div>

          <section className="selective-editor-panel" aria-labelledby="selectiveEditorTitle">
            <div className="selective-editor-heading">
              <div>
                <h2 id="selectiveEditorTitle">Selective Area Studio</h2>
                <span>{activeScopeLabel(areaMode)} controls are active. Foreground/background and every range use the full filter stack.</span>
              </div>
              <strong>{roiRegions.length} / {ROI_LIMIT} ranges</strong>
            </div>
            <div className="area-mode-row" aria-label="Select edit area">
              {AREA_MODES.map((mode) => (
                <button
                  type="button"
                  key={mode.key}
                  className={areaMode === mode.key ? "active" : ""}
                  onClick={() => setAreaModeAndScope(mode.key)}
                  title={mode.description}
                >
                  {mode.key === "click" && <MousePointerClick size={16} />}
                  {mode.key === "brush" && <Brush size={16} />}
                  {mode.key === "foreground" && <Target size={16} />}
                  {mode.key === "background" && <Layers size={16} />}
                  {mode.key === "all" && <Sparkles size={16} />}
                  {mode.label}
                </button>
              ))}
            </div>
            <div className="selective-toggle-grid">
              <label className="canva-switch">
                <input type="checkbox" checked={autoDetectForeground} onChange={(event) => setAutoDetectForeground(event.target.checked)} />
                <span>Auto-detect foreground</span>
                <small>Beta</small>
              </label>
              <label className="canva-switch">
                <input type="checkbox" checked={foregroundEnabled} onChange={(event) => setForegroundEnabled(event.target.checked)} />
                <span>Foreground edits</span>
                {foregroundEnabled ? <Eye size={15} /> : <EyeOff size={15} />}
              </label>
              <label className="canva-switch">
                <input type="checkbox" checked={backgroundEnabled} onChange={(event) => setBackgroundEnabled(event.target.checked)} />
                <span>Background edits</span>
                {backgroundEnabled ? <Eye size={15} /> : <EyeOff size={15} />}
              </label>
            </div>
            <section className="smart-recognition-panel" aria-labelledby="smartRecognitionTitle">
              <div className="smart-recognition-heading">
                <div>
                  <h3 id="smartRecognitionTitle">Smart recognition</h3>
                  <span>{smartAnalysis.status}</span>
                </div>
                <label className="mini-toggle">
                  <input
                    type="checkbox"
                    checked={smartRecognitionEnabled}
                    onChange={(event) => setSmartRecognitionEnabled(event.target.checked)}
                  />
                  On
                </label>
              </div>
              <div className="smart-region-grid" aria-label="Recognized scene areas">
                {smartRegions.map((region) => (
                  <button key={region.id} type="button" onClick={() => createSmartRoiFromRegion(region)}>
                    <span>{region.category}</span>
                    <strong>{region.label}</strong>
                    <small>{Math.round(region.confidence * 100)}% • {region.description}</small>
                  </button>
                ))}
              </div>
            </section>
            <label className="brush-size-control">
              <span>Brush size <output>{brushSize}</output></span>
              <input type="range" min="8" max="140" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} />
            </label>
            <div className="roi-action-row">
              <button type="button" onClick={() => createNewRoi(areaMode === "click" ? "click" : "brush")} disabled={roiRegions.length >= ROI_LIMIT}>
                <Plus size={16} />
                New range
              </button>
              <button type="button" onClick={autoAdjustActiveScope}>
                <WandSparkles size={16} />
                Auto-adjust
              </button>
              <button type="button" onClick={toggleActiveRoi} disabled={!activeRoiId}>
                {activeRoi?.enabled === false ? <EyeOff size={16} /> : <Eye size={16} />}
                Toggle range
              </button>
              <button type="button" onClick={deleteActiveRoi} disabled={!activeRoiId}>
                <Trash2 size={16} />
                Delete range
              </button>
            </div>
            <div className="roi-region-list" aria-label="Ranges of interest">
              {roiRegions.length ? (
                roiRegions.map((region, index) => (
                  <button
                    key={region.id}
                    type="button"
                    className={region.id === activeRoiId ? "active" : ""}
                    onClick={() => {
                      setActiveRoiId(region.id);
                      setAreaMode(region.mode === "click" ? "click" : "brush");
                    }}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{region.name}</strong>
                    <small>{region.smartRegion ? region.smartRegion.category : `${region.points.length} marks`} • {region.enabled ? "on" : "off"}</small>
                  </button>
                ))
              ) : (
                <p>Choose Click or Brush, then mark the preview. You can keep up to 15 separate editable ranges.</p>
              )}
            </div>
          </section>

          <div className="studio-action-row">
            <button type="button" onClick={() => startCamera()}>
              <Camera size={18} />
              Start Camera
            </button>
            <button type="button" onClick={handleStopCamera} disabled={!cameraActive}>
              <X size={18} />
              Stop Camera
            </button>
            <button type="button" onClick={flipCamera} disabled={!cameraActive}>
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

          <section className="recording-panel" aria-labelledby="recordingPanelTitle">
            <div className="recording-panel-heading">
              <div>
                <h2 id="recordingPanelTitle">MP4 Video Recording</h2>
                <span>Processed canvas recording with studio effects applied. Max 3 minutes.</span>
              </div>
              <strong>{formatDuration(recordingElapsed)} / 3:00</strong>
            </div>
            <div className="resolution-selector" aria-label="Recording resolution">
              {Object.entries(RECORDING_RESOLUTIONS).map(([key, resolution]) => (
                <button
                  key={key}
                  type="button"
                  className={recordingResolution === key ? "active" : ""}
                  onClick={() => setRecordingResolution(key)}
                  disabled={recording}
                >
                  {resolution.label}
                  <span>{resolution.width} × {resolution.height}</span>
                </button>
              ))}
            </div>
            <div className="recording-action-row">
              <button type="button" className="studio-record-button" onClick={startRecording} disabled={!cameraActive || recording}>
                <Video size={18} />
                Start MP4
              </button>
              <button type="button" onClick={() => stopRecording("Recording stopped by user.")} disabled={!recording}>
                <Square size={16} />
                Stop Recording
              </button>
            </div>
            <p>{recording ? `Recording locally as ${recordingMimeType || "video/mp4"}...` : "Start Camera first, then choose 1080P or 2K and record."}</p>
          </section>

          <p className="studio-status">{cameraStatus}</p>
          {snapshotUrl && (
            <a className="snapshot-review" href={snapshotUrl} target="_blank" rel="noreferrer">
              Open last local snapshot
            </a>
          )}
          <section className="capture-shelf" aria-labelledby="captureShelfTitle">
            <div className="recording-panel-heading">
              <div>
                <h2 id="captureShelfTitle">Local Capture Storage</h2>
                <span>Latest 3 photos/videos from this browser session.</span>
              </div>
              <strong>{captureShelf.length} / {CAPTURE_LIBRARY_LIMIT}</strong>
            </div>
            {captureShelf.length ? (
              <div className="capture-shelf-grid">
                {captureShelf.map((item) => (
                  <article className="capture-card" key={item.id}>
                    <div className="capture-preview">
                      {item.kind === "photo" ? (
                        <img src={item.url} alt={`${item.label} preview`} />
                      ) : (
                        <video src={item.url} controls muted playsInline />
                      )}
                    </div>
                    <div className="capture-card-body">
                      <strong>{item.label}</strong>
                      <span>{formatFileSize(item.size)} • {formatCaptureTime(item.createdAt)}</span>
                      <div className="capture-card-actions">
                        <a href={item.url} download={captureDownloadName(item)}>
                          <Download size={14} />
                          Download
                        </a>
                        <button type="button" onClick={() => removeCaptureFromShelf(item.id)}>
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-capture-note">No local captures yet. Take a snapshot or record MP4 video to fill this shelf.</p>
            )}
          </section>
        </section>

        <aside className="adjustments-panel studio-panel">
          <div className="studio-panel-heading">
            <h2>Adjustments</h2>
            <button type="button" onClick={resetStudio}>Reset all</button>
          </div>
          <div className="active-scope-card">
            <span>Editing scope</span>
            <strong>{activeScopeLabel(areaMode)}</strong>
            <small>
              {areaMode === "click" || areaMode === "brush"
                ? activeRoi
                  ? `${activeRoi.name} has ${activeRoi.points.length} selected marks.`
                  : "Create or select a range of interest."
                : AREA_MODES.find((mode) => mode.key === areaMode)?.description}
            </small>
          </div>
          <div className="rgbw-mixer-board" aria-label="RGBW color mixers">
            {RGBW_MIXERS.map((group) => (
              <section className="rgbw-mixer" key={group.key}>
                <div className="rgbw-mixer-header">
                  <h3>{group.label}</h3>
                  <span style={{ background: rgbwCss(activeEditSettings, group.key, 1) }} />
                </div>
                {RGBW_CHANNELS.map((channel) => {
                  const settingKey = `${group.key}${channel.key}`;
                  const value = activeEditSettings[settingKey] ?? 0;
                  return (
                    <label key={settingKey} className={`rgbw-slider channel-${channel.key.toLowerCase()}`}>
                      <span>
                        <strong>{channel.key}</strong>
                        {channel.label}
                        <output>{value}</output>
                      </span>
                      <input
                        type="range"
                        min={channel.min}
                        max={channel.max}
                        value={value}
                        onChange={(event) => updateSetting(settingKey, event.target.value)}
                        style={{
                          "--value": `${(value / channel.max) * 100}%`,
                          "--channel-color": channel.color
                        }}
                      />
                    </label>
                  );
                })}
              </section>
            ))}
          </div>
          <div className="adjustment-group-label">Core photo controls</div>
          <div className="adjustment-list">
            {CORE_ADJUSTMENTS.map(([key, label, min, max, unit]) => (
              <label key={key} className="studio-adjustment">
                <span>
                  <SlidersHorizontal size={15} />
                  {label}
                  <output>{activeEditSettings[key]}{unit}</output>
                </span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={activeEditSettings[key]}
                  onChange={(event) => updateSetting(key, event.target.value)}
                  style={{ "--value": `${((activeEditSettings[key] - min) / (max - min)) * 100}%` }}
                />
              </label>
            ))}
          </div>
          <div className="adjustment-group-label">Color inversion tools ×5</div>
          <div className="adjustment-list">
            {INVERSION_ADJUSTMENTS.map(([key, label, min, max, unit]) => (
              <label key={key} className="studio-adjustment inversion-adjustment">
                <span>
                  <SlidersHorizontal size={15} />
                  {label}
                  <output>{activeEditSettings[key]}{unit}</output>
                </span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={activeEditSettings[key]}
                  onChange={(event) => updateSetting(key, event.target.value)}
                  style={{ "--value": `${((activeEditSettings[key] - min) / (max - min)) * 100}%` }}
                />
              </label>
            ))}
          </div>
          <div className="adjustment-group-label">Advanced effect controls +50</div>
          <div className="adjustment-list advanced-adjustment-list">
            {EXTRA_ADJUSTMENTS.map(([key, label, min, max, unit]) => (
              <label key={key} className="studio-adjustment">
                <span>
                  <SlidersHorizontal size={15} />
                  {label}
                  <output>{activeEditSettings[key]}{unit}</output>
                </span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={activeEditSettings[key]}
                  onChange={(event) => updateSetting(key, event.target.value)}
                  style={{ "--value": `${((activeEditSettings[key] - min) / (max - min)) * 100}%` }}
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
              placeholder="SP3CTR4L_X01-..."
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

      {youtubeWindowOpen && (
        <div className="youtube-window-backdrop" role="dialog" aria-modal="true" aria-labelledby="youtubeWindowTitle">
          <section className="youtube-window">
            <div className="youtube-window-heading">
              <div>
                <Youtube size={24} />
                <h2 id="youtubeWindowTitle">Supernatural World YouTube Channel</h2>
              </div>
              <button type="button" onClick={() => setYoutubeWindowOpen(false)} aria-label="Close YouTube channel window">
                <X size={20} />
              </button>
            </div>
            <div className="youtube-frame-shell">
              <iframe
                title="Supernatural World YouTube channel home page"
                src={YOUTUBE_CHANNEL_URL}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <div className="youtube-frame-fallback">
                <strong>YouTube may block channel pages inside embedded frames.</strong>
                <span>Use the button below if the homepage does not render in this GUI window.</span>
              </div>
            </div>
            <div className="youtube-window-actions">
              <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer">
                <ExternalLink size={16} />
                Open Channel Homepage
              </a>
              <a href={YOUTUBE_EMBED_URL} target="_blank" rel="noreferrer">
                <Film size={16} />
                Open Uploads Player
              </a>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function supportedMp4MimeType() {
  if (typeof MediaRecorder === "undefined" || typeof MediaRecorder.isTypeSupported !== "function") return "";
  return MP4_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function activeSettingsForMode(mode, allSettings, foregroundSettings, backgroundSettings, activeRoi) {
  if (mode === "foreground") return foregroundSettings;
  if (mode === "background") return backgroundSettings;
  if ((mode === "click" || mode === "brush") && activeRoi?.settings) return activeRoi.settings;
  if (mode === "click" || mode === "brush") return DEFAULT_SETTINGS;
  return allSettings;
}

function activeScopeLabel(mode) {
  if (mode === "foreground") return "Foreground";
  if (mode === "background") return "Background";
  if (mode === "click") return "Click range";
  if (mode === "brush") return "Brush range";
  return "All";
}

function createRoiRegion(index, mode = "brush") {
  const createdAt = new Date().toISOString();
  return {
    id: `roi-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: `Range ${String(index + 1).padStart(2, "0")}`,
    mode: mode === "click" ? "click" : "brush",
    enabled: true,
    points: [],
    settings: { ...DEFAULT_SETTINGS },
    createdAt,
    updatedAt: createdAt
  };
}

function createSmartRoiRegion(index, smartRegion) {
  const region = createRoiRegion(index, "click");
  return {
    ...region,
    name: smartRegion.label || `Smart area ${String(index + 1).padStart(2, "0")}`,
    smartRegion,
    points: [],
    updatedAt: new Date().toISOString()
  };
}

function pointerToCanvasPoint(event, canvas, brushSize) {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
  const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
  const radiusX = clamp((Number(brushSize) || 40) / 2 / rect.width, 0.004, 0.16);
  const radiusY = clamp((Number(brushSize) || 40) / 2 / rect.height, 0.004, 0.16);
  return { x, y, radius: Math.max(radiusX, radiusY), radiusX, radiusY };
}

function fallbackSmartAnalysis(active) {
  return {
    status: active ? "Using estimated scene fields until the next camera analysis pass." : "Start the camera to detect scene fields.",
    regions: buildDefaultSmartRegions(),
    updatedAt: new Date().toISOString()
  };
}

function buildDefaultSmartRegions(foregroundBox = null) {
  const subject = foregroundBoxToSmartRegion(foregroundBox) || {
    id: "depth-near-subject",
    category: "Depth",
    label: "Near-field subject",
    confidence: 0.72,
    description: "Estimated center subject plane",
    shape: "ellipse",
    cx: 0.5,
    cy: 0.48,
    rx: 0.28,
    ry: 0.43,
    priority: 14
  };
  const farBackground = {
    id: "depth-far-background",
    category: "Depth",
    label: "Far background",
    confidence: 0.63,
    description: "Outer area behind the near subject",
    shape: "outside-ellipse",
    cx: subject.cx,
    cy: subject.cy,
    rx: clamp(subject.rx * 1.12, 0.18, 0.48),
    ry: clamp(subject.ry * 1.08, 0.24, 0.62),
    priority: 8
  };
  return [
    subject,
    {
      id: "depth-mid-field",
      category: "Depth",
      label: "Mid-field focus",
      confidence: 0.58,
      description: "Middle depth band around the subject",
      shape: "ellipse",
      cx: 0.5,
      cy: 0.5,
      rx: 0.43,
      ry: 0.52,
      priority: 6
    },
    farBackground,
    {
      id: "depth-upper-plane",
      category: "Depth",
      label: "Upper depth plane",
      confidence: 0.52,
      description: "Top third of the camera view",
      shape: "rect",
      x: 0,
      y: 0,
      w: 1,
      h: 0.34,
      priority: 4
    },
    {
      id: "depth-lower-plane",
      category: "Depth",
      label: "Lower foreground plane",
      confidence: 0.52,
      description: "Lower third of the camera view",
      shape: "rect",
      x: 0,
      y: 0.66,
      w: 1,
      h: 0.34,
      priority: 4
    }
  ];
}

function analyzeCameraFrame(video, foregroundBox) {
  if (!video || video.readyState < 2) return fallbackSmartAnalysis(Boolean(video));
  const sampleWidth = 96;
  const sampleHeight = 54;
  const canvas = document.createElement("canvas");
  canvas.width = sampleWidth;
  canvas.height = sampleHeight;
  const context = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
  try {
    context.drawImage(video, 0, 0, sampleWidth, sampleHeight);
    const { data } = context.getImageData(0, 0, sampleWidth, sampleHeight);
    const cells = [];
    const cols = 4;
    const rows = 3;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        cells.push(sampleCellStats(data, sampleWidth, sampleHeight, col, row, cols, rows));
      }
    }

    const by = (key) => [...cells].sort((a, b) => b[key] - a[key]);
    const bright = by("luma")[0];
    const dark = by("shadow")[0];
    const detail = by("edge")[0];
    const warm = by("warmth")[0];
    const cool = by("coolness")[0];
    const saturated = by("saturation")[0];
    const regions = [
      ...buildDefaultSmartRegions(foregroundBox),
      buildCellSmartRegion("aspect-highlights", "Bright highlights", "Aspect", "Highest luminance field", bright, 0.7, 10),
      buildCellSmartRegion("aspect-shadows", "Deep shadows", "Aspect", "Darkest low-light field", dark, 0.67, 10),
      buildCellSmartRegion("aspect-detail", "High-detail edge field", "Aspect", "Strongest edge/texture field", detail, 0.64, 9),
      buildCellSmartRegion("aspect-warm", "Warm color field", "Color", "Warmest red/yellow-biased field", warm, 0.6, 7),
      buildCellSmartRegion("aspect-cool", "Cool color field", "Color", "Coolest blue/cyan-biased field", cool, 0.6, 7),
      buildCellSmartRegion("aspect-saturated", "Saturated color field", "Color", "Most color-rich field", saturated, 0.62, 8)
    ];
    return {
      status: `${regions.length} local depth/aspect fields detected.`,
      regions: regions.filter(Boolean),
      updatedAt: new Date().toISOString()
    };
  } catch {
    return fallbackSmartAnalysis(true);
  }
}

function sampleCellStats(data, width, height, col, row, cols, rows) {
  const x0 = Math.floor((col / cols) * width);
  const x1 = Math.floor(((col + 1) / cols) * width);
  const y0 = Math.floor((row / rows) * height);
  const y1 = Math.floor(((row + 1) / rows) * height);
  let count = 0;
  let luma = 0;
  let saturation = 0;
  let warmth = 0;
  let coolness = 0;
  let shadow = 0;
  let edge = 0;
  for (let y = y0; y < y1; y += 2) {
    for (let x = x0; x < x1; x += 2) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const currentLuma = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const rightIndex = (y * width + Math.min(width - 1, x + 2)) * 4;
      const downIndex = (Math.min(height - 1, y + 2) * width + x) * 4;
      const rightLuma = data[rightIndex] * 0.2126 + data[rightIndex + 1] * 0.7152 + data[rightIndex + 2] * 0.0722;
      const downLuma = data[downIndex] * 0.2126 + data[downIndex + 1] * 0.7152 + data[downIndex + 2] * 0.0722;
      luma += currentLuma;
      saturation += max ? (max - min) / max : 0;
      warmth += (r + g * 0.35 - b * 0.8 + 255) / 510;
      coolness += (b + g * 0.24 - r * 0.65 + 255) / 510;
      shadow += 255 - currentLuma;
      edge += Math.abs(currentLuma - rightLuma) + Math.abs(currentLuma - downLuma);
      count += 1;
    }
  }
  return {
    col,
    row,
    cols,
    rows,
    luma: count ? luma / count : 0,
    saturation: count ? saturation / count : 0,
    warmth: count ? warmth / count : 0,
    coolness: count ? coolness / count : 0,
    shadow: count ? shadow / count : 0,
    edge: count ? edge / count : 0
  };
}

function buildCellSmartRegion(id, label, category, description, cell, baseConfidence, priority) {
  if (!cell) return null;
  const padX = 0.01;
  const padY = 0.014;
  return {
    id,
    category,
    label,
    confidence: clamp(baseConfidence + Math.min(0.18, (cell.edge || cell.saturation || 0) / 480), 0.46, 0.94),
    description,
    shape: "rect",
    x: clamp(cell.col / cell.cols + padX, 0, 0.95),
    y: clamp(cell.row / cell.rows + padY, 0, 0.95),
    w: clamp(1 / cell.cols - padX * 2, 0.08, 1),
    h: clamp(1 / cell.rows - padY * 2, 0.08, 1),
    priority
  };
}

function foregroundBoxToSmartRegion(foregroundBox) {
  if (!foregroundBox?.width || !foregroundBox?.height || !foregroundBox?.sourceWidth || !foregroundBox?.sourceHeight) return null;
  const cx = clamp((foregroundBox.x + foregroundBox.width / 2) / foregroundBox.sourceWidth, 0.12, 0.88);
  const cy = clamp((foregroundBox.y + foregroundBox.height * 0.88) / foregroundBox.sourceHeight, 0.16, 0.88);
  return {
    id: "depth-detected-subject",
    category: "Depth",
    label: "Detected near-field subject",
    confidence: 0.86,
    description: "Face/subject-based foreground plane",
    shape: "ellipse",
    cx,
    cy,
    rx: clamp((foregroundBox.width / foregroundBox.sourceWidth) * 1.55, 0.18, 0.44),
    ry: clamp((foregroundBox.height / foregroundBox.sourceHeight) * 2.35, 0.24, 0.62),
    priority: 16
  };
}

function selectSmartRegionAtPoint(point, regions = []) {
  const candidates = regions
    .filter((region) => smartRegionContainsPoint(region, point))
    .sort((a, b) => b.priority + b.confidence * 3 - smartRegionArea(b) - (a.priority + a.confidence * 3 - smartRegionArea(a)));
  return candidates[0] || null;
}

function clickSpotSmartRegion(point) {
  return {
    id: `click-spot-${Date.now()}`,
    category: "Click",
    label: "Clicked local spot",
    confidence: 1,
    description: "Manual click-centered selection",
    shape: "ellipse",
    cx: point.x,
    cy: point.y,
    rx: clamp(point.radiusX * 2.6, 0.04, 0.16),
    ry: clamp(point.radiusY * 2.6, 0.04, 0.16),
    priority: 18
  };
}

function smartRegionContainsPoint(region, point) {
  if (!region || !point) return false;
  if (region.shape === "rect") {
    return point.x >= region.x && point.x <= region.x + region.w && point.y >= region.y && point.y <= region.y + region.h;
  }
  const dx = (point.x - region.cx) / Math.max(region.rx, 0.001);
  const dy = (point.y - region.cy) / Math.max(region.ry, 0.001);
  const inside = dx * dx + dy * dy <= 1;
  return region.shape === "outside-ellipse" ? !inside : inside;
}

function smartRegionArea(region) {
  if (region.shape === "rect") return (region.w || 0) * (region.h || 0);
  const ellipse = Math.PI * (region.rx || 0) * (region.ry || 0);
  return region.shape === "outside-ellipse" ? Math.max(0.12, 1 - ellipse) : ellipse;
}

function roiPointVisualStyle(point) {
  const radiusX = point.radiusX ?? point.radius ?? 0.04;
  const radiusY = point.radiusY ?? point.radius ?? 0.04;
  return {
    left: `${point.x * 100}%`,
    top: `${point.y * 100}%`,
    width: `${radiusX * 200 * 100}%`,
    height: `${radiusY * 200 * 100}%`,
    transform: "translate(-50%, -50%)"
  };
}

function roiSmartVisualStyle(region) {
  if (region.shape === "rect") {
    return {
      left: `${region.x * 100}%`,
      top: `${region.y * 100}%`,
      width: `${region.w * 100}%`,
      height: `${region.h * 100}%`,
      borderRadius: "18px",
      transform: "none"
    };
  }
  return {
    left: `${(region.cx - region.rx) * 100}%`,
    top: `${(region.cy - region.ry) * 100}%`,
    width: `${region.rx * 200 * 100}%`,
    height: `${region.ry * 200 * 100}%`,
    borderRadius: "999px",
    transform: "none"
  };
}

function drawStudioFrame(context, width, height, video, renderState) {
  const {
    selectedEffect,
    manualSettings,
    foregroundSettings,
    backgroundSettings,
    roiRegions = [],
    foregroundEnabled,
    backgroundEnabled,
    foregroundBox,
    autoDetectForeground,
    cameraFacing
  } = renderState;
  context.save();
  context.globalAlpha = 1;
  context.globalCompositeOperation = "source-over";
  context.filter = "none";
  context.fillStyle = "#030508";
  context.fillRect(0, 0, width, height);
  const base = renderProcessedLayer(width, height, video, {
    selectedEffect,
    settings: manualSettings,
    cameraFacing
  });
  context.drawImage(base, 0, 0);

  if (backgroundEnabled) {
    const background = renderProcessedLayer(width, height, video, {
      selectedEffect,
      settings: backgroundSettings,
      cameraFacing
    });
    context.save();
    clipBackgroundMask(context, width, height, foregroundBox, autoDetectForeground);
    context.drawImage(background, 0, 0);
    context.restore();
  }

  if (foregroundEnabled) {
    const foreground = renderProcessedLayer(width, height, video, {
      selectedEffect,
      settings: foregroundSettings,
      cameraFacing
    });
    context.save();
    clipForegroundMask(context, width, height, foregroundBox, autoDetectForeground);
    context.drawImage(foreground, 0, 0);
    context.restore();
  }

  roiRegions
    .filter((region) => region.enabled && (region.smartRegion || region.points?.length))
    .forEach((region) => {
      const layer = renderProcessedLayer(width, height, video, {
        selectedEffect,
        settings: region.settings,
        cameraFacing
      });
      context.save();
      if (clipRoiMask(context, width, height, region)) {
        context.drawImage(layer, 0, 0);
      }
      context.restore();
    });
  context.restore();
}

function renderProcessedLayer(width, height, video, { selectedEffect, settings, cameraFacing }) {
  const layer = document.createElement("canvas");
  layer.width = width;
  layer.height = height;
  const layerContext = layer.getContext("2d", { alpha: false, willReadFrequently: hasPixelInversion(settings) });
  layerContext.save();
  layerContext.filter = "none";
  layerContext.globalAlpha = 1;
  layerContext.globalCompositeOperation = "source-over";
  layerContext.fillStyle = "#030508";
  layerContext.fillRect(0, 0, width, height);
  if (video?.readyState >= 2) {
    const crop = coverCrop(video.videoWidth || width, video.videoHeight || height, width, height);
    layerContext.filter = buildFilterCss(settings);
    if (cameraFacing === "user") {
      layerContext.translate(width, 0);
      layerContext.scale(-1, 1);
    }
    layerContext.drawImage(video, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, width, height);
  }
  layerContext.restore();
  paintOverlay(layerContext, width, height, selectedEffect, settings);
  applyInversionEffects(layerContext, width, height, settings);
  return layer;
}

function coverCrop(sourceWidth, sourceHeight, targetWidth, targetHeight) {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;
  let sx = 0;
  let sy = 0;
  let sw = sourceWidth;
  let sh = sourceHeight;
  if (sourceRatio > targetRatio) {
    sw = sourceHeight * targetRatio;
    sx = (sourceWidth - sw) / 2;
  } else {
    sh = sourceWidth / targetRatio;
    sy = (sourceHeight - sh) / 2;
  }
  return { sx, sy, sw, sh };
}

function clipForegroundMask(context, width, height, foregroundBox, autoDetectForeground) {
  const mask = foregroundMaskRect(width, height, foregroundBox, autoDetectForeground);
  context.beginPath();
  context.ellipse(mask.cx, mask.cy, mask.rx, mask.ry, 0, 0, Math.PI * 2);
  context.clip();
}

function clipBackgroundMask(context, width, height, foregroundBox, autoDetectForeground) {
  const mask = foregroundMaskRect(width, height, foregroundBox, autoDetectForeground);
  const path = new Path2D();
  path.rect(0, 0, width, height);
  path.ellipse(mask.cx, mask.cy, mask.rx, mask.ry, 0, 0, Math.PI * 2);
  context.clip(path, "evenodd");
}

function foregroundMaskRect(width, height, foregroundBox, autoDetectForeground) {
  if (autoDetectForeground && foregroundBox?.width && foregroundBox?.height) {
    const crop = coverCrop(foregroundBox.sourceWidth, foregroundBox.sourceHeight, width, height);
    const cx = ((foregroundBox.x + foregroundBox.width / 2 - crop.sx) / crop.sw) * width;
    const cy = ((foregroundBox.y + foregroundBox.height / 2 - crop.sy) / crop.sh) * height;
    return {
      cx: clamp(cx, width * 0.18, width * 0.82),
      cy: clamp(cy + foregroundBox.height * 0.35, height * 0.18, height * 0.82),
      rx: clamp((foregroundBox.width / crop.sw) * width * 1.55, width * 0.18, width * 0.42),
      ry: clamp((foregroundBox.height / crop.sh) * height * 2.35, height * 0.26, height * 0.62)
    };
  }
  return {
    cx: width * 0.5,
    cy: height * 0.48,
    rx: width * 0.28,
    ry: height * 0.43
  };
}

function clipRoiMask(context, width, height, region) {
  if (region.smartRegion) return clipSmartRegionMask(context, width, height, region.smartRegion);
  if (!region.points?.length) return false;
  const path = new Path2D();
  region.points.forEach((point) => {
    const radiusX = clamp((point.radiusX ?? point.radius ?? 0.04) * width, 4, width * 0.22);
    const radiusY = clamp((point.radiusY ?? point.radius ?? 0.04) * height, 4, height * 0.22);
    path.moveTo(point.x * width + radiusX, point.y * height);
    path.ellipse(point.x * width, point.y * height, radiusX, radiusY, 0, 0, Math.PI * 2);
  });
  context.clip(path);
  return true;
}

function clipSmartRegionMask(context, width, height, region) {
  if (!region) return false;
  const path = new Path2D();
  if (region.shape === "rect") {
    path.rect(region.x * width, region.y * height, region.w * width, region.h * height);
    context.clip(path);
    return true;
  }
  const cx = region.cx * width;
  const cy = region.cy * height;
  const rx = clamp(region.rx * width, 6, width);
  const ry = clamp(region.ry * height, 6, height);
  if (region.shape === "outside-ellipse") {
    path.rect(0, 0, width, height);
    path.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    context.clip(path, "evenodd");
    return true;
  }
  path.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  context.clip(path);
  return true;
}

function buildFilterCss(settings) {
  const gammaLift = setting(settings, "gamma") * 0.2;
  const shadowLift = setting(settings, "shadows") * 0.16;
  const highlightLift = setting(settings, "highlights") * 0.18;
  const clarityBoost = setting(settings, "clarity") * 0.18;
  const dehazeBoost = setting(settings, "dehaze") * 0.2;
  const vibranceBoost = setting(settings, "vibrance") * 0.28;
  const channelAverage = (setting(settings, "redChannel", 100) + setting(settings, "greenChannel", 100) + setting(settings, "blueChannel", 100)) / 3 - 100;
  const brightness = clamp(settings.brightness + settings.exposure * 0.55 + gammaLift + shadowLift + highlightLift * 0.38 + channelAverage * 0.12, 5, 280);
  const contrast = clamp(settings.contrast + Math.abs(settings.exposure) * 0.12 + clarityBoost + dehazeBoost - setting(settings, "fade") * 0.28, 5, 280);
  const saturation = clamp(settings.saturation + vibranceBoost + setting(settings, "colorizeStrength") * 0.35 - setting(settings, "matte") * 0.15, 0, 320);
  const hue = clamp(settings.hue + setting(settings, "colorizeHue") * (setting(settings, "colorizeStrength") / 120), -360, 360);
  const sepia = clamp(settings.sepia + setting(settings, "whiteBalance") * 0.12 + Math.max(0, setting(settings, "temperature")) * 0.12, 0, 100);
  const grayscale = clamp(settings.grayscale + setting(settings, "threshold") * 0.2 - setting(settings, "vibrance") * 0.08, 0, 100);
  const invert = clamp(settings.invert + setting(settings, "solarize") * 0.35, 0, 100);
  const blur = clamp(settings.blur + setting(settings, "softFocus") * 0.04 + setting(settings, "radialBlur") * 0.02 + setting(settings, "motionBlur") * 0.018, 0, 18);
  const glowRadius = clamp(settings.glow + setting(settings, "glowRadius") * 0.28 + setting(settings, "bloom") * 0.13 + setting(settings, "halation") * 0.18, 0, 90);
  return [
    `brightness(${brightness}%)`,
    `contrast(${contrast}%)`,
    `saturate(${saturation}%)`,
    `hue-rotate(${hue}deg)`,
    `blur(${blur}px)`,
    `sepia(${sepia}%)`,
    `grayscale(${grayscale}%)`,
    `invert(${invert}%)`,
    glowRadius ? `drop-shadow(0 0 ${glowRadius}px ${rgbwCss(settings, "highlights", 0.34)})` : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function buildOverlayStyle(effect, settings) {
  const warm = settings.temperature > 0 ? `rgba(255,132,48,${settings.temperature / 260})` : `rgba(51,143,255,${Math.abs(settings.temperature) / 280})`;
  const tint = settings.tint > 0 ? `rgba(255,69,190,${settings.tint / 280})` : `rgba(67,255,122,${Math.abs(settings.tint) / 300})`;
  const main = rgbwCss(settings, "main", clamp(0.08 + setting(settings, "overlayStrength") / 180, 0.04, 0.72));
  const secondary = rgbwCss(settings, "secondary", clamp(0.04 + setting(settings, "duotone") / 180, 0, 0.66));
  const third = rgbwCss(settings, "third", clamp(0.04 + setting(settings, "splitTone") / 280, 0, 0.52));
  return {
    background: `linear-gradient(120deg, ${effect.overlayColor}, ${warm}, ${main}), linear-gradient(300deg, ${tint}, ${secondary}, transparent 62%), radial-gradient(circle at 50% 12%, ${third}, transparent 46%)`,
    mixBlendMode: effect.blendMode,
    opacity: clamp(0.1 + settings.duotone / 150 + setting(settings, "overlayStrength") / 240, 0, 0.94)
  };
}

function buildSpecialOverlayStyle(settings) {
  const main = rgbwCss(settings, "main", clamp(setting(settings, "overlayStrength") / 100, 0, 0.9));
  const secondary = rgbwCss(settings, "secondary", clamp(setting(settings, "colorDodge") / 120, 0, 0.82));
  const third = rgbwCss(settings, "third", clamp(setting(settings, "prismSplit") / 150, 0, 0.72));
  const highlights = rgbwCss(settings, "highlights", clamp((setting(settings, "bloom") + setting(settings, "halation") + setting(settings, "lensFlare")) / 260, 0, 0.88));
  const infrared = `rgba(255, 48, 44, ${clamp(setting(settings, "infraredWash") / 150, 0, 0.68)})`;
  const ultraviolet = `rgba(144, 82, 255, ${clamp(setting(settings, "ultravioletWash") / 145, 0, 0.72)})`;
  const thermal = `rgba(255, 188, 30, ${clamp(setting(settings, "thermalBlend") / 140, 0, 0.7)})`;
  const scanlineAlpha = clamp(setting(settings, "scanlines") / 160, 0, 0.62);
  const grainAlpha = clamp(setting(settings, "filmGrainSize") / 180, 0, 0.56);
  const split = clamp(setting(settings, "chromaticAberration") + setting(settings, "prismSplit"), 0, 200);
  return {
    backgroundImage: `
      radial-gradient(circle at 18% 18%, ${highlights}, transparent ${clamp(28 + setting(settings, "bloom") * 0.22, 28, 54)}%),
      radial-gradient(circle at 84% 14%, rgba(255,255,255,${clamp(setting(settings, "lensFlare") / 110, 0, 0.66)}), transparent 24%),
      linear-gradient(${88 + setting(settings, "colorizeHue") * 0.2}deg, ${main}, ${secondary}, ${third}, transparent 72%),
      linear-gradient(90deg, ${infrared}, transparent 38%, ${ultraviolet}, transparent 70%, ${thermal}),
      repeating-linear-gradient(0deg, rgba(255,255,255,${scanlineAlpha}) 0 1px, transparent 1px ${clamp(8 - setting(settings, "scanlines") / 20, 3, 8)}px),
      radial-gradient(circle at 50% 50%, transparent ${clamp(34 - setting(settings, "tiltShift") * 0.12, 18, 34)}%, rgba(0,0,0,${clamp(setting(settings, "shadowCrush") / 150, 0, 0.68)}) 100%),
      repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,${grainAlpha}) 0 1px, transparent 1px 5px)
    `,
    mixBlendMode: setting(settings, "colorDodge") > 24 ? "color-dodge" : setting(settings, "matte") > 24 ? "soft-light" : "screen",
    opacity: clamp(
      0.06 +
        setting(settings, "overlayStrength") / 160 +
        setting(settings, "bloom") / 240 +
        setting(settings, "infraredWash") / 320 +
        setting(settings, "ultravioletWash") / 320 +
        setting(settings, "thermalBlend") / 320,
      0,
      0.94
    ),
    transform: `translateX(${(setting(settings, "redChannel", 100) - setting(settings, "blueChannel", 100)) * 0.018 + split * 0.018}px) scale(${1 + setting(settings, "crtCurve") * 0.0009})`,
    filter: `blur(${clamp(setting(settings, "halo") * 0.03 + setting(settings, "softFocus") * 0.02, 0, 5)}px) contrast(${clamp(100 + setting(settings, "edgeEnhance") * 0.4 + setting(settings, "emboss") * 0.2, 100, 180)}%)`
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
  context.globalCompositeOperation = "screen";
  context.globalAlpha = clamp(setting(settings, "overlayStrength") / 170, 0.03, 0.62);
  const linear = context.createLinearGradient(0, 0, width, height);
  linear.addColorStop(0, rgbwCss(settings, "main", 1));
  linear.addColorStop(0.5, rgbwCss(settings, "secondary", 1));
  linear.addColorStop(1, rgbwCss(settings, "third", 1));
  context.fillStyle = linear;
  context.fillRect(0, 0, width, height);
  if (setting(settings, "bloom") || setting(settings, "halation") || setting(settings, "lensFlare")) {
    context.globalAlpha = clamp((setting(settings, "bloom") + setting(settings, "halation") + setting(settings, "lensFlare")) / 260, 0, 0.78);
    const flare = context.createRadialGradient(width * 0.5, height * 0.14, 0, width * 0.5, height * 0.14, width * 0.58);
    flare.addColorStop(0, rgbwCss(settings, "highlights", 1));
    flare.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = flare;
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

function hasPixelInversion(settings) {
  return INVERSION_ADJUSTMENTS.some(([key]) => setting(settings, key) > 0);
}

function applyInversionEffects(context, width, height, settings) {
  const classic = clamp(setting(settings, "classicInvert") / 100, 0, 1);
  const luma = clamp(setting(settings, "lumaInvert") / 100, 0, 1);
  const channel = clamp(setting(settings, "channelInvert") / 100, 0, 1);
  const spectral = clamp(setting(settings, "spectralInvert") / 100, 0, 1);
  const thermal = clamp(setting(settings, "thermalInvert") / 100, 0, 1);
  if (!classic && !luma && !channel && !spectral && !thermal) return;
  let imageData;
  try {
    imageData = context.getImageData(0, 0, width, height);
  } catch {
    return;
  }
  const data = imageData.data;
  for (let index = 0; index < data.length; index += 4) {
    let r = data[index];
    let g = data[index + 1];
    let b = data[index + 2];
    if (classic) {
      r = mix(r, 255 - r, classic);
      g = mix(g, 255 - g, classic);
      b = mix(b, 255 - b, classic);
    }
    if (luma) {
      const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const target = 255 - y;
      r = mix(r, target, luma);
      g = mix(g, target, luma);
      b = mix(b, target, luma);
    }
    if (channel) {
      const nr = 255 - g;
      const ng = 255 - b;
      const nb = 255 - r;
      r = mix(r, nr, channel);
      g = mix(g, ng, channel);
      b = mix(b, nb, channel);
    }
    if (spectral) {
      const nr = clamp(255 - b + g * 0.18, 0, 255);
      const ng = clamp(255 - r + b * 0.18, 0, 255);
      const nb = clamp(255 - g + r * 0.18, 0, 255);
      r = mix(r, nr, spectral);
      g = mix(g, ng, spectral);
      b = mix(b, nb, spectral);
    }
    if (thermal) {
      const heat = (r + g + b) / 3;
      const nr = clamp(255 - heat * 0.18, 0, 255);
      const ng = clamp(128 - heat * 0.42 + b * 0.2, 0, 255);
      const nb = clamp(255 - heat, 0, 255);
      r = mix(r, nr, thermal);
      g = mix(g, ng, thermal);
      b = mix(b, nb, thermal);
    }
    data[index] = r;
    data[index + 1] = g;
    data[index + 2] = b;
  }
  context.putImageData(imageData, 0, 0);
}

function mix(from, to, amount) {
  return clamp(from + (to - from) * amount, 0, 255);
}

function setting(settings, key, fallback = 0) {
  return Number(settings?.[key] ?? fallback) || 0;
}

function rgbwComponents(settings, groupKey) {
  const white = clamp(setting(settings, `${groupKey}W`), 0, 255);
  return {
    r: clamp(setting(settings, `${groupKey}R`) + white, 0, 255),
    g: clamp(setting(settings, `${groupKey}G`) + white, 0, 255),
    b: clamp(setting(settings, `${groupKey}B`) + white, 0, 255)
  };
}

function rgbwCss(settings, groupKey, alpha = 1) {
  const { r, g, b } = rgbwComponents(settings, groupKey);
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${clamp(alpha, 0, 1)})`;
}

function formatDuration(ms) {
  const totalSeconds = Math.floor((Number(ms) || 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatFileSize(bytes) {
  const size = Number(bytes) || 0;
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${size} B`;
}

function formatCaptureTime(value) {
  try {
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "local";
  }
}

function captureDownloadName(item) {
  const stamp = new Date(item.createdAt || Date.now()).toISOString().replace(/[:.]/g, "-");
  return `spectral-imaging-studio-${stamp}.${item.extension || (item.kind === "video" ? "mp4" : "png")}`;
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
