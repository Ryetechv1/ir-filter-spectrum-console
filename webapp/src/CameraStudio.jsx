import {
  Camera,
  Download,
  ExternalLink,
  FlipHorizontal,
  Film,
  ImagePlus,
  KeyRound,
  Layers,
  LockKeyhole,
  Mail,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Square,
  Trash2,
  Upload,
  Video,
  Youtube,
  Zap,
  X
} from "lucide-react";
import React, { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import "./cameraStudio.css";

const STUDIO_UNLOCK_KEY = "ir-filter-camera-studio-unlocked-2026";
const YOUTUBE_CHANNEL_HANDLE = "@azel222";
const YOUTUBE_CHANNEL_NAME = "Supernatural World";
const YOUTUBE_CHANNEL_ID = "UCZd1C1Gw4Pjm4tiIJep4Oaw";
const YOUTUBE_UPLOADS_PLAYLIST_ID = `UU${YOUTUBE_CHANNEL_ID.slice(2)}`;
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@azel222";
const YOUTUBE_SHARED_CHANNEL_URL = "https://youtube.com/@azel222?si=Uj_ZFMax1TYTZWbJ";
const YOUTUBE_UPLOADS_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${YOUTUBE_UPLOADS_PLAYLIST_ID}`;
const YOUTUBE_UPLOADS_PLAYER_URL = `https://www.youtube.com/embed/videoseries?list=${YOUTUBE_UPLOADS_PLAYLIST_ID}&rel=0&modestbranding=1&playsinline=1`;
const SUPERNATURAL_DATABASE_URL = "https://sites.google.com/view/official-supernatural-database";
const studioAssetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
const ACCESS_EMBLEM_URL = studioAssetUrl("assets/spectral-access-emblem.png");
const YOUTUBE_RECENT_UPLOADS = [
  {
    id: "5_T2LfeRDEY",
    title: "TRIGGER - AMV Motionless in White - Werewolf Project Clip",
    published: "2026-07-18",
    type: "Video"
  },
  {
    id: "cg9QiVkD5sg",
    title: "TRIGGER - AMV Motionless in White - Werewolf Project Clip",
    published: "2026-07-17",
    type: "Video"
  },
  {
    id: "Kyp0UzzClVs",
    title: "AMV Motionless in White - Werewolf Project Demo",
    published: "2026-07-17",
    type: "Short"
  },
  {
    id: "L_EMmOeQ4-k",
    title: "Pissing off my father - comedy short",
    published: "2026-07-15",
    type: "Short"
  },
  {
    id: "qZG5Pi0K8Rw",
    title: "2026 Shapeshifting Research Project Collab Preview",
    published: "2026-07-07",
    type: "Video"
  },
  {
    id: "Rj0JyCcBHqA",
    title: "Cute Wolf Mimicry - Wolf Says Hello Back",
    published: "2026-07-04",
    type: "Short"
  }
];
const PRIME_SPECTRAL_EXAMPLES = [
  {
    id: "prime-01",
    title: "PRIME Spectral Result 01",
    tone: "Red and gold heat boundary",
    src: studioAssetUrl("assets/prime-spectral-examples/prime-spectral-01.jpg"),
    description: "High-contrast spectral boundary with a black subject silhouette and red/yellow energetic field separation."
  },
  {
    id: "prime-02",
    title: "PRIME Spectral Result 02",
    tone: "Solar red field trace",
    src: studioAssetUrl("assets/prime-spectral-examples/prime-spectral-02.jpg"),
    description: "Red thermal-style field with white annotation trace and bright bloom concentration across the upper plane."
  },
  {
    id: "prime-03",
    title: "PRIME Spectral Result 03",
    tone: "Cyan floor depth map",
    src: studioAssetUrl("assets/prime-spectral-examples/prime-spectral-03.jpg"),
    description: "Cool-spectrum depth emphasis using cyan, green, and blue contrast to expose floor texture and dark object edges."
  },
  {
    id: "prime-04",
    title: "PRIME Spectral Result 04",
    tone: "Red/gold vertical apparition study",
    src: studioAssetUrl("assets/prime-spectral-examples/prime-spectral-04.jpg"),
    description: "Dense red/gold thermal grain with dark central form separation and white field annotation overlay."
  },
  {
    id: "prime-05",
    title: "PRIME Spectral Result 05",
    tone: "Wall bloom heat wash",
    src: studioAssetUrl("assets/prime-spectral-examples/prime-spectral-05.jpg"),
    description: "Warm wall-surface spectral wash showing layered red, orange, and yellow bloom intensity bands."
  },
  {
    id: "prime-06",
    title: "PRIME Spectral Result 06",
    tone: "Green night-vision particulate",
    src: studioAssetUrl("assets/prime-spectral-examples/prime-spectral-06.jpg"),
    description: "Green/black spectral particulate effect with dense pixel breakup and highlighted contour annotation."
  },
  {
    id: "prime-07",
    title: "PRIME Spectral Result 07",
    tone: "Annotated shadow morphology",
    src: studioAssetUrl("assets/prime-spectral-examples/prime-spectral-07.jpg"),
    description: "Desaturated shadow-field result with annotations, high-grain texture, and bright edge markers."
  },
  {
    id: "prime-08",
    title: "PRIME Spectral Result 08",
    tone: "Dark multicolor noise trace",
    src: studioAssetUrl("assets/prime-spectral-examples/prime-spectral-08.jpg"),
    description: "Black-field spectral noise study with red region boxes and multicolor particulate highlights."
  },
  {
    id: "prime-09",
    title: "example generation from app-Pause Feed Edit, X3 filter effects-importer to overlay feature, exported, duplicated, imported again-both, and changed splice of 2nd then final export",
    tone: "Layered pause-feed overlay export",
    src: studioAssetUrl("assets/prime-spectral-examples/prime-spectral-09.jpg"),
    description: "App-generated composite created from a paused feed edit, three stacked filter passes, overlay import, duplicate reimport, and second-layer splice adjustment before final export."
  }
];
const FEATURED_PRIME_RESULT_ID = "prime-09";
const CONTACT_EMAIL = "alola99990@gmail.com";
const CAPTURE_LIBRARY_LIMIT = 3;
const MAX_RECORDING_MS = 180000;
const RECORDING_RESOLUTIONS = {
  "1080p": { label: "1080P", width: 1920, height: 1080 },
  "2k": { label: "2K", width: 2560, height: 1440 }
};
const MEDIA_LAYER_LIMIT = 3;
const MEDIA_COMPOSITE_WIDTH = 1920;
const MEDIA_COMPOSITE_HEIGHT = 1080;
const MEDIA_BLEND_MODES = [
  ["source-over", "Normal"],
  ["screen", "Screen"],
  ["overlay", "Overlay"],
  ["soft-light", "Soft Light"],
  ["multiply", "Multiply"],
  ["lighten", "Lighten"],
  ["darken", "Darken"],
  ["color-dodge", "Color Dodge"],
  ["difference", "Difference"],
  ["luminosity", "Luminosity"]
];
const MEDIA_SPLICE_MODES = [
  ["full", "Full Frame"],
  ["left", "Left Half"],
  ["right", "Right Half"],
  ["top", "Top Half"],
  ["bottom", "Bottom Half"],
  ["center", "Center Window"],
  ["diagonal", "Diagonal Wipe"],
  ["circle", "Circle Portal"],
  ["vertical-strips", "Vertical Strips"],
  ["lower-third", "Lower Third"]
];
const MP4_MIME_TYPES = [
  "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
  "video/mp4;codecs=h264",
  "video/mp4"
];
const PREVIEW_CANVAS_SCALE_CAP = 0.85;
const MEDIA_CANVAS_SCALE_CAP = 0.78;
const CAMERA_CANONICAL_RENDER_WIDTH = 720;
const CAMERA_CANONICAL_RENDER_HEIGHT = 600;
const CAMERA_CANONICAL_CSS_WIDTH = 650;
const THERMAL_EFFECT_PIXEL_BUDGET = 95_000;
const MEDIA_THERMAL_EFFECT_PIXEL_BUDGET = 72_000;
const CAMERA_LIGHT_FRAME_INTERVAL_MS = 68;
const CAMERA_HEAVY_FRAME_INTERVAL_MS = 106;
const CAMERA_HUD_FRAME_INTERVAL_MS = 134;
const MEDIA_VIDEO_FRAME_INTERVAL_MS = 96;
const RECORDING_FRAME_INTERVAL_MS = 50;
const EFFECT_OUTPUT_GAIN = 1.74;
const PIXEL_EFFECT_GAIN = 2.05;
const THERMAL_SIGNAL_GAIN = 1.42;
const RGBW_MIXER_GAIN = 1.72;
const PRESET_INTENSITY_MULTIPLIER = 5;
const SMART_SIGNAL_PIXEL_BUDGET = 74_000;
const SPATIAL_RECOGNITION_PIXEL_BUDGET = 96_000;
const DATACOHERECTICS_SPATIAL_MAPPING_URL =
  "https://www.google.com/search?q=datacoherectics+and+spatial+mapping+and+voxels";
const SMART_DARK_EDGE_LABEL = "Smart darker edge amplifier";
const SPATIAL_RECOGNITION_LABEL = "Spatial recognition field mapper";
const SPATIAL_MESH_FORMS = [
  {
    id: "triangular",
    label: "Triangular",
    description: "TIN-style triangular facets with diagonal depth links across the synchronized live-cell field."
  },
  {
    id: "hexagonal",
    label: "Hexagonal",
    description: "Honeycomb voxel cells arranged from the same camera samples for broad surface and range mapping."
  },
  {
    id: "irregular",
    label: "Irregular",
    description: "Uneven adaptive polygons that pull toward live noise, edge, and subtle depth disturbances."
  },
  {
    id: "variable",
    label: "Variable",
    description: "A mixed voxel field that alternates triangular, hexagonal, and irregular forms by local signal strength."
  },
  {
    id: "equation-driven",
    label: "Equation Driven",
    description: "Formula-weighted mesh where X means adherence and Y means metronymics for rhythmic voxel behavior."
  }
];
const SPATIAL_MESH_FORM_LOOKUP = new Map(SPATIAL_MESH_FORMS.map((form) => [form.id, form]));
const TORCH_LOG_LIMIT = 14;
const TORCH_STROBE_MIN_MS = 80;
const TORCH_STROBE_MAX_MS = 2000;
const TORCH_STROBE_STEP_MS = 20;
const TORCH_STROBE_DEFAULT_MS = 420;
const TORCH_BRIGHTNESS_MIN = 5;
const TORCH_BRIGHTNESS_MAX = 100;
const TORCH_BRIGHTNESS_STEP = 5;
const TORCH_BRIGHTNESS_DEFAULT = 100;
const SNAPSHOT_SAVE_FOLDER_NAME = "SPECTRAL_X1_IMAGE_SAVES";
const DWT_ISOLATE_PROFILE = {
  profileId: "dwt-adaptive-quantization-v1",
  profileAsset: studioAssetUrl("assets/dwt-isolate/dwt_isolate_profile.json"),
  wavelet: "haar",
  lowFrequencyWeight: 0.48,
  luminanceNoiseWeight: 1.12,
  chrominanceNoiseWeight: 1.72,
  digitalNoiseWeight: 1.58,
  quantizationFloor: 0.018,
  quantizationCeiling: 0.34,
  defectThresholdBias: 0.068,
  densityGain: 1.58,
  edgeGain: 1.42,
  chromaLockGain: 1.22,
  artifactSuppressionGain: 1.46,
  grainNoiseGain: 1.44,
  speckleNoiseGain: 1.55,
  bandingNoiseGain: 1.38,
  blockArtifactGain: 1.62,
  hotPixelGain: 1.7,
  temporalFlickerGain: 1.28
};
let thermalWorkCanvas;
let pixelateWorkCanvas;
let mediaLayerWorkCanvas;
let smartDarkEdgeWorkCanvas;
let smartSignalWorkCanvas;
let spatialRecognitionWorkCanvas;
let previewFilterWorkCanvas;
let canvasFilterSupportMemo;
const TRUSTED_ACCESS = [
  {
    name: "Studio Access Holder",
    sha256: "5d24654cf27da2785c1bfcf4af2449005fcf4895fed21df42828a9188969c5cd"
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

const THERMAL_STUDIO_BANDS = "ABCDEFGHIJKLMNO".split("").map((letter, index) => ({
  letter,
  target: index / 14,
  label:
    index < 3
      ? "Shadow thermogram"
      : index < 6
        ? "Cold palette band"
        : index < 9
          ? "Mid isotherm"
          : index < 12
            ? "Warm hotspot"
            : "Peak hotspot"
}));

const THERMAL_STUDIO_COLOR_OPTIONS = [
  { id: "black", label: "Black", color: [0, 0, 0] },
  { id: "deep-blue", label: "Deep Blue", color: [0, 18, 170] },
  { id: "blue", label: "Blue", color: [0, 88, 255] },
  { id: "cyan", label: "Cyan", color: [0, 224, 255] },
  { id: "teal", label: "Teal", color: [0, 214, 170] },
  { id: "green", label: "Green", color: [32, 255, 92] },
  { id: "lime", label: "Lime", color: [176, 255, 0] },
  { id: "yellow", label: "Yellow", color: [255, 238, 0] },
  { id: "amber", label: "Amber", color: [255, 168, 0] },
  { id: "orange", label: "Orange", color: [255, 94, 0] },
  { id: "red", label: "Red", color: [255, 0, 0] },
  { id: "magenta", label: "Magenta", color: [255, 0, 180] },
  { id: "violet", label: "Violet", color: [160, 72, 255] },
  { id: "white", label: "White", color: [255, 255, 255] },
  { id: "thermal-rgb", label: "Thermal RGB", palette: "full-range-rgb" },
  { id: "rgbwb", label: "RGBWB Full Spectrum", palette: "rgb-spectrum" }
];

const THERMAL_STUDIO_COLOR_LOOKUP = new Map(THERMAL_STUDIO_COLOR_OPTIONS.map((option) => [option.id, option]));
const THERMAL_STUDIO_NUMERIC_ADJUSTMENTS = [
  ["thermalStudioMaster", "Thermal Studio Master", 0, 100, "%", 0],
  ...THERMAL_STUDIO_BANDS.flatMap((band) => [
    [`thermalHotspot${band.letter}Strength`, `${band.letter} Strength`, 0, 100, "%", 0],
    [`thermalHotspot${band.letter}Width`, `${band.letter} Isotherm Width`, 2, 40, "%", 12]
  ])
];
const THERMAL_STUDIO_COLOR_DEFAULTS = Object.fromEntries(
  THERMAL_STUDIO_BANDS.map((band, index) => [
    `thermalHotspot${band.letter}Color`,
    THERMAL_STUDIO_COLOR_OPTIONS[(index + 1) % THERMAL_STUDIO_COLOR_OPTIONS.length].id
  ])
);

const INVERSION_ADJUSTMENTS = [
  ["classicInvert", "Classic RGB Invert", 0, 100, "%", 0],
  ["lumaInvert", "Luma Negative", 0, 100, "%", 0],
  ["channelInvert", "Channel Swap Invert", 0, 100, "%", 0],
  ["spectralInvert", "Spectral Invert", 0, 100, "%", 0],
  ["thermalInvert", "Thermal Black-Hot Invert", 0, 100, "%", 0],
  ["redInvert", "Red Channel Invert", 0, 100, "%", 0],
  ["greenInvert", "Green Channel Invert", 0, 100, "%", 0],
  ["blueInvert", "Blue Channel Invert", 0, 100, "%", 0],
  ["shadowInvert", "Shadow Range Invert", 0, 100, "%", 0],
  ["highlightInvert", "Highlight Range Invert", 0, 100, "%", 0]
];

const INVERSION_STYLE_VARIANTS = [
  {
    name: "Classic RGB Invert",
    color: "rgba(255, 255, 255, 0.18)",
    blendMode: "difference",
    settings: { classicInvert: 92, invert: 32, contrast: 136, saturation: 142, colorSeparation: 18 }
  },
  {
    name: "Luma Negative",
    color: "rgba(220, 232, 255, 0.2)",
    blendMode: "difference",
    settings: { lumaInvert: 94, grayscale: 34, contrast: 148, exposure: -4, clarity: 18 }
  },
  {
    name: "Channel Swap Invert",
    color: "rgba(255, 70, 220, 0.22)",
    blendMode: "exclusion",
    settings: { channelInvert: 96, hue: 48, saturation: 178, colorSeparation: 42, prismSplit: 16 }
  },
  {
    name: "Spectral Invert",
    color: "rgba(82, 240, 255, 0.24)",
    blendMode: "difference",
    settings: { spectralInvert: 100, infraredWash: 18, ultravioletWash: 16, chromaticGlow: 22, contrast: 154, saturation: 210 }
  },
  {
    name: "Thermal Black-Hot Invert",
    color: "rgba(28, 38, 52, 0.36)",
    blendMode: "color-dodge",
    settings: { thermalPalette: "black-hot", thermalInvert: 96, thermalBlend: 92, thermalContour: 78, heatEdge: 62, contrast: 196, saturation: 48 }
  },
  {
    name: "Red Channel Invert",
    color: "rgba(255, 44, 72, 0.24)",
    blendMode: "difference",
    settings: { redInvert: 94, saturation: 176, hue: -18, colorSeparation: 24, contrast: 138 }
  },
  {
    name: "Green Channel Invert",
    color: "rgba(64, 255, 118, 0.22)",
    blendMode: "difference",
    settings: { greenInvert: 94, saturation: 170, hue: 28, nearIrBoost: 12, contrast: 136 }
  },
  {
    name: "Blue Channel Invert",
    color: "rgba(74, 172, 255, 0.24)",
    blendMode: "difference",
    settings: { blueInvert: 94, saturation: 178, hue: -42, ultravioletWash: 12, colorSeparation: 18 }
  },
  {
    name: "Shadow Range Invert",
    color: "rgba(24, 30, 42, 0.34)",
    blendMode: "exclusion",
    settings: { shadowInvert: 100, shadowDepth: 38, shadowCrush: 18, contrast: 164, brightness: 96, localContrast: 18 }
  },
  {
    name: "Highlight Range Invert",
    color: "rgba(255, 244, 182, 0.22)",
    blendMode: "exclusion",
    settings: { highlightInvert: 100, highlightRecovery: 34, whites: 18, contrast: 152, brightness: 112, glow: 8 }
  }
];

const EXTRA_INVERSION_STYLE_VARIANTS = [
  {
    name: "Infrared Negative Split",
    color: "rgba(255, 42, 76, 0.26)",
    blendMode: "difference",
    settings: { classicInvert: 86, redInvert: 72, infraredWash: 34, contrast: 164, saturation: 176, colorSeparation: 32, heatEdge: 18 }
  },
  {
    name: "Cyan Luma Ghost",
    color: "rgba(0, 224, 255, 0.3)",
    blendMode: "exclusion",
    settings: { lumaInvert: 90, blueInvert: 64, xrayGhost: 28, exposure: 8, contrast: 152, saturation: 132, chromaticGlow: 20 }
  },
  {
    name: "Red Spectral Reverse",
    color: "rgba(255, 0, 0, 0.32)",
    blendMode: "difference",
    settings: { spectralInvert: 92, redInvert: 100, thermalPalette: "inverted-red-rgb", thermalBlend: 62, thermalContour: 56, contrast: 202, saturation: 238 }
  },
  {
    name: "Green Shadow Negative",
    color: "rgba(62, 255, 90, 0.28)",
    blendMode: "difference",
    settings: { shadowInvert: 100, greenInvert: 92, nightScope: 24, shadowDepth: 28, blackPoint: 18, contrast: 178, greenChannel: 184 }
  },
  {
    name: "Blue Highlight Reversal",
    color: "rgba(68, 142, 255, 0.3)",
    blendMode: "exclusion",
    settings: { highlightInvert: 96, blueInvert: 94, ultravioletWash: 28, highlightRecovery: 34, blueChannel: 188, contrast: 164, saturation: 182 }
  },
  {
    name: "Tri-Channel Negative",
    color: "rgba(255, 0, 210, 0.3)",
    blendMode: "difference",
    settings: { channelInvert: 100, redInvert: 66, greenInvert: 78, blueInvert: 90, colorSeparation: 48, prismSplit: 28, contrast: 176, saturation: 230 }
  },
  {
    name: "Thermal Red Black Invert",
    color: "rgba(255, 50, 0, 0.34)",
    blendMode: "color-dodge",
    settings: { thermalPalette: "carbon-fire", thermalInvert: 100, thermalBlend: 96, thermalContour: 86, heatEdge: 84, shadowCrush: 24, contrast: 210, saturation: 218 }
  },
  {
    name: "White Edge Negative",
    color: "rgba(255, 255, 255, 0.22)",
    blendMode: "difference",
    settings: { lumaInvert: 82, highlightInvert: 74, edgeEnhance: 34, fineSharpen: 22, grayscale: 38, contrast: 188, whites: 20 }
  },
  {
    name: "Magenta Depth Reverse",
    color: "rgba(255, 36, 214, 0.28)",
    blendMode: "exclusion",
    settings: { spectralInvert: 88, channelInvert: 78, purpleShift: 38, negativeDepth: 34, localContrast: 22, thermalContour: 42, saturation: 236 }
  },
  {
    name: "Blacklight Negative Bloom",
    color: "rgba(170, 72, 255, 0.34)",
    blendMode: "screen",
    settings: { classicInvert: 74, ultravioletWash: 40, uvaFluorescence: 36, auraBloom: 32, chromaticGlow: 28, glow: 18, contrast: 154, saturation: 210 }
  }
];

const XLS_CAMERA_VARIANTS = [
  {
    name: "XLS Spectral Camera",
    color: "rgba(90, 255, 214, 0.32)",
    blendMode: "screen",
    settings: { brightness: 112, contrast: 168, saturation: 205, hue: 20, thermalPalette: "xls", thermalBlend: 82, thermalContour: 70, heatEdge: 58, xrayGhost: 42, nearIrBoost: 34, ultravioletWash: 28, infraredWash: 24, edgeEnhance: 22, glow: 12 }
  },
  {
    name: "XLS Ghost Plate",
    color: "rgba(178, 255, 236, 0.3)",
    blendMode: "screen",
    settings: { thermalPalette: "ghost-thermal", thermalBlend: 88, thermalContour: 72, heatEdge: 52, xrayGhost: 68, grayscale: 26, contrast: 176, saturation: 132, softFocus: 8 }
  },
  {
    name: "XLS Bone Cyan",
    color: "rgba(0, 238, 255, 0.32)",
    blendMode: "color-dodge",
    settings: { thermalPalette: "xls", thermalBlend: 94, thermalContour: 86, heatEdge: 74, xrayGhost: 82, cyanBalance: 30, blueChannel: 172, contrast: 194, edgeEnhance: 30 }
  },
  {
    name: "XLS Violet Signal",
    color: "rgba(170, 80, 255, 0.34)",
    blendMode: "screen",
    settings: { thermalPalette: "ultraviolet-heat", thermalBlend: 92, thermalContour: 78, heatEdge: 66, xrayGhost: 64, ultravioletWash: 42, purpleShift: 34, chromaticGlow: 24, saturation: 244 }
  },
  {
    name: "XLS Amber Scan",
    color: "rgba(255, 174, 36, 0.32)",
    blendMode: "overlay",
    settings: { thermalPalette: "copper-hot", thermalBlend: 92, thermalContour: 74, heatEdge: 68, xrayGhost: 50, infraredWash: 38, temperature: 34, contrast: 184, saturation: 192 }
  },
  {
    name: "XLS Green Field",
    color: "rgba(38, 255, 112, 0.3)",
    blendMode: "screen",
    settings: { thermalPalette: "emerald-heat", thermalBlend: 94, thermalContour: 80, heatEdge: 76, xrayGhost: 56, nearIrBoost: 44, nightScope: 22, greenChannel: 180, contrast: 188 }
  },
  {
    name: "XLS Red Isolate",
    color: "rgba(255, 38, 0, 0.34)",
    blendMode: "color-dodge",
    settings: { thermalPalette: "inverted-red-rgb", thermalBlend: 100, thermalContour: 90, heatEdge: 88, xrayGhost: 46, redInvert: 42, redChannel: 190, shadowCrush: 18, saturation: 260 }
  },
  {
    name: "XLS Night Glass",
    color: "rgba(52, 116, 255, 0.28)",
    blendMode: "screen",
    settings: { thermalPalette: "deep-sea-predator", thermalBlend: 90, thermalContour: 82, heatEdge: 74, xrayGhost: 62, exposure: -10, shadowDepth: 28, scanlines: 14, contrast: 202 }
  },
  {
    name: "XLS Mineral X-Ray",
    color: "rgba(132, 255, 208, 0.3)",
    blendMode: "screen",
    settings: { thermalPalette: "object-heat-isolate", thermalBlend: 96, thermalContour: 88, heatEdge: 82, xrayGhost: 72, mineralPop: 34, chlorophyllGlow: 18, colorSeparation: 28, saturation: 240 }
  },
  {
    name: "XLS Thermal Wire",
    color: "rgba(255, 238, 90, 0.3)",
    blendMode: "overlay",
    settings: { thermalPalette: "edge-spectrum", thermalBlend: 96, thermalContour: 100, heatEdge: 96, xrayGhost: 42, edgeEnhance: 44, fineSharpen: 28, localContrast: 26, contrast: 208 }
  },
  {
    name: "XLS Deep Negative",
    color: "rgba(30, 32, 52, 0.38)",
    blendMode: "difference",
    settings: { thermalPalette: "black-hot", thermalBlend: 92, thermalContour: 84, heatEdge: 78, xrayGhost: 76, lumaInvert: 52, negativeDepth: 42, shadowDepth: 34, contrast: 210 }
  }
];

const TRI_TONE_VARIANTS = buildPresetVariants(
  [
    "Crimson Lime Cyan", "Amber Violet Teal", "Blue Ember Gold", "Rose Copper Aqua", "Green Magenta Ash",
    "Solar Violet Sea", "Ruby Mint Cobalt", "Tangerine Indigo Frost", "Peacock Red Pearl", "Ultraviolet Olive Flame",
    "Signal Pink Emerald", "Copper Cyan Night", "Lime Blood Iris", "Aqua Rust Orchid", "Gold Blue Smoke",
    "Scarlet Jade Ice", "Violet Honey Steel", "Teal Magma Pearl", "Chrome Rose Moss", "Spectral Triad"
  ],
  "TriTone",
  ["#ff345c", "#ff9c24", "#36f59b", "#23d9ff", "#9c5cff", "#fff06a"],
  (index) => ({
    brightness: 100 + (index % 4) * 4,
    contrast: 124 + (index % 5) * 7,
    saturation: 158 + (index % 6) * 12,
    hue: ((index * 31) % 220) - 110,
    duotone: 42 + (index % 5) * 8,
    splitTone: ((index * 17) % 120) - 60,
    colorHarmony: 16 + (index % 6) * 9,
    colorSeparation: 12 + (index % 5) * 7,
    redChannel: 80 + ((index * 37) % 115),
    greenChannel: 78 + ((index * 53) % 118),
    blueChannel: 82 + ((index * 71) % 116),
    glow: index % 3 === 0 ? 8 : 0
  })
);

const QUAD_TONE_VARIANTS = buildPresetVariants(
  [
    "Four Band Prism", "Ruby Amber Cyan Violet", "Forest Gold Blue Rose", "Carbon Pearl Heat", "Neon Quartertone",
    "Aqua Red Lime Black", "Copper Violet Mint Ice", "Magenta Slate Solar", "Blue Honey Ember", "Emerald Chrome Pink",
    "Signal Quadrant", "White Core Quad", "Black Core Quad", "Red Green Blue White", "Iris Gold Teal",
    "Frost Lava Moss", "Ultraviolet Quad", "Cobalt Rose Lime", "Tonal Mosaic", "Spectral Quadrature"
  ],
  "QuadTone",
  ["#ffffff", "#ff4a2a", "#ffc400", "#24ffa6", "#22c7ff", "#c45cff"],
  (index) => ({
    brightness: 96 + (index % 7) * 5,
    contrast: 132 + (index % 6) * 8,
    saturation: 170 + (index % 5) * 14,
    hue: ((index * 43) % 260) - 130,
    duotone: 54 + (index % 4) * 9,
    splitTone: ((index * 29) % 150) - 75,
    colorHarmony: 24 + (index % 5) * 10,
    posterize: 6 + (index % 4) * 5,
    colorSeparation: 18 + (index % 6) * 6,
    overlayStrength: 18 + (index % 5) * 8,
    redHueShift: ((index * 13) % 80) - 40,
    greenHueShift: ((index * 19) % 80) - 40,
    blueHueShift: ((index * 23) % 80) - 40
  })
);

const CHANNEL_SPECTROGRAPH_VARIANTS = buildPresetVariants(
  [
    "RGB Trace Lines", "Cyan Frequency", "Red Channel Seism", "Green Channel Graph", "Blue Channel Echo",
    "Prism Oscilloscope", "Spectral Barcode", "Luma Frequency", "Channel Topography", "Chromatic Telemetry",
    "Signal Comb", "Photon Graph", "Tri-Channel Ridge", "Scanline Spectrum", "Waveform Heat",
    "Color Phase Map", "Edge Spectrograph", "Aura Graph", "Sensor Sweep Grid", "Full Band Plot"
  ],
  "Channel Spectrograph",
  ["#00e5ff", "#ff375f", "#70ff4d", "#506bff", "#ffd43b", "#ff4de1"],
  (index) => ({
    brightness: 98 + (index % 4) * 5,
    contrast: 146 + (index % 7) * 9,
    saturation: 148 + (index % 6) * 15,
    colorSeparation: 34 + (index % 6) * 8,
    chromaticAberration: 16 + (index % 5) * 9,
    prismSplit: 18 + (index % 5) * 8,
    scanlines: 10 + (index % 6) * 8,
    edgeEnhance: 16 + (index % 5) * 6,
    thermalContour: index % 3 === 0 ? 28 + (index % 4) * 8 : 0,
    redChannel: 60 + ((index * 47) % 155),
    greenChannel: 60 + ((index * 61) % 155),
    blueChannel: 60 + ((index * 73) % 155)
  })
);

const BLACK_VARIANTS = buildPresetVariants(
  [
    "Black Void", "Carbon Signal", "Obsidian Heat", "Noir Depth", "Raven Field",
    "Black Glass", "Deep Shadow Map", "Ink Sensor", "Eclipse Plate", "Void Glow",
    "Graphite Burn", "Blacklight Dark", "Night Carbon", "Abyss Edge", "Shadow Furnace",
    "Black Pearl Signal", "Darkroom Bloom", "Pitch Trace", "Coal Frequency", "Absolute Black"
  ],
  "Black",
  ["#050507", "#151515", "#2b1a1a", "#0e1924", "#180b24", "#332a20"],
  (index) => ({
    brightness: 72 + (index % 4) * 6,
    contrast: 170 + (index % 7) * 8,
    saturation: index % 5 === 0 ? 110 : 18 + (index % 5) * 14,
    exposure: -18 - (index % 5) * 4,
    blackPoint: 20 + (index % 6) * 9,
    shadowDepth: 28 + (index % 5) * 10,
    shadowCrush: 18 + (index % 6) * 9,
    localContrast: 18 + (index % 5) * 8,
    edgeEnhance: 8 + (index % 5) * 6,
    grayscale: index % 3 === 0 ? 72 : 28,
    thermalContour: index % 4 === 0 ? 36 : 0,
    heatEdge: index % 4 === 0 ? 28 : 0,
    glow: index % 6 === 0 ? 8 : 0
  })
);

const CHANNEL_SWEEP_VARIANTS = buildPresetVariants(
  [
    "Red Sweep", "Green Sweep", "Blue Sweep", "Cyan Sweep", "Magenta Sweep",
    "Yellow Sweep", "RGBW Sweep", "Heat Sweep", "Shadow Sweep", "Highlight Sweep",
    "Left Phase Sweep", "Right Phase Sweep", "Channel Wave", "Color Rotary", "Signal Pan",
    "Chromatic Conveyor", "Bandpass Sweep", "Phase Ladder", "Spectral Scroll", "Full Channel Sweep"
  ],
  "Channel Sweep",
  ["#ff334f", "#48ff78", "#38a7ff", "#26f5ff", "#ff42dc", "#ffe842"],
  (index) => ({
    brightness: 102 + (index % 4) * 3,
    contrast: 132 + (index % 6) * 8,
    saturation: 180 + (index % 5) * 12,
    hue: ((index * 51) % 360) - 180,
    redChannel: 44 + ((index * 83) % 190),
    greenChannel: 44 + ((index * 97) % 190),
    blueChannel: 44 + ((index * 109) % 190),
    redHueShift: ((index * 17) % 120) - 60,
    greenHueShift: ((index * 31) % 120) - 60,
    blueHueShift: ((index * 47) % 120) - 60,
    chromaticAberration: 10 + (index % 5) * 9,
    glitchShift: 8 + (index % 6) * 8,
    colorSeparation: 20 + (index % 7) * 7,
    scanlines: index % 2 ? 10 + (index % 4) * 6 : 0
  })
);

function buildPresetVariants(names, category, swatches, settingsFactory) {
  return names.map((name, index) => {
    const color = swatches[index % swatches.length];
    const alpha = 0.22 + (index % 5) * 0.025;
    return {
      name,
      color: hexToRgba(color, alpha),
      blendMode: ["screen", "overlay", "soft-light", "color-dodge", "exclusion"][index % 5],
      settings: settingsFactory(index, category, name)
    };
  });
}

function hexToRgba(hex, alpha = 1) {
  const clean = String(hex || "#ffffff").replace("#", "");
  const value = clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean.padEnd(6, "f").slice(0, 6);
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha, 0, 1)})`;
}

const CORE_ADJUSTMENTS = [
  ["brightness", "Brightness", 20, 220, "%"],
  ["contrast", "Contrast", 20, 220, "%"],
  ["exposure", "Exposure", -80, 80, ""],
  ["saturation", "Saturation", 0, 260, "%"],
  ["hue", "Hue", -180, 180, "deg"],
  ["temperature", "Temperature", -80, 80, ""],
  ["tint", "Tint", -80, 80, ""],
  ["blur", "Blur", 0, 12, "px"],
  ["grain", "Grain", 0, 80, "%"],
  ["duotone", "Duotone", 0, 100, "%"],
  ["glow", "Glow", 0, 60, "px"]
];

const FINISH_ADJUSTMENTS = [
  ["sepia", "Sepia", 0, 100, "%", 0],
  ["grayscale", "Grayscale", 0, 100, "%", 0],
  ["invert", "Base Invert", 0, 100, "%", 0]
];

const SMART_DARK_EDGE_ADJUSTMENTS = [
  ["darkEdgeAmount", "Edge Darken", 0, 100, "%", 64],
  ["darkEdgeSensitivity", "Edge Sensitivity", 0, 100, "%", 58],
  ["darkEdgeSpread", "Edge Spread", 0, 100, "%", 36],
  ["darkEdgeContrast", "Edge Contrast", 0, 100, "%", 62],
  ["darkEdgeShadowDepth", "Shadow Depth", 0, 100, "%", 48],
  ["darkEdgeBlackClamp", "Black Clamp", 0, 100, "%", 42],
  ["darkEdgeDetailAmplify", "Detail Amplify", 0, 100, "%", 50],
  ["darkEdgeHaloCut", "Halo Cut", 0, 100, "%", 40],
  ["darkEdgeThermalBind", "Thermal Bind", 0, 100, "%", 54],
  ["darkEdgeMicroGrain", "Dark Micro Grain", 0, 100, "%", 24]
];

const SPATIAL_RECOGNITION_ADJUSTMENTS = [
  ["spatialMaster", "Spatial Power", 0, 100, "%", 62],
  ["spatialInterfaceOpacity", "Visual Interface Opacity", 0, 100, "%", 100],
  ["spatialSensitivity", "Scene Sensitivity", 0, 100, "%", 58],
  ["spatialDepth", "Depth Separation", 0, 100, "%", 66],
  ["spatialField", "Field Curvature", 0, 100, "%", 42],
  ["spatialRange", "Range Compression", 0, 100, "%", 54],
  ["spatialPointDensity", "Point Cloud Density", 0, 100, "%", 50],
  ["spatialEdgeWeight", "Edge Weight", 0, 100, "%", 62],
  ["spatialMeshOpacity", "Mesh Opacity", 0, 100, "%", 42],
  ["spatialContourOpacity", "Contour Opacity", 0, 100, "%", 48],
  ["spatialParallax", "Parallax Drift", 0, 100, "%", 36],
  ["spatialColorSplit", "Color Split", 0, 100, "%", 56],
  ["spatialSmoothing", "Depth Smoothing", 0, 100, "%", 38],
  ["spatialMicroContrast", "Micro Contrast", 0, 100, "%", 58],
  ["spatialGradientLift", "Gradient Lift", 0, 100, "%", 52],
  ["spatialNearFieldBias", "Near Field Bias", 0, 100, "%", 48],
  ["spatialFarFieldBias", "Far Field Bias", 0, 100, "%", 44],
  ["spatialOcclusion", "Occlusion Weight", 0, 100, "%", 50],
  ["spatialDepthSharpen", "Depth Sharpen", 0, 100, "%", 54],
  ["spatialDepthBlur", "Depth Blur", 0, 100, "%", 24],
  ["spatialContourDensity", "Contour Density", 0, 100, "%", 62],
  ["spatialContourThreshold", "Contour Threshold", 0, 100, "%", 38],
  ["spatialVectorTension", "Vector Tension", 0, 100, "%", 46],
  ["spatialSurfaceNormal", "Surface Normal", 0, 100, "%", 56],
  ["spatialSpecularSense", "Specular Sense", 0, 100, "%", 50],
  ["spatialShadowSense", "Shadow Sense", 0, 100, "%", 55],
  ["spatialHighlightSense", "Highlight Sense", 0, 100, "%", 52],
  ["spatialColorDepth", "Color Depth", 0, 100, "%", 64],
  ["spatialNoiseReject", "Noise Reject", 0, 100, "%", 36],
  ["spatialObjectCohesion", "Object Cohesion", 0, 100, "%", 58],
  ["spatialMotionTrace", "Motion Trace", 0, 100, "%", 28],
  ["spatialSubpixelScan", "Subpixel Scan", 0, 100, "%", 46],
  ["spatialSubtleReveal", "Subtle Reveal", 0, 100, "%", 72],
  ["spatialThermalLock", "Thermal Lock", 0, 100, "%", 60],
  ["spatialLivePointCloud", "Live Point Cloud", 0, 100, "%", 72],
  ["spatialTinOpacity", "TIN Facet Opacity", 0, 100, "%", 58],
  ["spatialTinWire", "TIN Wire Strength", 0, 100, "%", 52],
  ["spatialCellSize", "Cell Size", 0, 100, "%", 48],
  ["spatialCellDepth", "Cell Depth Mapping", 0, 100, "%", 66],
  ["spatialSurfaceMap", "Surface Mapping", 0, 100, "%", 62],
  ["spatialNoiseMap", "Noise Mapping", 0, 100, "%", 58],
  ["spatialGridWarp", "Grid Warp", 0, 100, "%", 44],
  ["spatialPointLift", "Point Height Lift", 0, 100, "%", 54],
  ["spatialFacetSmoothing", "TIN Facet Smoothing", 0, 100, "%", 42],
  ["spatialEquationAdherence", "X Adherence", 0, 100, "%", 64],
  ["spatialEquationMetronymics", "Y Metronymics", 0, 100, "%", 46]
];

const SMART_SIGNAL_PROCESSOR_SLIDERS = [
  ["Amount", "Power", 0, 100, "%", 62],
  ["Sensitivity", "Sensitivity", 0, 100, "%", 54],
  ["Radius", "Radius", 0, 100, "%", 44],
  ["Contrast", "Contrast", 0, 100, "%", 58],
  ["Shadow", "Shadow Bias", 0, 100, "%", 42],
  ["Highlight", "Highlight Bias", 0, 100, "%", 46],
  ["Midtone", "Midtone Bias", 0, 100, "%", 50],
  ["Isolation", "Isolation", 0, 100, "%", 40],
  ["Smoothing", "Smoothing", 0, 100, "%", 34],
  ["Blend", "Blend", 0, 100, "%", 64]
];

const SMART_ISOLATE_GROUPED_PIXEL_SLIDERS = [
  ["Amount", "Engine Power", 0, 100, "%", 72],
  ["Sensitivity", "Scene Sensitivity", 0, 100, "%", 84],
  ["DwtSensitivity", "DWT Sensitivity", 0, 100, "%", 86],
  ["Radius", "Neighborhood Radius", 0, 100, "%", 58],
  ["Contrast", "Defect Contrast", 0, 100, "%", 70],
  ["Shadow", "Shadow Defect Bias", 0, 100, "%", 52],
  ["Highlight", "Highlight Defect Bias", 0, 100, "%", 58],
  ["Midtone", "Midtone Defect Bias", 0, 100, "%", 56],
  ["Isolation", "Grouping Isolation", 0, 100, "%", 74],
  ["Smoothing", "Shape Smoothing", 0, 100, "%", 48],
  ["Blend", "Render Blend", 0, 100, "%", 78],
  ["ColorTarget", "Pixel Color Target", 0, 100, "%", 62],
  ["PixelSize", "Pixel Size", 0, 100, "%", 46],
  ["PixelWeight", "Pixel Weight", 0, 100, "%", 64],
  ["PixelDensity", "Pixel Density", 0, 100, "%", 68],
  ["DefectSignal", "Defect Sensitivity", 0, 100, "%", 82],
  ["DistortionResponse", "Distortion Response", 0, 100, "%", 76],
  ["GrainNoise", "Grain Noise", 0, 100, "%", 74],
  ["SpeckleNoise", "Speckle / Salt Noise", 0, 100, "%", 70],
  ["BandingNoise", "Banding Noise", 0, 100, "%", 62],
  ["BlockNoise", "Block Artifact Noise", 0, 100, "%", 66],
  ["ChromaNoise", "Chroma Noise", 0, 100, "%", 72],
  ["HotPixelNoise", "Hot Pixel Noise", 0, 100, "%", 64],
  ["ShadowNoise", "Shadow Noise", 0, 100, "%", 68],
  ["HighlightNoise", "Highlight Noise", 0, 100, "%", 58],
  ["EdgeShimmer", "Edge Shimmer", 0, 100, "%", 64],
  ["TemporalFlicker", "Temporal Flicker", 0, 100, "%", 52],
  ["Uniformity", "Grouping Uniformity", 0, 100, "%", 70],
  ["EdgeRepair", "Edge Repair", 0, 100, "%", 62],
  ["ChromaLock", "Chroma Lock", 0, 100, "%", 58],
  ["ArtifactSuppression", "Artifact Suppression", 0, 100, "%", 54]
];

const SMART_SIGNAL_PROCESSORS = [
  ["depth", "Depth", "Local contrast, shadow depth, and false-depth heat separation."],
  ["field", "Field", "Field-of-view emphasis with center-to-edge tonal drift and glow shaping."],
  ["range", "Range", "Dynamic range compression and highlight/shadow separation for stronger detail."],
  ["metricMapping", "Metric Mapping", "Quantized tonal mapping that turns subtle luminance distance into visible structure."],
  ["weight", "Weight", "Weighted contrast and channel balance that gives the active preset more visual force."],
  ["details", "Details", "Fine detail, edges, and microtexture amplification."],
  ["midtones", "Midtones", "Midtone isolation, lift, and contour control."],
  ["invert", "Invert", "Stackable smart inversion that responds to tonal depth instead of replacing the whole preset."],
  ["structure", "Structure", "Structure extraction for contours, ridges, and clustered shapes."],
  ["blackpoint", "Blackpoint", "Darker black floor, shadow grouping, and silhouette strength."],
  ["whitepoint", "Whitepoint", "White floor shaping, highlight pressure, and bright region definition."],
  ["lift", "Lift", "Low-light lift and faint-signal reveal without flattening the whole image."],
  ["amplify", "Amplify", "Overall signal amplification for color, contrast, glow, and thermal response."],
  ["exposure", "Exposure", "Smart exposure gain that prioritizes visible effect movement."],
  [
    "isolateGroupedPixels",
    "Isolate Grouped Pixels",
    "AI-Orchestrated Defect / Distortion Isolation that groups similar pixel color, size, weight, density, shade, and range so scene defects behave together.",
    SMART_ISOLATE_GROUPED_PIXEL_SLIDERS
  ],
  ["hotspotTrace", "Hotspot Trace", "Finds local heat-like peaks and pushes them into visible color-isotherm ridges."],
  ["spectralBloom", "Spectral Bloom", "Expands faint glow and color energy around bright and midtone signals."],
  ["edgeFusion", "Edge Fusion", "Binds edge detail and color channel separation into sharper layered boundaries."],
  ["toneQuantizer", "Tone Quantizer", "Compresses continuous tones into readable stepped spectral bands."],
  ["chromaticPressure", "Chromatic Pressure", "Applies directional RGB pressure so similar presets split into stronger color identities."]
].map(([id, title, description, controls = SMART_SIGNAL_PROCESSOR_SLIDERS]) => ({
  id,
  title,
  description,
  controls: controls.map(([suffix, label, min, max, unit, initial]) => [
    smartSignalControlKey(id, suffix),
    label,
    min,
    max,
    unit,
    initial
  ])
}));

const SMART_SIGNAL_ADJUSTMENTS = SMART_SIGNAL_PROCESSORS.flatMap((processor) => processor.controls);
const DEFAULT_SMART_SIGNAL_TOGGLES = Object.fromEntries(SMART_SIGNAL_PROCESSORS.map((processor) => [processor.id, false]));

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
  ["overlayStrength", "Overlay Strength", 0, 100, "%", 0]
];

const ADDITIONAL_ADJUSTMENTS = [
  ["microExposure", "Micro Exposure", -100, 100, "", 0],
  ["hdrRange", "HDR Range", 0, 100, "%", 0],
  ["specularControl", "Specular Control", -100, 100, "", 0],
  ["blackPoint", "Black Point", -100, 100, "", 0],
  ["whitePoint", "White Point", -100, 100, "", 0],
  ["midtoneContrast", "Midtone Contrast", -100, 100, "", 0],
  ["localContrast", "Local Contrast", -100, 100, "", 0],
  ["highlightRecovery", "Highlight Recovery", 0, 100, "%", 0],
  ["shadowDepth", "Shadow Depth", 0, 100, "%", 0],
  ["ambientLift", "Ambient Lift", -100, 100, "", 0],
  ["skinSmooth", "Skin Smooth", 0, 100, "%", 0],
  ["texture", "Texture", -100, 100, "", 0],
  ["structure", "Structure", -100, 100, "", 0],
  ["detailBoost", "Detail Boost", 0, 100, "%", 0],
  ["fineSharpen", "Fine Sharpen", 0, 100, "%", 0],
  ["noiseColor", "Color Noise", 0, 100, "%", 0],
  ["noiseMono", "Mono Noise", 0, 100, "%", 0],
  ["dust", "Dust", 0, 100, "%", 0],
  ["scratches", "Scratches", 0, 100, "%", 0],
  ["clarityMask", "Clarity Mask", 0, 100, "%", 0],
  ["redHueShift", "Red Hue Shift", -100, 100, "", 0],
  ["greenHueShift", "Green Hue Shift", -100, 100, "", 0],
  ["blueHueShift", "Blue Hue Shift", -100, 100, "", 0],
  ["aquaShift", "Aqua Shift", -100, 100, "", 0],
  ["purpleShift", "Purple Shift", -100, 100, "", 0],
  ["orangeShift", "Orange Shift", -100, 100, "", 0],
  ["skinToneWarmth", "Skin Tone Warmth", -100, 100, "", 0],
  ["colorSeparation", "Color Separation", 0, 100, "%", 0],
  ["colorLeak", "Color Leak", 0, 100, "%", 0],
  ["colorHarmony", "Color Harmony", -100, 100, "", 0],
  ["fisheye", "Fisheye Curve", 0, 100, "%", 0],
  ["barrelWarp", "Barrel Warp", 0, 100, "%", 0],
  ["glitchShift", "Glitch Shift", 0, 100, "%", 0],
  ["mirrorGhost", "Mirror Ghost", 0, 100, "%", 0],
  ["lightWrap", "Light Wrap", 0, 100, "%", 0],
  ["edgeGlow", "Edge Glow", 0, 100, "%", 0],
  ["centerGlow", "Center Glow", 0, 100, "%", 0],
  ["bokehBloom", "Bokeh Bloom", 0, 100, "%", 0],
  ["flareStreak", "Flare Streak", 0, 100, "%", 0],
  ["chromaticGlow", "Chromatic Glow", 0, 100, "%", 0],
  ["nearIrBoost", "Near-IR Boost", 0, 100, "%", 0],
  ["uvaFluorescence", "UVA Fluorescence", 0, 100, "%", 0],
  ["chlorophyllGlow", "Chlorophyll Glow", 0, 100, "%", 0],
  ["mineralPop", "Mineral Pop", 0, 100, "%", 0],
  ["auraBloom", "Aura Bloom", 0, 100, "%", 0],
  ["xrayGhost", "X-Ray Ghost", 0, 100, "%", 0],
  ["thermalContour", "Thermal Contour", 0, 100, "%", 0],
  ["heatEdge", "Heat Edge", 0, 100, "%", 0],
  ["nightScope", "Night Scope", 0, 100, "%", 0],
  ["negativeDepth", "Negative Depth", 0, 100, "%", 0]
];

const ADVANCED_ADJUSTMENTS = [...EXTRA_ADJUSTMENTS, ...ADDITIONAL_ADJUSTMENTS];

const DEFAULT_SETTINGS = {
  brightness: 100,
  contrast: 100,
  exposure: 0,
  saturation: 100,
  hue: 0,
  temperature: 0,
  tint: 0,
  blur: 0,
  vignette: 0,
  grain: 0,
  duotone: 0,
  glow: 0,
  sepia: 0,
  grayscale: 0,
  invert: 0,
  ...Object.fromEntries(INVERSION_ADJUSTMENTS.map(([key, , , , , initial = 0]) => [key, initial])),
  ...Object.fromEntries(SMART_DARK_EDGE_ADJUSTMENTS.map(([key, , , , , initial = 0]) => [key, initial])),
  ...Object.fromEntries(SPATIAL_RECOGNITION_ADJUSTMENTS.map(([key, , , , , initial = 0]) => [key, initial])),
  spatialMeshForm: "triangular",
  ...Object.fromEntries(SMART_SIGNAL_ADJUSTMENTS.map(([key, , , , , initial = 0]) => [key, initial])),
  ...Object.fromEntries(THERMAL_STUDIO_NUMERIC_ADJUSTMENTS.map(([key, , , , , initial = 0]) => [key, initial])),
  ...THERMAL_STUDIO_COLOR_DEFAULTS,
  ...Object.fromEntries(ADVANCED_ADJUSTMENTS.map(([key, , , , , initial = 0]) => [key, initial])),
  ...Object.fromEntries(
    RGBW_MIXERS.flatMap((group) =>
      RGBW_CHANNELS.map((channel) => [`${group.key}${channel.key}`, group.defaults[channel.key]])
    )
  )
};

const STACKED_SETTING_KEYS = new Set([
  ...INVERSION_ADJUSTMENTS.map(([key]) => key),
  ...SMART_DARK_EDGE_ADJUSTMENTS.map(([key]) => key),
  ...SPATIAL_RECOGNITION_ADJUSTMENTS.map(([key]) => key),
  "spatialMeshForm",
  ...SMART_SIGNAL_ADJUSTMENTS.map(([key]) => key),
  ...THERMAL_STUDIO_NUMERIC_ADJUSTMENTS.map(([key]) => key),
  ...THERMAL_STUDIO_BANDS.map((band) => `thermalHotspot${band.letter}Color`),
  ...RGBW_MIXERS.flatMap((group) => RGBW_CHANNELS.map((channel) => `${group.key}${channel.key}`))
]);

const ADJUSTMENT_GROUPS = [
  {
    id: "rgbw",
    title: "RGBW Color Mixers",
    description: "Main, Secondary, Third, and Highlights color layers. These now affect both overlays and base filter math.",
    type: "rgbw",
    open: true
  },
  {
    id: "core",
    title: "Core Photo Controls",
    description: "Fast brightness, exposure, contrast, temperature, blur, glow, and grain controls.",
    controls: CORE_ADJUSTMENTS,
    open: true
  },
  {
    id: "inversion",
    title: "Color Inversion Matrix",
    description: "Ten negative, channel, tonal-range, spectral, and thermal inversion tools that stack with every preset.",
    controls: INVERSION_ADJUSTMENTS,
    controlClassName: "inversion-adjustment",
    open: true
  },
  {
    id: "thermal-studio",
    title: "Thermal Studio",
    description: "A-O hotspot/isotherm recolor controls with full-spectrum RGBWB palette targets for thermogram band design.",
    type: "thermal-studio",
    controls: THERMAL_STUDIO_NUMERIC_ADJUSTMENTS,
    open: false
  },
  {
    id: "smart-dark-edge",
    title: "Smart Dark Edge Engine",
    description: "Toggleable local darker-edge pass with 10 controls for edge darkening, black clamp, shadow depth, halo cleanup, and thermal binding.",
    type: "smart-dark-edge",
    controls: SMART_DARK_EDGE_ADJUSTMENTS
  },
  {
    id: "spatial-recognition",
    title: "Spatial Recognition Studio",
    description:
      "Local camera-side pseudo-depth, live point-cloud, TIN facets, contour, cell, voxel-form mesh, and field-map recognition derived from visible frame gradients.",
    type: "spatial-recognition",
    controls: SPATIAL_RECOGNITION_ADJUSTMENTS
  },
  ...SMART_SIGNAL_PROCESSORS.map((processor) => ({
    id: `smart-signal-${processor.id}`,
    title: `Smart ${processor.title}`,
    description: processor.description,
    type: "smart-signal",
    processor,
    controls: processor.controls
  })),
  {
    id: "tone",
    title: "Tone Curve & Exposure",
    description: "Expanded exposure, HDR, black/white point, shadow, highlight, and midtone controls.",
    controls: [
      "gamma",
      "shadows",
      "highlights",
      "whites",
      "blacks",
      "fade",
      "midtoneLift",
      "shadowCrush",
      "microExposure",
      "hdrRange",
      "specularControl",
      "blackPoint",
      "whitePoint",
      "midtoneContrast",
      "localContrast",
      "highlightRecovery",
      "shadowDepth",
      "ambientLift"
    ]
  },
  {
    id: "detail",
    title: "Detail, Texture & Noise",
    description: "Sharpening, structure, softness, pixel/noise tools, posterize, dust, scratches, and edge treatments.",
    controls: [
      "clarity",
      "dehaze",
      "sharpen",
      "pixelate",
      "posterize",
      "noiseReduction",
      "edgeEnhance",
      "emboss",
      "skinSmooth",
      "texture",
      "structure",
      "detailBoost",
      "fineSharpen",
      "noiseColor",
      "noiseMono",
      "dust",
      "scratches",
      "clarityMask"
    ]
  },
  {
    id: "color",
    title: "Color Channels & Balance",
    description: "Vibrance, RGB channel levels, hue shifts, color harmony, and targeted color separation.",
    controls: [
      "vibrance",
      "cyanBalance",
      "magentaBalance",
      "yellowBalance",
      "redChannel",
      "greenChannel",
      "blueChannel",
      "whiteBalance",
      "colorizeHue",
      "colorizeStrength",
      "redHueShift",
      "greenHueShift",
      "blueHueShift",
      "aquaShift",
      "purpleShift",
      "orangeShift",
      "skinToneWarmth",
      "colorSeparation",
      "colorLeak",
      "colorHarmony"
    ]
  },
  {
    id: "lens",
    title: "Lens, Glow & Optical FX",
    description: "Bloom, halo, soft focus, flare, radial/motion blur, prism, and camera-lens artifacts.",
    controls: [
      "bloom",
      "halo",
      "lensFlare",
      "chromaticAberration",
      "glowRadius",
      "glowStrength",
      "softFocus",
      "tiltShift",
      "radialBlur",
      "motionBlur",
      "prismSplit",
      "fisheye",
      "barrelWarp",
      "glitchShift",
      "mirrorGhost",
      "lightWrap",
      "edgeGlow",
      "centerGlow",
      "bokehBloom",
      "flareStreak",
      "chromaticGlow"
    ]
  },
  {
    id: "spectral",
    title: "Spectral IR / UVA / Thermal",
    description: "IR, UVA, chlorophyll, mineral, aura, night-scope, thermal, x-ray, and negative-depth effects.",
    controls: [
      "infraredWash",
      "ultravioletWash",
      "thermalBlend",
      "splitTone",
      "nearIrBoost",
      "uvaFluorescence",
      "chlorophyllGlow",
      "mineralPop",
      "auraBloom",
      "xrayGhost",
      "thermalContour",
      "heatEdge",
      "nightScope",
      "negativeDepth"
    ]
  },
  {
    id: "analog",
    title: "Analog, Print & Display",
    description: "Matte, scanlines, CRT curve, halation, threshold, solarize, and print-style looks.",
    controls: ["matte", "scanlines", "crtCurve", "halation", "threshold", "solarize", "duotone", "colorDodge"]
  },
  {
    id: "creative",
    title: "Creative Mix Finish",
    description: "Overlay and compositing finishers that bind color mixers, inversion, and spectral filters together.",
    controls: ["overlayStrength", "glow", "grain", "sepia", "grayscale", "invert"]
  }
];

const ADJUSTMENT_LOOKUP = new Map(
  [
    ...CORE_ADJUSTMENTS,
    ...FINISH_ADJUSTMENTS,
    ...INVERSION_ADJUSTMENTS,
    ...SMART_DARK_EDGE_ADJUSTMENTS,
    ...SPATIAL_RECOGNITION_ADJUSTMENTS,
    ...SMART_SIGNAL_ADJUSTMENTS,
    ...THERMAL_STUDIO_NUMERIC_ADJUSTMENTS,
    ...ADVANCED_ADJUSTMENTS
  ].map((control) => [
    control[0],
    control
  ])
);

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
    settings: { brightness: 96, contrast: 126, saturation: 112, temperature: 18, grain: 8 }
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
    category: "TriTone",
    variants: TRI_TONE_VARIANTS,
    color: "rgba(255, 94, 168, 0.24)",
    blendMode: "soft-light",
    settings: { brightness: 104, contrast: 128, saturation: 172, duotone: 54, splitTone: 22, colorHarmony: 22 }
  },
  {
    category: "QuadTone",
    variants: QUAD_TONE_VARIANTS,
    color: "rgba(255, 220, 88, 0.22)",
    blendMode: "overlay",
    settings: { brightness: 102, contrast: 136, saturation: 184, duotone: 60, splitTone: 30, posterize: 8, overlayStrength: 18 }
  },
  {
    category: "Channel Spectrograph",
    variants: CHANNEL_SPECTROGRAPH_VARIANTS,
    color: "rgba(34, 220, 255, 0.24)",
    blendMode: "screen",
    settings: { brightness: 100, contrast: 148, saturation: 166, colorSeparation: 34, chromaticAberration: 18, scanlines: 12, edgeEnhance: 18 }
  },
  {
    category: "Black",
    variants: BLACK_VARIANTS,
    color: "rgba(10, 10, 14, 0.38)",
    blendMode: "multiply",
    settings: { brightness: 84, contrast: 176, saturation: 42, blackPoint: 26, shadowDepth: 32, shadowCrush: 24, localContrast: 18 }
  },
  {
    category: "Channel Sweep",
    variants: CHANNEL_SWEEP_VARIANTS,
    color: "rgba(255, 86, 34, 0.24)",
    blendMode: "screen",
    settings: { brightness: 102, contrast: 136, saturation: 186, colorSeparation: 26, chromaticAberration: 16, glitchShift: 10, hue: 18 }
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
    category: "Color Inversion Matrix",
    variants: [...INVERSION_STYLE_VARIANTS, ...EXTRA_INVERSION_STYLE_VARIANTS],
    color: "rgba(245,248,251,0.18)",
    blendMode: "difference",
    settings: { brightness: 104, contrast: 146, saturation: 150, colorSeparation: 18, invert: 12 }
  },
  {
    category: "Thermal Looks",
    variants: [
      {
        name: "Heat Map",
        color: "rgba(255, 228, 0, 0.34)",
        settings: { thermalPalette: "rgb-spectrum", thermalBlend: 96, thermalContour: 72, heatEdge: 66, brightness: 112, contrast: 178, saturation: 244, posterize: 14, edgeEnhance: 28 }
      },
      {
        name: "Solar Scan",
        color: "rgba(255, 190, 0, 0.34)",
        settings: { thermalPalette: "solar-lime", thermalBlend: 94, thermalContour: 64, heatEdge: 58, brightness: 114, contrast: 170, saturation: 226, glow: 12 }
      },
      {
        name: "Amber Thermal",
        color: "rgba(255, 146, 24, 0.34)",
        settings: { thermalPalette: "orange-green", thermalBlend: 92, thermalContour: 66, heatEdge: 56, brightness: 110, contrast: 174, saturation: 218, sepia: 6 }
      },
      {
        name: "Plasma Core",
        color: "rgba(255, 52, 0, 0.36)",
        settings: { thermalPalette: "flare-spectrum", thermalBlend: 98, thermalContour: 78, heatEdge: 76, brightness: 108, contrast: 190, saturation: 250, localContrast: 12 }
      },
      {
        name: "Ember Field",
        color: "rgba(255, 92, 0, 0.34)",
        settings: { thermalPalette: "ember-green", thermalBlend: 96, thermalContour: 76, heatEdge: 72, brightness: 106, contrast: 186, saturation: 238, shadowCrush: 8, edgeGlow: 8 }
      },
      {
        name: "Radiant Skin",
        color: "rgba(255, 246, 46, 0.32)",
        settings: { thermalPalette: "red-lime", thermalBlend: 92, thermalContour: 58, heatEdge: 50, brightness: 118, contrast: 160, saturation: 224, vibrance: 14 }
      },
      {
        name: "Blue Heat",
        color: "rgba(31, 116, 255, 0.3)",
        settings: { thermalPalette: "blue-core", thermalBlend: 88, thermalContour: 56, heatEdge: 48, brightness: 110, contrast: 158, saturation: 200, temperature: -8 }
      },
      {
        name: "Thermal Edge",
        color: "rgba(54, 255, 80, 0.32)",
        settings: { thermalPalette: "edge-spectrum", thermalBlend: 94, thermalContour: 88, heatEdge: 86, brightness: 106, contrast: 196, saturation: 240, edgeEnhance: 34, localContrast: 14 }
      },
      {
        name: "White Hot",
        color: "rgba(255, 255, 255, 0.22)",
        settings: { thermalPalette: "white-hot", thermalBlend: 88, thermalContour: 70, heatEdge: 52, brightness: 122, contrast: 184, saturation: 50, grayscale: 18, glow: 10 }
      },
      {
        name: "Black Hot",
        color: "rgba(25, 36, 52, 0.35)",
        settings: { thermalPalette: "black-hot", thermalBlend: 90, thermalContour: 76, heatEdge: 56, brightness: 104, contrast: 190, saturation: 40, grayscale: 26 }
      }
    ],
    color: "rgba(255,76,18,0.28)",
    blendMode: "color-dodge",
    settings: { brightness: 115, contrast: 152, saturation: 170, hue: -18, duotone: 36, glow: 20, thermalPalette: "classic", thermalBlend: 70, thermalContour: 44, heatEdge: 36 }
  },
  {
    category: "Thermal Variations",
    variants: [
      {
        name: "Prismatic Heat",
        color: "rgba(255, 224, 32, 0.34)",
        settings: { thermalPalette: "rgb-spectrum", thermalBlend: 100, thermalContour: 72, heatEdge: 72, brightness: 116, contrast: 182, saturation: 250, posterize: 18, edgeEnhance: 36 }
      },
      {
        name: "RGB Spectrum Thermal",
        color: "rgba(40, 255, 64, 0.34)",
        settings: { thermalPalette: "rgb-spectrum", thermalBlend: 100, thermalContour: 78, heatEdge: 78, brightness: 112, contrast: 190, saturation: 260, posterize: 20, edgeEnhance: 42, localContrast: 16 }
      },
      {
        name: "Inverted RGB Red Thermal",
        color: "rgba(255, 36, 0, 0.38)",
        settings: { thermalPalette: "inverted-red-rgb", thermalBlend: 100, thermalContour: 88, heatEdge: 88, thermalInvert: 78, redInvert: 84, channelInvert: 36, brightness: 104, contrast: 214, saturation: 260, posterize: 26, edgeEnhance: 48, localContrast: 24, shadowCrush: 20, dehaze: 12 }
      },
      {
        name: "Full Range Heat Scan",
        color: "rgba(255, 222, 0, 0.34)",
        settings: { thermalPalette: "full-range-rgb", thermalBlend: 100, thermalContour: 82, heatEdge: 80, brightness: 110, contrast: 198, saturation: 260, posterize: 22, edgeEnhance: 38, shadowCrush: 6 }
      },
      {
        name: "Red Lime Thermal",
        color: "rgba(200, 255, 0, 0.34)",
        settings: { thermalPalette: "red-lime", thermalBlend: 96, thermalContour: 76, heatEdge: 74, brightness: 110, contrast: 184, saturation: 246, dehaze: 10 }
      },
      {
        name: "Orange Green Field",
        color: "rgba(255, 150, 0, 0.34)",
        settings: { thermalPalette: "orange-green", thermalBlend: 96, thermalContour: 74, heatEdge: 70, brightness: 112, contrast: 180, saturation: 238, localContrast: 12 }
      },
      {
        name: "Solar Lime Fire",
        color: "rgba(255, 238, 0, 0.34)",
        settings: { thermalPalette: "solar-lime", thermalBlend: 98, thermalContour: 78, heatEdge: 78, brightness: 114, contrast: 188, saturation: 252, glow: 10, edgeGlow: 8 }
      },
      {
        name: "Ember Green Depth",
        color: "rgba(255, 82, 0, 0.34)",
        settings: { thermalPalette: "ember-green", thermalBlend: 98, thermalContour: 82, heatEdge: 82, brightness: 106, contrast: 200, saturation: 246, shadowCrush: 14, localContrast: 18 }
      },
      {
        name: "Predator Spectrum",
        color: "rgba(24, 220, 255, 0.34)",
        settings: { thermalPalette: "predator", thermalBlend: 96, thermalContour: 74, heatEdge: 70, brightness: 106, contrast: 182, saturation: 240, sharpen: 26, scanlines: 10 }
      },
      {
        name: "Blue Core Heat",
        color: "rgba(31, 116, 255, 0.32)",
        settings: { thermalPalette: "blue-core", thermalBlend: 94, thermalContour: 58, heatEdge: 54, brightness: 110, contrast: 164, saturation: 218, hue: -18 }
      },
      {
        name: "Ironbow Thermal",
        color: "rgba(255, 98, 26, 0.34)",
        settings: { thermalPalette: "ironbow", thermalBlend: 98, thermalContour: 62, heatEdge: 48, brightness: 112, contrast: 172, saturation: 214, sepia: 8 }
      },
      {
        name: "White Hot Scan",
        color: "rgba(255, 255, 255, 0.22)",
        settings: { thermalPalette: "white-hot", thermalBlend: 90, thermalContour: 72, heatEdge: 52, brightness: 122, contrast: 188, saturation: 48, grayscale: 18, glow: 12 }
      },
      {
        name: "Black Hot Scan",
        color: "rgba(25, 36, 52, 0.35)",
        settings: { thermalPalette: "black-hot", thermalBlend: 92, thermalContour: 78, heatEdge: 56, brightness: 104, contrast: 194, saturation: 36, grayscale: 30 }
      },
      {
        name: "Molten Edge",
        color: "rgba(255, 52, 18, 0.36)",
        settings: { thermalPalette: "molten", thermalBlend: 96, thermalContour: 86, heatEdge: 88, brightness: 114, contrast: 190, saturation: 226, edgeGlow: 16 }
      },
      {
        name: "Neon Thermal",
        color: "rgba(0, 255, 196, 0.32)",
        settings: { thermalPalette: "neon", thermalBlend: 100, thermalContour: 56, heatEdge: 62, brightness: 116, contrast: 166, saturation: 250, glow: 18, chromaticGlow: 18 }
      },
      {
        name: "Arctic Heat",
        color: "rgba(80, 210, 255, 0.34)",
        settings: { thermalPalette: "arctic", thermalBlend: 94, thermalContour: 64, heatEdge: 50, brightness: 108, contrast: 170, saturation: 220, temperature: -20 }
      },
      {
        name: "Pink Thermal Plate",
        color: "rgba(255, 76, 144, 0.32)",
        settings: { thermalPalette: "pink-plate", thermalBlend: 92, thermalContour: 54, heatEdge: 42, brightness: 120, contrast: 154, saturation: 212, tint: 18 }
      },
      {
        name: "Lava Rainbow",
        color: "rgba(255, 42, 16, 0.34)",
        settings: { thermalPalette: "lava-rainbow", thermalBlend: 100, thermalContour: 72, heatEdge: 72, brightness: 116, contrast: 184, saturation: 248, posterize: 20, edgeEnhance: 28 }
      },
      {
        name: "Deep Ocean Heat",
        color: "rgba(0, 190, 255, 0.32)",
        settings: { thermalPalette: "deep-ocean", thermalBlend: 96, thermalContour: 64, heatEdge: 58, brightness: 108, contrast: 176, saturation: 232, temperature: -26, clarity: 16 }
      },
      {
        name: "Toxic Heat Trace",
        color: "rgba(170, 255, 0, 0.32)",
        settings: { thermalPalette: "toxic-heat", thermalBlend: 98, thermalContour: 76, heatEdge: 74, brightness: 112, contrast: 188, saturation: 250, hue: 18, scanlines: 8 }
      },
      {
        name: "Amber Blue Split",
        color: "rgba(255, 178, 36, 0.32)",
        settings: { thermalPalette: "amber-blue", thermalBlend: 94, thermalContour: 62, heatEdge: 60, brightness: 114, contrast: 170, saturation: 218, duotone: 24 }
      },
      {
        name: "Carbon Fire",
        color: "rgba(255, 72, 18, 0.36)",
        settings: { thermalPalette: "carbon-fire", thermalBlend: 98, thermalContour: 82, heatEdge: 86, brightness: 102, contrast: 204, saturation: 210, shadowCrush: 18, edgeGlow: 10 }
      },
      {
        name: "Spectral Ice",
        color: "rgba(94, 228, 255, 0.3)",
        settings: { thermalPalette: "spectral-ice", thermalBlend: 94, thermalContour: 70, heatEdge: 52, brightness: 118, contrast: 164, saturation: 226, tint: -18, ultravioletWash: 12 }
      },
      {
        name: "Radar Heat",
        color: "rgba(68, 255, 122, 0.3)",
        settings: { thermalPalette: "radar-heat", thermalBlend: 92, thermalContour: 86, heatEdge: 78, brightness: 106, contrast: 190, saturation: 206, nightScope: 18, scanlines: 16 }
      },
      {
        name: "Ghost Thermal",
        color: "rgba(226, 232, 255, 0.24)",
        settings: { thermalPalette: "ghost-thermal", thermalBlend: 88, thermalContour: 72, heatEdge: 46, brightness: 122, contrast: 156, saturation: 120, grayscale: 16, xrayGhost: 18 }
      },
      {
        name: "Copper Hot",
        color: "rgba(255, 124, 36, 0.32)",
        settings: { thermalPalette: "copper-hot", thermalBlend: 94, thermalContour: 66, heatEdge: 62, brightness: 112, contrast: 176, saturation: 186, sepia: 18, vibrance: 14 }
      },
      {
        name: "Ultraviolet Heat",
        color: "rgba(176, 92, 255, 0.34)",
        settings: { thermalPalette: "ultraviolet-heat", thermalBlend: 96, thermalContour: 68, heatEdge: 64, brightness: 116, contrast: 174, saturation: 242, ultravioletWash: 22, chromaticGlow: 10 }
      },
      {
        name: "Dark Field Rainbow",
        color: "rgba(0, 88, 255, 0.28)",
        settings: { thermalPalette: "dark-rainbow", thermalBlend: 100, thermalContour: 70, heatEdge: 68, brightness: 106, contrast: 188, saturation: 250, shadowCrush: 12, dehaze: 12 }
      },
      {
        name: "Cold Room Heat",
        color: "rgba(0, 198, 255, 0.26)",
        settings: { thermalPalette: "cold-room", thermalBlend: 98, thermalContour: 66, heatEdge: 62, brightness: 104, contrast: 182, saturation: 242, temperature: -22, clarity: 12 }
      },
      {
        name: "Nightfire Thermal",
        color: "rgba(255, 88, 0, 0.3)",
        settings: { thermalPalette: "nightfire", thermalBlend: 100, thermalContour: 76, heatEdge: 78, brightness: 102, contrast: 198, saturation: 236, shadowCrush: 20, localContrast: 14 }
      },
      {
        name: "Cobalt Hot Trace",
        color: "rgba(0, 122, 255, 0.28)",
        settings: { thermalPalette: "cobalt-hot", thermalBlend: 98, thermalContour: 82, heatEdge: 76, brightness: 104, contrast: 194, saturation: 232, sharpen: 12, edgeEnhance: 16 }
      },
      {
        name: "Emerald Heat Map",
        color: "rgba(0, 255, 144, 0.28)",
        settings: { thermalPalette: "emerald-heat", thermalBlend: 96, thermalContour: 72, heatEdge: 70, brightness: 106, contrast: 184, saturation: 238, nightScope: 8, dehaze: 10 }
      },
      {
        name: "Blue Flame Thermal",
        color: "rgba(0, 210, 255, 0.3)",
        settings: { thermalPalette: "blue-flame", thermalBlend: 100, thermalContour: 74, heatEdge: 72, brightness: 104, contrast: 192, saturation: 250, temperature: -18, vibrance: 18 }
      },
      {
        name: "Deep Sea Predator",
        color: "rgba(0, 64, 255, 0.3)",
        settings: { thermalPalette: "deep-sea-predator", thermalBlend: 98, thermalContour: 78, heatEdge: 80, brightness: 102, contrast: 202, saturation: 246, scanlines: 6, shadowCrush: 14 }
      },
      {
        name: "Midnight Ironbow",
        color: "rgba(255, 96, 0, 0.28)",
        settings: { thermalPalette: "midnight-ironbow", thermalBlend: 100, thermalContour: 72, heatEdge: 66, brightness: 104, contrast: 190, saturation: 228, sepia: 4, blacks: -8 }
      },
      {
        name: "Object Heat Isolate",
        color: "rgba(255, 210, 0, 0.28)",
        settings: { thermalPalette: "object-heat-isolate", thermalBlend: 100, thermalContour: 88, heatEdge: 84, brightness: 100, contrast: 206, saturation: 250, shadowCrush: 24, highlightRecovery: 10 }
      },
      {
        name: "Lowlight Thermal Pop",
        color: "rgba(56, 255, 238, 0.28)",
        settings: { thermalPalette: "lowlight-pop", thermalBlend: 96, thermalContour: 68, heatEdge: 68, brightness: 102, contrast: 186, saturation: 236, ambientLift: -8, clarity: 16 }
      }
    ],
    color: "rgba(255,76,18,0.28)",
    blendMode: "overlay",
    settings: { brightness: 108, contrast: 176, saturation: 228, thermalBlend: 92, thermalContour: 60, heatEdge: 54, overlayStrength: 0 }
  },
  {
    category: "XLS Camera",
    variants: XLS_CAMERA_VARIANTS,
    color: "rgba(90, 255, 214, 0.32)",
    blendMode: "screen",
    settings: { brightness: 112, contrast: 168, saturation: 205, hue: 20, thermalPalette: "xls", thermalBlend: 82, thermalContour: 70, heatEdge: 58, xrayGhost: 42, nearIrBoost: 34, ultravioletWash: 28, infraredWash: 24, edgeEnhance: 22, glow: 12 }
  },
  {
    category: "Exposure Tools",
    names: ["Low Exposure", "High Exposure", "Shadow Lift", "Highlight Guard", "Contrast Pull", "Gamma Lift", "Soft HDR", "Hard HDR", "Backlight Save", "Window Light"],
    color: "rgba(255,255,255,0.1)",
    blendMode: "screen",
    settings: { brightness: 104, contrast: 116, saturation: 108, exposure: 14 }
  },
  {
    category: "Color Lab",
    names: ["Hue Spin", "Warm Shift", "Cool Shift", "Tint Rose", "Tint Green", "Saturation Pop", "Muted Palette", "Deep Color", "Pastel Wash", "Prism"],
    color: "rgba(64,180,255,0.2)",
    blendMode: "overlay",
    settings: { brightness: 102, contrast: 108, saturation: 146, hue: 34, tint: 10 }
  }
];

function amplifyPresetSettings(settings = {}) {
  return Object.fromEntries(
    Object.entries(settings).map(([key, value]) => [key, amplifyPresetSettingValue(key, value)])
  );
}

function amplifyPresetSettingValue(key, value) {
  if (key === "vignette") return 0;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return value;
  const range = settingRange(key);
  const neutral = Number(DEFAULT_SETTINGS[key] ?? 0);
  const amplified = neutral + (numeric - neutral) * PRESET_INTENSITY_MULTIPLIER;
  return Math.round(clamp(amplified, range.min, range.max));
}

function amplifyPresetOverlayColor(color) {
  if (typeof color !== "string") return color;
  return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/i, (_match, red, green, blue, alpha) => {
    const boostedAlpha = clamp(Number(alpha) * PRESET_INTENSITY_MULTIPLIER, 0, 0.96);
    return `rgba(${red.trim()}, ${green.trim()}, ${blue.trim()}, ${Number(boostedAlpha.toFixed(3))})`;
  });
}

const DISTINCT_PRESET_TUNING = [
  { exposure: 8, contrast: 113, saturation: 122, colorSeparation: 8, clarity: 8, redChannel: 112, greenChannel: 96, blueChannel: 104 },
  { exposure: -6, contrast: 128, saturation: 146, hue: 28, chromaticGlow: 10, blueChannel: 138, greenChannel: 92, purpleShift: 14 },
  { exposure: 3, contrast: 150, saturation: 120, edgeEnhance: 12, colorSeparation: 18, prismSplit: 8, sharpen: 10 },
  { exposure: 12, contrast: 138, saturation: 172, glow: 10, bloom: 12, colorLeak: 10, redChannel: 132, blueChannel: 120 },
  { exposure: -10, contrast: 162, saturation: 88, grayscale: 12, shadowCrush: 10, localContrast: 12, blueHueShift: -10 },
  { exposure: 6, contrast: 124, saturation: 190, temperature: 12, vibrance: 18, orangeShift: 16, greenChannel: 124 },
  { exposure: -2, contrast: 146, saturation: 208, hue: -36, duotone: 12, purpleShift: 22, chromaticAberration: 10 },
  { exposure: 14, contrast: 118, saturation: 132, matte: 12, halation: 12, highlightRecovery: 14, softFocus: 8 },
  { exposure: -14, contrast: 176, saturation: 156, dehaze: 14, structure: 14, blackPoint: 12, shadowDepth: 14 },
  { exposure: 4, contrast: 134, saturation: 236, hue: 58, scanlines: 10, glitchShift: 8, colorDodge: 10 }
];

const UVA_PRESET_TUNING = [
  { uvaFluorescence: 18, ultravioletWash: 16, chromaticGlow: 18, auraBloom: 14, glow: 12, greenChannel: 132, blueChannel: 156, redChannel: 82, purpleShift: 18 },
  { uvaFluorescence: 14, ultravioletWash: 20, blueChannel: 176, redChannel: 74, colorSeparation: 12, prismSplit: 6, tint: 18 },
  { uvaFluorescence: 12, edgeGlow: 18, edgeEnhance: 16, contrast: 142, saturation: 168, aquaShift: 14, blueChannel: 148 },
  { uvaFluorescence: 16, ultravioletWash: 18, colorDodge: 14, glowStrength: 18, magentaBalance: 20, blueChannel: 132, redChannel: 128 },
  { uvaFluorescence: 10, nearIrBoost: 12, grayscale: 16, contrast: 158, blueChannel: 178, greenChannel: 74, purpleShift: 20 },
  { mineralPop: 18, uvaFluorescence: 10, chlorophyllGlow: 12, colorSeparation: 14, yellowBalance: 18, greenChannel: 154, redChannel: 118 },
  { auraBloom: 18, chromaticGlow: 20, bokehBloom: 12, purpleShift: 28, saturation: 190, glow: 14 },
  { ultravioletWash: 16, tint: 30, colorizeHue: -78, colorizeStrength: 16, redChannel: 142, blueChannel: 164 },
  { ultravioletWash: 12, uvaFluorescence: 12, ambientLift: 12, softFocus: 8, blueChannel: 150, greenChannel: 118 },
  { auraBloom: 14, mineralPop: 10, chromaticGlow: 16, hue: -52, saturation: 180, redHueShift: 16, purpleShift: 24 }
];

const CYBER_PRESET_TUNING = [
  { hue: -22, colorSeparation: 20, chromaticGlow: 18, cyanBalance: 26, blueChannel: 168, greenChannel: 132, redChannel: 60 },
  { hue: 42, colorSeparation: 28, chromaticAberration: 18, magentaBalance: 44, redChannel: 184, blueChannel: 168, greenChannel: 42, purpleShift: 28 },
  { hue: -118, prismSplit: 24, glitchShift: 14, scanlines: 10, redChannel: 18, greenChannel: 72, blueChannel: 200, cyanBalance: 26, contrast: 154 },
  { hue: 96, redHueShift: 36, purpleShift: 42, chromaticGlow: 20, colorLeak: 18, redChannel: 196, blueChannel: 150, greenChannel: 28 },
  { hue: 118, duotone: 20, splitTone: 28, colorizeStrength: 16, purpleShift: 36, orangeShift: 18 },
  { hue: -112, thermalContour: 10, edgeGlow: 18, colorSeparation: 22, blueChannel: 184, greenChannel: 88 },
  { hue: 12, glowStrength: 20, bloom: 16, saturation: 220, redChannel: 156, greenChannel: 118, blueChannel: 164 },
  { hue: -46, scanlines: 22, glitchShift: 20, noiseColor: 10, greenChannel: 148, blueChannel: 132 },
  { hue: 64, chrome: 0, grayscale: 22, colorDodge: 18, contrast: 166, chromaticAberration: 20 },
  { hue: 156, posterize: 12, threshold: 8, colorSeparation: 26, prismSplit: 22, saturation: 232 }
];

const CATEGORY_PRESET_TUNING = {
  "UVA / Fluorescence": UVA_PRESET_TUNING,
  "Cyber Neon": CYBER_PRESET_TUNING,
  "Clean Studio": [
    { brightness: 102, contrast: 102, saturation: 104 },
    { softFocus: 8, brightness: 106, highlights: 8 },
    { clarity: 10, dehaze: 6, contrast: 112 },
    { exposure: 8, glow: 5, tint: 6 },
    { vibrance: 10, colorHarmony: 8, saturation: 112 },
    { temperature: 10, whiteBalance: 8, brightness: 112 },
    { redChannel: 104, greenChannel: 104, blueChannel: 104, clarityMask: 8 },
    { ambientLift: 8, highlights: 12, softFocus: 5 },
    { grayscale: 8, contrast: 120, fineSharpen: 8 },
    { exposure: 6, saturation: 118, whitePoint: 8 }
  ],
  "Cinematic": [
    { temperature: 24, aquaShift: -18, orangeShift: 28, contrast: 142 },
    { exposure: -12, shadowCrush: 16, blackPoint: 14, contrast: 162 },
    { temperature: 32, halation: 14, bloom: 8, saturation: 126 },
    { matte: 18, fade: 12, grain: 14, contrast: 110 },
    { cyanBalance: 20, grayscale: 12, contrast: 156 },
    { saturation: 70, colorDodge: 10, dehaze: 16, blackPoint: 18 },
    { softFocus: 14, highlights: 18, tint: 10 },
    { exposure: -8, blueHueShift: -18, shadowDepth: 18, glow: 6 },
    { softFocus: 20, bokehBloom: 14, brightness: 106 },
    { flareStreak: 18, lensFlare: 12, chromaticAberration: 12, orangeShift: 14 }
  ],
  "Black & White": [
    { grayscale: 100, contrast: 136, clarity: 8 },
    { grayscale: 100, contrast: 180, threshold: 8, shadowCrush: 18 },
    { grayscale: 100, softFocus: 12, matte: 12, contrast: 112 },
    { grayscale: 100, posterize: 14, grain: 20, contrast: 150 },
    { grayscale: 100, sepia: 10, glow: 6, exposure: -4 },
    { grayscale: 100, structure: 18, dehaze: 14, contrast: 160 },
    { grayscale: 100, grain: 28, scratches: 12, halation: 10 },
    { grayscale: 100, blackPoint: 20, shadowDepth: 22, edgeEnhance: 12 },
    { grayscale: 100, brightness: 108, contrast: 124, fineSharpen: 10 },
    { grayscale: 100, exposure: 12, whites: 18, glowStrength: 12 }
  ],
  "Duotone": [
    { splitTone: 34, blueHueShift: -22, orangeShift: 22, duotone: 22 },
    { splitTone: -36, redHueShift: 26, aquaShift: 28, duotone: 24 },
    { purpleShift: 30, greenHueShift: 24, colorSeparation: 12, duotone: 26 },
    { redHueShift: 18, yellowBalance: 20, tint: 18, duotone: 28 },
    { aquaShift: 28, magentaBalance: 20, colorHarmony: 12, duotone: 30 },
    { greenHueShift: 28, cyanBalance: 18, grayscale: 8, duotone: 22 },
    { orangeShift: 30, blueHueShift: -34, shadowDepth: 10, duotone: 26 },
    { redHueShift: 32, grayscale: 16, blackPoint: 12, duotone: 24 },
    { temperature: -24, orangeShift: 36, saturation: 176, duotone: 30 },
    { splitTone: 48, colorSeparation: 22, contrast: 154, duotone: 34 }
  ],
  "Retro Film": [
    { sepia: 16, temperature: 22, grain: 22, dust: 8 },
    { sepia: 32, matte: 18, scratches: 10, contrast: 104 },
    { fade: 20, saturation: 70, grain: 16, blueHueShift: -12 },
    { temperature: 28, halation: 16, bloom: 8, exposure: 6 },
    { temperature: -18, cyanBalance: 16, fade: 14, dust: 10 },
    { scanlines: 12, filmGrainSize: 18, contrast: 118, halation: 10 },
    { contrast: 152, grain: 24, shadowCrush: 12, saturation: 112 },
    { matte: 22, posterize: 8, grain: 14, blackPoint: 10 },
    { temperature: 34, fade: 10, sepia: 18, glow: 7 },
    { saturation: 62, dust: 18, scratches: 14, contrast: 116 }
  ],
  "Night Vision": [
    { nightScope: 18, greenChannel: 170, redChannel: 46, blueChannel: 58, scanlines: 8 },
    { nightScope: 22, glow: 12, greenHueShift: 28, contrast: 160 },
    { thermalPalette: "predator", thermalBlend: 14, greenChannel: 160, heatEdge: 10 },
    { shadowCrush: 18, greenChannel: 156, dehaze: 16, contrast: 172 },
    { nightScope: 26, glowStrength: 16, saturation: 82, greenHueShift: 34 },
    { exposure: -16, shadowDepth: 24, edgeEnhance: 12, scanlines: 16 },
    { grayscale: 78, nightScope: 24, greenChannel: 180, contrast: 154 },
    { scanlines: 24, crtCurve: 18, greenHueShift: 22, edgeGlow: 8 },
    { glow: 16, lensFlare: 8, greenChannel: 166, brightness: 104 },
    { exposure: -20, blackPoint: 18, greenChannel: 142, dehaze: 20 }
  ],
  "Exposure Tools": [
    { exposure: -22, blackPoint: 12, contrast: 128 },
    { exposure: 26, whitePoint: 12, highlights: 18 },
    { shadows: 26, ambientLift: 18, shadowDepth: 6 },
    { highlightRecovery: 28, whites: -12, specularControl: -18 },
    { contrast: 164, midtoneContrast: 18, localContrast: 14 },
    { gamma: 28, midtoneLift: 16, brightness: 108 },
    { hdrRange: 28, highlightRecovery: 18, shadows: 14 },
    { hdrRange: 38, contrast: 156, detailBoost: 14 },
    { ambientLift: 24, highlightRecovery: 22, dehaze: 10 },
    { whites: 18, exposure: 12, glow: 6 }
  ],
  "Color Lab": [
    { hue: 72, saturation: 160, colorSeparation: 10 },
    { temperature: 34, orangeShift: 24, redChannel: 130 },
    { temperature: -34, aquaShift: 24, blueChannel: 148 },
    { tint: 34, magentaBalance: 24, redHueShift: 18 },
    { tint: -34, greenHueShift: 28, greenChannel: 144 },
    { saturation: 210, vibrance: 24, colorHarmony: 14 },
    { saturation: 54, matte: 10, fade: 12 },
    { saturation: 226, contrast: 146, colorLeak: 12 },
    { brightness: 114, saturation: 126, softFocus: 10 },
    { prismSplit: 20, colorSeparation: 22, chromaticGlow: 18 }
  ]
};

function retouchPresetSettings(category, name, index, baseSettings = {}) {
  const categoryTuningSet = CATEGORY_PRESET_TUNING[category];
  const generic = categoryTuningSet ? {} : DISTINCT_PRESET_TUNING[index % DISTINCT_PRESET_TUNING.length] || {};
  const categoryTuning = categoryTuningSet?.[index] || {};
  const tuned = {
    ...baseSettings,
    ...generic,
    ...categoryTuning
  };
  if (category.includes("Thermal")) {
    tuned.thermalBlend = Math.max(tuned.thermalBlend ?? 0, 18 + (index % 5) * 3);
    tuned.thermalContour = Math.max(tuned.thermalContour ?? 0, 12 + (index % 7) * 2);
    tuned.heatEdge = Math.max(tuned.heatEdge ?? 0, 10 + (index % 6) * 2);
    tuned.posterize = Math.max(tuned.posterize ?? 0, 6 + (index % 4) * 2);
    tuned.edgeEnhance = Math.max(tuned.edgeEnhance ?? 0, 8 + (index % 5) * 2);
  }
  if (category === "Color Inversion Matrix") {
    tuned.colorSeparation = Math.max(tuned.colorSeparation ?? 0, 10 + index * 2);
    tuned.contrast = Math.max(tuned.contrast ?? 100, 138 + index * 3);
  }
  if (category === "XLS Camera") {
    tuned.thermalBlend = Math.max(tuned.thermalBlend ?? 0, 74 + (index % 5) * 5);
    tuned.thermalContour = Math.max(tuned.thermalContour ?? 0, 62 + (index % 6) * 5);
    tuned.heatEdge = Math.max(tuned.heatEdge ?? 0, 50 + (index % 7) * 5);
    tuned.xrayGhost = Math.max(tuned.xrayGhost ?? 0, 38 + (index % 6) * 6);
    tuned.edgeEnhance = Math.max(tuned.edgeEnhance ?? 0, 18 + (index % 5) * 5);
  }
  if (["TriTone", "QuadTone", "Channel Spectrograph", "Black", "Channel Sweep"].includes(category)) {
    tuned.colorSeparation = Math.max(tuned.colorSeparation ?? 0, 12 + (index % 7) * 5);
    tuned.localContrast = Math.max(tuned.localContrast ?? 0, 8 + (index % 5) * 4);
    tuned.vibrance = Math.max(tuned.vibrance ?? 0, 10 + (index % 6) * 6);
  }
  if (name === "UVA Bloom") {
    Object.assign(tuned, {
      uvaFluorescence: Math.max(tuned.uvaFluorescence ?? 0, 22),
      ultravioletWash: Math.max(tuned.ultravioletWash ?? 0, 18),
      chromaticGlow: Math.max(tuned.chromaticGlow ?? 0, 20),
      auraBloom: Math.max(tuned.auraBloom ?? 0, 16),
      colorSeparation: Math.max(tuned.colorSeparation ?? 0, 18),
      greenChannel: Math.max(tuned.greenChannel ?? 100, 148),
      blueChannel: Math.max(tuned.blueChannel ?? 100, 168),
      redChannel: Math.min(tuned.redChannel ?? 100, 72)
    });
  }
  return clampPresetSettings(tuned);
}

function clampPresetSettings(settings = {}) {
  return Object.fromEntries(
    Object.entries(settings).map(([key, value]) => {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) return [key, value];
      const range = settingRange(key);
      return [key, Math.round(clamp(numeric, range.min, range.max))];
    })
  );
}

const CAMERA_EFFECTS = EFFECT_FAMILIES.flatMap((family, familyIndex) =>
  (family.variants || family.names.map((name) => ({ name }))).map((variant, index) => {
    const baseSettings = retouchPresetSettings(family.category, variant.name, index, { ...family.settings, ...(variant.settings || {}) });
    const wave = index - 4.5;
    const hueVariation = family.category === "Clean Studio" ? 0 : ((familyIndex * 17 + index * 9) % 82) - 41;
    const variedSettings = {
      ...baseSettings,
      brightness: clamp((baseSettings.brightness ?? 100) + Math.round(wave * 1.5), 20, 220),
      contrast: clamp((baseSettings.contrast ?? 100) + Math.round((index % 5) * 3), 20, 220),
      saturation: clamp((baseSettings.saturation ?? 100) + Math.round((index % 4) * 5), 0, 260),
      hue: clamp((baseSettings.hue ?? 0) + hueVariation, -180, 180),
      grain: clamp((baseSettings.grain ?? 0) + (baseSettings.grain == null ? 0 : (index % 4) * 2), 0, 80),
      glow: clamp((baseSettings.glow ?? 0) + (baseSettings.glow == null ? 0 : (index % 3) * 3), 0, 60)
    };
    const amplifiedSettings = amplifyPresetSettings(variedSettings);
    return {
      id: `${family.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
      name: variant.name,
      category: family.category,
      overlayColor: amplifyPresetOverlayColor(variant.color || family.color),
      blendMode: variant.blendMode || family.blendMode,
      enabled: true,
      favorite: index === 0 || index === 5,
      highIntensity: true,
      intensityMultiplier: PRESET_INTENSITY_MULTIPLIER,
      settings: {
        ...DEFAULT_SETTINGS,
        ...amplifiedSettings
      }
    };
  })
);

const CAMERA_EFFECT_LOOKUP = new Map(CAMERA_EFFECTS.map((effect) => [effect.id, effect]));
const CATEGORIES = ["All Presets", "Favorites", ...EFFECT_FAMILIES.map((family) => family.category)];
const CATEGORY_COUNTS = new Map(
  CATEGORIES.map((category) => {
    if (category === "All Presets") return [category, CAMERA_EFFECTS.length];
    if (category === "Favorites") return [category, CAMERA_EFFECTS.filter((effect) => effect.favorite).length];
    return [category, CAMERA_EFFECTS.reduce((count, effect) => count + (effect.category === category ? 1 : 0), 0)];
  })
);
const EFFECT_PRESET_GROUPS = EFFECT_FAMILIES.map((family) => ({
  category: family.category,
  effects: CAMERA_EFFECTS.filter((effect) => effect.category === family.category)
}));

const FEATURE_GUIDE_OFFICIAL_BASELINE = "guide-window-official-push";
const FEATURE_GUIDE_MILESTONE_COMMITS = [
  {
    commit: "8fd409a",
    title: "Set red as default studio palette",
    detail: "Red became the default access-popup and app-wide accent palette."
  },
  {
    commit: "c0b5e47",
    title: "Fine tune spatial recognition subtle signal sensitivity",
    detail: "Low-visibility spatial recognition was adjusted to respond to faint frame signals."
  },
  {
    commit: "30a5d0b",
    title: "Sync spatial cell mapping with live frame field",
    detail: "Cell mapping moved from static overlay behavior toward live frame-synced sampling."
  },
  {
    commit: "f061714",
    title: "Add spatial mesh interface opacity toggle",
    detail: "The spatial mesh visual interface gained independent visibility and opacity control."
  },
  {
    commit: "e630b35",
    title: "Refine spatial recognition mesh density",
    detail: "Spatial mesh density was tuned for finer recognition while keeping the live preview readable."
  },
  {
    commit: "157a918",
    title: "Restore repo to f6d723e",
    detail: "The app was reverted to the bookmarked point-cloud/TIN milestone while preserving a safe recovery point."
  },
  {
    commit: "f6d723e",
    title: "Add live point cloud TIN camera mapping",
    detail: "Live point cloud, cell, and TIN mapping became part of the camera effect pipeline."
  }
];
const FEATURE_GUIDE_POST_PUSH_CATALOG = [
  {
    status: "Guide baseline",
    title: "Official feature guide window created",
    detail:
      "This catalog begins at the dedicated guide-window push. Future commits after this guide release should append their user-visible changes here."
  }
];

const EQUATION_DEFAULT_VALUE = "SP3CTR4L-37";
const EQUATION_STYLE_AUTO = "auto";
const EQUATION_TARGETS = [
  ["A", "A - Value pipeline"],
  ["B", "B - Fetch data"],
  ["C", "C - Return data"],
  ["W", "W - Base value"],
  ["X", "X - New input"],
  ["Y", "Y - Output value"],
  ["Z", "Z - Result"]
];
const EQUATION_TARGET_KEYS = new Set(EQUATION_TARGETS.map(([key]) => key));
const EQUATION_THERMAL_PALETTES = [
  "rgb-spectrum",
  "full-range-rgb",
  "inverted-red-rgb",
  "red-lime",
  "orange-green",
  "solar-lime",
  "ember-green",
  "rainbow",
  "predator",
  "ironbow",
  "lava-rainbow",
  "toxic-heat",
  "dark-rainbow",
  "object-heat-isolate",
  "radar-heat",
  "cobalt-hot"
];
const EQUATION_MUTATION_KEYS = [
  "brightness",
  "contrast",
  "exposure",
  "saturation",
  "hue",
  "temperature",
  "tint",
  "glow",
  "thermalBlend",
  "thermalContour",
  "heatEdge",
  "edgeEnhance",
  "clarity",
  "dehaze",
  "vibrance",
  "localContrast",
  "highlightRecovery",
  "shadowDepth",
  "colorSeparation",
  "chromaticGlow",
  "nearIrBoost",
  "ultravioletWash",
  "infraredWash",
  "classicInvert",
  "lumaInvert",
  "channelInvert",
  "spectralInvert",
  "thermalInvert",
  "redInvert",
  "greenInvert",
  "blueInvert",
  "shadowInvert",
  "highlightInvert",
  ...SMART_DARK_EDGE_ADJUSTMENTS.map(([key]) => key),
  ...SPATIAL_RECOGNITION_ADJUSTMENTS.map(([key]) => key),
  ...SMART_SIGNAL_ADJUSTMENTS.map(([key]) => key),
  ...THERMAL_STUDIO_NUMERIC_ADJUSTMENTS.map(([key]) => key)
];
const EQUATION_STYLE_CATEGORY_KEYS = new Map([
  ["Clean Studio", ["ambientLift", "highlightRecovery", "whiteBalance", "skinSmooth"]],
  ["IR Simulations", ["infraredWash", "nearIrBoost", "grayscale", "negativeDepth", "xrayGhost"]],
  ["UVA / Fluorescence", ["ultravioletWash", "uvaFluorescence", "mineralPop", "auraBloom", "chromaticGlow"]],
  ["Cinematic", ["grain", "matte", "halation", "shadowCrush"]],
  ["Cyber Neon", ["glow", "bloom", "chromaticGlow", "colorSeparation", "prismSplit"]],
  ["Black & White", ["grayscale", "contrast", "grain", "threshold", "clarity"]],
  ["Duotone", ["duotone", "splitTone", "tint", "colorHarmony", "colorDodge"]],
  ["TriTone", ["duotone", "splitTone", "colorHarmony", "colorSeparation", "redChannel", "greenChannel", "blueChannel"]],
  ["QuadTone", ["duotone", "splitTone", "posterize", "overlayStrength", "colorHarmony", "colorSeparation"]],
  ["Channel Spectrograph", ["colorSeparation", "chromaticAberration", "prismSplit", "scanlines", "edgeEnhance", "thermalContour"]],
  ["Black", ["blackPoint", "shadowDepth", "shadowCrush", "localContrast", "grayscale", "thermalContour", "heatEdge"]],
  ["Channel Sweep", ["redChannel", "greenChannel", "blueChannel", "redHueShift", "greenHueShift", "blueHueShift", "chromaticAberration", "glitchShift", "colorSeparation"]],
  ["Retro Film", ["sepia", "grain", "dust", "scratches", "matte", "halation"]],
  ["Night Vision", ["nightScope", "nearIrBoost", "glow", "scanlines", "negativeDepth"]],
  ["Color Inversion Matrix", ["classicInvert", "lumaInvert", "channelInvert", "spectralInvert", "thermalInvert", "redInvert", "greenInvert", "blueInvert", "shadowInvert", "highlightInvert", "invert", "colorSeparation"]],
  ["Thermal Looks", ["thermalBlend", "thermalContour", "heatEdge", "edgeEnhance", "localContrast", "darkEdgeThermalBind", "darkEdgeBlackClamp"]],
  ["Thermal Variations", ["thermalBlend", "thermalContour", "heatEdge", "edgeEnhance", "shadowCrush", "localContrast", "darkEdgeAmount", "darkEdgeShadowDepth"]],
  ["XLS Camera", ["thermalBlend", "thermalContour", "heatEdge", "xrayGhost", "nearIrBoost", "ultravioletWash", "infraredWash", "edgeEnhance"]],
  ["Exposure Tools", ["exposure", "highlightRecovery", "ambientLift", "shadowDepth", "localContrast"]],
  ["Color Lab", ["hue", "tint", "vibrance", "colorSeparation", "colorHarmony", "colorizeStrength"]],
  ["Detail, Texture & Noise", ["clarity", "dehaze", "edgeEnhance", "localContrast", "darkEdgeAmount", "darkEdgeDetailAmplify", "darkEdgeContrast"]],
  ["Spatial Recognition Studio", SPATIAL_RECOGNITION_ADJUSTMENTS.map(([key]) => key)],
  ["Thermal Studio", THERMAL_STUDIO_NUMERIC_ADJUSTMENTS.map(([key]) => key)],
  ["Smart Signal Engines", SMART_SIGNAL_ADJUSTMENTS.map(([key]) => key)]
]);
const EQUATION_CORE_STYLE_KEYS = ["brightness", "contrast", "exposure", "saturation", "hue", "temperature", "tint", "glow"];
const EQUATION_THERMAL_RESET_KEYS = ["thermalBlend", "thermalContour", "heatEdge", "thermalInvert"];

function smartSignalControlKey(processorId, suffix) {
  const normalizedId = String(processorId || "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .split(/\s+/)
    .map((part, index) => (index === 0 ? part.toLowerCase() : `${part.charAt(0).toUpperCase()}${part.slice(1)}`))
    .join("");
  return `smart${normalizedId.charAt(0).toUpperCase()}${normalizedId.slice(1)}${suffix}`;
}

function normalizeSmartSignalToggles(value = {}) {
  return Object.fromEntries(SMART_SIGNAL_PROCESSORS.map((processor) => [processor.id, Boolean(value?.[processor.id])]));
}

function featureGuideControlLabel(control) {
  const tuple = Array.isArray(control) ? control : ADJUSTMENT_LOOKUP.get(control);
  if (tuple?.[1]) return tuple[1];
  return String(control || "Control")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function featureGuideSettingLabel(key) {
  return String(key || "Setting")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function featureGuideRangeText(control) {
  const tuple = Array.isArray(control) ? control : ADJUSTMENT_LOOKUP.get(control);
  if (!tuple) return "custom range";
  const [, , min, max, unit = "", initial = 0] = tuple;
  return `${min}${unit} to ${max}${unit}, default ${initial}${unit}`;
}

function featureGuideDominantSettings(settings = {}, limit = 5) {
  return Object.entries(settings)
    .filter(([key, value]) => {
      if (!Number.isFinite(Number(value))) return false;
      return Number(value) !== Number(DEFAULT_SETTINGS[key] ?? 0);
    })
    .sort(([, a], [, b]) => Math.abs(Number(b)) - Math.abs(Number(a)))
    .slice(0, limit)
    .map(([key, value]) => `${featureGuideSettingLabel(key)} ${value}`);
}

function featureGuideCategoryDescriptor(category, effects = []) {
  const categoryLower = category.toLowerCase();
  const countText = `${effects.length} local preset${effects.length === 1 ? "" : "s"}`;
  if (categoryLower.includes("thermal")) {
    return `${category} organizes ${countText} around thermogram-style color banding, isotherm contrast, heat-edge separation, and false-depth spectral mapping. It is intended for users who want strong layered heat palettes that still stack with manual color, inversion, spatial, and capture controls.`;
  }
  if (categoryLower.includes("inversion")) {
    return `${category} contains ${countText} that invert tone, channels, ranges, and thermal response without locking out the rest of the adjustment stack. These presets are designed to start from a negative or spectral reversal and then accept further enhancement from sliders, RGBW mixers, and smart engines.`;
  }
  if (categoryLower.includes("spatial") || categoryLower.includes("xls") || categoryLower.includes("spectrograph")) {
    return `${category} groups ${countText} for technical-looking spectral analysis, channel separation, pseudo-depth, and cell/field interpretation. It is built to expose structure, edges, layers, and signal differences that ordinary photo filters tend to flatten.`;
  }
  if (categoryLower.includes("uva") || categoryLower.includes("ir") || categoryLower.includes("night")) {
    return `${category} provides ${countText} tuned for low-light, fluorescence, infrared-style wash, ultraviolet color energy, and faint-signal visibility. These looks are meant to push subtle camera input into more readable spectral contrast while remaining fully local.`;
  }
  if (categoryLower.includes("tone") || categoryLower.includes("color") || categoryLower.includes("duotone") || categoryLower.includes("tritone") || categoryLower.includes("quadtone")) {
    return `${category} offers ${countText} focused on deliberate color design, tone separation, channel emphasis, and aesthetic palette shaping. It gives the studio a controlled way to move from clean adjustments into highly stylized spectral color systems.`;
  }
  return `${category} includes ${countText} that establish a distinct starting look while leaving the full manual, smart, thermal, overlay, and export pipeline available. Each preset is a local canvas recipe that can be modified, stacked, paused, captured, recorded, and combined with uploaded media.`;
}

function featureGuidePresetDescriptor(effect, index = 0) {
  const dominant = featureGuideDominantSettings(effect.settings, 5);
  const colorText = effect.overlayColor ? `Its overlay signature is ${effect.overlayColor}` : "It uses the current studio accent and canvas blend state";
  const blendText = effect.blendMode || "normal";
  const role = effect.favorite ? "featured shortcut" : "catalog preset";
  return `${effect.name} is a ${role} in ${effect.category} that starts the canvas with ${blendText} blend behavior and a 500% intensity-ready effect recipe. ${colorText}, with strongest named movements in ${dominant.length ? dominant.join(", ") : "the baseline clean render"} so the result remains unique while still accepting every adjustment, smart engine, overlay, and export path.`;
}

function featureGuideAdjustmentDescriptor(control, group) {
  const label = featureGuideControlLabel(control);
  const range = featureGuideRangeText(control);
  const groupTitle = group?.title || "Adjustment";
  const key = Array.isArray(control) ? control[0] : control;
  const keyLower = String(key || "").toLowerCase();
  let role = "modifies the processed canvas with a visible local change";
  if (keyLower.includes("thermal") || keyLower.includes("heat") || keyLower.includes("hotspot")) role = "shapes thermogram bands, isotherm pressure, and hotspot visibility";
  else if (keyLower.includes("invert")) role = "adds stackable negative, channel-reversal, or tonal-range inversion";
  else if (keyLower.includes("spatial") || keyLower.includes("mesh") || keyLower.includes("point") || keyLower.includes("cell")) role = "weights pseudo-depth, live cell mapping, mesh, point-cloud, or field recognition";
  else if (keyLower.includes("red") || keyLower.includes("green") || keyLower.includes("blue") || keyLower.includes("white") || keyLower.includes("hue") || keyLower.includes("color")) role = "controls channel color, palette bias, or chromatic separation";
  else if (keyLower.includes("noise") || keyLower.includes("grain") || keyLower.includes("detail") || keyLower.includes("edge") || keyLower.includes("structure")) role = "targets texture, defects, edges, grain, and fine surface structure";
  else if (keyLower.includes("exposure") || keyLower.includes("shadow") || keyLower.includes("highlight") || keyLower.includes("black") || keyLower.includes("white") || keyLower.includes("tone")) role = "moves exposure, shadow/highlight separation, black floor, white ceiling, or midtone readability";
  return `${label} belongs to ${groupTitle} and ${role}. Its active range is ${range}, and it is designed to remain stackable with presets, generated values, overlay layers, smart engines, snapshots, recordings, and HUD preview.`;
}

function featureGuideSettingDescriptor(key, index = 0) {
  const label = featureGuideSettingLabel(key);
  const range = settingRange(key);
  const keyLower = String(key || "").toLowerCase();
  if (key === "spatialMeshForm") {
    return `${label} is setting key ${index + 1} in the studio state model. It stores the active Spatial Recognition mesh/voxel form, choosing triangular, hexagonal, irregular, variable, or equation-driven drawing against the same synchronized live-cell field used by preview, HUD, snapshots, recordings, and media layers.`;
  }
  let role = "stores a numeric processing value used by the live render pipeline";
  if (STACKED_SETTING_KEYS.has(key)) role = "is part of the stacked advanced engine layer that can combine with the active preset instead of replacing it";
  if (keyLower.includes("thermal") || keyLower.includes("heat") || keyLower.includes("hotspot")) role = "stores thermal, thermogram, isotherm, heat-edge, or hotspot behavior";
  else if (keyLower.includes("smart")) role = "stores a smart-engine weighting value for local signal interpretation";
  else if (keyLower.includes("spatial") || keyLower.includes("mesh") || keyLower.includes("point") || keyLower.includes("cell")) role = "stores spatial recognition, point-cloud, TIN, cell, mesh, or field-map sensitivity";
  else if (keyLower.includes("rgbw") || keyLower.includes("red") || keyLower.includes("green") || keyLower.includes("blue") || keyLower.includes("white")) role = "stores a color-channel or RGBW mixer value that can influence base and overlay color math";
  else if (keyLower.includes("invert")) role = "stores a stackable inversion amount used by the color inversion matrix";
  return `${label} is setting key ${index + 1} in the studio state model. It ${role}; accepted values are clamped from ${range.min} to ${range.max}, which keeps presets, sliders, generated values, media layers, snapshots, and recordings using the same safe render contract.`;
}

function featureGuideSmartEngineDescriptor(processor) {
  const controlNames = processor.controls.slice(0, 4).map((control) => featureGuideControlLabel(control)).join(", ");
  return `Smart ${processor.title} is a toggleable local weighting engine with ${processor.controls.length} sliders. ${processor.description} Its first control surfaces include ${controlNames}, and when enabled it strengthens the active preset without disabling manual sliders, generated-value styles, overlays, thermal recoloring, or export capture.`;
}

function featureGuideControlCount(group) {
  if (group.type === "rgbw") return RGBW_MIXERS.length * RGBW_CHANNELS.length;
  if (group.type === "thermal-studio") return THERMAL_STUDIO_NUMERIC_ADJUSTMENTS.length + THERMAL_STUDIO_BANDS.length;
  if (group.type === "spatial-recognition") return (group.controls?.length || 0) + 1;
  return group.controls?.length || 0;
}

function featureGuideGroupItems(group) {
  if (group.type === "rgbw") {
    return RGBW_MIXERS.map((mixer) => ({
      title: mixer.label,
      meta: "RGBW mixer",
      description: `${mixer.label} exposes Red, Green, Blue, and White channel sliders that feed both overlay color and the base filter math.`,
      details: RGBW_CHANNELS.map((channel) => ({
        title: `${mixer.label} ${channel.label}`,
        text: `${channel.label} channel default ${mixer.defaults[channel.key]}`,
        control: [`${mixer.key}${channel.key.toUpperCase()}`, `${mixer.label} ${channel.label}`, 0, 255, "", mixer.defaults[channel.key]]
      }))
    }));
  }
  if (group.type === "thermal-studio") {
    return [
      ...THERMAL_STUDIO_BANDS.map((band) => ({
        title: `Thermal ${band.letter} ${band.label}`,
        meta: "Thermal Studio RGBWB band",
        description: `Thermal band ${band.letter} targets ${band.label.toLowerCase()} so a specific thermogram, palette, hotspot, or isotherm range can be recolored with a full-spectrum RGBWB dropdown while the master thermal sliders refine width and force.`,
        control: [`thermalBand${band.letter}`, `Thermal ${band.letter} ${band.label}`, 0, 1, "", 0]
      })),
      ...THERMAL_STUDIO_NUMERIC_ADJUSTMENTS.map((control) => ({
        title: featureGuideControlLabel(control),
        meta: "Thermal Studio slider",
        description: "Controls thermal band force, width, or master recolor intensity inside the live canvas pipeline.",
        control
      }))
    ];
  }
  if (group.type === "smart-signal" && group.processor) {
    return group.processor.controls.map((control) => ({
      title: featureGuideControlLabel(control),
      meta: `Smart ${group.processor.title}`,
      description: group.processor.description,
      control
    }));
  }
  if (group.type === "spatial-recognition") {
    return [
      {
        title: "Mesh / voxel form selector",
        meta: group.title,
        description:
          "Selects triangular, hexagonal, irregular, variable, or equation-driven mesh geometry while keeping every point, TIN facet, cell, HUD preview, snapshot, and recording tied to the same live camera field.",
        details: SPATIAL_MESH_FORMS.map((form) => `${form.label}: ${form.description}`)
      },
      ...(group.controls || []).map((control) => ({
        title: featureGuideControlLabel(control),
        meta: group.title,
        description: group.description,
        control
      }))
    ];
  }
  return (group.controls || []).map((control) => ({
    title: featureGuideControlLabel(control),
    meta: group.title,
    description: group.description,
    control
  }));
}

function buildFeatureGuideStats() {
  const adjustmentControlTotal = ADJUSTMENT_GROUPS.reduce((sum, group) => sum + featureGuideControlCount(group), 0);
  const namedControlTotal = new Set([...Object.keys(DEFAULT_SETTINGS), ...EQUATION_MUTATION_KEYS]).size;
  const combinationEstimate =
    CAMERA_EFFECTS.length *
    Math.max(
      1,
      adjustmentControlTotal +
        RGBW_MIXERS.length * RGBW_CHANNELS.length +
        MEDIA_BLEND_MODES.length +
        MEDIA_SPLICE_MODES.length +
        THERMAL_STUDIO_BANDS.length +
        SMART_SIGNAL_PROCESSORS.length +
        SPATIAL_RECOGNITION_ADJUSTMENTS.length +
        SPATIAL_MESH_FORMS.length
    );
  return [
    { label: "Effect presets", value: CAMERA_EFFECTS.length.toLocaleString() },
    { label: "Preset categories", value: EFFECT_PRESET_GROUPS.length.toLocaleString() },
    { label: "Adjustment controls", value: adjustmentControlTotal.toLocaleString() },
    { label: "Named setting keys", value: namedControlTotal.toLocaleString() },
    { label: "Smart engines", value: SMART_SIGNAL_PROCESSORS.length.toLocaleString() },
    { label: "Capability combinations", value: `${Math.max(5000, combinationEstimate).toLocaleString()}+` }
  ];
}

function buildFeatureGuideSections() {
  const featureCategories = EFFECT_PRESET_GROUPS.map((group) => ({
    title: group.category,
    meta: `${group.effects.length} presets`,
    description: featureGuideCategoryDescriptor(group.category, group.effects),
    details: group.effects.map((effect, index) => `${effect.name}: ${featureGuidePresetDescriptor(effect, index)}`)
  }));
  const presetDescriptors = CAMERA_EFFECTS.map((effect, index) => ({
    title: effect.name,
    meta: `${effect.category} / ${effect.blendMode || "normal"}`,
    description: featureGuidePresetDescriptor(effect, index),
    details: [
      `Preset ID: ${effect.id}`,
      `Category: ${effect.category}`,
      `Blend mode: ${effect.blendMode || "normal"}`,
      `Overlay signature: ${effect.overlayColor || "current palette"}`,
      `Favorite shortcut: ${effect.favorite ? "yes" : "no"}`,
      ...featureGuideDominantSettings(effect.settings, 6).map((detail) => `Primary movement: ${detail}`)
    ]
  }));
  const adjustmentGroups = ADJUSTMENT_GROUPS.map((group) => ({
    title: group.title,
    meta: `${featureGuideControlCount(group)} controls`,
    description: `${group.title} is a dropdown control group. ${group.description} It is documented here as part of the full 463-control adjustment surface.`,
    details: featureGuideGroupItems(group).map((item) => `${item.title}: ${item.description}`)
  }));
  const adjustmentControlDescriptors = ADJUSTMENT_GROUPS.flatMap((group) =>
    featureGuideGroupItems(group).flatMap((item) => {
      if (item.details?.length && group.type === "rgbw") {
        return item.details.map((detail) => ({
          title: detail.title,
          meta: group.title,
          description: `${detail.text}. ${featureGuideAdjustmentDescriptor(detail.control, group)}`,
          details: [item.description]
        }));
      }
      return {
        title: item.title,
        meta: item.meta || group.title,
        description: featureGuideAdjustmentDescriptor(item.control || item.title, group),
        details: item.details || []
      };
    })
  );
  const namedSettingKeyDescriptors = [...new Set([...Object.keys(DEFAULT_SETTINGS), ...EQUATION_MUTATION_KEYS])]
    .sort((a, b) => a.localeCompare(b))
    .map((key, index) => ({
      title: featureGuideSettingLabel(key),
      meta: key,
      description: featureGuideSettingDescriptor(key, index),
      details: [
        `State key: ${key}`,
        `Range: ${settingRange(key).min} to ${settingRange(key).max}`,
        `Default: ${DEFAULT_SETTINGS[key] ?? 0}`,
        STACKED_SETTING_KEYS.has(key) ? "Stacked advanced key: yes" : "Stacked advanced key: no"
      ]
    }));
  const smartEngines = SMART_SIGNAL_PROCESSORS.map((processor) => ({
    title: `Smart ${processor.title}`,
    meta: `${processor.controls.length} sliders`,
    description: featureGuideSmartEngineDescriptor(processor),
    details: processor.controls.map((control) => `${featureGuideControlLabel(control)}: ${featureGuideRangeText(control)}`)
  }));
  return [
    {
      id: "overview",
      title: "System Overview",
      summary:
        "The studio is a local-first spectral imaging, camera, media-compositor, guide, capture, and analysis console. It documents every named capability plus the 5000+ combinable preset, slider, smart-engine, thermal, media, capture, redirect, and GUI-window pathways.",
      items: [
        {
          title: "Local camera studio",
          meta: "Browser camera API",
          description:
            "Start Camera requests device permission, keeps the feed local, renders effects to a canvas, supports pause/resume, camera flip, snapshot, recording, HUD preview, and capture shelf storage.",
          details: ["Uses the device camera stream locally.", "Does not upload camera frames.", "Exports are generated from the processed canvas."]
        },
        {
          title: "Complete guide window",
          meta: FEATURE_GUIDE_OFFICIAL_BASELINE,
          description:
            "This separate GUI window is the official feature catalog, commit ledger, redirect hub, and future change-catalog baseline for guide-page pushes.",
          details: ["Search filters guide sections.", "Dropdowns group large feature sets.", "Redirect buttons open PRIME, YouTube, database, DWT, and spatial windows."]
        },
        {
          title: "Free sincere experimental studio mission",
          meta: "PRIME examples target",
          description:
            "All of this functionality is designed to provide THE MOST Highest COMPLETELY FREE & SINCERE Experimental studio for capturing premium spectral images such as the ones shown in the PRIME examples Gallery.",
          details: [
            "Use the PRIME Examples redirect button in this guide to open the target-gallery window.",
            "The guide, camera, filters, smart engines, overlay compositor, capture system, and export tools are designed to support experimental spectral-image exploration without paid access.",
            "All processing remains local to the browser surface unless the user opens external redirect windows."
          ]
        }
      ]
    },
    {
      id: "presets",
      title: "All 288 Effect Preset Descriptors",
      summary: `${CAMERA_EFFECTS.length} individual effect presets are documented with unique role, blend, category, overlay, and dominant-setting descriptions. Presets are local canvas recipes, not remote image generation.`,
      items: presetDescriptors
    },
    {
      id: "preset-categories",
      title: "All 20 Preset Category Descriptors",
      summary: `${EFFECT_PRESET_GROUPS.length} preset categories organize the visual system into searchable dropdown groups with clear category intent and preset membership.`,
      items: featureCategories
    },
    {
      id: "adjustments",
      title: "All 463 Adjustment Control Descriptors",
      summary:
        "Every active adjustment control, RGBW mixer channel, thermal A-O control, smart engine slider, spatial control, DWT control, and core photo slider is documented here.",
      items: adjustmentControlDescriptors
    },
    {
      id: "adjustment-groups",
      title: "Adjustment Dropdown Group Descriptors",
      summary:
        "These are the intelligent dropdown groups that host the adjustment controls so scrolling remains manageable while the full control surface remains available.",
      items: adjustmentGroups
    },
    {
      id: "setting-keys",
      title: "All 462 Named Setting Key Descriptors",
      summary:
        "Every named state key used by presets, sliders, generated values, smart engines, thermal bands, RGBW mixers, media layers, snapshots, and recordings is cataloged here.",
      items: namedSettingKeyDescriptors
    },
    {
      id: "smart-engines",
      title: "All 20 Smart Engine Descriptors",
      summary:
        "Every smart engine is documented with its local purpose, slider count, active behavior, and how it stacks with presets rather than replacing them.",
      items: smartEngines
    },
    {
      id: "thermal",
      title: "Thermal Studio And Spectral Heat Controls",
      summary:
        "Thermal Studio exposes A-O band recoloring, RGBWB dropdowns, thermogram/isotherm shaping, full-spectrum palettes, and thermal-style presets that can stack with regular adjustments.",
      items: [
        {
          title: "A-O thermogram bands",
          meta: `${THERMAL_STUDIO_BANDS.length} recolor targets`,
          description:
            "Each band has a designated label, color dropdown, strength, and width so hotspots, isotherms, thermograms, and palette layers can be tuned independently.",
          details: THERMAL_STUDIO_BANDS.map((band) => `${band.letter}: ${band.label}`)
        },
        {
          title: "Thermal palette styles",
          meta: `${EQUATION_THERMAL_PALETTES.length} equation palettes`,
          description: "Equation-generated effects can select thermal palettes ranging from full RGB to inverted red, ironbow, predator, toxic, and radar heat styles.",
          details: EQUATION_THERMAL_PALETTES
        }
      ]
    },
    {
      id: "capture",
      title: "Capture, Recording, Export, And Local Storage",
      summary:
        "The studio exports the processed canvas state, not a raw camera frame. It supports PNG snapshots, MP4 recording, a local 3-item shelf, and desktop folder-save support where browser permission allows it.",
      items: [
        {
          title: "Snapshot export",
          meta: "Processed PNG",
          description:
            "Snapshot captures the same processed render pipeline shown in the preview, then downloads or saves it locally depending on browser support.",
          details: ["Desktop File System Access can use SPECTRAL_X1_IMAGE_SAVES.", "Mobile browsers decide Photos, Files, or Downloads behavior."]
        },
        {
          title: "MP4 recording",
          meta: Object.values(RECORDING_RESOLUTIONS).map((resolution) => resolution.label).join(", "),
          description:
            "Video recording captures the processed canvas with selected effects applied and stops automatically at the 3 minute maximum.",
          details: Object.values(RECORDING_RESOLUTIONS).map((resolution) => `${resolution.label}: ${resolution.width} x ${resolution.height}`)
        },
        {
          title: "Local capture shelf",
          meta: "3 slots",
          description: "The latest three snapshots or recordings stay available in this browser session with preview, download, and remove controls."
        }
      ]
    },
    {
      id: "media",
      title: "Image And Video Overlay Compositor",
      summary:
        "The overlay studio accepts 1-3 local images or videos and applies the same preset and adjustment pipeline with opacity, transforms, blend modes, splice masks, and clean PNG export.",
      items: [
        {
          title: "Layer upload",
          meta: "1-3 local media layers",
          description: "Each uploaded image or video can use its own effect preset, opacity, movement, scale, rotation, blend mode, and splice mode.",
          details: ["No uploaded layer leaves the device.", "Layer playback controls exist for videos.", "Composite export uses the canvas result."]
        },
        {
          title: "Blend modes",
          meta: `${MEDIA_BLEND_MODES.length} modes`,
          description: "Blend modes control how a layer combines with the composite surface.",
          details: MEDIA_BLEND_MODES.map(([value, label]) => `${label}: ${value}`)
        },
        {
          title: "Splice modes",
          meta: `${MEDIA_SPLICE_MODES.length} modes`,
          description: "Splice modes mask or reveal layer regions with CapCut-style compositing behaviors.",
          details: MEDIA_SPLICE_MODES.map(([value, label]) => `${label}: ${value}`)
        }
      ]
    },
    {
      id: "windows",
      title: "Pull-Up GUI Windows And Redirects",
      summary:
        "Separate GUI windows keep the main camera usable while opening specific information, examples, external channels, database embeds, DWT details, and spatial recognition status.",
      items: [
        {
          title: "PRIME examples",
          meta: `${PRIME_SPECTRAL_EXAMPLES.length} examples`,
          description: "Opens the PRIME spectral result gallery with featured examples, descriptions, previews, direct image open, and download controls."
        },
        {
          title: "YouTube channel GUI",
          meta: YOUTUBE_CHANNEL_HANDLE,
          description:
            "Opens the Supernatural World channel window with official embed player fallback, recent upload browser, channel homepage link, and uploads player link.",
          details: YOUTUBE_RECENT_UPLOADS.map((video) => `${video.type}: ${video.title}`)
        },
        {
          title: "Official database GUI",
          meta: SUPERNATURAL_DATABASE_URL,
          description: "Wraps the official Google Sites database address in a popup GUI and includes an external open fallback when iframe embedding is blocked."
        },
        {
          title: "DWT Isolation Studio",
          meta: DWT_ISOLATE_PROFILE.profileId,
          description:
            "Opens the DWT adaptive quantization profile, noise detector descriptions, profile rows, and Smart Isolate controls while preserving the active preset."
        },
        {
          title: "Spatial Recognition Studio",
          meta: `${SPATIAL_RECOGNITION_ADJUSTMENTS.length + 1} controls`,
          description:
            "Opens pseudo-depth, live point-cloud, TIN, triangular/hexagonal/irregular/variable/equation-driven mesh, contour, cell, and field-map recognition details derived from visible frame gradients."
        }
      ]
    },
    {
      id: "security",
      title: "Access, Privacy, Rights, And Local-Only Boundaries",
      summary:
        "This section documents the access gate, camera permission behavior, local-only processing claims, experimental recognition disclaimers, and rights-reserved notices.",
      items: [
        {
          title: "Access popup",
          meta: "Trusted code gate",
          description:
            "The access code unlocks the studio UI before camera permission is requested. The guide can be opened from the access popup without starting the camera."
        },
        {
          title: "Camera privacy",
          meta: "Local device only",
          description:
            "The app uses browser camera permission and processes the stream in local canvas code. It does not perform remote camera viewing or hidden uploads."
        },
        {
          title: "Recognition disclaimer",
          meta: "Experimental local mapping",
          description:
            "Smart/spatial recognition is presented as local edge, tone, field, and grouped-pixel analysis, not identity identification, person matching, or biometric storage."
        },
        {
          title: "Rights reserved watermark",
          meta: "Export notice",
          description:
            "Generated images can include the Seth Knudson / Supernatural World all-rights-reserved notice in a small visible corner watermark."
        }
      ]
    },
    {
      id: "commits",
      title: "Official Commit And Post-Guide Change Catalog",
      summary:
        "This catalog records the current guide baseline, recent milestone commits feeding the guide, and the place where future changes after the official guide push should be appended.",
      items: [
        ...FEATURE_GUIDE_POST_PUSH_CATALOG.map((entry) => ({
          title: entry.title,
          meta: entry.status,
          description: entry.detail
        })),
        ...FEATURE_GUIDE_MILESTONE_COMMITS.map((entry) => ({
          title: entry.title,
          meta: entry.commit,
          description: entry.detail
        }))
      ]
    }
  ];
}

function filterFeatureGuideSections(sections, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return sections;
  return sections
    .map((section) => {
      const sectionText = `${section.title} ${section.summary}`.toLowerCase();
      const matchingItems = section.items.filter((item) =>
        `${item.title} ${item.meta || ""} ${item.description || ""} ${(item.details || []).join(" ")}`.toLowerCase().includes(normalizedQuery)
      );
      if (sectionText.includes(normalizedQuery)) return section;
      if (!matchingItems.length) return null;
      return { ...section, items: matchingItems };
    })
    .filter(Boolean);
}

function createEquationModel(value, baseEffect = CAMERA_EFFECTS[0], baseSettings = DEFAULT_SETTINGS, runId = 0, targetKey = "X", styleEffect = baseEffect) {
  const X = String(value || "").trim() || EQUATION_DEFAULT_VALUE;
  const runSeed = Number.isFinite(Number(runId)) ? Number(runId) : 0;
  const target = EQUATION_TARGET_KEYS.has(targetKey) ? targetKey : "X";
  const selectedStyle = styleEffect || baseEffect || CAMERA_EFFECTS[0];
  const styleSettings = { ...DEFAULT_SETTINGS, ...(selectedStyle.settings || {}) };
  const isThermalStyle =
    Boolean(styleSettings.thermalPalette) ||
    selectedStyle.category?.includes("Thermal") ||
    selectedStyle.category === "XLS Camera";
  const seed = seededHash(`${target}:${X}|${baseEffect.id || "effect"}|style:${selectedStyle.id || "auto"}|run:${runSeed}|spectral-equation`);
  const rand = seededRandom(seed);
  const palette =
    styleSettings.thermalPalette ||
    (isThermalStyle ? EQUATION_THERMAL_PALETTES[Math.floor(rand() * EQUATION_THERMAL_PALETTES.length)] || "classic" : "");
  const blendMode = selectedStyle.blendMode || MEDIA_BLEND_MODES[Math.floor(rand() * MEDIA_BLEND_MODES.length)]?.[0] || "screen";
  const primary = [randomInt(rand, 38, 255), randomInt(rand, 42, 255), randomInt(rand, 46, 255)];
  const secondary = [randomInt(rand, 0, 255), randomInt(rand, 0, 255), randomInt(rand, 0, 255)];
  const targetSettings = createEquationStyleSettings(rand, selectedStyle, styleSettings, isThermalStyle, palette);
  RGBW_MIXERS.forEach((group, groupIndex) => {
    RGBW_CHANNELS.forEach((channel, channelIndex) => {
      const key = `${group.key}${channel.key}`;
      const baseChannel = groupIndex === 0 ? primary[channelIndex] : secondary[(channelIndex + groupIndex) % 3] || randomInt(rand, 20, 255);
      targetSettings[key] = channel.key === "W" ? randomInt(rand, 12, 148) : clamp(baseChannel + randomInt(rand, -36, 36), 0, 255);
    });
  });

  const W = Math.abs(seed >>> 0);
  const outputNumber = Math.round(
    (W % 100000) * 0.37 +
      setting(baseSettings, "contrast", 100) * 11 +
      setting(styleSettings, "saturation", 100) * 7 +
      setting(targetSettings, "glow") * 19 +
      setting(targetSettings, isThermalStyle ? "thermalContour" : "colorSeparation") * 23
  );
  const effectName = `Equation Z-${String(outputNumber).slice(-5)}`;
  const overlayColor = `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, 0.36)`;
  const rows = {
    A: `pipeline:${X} run:${runSeed}`,
    B: `hash:${W.toString(16).toUpperCase()} style:${selectedStyle.name}`,
    C: `${EQUATION_MUTATION_KEYS.length} controls + RGBW matrix`,
    W: String(W),
    X,
    Y: String(outputNumber),
    Z: `${effectName} / ${selectedStyle.name}`
  };
  if (target !== "X") {
    rows[target] =
      target === "A"
        ? `target-pipeline:${X} run:${runSeed}`
        : target === "B"
          ? `target-fetch:${X}`
          : target === "C"
            ? `target-return:${X}`
            : target === "W"
              ? `target-base:${X}`
              : target === "Y"
                ? `target-output:${X}`
                : `target-result:${X}`;
  }
  const generationCopy = createEquationGenerationCopy({
    seed,
    effectName,
    selectedStyle,
    palette,
    target,
    inputValue: X,
    outputNumber,
    blendMode,
    targetSettings,
    isThermalStyle
  });
  return {
    ...rows,
    targetKey: target,
    styleEffectId: selectedStyle.id,
    styleEffectName: selectedStyle.name,
    styleCategory: selectedStyle.category,
    basePresetSettings: styleSettings,
    settings: targetSettings,
    effect: {
      id: "equation-generated-filter",
      name: generationCopy.name,
      category: `Algorithmic Equation / ${selectedStyle.category}`,
      overlayColor: selectedStyle.overlayColor || overlayColor,
      blendMode,
      enabled: true,
      favorite: false,
      highIntensity: true,
      intensityMultiplier: PRESET_INTENSITY_MULTIPLIER,
      description: generationCopy.description,
      settings: { ...DEFAULT_SETTINGS, ...styleSettings, ...targetSettings }
    },
    generationName: generationCopy.name,
    generationDescription: generationCopy.description,
    summary: generationCopy.pipelineSummary
  };
}

function createEquationGenerationCopy({ seed, effectName, selectedStyle, palette, target, inputValue, outputNumber, blendMode, targetSettings, isThermalStyle }) {
  const rand = seededRandom((seed ^ 0x9e3779b9) >>> 0);
  const paletteLabel = palette ? titleCaseToken(palette) : "Adaptive Color";
  const category = selectedStyle.category || "Studio";
  const styleName = selectedStyle.name || "Custom Stack";
  const nameSuffix = pickFrom(rand, [
    "Spectral Pass",
    "Depth Render",
    "Signal Bloom",
    "Field Map",
    "Color Study",
    "Luma Scan",
    "Prism Stack",
    "Image State"
  ]);
  const generationName = `${effectName} · ${styleName} ${nameSuffix}`;
  const intensity = describeIntensity(
    Number(targetSettings.thermalBlend || targetSettings.glow || targetSettings.colorSeparation || targetSettings.contrast || 0),
    isThermalStyle ? 72 : 35,
    isThermalStyle ? 92 : 70
  );
  const contrast = describeIntensity(Number(targetSettings.contrast ?? 100), 92, 162);
  const texture = describeTexture(targetSettings);
  const colorBehavior = describeEquationColorBehavior(targetSettings, paletteLabel, isThermalStyle);
  const spatialBehavior = pickFrom(rand, [
    "edge transitions stay readable while brighter regions receive the strongest treatment",
    "midtones are lifted enough to keep structure visible without flattening the frame",
    "the output prioritizes separation between shadow mass, mid-field texture, and highlight bloom",
    "local contrast and RGBW mixing are balanced so the result keeps layered depth"
  ]);

  return {
    name: generationName,
    description: `${generationName} is a ${intensity} ${category.toLowerCase()} generation built from ${target}=${inputValue} with ${blendMode} blend routing. It uses ${colorBehavior}, with ${contrast} contrast and ${texture} texture shaping. The result is designed so ${spatialBehavior}.`,
    pipelineSummary: `${target} target returns ${generationName} from ${inputValue}; Y=${outputNumber} with ${paletteLabel} color routing and the current slider stack.`
  };
}

function pickFrom(rand, values) {
  return values[Math.floor(rand() * values.length)] || values[0];
}

function titleCaseToken(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function describeIntensity(value, mediumAt, highAt) {
  if (value >= highAt) return "high-energy";
  if (value >= mediumAt) return "balanced";
  return "subtle";
}

function describeTexture(settings = {}) {
  const grain = Number(settings.grain || 0) + Number(settings.noise || 0) + Number(settings.dust || 0) + Number(settings.scratches || 0);
  const edge = Number(settings.thermalContour || 0) + Number(settings.heatEdge || 0) + Number(settings.edgeEnhance || 0) + Number(settings.clarity || 0);
  const glow = Number(settings.glow || 0) + Number(settings.bloom || 0) + Number(settings.halation || 0) + Number(settings.chromaticGlow || 0);
  if (grain > 95) return "dense grain/noise";
  if (edge > 140) return "strong contour";
  if (glow > 90) return "glow-heavy";
  if (Number(settings.blur || 0) > 18 || Number(settings.softFocus || 0) > 20) return "soft optical";
  return "clean tonal";
}

function describeEquationColorBehavior(settings = {}, paletteLabel, isThermalStyle) {
  if (isThermalStyle) return `${paletteLabel} thermal mapping`;
  if (
    INVERSION_ADJUSTMENTS.some(([key]) => Number(settings[key] || 0)) ||
    Number(settings.invert || 0)
  ) {
    return "stacked inversion color mapping";
  }
  if (Number(settings.duotone || 0) || Number(settings.splitTone || 0)) return "duotone split-color mapping";
  if (Number(settings.ultravioletWash || 0) || Number(settings.infraredWash || 0) || Number(settings.nearIrBoost || 0)) return "IR/UVA spectral color routing";
  if (Number(settings.colorSeparation || 0) || Number(settings.chromaticGlow || 0)) return "chromatic separation";
  return "adaptive RGBW color mixing";
}

function createEquationStyleSettings(rand, selectedStyle, styleSettings, isThermalStyle, palette) {
  const targetSettings = {};
  const styleKeys = new Set([
    ...EQUATION_CORE_STYLE_KEYS,
    ...(EQUATION_STYLE_CATEGORY_KEYS.get(selectedStyle.category) || [])
  ]);
  Object.entries(styleSettings).forEach(([key, value]) => {
    if (typeof value === "number" && value !== (DEFAULT_SETTINGS[key] ?? 0)) styleKeys.add(key);
  });

  styleKeys.forEach((key) => {
    if (key === "thermalPalette") return;
    targetSettings[key] = equationStyleJitter(key, styleSettings, rand);
  });

  if (isThermalStyle) {
    targetSettings.thermalPalette = palette;
    targetSettings.thermalBlend = equationStyleJitter("thermalBlend", { ...styleSettings, thermalBlend: styleSettings.thermalBlend || 86 }, rand, 0.12, 72, 100);
    targetSettings.thermalContour = equationStyleJitter("thermalContour", { ...styleSettings, thermalContour: styleSettings.thermalContour || 68 }, rand, 0.16, 46, 100);
    targetSettings.heatEdge = equationStyleJitter("heatEdge", { ...styleSettings, heatEdge: styleSettings.heatEdge || 58 }, rand, 0.18, 36, 100);
  } else {
    targetSettings.thermalPalette = "";
    EQUATION_THERMAL_RESET_KEYS.forEach((key) => {
      targetSettings[key] = 0;
    });
  }

  return targetSettings;
}

function equationStyleJitter(key, sourceSettings, rand, spreadRatio = 0.11, minOverride, maxOverride) {
  const range = settingRange(key);
  const min = Number.isFinite(minOverride) ? Math.max(range.min, minOverride) : range.min;
  const max = Number.isFinite(maxOverride) ? Math.min(range.max, maxOverride) : range.max;
  const base = Number(sourceSettings[key] ?? DEFAULT_SETTINGS[key] ?? 0);
  const spread = Math.max(1, Math.round((max - min) * spreadRatio));
  return Math.round(clamp(base + randomInt(rand, -spread, spread), min, max));
}

function applyEquationSettings(baseSettings = DEFAULT_SETTINGS, equationModel) {
  if (!equationModel?.settings) return baseSettings;
  const next = { ...DEFAULT_SETTINGS, ...baseSettings, ...(equationModel.basePresetSettings || {}) };
  if (equationModel.settings.thermalPalette) next.thermalPalette = equationModel.settings.thermalPalette;
  else delete next.thermalPalette;
  Object.entries(equationModel.settings).forEach(([key, target]) => {
    if (key === "thermalPalette") return;
    if (!Number.isFinite(Number(target))) return;
    const base = Number(baseSettings[key] ?? DEFAULT_SETTINGS[key] ?? 0);
    const range = settingRange(key);
    const source = Number(next[key] ?? base);
    const blend = STACKED_SETTING_KEYS.has(key) ? 0.72 : EQUATION_THERMAL_RESET_KEYS.includes(key) ? 0.94 : 0.68;
    next[key] = Math.round(clamp(source * (1 - blend) + Number(target) * blend, range.min, range.max));
  });
  return next;
}

function settingRange(key) {
  if (key === "spatialMeshForm") return { min: "triangular", max: "equation-driven" };
  const control = ADJUSTMENT_LOOKUP.get(key);
  if (control) return { min: Number(control[2]), max: Number(control[3]) };
  if (RGBW_MIXERS.some((group) => RGBW_CHANNELS.some((channel) => `${group.key}${channel.key}` === key))) {
    return { min: 0, max: 255 };
  }
  return { min: 0, max: 100 };
}

function isNumericSettingKey(key) {
  return ADJUSTMENT_LOOKUP.has(key) || RGBW_MIXERS.some((group) => RGBW_CHANNELS.some((channel) => `${group.key}${channel.key}` === key));
}

function thermalStudioColorPreview(colorId, target = 0.5) {
  const option = THERMAL_STUDIO_COLOR_LOOKUP.get(colorId) || THERMAL_STUDIO_COLOR_LOOKUP.get("thermal-rgb");
  const color = option?.palette ? thermalPaletteColor(target, option.palette) : option?.color || [255, 255, 255];
  return `rgb(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])})`;
}

function seededHash(value) {
  let hash = 2166136261;
  const text = String(value || "");
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let mixed = value;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(rand, min, max) {
  return Math.round(min + rand() * (max - min));
}

function CameraStudio() {
  const videoRef = useRef(null);
  const hudVideoRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const hudCanvasRef = useRef(null);
  const mediaCanvasRef = useRef(null);
  const mediaFrameRef = useRef(null);
  const mediaUploadInputRef = useRef(null);
  const cameraFrameRef = useRef(null);
  const streamRef = useRef(null);
  const mediaCompositeFrameRef = useRef(0);
  const recorderRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const recordingCanvasRef = useRef(null);
  const recordingFrameRef = useRef(0);
  const previewFrameRef = useRef(0);
  const renderVersionRef = useRef(0);
  const pausedFrameCanvasRef = useRef(null);
  const cameraFeedPausedRef = useRef(false);
  const cameraHudVisibleRef = useRef(false);
  const recordingTimerRef = useRef(null);
  const recordingStartedAtRef = useRef(0);
  const torchHoldModeRef = useRef(false);
  const torchLockModeRef = useRef(false);
  const torchStrobeTimerRef = useRef(0);
  const torchStrobeEnabledRef = useRef(false);
  const torchStrobeOnRef = useRef(false);
  const torchStrobeIntervalMsRef = useRef(TORCH_STROBE_DEFAULT_MS);
  const torchDimmerEnabledRef = useRef(false);
  const torchBrightnessPercentRef = useRef(TORCH_BRIGHTNESS_DEFAULT);
  const captureShelfRef = useRef([]);
  const snapshotSaveDirectoryRef = useRef(null);
  const mediaLayersRef = useRef([]);
  const renderStateRef = useRef({
    filterCss: "",
    selectedEffect: CAMERA_EFFECTS[0],
    manualSettings: CAMERA_EFFECTS[0].settings,
    cameraFacing: "user",
    smartDarkEdgeEnabled: false,
    spatialRecognitionEnabled: false,
    spatialVisualInterfaceEnabled: true,
    smartSignalEnabled: DEFAULT_SMART_SIGNAL_TOGGLES
  });
  const [authorized, setAuthorized] = useState(() => window.sessionStorage.getItem(STUDIO_UNLOCK_KEY) === "true");
  const [accessCode, setAccessCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [cameraStatus, setCameraStatus] = useState("Enter the trusted access code. After unlock, use Start Camera to request browser permission.");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFeedPaused, setCameraFeedPaused] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("user");
  const [recording, setRecording] = useState(false);
  const [recordingResolution, setRecordingResolution] = useState("1080p");
  const [recordingElapsed, setRecordingElapsed] = useState(0);
  const [recordingMimeType, setRecordingMimeType] = useState("");
  const [captureShelf, setCaptureShelf] = useState([]);
  const [torchActive, setTorchActive] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchHoldMode, setTorchHoldMode] = useState(false);
  const [torchLockMode, setTorchLockMode] = useState(false);
  const [torchStrobeEnabled, setTorchStrobeEnabled] = useState(false);
  const [torchStrobeIntervalMs, setTorchStrobeIntervalMs] = useState(TORCH_STROBE_DEFAULT_MS);
  const [torchDimmerEnabled, setTorchDimmerEnabled] = useState(false);
  const [torchBrightnessPercent, setTorchBrightnessPercent] = useState(TORCH_BRIGHTNESS_DEFAULT);
  const [torchLog, setTorchLog] = useState([]);
  const [youtubeWindowOpen, setYoutubeWindowOpen] = useState(false);
  const [databaseWindowOpen, setDatabaseWindowOpen] = useState(false);
  const [primeResultsWindowOpen, setPrimeResultsWindowOpen] = useState(false);
  const [dwtWindowOpen, setDwtWindowOpen] = useState(false);
  const [spatialWindowOpen, setSpatialWindowOpen] = useState(false);
  const [featureGuideWindowOpen, setFeatureGuideWindowOpen] = useState(
    () => new URLSearchParams(window.location.search).get("guide") === "features"
  );
  const [featureGuideSearch, setFeatureGuideSearch] = useState("");
  const [selectedYoutubeVideoId, setSelectedYoutubeVideoId] = useState(YOUTUBE_RECENT_UPLOADS[0]?.id || "");
  const [selectedPrimeResultId, setSelectedPrimeResultId] = useState(FEATURED_PRIME_RESULT_ID);
  const [selectedCategory, setSelectedCategory] = useState("All Presets");
  const [search, setSearch] = useState("");
  const [selectedEffectId, setSelectedEffectId] = useState(CAMERA_EFFECTS[0].id);
  const [manualSettings, setManualSettings] = useState(CAMERA_EFFECTS[0].settings);
  const [liveAdjustmentsEnabled, setLiveAdjustmentsEnabled] = useState(true);
  const [overlayAdjustmentsEnabled, setOverlayAdjustmentsEnabled] = useState(true);
  const [smartDarkEdgeEnabled, setSmartDarkEdgeEnabled] = useState(false);
  const [spatialRecognitionEnabled, setSpatialRecognitionEnabled] = useState(false);
  const [spatialVisualInterfaceEnabled, setSpatialVisualInterfaceEnabled] = useState(true);
  const [smartSignalEnabled, setSmartSignalEnabled] = useState(DEFAULT_SMART_SIGNAL_TOGGLES);
  const [openAdjustmentGroups, setOpenAdjustmentGroups] = useState(() => new Set(ADJUSTMENT_GROUPS.filter((group) => group.open).map((group) => group.id)));
  const [snapshotUrl, setSnapshotUrl] = useState("");
  const [cameraHudVisible, setCameraHudVisible] = useState(false);
  const [mediaLayers, setMediaLayers] = useState([]);
  const [selectedMediaLayerId, setSelectedMediaLayerId] = useState("");
  const [mediaComposerStatus, setMediaComposerStatus] = useState("Upload 1-3 local images or videos to build a separate composited edit.");
  const [mediaSnapshotUrl, setMediaSnapshotUrl] = useState("");
  const [equationValue, setEquationValue] = useState(EQUATION_DEFAULT_VALUE);
  const [equationTargetKey, setEquationTargetKey] = useState("X");
  const [equationStyleEffectId, setEquationStyleEffectId] = useState(EQUATION_STYLE_AUTO);
  const [equationRunId, setEquationRunId] = useState(0);
  const [equationLiveEnabled, setEquationLiveEnabled] = useState(false);
  const [equationMediaEnabled, setEquationMediaEnabled] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const deferredFeatureGuideSearch = useDeferredValue(featureGuideSearch);
  const featureGuideStats = useMemo(() => buildFeatureGuideStats(), []);
  const featureGuideSections = useMemo(() => buildFeatureGuideSections(), []);
  const visibleFeatureGuideSections = useMemo(
    () => filterFeatureGuideSections(featureGuideSections, deferredFeatureGuideSearch),
    [deferredFeatureGuideSearch, featureGuideSections]
  );

  const selectedEffect = useMemo(
    () => CAMERA_EFFECT_LOOKUP.get(selectedEffectId) || CAMERA_EFFECTS[0],
    [selectedEffectId]
  );
  const equationStyleEffect = useMemo(
    () => (equationStyleEffectId === EQUATION_STYLE_AUTO ? selectedEffect : CAMERA_EFFECT_LOOKUP.get(equationStyleEffectId) || selectedEffect),
    [equationStyleEffectId, selectedEffect]
  );
  const selectedSpatialMeshForm =
    SPATIAL_MESH_FORM_LOOKUP.get(manualSettings.spatialMeshForm) || SPATIAL_MESH_FORMS[0];

  const visibleEffects = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    return CAMERA_EFFECTS.filter((effect) => {
      const categoryMatch =
        selectedCategory === "All Presets" ||
        (selectedCategory === "Favorites" && effect.favorite) ||
        effect.category === selectedCategory;
      const queryMatch = !query || `${effect.name} ${effect.category}`.toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });
  }, [deferredSearch, selectedCategory]);

  const youtubePlayerUrl = useMemo(() => {
    if (!selectedYoutubeVideoId) return YOUTUBE_UPLOADS_PLAYER_URL;
    return `https://www.youtube.com/embed/${selectedYoutubeVideoId}?rel=0&modestbranding=1&playsinline=1`;
  }, [selectedYoutubeVideoId]);

  const selectedYoutubeVideo = useMemo(
    () => YOUTUBE_RECENT_UPLOADS.find((video) => video.id === selectedYoutubeVideoId) || YOUTUBE_RECENT_UPLOADS[0],
    [selectedYoutubeVideoId]
  );

  const selectedPrimeResult = useMemo(
    () => PRIME_SPECTRAL_EXAMPLES.find((example) => example.id === selectedPrimeResultId) || PRIME_SPECTRAL_EXAMPLES[0],
    [selectedPrimeResultId]
  );
  const orderedPrimeResults = useMemo(() => {
    const featured = PRIME_SPECTRAL_EXAMPLES.find((example) => example.id === FEATURED_PRIME_RESULT_ID);
    if (!featured) return PRIME_SPECTRAL_EXAMPLES;
    return [featured, ...PRIME_SPECTRAL_EXAMPLES.filter((example) => example.id !== FEATURED_PRIME_RESULT_ID)];
  }, []);

  const equationModel = useMemo(
    () => createEquationModel(equationValue, selectedEffect, manualSettings, equationRunId, equationTargetKey, equationStyleEffect),
    [equationRunId, equationStyleEffect, equationTargetKey, equationValue, manualSettings, selectedEffect]
  );
  const liveAdjustmentBaseSettings = useMemo(
    () => (liveAdjustmentsEnabled ? manualSettings : { ...DEFAULT_SETTINGS, ...(selectedEffect.settings || {}) }),
    [liveAdjustmentsEnabled, manualSettings, selectedEffect]
  );
  const overlayAdjustmentBaseSettings = useMemo(
    () => (overlayAdjustmentsEnabled ? manualSettings : { ...DEFAULT_SETTINGS, ...(selectedEffect.settings || {}) }),
    [manualSettings, overlayAdjustmentsEnabled, selectedEffect]
  );
  const liveManualSettings = useMemo(
    () => (liveAdjustmentsEnabled && equationLiveEnabled ? applyEquationSettings(liveAdjustmentBaseSettings, equationModel) : liveAdjustmentBaseSettings),
    [equationLiveEnabled, equationModel, liveAdjustmentBaseSettings, liveAdjustmentsEnabled]
  );
  const mediaManualSettings = useMemo(
    () => (overlayAdjustmentsEnabled && equationMediaEnabled ? applyEquationSettings(overlayAdjustmentBaseSettings, equationModel) : overlayAdjustmentBaseSettings),
    [equationMediaEnabled, equationModel, overlayAdjustmentBaseSettings, overlayAdjustmentsEnabled]
  );
  const liveSelectedEffect = liveAdjustmentsEnabled && equationLiveEnabled ? equationModel.effect : selectedEffect;
  const mediaSelectedEffect = overlayAdjustmentsEnabled && equationMediaEnabled ? equationModel.effect : selectedEffect;
  const filterCss = useMemo(() => buildFilterCss(liveManualSettings), [liveManualSettings]);
  const mediaFilterCss = useMemo(() => buildFilterCss(mediaManualSettings), [mediaManualSettings]);
  const selectedMediaLayer = useMemo(
    () => mediaLayers.find((layer) => layer.id === selectedMediaLayerId) || mediaLayers[0] || null,
    [mediaLayers, selectedMediaLayerId]
  );

  useEffect(() => {
    renderVersionRef.current += 1;
    renderStateRef.current = {
      filterCss,
      selectedEffect: liveSelectedEffect,
      manualSettings: liveManualSettings,
      cameraFacing,
      smartDarkEdgeEnabled,
      spatialRecognitionEnabled,
      spatialVisualInterfaceEnabled,
      smartSignalEnabled: normalizeSmartSignalToggles(smartSignalEnabled)
    };
  }, [
    cameraFacing,
    filterCss,
    liveManualSettings,
    liveSelectedEffect,
    smartDarkEdgeEnabled,
    smartSignalEnabled,
    spatialRecognitionEnabled,
    spatialVisualInterfaceEnabled
  ]);

  useEffect(() => {
    cameraFeedPausedRef.current = cameraFeedPaused;
  }, [cameraFeedPaused]);

  useEffect(() => {
    mediaLayersRef.current = mediaLayers;
  }, [mediaLayers]);

  useEffect(() => {
    if (!cameraActive) {
      clearCameraOutputCanvas(previewCanvasRef.current);
      clearCameraOutputCanvas(hudCanvasRef.current);
      return undefined;
    }
    let lastDraw = 0;
    let lastPausedVersion = -1;
    const drawPreview = (timestamp) => {
      if (document.visibilityState === "hidden") {
        previewFrameRef.current = window.requestAnimationFrame(drawPreview);
        return;
      }
      const video = videoRef.current;
      const renderState = renderStateRef.current;
      const source = cameraFeedPausedRef.current && pausedFrameCanvasRef.current ? pausedFrameCanvasRef.current : video;
      if (isDrawableMediaSource(source)) {
        const renderVersion = renderVersionRef.current;
        const pausedAndUnchanged = cameraFeedPausedRef.current && renderVersion === lastPausedVersion;
        const frameInterval = cameraHudVisible
          ? CAMERA_HUD_FRAME_INTERVAL_MS
          : cameraFrameInterval(
              renderState.manualSettings,
              renderState.selectedEffect,
              renderState.smartDarkEdgeEnabled,
              renderState.smartSignalEnabled,
              renderState.spatialRecognitionEnabled
            );
        if (!pausedAndUnchanged && (!lastDraw || timestamp - lastDraw > frameInterval)) {
          const cameraLabel = cameraFeedPausedRef.current ? "Paused still frame" : "Local camera stream";
          drawCameraOutputCanvas(previewCanvasRef.current, cameraFrameRef.current, source, renderState, {
            includePreviewChrome: true,
            metaLabels: [cameraLabel, renderState.cameraFacing === "user" ? "Front camera" : "Rear camera", renderState.selectedEffect.name],
            scaleCap: PREVIEW_CANVAS_SCALE_CAP,
            pixelBudget: THERMAL_EFFECT_PIXEL_BUDGET
          });
          if (cameraHudVisible) syncCameraHudFromPreview();
          lastPausedVersion = renderVersion;
          lastDraw = timestamp;
        }
      }
      previewFrameRef.current = window.requestAnimationFrame(drawPreview);
    };
    previewFrameRef.current = window.requestAnimationFrame(drawPreview);
    return () => {
      if (previewFrameRef.current) {
        window.cancelAnimationFrame(previewFrameRef.current);
        previewFrameRef.current = 0;
      }
    };
  }, [cameraActive, cameraHudVisible]);

  useEffect(() => {
    if (!mediaLayers.length) {
      clearCameraOutputCanvas(mediaCanvasRef.current);
      return undefined;
    }
    let lastDraw = 0;
    const hasVideo = mediaLayers.some((layer) => layer.kind === "video");
    const drawComposite = (timestamp) => {
      if (document.visibilityState === "hidden") {
        if (hasVideo) mediaCompositeFrameRef.current = window.requestAnimationFrame(drawComposite);
        return;
      }
      if (!lastDraw || !hasVideo || timestamp - lastDraw > MEDIA_VIDEO_FRAME_INTERVAL_MS) {
        drawUploadedMediaComposite(mediaCanvasRef.current, mediaFrameRef.current, mediaLayers, {
          filterCss: mediaFilterCss,
          selectedEffect: mediaSelectedEffect,
          selectedEffectId,
          manualSettings: mediaManualSettings,
          overlayAdjustmentsEnabled,
          smartDarkEdgeEnabled,
          spatialRecognitionEnabled,
          spatialVisualInterfaceEnabled,
          smartSignalEnabled: normalizeSmartSignalToggles(smartSignalEnabled)
        });
        lastDraw = timestamp;
      }
      if (hasVideo) mediaCompositeFrameRef.current = window.requestAnimationFrame(drawComposite);
    };
    mediaCompositeFrameRef.current = window.requestAnimationFrame(drawComposite);
    return () => {
      if (mediaCompositeFrameRef.current) {
        window.cancelAnimationFrame(mediaCompositeFrameRef.current);
        mediaCompositeFrameRef.current = 0;
      }
    };
  }, [
    mediaFilterCss,
    mediaManualSettings,
    mediaLayers,
    mediaSelectedEffect,
    overlayAdjustmentsEnabled,
    selectedEffectId,
    smartDarkEdgeEnabled,
    smartSignalEnabled,
    spatialRecognitionEnabled,
    spatialVisualInterfaceEnabled
  ]);

  useEffect(() => {
    const frame = cameraFrameRef.current;
    if (!frame) return undefined;
    const syncHudVisibility = () => {
      const rect = frame.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      const visibilityRatio = clamp(visibleHeight / Math.max(rect.height, 1), 0, 1);
      const nextVisible = window.scrollY > 80 && rect.top < 0 && visibilityRatio < 0.28;
      if (cameraHudVisibleRef.current !== nextVisible) {
        cameraHudVisibleRef.current = nextVisible;
        setCameraHudVisible(nextVisible);
      }
    };
    const observer =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(syncHudVisibility, { threshold: [0, 0.2, 0.5, 0.68, 0.85, 1] })
        : null;
    observer?.observe(frame);
    syncHudVisibility();
    window.addEventListener("scroll", syncHudVisibility, { passive: true });
    window.addEventListener("resize", syncHudVisibility);
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", syncHudVisibility);
      window.removeEventListener("resize", syncHudVisibility);
    };
  }, []);

  useEffect(() => {
    const hudVideo = hudVideoRef.current;
    if (!hudVideo) return;
    const stream = cameraActive ? streamRef.current : null;
    if (hudVideo.srcObject !== stream) hudVideo.srcObject = stream;
    if (stream) {
      hudVideo.play().catch(() => {
        // Browsers can briefly reject autoplay while the HUD mounts; the main video remains authoritative.
      });
    }
  }, [cameraActive, cameraHudVisible, cameraFacing]);

  const addTorchLog = useCallback((message, level = "info") => {
    const entry = {
      id: `torch-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      time: new Date().toLocaleTimeString(),
      level,
      message
    };
    setTorchLog((current) => [entry, ...current].slice(0, TORCH_LOG_LIMIT));
  }, []);

  const updateTorchCapability = useCallback((stream) => {
    const videoTrack = stream?.getVideoTracks?.()[0];
    let supported = false;
    try {
      const capabilities = videoTrack?.getCapabilities?.() || {};
      supported = Boolean(capabilities.torch);
    } catch {
      supported = false;
    }
    setTorchSupported(supported);
    setTorchActive(false);
    return supported;
  }, []);

  const applyTorchConstraint = useCallback(
    async (enabled, reason = "manual") => {
      const videoTrack = streamRef.current?.getVideoTracks?.()[0];
      if (!videoTrack?.applyConstraints) {
        setTorchSupported(false);
        setTorchActive(false);
        addTorchLog(`Torch ${enabled ? "on" : "off"} skipped: no active video track for ${reason}.`, "warn");
        return false;
      }
      let supported = false;
      try {
        const capabilities = videoTrack.getCapabilities?.() || {};
        supported = Boolean(capabilities.torch);
      } catch (error) {
        addTorchLog(`Torch capability check failed for ${reason}: ${error.message || error}.`, "error");
      }
      if (!supported) {
        setTorchSupported(false);
        setTorchActive(false);
        addTorchLog(`Torch unsupported on this stream for ${reason}.`, "warn");
        return false;
      }
      try {
        await videoTrack.applyConstraints({ advanced: [{ torch: enabled }] });
        setTorchSupported(true);
        setTorchActive(enabled);
        addTorchLog(`Torch ${enabled ? "enabled" : "disabled"} (${reason}).`, enabled ? "success" : "info");
        return true;
      } catch (error) {
        setTorchActive(false);
        addTorchLog(`Torch ${enabled ? "enable" : "disable"} failed for ${reason}: ${error.message || error}.`, "error");
        return false;
      }
    },
    [addTorchLog]
  );

  const attachCameraStream = useCallback(async (stream, nextFacing = cameraFacing) => {
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
    if (hudVideoRef.current) {
      hudVideoRef.current.srcObject = stream;
      await Promise.resolve(hudVideoRef.current.play()).catch(() => undefined);
    }
    setCameraFacing(nextFacing);
    setCameraActive(true);
    const torchReady = updateTorchCapability(stream);
    if (nextFacing === "environment" && torchReady && (torchHoldModeRef.current || torchLockModeRef.current)) {
      window.setTimeout(() => {
        applyTorchConstraint(true, torchLockModeRef.current ? "lock mode reapply" : "hold mode reapply");
      }, 80);
    }
    if (nextFacing === "environment" && torchReady) {
      setCameraStatus("Rear camera active. Flashlight control is available and stays local to this device.");
    } else {
      setCameraStatus("Camera active. The video is local to this device and is not uploaded.");
    }
  }, [applyTorchConstraint, cameraFacing, updateTorchCapability]);

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
    if (torchStrobeTimerRef.current) {
      window.clearTimeout(torchStrobeTimerRef.current);
      torchStrobeTimerRef.current = 0;
    }
    torchStrobeEnabledRef.current = false;
    torchStrobeOnRef.current = false;
    torchDimmerEnabledRef.current = false;
    torchHoldModeRef.current = false;
    torchLockModeRef.current = false;
    setTorchStrobeEnabled(false);
    setTorchDimmerEnabled(false);
    setTorchHoldMode(false);
    setTorchLockMode(false);
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks?.()[0];
      if (videoTrack?.applyConstraints) {
        videoTrack.applyConstraints({ advanced: [{ torch: false }] }).catch(() => undefined);
      }
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    if (hudVideoRef.current) hudVideoRef.current.srcObject = null;
    pausedFrameCanvasRef.current = null;
    cameraFeedPausedRef.current = false;
    setCameraFeedPaused(false);
    setCameraActive(false);
    setTorchActive(false);
    setTorchSupported(false);
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

  function currentCameraRenderSource() {
    return cameraFeedPausedRef.current && pausedFrameCanvasRef.current ? pausedFrameCanvasRef.current : videoRef.current;
  }

  function syncCameraHudFromPreview() {
    const previewCanvas = previewCanvasRef.current;
    const hudCanvas = hudCanvasRef.current;
    if (!previewCanvas || !hudCanvas || !previewCanvas.width || !previewCanvas.height) return false;
    if (hudCanvas.width !== previewCanvas.width) hudCanvas.width = previewCanvas.width;
    if (hudCanvas.height !== previewCanvas.height) hudCanvas.height = previewCanvas.height;
    const context = hudCanvas.getContext("2d", { alpha: false });
    if (!context) return false;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(previewCanvas, 0, 0);
    return true;
  }

  function capturePausedCameraFrame(video) {
    if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return null;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  function toggleCameraFeedPause() {
    if (!cameraActive || !videoRef.current) {
      setCameraStatus("Start the camera before pausing the feed.");
      return;
    }
    if (cameraFeedPausedRef.current) {
      pausedFrameCanvasRef.current = null;
      cameraFeedPausedRef.current = false;
      setCameraFeedPaused(false);
      videoRef.current.play().catch(() => undefined);
      const hudPlay = hudVideoRef.current?.play?.();
      if (hudPlay?.catch) hudPlay.catch(() => undefined);
      setCameraStatus("Live camera feed resumed. Current filters remain active.");
      return;
    }
    const frozenFrame = capturePausedCameraFrame(videoRef.current);
    if (!frozenFrame) {
      setCameraStatus("Pause failed because the camera frame is not ready yet.");
      return;
    }
    pausedFrameCanvasRef.current = frozenFrame;
    cameraFeedPausedRef.current = true;
    setCameraFeedPaused(true);
    setCameraStatus("Camera frame paused. Adjust filters, equation mode, or export while viewing the still frame.");
  }

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

  const clearTorchStrobeTimer = useCallback(async (turnTorchOff = true, reason = "strobe stopped") => {
    if (torchStrobeTimerRef.current) {
      window.clearTimeout(torchStrobeTimerRef.current);
      torchStrobeTimerRef.current = 0;
    }
    torchStrobeEnabledRef.current = false;
    torchStrobeOnRef.current = false;
    torchDimmerEnabledRef.current = false;
    setTorchStrobeEnabled(false);
    setTorchDimmerEnabled(false);
    if (turnTorchOff) await applyTorchConstraint(false, reason);
  }, [applyTorchConstraint]);

  const ensureRearTorchStream = useCallback(async (reason = "torch") => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("Flashlight access is not supported in this browser.");
      addTorchLog("Torch request failed: mediaDevices.getUserMedia is unavailable.", "error");
      return null;
    }
    if (streamRef.current && cameraFacing === "environment") return streamRef.current;
    await clearTorchStrobeTimer(true, "rear stream switch");
    stopRecording("Recording stopped because the rear flashlight stream was requested.");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    if (hudVideoRef.current) hudVideoRef.current.srcObject = null;
    pausedFrameCanvasRef.current = null;
    cameraFeedPausedRef.current = false;
    setCameraFeedPaused(false);
    setTorchActive(false);
    setTorchSupported(false);
    setCameraStatus(`Requesting rear camera for ${reason}...`);
    addTorchLog(`Requesting rear camera for ${reason}.`, "info");
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } });
    await attachCameraStream(stream, "environment");
    return stream;
  }, [addTorchLog, attachCameraStream, cameraFacing, clearTorchStrobeTimer, stopRecording]);

  const scheduleTorchDutyCycleLoop = useCallback(
    (activeRef, label) => {
      const pulseOn = async () => {
        if (!activeRef.current) return;
        const cycleMs = clamp(torchStrobeIntervalMsRef.current, TORCH_STROBE_MIN_MS, TORCH_STROBE_MAX_MS);
        const duty = clamp(torchBrightnessPercentRef.current / 100, TORCH_BRIGHTNESS_MIN / 100, 0.96);
        const onMs = Math.max(24, Math.round(cycleMs * duty));
        const offMs = Math.max(24, cycleMs - onMs);
        torchStrobeOnRef.current = true;
        await applyTorchConstraint(true, `${label} pulse on`);
        if (!activeRef.current) return;
        torchStrobeTimerRef.current = window.setTimeout(async () => {
          if (!activeRef.current) return;
          torchStrobeOnRef.current = false;
          await applyTorchConstraint(false, `${label} pulse off`);
          if (!activeRef.current) return;
          torchStrobeTimerRef.current = window.setTimeout(pulseOn, offMs);
        }, onMs);
      };
      pulseOn();
    },
    [applyTorchConstraint]
  );

  const startTorchStrobeLoop = useCallback(async () => {
    const stream = await ensureRearTorchStream("strobe mode");
    if (!stream) return;
    const firstOn = await applyTorchConstraint(true, "strobe start");
    if (!firstOn) {
      setCameraStatus("Strobe could not start because this rear-camera stream does not expose torch control.");
      return;
    }
    torchStrobeEnabledRef.current = true;
    torchStrobeOnRef.current = true;
    setTorchStrobeEnabled(true);
    setTorchDimmerEnabled(false);
    setTorchHoldMode(false);
    setTorchLockMode(false);
    torchDimmerEnabledRef.current = false;
    torchHoldModeRef.current = false;
    torchLockModeRef.current = false;
    setCameraStatus(
      `Torch strobe running every ${torchStrobeIntervalMsRef.current}ms at ${torchBrightnessPercentRef.current}% duty brightness. Use Stop Strobe to end it.`
    );
    addTorchLog(
      `Torch strobe duty loop started at ${torchStrobeIntervalMsRef.current}ms / ${torchBrightnessPercentRef.current}% brightness duty.`,
      "success"
    );
    scheduleTorchDutyCycleLoop(torchStrobeEnabledRef, "strobe");
  }, [addTorchLog, applyTorchConstraint, ensureRearTorchStream, scheduleTorchDutyCycleLoop]);

  const startTorchDimmerLoop = useCallback(async () => {
    const stream = await ensureRearTorchStream("dimmer pulse mode");
    if (!stream) return;
    const firstOn = await applyTorchConstraint(true, "dimmer pulse start");
    if (!firstOn) {
      setCameraStatus("Dimmer pulse could not start because this rear-camera stream does not expose torch control.");
      return;
    }
    torchDimmerEnabledRef.current = true;
    torchStrobeEnabledRef.current = false;
    torchStrobeOnRef.current = true;
    setTorchDimmerEnabled(true);
    setTorchStrobeEnabled(false);
    setTorchHoldMode(false);
    setTorchLockMode(false);
    torchHoldModeRef.current = false;
    torchLockModeRef.current = false;
    setCameraStatus(
      `Torch dimmer pulse is running at ${torchBrightnessPercentRef.current}% duty brightness using the ${torchStrobeIntervalMsRef.current}ms interval.`
    );
    addTorchLog(
      `Torch dimmer pulse started from the strobe engine at ${torchBrightnessPercentRef.current}% brightness duty.`,
      "success"
    );
    scheduleTorchDutyCycleLoop(torchDimmerEnabledRef, "dimmer");
  }, [addTorchLog, applyTorchConstraint, ensureRearTorchStream, scheduleTorchDutyCycleLoop]);

  const toggleTorchHold = useCallback(async () => {
    if (torchHoldModeRef.current) {
      torchHoldModeRef.current = false;
      setTorchHoldMode(false);
      await clearTorchStrobeTimer(true, "hold mode off");
      setCameraStatus("Hold Torch is off.");
      return;
    }
    await clearTorchStrobeTimer(true, "switching to hold mode");
    const stream = await ensureRearTorchStream("Hold Torch");
    if (!stream) return;
    const ok = await applyTorchConstraint(true, "Hold Torch");
    if (!ok) {
      setCameraStatus("Hold Torch could not stay on because this device/browser does not expose persistent torch control.");
      return;
    }
    torchHoldModeRef.current = true;
    torchLockModeRef.current = false;
    setTorchHoldMode(true);
    setTorchLockMode(false);
    setCameraStatus("Hold Torch is on. It will stay on until you turn it off, stop the camera, or close the page.");
  }, [applyTorchConstraint, clearTorchStrobeTimer, ensureRearTorchStream]);

  const toggleTorchLock = useCallback(async () => {
    if (torchLockModeRef.current) {
      torchLockModeRef.current = false;
      setTorchLockMode(false);
      await clearTorchStrobeTimer(true, "lock mode off");
      setCameraStatus("Lock Rear Torch is off.");
      return;
    }
    await clearTorchStrobeTimer(true, "switching to lock mode");
    const stream = await ensureRearTorchStream("Lock Rear Torch");
    if (!stream) return;
    const ok = await applyTorchConstraint(true, "Lock Rear Torch");
    if (!ok) {
      setCameraStatus("Lock Rear Torch could not stay on because this device/browser does not expose persistent torch control.");
      return;
    }
    torchHoldModeRef.current = false;
    torchLockModeRef.current = true;
    setTorchHoldMode(false);
    setTorchLockMode(true);
    setCameraStatus("Lock Rear Torch is on. The studio will reapply torch after rear-stream updates when possible.");
  }, [applyTorchConstraint, clearTorchStrobeTimer, ensureRearTorchStream]);

  const toggleTorchStrobe = useCallback(async () => {
    if (torchStrobeEnabledRef.current) {
      await clearTorchStrobeTimer(true, "strobe stopped");
      setCameraStatus("Torch strobe stopped.");
      return;
    }
    await startTorchStrobeLoop();
  }, [clearTorchStrobeTimer, startTorchStrobeLoop]);

  const toggleTorchDimmer = useCallback(async () => {
    if (torchDimmerEnabledRef.current) {
      await clearTorchStrobeTimer(true, "dimmer pulse stopped");
      setCameraStatus("Torch dimmer pulse stopped.");
      return;
    }
    await clearTorchStrobeTimer(true, "switching to dimmer pulse");
    await startTorchDimmerLoop();
  }, [clearTorchStrobeTimer, startTorchDimmerLoop]);

  const toggleTorch = useCallback(async () => {
    try {
      if (torchStrobeEnabledRef.current) await clearTorchStrobeTimer(true, "manual flashlight override");
      if (torchDimmerEnabledRef.current) await clearTorchStrobeTimer(true, "manual flashlight override");
      const stream = await ensureRearTorchStream("manual flashlight");
      if (!stream) return;
      const nextTorch = !torchActive;
      const ok = await applyTorchConstraint(nextTorch, "manual flashlight");
      if (!ok) {
        setCameraStatus("This device/browser does not expose rear-camera flashlight control for this stream.");
        return;
      }
      if (!nextTorch) {
        torchHoldModeRef.current = false;
        torchLockModeRef.current = false;
        setTorchHoldMode(false);
        setTorchLockMode(false);
      }
      setCameraStatus(nextTorch ? "Rear camera flashlight is on. Stream remains local to this device." : "Rear camera flashlight is off.");
    } catch (error) {
      setTorchActive(false);
      addTorchLog(`Flashlight toggle failed: ${error.message || error}.`, "error");
      setCameraStatus(`Flashlight toggle failed: ${error.message || error}`);
    }
  }, [addTorchLog, applyTorchConstraint, clearTorchStrobeTimer, ensureRearTorchStream, torchActive]);

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
    const stream = canvas.captureStream(24);
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

    let lastRecordingDraw = 0;
    const drawFrame = (timestamp = 0) => {
      const source = currentCameraRenderSource();
      const renderState = renderStateRef.current;
      if (!lastRecordingDraw || timestamp - lastRecordingDraw >= RECORDING_FRAME_INTERVAL_MS) {
        if (isDrawableMediaSource(source)) {
          drawStudioFrame(context, resolution.width, resolution.height, source, renderState, {
            forcePixelFilters: false,
            pixelBudget: THERMAL_EFFECT_PIXEL_BUDGET
          });
        }
        lastRecordingDraw = timestamp;
      }
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
      if (previewFrameRef.current) window.cancelAnimationFrame(previewFrameRef.current);
      if (mediaCompositeFrameRef.current) window.cancelAnimationFrame(mediaCompositeFrameRef.current);
      stopRecording("Recording stopped because the studio closed.");
      stopCamera();
      captureShelfRef.current.forEach((item) => URL.revokeObjectURL(item.url));
      mediaLayersRef.current.forEach((layer) => URL.revokeObjectURL(layer.url));
    },
    [stopCamera, stopRecording]
  );

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
    setEquationLiveEnabled(false);
    setManualSettings({
      ...DEFAULT_SETTINGS,
      ...(effect.settings || {}),
      vignette: 0
    });
    setCameraStatus(`${effect.name} preset applied to the live camera feed.`);
  }

  function selectEffectCategory(category) {
    setSelectedCategory(category);
    const nextEffect =
      category === "All Presets"
        ? CAMERA_EFFECTS[0]
        : category === "Favorites"
          ? CAMERA_EFFECTS.find((effect) => effect.favorite)
          : CAMERA_EFFECTS.find((effect) => effect.category === category);
    if (nextEffect) selectEffect(nextEffect);
  }

  function updateSetting(key, value) {
    setManualSettings((current) => ({ ...current, [key]: isNumericSettingKey(key) ? Number(value) : value }));
  }

  function setAdjustmentGroupOpen(groupId, open) {
    setOpenAdjustmentGroups((current) => {
      const next = new Set(current);
      if (open) next.add(groupId);
      else next.delete(groupId);
      return next;
    });
  }

  function setSmartSignalProcessorEnabled(processorId, enabled) {
    setSmartSignalEnabled((current) => ({
      ...normalizeSmartSignalToggles(current),
      [processorId]: Boolean(enabled)
    }));
  }

  function handleStopCamera() {
    stopRecording("Recording stopped because the camera was stopped.");
    stopCamera();
    setCameraStatus("Camera stopped. Press Start Camera to request camera access again.");
  }

  function resetStudio() {
    setSelectedEffectId(CAMERA_EFFECTS[0].id);
    setManualSettings({ ...DEFAULT_SETTINGS, ...CAMERA_EFFECTS[0].settings, vignette: 0 });
    setSnapshotUrl("");
    setEquationTargetKey("X");
    setEquationStyleEffectId(EQUATION_STYLE_AUTO);
    setEquationRunId(0);
    setEquationLiveEnabled(false);
    setEquationMediaEnabled(false);
    setLiveAdjustmentsEnabled(true);
    setOverlayAdjustmentsEnabled(true);
    setSmartDarkEdgeEnabled(false);
    setSpatialRecognitionEnabled(false);
    setSpatialWindowOpen(false);
    setSmartSignalEnabled(DEFAULT_SMART_SIGNAL_TOGGLES);
  }

  function updateEquationStyle(nextStyleId) {
    const styleId = nextStyleId === EQUATION_STYLE_AUTO || CAMERA_EFFECT_LOOKUP.has(nextStyleId) ? nextStyleId : EQUATION_STYLE_AUTO;
    setEquationStyleEffectId(styleId);
    setEquationRunId((current) => current + 1);
    const styleName = styleId === EQUATION_STYLE_AUTO ? `Auto - active preset (${selectedEffect.name})` : CAMERA_EFFECT_LOOKUP.get(styleId)?.name || selectedEffect.name;
    setCameraStatus(`Generated value style set to ${styleName}. Press Generate Value to build from that preset.`);
  }

  function updateEquationTarget(nextTarget) {
    const target = EQUATION_TARGET_KEYS.has(nextTarget) ? nextTarget : "X";
    setEquationTargetKey(target);
    setEquationRunId((current) => current + 1);
    setCameraStatus(`Equation input now targets ${target}. Press Generate Value to create a fresh filter from that slot.`);
  }

  function randomizeEquationValue() {
    const bytes = new Uint32Array(2);
    if (window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      bytes[0] = Date.now();
      bytes[1] = Math.floor(Math.random() * 0xffffffff);
    }
    const nextValue = `A-${bytes[0].toString(36).toUpperCase()}-${bytes[1].toString(36).toUpperCase()}`;
    setEquationValue(nextValue);
    setEquationRunId((current) => current + 1);
    setEquationLiveEnabled(true);
    if (mediaLayersRef.current.length) setEquationMediaEnabled(true);
    setCameraStatus(`Generated and applied a new ${equationTargetKey}-targeted ${equationStyleEffect.name} equation filter to the live feed.`);
  }

  async function handleMediaUpload(event) {
    const files = [...(event.target.files || [])].filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"));
    const selectedFiles = files.slice(0, MEDIA_LAYER_LIMIT);
    event.target.value = "";
    if (!selectedFiles.length) {
      setMediaComposerStatus("Choose image or video files to load into the compositor.");
      return;
    }
    setMediaComposerStatus("Loading local media layers...");
    try {
      const layers = await Promise.all(selectedFiles.map((file, index) => createMediaLayerFromFile(file, index, selectedEffectId)));
      setMediaLayers((current) => {
        current.forEach((layer) => URL.revokeObjectURL(layer.url));
        return layers;
      });
      setSelectedMediaLayerId(layers[0]?.id || "");
      setMediaSnapshotUrl("");
      setMediaComposerStatus(
        `${layers.length} local media layer${layers.length === 1 ? "" : "s"} loaded. ${files.length > MEDIA_LAYER_LIMIT ? "Only the first 3 files were used." : "Use opacity, splice, blend, geometry, and studio effects below."}`
      );
    } catch (error) {
      setMediaComposerStatus(`Media import failed: ${error.message || error}`);
    }
  }

  function updateMediaLayer(layerId, patch) {
    setMediaLayers((current) =>
      current.map((layer) => (layer.id === layerId ? { ...layer, ...patch } : layer))
    );
  }

  function removeMediaLayer(layerId) {
    setMediaLayers((current) => {
      const removed = current.find((layer) => layer.id === layerId);
      if (removed) URL.revokeObjectURL(removed.url);
      const next = current.filter((layer) => layer.id !== layerId);
      setSelectedMediaLayerId((selectedId) => (selectedId === layerId ? next[0]?.id || "" : selectedId));
      setMediaComposerStatus(next.length ? "Layer removed from the local compositor." : "Media compositor cleared.");
      return next;
    });
  }

  function resetMediaLayer(layerId) {
    updateMediaLayer(layerId, {
      opacity: 100,
      blendMode: "source-over",
      spliceMode: "full",
      offsetX: 0,
      offsetY: 0,
      scale: 100,
      rotation: 0,
      effectId: selectedEffectId
    });
    setMediaComposerStatus("Selected media layer reset to full-frame normal blend.");
  }

  function useCurrentStudioEffectForLayer(layerId) {
    updateMediaLayer(layerId, { effectId: selectedEffectId });
    setMediaComposerStatus("Selected media layer now uses the active studio preset with the current slider stack.");
  }

  async function toggleMediaLayerPlayback(layer) {
    if (!layer || layer.kind !== "video") return;
    try {
      if (layer.element.paused) {
        await layer.element.play();
        updateMediaLayer(layer.id, { paused: false });
      } else {
        layer.element.pause();
        updateMediaLayer(layer.id, { paused: true });
      }
    } catch (error) {
      setMediaComposerStatus(`Video playback could not be changed: ${error.message || error}`);
    }
  }

  function restartMediaLayerVideo(layer) {
    if (!layer || layer.kind !== "video") return;
    layer.element.currentTime = 0;
    layer.element.play().catch(() => undefined);
    updateMediaLayer(layer.id, { paused: false });
    setMediaComposerStatus("Video layer restarted.");
  }

  function triggerBrowserDownload(url, filename) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function isLikelyDesktopSaveTarget() {
    const userAgent = navigator.userAgent || "";
    return !/Android|iPhone|iPad|iPod|Mobile|Mobi/i.test(userAgent);
  }

  async function trySaveBlobToSpectralFolder(blob, filename) {
    if (!isLikelyDesktopSaveTarget() || typeof window.showDirectoryPicker !== "function") {
      return { saved: false, reason: "folder-api-unavailable" };
    }
    try {
      let spectralDirectory = snapshotSaveDirectoryRef.current;
      if (!spectralDirectory) {
        const rootDirectory = await window.showDirectoryPicker({
          id: "spectral-x1-image-saves",
          mode: "readwrite",
          startIn: "downloads"
        });
        spectralDirectory = await rootDirectory.getDirectoryHandle(SNAPSHOT_SAVE_FOLDER_NAME, { create: true });
        snapshotSaveDirectoryRef.current = spectralDirectory;
      }
      const fileHandle = await spectralDirectory.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      return { saved: true, reason: "folder-save" };
    } catch (error) {
      return {
        saved: false,
        reason: error?.name === "AbortError" ? "folder-picker-cancelled" : error?.message || String(error)
      };
    }
  }

  async function saveExportBlob(blob, url, filename, statusTarget = "camera") {
    const folderResult = await trySaveBlobToSpectralFolder(blob, filename);
    if (folderResult.saved) {
      return `Saved to the selected Downloads folder inside ${SNAPSHOT_SAVE_FOLDER_NAME}.`;
    }
    triggerBrowserDownload(url, filename);
    if (statusTarget === "camera" && folderResult.reason !== "folder-api-unavailable") {
      addTorchLog(`Desktop folder save fell back to browser download: ${folderResult.reason}.`, "warn");
    }
    return isLikelyDesktopSaveTarget()
      ? `Downloaded through the browser. For a fixed ${SNAPSHOT_SAVE_FOLDER_NAME} folder, allow the folder picker when prompted.`
      : "Snapshot download started on this device. Mobile browsers decide whether it lands in Photos, Files, or Downloads.";
  }

  async function exportMediaCompositeSnapshot() {
    if (!mediaLayers.length) {
      setMediaComposerStatus("Upload at least one image or video before exporting a composite.");
      return;
    }
    const canvas = mediaCanvasRef.current;
    drawUploadedMediaComposite(canvas, mediaFrameRef.current, mediaLayers, {
      filterCss: mediaFilterCss,
      selectedEffect: mediaSelectedEffect,
      selectedEffectId,
      manualSettings: mediaManualSettings,
      overlayAdjustmentsEnabled,
      smartDarkEdgeEnabled,
      spatialRecognitionEnabled,
      spatialVisualInterfaceEnabled,
      smartSignalEnabled: normalizeSmartSignalToggles(smartSignalEnabled)
    });
    if (!canvas?.width || !canvas?.height) {
      setMediaComposerStatus("Composite export failed because the canvas is not ready yet.");
      return;
    }
    try {
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const exportContext = exportCanvas.getContext("2d");
      if (!exportContext) throw new Error("This browser could not create a compositor export canvas.");
      exportContext.drawImage(canvas, 0, 0);
      const blob = await canvasToPngBlob(exportCanvas);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setMediaSnapshotUrl(url);
      addCaptureToShelf({
        id: `media-composite-${Date.now()}`,
        kind: "photo",
        url,
        type: "image/png",
        extension: "png",
        label: "Composite PNG",
        size: blob.size,
        createdAt: new Date().toISOString()
      });
      const filename = `spectral-media-composite-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
      const saveMessage = await saveExportBlob(blob, url, filename, "media");
      setMediaComposerStatus(`Composite PNG exported as clean media only. ${saveMessage}`);
    } catch (error) {
      setMediaComposerStatus(`Composite export failed: ${error.message || error}`);
    }
  }

  function refreshCameraPreviewForSnapshot() {
    const source = currentCameraRenderSource();
    if (!source || !cameraActive || !isDrawableMediaSource(source)) return null;
    const renderState = renderStateRef.current || {
      filterCss,
      selectedEffect: liveSelectedEffect,
      manualSettings: liveManualSettings,
      cameraFacing,
      smartDarkEdgeEnabled,
      spatialRecognitionEnabled,
      spatialVisualInterfaceEnabled,
      smartSignalEnabled: normalizeSmartSignalToggles(smartSignalEnabled)
    };
    const cameraLabel = cameraFeedPausedRef.current ? "Paused still frame" : "Local camera stream";
    const drawn = drawCameraOutputCanvas(previewCanvasRef.current, cameraFrameRef.current, source, renderState, {
      includePreviewChrome: true,
      metaLabels: [
        cameraLabel,
        renderState.cameraFacing === "user" ? "Front camera" : "Rear camera",
        renderState.selectedEffect?.name || liveSelectedEffect.name
      ],
      scaleCap: PREVIEW_CANVAS_SCALE_CAP,
      pixelBudget: THERMAL_EFFECT_PIXEL_BUDGET
    });
    return drawn ? previewCanvasRef.current : null;
  }

  async function captureSnapshot() {
    if (!cameraActive) {
      setCameraStatus("Start the camera before taking a snapshot.");
      return;
    }
    refreshCameraPreviewForSnapshot();
    const source = currentCameraRenderSource();
    if (!source || !isDrawableMediaSource(source)) {
      setCameraStatus("Snapshot failed because no drawable camera frame is ready yet.");
      return;
    }
    const renderState = renderStateRef.current || {
      filterCss,
      selectedEffect: liveSelectedEffect,
      manualSettings: liveManualSettings,
      cameraFacing,
      smartDarkEdgeEnabled,
      spatialRecognitionEnabled,
      spatialVisualInterfaceEnabled,
      smartSignalEnabled: normalizeSmartSignalToggles(smartSignalEnabled)
    };
    const canvas = document.createElement("canvas");
    const drawn = drawCameraOutputCanvas(canvas, cameraFrameRef.current, source, renderState, {
      includePreviewChrome: false,
      scaleCap: PREVIEW_CANVAS_SCALE_CAP,
      pixelBudget: THERMAL_EFFECT_PIXEL_BUDGET
    });
    if (!drawn || !canvas.width || !canvas.height) {
      setCameraStatus("Snapshot failed because the preview canvas is not ready yet.");
      return;
    }
    try {
      const blob = await canvasToPngBlob(canvas);
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
      const filename = `spectral-imaging-studio-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
      const saveMessage = await saveExportBlob(blob, url, filename, "camera");
      setCameraStatus(`Snapshot exported as clean media only, with app chrome and watermark overlays hidden. ${saveMessage}`);
    } catch (error) {
      setCameraStatus(`Snapshot export failed: ${error.message || error}`);
    }
  }

  function scrollToCameraFrame() {
    cameraFrameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function updateTorchStrobeInterval(nextValue) {
    const next = clamp(Number(nextValue), TORCH_STROBE_MIN_MS, TORCH_STROBE_MAX_MS);
    torchStrobeIntervalMsRef.current = next;
    setTorchStrobeIntervalMs(next);
    if (torchStrobeEnabledRef.current || torchDimmerEnabledRef.current) {
      addTorchLog(`Pulse interval updated to ${next}ms. The active loop will use it on the next cycle.`, "info");
    }
  }

  function updateTorchBrightness(nextValue) {
    const next = clamp(Number(nextValue), TORCH_BRIGHTNESS_MIN, TORCH_BRIGHTNESS_MAX);
    torchBrightnessPercentRef.current = next;
    setTorchBrightnessPercent(next);
    if (torchStrobeEnabledRef.current || torchDimmerEnabledRef.current) {
      addTorchLog(`Torch brightness duty updated to ${next}%.`, "info");
      setCameraStatus(`Torch pulse brightness duty updated to ${next}%.`);
    }
  }

  function renderAdjustmentSlider(control, className = "") {
    if (!control) return null;
    const [key, label, min, max, unit] = control;
    const value = manualSettings[key] ?? DEFAULT_SETTINGS[key] ?? 0;
    return (
      <label key={key} className={`studio-adjustment ${className}`.trim()}>
        <span>
          <SlidersHorizontal size={15} />
          {label}
          <output>{value}{unit}</output>
        </span>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(event) => updateSetting(key, event.target.value)}
          style={{ "--value": `${((value - min) / (max - min)) * 100}%` }}
        />
      </label>
    );
  }

  function renderSpatialMeshFormSelector(compact = false) {
    return (
      <label className={`spatial-mesh-form-selector${compact ? " compact" : ""}`}>
        <span>
          <Layers size={15} />
          Mesh / voxel form
        </span>
        <select value={selectedSpatialMeshForm.id} onChange={(event) => updateSetting("spatialMeshForm", event.target.value)}>
          {SPATIAL_MESH_FORMS.map((form) => (
            <option key={form.id} value={form.id}>
              {form.label}
            </option>
          ))}
        </select>
        <p>{selectedSpatialMeshForm.description}</p>
      </label>
    );
  }

  function renderRgbwMixerGroup() {
    return (
      <div className="rgbw-mixer-board" aria-label="RGBW color mixers">
        {RGBW_MIXERS.map((group) => (
          <section className="rgbw-mixer" key={group.key}>
            <div className="rgbw-mixer-header">
              <h3>{group.label}</h3>
              <span style={{ background: rgbwCss(manualSettings, group.key, 1) }} />
            </div>
            {RGBW_CHANNELS.map((channel) => {
              const settingKey = `${group.key}${channel.key}`;
              const value = manualSettings[settingKey] ?? 0;
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
    );
  }

  function renderThermalStudioGroup() {
    const master = manualSettings.thermalStudioMaster ?? DEFAULT_SETTINGS.thermalStudioMaster ?? 0;
    return (
      <div className="thermal-studio-board" aria-label="Thermal Studio hotspot recolor bands">
        {renderAdjustmentSlider(ADJUSTMENT_LOOKUP.get("thermalStudioMaster"), "thermal-studio-master")}
        <div className="thermal-hotspot-grid">
          {THERMAL_STUDIO_BANDS.map((band) => {
            const colorKey = `thermalHotspot${band.letter}Color`;
            const colorId = manualSettings[colorKey] || DEFAULT_SETTINGS[colorKey];
            const color = thermalStudioColorPreview(colorId, band.target);
            return (
              <section className="thermal-hotspot-card" key={band.letter}>
                <div className="thermal-hotspot-heading">
                  <strong>{band.letter}</strong>
                  <span>
                    {band.label}
                    <small>{Math.round(band.target * 100)}% depth</small>
                  </span>
                  <em style={{ background: color }} />
                </div>
                <label className="thermal-color-select">
                  Palette / hotspot color
                  <select
                    value={colorId}
                    onChange={(event) => updateSetting(colorKey, event.target.value)}
                    style={{ "--thermal-hotspot-color": color }}
                  >
                    {THERMAL_STUDIO_COLOR_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                {renderAdjustmentSlider(ADJUSTMENT_LOOKUP.get(`thermalHotspot${band.letter}Strength`), "thermal-hotspot-slider")}
                {renderAdjustmentSlider(ADJUSTMENT_LOOKUP.get(`thermalHotspot${band.letter}Width`), "thermal-hotspot-slider")}
              </section>
            );
          })}
        </div>
        <p className="thermal-studio-note">
          {master
            ? "Active: A-O recolor bands apply to thermal depth/isotherm regions in live camera, HUD, snapshots, recordings, and overlay exports."
            : "Set Thermal Studio Master above 0% and raise any A-O band strength to recolor specific thermogram/hotspot ranges."}
        </p>
      </div>
    );
  }

  function renderEquationEnginePanel() {
    const rows = [
      ["A", "Value pipeline", equationModel.A],
      ["B", "Fetch data", equationModel.B],
      ["C", "Return data", equationModel.C],
      ["W", "Base value", equationModel.W],
      ["X", "New input", equationModel.X],
      ["Y", "Output value", equationModel.Y],
      ["Z", "Result", equationModel.Z]
    ];
    return (
      <section className="equation-engine-panel" aria-labelledby="equationEngineTitle">
        <div className="equation-engine-header">
          <div>
            <h2 id="equationEngineTitle">A→Z Equation Filter Engine</h2>
            <p>Enter any value to generate a repeatable algorithmic filter stack from the active studio controls.</p>
          </div>
          <span>{equationModel.effect.name}</span>
        </div>

        <div className="equation-engine-controls">
          <label className="equation-style-select">
            Generated value style
            <select
              value={equationStyleEffectId}
              onChange={(event) => updateEquationStyle(event.target.value)}
              aria-label="Generated value effect preset style"
            >
              <option value={EQUATION_STYLE_AUTO}>Auto - active preset ({selectedEffect.name})</option>
              {EFFECT_PRESET_GROUPS.map((group) => (
                <optgroup key={group.category} label={group.category}>
                  {group.effects.map((effect) => (
                    <option key={effect.id} value={effect.id}>
                      {effect.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="equation-target-select">
            Target value
            <select
              value={equationTargetKey}
              onChange={(event) => updateEquationTarget(event.target.value)}
              aria-label="Target equation pipeline value"
            >
              {EQUATION_TARGETS.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            {equationTargetKey} input value
            <input
              value={equationValue}
              onChange={(event) => setEquationValue(event.target.value)}
              placeholder={`Enter ${equationTargetKey} target value`}
            />
          </label>
          <button type="button" onClick={randomizeEquationValue}>
            <RefreshCw size={16} />
            Generate Value
          </button>
        </div>

        <div className="equation-toggle-row" aria-label="Equation engine toggles">
          <button
            type="button"
            className={equationLiveEnabled ? "equation-toggle active" : "equation-toggle"}
            aria-pressed={equationLiveEnabled}
            onClick={() => setEquationLiveEnabled((enabled) => !enabled)}
          >
            <Sparkles size={16} />
            Live Camera {equationLiveEnabled ? "On" : "Off"}
          </button>
          <button
            type="button"
            className={equationMediaEnabled ? "equation-toggle active" : "equation-toggle"}
            aria-pressed={equationMediaEnabled}
            onClick={() => setEquationMediaEnabled((enabled) => !enabled)}
          >
            <Layers size={16} />
            1-3 Media Layers {equationMediaEnabled ? "On" : "Off"}
          </button>
        </div>

        <div className="equation-generation-copy" aria-live="polite">
          <strong>{equationModel.generationName}</strong>
          <p>{equationModel.generationDescription}</p>
        </div>

        <div className="equation-pipeline-grid" aria-label="Equation pipeline values">
          {rows.map(([letter, label, value]) => (
            <div className="equation-pipeline-cell" key={letter}>
              <strong>{letter}</strong>
              <span>{label}</span>
              <em>{value}</em>
            </div>
          ))}
        </div>
        <p>{equationModel.summary}</p>
      </section>
    );
  }

  function renderFlashlightStudioPanel() {
    const torchModeLabel = torchStrobeEnabled
      ? `Strobe ${torchStrobeIntervalMs}ms`
      : torchDimmerEnabled
        ? `Dimmer ${torchBrightnessPercent}%`
      : torchHoldMode
        ? "Hold Torch"
        : torchLockMode
          ? "Lock Rear Torch"
          : torchActive
            ? "Manual Torch"
            : "Standby";
    const logRows = torchLog.length
      ? torchLog
      : [
          {
            id: "torch-log-empty",
            time: "Ready",
            level: "info",
            message: "No flashlight debug events yet. Start Hold, Lock, Strobe, or Dimmer Pulse to test this device."
          }
        ];
    return (
      <section className="flashlight-studio-panel" aria-labelledby="flashlightStudioTitle">
        <div className="recording-panel-heading">
          <div>
            <h2 id="flashlightStudioTitle">Flashlight Studio</h2>
            <span>Rear-device torch controls stay local. Availability depends on browser, camera, and phone hardware.</span>
          </div>
          <strong>{torchModeLabel}</strong>
        </div>

        <div className="flashlight-status-grid" aria-label="Flashlight status">
          <span>{cameraFacing === "environment" ? "Rear camera" : "Front camera"}</span>
          <span>{torchSupported ? "Torch supported" : "Torch support unknown"}</span>
          <span>{torchActive ? "Light active" : "Light off"}</span>
          <span>{torchBrightnessPercent}% brightness duty</span>
        </div>

        <div className="flashlight-mode-grid">
          <button
            type="button"
            className={torchHoldMode ? "flashlight-mode-button active" : "flashlight-mode-button"}
            onClick={toggleTorchHold}
            disabled={!authorized}
            aria-pressed={torchHoldMode}
          >
            <Zap size={16} />
            <span>
              <strong>Hold Torch</strong>
              <small>Persistent on/off mode for the current rear stream.</small>
            </span>
          </button>
          <button
            type="button"
            className={torchLockMode ? "flashlight-mode-button active" : "flashlight-mode-button"}
            onClick={toggleTorchLock}
            disabled={!authorized}
            aria-pressed={torchLockMode}
          >
            <LockKeyhole size={16} />
            <span>
              <strong>Lock Rear Torch</strong>
              <small>Requests rear camera and reapplies torch after stream changes.</small>
            </span>
          </button>
          <button
            type="button"
            className={torchStrobeEnabled ? "flashlight-mode-button active strobe" : "flashlight-mode-button strobe"}
            onClick={toggleTorchStrobe}
            disabled={!authorized}
            aria-pressed={torchStrobeEnabled}
          >
            <Sparkles size={16} />
            <span>
              <strong>{torchStrobeEnabled ? "Stop Strobe" : "Start Strobe"}</strong>
              <small>Pulses torch on/off using the interval below.</small>
            </span>
          </button>
          <button
            type="button"
            className={torchDimmerEnabled ? "flashlight-mode-button active dimmer" : "flashlight-mode-button dimmer"}
            onClick={toggleTorchDimmer}
            disabled={!authorized}
            aria-pressed={torchDimmerEnabled}
          >
            <SlidersHorizontal size={16} />
            <span>
              <strong>{torchDimmerEnabled ? "Stop Dimmer" : "Dimmer Pulse"}</strong>
              <small>Uses the strobe engine as a brightness duty-cycle control.</small>
            </span>
          </button>
        </div>

        <label className="flashlight-strobe-slider">
          <span>
            Strobe interval
            <output>{torchStrobeIntervalMs}ms</output>
          </span>
          <input
            type="range"
            min={TORCH_STROBE_MIN_MS}
            max={TORCH_STROBE_MAX_MS}
            step={TORCH_STROBE_STEP_MS}
            value={torchStrobeIntervalMs}
            onChange={(event) => updateTorchStrobeInterval(event.target.value)}
            style={{
              "--value": `${((torchStrobeIntervalMs - TORCH_STROBE_MIN_MS) / (TORCH_STROBE_MAX_MS - TORCH_STROBE_MIN_MS)) * 100}%`
            }}
          />
        </label>

        <label className="flashlight-strobe-slider">
          <span>
            Flashlight brightness / dimming
            <output>{torchBrightnessPercent}%</output>
          </span>
          <input
            type="range"
            min={TORCH_BRIGHTNESS_MIN}
            max={TORCH_BRIGHTNESS_MAX}
            step={TORCH_BRIGHTNESS_STEP}
            value={torchBrightnessPercent}
            onChange={(event) => updateTorchBrightness(event.target.value)}
            style={{
              "--value": `${((torchBrightnessPercent - TORCH_BRIGHTNESS_MIN) / (TORCH_BRIGHTNESS_MAX - TORCH_BRIGHTNESS_MIN)) * 100}%`
            }}
          />
        </label>

        <p className="flashlight-warning">
          Strobe and dimmer pulse modes can be uncomfortable or unsafe for photosensitive viewers. True LED brightness depends on device/browser torch support; this studio uses duty-cycle dimming when direct brightness control is unavailable.
        </p>

        <div className="torch-debug-log" aria-label="Flashlight debug log">
          {logRows.map((entry) => (
            <div className={`torch-log-row ${entry.level}`} key={entry.id}>
              <span>{entry.time}</span>
              <p>{entry.message}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function renderAdjustmentGroup(group) {
    const count =
      group.type === "rgbw"
        ? RGBW_MIXERS.length * RGBW_CHANNELS.length
        : group.controls.length;
    const isOpen = openAdjustmentGroups.has(group.id);
    return (
      <details
        key={group.id}
        className="adjustment-dropdown"
        open={isOpen}
        onToggle={(event) => setAdjustmentGroupOpen(group.id, event.currentTarget.open)}
      >
        <summary>
          <span>
            <strong>{group.title}</strong>
            <small>{group.description}</small>
          </span>
          <em>{count}</em>
        </summary>
        {isOpen &&
          (group.type === "rgbw"
            ? renderRgbwMixerGroup()
            : group.type === "thermal-studio"
              ? renderThermalStudioGroup()
            : group.type === "smart-dark-edge"
              ? renderSmartDarkEdgeGroup(group)
            : group.type === "spatial-recognition"
              ? renderSpatialRecognitionGroup(group)
              : group.type === "smart-signal"
                ? renderSmartSignalGroup(group)
              : (
                <div className="adjustment-list">
                  {group.controls.map((controlKey) =>
                    renderAdjustmentSlider(
                      Array.isArray(controlKey) ? controlKey : ADJUSTMENT_LOOKUP.get(controlKey),
                      group.controlClassName
                    )
                  )}
                </div>
              ))}
      </details>
    );
  }

  function renderSmartSignalGroup(group) {
    const processor = group.processor;
    const enabled = Boolean(smartSignalEnabled[processor.id]);
    const isIsolateEngine = processor.id === "isolateGroupedPixels";
    return (
      <div className={`smart-dark-edge-group smart-signal-group${isIsolateEngine ? " smart-isolate-engine-group" : ""}`}>
        <button
          type="button"
          className={enabled ? "adjustment-scope-toggle active" : "adjustment-scope-toggle"}
          aria-pressed={enabled}
          onClick={() => setSmartSignalProcessorEnabled(processor.id, !enabled)}
        >
          <ShieldCheck size={15} />
          <span>
            <strong>{isIsolateEngine ? "Smart Isolate Grouped Pixels" : `Smart ${processor.title}`}</strong>
            <small>
              {enabled
                ? isIsolateEngine
                  ? "AI-orchestrated local defect/distortion grouping is active across live camera, HUD, snapshots, recordings, and overlay exports."
                  : "Active on live camera, HUD, snapshots, recordings, and overlay exports."
                : isIsolateEngine
                  ? "Off: defect/distortion grouping is bypassed while color, size, weight, and density controls remain ready."
                  : "Off: this smart signal pass is bypassed while slider values remain ready."}
            </small>
          </span>
        </button>
        {isIsolateEngine && (
          <div className="smart-isolate-engine-brief" aria-label="AI-orchestrated isolate grouped pixels description">
            <strong>AI-Orchestrated Defect / Distortion Isolation</strong>
            <p>
              Local scene analysis targets repeated defects, compression blocks, subtle distortions, same-color pixel clusters,
              density patches, and shade/range groups. No remote AI call or biometric identity analysis is used; the engine
              deterministically weighs nearby pixels and pushes similar artifacts to behave together. DWT adaptive quantization
              profile <code>{DWT_ISOLATE_PROFILE.profileId}</code> is layered on top of the current preset without replacing it.
            </p>
            <button type="button" className="dwt-inline-button" onClick={() => setDwtWindowOpen(true)}>
              <Sparkles size={14} />
              Open DWT Isolation Studio
            </button>
          </div>
        )}
        <div className="adjustment-list smart-dark-edge-list">
          {processor.controls.map((control) => renderAdjustmentSlider(control, "smart-dark-edge-adjustment smart-signal-adjustment"))}
        </div>
      </div>
    );
  }

  function renderFeatureGuideWindow() {
    if (!featureGuideWindowOpen) return null;
    const query = deferredFeatureGuideSearch.trim();
    return (
      <div className="feature-guide-window-backdrop" role="dialog" aria-modal="true" aria-labelledby="featureGuideWindowTitle">
        <section className="feature-guide-window">
          <div className="youtube-window-heading">
            <div>
              <SlidersHorizontal size={22} />
              <h2 id="featureGuideWindowTitle">Complete 5000+ Feature Guide</h2>
            </div>
            <button type="button" onClick={() => setFeatureGuideWindowOpen(false)} aria-label="Close feature guide">
              <X size={20} />
            </button>
          </div>

          <p className="feature-guide-lede">
            This guide catalogs every named studio surface in this commit: presets, grouped controls, smart engines, thermal bands,
            capture/export paths, media overlays, redirects, pull-up GUI windows, local privacy boundaries, and the official post-guide
            change ledger. The 5000+ count is the combinable capability matrix, not a claim that the UI contains 5000 separate buttons.
          </p>

          <div className="feature-guide-stat-grid" aria-label="Feature guide summary counts">
            {featureGuideStats.map((stat) => (
              <div className="feature-guide-stat" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>

          <label className="feature-guide-search">
            <Search size={16} />
            <input
              value={featureGuideSearch}
              onChange={(event) => setFeatureGuideSearch(event.target.value)}
              placeholder="Search guide, presets, sliders, windows, commits..."
            />
          </label>

          <div className="feature-guide-action-row" aria-label="Guide redirects">
            <button type="button" onClick={() => { setFeatureGuideWindowOpen(false); setPrimeResultsWindowOpen(true); }}>
              <Sparkles size={15} />
              PRIME Examples
            </button>
            <button type="button" onClick={() => { setFeatureGuideWindowOpen(false); setYoutubeWindowOpen(true); }}>
              <Youtube size={15} />
              YouTube GUI
            </button>
            <button type="button" onClick={() => { setFeatureGuideWindowOpen(false); setDatabaseWindowOpen(true); }}>
              <ExternalLink size={15} />
              Database GUI
            </button>
            <button type="button" onClick={() => { setFeatureGuideWindowOpen(false); setDwtWindowOpen(true); }}>
              <ShieldCheck size={15} />
              DWT Studio
            </button>
            <button type="button" onClick={() => { setFeatureGuideWindowOpen(false); setSpatialWindowOpen(true); }}>
              <Layers size={15} />
              Spatial Studio
            </button>
          </div>

          <div className="feature-guide-section-stack">
            {visibleFeatureGuideSections.length ? (
              visibleFeatureGuideSections.map((section, index) => (
                <details className="feature-guide-section" key={section.id} open={index < 2 || Boolean(query)}>
                  <summary>
                    <span>
                      <strong>{section.title}</strong>
                      <small>{section.summary}</small>
                    </span>
                    <em>{section.items.length} entries</em>
                  </summary>
                  <div className="feature-guide-item-grid">
                    {section.items.map((item) => {
                      const isSincereOverview = section.id === "overview" && item.title === "Free sincere experimental studio mission";
                      return (
                        <details
                          className="feature-guide-item"
                          key={`${section.id}-${item.meta || ""}-${item.title}`}
                          open={Boolean(query) || isSincereOverview}
                        >
                          <summary>
                            <span>{item.meta || section.title}</span>
                            <strong>{item.title}</strong>
                          </summary>
                          <div className="feature-guide-item-body">
                            {item.description && <p>{item.description}</p>}
                            {isSincereOverview && (
                              <button
                                type="button"
                                className="feature-guide-inline-action"
                                onClick={() => {
                                  setFeatureGuideWindowOpen(false);
                                  setPrimeResultsWindowOpen(true);
                                }}
                              >
                                <Sparkles size={15} />
                                Open PRIME Spectral Examples Image Gallery Listing
                              </button>
                            )}
                            {item.details?.length > 0 && (
                              <ul>
                                {item.details.slice(0, 18).map((detail) => (
                                  <li key={detail}>{detail}</li>
                                ))}
                                {item.details.length > 18 && <li>{item.details.length - 18} more entries documented in this group.</li>}
                              </ul>
                            )}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </details>
              ))
            ) : (
              <p className="feature-guide-empty">No guide sections match "{featureGuideSearch}".</p>
            )}
          </div>
        </section>
      </div>
    );
  }

  function renderDwtIsolationWindow() {
    if (!dwtWindowOpen) return null;
    const isolateProcessor = SMART_SIGNAL_PROCESSORS.find((processor) => processor.id === "isolateGroupedPixels");
    const isolateEnabled = Boolean(smartSignalEnabled.isolateGroupedPixels);
    const profileRows = [
      ["Profile", DWT_ISOLATE_PROFILE.profileId],
      ["Wavelet", DWT_ISOLATE_PROFILE.wavelet],
      ["Low frequency weight", DWT_ISOLATE_PROFILE.lowFrequencyWeight],
      ["Luminance noise", DWT_ISOLATE_PROFILE.luminanceNoiseWeight],
      ["Chrominance noise", DWT_ISOLATE_PROFILE.chrominanceNoiseWeight],
      ["Digital noise", DWT_ISOLATE_PROFILE.digitalNoiseWeight],
      ["Quantization floor", DWT_ISOLATE_PROFILE.quantizationFloor],
      ["Quantization ceiling", DWT_ISOLATE_PROFILE.quantizationCeiling],
      ["Defect threshold bias", DWT_ISOLATE_PROFILE.defectThresholdBias],
      ["Density gain", DWT_ISOLATE_PROFILE.densityGain],
      ["Edge gain", DWT_ISOLATE_PROFILE.edgeGain],
      ["Chroma lock gain", DWT_ISOLATE_PROFILE.chromaLockGain],
      ["Artifact suppression", DWT_ISOLATE_PROFILE.artifactSuppressionGain],
      ["Grain gain", DWT_ISOLATE_PROFILE.grainNoiseGain],
      ["Speckle gain", DWT_ISOLATE_PROFILE.speckleNoiseGain],
      ["Banding gain", DWT_ISOLATE_PROFILE.bandingNoiseGain],
      ["Block artifact gain", DWT_ISOLATE_PROFILE.blockArtifactGain],
      ["Hot pixel gain", DWT_ISOLATE_PROFILE.hotPixelGain],
      ["Flicker gain", DWT_ISOLATE_PROFILE.temporalFlickerGain]
    ];
    const detectorRows = [
      ["Fine grain", "Subtle luminance jitter and sensor grain in nearby pixels."],
      ["Speckle / salt", "Tiny isolated bright or dark pixel bursts."],
      ["Banding", "Horizontal/vertical tonal bands and rolling-strip artifacts."],
      ["Block artifacts", "Square compression blocks and grid-like distortion patches."],
      ["Chroma noise", "Color-channel scatter that does not match local luminance."],
      ["Hot pixels", "Small high-value points that spike above the neighborhood."],
      ["Shadow noise", "Low-light shade defects and crawling dark regions."],
      ["Highlight noise", "Overexposed specks and glowing bright defects."],
      ["Edge shimmer", "Unstable edge halos, crawling outlines, and fringe shimmer."],
      ["Temporal flicker", "Frame-like pulse weighting for strobe/noisy-camera feel."]
    ];

    return (
      <div className="dwt-window-backdrop" role="dialog" aria-modal="true" aria-labelledby="dwtWindowTitle">
        <section className="dwt-window">
          <div className="youtube-window-heading">
            <div>
              <Sparkles size={22} />
              <h2 id="dwtWindowTitle">DWT Isolation Studio</h2>
            </div>
            <button type="button" onClick={() => setDwtWindowOpen(false)} aria-label="Close DWT Isolation Studio">
              <X size={20} />
            </button>
          </div>

          <p className="dwt-window-note">
            Imported DWT adaptive quantization controls stay layered on top of the current live preset. Enabling this window's
            Smart Isolate switch preserves <strong>{liveSelectedEffect.name}</strong> and adds a higher-sensitivity local noise
            detection stack for defect, distortion, subband, and quantization analysis.
          </p>

          <div className="dwt-status-grid" aria-label="DWT pipeline status">
            <div>
              <span>Current preset</span>
              <strong>{liveSelectedEffect.name}</strong>
            </div>
            <div>
              <span>Smart Isolate</span>
              <strong>{isolateEnabled ? "Enabled" : "Disabled"}</strong>
            </div>
            <div>
              <span>Pipeline source</span>
              <strong>Local canvas DWT profile</strong>
            </div>
          </div>

          <div className="dwt-action-row">
            <button
              type="button"
              className={isolateEnabled ? "active" : ""}
              onClick={() => setSmartSignalProcessorEnabled("isolateGroupedPixels", !isolateEnabled)}
            >
              <ShieldCheck size={16} />
              {isolateEnabled ? "Disable DWT Isolate" : "Enable DWT Isolate"}
            </button>
            <a href={DWT_ISOLATE_PROFILE.profileAsset} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              Open Profile JSON
            </a>
            <a href={DWT_ISOLATE_PROFILE.profileAsset} download="dwt_isolate_profile.json">
              <Download size={16} />
              Download Profile
            </a>
          </div>

          <div className="dwt-profile-grid" aria-label="DWT profile parameters">
            {profileRows.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="dwt-detector-grid" aria-label="DWT noise detector map">
            {detectorRows.map(([label, value]) => (
              <div key={label}>
                <strong>{label}</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>

          {isolateProcessor && (
            <div className="dwt-control-grid" aria-label="DWT isolate controls">
              {isolateProcessor.controls.map((control) => renderAdjustmentSlider(control, "smart-dark-edge-adjustment smart-signal-adjustment"))}
            </div>
          )}
        </section>
      </div>
    );
  }

  function renderSpatialRecognitionWindow() {
    if (!spatialWindowOpen) return null;
    const profileRows = [
      ["Mode", "Pseudo-depth + live point cloud + TIN facets"],
      ["Mesh form", selectedSpatialMeshForm.label],
      ["Data source", "Current camera/compositor canvas"],
      ["Equation mapping", "X adherence / Y metronymics"],
      ["Prototype source", "SpatialViewport / pointCloudWorker adapted locally"],
      ["Privacy", "No identity matching, no biometric storage, no upload"],
      ["AI-Q hook", "Optional future backend; local canvas active now"]
    ];
    return (
      <div className="dwt-window-backdrop spatial-window-backdrop" role="dialog" aria-modal="true" aria-labelledby="spatialWindowTitle">
        <section className="dwt-window spatial-window">
          <div className="youtube-window-heading">
            <div>
              <Layers size={22} />
              <h2 id="spatialWindowTitle">Spatial Recognition Studio</h2>
            </div>
            <button type="button" onClick={() => setSpatialWindowOpen(false)} aria-label="Close Spatial Recognition Studio">
              <X size={20} />
            </button>
          </div>
          <p className="dwt-window-note">
            Spatial Recognition estimates depth-like field structure from visible luminance, local edge gradients, color separation,
            noise, contour density, and multi-scale subtle reveal sampling for faint low-contrast or low-light features. Its live Point
            Cloud, TIN, mesh, and cell sample modes share one synchronized camera-cell field so surface, noise, and depth geometry follow
            the current frame while preserving the active preset.
          </p>

          <div className="dwt-status-grid spatial-status-grid" aria-label="Spatial recognition status">
            <div>
              <span>Current preset</span>
              <strong>{liveSelectedEffect.name}</strong>
            </div>
            <div>
              <span>Spatial pass</span>
              <strong>{spatialRecognitionEnabled ? "Active" : "Bypassed"}</strong>
            </div>
            <div>
              <span>Point budget</span>
              <strong>{SPATIAL_RECOGNITION_PIXEL_BUDGET.toLocaleString()} px</strong>
            </div>
            <div>
              <span>Visual interface</span>
              <strong>
                {spatialVisualInterfaceEnabled
                  ? `${manualSettings.spatialInterfaceOpacity ?? DEFAULT_SETTINGS.spatialInterfaceOpacity}% opacity`
                  : "Hidden"}
              </strong>
            </div>
          </div>

          <div className="dwt-action-row">
            <button
              type="button"
              className={spatialRecognitionEnabled ? "active" : ""}
              onClick={() => setSpatialRecognitionEnabled((enabled) => !enabled)}
            >
              <ShieldCheck size={16} />
              {spatialRecognitionEnabled ? "Disable Spatial Recognition" : "Enable Spatial Recognition"}
            </button>
            <button
              type="button"
              className={spatialVisualInterfaceEnabled ? "active" : ""}
              aria-pressed={spatialVisualInterfaceEnabled}
              onClick={() => setSpatialVisualInterfaceEnabled((enabled) => !enabled)}
            >
              <Layers size={16} />
              {spatialVisualInterfaceEnabled ? "Hide Mesh Interface" : "Show Mesh Interface"}
            </button>
            <a href={DATACOHERECTICS_SPATIAL_MAPPING_URL} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              Datacoherectics Voxel Search
            </a>
          </div>

          <div className="dwt-profile-grid" aria-label="Spatial recognition profile">
            {profileRows.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          {renderSpatialMeshFormSelector()}

          <div className="dwt-control-grid spatial-control-grid" aria-label="Spatial recognition controls">
            {SPATIAL_RECOGNITION_ADJUSTMENTS.map((control) => renderAdjustmentSlider(control, "smart-dark-edge-adjustment spatial-recognition-adjustment"))}
          </div>
        </section>
      </div>
    );
  }

  function renderSpatialRecognitionGroup(group) {
    return (
      <div className="smart-dark-edge-group spatial-recognition-group">
        <button
          type="button"
          className={spatialRecognitionEnabled ? "adjustment-scope-toggle active" : "adjustment-scope-toggle"}
          aria-pressed={spatialRecognitionEnabled}
          onClick={() => setSpatialRecognitionEnabled((enabled) => !enabled)}
        >
          <Layers size={15} />
          <span>
            <strong>{SPATIAL_RECOGNITION_LABEL}</strong>
            <small>
              {spatialRecognitionEnabled
                ? "Spatial point-cloud, TIN facets, contour, and pseudo-depth mapping is active on preview, HUD, snapshots, recordings, and overlays."
                : "Off: spatial mapping is bypassed while depth, TIN, mesh, contour, and point-cloud controls remain ready."}
            </small>
          </span>
        </button>
        <div className="spatial-interface-toolbar">
          <button
            type="button"
            className={spatialVisualInterfaceEnabled ? "adjustment-scope-toggle active" : "adjustment-scope-toggle"}
            aria-pressed={spatialVisualInterfaceEnabled}
            onClick={() => setSpatialVisualInterfaceEnabled((enabled) => !enabled)}
          >
            <Layers size={15} />
            <span>
              <strong>Visual Mesh Interface</strong>
              <small>
                {spatialVisualInterfaceEnabled
                  ? "Shown: mesh, point-cloud dots, and TIN facets use the Visual Interface Opacity slider."
                  : "Hidden: spatial processing stays active while mesh, point-cloud, and TIN interface layers are suppressed."}
              </small>
            </span>
          </button>
          {renderAdjustmentSlider(
            ADJUSTMENT_LOOKUP.get("spatialInterfaceOpacity"),
            "smart-dark-edge-adjustment spatial-recognition-adjustment spatial-interface-opacity"
          )}
        </div>
        {renderSpatialMeshFormSelector(true)}
        <div className="smart-isolate-engine-brief spatial-recognition-brief" aria-label="Spatial recognition description">
          <strong>Local Spatial Field Mapping</strong>
          <p>
            Adapted from the imported SpatialViewport/pointCloudWorker prototype without adding Three.js dependencies. The camera canvas
            decimates frame pixels into one synchronized live-cell field used by point-cloud samples, TIN triangle facets, mesh lines,
            and cell nodes so desktop, mobile, HUD, exports, and media layers all share the same surface/noise/depth result. Mesh forms
            include triangular, hexagonal, irregular, variable, and equation-driven voxel layouts where X controls adherence and Y controls
            metronymics.
          </p>
          <div className="spatial-mesh-form-actions">
            <button type="button" className="dwt-inline-button" onClick={() => setSpatialWindowOpen(true)}>
              <Layers size={14} />
              Open Spatial Recognition Studio
            </button>
            <a className="dwt-inline-button" href={DATACOHERECTICS_SPATIAL_MAPPING_URL} target="_blank" rel="noreferrer">
              <ExternalLink size={14} />
              Datacoherectics Voxel Search
            </a>
          </div>
        </div>
        <div className="adjustment-list smart-dark-edge-list spatial-recognition-list">
          {group.controls.map((control) => renderAdjustmentSlider(control, "smart-dark-edge-adjustment spatial-recognition-adjustment"))}
        </div>
      </div>
    );
  }

  function renderSmartDarkEdgeGroup(group) {
    return (
      <div className="smart-dark-edge-group">
        <button
          type="button"
          className={smartDarkEdgeEnabled ? "adjustment-scope-toggle active" : "adjustment-scope-toggle"}
          aria-pressed={smartDarkEdgeEnabled}
          onClick={() => setSmartDarkEdgeEnabled((enabled) => !enabled)}
        >
          <ShieldCheck size={15} />
          <span>
            <strong>{SMART_DARK_EDGE_LABEL}</strong>
            <small>
              {smartDarkEdgeEnabled
                ? "Dark edge pass is active on live camera, HUD, snapshots, and overlay exports."
                : "Off: edge darkening is bypassed while slider values remain ready."}
            </small>
          </span>
        </button>
        <div className="adjustment-list smart-dark-edge-list">
          {group.controls.map((control) => renderAdjustmentSlider(control, "smart-dark-edge-adjustment"))}
        </div>
      </div>
    );
  }

  function renderMediaLayerSlider(layer, key, label, min, max, unit = "") {
    const value = layer[key] ?? 0;
    return (
      <label className="media-layer-slider" key={key}>
        <span>
          {label}
          <output>{value}{unit}</output>
        </span>
        <input
          id={`media-${key}`}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(event) => updateMediaLayer(layer.id, { [key]: Number(event.target.value) })}
          style={{ "--value": `${((value - min) / (max - min)) * 100}%` }}
        />
      </label>
    );
  }

  function renderMediaLayerEditor() {
    if (!selectedMediaLayer) {
      return <p className="empty-capture-note">Select or upload a layer to edit opacity, blend, splice, position, scale, and studio effect.</p>;
    }
    return (
      <section className="media-layer-editor" aria-label={`Edit ${selectedMediaLayer.name}`}>
        <div className="media-layer-editor-heading">
          <div>
            <strong>{selectedMediaLayer.name}</strong>
            <span>{selectedMediaLayer.kind === "video" ? "Video layer" : "Image layer"} • {selectedMediaLayer.type || "local file"}</span>
          </div>
          <button type="button" onClick={() => useCurrentStudioEffectForLayer(selectedMediaLayer.id)}>
            <Sparkles size={14} />
            Use Current Effect
          </button>
        </div>

        <div className="media-layer-select-grid">
          <label>
            Layer effect
            <select
              id="media-effect-preset"
              value={selectedMediaLayer.effectId}
              onChange={(event) => updateMediaLayer(selectedMediaLayer.id, { effectId: event.target.value })}
            >
              {CAMERA_EFFECTS.map((effect) => (
                <option key={effect.id} value={effect.id}>{effect.name} - {effect.category}</option>
              ))}
            </select>
          </label>
          <label>
            Splice / blend
            <select
              id="media-blend-mode"
              value={selectedMediaLayer.blendMode}
              onChange={(event) => updateMediaLayer(selectedMediaLayer.id, { blendMode: event.target.value })}
            >
              {MEDIA_BLEND_MODES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Splice mask
            <select
              id="media-splice-mode"
              value={selectedMediaLayer.spliceMode}
              onChange={(event) => updateMediaLayer(selectedMediaLayer.id, { spliceMode: event.target.value })}
            >
              {MEDIA_SPLICE_MODES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="media-layer-slider-grid">
          {renderMediaLayerSlider(selectedMediaLayer, "opacity", "Opacity", 0, 100, "%")}
          {renderMediaLayerSlider(selectedMediaLayer, "scale", "Scale", 25, 220, "%")}
          {renderMediaLayerSlider(selectedMediaLayer, "offsetX", "Move X", -100, 100, "%")}
          {renderMediaLayerSlider(selectedMediaLayer, "offsetY", "Move Y", -100, 100, "%")}
          {renderMediaLayerSlider(selectedMediaLayer, "rotation", "Rotation", -180, 180, "deg")}
        </div>

        <div className="media-layer-actions">
          {selectedMediaLayer.kind === "video" && (
            <>
              <button type="button" onClick={() => toggleMediaLayerPlayback(selectedMediaLayer)}>
                {selectedMediaLayer.paused ? <Play size={14} /> : <Pause size={14} />}
                {selectedMediaLayer.paused ? "Play Layer" : "Pause Layer"}
              </button>
              <button type="button" onClick={() => restartMediaLayerVideo(selectedMediaLayer)}>
                <RotateCcw size={14} />
                Restart Video
              </button>
            </>
          )}
          <button type="button" onClick={() => resetMediaLayer(selectedMediaLayer.id)}>
            <RefreshCw size={14} />
            Reset Layer
          </button>
          <button type="button" className="danger-action" onClick={() => removeMediaLayer(selectedMediaLayer.id)}>
            <Trash2 size={14} />
            Remove Layer
          </button>
        </div>
      </section>
    );
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
        <button type="button" className="trusted-user-pill" onClick={() => setYoutubeWindowOpen(true)}>
          <Youtube size={16} />
          YouTube channel
        </button>
        <button type="button" className="trusted-user-pill" onClick={() => setPrimeResultsWindowOpen(true)}>
          <Sparkles size={16} />
          PRIME results
        </button>
        <button type="button" className="trusted-user-pill" onClick={() => setFeatureGuideWindowOpen(true)}>
          <SlidersHorizontal size={16} />
          Feature guide
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
            ⇲<a href={YOUTUBE_SHARED_CHANNEL_URL} target="_blank" rel="noreferrer">https://youtube.com/@azel222?si=ytU4AFS_aaEr-NNA</a> ↸
          </p>
        </div>
        <div className="studio-disclosure-box">
          <h3>Privacy, Camera Access, And Local Recording Disclosure</h3>
          <p>
            This studio asks for camera access only after you unlock the page and press Start Camera. Your camera stream stays on your own
            device, inside your browser. The site does not upload, transmit, store, or remotely view your camera feed, photos, or recordings.
            Captures and recordings are created locally as browser object URLs and remain visible only in this browser session unless you
            download or share them yourself. Desktop browsers that expose the File System Access API can save snapshots into a user-approved
            `SPECTRAL_X1_IMAGE_SAVES` folder; mobile browsers decide whether downloaded images land in Photos, Files, or Downloads.
          </p>
          <p>
            Smart signal controls are experimental local image-processing tools only. They do not identify people, match identities, store
            biometrics, or compare faces. They analyze the current frame for visible tone, edge, depth, range, midtone, highlight, shadow,
            structure, and grouped-pixel signals so visual effects can be weighted more strongly inside this browser.
          </p>
          <p>
            Camera permission is controlled by your browser and operating system. You can stop the stream with Stop Camera or revoke site
            permission from your browser settings at any time. MP4 recording depends on your browser’s MediaRecorder support and automatically
            stops at 3 minutes.
          </p>
        </div>
        <div className="studio-guide-box">
          <h3>What The Studio Offers</h3>
          <div className="studio-mission-copy">
            <p>
              This is a Spectral/Spirit imaging studio with extensive, vast, advanced capabilities. All things spirits, including spirits,
              and auras; emit very faint visible light. Nowadays factory production installs an IR/UV cut hot glass, to “supposedly” make
              images better, but cuts out the spectrum of light that would be valuable for spirit photography. I deeply believe it’s a type
              of conspiracy coverup. However, spirits and auras DO still emit very faint visible light. And this extensive free tool aims to
              perfect that capability. Head over the [PRIME Examples] section to view the very best image results I’ve ever gotten with just
              standard limited iPhone photo gallery effects, background environment, atmosphere, and lighting. You’ll see superb images my
              Wolf Aura (the very FIRST and very BEST image of spectral Photography I’ve EVER gotten), as well as several other images of my
              wolf spirits, and such. These images are the prized goal of this free app for you. The options and possibilities are ENDLESS!
              Please have fun and EXPERIMENT!!
            </p>
            <button type="button" className="studio-inline-action" onClick={() => setPrimeResultsWindowOpen(true)}>
              <Sparkles size={15} />
              Open PRIME Examples Gallery
            </button>
            <p className="rights-reserved-notice">
              🔺®️RIGHTS RESERVED®️🔻<br />
              »®️I~SETH M. KNUDSON, OWNER OF SUPERNATURAL WORLD YOUTUBE CHANNEL, AM THE RIGHTFUL CREATOR OF THIS UNIQUE METHOD OF
              SPIRIT/SPECTRAL PHOTOGRAPHY&gt;PLEASE CITE MY IMAGES, AND YOUR RESULTS WITH THIS APP, MY NAME, AND MY YOUTUBE CHANNEL
              SUPERNATURAL WORLD®«
            </p>
            <a className="studio-inline-action" href={YOUTUBE_SHARED_CHANNEL_URL} target="_blank" rel="noreferrer">
              <Youtube size={15} />
              Open Supernatural World YouTube Channel
            </a>
            <button type="button" className="studio-inline-action" onClick={() => setFeatureGuideWindowOpen(true)}>
              <SlidersHorizontal size={15} />
              Open Complete 5000+ Feature Guide
            </button>
            <p className="rights-summary">
              Seth M. Knudson, owner of the Supernatural World YouTube channel, is presented as the creator of this spirit/spectral
              photography method. Users are asked to cite Seth Knudson, Supernatural World, the source images, and app-generated results
              when sharing or referencing this work.
            </p>
          </div>
          <ul>
            <li>{CAMERA_EFFECTS.length} local visual presets compiled at 500% intensity for IR-style, UVA-style, full-spectrum thermal, XLS, inversion, tritone, quadtone, channel spectrograph, black-field, channel sweep, cinematic, monochrome, duotone, retro, and color-lab looks.</li>
            <li>Four RGBW gradient mixers for Main, Secondary, Third, and Highlights color layers that drive overlays, filter math, and the selected app accent aesthetic.</li>
            <li>Grouped adjustment dropdowns with 11 core photo controls, 10 color inversion tools, 20 inversion presets, 10 smart darker-edge controls, 20 smart signal engines, 47 local Spatial Recognition Studio controls with synchronized live cell, triangular/hexagonal/irregular/variable/equation-driven mesh forms, Point Cloud, and TIN surface mapping, subtle reveal sampling, a visual mesh interface toggle and opacity scaler, an expanded AI-orchestrated Smart Isolate Grouped Pixels DWT/noise defect-distortion module with 31 controls, Thermal Studio A-O hotspot recoloring, 100 advanced sliders, equation-generated filter names/descriptions, and live/overlay adjustment toggles.</li>
            <li>Flashlight Studio includes Hold Torch, Lock Rear Torch, Strobe, Dimmer Pulse, interval timing, and brightness-duty controls where the rear-camera torch API is exposed by the device.</li>
            <li>Processed PNG snapshots and 1080P or 2K MP4 recordings with local camera effects applied, including browser download plus desktop folder-save support when permission is granted.</li>
            <li>Separate 1-3 layer image/video compositor with opacity, splice masks, blend modes, transforms, full adjustment-stack support, and clean PNG export.</li>
            <li>Clean exports hide app-added preview chrome, labels, and watermark overlays so only the processed image or video remains.</li>
            <li>A local shelf stores the latest 3 photos/videos with preview, download, and remove controls.</li>
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
                onClick={() => selectEffectCategory(category)}
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
          <div className="camera-frame" ref={cameraFrameRef}>
            <video ref={videoRef} className="camera-source-video" autoPlay playsInline muted aria-hidden="true" />
            <canvas ref={previewCanvasRef} className="camera-output-canvas" aria-label="Live camera preview with studio effects applied" />
            {!cameraActive && (
              <div className="camera-placeholder">
                <LockKeyhole size={40} />
                <strong>{authorized ? "Camera is waiting" : "Access code required"}</strong>
                <span>{authorized ? "Start camera to trigger the browser permission popup." : "Unlock the studio to request device camera access."}</span>
              </div>
            )}
            {!cameraActive && (
              <>
                <div className="camera-corners" aria-hidden="true" />
                <div className="camera-live-badge">Locked</div>
                <div className="camera-meta-row">
                  <span>No stream active</span>
                  <span>{cameraFacing === "user" ? "Front camera" : "Rear camera"}</span>
                  <span>{liveSelectedEffect.name}</span>
                </div>
              </>
            )}
          </div>

          <div className="studio-action-row">
            <button type="button" onClick={() => startCamera()}>
              <Camera size={18} />
              Start Camera
            </button>
            <button type="button" onClick={handleStopCamera} disabled={!cameraActive}>
              <X size={18} />
              Stop Camera
            </button>
            <button
              type="button"
              className={cameraFeedPaused ? "studio-pause-button active" : "studio-pause-button"}
              onClick={toggleCameraFeedPause}
              disabled={!cameraActive}
            >
              {cameraFeedPaused ? <Play size={18} /> : <Pause size={18} />}
              {cameraFeedPaused ? "Resume Feed" : "Pause Feed"}
            </button>
            <button type="button" onClick={flipCamera} disabled={!cameraActive}>
              <FlipHorizontal size={18} />
              Flip Camera
            </button>
            <button
              type="button"
              className={torchActive ? "studio-torch active" : "studio-torch"}
              onClick={toggleTorch}
              disabled={!authorized}
              aria-pressed={torchActive}
              title={torchSupported ? "Toggle the rear camera flashlight" : "Requests rear camera torch support where the browser/device allows it"}
            >
              <Zap size={18} />
              {torchActive ? "Flashlight On" : "Rear Flashlight"}
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

          {renderFlashlightStudioPanel()}

          {renderEquationEnginePanel()}

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
          {cameraActive && cameraFacing === "environment" && !torchSupported && (
            <p className="studio-status torch-note">Flashlight control appears unsupported for the current rear-camera stream.</p>
          )}
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

          <section className="media-compositor-panel" aria-labelledby="mediaCompositorTitle">
            <div className="recording-panel-heading">
              <div>
                <h2 id="mediaCompositorTitle">Image / Video Overlay Compositor</h2>
                <span>Upload up to 3 local images or videos. Layers are composited with opacity, CapCut-style splice/blend modes, and the studio effect engine.</span>
              </div>
              <strong>{mediaLayers.length} / {MEDIA_LAYER_LIMIT}</strong>
            </div>

            <div className="media-compositor-actions">
              <input
                ref={mediaUploadInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                hidden
                onChange={handleMediaUpload}
              />
              <button type="button" onClick={() => mediaUploadInputRef.current?.click()}>
                <Upload size={17} />
                Upload Media
              </button>
              <button type="button" className="studio-snapshot" onClick={exportMediaCompositeSnapshot} disabled={!mediaLayers.length}>
                <Download size={17} />
                Export Composite PNG
              </button>
            </div>

            <div className="media-compositor-frame" ref={mediaFrameRef}>
              <canvas ref={mediaCanvasRef} className="media-compositor-canvas" aria-label="Uploaded media composited preview" />
              {!mediaLayers.length && (
                <div className="media-compositor-placeholder">
                  <ImagePlus size={36} />
                  <strong>Upload 1-3 local images or videos</strong>
                  <span>Every upload can be blended, spliced, transformed, and filtered before export.</span>
                </div>
              )}
            </div>

            {mediaLayers.length > 0 && (
              <div className="media-layer-tabs" aria-label="Uploaded media layers">
                {mediaLayers.map((layer, index) => (
                  <button
                    key={layer.id}
                    type="button"
                    className={layer.id === selectedMediaLayer?.id ? "active" : ""}
                    onClick={() => setSelectedMediaLayerId(layer.id)}
                  >
                    <Layers size={15} />
                    <span>Layer {index + 1}</span>
                    <strong>{layer.name}</strong>
                    <small>{layer.kind === "video" ? "Video" : "Image"} • {layer.opacity}%</small>
                  </button>
                ))}
              </div>
            )}

            {renderMediaLayerEditor()}

            <p className="studio-status">{mediaComposerStatus}</p>
            {mediaSnapshotUrl && (
              <a className="snapshot-review" href={mediaSnapshotUrl} target="_blank" rel="noreferrer">
                Open last local composite snapshot
              </a>
            )}
          </section>
        </section>

        <aside className="adjustments-panel studio-panel">
          <div className="studio-panel-heading">
            <h2>Adjustments</h2>
            <button type="button" onClick={resetStudio}>Reset all</button>
          </div>
          <div className="adjustment-scope-toggles" aria-label="Adjustment processing targets">
            <button
              type="button"
              className={liveAdjustmentsEnabled ? "adjustment-scope-toggle active" : "adjustment-scope-toggle"}
              aria-pressed={liveAdjustmentsEnabled}
              onClick={() => setLiveAdjustmentsEnabled((enabled) => !enabled)}
            >
              <Camera size={15} />
              <span>
                <strong>Live Camera Adjustments</strong>
                <small>{liveAdjustmentsEnabled ? "All sliders and generated values affect the live feed." : "Live feed uses preset-only processing."}</small>
              </span>
            </button>
            <button
              type="button"
              className={overlayAdjustmentsEnabled ? "adjustment-scope-toggle active" : "adjustment-scope-toggle"}
              aria-pressed={overlayAdjustmentsEnabled}
              onClick={() => setOverlayAdjustmentsEnabled((enabled) => !enabled)}
            >
              <Layers size={15} />
              <span>
                <strong>Overlay Studio Adjustments</strong>
                <small>{overlayAdjustmentsEnabled ? "Uploaded image/video layers use the full adjustment stack." : "Uploaded layers use their selected preset only."}</small>
              </span>
            </button>
          </div>
          <div className="adjustment-dropdown-stack" aria-label="Grouped camera adjustments">
            {ADJUSTMENT_GROUPS.map(renderAdjustmentGroup)}
          </div>
          <div className="studio-reference-note">
            <KeyRound size={17} />
            <span>MDN-style stacked filters, PineTools-style image operations, and Canva-like slider groups are rendered locally on live video.</span>
          </div>
        </aside>
      </section>

      {!authorized && (
        <div className="camera-access-overlay">
          <form className="camera-access-card" onSubmit={unlockStudio}>
            <img className="camera-access-emblem" src={ACCESS_EMBLEM_URL} alt="Supernatural World spectral emblem" />
            <h2>Access Code Required</h2>
            <p>Enter the unique trusted code from the code holder. Camera permission is requested only after unlock.</p>
            <input
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              placeholder="Enter access code"
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
            {authError && <span className="camera-access-error">{authError}</span>}
            <button type="submit" className="studio-unlock-button">
              Unlock Studio
            </button>
            <button type="button" className="studio-guide-access-button" onClick={() => setFeatureGuideWindowOpen(true)}>
              Open Complete Feature Guide
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

            <section className="youtube-channel-card" aria-label="YouTube channel summary">
              <div className="youtube-channel-avatar">
                <Youtube size={32} />
              </div>
              <div>
                <span>{YOUTUBE_CHANNEL_HANDLE}</span>
                <strong>{YOUTUBE_CHANNEL_NAME}</strong>
                <p>
                  Embedded channel homepages are blocked by YouTube frame security, so this window uses the official uploads
                  player and an in-app recent-upload browser.
                </p>
              </div>
              <div className="youtube-channel-actions">
                <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} />
                  Open channel
                </a>
                <button type="button" onClick={() => setDatabaseWindowOpen(true)}>
                  <ExternalLink size={16} />
                  Open database GUI
                </button>
              </div>
            </section>

            {selectedYoutubeVideo && (
              <section className="youtube-featured-upload" aria-label="Selected YouTube upload">
                <img src={`https://i.ytimg.com/vi/${selectedYoutubeVideo.id}/hqdefault.jpg`} alt="" />
                <div>
                  <span>{selectedYoutubeVideo.type} loaded in player</span>
                  <strong>{selectedYoutubeVideo.title}</strong>
                  <small>Published {selectedYoutubeVideo.published}</small>
                </div>
                <a href={`https://www.youtube.com/watch?v=${selectedYoutubeVideo.id}`} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} />
                  Open video
                </a>
              </section>
            )}

            <div className="youtube-frame-shell">
              <iframe
                title={selectedYoutubeVideoId ? "Supernatural World selected YouTube video" : "Supernatural World uploads playlist"}
                src={youtubePlayerUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <div className="youtube-frame-fallback">
                <strong>{selectedYoutubeVideoId ? "Selected upload player" : "Channel uploads player"}</strong>
                <span>
                  YouTube blocks the actual channel homepage inside frames, but videos and playlists can render through
                  official embed URLs.
                </span>
              </div>
            </div>

            <div className="youtube-browser-toolbar" aria-label="YouTube browser controls">
              <button
                type="button"
                className={!selectedYoutubeVideoId ? "active" : ""}
                onClick={() => setSelectedYoutubeVideoId("")}
              >
                <Film size={16} />
                Uploads playlist
              </button>
              <span>Channel ID: {YOUTUBE_CHANNEL_ID}</span>
            </div>

            <div className="youtube-upload-grid" aria-label="Recent YouTube uploads">
              {YOUTUBE_RECENT_UPLOADS.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  className={selectedYoutubeVideoId === video.id ? "active" : ""}
                  onClick={() => setSelectedYoutubeVideoId(video.id)}
                >
                  <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" loading="lazy" />
                  <span>{video.type}</span>
                  <strong>{video.title}</strong>
                  <small>{video.published}</small>
                </button>
              ))}
            </div>

            <div className="youtube-window-actions">
              <a href={YOUTUBE_SHARED_CHANNEL_URL} target="_blank" rel="noreferrer">
                <ExternalLink size={16} />
                Open Channel Homepage
              </a>
              <button type="button" onClick={() => setDatabaseWindowOpen(true)}>
                <ExternalLink size={16} />
                Open Supernatural Database GUI
              </button>
              <a href={YOUTUBE_UPLOADS_PLAYLIST_URL} target="_blank" rel="noreferrer">
                <Film size={16} />
                Open Uploads Player
              </a>
            </div>
          </section>
        </div>
      )}

      {renderDwtIsolationWindow()}
      {renderSpatialRecognitionWindow()}
      {renderFeatureGuideWindow()}

      {primeResultsWindowOpen && selectedPrimeResult && (
        <div className="prime-results-window-backdrop" role="dialog" aria-modal="true" aria-labelledby="primeResultsWindowTitle">
          <section className="prime-results-window">
            <div className="youtube-window-heading">
              <div>
                <Sparkles size={24} />
                <h2 id="primeResultsWindowTitle">PRIME Spectral Image Results Examples</h2>
              </div>
              <button type="button" onClick={() => setPrimeResultsWindowOpen(false)} aria-label="Close PRIME results window">
                <X size={20} />
              </button>
            </div>

            <section className="prime-results-feature" aria-label="Selected PRIME result">
              <div className="prime-results-preview-frame">
                <img src={selectedPrimeResult.src} alt={`${selectedPrimeResult.title} preview`} />
              </div>
              <div className="prime-results-details">
                <span>Selected PRIME example</span>
                <strong>{selectedPrimeResult.title}</strong>
                <small>{selectedPrimeResult.tone}</small>
                <p>{selectedPrimeResult.description}</p>
                <div className="youtube-window-actions">
                  <a href={selectedPrimeResult.src} target="_blank" rel="noreferrer">
                    <ExternalLink size={16} />
                    Open image
                  </a>
                  <a href={selectedPrimeResult.src} download={`${selectedPrimeResult.id}.jpg`}>
                    <Download size={16} />
                    Download
                  </a>
                </div>
              </div>
            </section>

            <div className="prime-results-grid" aria-label="PRIME spectral examples">
              {orderedPrimeResults.map((example) => (
                <button
                  key={example.id}
                  type="button"
                  className={selectedPrimeResult.id === example.id ? "active" : ""}
                  onClick={() => setSelectedPrimeResultId(example.id)}
                >
                  <img src={example.src} alt={`${example.title} thumbnail`} loading="lazy" />
                  <span>{example.id === FEATURED_PRIME_RESULT_ID ? "Latest app generation" : `Example ${PRIME_SPECTRAL_EXAMPLES.findIndex((item) => item.id === example.id) + 1}`}</span>
                  <strong>{example.title}</strong>
                  <small>{example.tone}</small>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {databaseWindowOpen && (
        <div className="database-window-backdrop" role="dialog" aria-modal="true" aria-labelledby="databaseWindowTitle">
          <section className="database-window">
            <div className="youtube-window-heading">
              <div>
                <ExternalLink size={22} />
                <h2 id="databaseWindowTitle">Official Supernatural Database</h2>
              </div>
              <button type="button" onClick={() => setDatabaseWindowOpen(false)} aria-label="Close Supernatural database window">
                <X size={20} />
              </button>
            </div>
            <p className="database-frame-note">
              GUI wrapper is using the official Google Sites database address. If Google blocks this iframe on your device, use the external button below.
            </p>
            <div className="database-frame-shell">
              <iframe
                title="Official Supernatural Database"
                src={SUPERNATURAL_DATABASE_URL}
                referrerPolicy="strict-origin-when-cross-origin"
                sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                allow="fullscreen; clipboard-read; clipboard-write"
              />
              <div className="youtube-frame-fallback">
                <strong>Database window</strong>
                <span>Using /view/official-supernatural-database. Google Sites may still block embedded viewing with X-Frame-Options on some browsers.</span>
              </div>
            </div>
            <div className="youtube-window-actions">
              <a href={SUPERNATURAL_DATABASE_URL} target="_blank" rel="noreferrer">
                <ExternalLink size={16} />
                Open Database Externally
              </a>
            </div>
          </section>
        </div>
      )}

      {cameraActive && cameraHudVisible && (
        <button className="camera-floating-hud" type="button" onClick={scrollToCameraFrame} aria-label="Return to full camera preview">
          <div className="camera-floating-hud-frame">
            <video ref={hudVideoRef} className="camera-source-video" autoPlay playsInline muted aria-hidden="true" />
            <canvas ref={hudCanvasRef} className="camera-output-canvas" aria-hidden="true" />
          </div>
        </button>
      )}
    </main>
  );
}

function supportedMp4MimeType() {
  if (typeof MediaRecorder === "undefined" || typeof MediaRecorder.isTypeSupported !== "function") return "";
  return MP4_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function createMediaLayerFromFile(file, index, effectId) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const kind = file.type.startsWith("video/") ? "video" : "image";
    const id = `media-layer-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`;
    const cleanupAndReject = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };
    const baseLayer = {
      id,
      name: file.name || `${kind} ${index + 1}`,
      kind,
      type: file.type || (kind === "video" ? "video" : "image"),
      url,
      size: file.size,
      opacity: index === 0 ? 100 : 64,
      blendMode: index === 0 ? "source-over" : index === 1 ? "screen" : "overlay",
      spliceMode: "full",
      offsetX: 0,
      offsetY: 0,
      scale: 100,
      rotation: 0,
      effectId,
      paused: false,
      createdAt: new Date().toISOString()
    };

    if (kind === "video") {
      const video = document.createElement("video");
      video.src = url;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      video.onloadedmetadata = () => {
        video.play().catch(() => undefined);
        resolve({
          ...baseLayer,
          element: video,
          width: video.videoWidth || MEDIA_COMPOSITE_WIDTH,
          height: video.videoHeight || MEDIA_COMPOSITE_HEIGHT,
          duration: video.duration || 0
        });
      };
      video.onerror = () => cleanupAndReject(new Error(`Could not load video layer: ${file.name}`));
      return;
    }

    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      resolve({
        ...baseLayer,
        element: image,
        width: image.naturalWidth || MEDIA_COMPOSITE_WIDTH,
        height: image.naturalHeight || MEDIA_COMPOSITE_HEIGHT
      });
    };
    image.onerror = () => cleanupAndReject(new Error(`Could not load image layer: ${file.name}`));
    image.src = url;
  });
}

function drawUploadedMediaComposite(canvas, frameElement, layers, renderState) {
  if (!canvas) return false;
  const size = getRenderedCameraFrameSize(frameElement || canvas, MEDIA_COMPOSITE_WIDTH, MEDIA_COMPOSITE_HEIGHT, {
    scaleCap: MEDIA_CANVAS_SCALE_CAP
  });
  if (!size.width || !size.height) return false;
  if (canvas.width !== size.width) canvas.width = size.width;
  if (canvas.height !== size.height) canvas.height = size.height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return false;
  context.save();
  context.globalAlpha = 1;
  context.globalCompositeOperation = "source-over";
  context.filter = "none";
  context.fillStyle = "#030508";
  context.fillRect(0, 0, size.width, size.height);
  context.restore();

  const drawableLayers = layers.filter((layer) => layer?.element && isDrawableMediaSource(layer.element));
  drawableLayers.forEach((layer) => {
    drawMediaLayer(context, size.width, size.height, layer, renderState);
  });
  return true;
}

function drawMediaLayer(context, width, height, layer, renderState) {
  const source = layer.element;
  if (!isDrawableMediaSource(source)) return;
  mediaLayerWorkCanvas ||= document.createElement("canvas");
  if (mediaLayerWorkCanvas.width !== width) mediaLayerWorkCanvas.width = width;
  if (mediaLayerWorkCanvas.height !== height) mediaLayerWorkCanvas.height = height;
  const layerContext = mediaLayerWorkCanvas.getContext("2d", { alpha: false });
  if (!layerContext) return;
  const layerEffect = CAMERA_EFFECT_LOOKUP.get(layer.effectId) || renderState.selectedEffect || CAMERA_EFFECTS[0];
  const layerSettings = mediaLayerSettings(layerEffect, renderState.manualSettings, renderState.overlayAdjustmentsEnabled !== false);
  drawStudioFrame(layerContext, width, height, source, {
    filterCss: buildFilterCss(layerSettings),
    selectedEffect: layerEffect,
    manualSettings: layerSettings,
    cameraFacing: "environment",
    smartDarkEdgeEnabled: renderState.smartDarkEdgeEnabled,
    spatialRecognitionEnabled: renderState.spatialRecognitionEnabled,
    spatialVisualInterfaceEnabled: renderState.spatialVisualInterfaceEnabled,
    smartSignalEnabled: normalizeSmartSignalToggles(renderState.smartSignalEnabled)
  }, {
    forcePixelFilters: false,
    includePreviewChrome: false,
    pixelScale: 1,
    cssWidth: width,
    pixelBudget: MEDIA_THERMAL_EFFECT_PIXEL_BUDGET
  });

  const offsetX = (setting(layer, "offsetX") / 100) * width * 0.5;
  const offsetY = (setting(layer, "offsetY") / 100) * height * 0.5;
  const scale = clamp(setting(layer, "scale", 100), 25, 220) / 100;
  const rotation = (setting(layer, "rotation") * Math.PI) / 180;

  context.save();
  applyMediaSpliceClip(context, width, height, layer.spliceMode);
  context.globalAlpha = clamp(setting(layer, "opacity", 100) / 100, 0, 1);
  context.globalCompositeOperation = canvasCompositeMode(layer.blendMode);
  context.translate(width / 2 + offsetX, height / 2 + offsetY);
  context.rotate(rotation);
  context.drawImage(mediaLayerWorkCanvas, -width * scale / 2, -height * scale / 2, width * scale, height * scale);
  context.restore();
}

function mediaLayerSettings(effect, manualSettings, useFullAdjustmentStack = true) {
  if (!useFullAdjustmentStack) return { ...DEFAULT_SETTINGS, ...(effect.settings || {}) };
  return {
    ...DEFAULT_SETTINGS,
    ...(effect.settings || {}),
    ...(manualSettings || {})
  };
}

function applyMediaSpliceClip(context, width, height, mode = "full") {
  context.beginPath();
  if (mode === "left") context.rect(0, 0, width / 2, height);
  else if (mode === "right") context.rect(width / 2, 0, width / 2, height);
  else if (mode === "top") context.rect(0, 0, width, height / 2);
  else if (mode === "bottom") context.rect(0, height / 2, width, height / 2);
  else if (mode === "center") context.rect(width * 0.16, height * 0.16, width * 0.68, height * 0.68);
  else if (mode === "diagonal") {
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.lineTo(width, height * 0.72);
    context.lineTo(0, height);
    context.closePath();
  } else if (mode === "circle") {
    context.arc(width / 2, height / 2, Math.min(width, height) * 0.36, 0, Math.PI * 2);
  } else if (mode === "vertical-strips") {
    const stripWidth = width / 9;
    for (let x = 0; x < width; x += stripWidth * 2) context.rect(x, 0, stripWidth, height);
  } else if (mode === "lower-third") {
    context.rect(0, height * 0.58, width, height * 0.42);
  } else {
    context.rect(0, 0, width, height);
  }
  context.clip();
}

function isDrawableMediaSource(source) {
  if (!source) return false;
  if (typeof HTMLVideoElement !== "undefined" && source instanceof HTMLVideoElement) return source.readyState >= 2 && source.videoWidth > 0 && source.videoHeight > 0;
  if (typeof HTMLImageElement !== "undefined" && source instanceof HTMLImageElement) return source.complete && source.naturalWidth > 0 && source.naturalHeight > 0;
  if (typeof HTMLCanvasElement !== "undefined" && source instanceof HTMLCanvasElement) return source.width > 0 && source.height > 0;
  return false;
}

function mediaSourceSize(source, fallbackWidth, fallbackHeight) {
  if (typeof HTMLVideoElement !== "undefined" && source instanceof HTMLVideoElement) {
    return {
      width: source.videoWidth || fallbackWidth,
      height: source.videoHeight || fallbackHeight
    };
  }
  if (typeof HTMLImageElement !== "undefined" && source instanceof HTMLImageElement) {
    return {
      width: source.naturalWidth || fallbackWidth,
      height: source.naturalHeight || fallbackHeight
    };
  }
  if (typeof HTMLCanvasElement !== "undefined" && source instanceof HTMLCanvasElement) {
    return {
      width: source.width || fallbackWidth,
      height: source.height || fallbackHeight
    };
  }
  return { width: fallbackWidth, height: fallbackHeight };
}

function drawCameraOutputCanvas(canvas, frameElement, source, renderState, options = {}) {
  if (!canvas || !source) return false;
  const sourceSize = mediaSourceSize(source, 1280, 720);
  const fallbackWidth = sourceSize.width || 1280;
  const fallbackHeight = sourceSize.height || 720;
  const size =
    options.useRenderedFrameSize === true
      ? getRenderedCameraFrameSize(frameElement || canvas, fallbackWidth, fallbackHeight, {
          scaleCap: options.scaleCap ?? PREVIEW_CANVAS_SCALE_CAP
        })
      : getCanonicalCameraFrameSize();
  if (!size.width || !size.height) return false;
  if (canvas.width !== size.width) canvas.width = size.width;
  if (canvas.height !== size.height) canvas.height = size.height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return false;
  drawStudioFrame(context, size.width, size.height, source, renderState, {
    includePreviewChrome: options.includePreviewChrome,
    forcePixelFilters: options.forcePixelFilters === true,
    pixelScale: size.scale,
    cssWidth: size.cssWidth,
    metaLabels: options.metaLabels,
    pixelBudget: options.pixelBudget
  });
  return true;
}

function getCanonicalCameraFrameSize() {
  return {
    width: CAMERA_CANONICAL_RENDER_WIDTH,
    height: CAMERA_CANONICAL_RENDER_HEIGHT,
    scale: 1,
    cssWidth: CAMERA_CANONICAL_CSS_WIDTH
  };
}

function clearCameraOutputCanvas(canvas) {
  if (!canvas) return;
  const context = canvas.getContext("2d");
  context?.clearRect(0, 0, canvas.width, canvas.height);
}

function canvasToPngBlob(canvas) {
  return new Promise((resolve, reject) => {
    if (!canvas) {
      resolve(null);
      return;
    }
    let settled = false;
    const done = (blob) => {
      if (settled) return;
      settled = true;
      resolve(blob || dataUrlToBlob(canvas.toDataURL("image/png")));
    };
    const fallbackTimer = window.setTimeout(() => {
      try {
        done(dataUrlToBlob(canvas.toDataURL("image/png")));
      } catch (error) {
        reject(error);
      }
    }, 1200);
    try {
      canvas.toBlob((blob) => {
        window.clearTimeout(fallbackTimer);
        done(blob);
      }, "image/png");
    } catch (error) {
      window.clearTimeout(fallbackTimer);
      reject(error);
    }
  });
}

function dataUrlToBlob(dataUrl) {
  const [header, data] = String(dataUrl || "").split(",");
  if (!data) return null;
  const mime = header.match(/data:([^;]+)/)?.[1] || "image/png";
  const binary = window.atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mime });
}

function getRenderedCameraFrameSize(frameElement, fallbackWidth, fallbackHeight, options = {}) {
  if (!frameElement?.getBoundingClientRect) {
    return {
      width: Math.max(1, Math.round(fallbackWidth || 1280)),
      height: Math.max(1, Math.round(fallbackHeight || 720)),
      scale: 1,
      cssWidth: Math.max(1, Math.round(fallbackWidth || 1280))
    };
  }
  const rect = frameElement.getBoundingClientRect();
  const deviceScale = clamp(window.devicePixelRatio || 1, 1, options.scaleCap || 2);
  const width = Math.round(rect.width * deviceScale);
  const height = Math.round(rect.height * deviceScale);
  if (width > 0 && height > 0) return { width, height, scale: deviceScale, cssWidth: rect.width };
  return {
    width: Math.max(1, Math.round(fallbackWidth || 1280)),
    height: Math.max(1, Math.round(fallbackHeight || 720)),
    scale: 1,
    cssWidth: Math.max(1, Math.round(fallbackWidth || 1280))
  };
}

function drawStudioFrame(context, width, height, mediaSource, renderState, options = {}) {
  const { filterCss, selectedEffect, manualSettings, cameraFacing } = renderState;
  const previewFilterCss = filterCss || buildFilterCss(manualSettings);
  const useCanvasFilter = options.allowNativeCanvasFilter === true && !options.forcePixelFilters && supportsCanvasContextFilter(context);
  context.save();
  context.filter = "none";
  context.globalAlpha = 1;
  context.globalCompositeOperation = "source-over";
  context.fillStyle = "#030508";
  context.fillRect(0, 0, width, height);
  if (isDrawableMediaSource(mediaSource)) {
    const { width: sourceWidth, height: sourceHeight } = mediaSourceSize(mediaSource, width, height);
    const sourceRatio = sourceWidth / sourceHeight;
    const targetRatio = width / height;
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
    if (useCanvasFilter) context.filter = previewFilterCss;
    if (cameraFacing === "user") {
      context.translate(width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(mediaSource, sx, sy, sw, sh, 0, 0, width, height);
  }
  context.restore();
  if (!useCanvasFilter) applyCanvasPreviewFilters(context, width, height, previewFilterCss, options);
  const signalSettings = buildSmartSignalProcessorSettings(
    context,
    width,
    height,
    manualSettings,
    selectedEffect,
    renderState.smartSignalEnabled,
    options
  );
  applyAdvancedCameraPixelEffects(context, width, height, signalSettings, selectedEffect, options);
  applySmartDarkEdgeAmplifier(context, width, height, signalSettings, selectedEffect, renderState.smartDarkEdgeEnabled, options);
  applySmartSignalProcessorEffects(context, width, height, signalSettings, selectedEffect, renderState.smartSignalEnabled, options);
  applySpatialRecognitionEffects(context, width, height, signalSettings, selectedEffect, renderState.spatialRecognitionEnabled, {
    ...options,
    spatialVisualInterfaceEnabled: renderState.spatialVisualInterfaceEnabled !== false
  });
  paintOverlay(context, width, height, selectedEffect, signalSettings);
  paintSpecialOverlay(context, width, height, signalSettings, selectedEffect);
  paintCanvasGrain(context, width, height, signalSettings);
  if (options.includePreviewChrome) {
    paintPreviewChrome(context, width, height, {
      scale: options.pixelScale || 1,
      cssWidth: options.cssWidth || width,
      labels: options.metaLabels || []
    });
  }
}

function applyCanvasPreviewFilters(context, width, height, filterCss, options = {}) {
  const pixelBudget = options.pixelBudget || 0;
  if (context.canvas && pixelBudget && width * height > pixelBudget) {
    const scale = Math.sqrt(pixelBudget / (width * height));
    const workWidth = Math.max(1, Math.round(width * scale));
    const workHeight = Math.max(1, Math.round(height * scale));
    previewFilterWorkCanvas ||= document.createElement("canvas");
    if (previewFilterWorkCanvas.width !== workWidth) previewFilterWorkCanvas.width = workWidth;
    if (previewFilterWorkCanvas.height !== workHeight) previewFilterWorkCanvas.height = workHeight;
    const workContext = previewFilterWorkCanvas.getContext("2d", { alpha: false, willReadFrequently: true });
    if (!workContext) return;
    workContext.save();
    workContext.filter = "none";
    workContext.imageSmoothingEnabled = true;
    workContext.imageSmoothingQuality = "high";
    workContext.clearRect(0, 0, workWidth, workHeight);
    workContext.drawImage(context.canvas, 0, 0, width, height, 0, 0, workWidth, workHeight);
    workContext.restore();
    applyCanvasPreviewFiltersToContext(workContext, workWidth, workHeight, filterCss);
    context.save();
    context.filter = "none";
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.clearRect(0, 0, width, height);
    context.drawImage(previewFilterWorkCanvas, 0, 0, workWidth, workHeight, 0, 0, width, height);
    context.restore();
    return;
  }
  applyCanvasPreviewFiltersToContext(context, width, height, filterCss);
}

function applyCanvasPreviewFiltersToContext(context, width, height, filterCss) {
  const model = parseFilterCss(filterCss);
  if (!filterModelChangesPixels(model)) return;
  let frame;
  try {
    frame = context.getImageData(0, 0, width, height);
  } catch {
    return;
  }
  const data = frame.data;
  if (model.blur > 0.35) applyBoxBlur(data, width, height, Math.min(20, Math.round(model.blur)));
  for (let index = 0; index < data.length; index += 4) {
    let r = data[index];
    let g = data[index + 1];
    let b = data[index + 2];

    if (model.sepia) {
      const amount = model.sepia;
      const nr = r * (1 - 0.607 * amount) + g * (0.769 * amount) + b * (0.189 * amount);
      const ng = r * (0.349 * amount) + g * (1 - 0.314 * amount) + b * (0.168 * amount);
      const nb = r * (0.272 * amount) + g * (0.534 * amount) + b * (1 - 0.869 * amount);
      r = nr;
      g = ng;
      b = nb;
    }

    if (model.grayscale) {
      const amount = model.grayscale;
      const luminance = r * 0.2126 + g * 0.7152 + b * 0.0722;
      r = r * (1 - amount) + luminance * amount;
      g = g * (1 - amount) + luminance * amount;
      b = b * (1 - amount) + luminance * amount;
    }

    if (model.invert) {
      const amount = model.invert;
      r = r * (1 - amount) + (255 - r) * amount;
      g = g * (1 - amount) + (255 - g) * amount;
      b = b * (1 - amount) + (255 - b) * amount;
    }

    if (model.hue) {
      [r, g, b] = rotateHue(r, g, b, model.hue);
    }

    if (model.saturate !== 1) {
      const amount = model.saturate;
      const luminance = r * 0.2126 + g * 0.7152 + b * 0.0722;
      r = luminance + (r - luminance) * amount;
      g = luminance + (g - luminance) * amount;
      b = luminance + (b - luminance) * amount;
    }

    if (model.brightness !== 1) {
      r *= model.brightness;
      g *= model.brightness;
      b *= model.brightness;
    }

    if (model.contrast !== 1) {
      r = (r - 128) * model.contrast + 128;
      g = (g - 128) * model.contrast + 128;
      b = (b - 128) * model.contrast + 128;
    }

    data[index] = clamp(r, 0, 255);
    data[index + 1] = clamp(g, 0, 255);
    data[index + 2] = clamp(b, 0, 255);
  }
  context.putImageData(frame, 0, 0);
}

function cameraFrameInterval(settings, effect, smartDarkEdgeEnabled = false, smartSignalEnabled = {}, spatialRecognitionEnabled = false) {
  return hasAdvancedCameraPixelEffects(settings, effect, smartDarkEdgeEnabled, smartSignalEnabled, spatialRecognitionEnabled)
    ? CAMERA_HEAVY_FRAME_INTERVAL_MS
    : CAMERA_LIGHT_FRAME_INTERVAL_MS;
}

function advancedCameraPixelModel(settings, effect) {
  const paletteName = settings?.thermalPalette || "";
  const thermalSignal =
    effectSetting(settings, "thermalBlend") +
    effectSetting(settings, "thermalContour") * 0.78 +
    effectSetting(settings, "heatEdge") * 0.72;
  const thermalPresetSignal = paletteName || effect?.category?.includes("Thermal") ? 54 : 0;
  const xlsSignal = effectSetting(settings, "xrayGhost") + (paletteName === "xls" || effect?.category === "XLS Camera" ? 72 : 0);
  const posterizeAmount = clamp(effectSetting(settings, "posterize", 0, PIXEL_EFFECT_GAIN) / 100, 0, 1);
  const pixelateAmount = clamp(effectSetting(settings, "pixelate", 0, PIXEL_EFFECT_GAIN) / 100, 0, 1);
  const noiseReductionAmount = clamp(effectSetting(settings, "noiseReduction", 0, PIXEL_EFFECT_GAIN) / 100, 0, 1);
  const colorBalanceSignal =
    Math.abs(effectSetting(settings, "cyanBalance", 0, PIXEL_EFFECT_GAIN)) +
    Math.abs(effectSetting(settings, "magentaBalance", 0, PIXEL_EFFECT_GAIN)) +
    Math.abs(effectSetting(settings, "yellowBalance", 0, PIXEL_EFFECT_GAIN)) +
    Math.abs(effectSetting(settings, "midtoneLift", 0, PIXEL_EFFECT_GAIN));
  const thermalAmount = clamp(((thermalSignal + thermalPresetSignal) * THERMAL_SIGNAL_GAIN) / 210, 0, 1);
  const xlsAmount = clamp(xlsSignal / 135, 0, 1);
  const thermalStudioActive = buildThermalStudioModel(settings).active;
  return {
    palette: paletteName || (xlsAmount > thermalAmount ? "xls" : "classic"),
    thermalAmount,
    xlsAmount,
    thermalStudioActive,
    posterizeAmount,
    pixelateAmount,
    noiseReductionAmount,
    colorBalanceAmount: clamp(colorBalanceSignal / 180, 0, 1)
  };
}

function hasAdvancedCameraPixelEffects(settings, effect, smartDarkEdgeEnabled = false, smartSignalEnabled = {}, spatialRecognitionEnabled = false) {
  const model = advancedCameraPixelModel(settings, effect);
  return Boolean(
    model.thermalAmount ||
      model.xlsAmount ||
      model.posterizeAmount ||
      model.pixelateAmount ||
      model.noiseReductionAmount ||
      model.colorBalanceAmount ||
      model.thermalStudioActive ||
      smartDarkEdgeEnabled ||
      hasEnabledSmartSignalProcessor(smartSignalEnabled) ||
      hasSpatialRecognitionSignal(settings, effect, spatialRecognitionEnabled)
  );
}

function applyAdvancedCameraPixelEffects(context, width, height, settings, effect, options = {}) {
  const effectModel = advancedCameraPixelModel(settings, effect);
  if (
    !effectModel.thermalAmount &&
    !effectModel.xlsAmount &&
    !effectModel.posterizeAmount &&
    !effectModel.pixelateAmount &&
    !effectModel.noiseReductionAmount &&
    !effectModel.colorBalanceAmount &&
    !effectModel.thermalStudioActive
  ) {
    return;
  }
  const pixelBudget = options.pixelBudget || THERMAL_EFFECT_PIXEL_BUDGET;

  if (context.canvas && width * height > pixelBudget) {
    const scale = Math.sqrt(pixelBudget / (width * height));
    const workWidth = Math.max(1, Math.round(width * scale));
    const workHeight = Math.max(1, Math.round(height * scale));
    thermalWorkCanvas ||= document.createElement("canvas");
    if (thermalWorkCanvas.width !== workWidth) thermalWorkCanvas.width = workWidth;
    if (thermalWorkCanvas.height !== workHeight) thermalWorkCanvas.height = workHeight;
    const workContext = thermalWorkCanvas.getContext("2d", { alpha: false, willReadFrequently: true });
    if (!workContext) return;
    workContext.save();
    workContext.imageSmoothingEnabled = true;
    workContext.imageSmoothingQuality = "high";
    workContext.clearRect(0, 0, workWidth, workHeight);
    workContext.drawImage(context.canvas, 0, 0, width, height, 0, 0, workWidth, workHeight);
    workContext.restore();
    applyAdvancedCameraPixelEffectsToContext(workContext, workWidth, workHeight, settings, effectModel);
    context.save();
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.clearRect(0, 0, width, height);
    context.drawImage(thermalWorkCanvas, 0, 0, workWidth, workHeight, 0, 0, width, height);
    context.restore();
    return;
  }

  applyAdvancedCameraPixelEffectsToContext(context, width, height, settings, effectModel);
}

function applyAdvancedCameraPixelEffectsToContext(context, width, height, settings, effectModel) {
  const { palette, thermalAmount, xlsAmount, posterizeAmount, pixelateAmount, noiseReductionAmount, colorBalanceAmount } = effectModel;
  if (pixelateAmount) applyPixelateToContext(context, width, height, pixelateAmount);
  let frame;
  try {
    frame = context.getImageData(0, 0, width, height);
  } catch {
    return;
  }

  const data = frame.data;
  if (noiseReductionAmount) applyBoxBlur(data, width, height, clamp(Math.round(1 + noiseReductionAmount * 3), 1, 4));
  const source = new Uint8ClampedArray(data);
  const edgeBoost = clamp((effectSetting(settings, "heatEdge") + effectSetting(settings, "thermalContour") * 0.58 + effectSetting(settings, "edgeEnhance") * 0.4) / 140, 0, 1.7);
  const contour = clamp((effectSetting(settings, "thermalContour") + effectSetting(settings, "localContrast") * 0.54) / 88, 0, 1.8);
  const contrastPush = 1 + contour * 1.28 + effectSetting(settings, "dehaze") / 170;
  const shadowDepth = clamp(effectSetting(settings, "shadowDepth") / 100, 0, 1);
  const heatLift = clamp(effectSetting(settings, "thermalBlend") / 100, 0, 1);
  const cyanBalance = effectSetting(settings, "cyanBalance", 0, PIXEL_EFFECT_GAIN) / 100;
  const magentaBalance = effectSetting(settings, "magentaBalance", 0, PIXEL_EFFECT_GAIN) / 100;
  const yellowBalance = effectSetting(settings, "yellowBalance", 0, PIXEL_EFFECT_GAIN) / 100;
  const midtoneLift = effectSetting(settings, "midtoneLift", 0, PIXEL_EFFECT_GAIN) / 100;
  const posterizeLevels = posterizeAmount ? Math.round(clamp(20 - posterizeAmount * 16, 3, 20)) : 0;
  const coldPalette = thermalColdPalette(palette);
  const hotPalette = thermalHotPalette(palette);
  const keepWhiteBackground = thermalAllowsWhiteBackground(palette);
  const expandedRgbRange = thermalUsesExpandedRgbRange(palette);
  const thermalStudioModel = buildThermalStudioModel(settings);
  const lumaAt = (pixelIndex) =>
    (source[pixelIndex] * 0.2126 + source[pixelIndex + 1] * 0.7152 + source[pixelIndex + 2] * 0.0722) / 255;

  for (let index = 0; index < data.length; index += 4) {
    let r = data[index];
    let g = data[index + 1];
    let b = data[index + 2];
    const pixel = index / 4;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const luma = lumaAt(index);
    const left = x > 0 ? lumaAt(index - 4) : luma;
    const right = x < width - 1 ? lumaAt(index + 4) : luma;
    const up = y > 0 ? lumaAt(index - width * 4) : luma;
    const down = y < height - 1 ? lumaAt(index + width * 4) : luma;
    const localAverage = (luma * 2 + left + right + up + down) / 6;
    const gradientEdge = clamp(Math.abs(right - left) + Math.abs(down - up), 0, 1);
    const localTexture = clamp(Math.abs(luma - localAverage) * 2.8 + gradientEdge * 0.9, 0, 1);
    const flatness = clamp(1 - localTexture * 5, 0, 1);
    let thermalDepth = luma * 0.62 + localAverage * 0.24 + localTexture * 0.78 + gradientEdge * edgeBoost * 1.35;
    thermalDepth -= shadowDepth * flatness * 0.12;
    if (!keepWhiteBackground) thermalDepth -= flatness * 0.16;
    thermalDepth = clamp((thermalDepth - 0.5) * contrastPush + 0.5, 0, 1);
    thermalDepth = clamp(Math.pow(thermalDepth, clamp(0.96 - heatLift * 0.28 - edgeBoost * 0.08, 0.58, 1.16)), 0, 1);
    if (expandedRgbRange) {
      thermalDepth = clamp((thermalDepth - 0.14) * 2.18 + localTexture * 0.2 + gradientEdge * edgeBoost * 0.24, 0, 1);
      thermalDepth = clamp(Math.pow(thermalDepth, 0.76), 0, 1);
    }

    let mappedLuma = thermalDepth;
    if (thermalAmount) {
      const coldDepth = clamp(mappedLuma * 0.64 - localTexture * 0.34 - flatness * 0.08, 0, 1);
      const hotDepth = clamp(mappedLuma + gradientEdge * edgeBoost * 1.9 + localTexture * 0.42 + heatLift * 0.08, 0, 1);
      const baseColor = thermalPaletteColor(mappedLuma, palette);
      const coldColor = thermalPaletteColor(coldDepth, coldPalette);
      const hotColor = thermalPaletteColor(hotDepth, hotPalette);
      const detailAlpha = clamp(0.12 + contour * 0.22 + localTexture * 0.52, 0, 0.68);
      const heatAlpha = clamp(heatLift * 0.18 + gradientEdge * edgeBoost * 0.86 + localTexture * 0.24, 0, 0.76);
      let [tr, tg, tb] = baseColor;
      tr = mixChannel(coldColor[0], tr, detailAlpha);
      tg = mixChannel(coldColor[1], tg, detailAlpha);
      tb = mixChannel(coldColor[2], tb, detailAlpha);
      tr = mixChannel(tr, hotColor[0], heatAlpha);
      tg = mixChannel(tg, hotColor[1], heatAlpha);
      tb = mixChannel(tb, hotColor[2], heatAlpha);
      if (!keepWhiteBackground && flatness > 0.45 && mappedLuma > 0.68) {
        const coolGuard = thermalPaletteColor(clamp(0.18 + luma * 0.34, 0, 0.58), coldPalette);
        const guardAlpha = clamp((flatness - 0.35) * 0.38, 0, 0.28);
        tr = mixChannel(tr, coolGuard[0], guardAlpha);
        tg = mixChannel(tg, coolGuard[1], guardAlpha);
        tb = mixChannel(tb, coolGuard[2], guardAlpha);
      }
      r = mixChannel(r, tr, thermalAmount);
      g = mixChannel(g, tg, thermalAmount);
      b = mixChannel(b, tb, thermalAmount);
    }

    if (thermalStudioModel.active) {
      const studioColor = thermalStudioBandColor(mappedLuma, thermalStudioModel);
      if (studioColor) {
        const [sr, sg, sb, alpha] = studioColor;
        const detailBoost = clamp(0.68 + localTexture * 0.3 + gradientEdge * 0.24, 0.5, 1.18);
        r = mixChannel(r, sr, alpha * detailBoost);
        g = mixChannel(g, sg, alpha * detailBoost);
        b = mixChannel(b, sb, alpha * detailBoost);
      }
    }

    if (xlsAmount) {
      const cold = thermalPaletteColor(1 - mappedLuma, "xls");
      r = mixChannel(r, cold[0], xlsAmount * 0.62);
      g = mixChannel(g, cold[1], xlsAmount * 0.62);
      b = mixChannel(b, cold[2], xlsAmount * 0.62);
      r = mixChannel(r, 255 - r, xlsAmount * 0.16);
      g = mixChannel(g, 255 - g, xlsAmount * 0.16);
      b = mixChannel(b, 255 - b, xlsAmount * 0.16);
    }

    if (colorBalanceAmount) {
      const balanceAlpha = clamp(0.18 + colorBalanceAmount * 0.72, 0, 0.9);
      const midMask = clamp(1 - Math.abs(luma - 0.5) * 2, 0, 1);
      r = r + (-cyanBalance + magentaBalance + yellowBalance) * 78 * balanceAlpha;
      g = g + (cyanBalance - magentaBalance + yellowBalance) * 78 * balanceAlpha;
      b = b + (cyanBalance + magentaBalance - yellowBalance) * 78 * balanceAlpha;
      if (midtoneLift) {
        const lift = midtoneLift * midMask * 92;
        r += lift;
        g += lift;
        b += lift;
      }
    }

    if (posterizeLevels) {
      const step = 255 / Math.max(1, posterizeLevels - 1);
      r = Math.round(r / step) * step;
      g = Math.round(g / step) * step;
      b = Math.round(b / step) * step;
    }

    data[index] = clamp(r, 0, 255);
    data[index + 1] = clamp(g, 0, 255);
    data[index + 2] = clamp(b, 0, 255);
  }
  context.putImageData(frame, 0, 0);
}

function buildSmartSignalProcessorSettings(context, width, height, settings, effect, smartSignalEnabled = {}, options = {}) {
  const enabled = normalizeSmartSignalToggles(smartSignalEnabled);
  if (!hasEnabledSmartSignalProcessor(enabled)) return settings;
  const frameSignals = measureSmartSignalFrame(context, width, height, options);
  const next = { ...settings };
  const thermalLike = isThermalRenderMode(settings, effect);

  const addSetting = (key, amount) => {
    const range = settingRange(key);
    next[key] = Math.round(clamp(setting(next, key, DEFAULT_SETTINGS[key] ?? 0) + amount, range.min, range.max));
  };

  SMART_SIGNAL_PROCESSORS.forEach((processor) => {
    if (!enabled[processor.id]) return;
    const strength = smartSignalProcessorStrength(settings, processor) * (0.82 + frameSignals.contrast * 0.28 + frameSignals.edge * 0.22);
    const thermalBoost = thermalLike ? 1.28 : 0.82;
    if (processor.id === "depth") {
      addSetting("shadowDepth", 18 * strength);
      addSetting("localContrast", 14 * strength);
      addSetting("negativeDepth", 10 * strength);
      addSetting("thermalContour", 8 * strength * thermalBoost);
    } else if (processor.id === "field") {
      addSetting("lightWrap", 12 * strength);
      addSetting("auraBloom", 10 * strength);
      addSetting("colorSeparation", 7 * strength);
    } else if (processor.id === "range") {
      addSetting("hdrRange", 18 * strength);
      addSetting("highlightRecovery", 15 * strength);
      addSetting("shadows", -10 * strength);
      addSetting("whites", 8 * strength);
    } else if (processor.id === "metricMapping") {
      addSetting("posterize", 12 * strength);
      addSetting("thermalContour", 14 * strength * thermalBoost);
      addSetting("edgeEnhance", 10 * strength);
      addSetting("colorSeparation", 9 * strength);
    } else if (processor.id === "weight") {
      addSetting("contrast", 12 * strength);
      addSetting("saturation", 10 * strength);
      addSetting("vibrance", 12 * strength);
      addSetting("blackPoint", -8 * strength);
    } else if (processor.id === "details") {
      addSetting("detailBoost", 16 * strength);
      addSetting("fineSharpen", 14 * strength);
      addSetting("clarity", 13 * strength);
      addSetting("texture", 11 * strength);
    } else if (processor.id === "midtones") {
      addSetting("midtoneLift", 16 * strength);
      addSetting("midtoneContrast", 15 * strength);
      addSetting("gamma", -9 * strength);
      addSetting("ambientLift", 7 * strength);
    } else if (processor.id === "invert") {
      addSetting("spectralInvert", 16 * strength);
      addSetting("lumaInvert", 12 * strength);
      addSetting("channelInvert", 8 * strength);
      addSetting("colorSeparation", 7 * strength);
    } else if (processor.id === "structure") {
      addSetting("structure", 18 * strength);
      addSetting("edgeEnhance", 16 * strength);
      addSetting("localContrast", 13 * strength);
      addSetting("dehaze", 8 * strength);
    } else if (processor.id === "blackpoint") {
      addSetting("blackPoint", -18 * strength);
      addSetting("blacks", -15 * strength);
      addSetting("shadowCrush", 13 * strength);
      addSetting("darkEdgeBlackClamp", 10 * strength);
    } else if (processor.id === "whitepoint") {
      addSetting("whitePoint", 16 * strength);
      addSetting("whites", 14 * strength);
      addSetting("highlightRecovery", 10 * strength);
      addSetting("specularControl", -8 * strength);
    } else if (processor.id === "lift") {
      addSetting("ambientLift", 16 * strength);
      addSetting("brightness", 6 * strength);
      addSetting("shadows", 12 * strength);
      addSetting("nearIrBoost", 7 * strength);
    } else if (processor.id === "amplify") {
      addSetting("contrast", 12 * strength);
      addSetting("saturation", 14 * strength);
      addSetting("glowStrength", 9 * strength);
      addSetting("thermalBlend", 10 * strength * thermalBoost);
    } else if (processor.id === "exposure") {
      addSetting("exposure", 13 * strength);
      addSetting("microExposure", 16 * strength);
      addSetting("highlightRecovery", 9 * strength);
      addSetting("hdrRange", 8 * strength);
    } else if (processor.id === "isolateGroupedPixels") {
      const dwtSensitivity = smartSignalSetting(settings, processor, "DwtSensitivity") / 100;
      const noiseLift =
        smartSignalSetting(settings, processor, "GrainNoise") +
        smartSignalSetting(settings, processor, "SpeckleNoise") +
        smartSignalSetting(settings, processor, "BandingNoise") +
        smartSignalSetting(settings, processor, "BlockNoise") +
        smartSignalSetting(settings, processor, "ChromaNoise") +
        smartSignalSetting(settings, processor, "HotPixelNoise");
      const noisePressure = clamp(noiseLift / 600, 0, 1.2);
      addSetting("posterize", 18 * strength * (1 + dwtSensitivity * 0.38));
      addSetting("noiseReduction", 16 * strength * (1 + noisePressure * 0.42));
      addSetting("thermalContour", 12 * strength * thermalBoost * (1 + dwtSensitivity * 0.28));
      addSetting("colorSeparation", 13 * strength * (1 + noisePressure * 0.25));
      addSetting("clarity", 8 * strength * (1 + dwtSensitivity * 0.22));
      addSetting("edgeEnhance", 9 * strength * (1 + dwtSensitivity * 0.2));
    }
  });

  return next;
}

function measureSmartSignalFrame(context, width, height, options = {}) {
  if (!context?.canvas || !width || !height) return { mean: 0.5, contrast: 0.35, edge: 0.25, saturation: 0.35, dark: 0.35, bright: 0.35 };
  const pixelBudget = Math.min(options.pixelBudget || SMART_SIGNAL_PIXEL_BUDGET, SMART_SIGNAL_PIXEL_BUDGET);
  const scale = width * height > pixelBudget ? Math.sqrt(pixelBudget / (width * height)) : 1;
  const workWidth = Math.max(1, Math.round(width * scale));
  const workHeight = Math.max(1, Math.round(height * scale));
  let frame;
  try {
    if (scale < 1) {
      smartSignalWorkCanvas ||= document.createElement("canvas");
      if (smartSignalWorkCanvas.width !== workWidth) smartSignalWorkCanvas.width = workWidth;
      if (smartSignalWorkCanvas.height !== workHeight) smartSignalWorkCanvas.height = workHeight;
      const workContext = smartSignalWorkCanvas.getContext("2d", { alpha: false, willReadFrequently: true });
      if (!workContext) return { mean: 0.5, contrast: 0.35, edge: 0.25, saturation: 0.35, dark: 0.35, bright: 0.35 };
      workContext.drawImage(context.canvas, 0, 0, width, height, 0, 0, workWidth, workHeight);
      frame = workContext.getImageData(0, 0, workWidth, workHeight);
    } else {
      frame = context.getImageData(0, 0, width, height);
    }
  } catch {
    return { mean: 0.5, contrast: 0.35, edge: 0.25, saturation: 0.35, dark: 0.35, bright: 0.35 };
  }
  const data = frame.data;
  let lumaTotal = 0;
  let contrastTotal = 0;
  let edgeTotal = 0;
  let saturationTotal = 0;
  let dark = 0;
  let bright = 0;
  const count = Math.max(1, workWidth * workHeight);
  for (let index = 0; index < data.length; index += 4) {
    const r = data[index] / 255;
    const g = data[index + 1] / 255;
    const b = data[index + 2] / 255;
    const luma = r * 0.2126 + g * 0.7152 + b * 0.0722;
    lumaTotal += luma;
    contrastTotal += Math.abs(luma - 0.5) * 2;
    saturationTotal += Math.max(r, g, b) - Math.min(r, g, b);
    if (luma < 0.3) dark += 1;
    if (luma > 0.72) bright += 1;
    const pixel = index / 4;
    const x = pixel % workWidth;
    const y = Math.floor(pixel / workWidth);
    const rightIndex = x < workWidth - 1 ? index + 4 : index;
    const downIndex = y < workHeight - 1 ? index + workWidth * 4 : index;
    const rightLuma = (data[rightIndex] * 0.2126 + data[rightIndex + 1] * 0.7152 + data[rightIndex + 2] * 0.0722) / 255;
    const downLuma = (data[downIndex] * 0.2126 + data[downIndex + 1] * 0.7152 + data[downIndex + 2] * 0.0722) / 255;
    edgeTotal += Math.abs(rightLuma - luma) + Math.abs(downLuma - luma);
  }
  return {
    mean: clamp(lumaTotal / count, 0, 1),
    contrast: clamp(contrastTotal / count, 0, 1),
    edge: clamp(edgeTotal / count * 4, 0, 1),
    saturation: clamp(saturationTotal / count, 0, 1),
    dark: clamp(dark / count, 0, 1),
    bright: clamp(bright / count, 0, 1)
  };
}

function applySmartDarkEdgeAmplifier(context, width, height, settings, effect, enabled = false, options = {}) {
  if (!enabled || !context.canvas || !width || !height) return;
  const intensity = smartDarkEdgeSignal(settings, effect);
  if (intensity <= 0.01) return;
  const pixelBudget = Math.min(options.pixelBudget || SMART_SIGNAL_PIXEL_BUDGET, SMART_SIGNAL_PIXEL_BUDGET);
  if (width * height > pixelBudget) {
    const scale = Math.sqrt(pixelBudget / (width * height));
    const workWidth = Math.max(1, Math.round(width * scale));
    const workHeight = Math.max(1, Math.round(height * scale));
    smartDarkEdgeWorkCanvas ||= document.createElement("canvas");
    if (smartDarkEdgeWorkCanvas.width !== workWidth) smartDarkEdgeWorkCanvas.width = workWidth;
    if (smartDarkEdgeWorkCanvas.height !== workHeight) smartDarkEdgeWorkCanvas.height = workHeight;
    const workContext = smartDarkEdgeWorkCanvas.getContext("2d", { alpha: false, willReadFrequently: true });
    if (!workContext) return;
    workContext.save();
    workContext.imageSmoothingEnabled = true;
    workContext.imageSmoothingQuality = "high";
    workContext.clearRect(0, 0, workWidth, workHeight);
    workContext.drawImage(context.canvas, 0, 0, width, height, 0, 0, workWidth, workHeight);
    workContext.restore();
    applySmartDarkEdgeAmplifierToContext(workContext, workWidth, workHeight, settings, effect, intensity);
    context.save();
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.clearRect(0, 0, width, height);
    context.drawImage(smartDarkEdgeWorkCanvas, 0, 0, workWidth, workHeight, 0, 0, width, height);
    context.restore();
    return;
  }
  applySmartDarkEdgeAmplifierToContext(context, width, height, settings, effect, intensity);
}

function applySmartDarkEdgeAmplifierToContext(context, width, height, settings, effect, intensity) {
  let frame;
  try {
    frame = context.getImageData(0, 0, width, height);
  } catch {
    return;
  }
  const data = frame.data;
  const source = new Uint8ClampedArray(data);
  const amount = clamp(setting(settings, "darkEdgeAmount") / 100, 0, 1);
  const sensitivity = clamp(0.72 + setting(settings, "darkEdgeSensitivity") / 72, 0.72, 2.12);
  const spread = clamp(setting(settings, "darkEdgeSpread") / 100, 0, 1);
  const edgeContrast = clamp(setting(settings, "darkEdgeContrast") / 100, 0, 1);
  const shadowDepth = clamp(setting(settings, "darkEdgeShadowDepth") / 100, 0, 1);
  const blackClamp = clamp(setting(settings, "darkEdgeBlackClamp") / 100, 0, 1);
  const detailAmplify = clamp(setting(settings, "darkEdgeDetailAmplify") / 100, 0, 1);
  const haloCut = clamp(setting(settings, "darkEdgeHaloCut") / 100, 0, 1);
  const thermalBind = clamp(setting(settings, "darkEdgeThermalBind") / 100, 0, 1);
  const microGrain = clamp(setting(settings, "darkEdgeMicroGrain") / 100, 0, 1);
  const threshold = clamp(0.3 - setting(settings, "darkEdgeSensitivity") / 420, 0.06, 0.34);
  const thermalLike = isThermalEffect(settings, effect);
  const lumaAt = (pixelIndex) =>
    (source[pixelIndex] * 0.2126 + source[pixelIndex + 1] * 0.7152 + source[pixelIndex + 2] * 0.0722) / 255;

  for (let index = 0; index < data.length; index += 4) {
    const pixel = index / 4;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const luma = lumaAt(index);
    const left = x > 0 ? lumaAt(index - 4) : luma;
    const right = x < width - 1 ? lumaAt(index + 4) : luma;
    const up = y > 0 ? lumaAt(index - width * 4) : luma;
    const down = y < height - 1 ? lumaAt(index + width * 4) : luma;
    const twoLeft = x > 1 ? lumaAt(index - 8) : left;
    const twoRight = x < width - 2 ? lumaAt(index + 8) : right;
    const twoUp = y > 1 ? lumaAt(index - width * 8) : up;
    const twoDown = y < height - 2 ? lumaAt(index + width * 8) : down;
    const localAverage = (luma * 2 + left + right + up + down + (twoLeft + twoRight + twoUp + twoDown) * spread) / (6 + 4 * spread);
    const gradientEdge = clamp(Math.abs(right - left) + Math.abs(down - up), 0, 1);
    const wideEdge = clamp(Math.abs(twoRight - twoLeft) + Math.abs(twoDown - twoUp), 0, 1);
    const localDetail = clamp(Math.abs(luma - localAverage) * (2.3 + detailAmplify * 2.2) + gradientEdge * (1.05 + spread) + wideEdge * spread * 0.7, 0, 1);
    const edgeMask = clamp((gradientEdge * 1.2 + wideEdge * spread * 0.72 + localDetail * 0.52 - threshold) * sensitivity, 0, 1);
    const shadowMask = clamp((0.62 - luma) * (0.72 + shadowDepth), 0, 1);
    const brightHaloMask = clamp((luma - localAverage) * 2.2 + (luma - 0.68) * 0.8, 0, 1);
    const darken = clamp(
      edgeMask * amount * (0.48 + edgeContrast * 0.34 + shadowDepth * 0.28) +
        edgeMask * shadowMask * (0.32 + blackClamp * 0.44) +
        brightHaloMask * haloCut * 0.26,
      0,
      0.94
    );
    const contrastPush = 1 + edgeMask * edgeContrast * 1.12 * intensity;
    let r = data[index];
    let g = data[index + 1];
    let b = data[index + 2];
    const y709 = r * 0.2126 + g * 0.7152 + b * 0.0722;
    r = y709 + (r - y709) * contrastPush;
    g = y709 + (g - y709) * contrastPush;
    b = y709 + (b - y709) * contrastPush;
    const channelDarken = darken * (0.74 + blackClamp * 0.34) * intensity;
    r *= 1 - channelDarken;
    g *= 1 - channelDarken * (0.94 + shadowDepth * 0.08);
    b *= 1 - channelDarken * (0.9 + shadowDepth * 0.14);
    if (thermalLike && thermalBind) {
      const thermalShadow = thermalPaletteColor(clamp(0.06 + edgeMask * 0.18 + shadowMask * 0.08, 0, 0.36), "black-hot");
      const bindAlpha = clamp(edgeMask * thermalBind * 0.42, 0, 0.42);
      r = mixChannel(r, thermalShadow[0], bindAlpha);
      g = mixChannel(g, thermalShadow[1], bindAlpha);
      b = mixChannel(b, thermalShadow[2], bindAlpha);
    }
    if (microGrain && edgeMask) {
      const grainSeed = (((x + 1) * 73856093) ^ ((y + 1) * 19349663)) >>> 0;
      const grain = ((grainSeed & 255) / 255 - 0.5) * 44 * microGrain * edgeMask * intensity;
      r += grain;
      g += grain * 0.88;
      b += grain * 0.76;
    }
    data[index] = clamp(r, 0, 255);
    data[index + 1] = clamp(g, 0, 255);
    data[index + 2] = clamp(b, 0, 255);
  }
  context.putImageData(frame, 0, 0);
}

function smartDarkEdgeSignal(settings = {}, effect = {}) {
  const sliderSignal = SMART_DARK_EDGE_ADJUSTMENTS.reduce((total, [key]) => total + setting(settings, key), 0) / (SMART_DARK_EDGE_ADJUSTMENTS.length * 100);
  const effectSignal =
    setting(settings, "edgeEnhance") * 0.0025 +
    setting(settings, "clarity") * 0.0016 +
    setting(settings, "dehaze") * 0.0016 +
    setting(settings, "thermalContour") * 0.002 +
    setting(settings, "heatEdge") * 0.002;
  const presetSignal = effect?.category?.includes("Thermal") || effect?.category === "XLS Camera" ? 0.12 : 0;
  return clamp(sliderSignal * 1.15 + effectSignal + presetSignal, 0, 1.45);
}

function buildThermalStudioModel(settings = {}) {
  const master = clamp(setting(settings, "thermalStudioMaster") / 100, 0, 1);
  if (!master) return { active: false, bands: [] };
  const bands = THERMAL_STUDIO_BANDS.map((band) => {
    const strength = clamp(setting(settings, `thermalHotspot${band.letter}Strength`) / 100, 0, 1);
    if (!strength) return null;
    return {
      ...band,
      strength,
      width: clamp(setting(settings, `thermalHotspot${band.letter}Width`, 12) / 100, 0.02, 0.4),
      colorId: settings[`thermalHotspot${band.letter}Color`] || THERMAL_STUDIO_COLOR_DEFAULTS[`thermalHotspot${band.letter}Color`]
    };
  }).filter(Boolean);
  return {
    active: Boolean(bands.length),
    master,
    bands
  };
}

function thermalStudioBandColor(value, model) {
  if (!model?.active) return null;
  let best = null;
  let bestScore = 0;
  model.bands.forEach((band) => {
    const distance = Math.abs(value - band.target);
    const score = clamp(1 - distance / Math.max(0.02, band.width), 0, 1) * band.strength;
    if (score > bestScore) {
      bestScore = score;
      best = band;
    }
  });
  if (!best || bestScore <= 0.01) return null;
  const color = thermalStudioColorForBand(best, value);
  return [...color, clamp(model.master * bestScore * 0.82, 0, 0.92)];
}

function thermalStudioColorForBand(band, value) {
  const option = THERMAL_STUDIO_COLOR_LOOKUP.get(band.colorId) || THERMAL_STUDIO_COLOR_LOOKUP.get("thermal-rgb");
  if (option?.palette) return thermalPaletteColor(value, option.palette);
  return option?.color || [255, 255, 255];
}

function hasSpatialRecognitionSignal(settings = {}, effect = {}, enabled = false) {
  return buildSpatialRecognitionModel(settings, effect, enabled).active;
}

function buildSpatialRecognitionModel(settings = {}, effect = {}, enabled = false, options = {}) {
  const master = enabled ? clamp(setting(settings, "spatialMaster") / 100, 0, 1) : 0;
  const thermalBias = isThermalRenderMode(settings, effect) ? 0.16 : 0;
  const edgeBias = effectSetting(settings, "edgeEnhance", 0, PIXEL_EFFECT_GAIN) / 220;
  const thermalLock = clamp(setting(settings, "spatialThermalLock") / 100 + thermalBias * 0.8, 0, 1.35);
  const meshForm = SPATIAL_MESH_FORM_LOOKUP.has(settings?.spatialMeshForm) ? settings.spatialMeshForm : DEFAULT_SETTINGS.spatialMeshForm;
  const visualInterfaceOpacity =
    options.spatialVisualInterfaceEnabled === false ? 0 : clamp(setting(settings, "spatialInterfaceOpacity") / 100, 0, 1);
  const sensitivityBoost =
    (setting(settings, "spatialMicroContrast") +
      setting(settings, "spatialSubpixelScan") +
      setting(settings, "spatialSubtleReveal") +
      setting(settings, "spatialGradientLift") * 0.45 +
      setting(settings, "spatialSpecularSense") +
      setting(settings, "spatialShadowSense")) /
    1500;
  return {
    active: master > 0.01,
    master,
    meshForm,
    visualInterfaceOpacity,
    sensitivity: clamp(setting(settings, "spatialSensitivity") / 100 + thermalBias * 0.24 + sensitivityBoost, 0, 1.55),
    depth: clamp(setting(settings, "spatialDepth") / 100 + thermalBias + thermalLock * 0.12, 0, 1.65),
    field: clamp(setting(settings, "spatialField") / 100 + setting(settings, "spatialVectorTension") / 420, 0, 1.35),
    range: clamp(setting(settings, "spatialRange") / 100 + setting(settings, "spatialObjectCohesion") / 460, 0, 1.45),
    pointDensity: clamp(setting(settings, "spatialPointDensity") / 100 + setting(settings, "spatialSubpixelScan") / 420, 0, 1.25),
    edgeWeight: clamp(setting(settings, "spatialEdgeWeight") / 100 + edgeBias + setting(settings, "spatialDepthSharpen") / 420, 0, 1.7),
    meshOpacity: clamp(setting(settings, "spatialMeshOpacity") / 100, 0, 1),
    contourOpacity: clamp(setting(settings, "spatialContourOpacity") / 100 + setting(settings, "spatialContourDensity") / 360, 0, 1.35),
    parallax: clamp(setting(settings, "spatialParallax") / 100 + setting(settings, "spatialMotionTrace") / 520, 0, 1.22),
    colorSplit: clamp(setting(settings, "spatialColorSplit") / 100 + setting(settings, "spatialColorDepth") / 310, 0, 1.55),
    smoothing: clamp(setting(settings, "spatialSmoothing") / 100 + setting(settings, "spatialDepthBlur") / 480, 0, 1.15),
    microContrast: clamp(setting(settings, "spatialMicroContrast") / 100, 0, 1.25),
    gradientLift: clamp(setting(settings, "spatialGradientLift") / 100, 0, 1.2),
    nearFieldBias: clamp(setting(settings, "spatialNearFieldBias") / 100, 0, 1.25),
    farFieldBias: clamp(setting(settings, "spatialFarFieldBias") / 100, 0, 1.25),
    occlusion: clamp(setting(settings, "spatialOcclusion") / 100, 0, 1.3),
    depthSharpen: clamp(setting(settings, "spatialDepthSharpen") / 100, 0, 1.35),
    depthBlur: clamp(setting(settings, "spatialDepthBlur") / 100, 0, 1),
    contourDensity: clamp(setting(settings, "spatialContourDensity") / 100, 0, 1.4),
    contourThreshold: clamp(setting(settings, "spatialContourThreshold") / 100, 0, 1),
    vectorTension: clamp(setting(settings, "spatialVectorTension") / 100, 0, 1.25),
    surfaceNormal: clamp(setting(settings, "spatialSurfaceNormal") / 100, 0, 1.35),
    specularSense: clamp(setting(settings, "spatialSpecularSense") / 100, 0, 1.35),
    shadowSense: clamp(setting(settings, "spatialShadowSense") / 100, 0, 1.35),
    highlightSense: clamp(setting(settings, "spatialHighlightSense") / 100, 0, 1.35),
    colorDepth: clamp(setting(settings, "spatialColorDepth") / 100, 0, 1.45),
    noiseReject: clamp(setting(settings, "spatialNoiseReject") / 100, 0, 1),
    objectCohesion: clamp(setting(settings, "spatialObjectCohesion") / 100, 0, 1.4),
    motionTrace: clamp(setting(settings, "spatialMotionTrace") / 100, 0, 1.2),
    subpixelScan: clamp(setting(settings, "spatialSubpixelScan") / 100, 0, 1.35),
    subtleReveal: clamp(
      setting(settings, "spatialSubtleReveal") / 100 + setting(settings, "spatialSubpixelScan") / 360 + setting(settings, "spatialGradientLift") / 520,
      0,
      1.55
    ),
    livePointCloud: clamp(setting(settings, "spatialLivePointCloud") / 100, 0, 1.35),
    tinOpacity: clamp(setting(settings, "spatialTinOpacity") / 100, 0, 1.25),
    tinWire: clamp(setting(settings, "spatialTinWire") / 100, 0, 1.25),
    cellSize: clamp(setting(settings, "spatialCellSize") / 100, 0, 1),
    cellDepth: clamp(setting(settings, "spatialCellDepth") / 100, 0, 1.45),
    surfaceMap: clamp(setting(settings, "spatialSurfaceMap") / 100, 0, 1.45),
    noiseMap: clamp(setting(settings, "spatialNoiseMap") / 100, 0, 1.45),
    gridWarp: clamp(setting(settings, "spatialGridWarp") / 100, 0, 1.25),
    pointLift: clamp(setting(settings, "spatialPointLift") / 100, 0, 1.35),
    facetSmoothing: clamp(setting(settings, "spatialFacetSmoothing") / 100, 0, 1),
    equationAdherence: clamp(setting(settings, "spatialEquationAdherence") / 100, 0, 1.35),
    equationMetronymics: clamp(setting(settings, "spatialEquationMetronymics") / 100, 0, 1.35),
    thermalLock,
    palette: settings?.thermalPalette || "full-range-rgb"
  };
}

function applySpatialRecognitionEffects(context, width, height, settings, effect, enabled = false, options = {}) {
  const model = buildSpatialRecognitionModel(settings, effect, enabled, options);
  if (!model.active || !context?.canvas || !width || !height) return;
  const pixelBudget = Math.min(options.pixelBudget || SPATIAL_RECOGNITION_PIXEL_BUDGET, SPATIAL_RECOGNITION_PIXEL_BUDGET);
  if (width * height > pixelBudget) {
    const scale = Math.sqrt(pixelBudget / (width * height));
    const workWidth = Math.max(1, Math.round(width * scale));
    const workHeight = Math.max(1, Math.round(height * scale));
    spatialRecognitionWorkCanvas ||= document.createElement("canvas");
    if (spatialRecognitionWorkCanvas.width !== workWidth) spatialRecognitionWorkCanvas.width = workWidth;
    if (spatialRecognitionWorkCanvas.height !== workHeight) spatialRecognitionWorkCanvas.height = workHeight;
    const workContext = spatialRecognitionWorkCanvas.getContext("2d", { alpha: false, willReadFrequently: true });
    if (!workContext) return;
    workContext.save();
    workContext.imageSmoothingEnabled = true;
    workContext.imageSmoothingQuality = "high";
    workContext.clearRect(0, 0, workWidth, workHeight);
    workContext.drawImage(context.canvas, 0, 0, width, height, 0, 0, workWidth, workHeight);
    workContext.restore();
    applySpatialRecognitionEffectsToContext(workContext, workWidth, workHeight, settings, effect, model);
    context.save();
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.clearRect(0, 0, width, height);
    context.drawImage(spatialRecognitionWorkCanvas, 0, 0, workWidth, workHeight, 0, 0, width, height);
    context.restore();
    return;
  }
  applySpatialRecognitionEffectsToContext(context, width, height, settings, effect, model);
}

function applySpatialRecognitionEffectsToContext(context, width, height, settings, effect, model) {
  let frame;
  try {
    frame = context.getImageData(0, 0, width, height);
  } catch {
    return;
  }
  const data = frame.data;
  const source = new Uint8ClampedArray(data);
  const lumaAt = (pixelIndex) =>
    (source[pixelIndex] * 0.2126 + source[pixelIndex + 1] * 0.7152 + source[pixelIndex + 2] * 0.0722) / 255;
  for (let index = 0; index < data.length; index += 4) {
    const pixel = index / 4;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const luma = lumaAt(index);
    const left = x > 0 ? lumaAt(index - 4) : luma;
    const right = x < width - 1 ? lumaAt(index + 4) : luma;
    const up = y > 0 ? lumaAt(index - width * 4) : luma;
    const down = y < height - 1 ? lumaAt(index + width * 4) : luma;
    const upLeft = x > 0 && y > 0 ? lumaAt(index - width * 4 - 4) : luma;
    const downRight = x < width - 1 && y < height - 1 ? lumaAt(index + width * 4 + 4) : luma;
    const wideStep = 2 + Math.round(model.subtleReveal * 3 + model.subpixelScan * 2);
    const leftWide = x > wideStep ? lumaAt(index - wideStep * 4) : left;
    const rightWide = x < width - 1 - wideStep ? lumaAt(index + wideStep * 4) : right;
    const upWide = y > wideStep ? lumaAt(index - width * 4 * wideStep) : up;
    const downWide = y < height - 1 - wideStep ? lumaAt(index + width * 4 * wideStep) : down;
    const localAverage = (luma * 2 + left + right + up + down) / 6;
    const wideAverage = (luma * 2 + leftWide + rightWide + upWide + downWide) / 6;
    const localDeviation = Math.abs(luma - localAverage);
    const wideDeviation = Math.abs(luma - wideAverage);
    const diagonalGradient = Math.abs(downRight - upLeft);
    const wideGradient = Math.abs(rightWide - leftWide) + Math.abs(downWide - upWide);
    const subtleStructure = clamp(
      (wideDeviation * 3.4 + wideGradient * 0.86 + diagonalGradient * 0.38 + Math.abs(localAverage - wideAverage) * 2.2) *
        (0.58 + model.subtleReveal * 1.28),
      0,
      1
    );
    const normalSignal = clamp(Math.abs((right - left) - (down - up)) + diagonalGradient * 0.75, 0, 1);
    const rawEdge =
      Math.abs(right - left) +
      Math.abs(down - up) +
      localDeviation * (1.8 + model.microContrast * 1.4) +
      wideGradient * model.subtleReveal * 0.62 +
      wideDeviation * model.subtleReveal * 1.35 +
      subtleStructure * 0.28;
    const noiseRejectCeiling = clamp(0.72 - model.subtleReveal * 0.22, 0.42, 0.72);
    const noiseGate =
      1 - clamp(Math.max(0, localDeviation * 2.4 - rawEdge * 0.22 - subtleStructure * 0.12) * model.noiseReject, 0, noiseRejectCeiling);
    const edge = clamp((rawEdge + normalSignal * model.surfaceNormal * 0.55) * noiseGate, 0, 1);
    const radial = distanceFromCenter(x / Math.max(1, width - 1), y / Math.max(1, height - 1));
    const verticalDepth = 1 - y / Math.max(1, height - 1);
    const nearField = Math.pow(1 - radial, 1.35) * model.nearFieldBias;
    const farField = Math.pow(radial, 1.12) * model.farFieldBias;
    const specularSignal = clamp(Math.max(0, luma - 0.58) * model.specularSense * 2.65, 0, 1);
    const shadowSignal = clamp(Math.max(0, 0.42 - luma) * model.shadowSense * 2.55, 0, 1);
    const highlightSignal = clamp(Math.max(0, luma - 0.48) * model.highlightSense * 2.05, 0, 1);
    const lowLightSignal = clamp((0.62 - luma) * model.subtleReveal * 0.9 + shadowSignal * 0.22 + subtleStructure * 0.18, 0, 1);
    const contourPhase = Math.abs(
      Math.sin(
        (luma * (7.5 + model.contourDensity * 8.8) +
          edge * 4.2 +
          subtleStructure * model.subtleReveal * 1.4 +
          model.range * 2.1 +
          normalSignal * model.vectorTension) *
          Math.PI
      )
    );
    const pseudoDepth = clamp(
      luma * (0.42 + model.range * 0.36) +
        edge * model.edgeWeight * (0.42 + model.depthSharpen * 0.34) +
        localDeviation * model.depth * 1.22 +
        subtleStructure * model.subtleReveal * 0.56 +
        lowLightSignal * 0.22 +
        normalSignal * model.surfaceNormal * 0.32 +
        verticalDepth * model.field * (0.16 + model.gradientLift * 0.22) +
        nearField * 0.18 -
        farField * 0.14 +
        specularSignal * 0.12 -
        shadowSignal * model.occlusion * 0.18 -
        radial * model.field * 0.14 +
        model.sensitivity * 0.12,
      0,
      1
    );
    const [dr, dg, db] = spatialRecognitionDepthColor(pseudoDepth, model);
    const thresholdGate = clamp((edge + localDeviation * 1.8 + subtleStructure * 0.72 + normalSignal * 0.8) - model.contourThreshold * 0.32, 0, 1);
    const contourMask = clamp((1 - contourPhase) * model.contourOpacity * thresholdGate * (0.38 + edge * 0.95), 0, 1);
    const cohesion = clamp(1 + model.objectCohesion * (0.34 - localDeviation * 0.22), 0.78, 1.38);
    const depthMask = clamp(
      (edge * 0.42 +
        localDeviation * 1.58 +
        subtleStructure * 0.74 +
        lowLightSignal * 0.24 +
        contourMask * 0.68 +
        specularSignal * 0.18 +
        shadowSignal * 0.16) *
        model.master *
        cohesion,
      0,
      0.95
    );
    const alpha = clamp(
      depthMask * (0.26 + model.depth * 0.34 + model.sensitivity * 0.26 + model.subtleReveal * 0.18 + model.thermalLock * 0.16),
      0,
      0.78
    );
    let r = data[index];
    let g = data[index + 1];
    let b = data[index + 2];
    r = mixChannel(r, dr, alpha * (0.96 + model.colorDepth * 0.22));
    g = mixChannel(g, dg, alpha * (0.92 + model.colorDepth * 0.18));
    b = mixChannel(b, db, alpha * (0.88 + model.colorDepth * 0.14));

    if (model.microContrast > 0.01) {
      const contrastLift = clamp(
        edge * model.microContrast * model.master * 1.15 +
          subtleStructure * model.subtleReveal * model.master * 0.72 +
          normalSignal * model.surfaceNormal * 0.32,
        0,
        1.6
      );
      r = (r - 128) * (1 + contrastLift) + 128;
      g = (g - 128) * (1 + contrastLift * 0.9) + 128;
      b = (b - 128) * (1 + contrastLift * 0.82) + 128;
    }

    if (model.occlusion > 0.01) {
      const darken = clamp((shadowSignal + farField * 0.22) * model.occlusion * model.master * 68, 0, 96);
      r -= darken;
      g -= darken * 0.9;
      b -= darken * 0.82;
    }

    if (model.colorSplit > 0.01) {
      const split = clamp((edge + contourMask + specularSignal * 0.45) * model.colorSplit * model.master * (42 + model.colorDepth * 36), 0, 72);
      r += split;
      g += split * Math.sin((x / Math.max(1, width)) * Math.PI + model.motionTrace) * (0.28 + model.vectorTension * 0.2);
      b -= split * (0.44 + model.thermalLock * 0.18);
    }

    if (model.smoothing > 0.01) {
      const smoothAlpha = clamp(model.smoothing * (0.06 + (1 - edge) * 0.12 + model.depthBlur * 0.08) * model.master, 0, 0.28);
      const localGray = localAverage * 255;
      r = mixChannel(r, localGray, smoothAlpha);
      g = mixChannel(g, localGray, smoothAlpha * 0.9);
      b = mixChannel(b, localGray, smoothAlpha * 0.8);
    }

    if (model.gradientLift > 0.01) {
      const lift =
        (verticalDepth - radial * 0.36 + nearField * 0.2 - farField * 0.16 + highlightSignal * 0.22 + subtleStructure * 0.18) *
        model.gradientLift *
        model.master *
        34;
      r += lift * 0.62;
      g += lift * 0.82;
      b += lift;
    }

    data[index] = clamp(r, 0, 255);
    data[index + 1] = clamp(g, 0, 255);
    data[index + 2] = clamp(b, 0, 255);
  }
  const meshAlpha = clamp(model.meshOpacity * model.visualInterfaceOpacity * model.master * 0.32, 0, 0.42);
  const pointAlpha = clamp(model.pointDensity * model.visualInterfaceOpacity * model.master * (0.28 + model.subpixelScan * 0.12), 0, 0.46);
  context.putImageData(frame, 0, 0);

  if (model.visualInterfaceOpacity > 0.01 && (meshAlpha > 0.01 || pointAlpha > 0.01 || hasLiveSpatialCellLayerSignal(model))) {
    const cellField = buildLiveSpatialCellField(width, height, source, model);
    paintLiveSpatialPointCloudAndTin(context, cellField, model);
    paintSyncedSpatialCellMesh(context, cellField, model, meshAlpha);
    paintSyncedSpatialCellSamples(context, cellField, model, pointAlpha);
  }
}

function hasLiveSpatialCellLayerSignal(model) {
  return model.livePointCloud > 0.01 || model.tinOpacity > 0.01 || model.tinWire > 0.01;
}

function buildLiveSpatialCellField(width, height, source, model) {
  const pointCloudAlpha = clamp(model.livePointCloud * model.visualInterfaceOpacity * model.master * (0.34 + model.subpixelScan * 0.16), 0, 0.58);
  const tinAlpha = clamp(model.tinOpacity * model.visualInterfaceOpacity * model.master * (0.28 + model.surfaceMap * 0.12 + model.cellDepth * 0.08), 0, 0.48);
  const wireAlpha = clamp(model.tinWire * model.visualInterfaceOpacity * model.master * (0.22 + model.surfaceMap * 0.08), 0, 0.42);
  const cellStep = Math.max(
    6,
    Math.round(
      32 -
        model.cellSize * 13 -
        model.pointDensity * 6 -
        model.livePointCloud * 5 -
        model.subpixelScan * 5 -
        model.subtleReveal * 4 -
        model.surfaceMap * 3
    )
  );
  const sampleRadius = Math.max(1, Math.round(cellStep * 0.45));
  const wideRadius = Math.max(sampleRadius + 1, Math.round(cellStep * (0.72 + model.subtleReveal * 0.45)));
  const rows = [];
  const safeIndex = (x, y) => (clamp(Math.round(y), 0, height - 1) * width + clamp(Math.round(x), 0, width - 1)) * 4;
  const lumaAt = (x, y) => {
    const index = safeIndex(x, y);
    return (source[index] * 0.2126 + source[index + 1] * 0.7152 + source[index + 2] * 0.0722) / 255;
  };

  for (let y = Math.round(cellStep * 0.5); y < height; y += cellStep) {
    const rowIndex = rows.length;
    const row = [];
    for (let x = Math.round(cellStep * 0.5); x < width; x += cellStep) {
      const columnIndex = row.length;
      const luma = lumaAt(x, y);
      const left = lumaAt(x - sampleRadius, y);
      const right = lumaAt(x + sampleRadius, y);
      const up = lumaAt(x, y - sampleRadius);
      const down = lumaAt(x, y + sampleRadius);
      const upLeft = lumaAt(x - sampleRadius, y - sampleRadius);
      const downRight = lumaAt(x + sampleRadius, y + sampleRadius);
      const leftWide = lumaAt(x - wideRadius, y);
      const rightWide = lumaAt(x + wideRadius, y);
      const upWide = lumaAt(x, y - wideRadius);
      const downWide = lumaAt(x, y + wideRadius);
      const localAverage = (luma * 2 + left + right + up + down) / 6;
      const wideAverage = (luma * 2 + leftWide + rightWide + upWide + downWide) / 6;
      const diagonal = Math.abs(downRight - upLeft);
      const wideGradient = Math.abs(rightWide - leftWide) + Math.abs(downWide - upWide);
      const subtle = clamp(
        (Math.abs(luma - wideAverage) * 3.15 + wideGradient * 0.82 + Math.abs(localAverage - wideAverage) * 2.05 + diagonal * 0.26) *
          (0.52 + model.subtleReveal * 1.34),
        0,
        1
      );
      const edge = clamp(Math.abs(right - left) + Math.abs(down - up) + wideGradient * model.subtleReveal * 0.55 + subtle * 0.28, 0, 1);
      const lowLight = clamp((0.62 - luma) * model.subtleReveal * 0.92 + subtle * 0.22, 0, 1);
      const noise = clamp(Math.abs(luma - localAverage) * (1.9 + model.noiseMap * 1.8) + diagonal * 0.42 + subtle * 0.54, 0, 1);
      const surface = clamp(Math.abs((right - left) - (down - up)) + diagonal * 0.78 + edge * 0.24 + subtle * 0.48, 0, 1);
      const radial = distanceFromCenter(x / Math.max(1, width - 1), y / Math.max(1, height - 1));
      const verticalDepth = 1 - y / Math.max(1, height - 1);
      const depth = clamp(
        luma * (0.32 + model.cellDepth * 0.48) +
          edge * model.edgeWeight * 0.36 +
          noise * model.noiseMap * 0.34 +
          surface * model.surfaceMap * 0.38 +
          subtle * model.subtleReveal * 0.54 +
          lowLight * 0.18 +
          verticalDepth * model.field * 0.16 -
          radial * model.range * 0.12 +
          model.sensitivity * 0.08,
        0,
        1
      );
      const warpPhase = (x * 0.017 + y * 0.013 + depth * 3.1) * (1 + model.motionTrace * 0.5);
      const warp = model.gridWarp * model.parallax * cellStep * (0.16 + depth * 0.34 + surface * 0.22);
      const lift = model.pointLift * cellStep * (0.12 + depth * 0.46 + noise * 0.18);
      const equationRhythm = Math.sin((columnIndex + rowIndex * 1.37) * (0.72 + model.equationMetronymics * 1.8) + depth * 4.1);
      const variableGate = clamp(depth * 0.42 + edge * 0.28 + subtle * 0.2 + noise * 0.18, 0, 1);
      const hexOffset =
        model.meshForm === "hexagonal" || (model.meshForm === "variable" && variableGate > 0.52)
          ? (rowIndex % 2 ? 0.42 : -0.12) * cellStep
          : 0;
      const irregularAmount =
        model.meshForm === "irregular"
          ? 1
          : model.meshForm === "variable"
            ? variableGate
            : model.meshForm === "equation-driven"
              ? 1 - model.equationAdherence * 0.72
              : 0;
      const equationAmount = model.meshForm === "equation-driven" ? model.equationMetronymics : 0;
      const formJitter = cellStep * (0.08 + model.gridWarp * 0.18 + model.subtleReveal * 0.08);
      const jitterX = Math.sin(warpPhase * 1.83 + rowIndex * 0.9) * formJitter * irregularAmount;
      const jitterY = Math.cos(warpPhase * 1.57 + columnIndex * 0.7) * formJitter * irregularAmount;
      const equationX = equationRhythm * cellStep * equationAmount * (0.08 + model.equationAdherence * 0.12);
      const equationY = Math.cos(equationRhythm + warpPhase * 0.6) * cellStep * equationAmount * 0.08;
      const px = clamp(x + hexOffset + Math.sin(warpPhase) * warp + jitterX + equationX, 0, width);
      const py = clamp(y + Math.cos(warpPhase * 0.9) * warp - lift + jitterY + equationY, 0, height);
      row.push({
        x: px,
        y: py,
        rowIndex,
        columnIndex,
        depth,
        edge,
        noise,
        surface,
        subtle,
        lowLight,
        color: spatialRecognitionDepthColor(depth, model)
      });
    }
    if (row.length) rows.push(row);
  }
  return { rows, cellStep, pointCloudAlpha, tinAlpha, wireAlpha };
}

function paintLiveSpatialPointCloudAndTin(context, cellField, model) {
  if (!cellField?.rows?.length || cellField.rows.length < 2 || cellField.rows[0].length < 2) return;
  const { rows, cellStep, pointCloudAlpha, tinAlpha, wireAlpha } = cellField;
  if (tinAlpha > 0.01) {
    context.save();
    context.globalCompositeOperation = "screen";
    for (let rowIndex = 0; rowIndex < rows.length - 1; rowIndex += 1) {
      const row = rows[rowIndex];
      const nextRow = rows[rowIndex + 1];
      const count = Math.min(row.length, nextRow.length) - 1;
      for (let column = 0; column < count; column += 1) {
        const p00 = row[column];
        const p10 = row[column + 1];
        const p01 = nextRow[column];
        const p11 = nextRow[column + 1];
        const triangleSignal =
          (p00.depth +
            p10.depth +
            p01.depth +
            p11.depth +
            (p00.subtle || 0) +
            (p10.subtle || 0) +
            (p01.subtle || 0) +
            (p11.subtle || 0)) /
          8;
        if (triangleSignal < 0.025) continue;
        if (Math.abs(p00.depth - p11.depth) > Math.abs(p10.depth - p01.depth)) {
          paintSpatialTinTriangle(context, [p00, p10, p01], tinAlpha, model);
          paintSpatialTinTriangle(context, [p10, p11, p01], tinAlpha, model);
        } else {
          paintSpatialTinTriangle(context, [p00, p10, p11], tinAlpha, model);
          paintSpatialTinTriangle(context, [p00, p11, p01], tinAlpha, model);
        }
      }
    }
    context.restore();
  }

  if (wireAlpha > 0.01) {
    context.save();
    context.globalCompositeOperation = "screen";
    context.lineWidth = Math.max(0.45, cellStep / (16 - model.surfaceMap * 5));
    context.strokeStyle = `rgba(190, 249, 255, ${wireAlpha})`;
    for (let rowIndex = 0; rowIndex < rows.length - 1; rowIndex += 1) {
      const row = rows[rowIndex];
      const nextRow = rows[rowIndex + 1];
      const count = Math.min(row.length, nextRow.length) - 1;
      for (let column = 0; column < count; column += 1) {
        const p00 = row[column];
        const p10 = row[column + 1];
        const p01 = nextRow[column];
        const p11 = nextRow[column + 1];
        context.beginPath();
        context.moveTo(p00.x, p00.y);
        context.lineTo(p10.x, p10.y);
        context.lineTo(p11.x, p11.y);
        context.lineTo(p01.x, p01.y);
        context.closePath();
        context.stroke();
      }
    }
    context.restore();
  }

  if (pointCloudAlpha > 0.01) {
    context.save();
    context.globalCompositeOperation = "screen";
    for (const row of rows) {
      for (const point of row) {
        const signal = clamp(
          point.depth * 0.42 +
            point.edge * 0.28 +
            point.noise * model.noiseMap * 0.34 +
            point.surface * model.surfaceMap * 0.26 +
            (point.subtle || 0) * model.subtleReveal * 0.32 +
            (point.lowLight || 0) * 0.12,
          0,
          1
        );
        if (signal < 0.08) continue;
        const [r, g, b] = point.color;
        const size = clamp(0.8 + signal * 2.8 + model.pointLift * 1.1 + model.subpixelScan * 0.6, 0.8, 5.5);
        context.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${clamp(pointCloudAlpha * (0.3 + signal * 0.85), 0, 0.72)})`;
        context.fillRect(point.x - size / 2, point.y - size / 2, size, size);
      }
    }
    context.restore();
  }
}

function paintSyncedSpatialCellMesh(context, cellField, model, meshAlpha) {
  if (meshAlpha <= 0.01 || !cellField?.rows?.length || cellField.rows.length < 2) return;
  const { rows, cellStep } = cellField;
  context.save();
  context.globalCompositeOperation = "screen";
  context.lineWidth = Math.max(0.42, cellStep / (22 - model.vectorTension * 5));
  const form = model.meshForm || "triangular";
  const baselineAlpha = form === "triangular" ? 0.62 : form === "hexagonal" ? 0.26 : 0.34;
  const rowAlpha = clamp((meshAlpha + model.surfaceNormal * 0.04) * baselineAlpha, 0, 0.42);
  const columnAlpha = clamp(meshAlpha * (0.74 + model.colorDepth * 0.22) * baselineAlpha, 0, 0.38);
  for (const row of rows) {
    if (row.length < 2) continue;
    context.beginPath();
    row.forEach((point, index) => {
      const signalLift = (point.depth + point.surface + point.noise * model.noiseMap + (point.subtle || 0) * model.subtleReveal) * model.master;
      const y = clamp(point.y + (signalLift - 0.5) * model.cellDepth * 2.2, 0, context.canvas.height);
      if (index === 0) context.moveTo(point.x, y);
      else context.lineTo(point.x, y);
    });
    context.strokeStyle = `rgba(125, 238, 255, ${rowAlpha})`;
    context.stroke();
  }

  const maxColumns = Math.max(...rows.map((row) => row.length));
  for (let column = 0; column < maxColumns; column += 1) {
    let started = false;
    context.beginPath();
    for (const row of rows) {
      const point = row[column];
      if (!point) continue;
      const signalLift = (point.depth + point.edge + point.surface * model.surfaceMap + (point.subtle || 0) * model.subtleReveal * 0.92) * model.master;
      const x = clamp(point.x + (signalLift - 0.5) * model.gridWarp * 2.6, 0, context.canvas.width);
      if (!started) {
        context.moveTo(x, point.y);
        started = true;
      } else {
        context.lineTo(x, point.y);
      }
    }
    if (started) {
      context.strokeStyle = `rgba(255, 111, 164, ${columnAlpha})`;
      context.stroke();
    }
  }
  if (form === "hexagonal") {
    paintSpatialHexagonalVoxelMesh(context, rows, cellStep, model, meshAlpha);
  } else if (form === "irregular") {
    paintSpatialIrregularVoxelMesh(context, rows, model, meshAlpha, 1);
  } else if (form === "variable") {
    paintSpatialVariableVoxelMesh(context, rows, cellStep, model, meshAlpha);
  } else if (form === "equation-driven") {
    paintSpatialEquationDrivenVoxelMesh(context, rows, cellStep, model, meshAlpha);
  } else {
    paintSpatialTriangularVoxelMesh(context, rows, model, meshAlpha);
  }
  context.restore();
}

function paintSpatialTriangularVoxelMesh(context, rows, model, meshAlpha) {
  context.save();
  context.lineWidth = Math.max(0.42, context.lineWidth * 0.78);
  for (let rowIndex = 0; rowIndex < rows.length - 1; rowIndex += 1) {
    const row = rows[rowIndex];
    const nextRow = rows[rowIndex + 1];
    const count = Math.min(row.length, nextRow.length) - 1;
    for (let column = 0; column < count; column += 1) {
      const p00 = row[column];
      const p10 = row[column + 1];
      const p01 = nextRow[column];
      const p11 = nextRow[column + 1];
      const signal = clamp((p00.depth + p10.depth + p01.depth + p11.depth + p00.surface + p11.surface) / 6, 0, 1);
      if (signal < 0.04) continue;
      context.beginPath();
      context.moveTo(p00.x, p00.y);
      context.lineTo(p11.x, p11.y);
      context.moveTo(p10.x, p10.y);
      context.lineTo(p01.x, p01.y);
      context.strokeStyle = spatialMeshStrokeStyle(p00, model, meshAlpha * (0.16 + signal * 0.5));
      context.stroke();
    }
  }
  context.restore();
}

function paintSpatialHexagonalVoxelMesh(context, rows, cellStep, model, meshAlpha) {
  context.save();
  context.lineWidth = Math.max(0.45, context.lineWidth * 0.84);
  const radius = Math.max(3, cellStep * (0.36 + model.surfaceMap * 0.12));
  for (const row of rows) {
    for (const point of row) {
      const signal = clamp(point.depth * 0.38 + point.surface * 0.24 + point.edge * 0.22 + point.noise * model.noiseMap * 0.18, 0, 1);
      if (signal < 0.045) continue;
      paintSpatialHexCell(context, point.x, point.y, radius * (0.72 + signal * 0.46), spatialMeshStrokeStyle(point, model, meshAlpha * (0.18 + signal * 0.44)));
    }
  }
  context.restore();
}

function paintSpatialIrregularVoxelMesh(context, rows, model, meshAlpha, amount = 1) {
  context.save();
  context.lineWidth = Math.max(0.4, context.lineWidth * 0.72);
  for (let rowIndex = 0; rowIndex < rows.length - 1; rowIndex += 1) {
    const row = rows[rowIndex];
    const nextRow = rows[rowIndex + 1];
    const count = Math.min(row.length, nextRow.length) - 1;
    for (let column = 0; column < count; column += 1) {
      const p00 = row[column];
      const p10 = row[column + 1];
      const p01 = nextRow[column];
      const p11 = nextRow[column + 1];
      const signal = clamp((p00.noise + p10.edge + p01.surface + p11.depth + (p00.subtle || 0) + (p11.subtle || 0)) / 6, 0, 1);
      if (signal < 0.035) continue;
      const cx = (p00.x + p10.x + p01.x + p11.x) / 4;
      const cy = (p00.y + p10.y + p01.y + p11.y) / 4;
      const pull = clamp((0.18 + signal * 0.34 + model.gridWarp * 0.18) * amount, 0, 0.74);
      context.beginPath();
      context.moveTo(mixChannel(p00.x, cx, pull * p00.noise), mixChannel(p00.y, cy, pull * p00.surface));
      context.lineTo(mixChannel(p10.x, cx, pull * p10.surface), mixChannel(p10.y, cy, pull * p10.noise));
      context.lineTo(mixChannel(p11.x, cx, pull * p11.edge), mixChannel(p11.y, cy, pull * p11.depth));
      context.lineTo(mixChannel(p01.x, cx, pull * p01.depth), mixChannel(p01.y, cy, pull * p01.edge));
      context.closePath();
      context.strokeStyle = spatialMeshStrokeStyle(p11, model, meshAlpha * (0.16 + signal * 0.52));
      context.stroke();
    }
  }
  context.restore();
}

function paintSpatialVariableVoxelMesh(context, rows, cellStep, model, meshAlpha) {
  paintSpatialTriangularVoxelMesh(context, rows, model, meshAlpha * 0.52);
  paintSpatialHexagonalVoxelMesh(context, rows, cellStep, model, meshAlpha * 0.44);
  paintSpatialIrregularVoxelMesh(context, rows, model, meshAlpha * 0.5, 0.68);
}

function paintSpatialEquationDrivenVoxelMesh(context, rows, cellStep, model, meshAlpha) {
  paintSpatialTriangularVoxelMesh(context, rows, model, meshAlpha * clamp(0.35 + model.equationAdherence * 0.45, 0.18, 0.82));
  context.save();
  const dash = Math.max(2, cellStep * (0.16 + model.equationMetronymics * 0.18));
  context.setLineDash([dash, dash * clamp(0.45 + model.equationAdherence, 0.5, 1.7)]);
  context.lineWidth = Math.max(0.42, context.lineWidth * (0.72 + model.equationAdherence * 0.35));
  for (let rowIndex = 0; rowIndex < rows.length - 1; rowIndex += 1) {
    const row = rows[rowIndex];
    const nextRow = rows[rowIndex + 1];
    const count = Math.min(row.length, nextRow.length) - 1;
    for (let column = 0; column < count; column += 1) {
      const p00 = row[column];
      const p11 = nextRow[column + 1];
      const rhythm = Math.sin((rowIndex + column) * (0.72 + model.equationMetronymics * 2.4) + p00.depth * Math.PI);
      const signal = clamp((p00.depth + p11.depth + p00.edge + p11.surface + Math.abs(rhythm) * model.equationMetronymics) / 5, 0, 1);
      if (signal < 0.04) continue;
      const offset = rhythm * cellStep * model.equationMetronymics * 0.16;
      context.beginPath();
      context.moveTo(p00.x + offset, p00.y - offset * 0.5);
      context.quadraticCurveTo((p00.x + p11.x) / 2, (p00.y + p11.y) / 2 + offset, p11.x - offset, p11.y + offset * 0.5);
      context.strokeStyle = spatialMeshStrokeStyle(p11, model, meshAlpha * (0.18 + signal * 0.56));
      context.stroke();
    }
  }
  context.restore();
}

function paintSpatialHexCell(context, x, y, radius, strokeStyle) {
  context.beginPath();
  for (let index = 0; index < 6; index += 1) {
    const angle = Math.PI / 6 + index * (Math.PI / 3);
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (index === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
  context.strokeStyle = strokeStyle;
  context.stroke();
}

function spatialMeshStrokeStyle(point, model, alpha) {
  const [r, g, b] = point.color || spatialRecognitionDepthColor(point.depth || 0, model);
  const red = Math.round(mixChannel(r, 255, 0.16 + model.colorSplit * 0.08));
  const green = Math.round(mixChannel(g, 245, 0.14 + model.surfaceMap * 0.05));
  const blue = Math.round(mixChannel(b, 255, 0.2 + model.colorDepth * 0.06));
  return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha, 0, 0.62)})`;
}

function paintSyncedSpatialCellSamples(context, cellField, model, pointAlpha) {
  if (pointAlpha <= 0.01 || !cellField?.rows?.length) return;
  context.save();
  context.globalCompositeOperation = "screen";
  for (const row of cellField.rows) {
    for (const point of row) {
      const signal = clamp(
        point.depth * 0.36 +
          point.edge * 0.32 +
          point.noise * model.noiseMap * 0.28 +
          point.surface * model.surfaceMap * 0.26 +
          (point.subtle || 0) * model.subtleReveal * 0.34 +
          (point.lowLight || 0) * 0.1 +
          model.cellDepth * 0.08,
        0,
        1
      );
      if (signal < 0.06) continue;
      const [r, g, b] = point.color;
      const size = clamp(0.8 + signal * 2.2 + model.subpixelScan * 0.8 + model.objectCohesion * 0.35, 0.8, 4.8);
      context.fillStyle = `rgba(${Math.round(mixChannel(r, 238, 0.28))}, ${Math.round(mixChannel(g, 255, 0.22))}, ${Math.round(mixChannel(b, 255, 0.18))}, ${clamp(pointAlpha * (0.28 + signal * 0.82), 0, 0.58)})`;
      context.fillRect(point.x - size / 2, point.y - size / 2, size, size);
    }
  }
  context.restore();
}

function paintSpatialTinTriangle(context, points, alpha, model) {
  const depth = points.reduce((sum, point) => sum + point.depth, 0) / points.length;
  const edge = points.reduce((sum, point) => sum + point.edge, 0) / points.length;
  const noise = points.reduce((sum, point) => sum + point.noise, 0) / points.length;
  const surface = points.reduce((sum, point) => sum + point.surface, 0) / points.length;
  const subtle = points.reduce((sum, point) => sum + (point.subtle || 0), 0) / points.length;
  const lowLight = points.reduce((sum, point) => sum + (point.lowLight || 0), 0) / points.length;
  const color = spatialRecognitionDepthColor(
    clamp(depth + noise * model.noiseMap * 0.12 + surface * model.surfaceMap * 0.08 + subtle * model.subtleReveal * 0.16 + lowLight * 0.08, 0, 1),
    model
  );
  const facetAlpha = clamp(
    alpha *
      (0.18 +
        depth * 0.42 +
        edge * 0.22 +
        noise * model.noiseMap * 0.24 +
        surface * model.surfaceMap * 0.2 +
        subtle * model.subtleReveal * 0.2 +
        lowLight * 0.08),
    0,
    0.48
  );
  if (facetAlpha <= 0.006) return;
  const blendColor = color.map((channel) => mixChannel(channel, 255, model.facetSmoothing * 0.08));
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  context.lineTo(points[1].x, points[1].y);
  context.lineTo(points[2].x, points[2].y);
  context.closePath();
  context.fillStyle = `rgba(${Math.round(blendColor[0])}, ${Math.round(blendColor[1])}, ${Math.round(blendColor[2])}, ${facetAlpha})`;
  context.fill();
}

function spatialRecognitionDepthColor(value, model) {
  const palette = model.palette || "full-range-rgb";
  if (thermalUsesExpandedRgbRange(palette) || palette.includes("heat") || palette.includes("rainbow")) {
    return thermalPaletteColor(value, palette === "classic" ? "full-range-rgb" : palette);
  }
  if (value < 0.28) return [18, 24, 92];
  if (value < 0.48) return [20, 220, 198];
  if (value < 0.68) return [111, 255, 84];
  if (value < 0.84) return [255, 218, 56];
  return [255, 74, 64];
}

function hasEnabledSmartSignalProcessor(smartSignalEnabled = {}) {
  return SMART_SIGNAL_PROCESSORS.some((processor) => Boolean(smartSignalEnabled?.[processor.id]));
}

function smartSignalSetting(settings = {}, processor, suffix) {
  return setting(settings, smartSignalControlKey(processor.id, suffix), DEFAULT_SETTINGS[smartSignalControlKey(processor.id, suffix)] ?? 0);
}

function smartSignalProcessorStrength(settings = {}, processor) {
  const amount = smartSignalSetting(settings, processor, "Amount") / 100;
  const sensitivity = smartSignalSetting(settings, processor, "Sensitivity") / 100;
  const blend = smartSignalSetting(settings, processor, "Blend") / 100;
  return clamp(amount * (0.62 + sensitivity * 0.72) * (0.42 + blend * 0.9) * 1.42, 0, 1.8);
}

function buildIsolateGroupedPixelModel(settings = {}, processor) {
  const dwtProfile = DWT_ISOLATE_PROFILE;
  const strength = smartSignalProcessorStrength(settings, processor);
  const dwtSensitivity = smartSignalSetting(settings, processor, "DwtSensitivity") / 100;
  const colorTarget = smartSignalSetting(settings, processor, "ColorTarget") / 100;
  const pixelSize = smartSignalSetting(settings, processor, "PixelSize") / 100;
  const pixelWeight = smartSignalSetting(settings, processor, "PixelWeight") / 100;
  const pixelDensity = smartSignalSetting(settings, processor, "PixelDensity") / 100;
  const defectSignal = smartSignalSetting(settings, processor, "DefectSignal") / 100;
  const distortionResponse = smartSignalSetting(settings, processor, "DistortionResponse") / 100;
  const grainNoise = smartSignalSetting(settings, processor, "GrainNoise") / 100;
  const speckleNoise = smartSignalSetting(settings, processor, "SpeckleNoise") / 100;
  const bandingNoise = smartSignalSetting(settings, processor, "BandingNoise") / 100;
  const blockNoise = smartSignalSetting(settings, processor, "BlockNoise") / 100;
  const chromaNoise = smartSignalSetting(settings, processor, "ChromaNoise") / 100;
  const hotPixelNoise = smartSignalSetting(settings, processor, "HotPixelNoise") / 100;
  const shadowNoise = smartSignalSetting(settings, processor, "ShadowNoise") / 100;
  const highlightNoise = smartSignalSetting(settings, processor, "HighlightNoise") / 100;
  const edgeShimmer = smartSignalSetting(settings, processor, "EdgeShimmer") / 100;
  const temporalFlicker = smartSignalSetting(settings, processor, "TemporalFlicker") / 100;
  const uniformity = smartSignalSetting(settings, processor, "Uniformity") / 100;
  const edgeRepair = smartSignalSetting(settings, processor, "EdgeRepair") / 100;
  const chromaLock = smartSignalSetting(settings, processor, "ChromaLock") / 100;
  const artifactSuppression = smartSignalSetting(settings, processor, "ArtifactSuppression") / 100;
  const radius = smartSignalSetting(settings, processor, "Radius") / 100;
  const sensitivity = smartSignalSetting(settings, processor, "Sensitivity") / 100;
  const contrast = smartSignalSetting(settings, processor, "Contrast") / 100;
  const shadow = smartSignalSetting(settings, processor, "Shadow") / 100;
  const highlight = smartSignalSetting(settings, processor, "Highlight") / 100;
  const midtone = smartSignalSetting(settings, processor, "Midtone") / 100;
  const isolation = smartSignalSetting(settings, processor, "Isolation") / 100;
  const smoothing = smartSignalSetting(settings, processor, "Smoothing") / 100;
  const blend = smartSignalSetting(settings, processor, "Blend") / 100;
  return {
    active: strength > 0.01,
    strength,
    dwtSensitivity,
    colorTarget,
    pixelSize,
    pixelWeight,
    pixelDensity,
    defectSignal,
    distortionResponse,
    grainNoise,
    speckleNoise,
    bandingNoise,
    blockNoise,
    chromaNoise,
    hotPixelNoise,
    shadowNoise,
    highlightNoise,
    edgeShimmer,
    temporalFlicker,
    uniformity,
    edgeRepair,
    chromaLock,
    artifactSuppression,
    radius,
    sensitivity,
    contrast,
    shadow,
    highlight,
    midtone,
    isolation,
    smoothing,
    blend,
    blockSize: clamp(Math.round(1 + pixelSize * 7 + radius * 5), 2, 14),
    densitySignal: clamp(pixelDensity * (0.5 + strength * 0.32 + dwtSensitivity * 0.28) * dwtProfile.densityGain, 0, 2.05),
    defectThreshold: clamp(
      0.07 + (1 - sensitivity) * 0.16 - defectSignal * dwtProfile.defectThresholdBias - dwtSensitivity * 0.035,
      dwtProfile.quantizationFloor,
      dwtProfile.quantizationCeiling
    ),
    dwtProfile
  };
}

function applySmartSignalProcessorEffects(context, width, height, settings, effect, smartSignalEnabled = {}, options = {}) {
  const enabled = normalizeSmartSignalToggles(smartSignalEnabled);
  if (!hasEnabledSmartSignalProcessor(enabled) || !context.canvas || !width || !height) return;
  const pixelBudget = Math.min(options.pixelBudget || SMART_SIGNAL_PIXEL_BUDGET, SMART_SIGNAL_PIXEL_BUDGET);
  if (width * height > pixelBudget) {
    const scale = Math.sqrt(pixelBudget / (width * height));
    const workWidth = Math.max(1, Math.round(width * scale));
    const workHeight = Math.max(1, Math.round(height * scale));
    smartSignalWorkCanvas ||= document.createElement("canvas");
    if (smartSignalWorkCanvas.width !== workWidth) smartSignalWorkCanvas.width = workWidth;
    if (smartSignalWorkCanvas.height !== workHeight) smartSignalWorkCanvas.height = workHeight;
    const workContext = smartSignalWorkCanvas.getContext("2d", { alpha: false, willReadFrequently: true });
    if (!workContext) return;
    workContext.save();
    workContext.imageSmoothingEnabled = true;
    workContext.imageSmoothingQuality = "high";
    workContext.clearRect(0, 0, workWidth, workHeight);
    workContext.drawImage(context.canvas, 0, 0, width, height, 0, 0, workWidth, workHeight);
    workContext.restore();
    applySmartSignalProcessorEffectsToContext(workContext, workWidth, workHeight, settings, effect, enabled);
    context.save();
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.clearRect(0, 0, width, height);
    context.drawImage(smartSignalWorkCanvas, 0, 0, workWidth, workHeight, 0, 0, width, height);
    context.restore();
    return;
  }
  applySmartSignalProcessorEffectsToContext(context, width, height, settings, effect, enabled);
}

function applySmartSignalProcessorEffectsToContext(context, width, height, settings, effect, smartSignalEnabled = {}) {
  let frame;
  try {
    frame = context.getImageData(0, 0, width, height);
  } catch {
    return;
  }
  const data = frame.data;
  const source = new Uint8ClampedArray(data);
  const model = smartSignalPixelModel(settings, effect, smartSignalEnabled);
  if (model.energy <= 0.01) return;
  const lumaAt = (pixelIndex) =>
    (source[pixelIndex] * 0.2126 + source[pixelIndex + 1] * 0.7152 + source[pixelIndex + 2] * 0.0722) / 255;
  for (let index = 0; index < data.length; index += 4) {
    const pixel = index / 4;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const luma = lumaAt(index);
    const left = x > 0 ? lumaAt(index - 4) : luma;
    const right = x < width - 1 ? lumaAt(index + 4) : luma;
    const up = y > 0 ? lumaAt(index - width * 4) : luma;
    const down = y < height - 1 ? lumaAt(index + width * 4) : luma;
    const localAverage = (luma * 2 + left + right + up + down) / 6;
    const edge = clamp(Math.abs(right - left) + Math.abs(down - up) + Math.abs(luma - localAverage) * 1.7, 0, 1);
    const midMask = clamp(1 - Math.abs(luma - 0.5) * 2, 0, 1);
    const shadowMask = clamp((0.58 - luma) * 1.9, 0, 1);
    const highlightMask = clamp((luma - 0.55) * 1.9, 0, 1);
    const radial = distanceFromCenter(x / Math.max(1, width - 1), y / Math.max(1, height - 1));
    let r = data[index];
    let g = data[index + 1];
    let b = data[index + 2];
    const gray = r * 0.2126 + g * 0.7152 + b * 0.0722;

    const fieldBias = clamp((radial - 0.35) * model.field, -0.18, 0.42);
    const exposureLift = (model.exposure * 36 + model.lift * 24) * (0.55 + midMask * 0.45) - model.blackpoint * shadowMask * 28 + model.whitepoint * highlightMask * 20;
    r += exposureLift + fieldBias * 30;
    g += exposureLift + fieldBias * 22;
    b += exposureLift + fieldBias * 16;

    const contrastPush = 1 + model.weight * 0.52 + model.range * 0.34 + model.structure * edge * 0.72 + model.midtones * midMask * 0.34;
    r = gray + (r - gray) * contrastPush;
    g = gray + (g - gray) * contrastPush;
    b = gray + (b - gray) * contrastPush;

    const detailPush = (luma - localAverage) * 255 * (model.details * 1.45 + model.structure * 1.12 + model.depth * 0.74);
    r += detailPush;
    g += detailPush * 0.93;
    b += detailPush * 0.86;

    if (model.metric > 0.01 || model.depth > 0.01 || model.isolate > 0.01) {
      const thermalValue = clamp(luma * (0.82 + model.range * 0.32) + edge * (model.depth * 0.38 + model.structure * 0.26) + midMask * model.metric * 0.16, 0, 1);
      const [tr, tg, tb] = thermalPaletteColor(thermalValue, model.palette);
      const alpha = clamp(model.metric * 0.38 + model.depth * 0.22 + model.isolate * 0.18, 0, 0.72);
      r = mixChannel(r, tr, alpha);
      g = mixChannel(g, tg, alpha);
      b = mixChannel(b, tb, alpha);
    }

    if (model.isolate > 0.01) {
      const levels = Math.max(3, Math.round(11 - model.isolate * 7));
      const step = 255 / (levels - 1);
      const qr = Math.round(r / step) * step;
      const qg = Math.round(g / step) * step;
      const qb = Math.round(b / step) * step;
      const groupAlpha = clamp(model.isolate * (0.35 + edge * 0.3 + model.smoothing * 0.22), 0, 0.88);
      r = mixChannel(r, qr, groupAlpha);
      g = mixChannel(g, qg, groupAlpha);
      b = mixChannel(b, qb, groupAlpha);
    }

    if (model.isolateEngine?.active) {
      [r, g, b] = applyIsolateGroupedPixelEngine(
        r,
        g,
        b,
        luma,
        localAverage,
        edge,
        midMask,
        shadowMask,
        highlightMask,
        x,
        y,
        width,
        height,
        model.isolateEngine
      );
    }

    if (model.hotspot > 0.01) {
      const hotspotMask = clamp((luma - localAverage) * 2.2 + highlightMask * 0.75 + edge * 0.55, 0, 1);
      const [hr, hg, hb] = thermalPaletteColor(clamp(0.62 + hotspotMask * 0.38, 0, 1), "flare-spectrum");
      const alpha = clamp(model.hotspot * hotspotMask * (0.36 + model.range * 0.14), 0, 0.82);
      r = mixChannel(r, hr, alpha);
      g = mixChannel(g, hg, alpha);
      b = mixChannel(b, hb, alpha);
    }

    if (model.spectralBloom > 0.01) {
      const bloomMask = clamp(highlightMask * 0.62 + midMask * 0.28 + edge * 0.18, 0, 1);
      r += (72 + model.chromaticPressure * 34) * model.spectralBloom * bloomMask;
      g += (38 + model.depth * 28) * model.spectralBloom * bloomMask;
      b += (96 + model.field * 30) * model.spectralBloom * bloomMask;
    }

    if (model.edgeFusion > 0.01) {
      const fusion = clamp(edge * model.edgeFusion * (0.48 + model.details * 0.18), 0, 0.88);
      const [fr, fg, fb] = thermalPaletteColor(clamp(luma + edge * 0.62, 0, 1), "edge-spectrum");
      r = mixChannel(r, fr, fusion);
      g = mixChannel(g, fg, fusion * 0.95);
      b = mixChannel(b, fb, fusion * 0.9);
    }

    if (model.quantizer > 0.01) {
      const levels = Math.max(3, Math.round(14 - model.quantizer * 9));
      const step = 255 / (levels - 1);
      const alpha = clamp(model.quantizer * (0.28 + model.smoothing * 0.18), 0, 0.72);
      r = mixChannel(r, Math.round(r / step) * step, alpha);
      g = mixChannel(g, Math.round(g / step) * step, alpha);
      b = mixChannel(b, Math.round(b / step) * step, alpha);
    }

    if (model.chromaticPressure > 0.01) {
      const pressure = model.chromaticPressure * (0.48 + edge * 0.32 + midMask * 0.18);
      r += (r - gray) * pressure + 34 * pressure * Math.sin((x / Math.max(1, width)) * Math.PI * 2);
      g += (g - gray) * pressure + 24 * pressure * Math.cos((y / Math.max(1, height)) * Math.PI * 2);
      b += (b - gray) * pressure + 30 * pressure * Math.sin(((x + y) / Math.max(1, width + height)) * Math.PI * 4);
    }

    if (model.blackpoint > 0.01) {
      const crush = clamp(model.blackpoint * (0.25 + shadowMask * 0.85), 0, 0.92);
      r *= 1 - crush;
      g *= 1 - crush * 0.94;
      b *= 1 - crush * 0.88;
    }

    if (model.whitepoint > 0.01) {
      const push = clamp(model.whitepoint * (0.18 + highlightMask * 0.52), 0, 0.72);
      r = mixChannel(r, 255, push * 0.38);
      g = mixChannel(g, 255, push * 0.34);
      b = mixChannel(b, 255, push * 0.3);
    }

    if (model.amplify > 0.01) {
      const amp = 1 + model.amplify * (0.42 + edge * 0.35);
      const lum = r * 0.2126 + g * 0.7152 + b * 0.0722;
      r = lum + (r - lum) * amp;
      g = lum + (g - lum) * amp;
      b = lum + (b - lum) * amp;
    }

    if (model.invert > 0.01) {
      const invertMask = clamp(model.invert * (0.36 + midMask * 0.28 + edge * 0.36 + model.metric * 0.14), 0, 0.92);
      r = mixChannel(r, 255 - r, invertMask);
      g = mixChannel(g, 255 - g, invertMask * (0.92 + model.depth * 0.08));
      b = mixChannel(b, 255 - b, invertMask * (0.86 + model.field * 0.12));
    }

    data[index] = clamp(r, 0, 255);
    data[index + 1] = clamp(g, 0, 255);
    data[index + 2] = clamp(b, 0, 255);
  }
  context.putImageData(frame, 0, 0);
}

function applyIsolateGroupedPixelEngine(r, g, b, luma, localAverage, edge, midMask, shadowMask, highlightMask, x, y, width, height, model) {
  const dwtProfile = model.dwtProfile || DWT_ISOLATE_PROFILE;
  const gray = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const normalizedR = r / 255;
  const normalizedG = g / 255;
  const normalizedB = b / 255;
  const colorSpread = (Math.abs(normalizedR - normalizedG) + Math.abs(normalizedG - normalizedB) + Math.abs(normalizedB - normalizedR)) / 2;
  const targetPhase = model.colorTarget * Math.PI * 2;
  const targetR = 0.5 + Math.sin(targetPhase) * 0.5;
  const targetG = 0.5 + Math.sin(targetPhase + Math.PI * 0.6667) * 0.5;
  const targetB = 0.5 + Math.sin(targetPhase + Math.PI * 1.3333) * 0.5;
  const targetDistance = (Math.abs(normalizedR - targetR) + Math.abs(normalizedG - targetG) + Math.abs(normalizedB - targetB)) / 3;
  const colorMatch = clamp(1 - targetDistance * (1.2 + model.chromaLock * 1.1), 0, 1);
  const blockX = Math.floor(x / model.blockSize);
  const blockY = Math.floor(y / model.blockSize);
  const blockHash = ((blockX * 37 + blockY * 61 + Math.floor(model.pixelSize * 97)) % 113) / 112;
  const diagonalHash = ((Math.floor((x + y) / Math.max(2, model.blockSize)) * 19 + blockX * 7) % 53) / 52;
  const microHash = (((x + 3) * 73856093) ^ ((y + 5) * 19349663) ^ Math.floor(model.dwtSensitivity * 997)) >>> 0;
  const microNoise = (microHash & 255) / 255;
  const fineGrainSignal = clamp(
    Math.abs(luma - localAverage) * (1.1 + model.dwtSensitivity * 1.35) * model.grainNoise * dwtProfile.grainNoiseGain +
      Math.abs(microNoise - 0.5) * model.grainNoise * 0.42,
    0,
    1.38
  );
  const speckleSeed = ((microHash >>> 8) & 255) / 255;
  const speckleSignal = clamp(
    (speckleSeed > 0.86 ? (speckleSeed - 0.86) * 7.14 : 0) * model.speckleNoise * dwtProfile.speckleNoiseGain +
      Math.max(0, Math.abs(luma - localAverage) - 0.06) * model.speckleNoise * 1.8,
    0,
    1.25
  );
  const bandPhase = Math.sin((y / Math.max(1, model.blockSize * 3)) * Math.PI * 2 + model.dwtSensitivity * Math.PI);
  const bandingSignal = clamp(Math.abs(bandPhase) * model.bandingNoise * (0.24 + Math.abs(luma - localAverage) * 1.7) * dwtProfile.bandingNoiseGain, 0, 1.12);
  const blockBoundary = x % model.blockSize === 0 || y % model.blockSize === 0;
  const blockArtifactSignal = clamp(
    (blockBoundary ? 0.42 : Math.abs(blockHash - diagonalHash) * 0.26) * model.blockNoise * dwtProfile.blockArtifactGain +
      edge * model.blockNoise * 0.2,
    0,
    1.2
  );
  const chromaNoiseSignal = clamp(colorSpread * model.chromaNoise * (0.6 + model.chromaLock * 0.75) * dwtProfile.chrominanceNoiseWeight, 0, 1.35);
  const hotPixelSignal = clamp(
    (highlightMask * Math.max(0, luma - localAverage) * 2.4 + speckleSignal * 0.28) * model.hotPixelNoise * dwtProfile.hotPixelGain,
    0,
    1.28
  );
  const shadowNoiseSignal = clamp(shadowMask * Math.abs(luma - localAverage) * model.shadowNoise * 2.2, 0, 1.16);
  const highlightNoiseSignal = clamp(highlightMask * Math.abs(luma - localAverage) * model.highlightNoise * 2.1, 0, 1.16);
  const edgeShimmerSignal = clamp(edge * (Math.abs(diagonalHash - microNoise) + 0.24) * model.edgeShimmer * (0.6 + model.pixelWeight * 0.56), 0, 1.18);
  const temporalFlickerSignal = clamp(
    Math.abs(Math.sin((x * 0.019 + y * 0.023 + microNoise * 2.7) * (1 + model.temporalFlicker))) *
      model.temporalFlicker *
      (0.18 + edge * 0.52 + midMask * 0.2) *
      dwtProfile.temporalFlickerGain,
    0,
    1.05
  );
  const dwtNoiseField = clamp(
    fineGrainSignal * 0.36 +
      speckleSignal * 0.42 +
      bandingSignal * 0.32 +
      blockArtifactSignal * 0.38 +
      chromaNoiseSignal * 0.36 +
      hotPixelSignal * 0.44 +
      shadowNoiseSignal * 0.32 +
      highlightNoiseSignal * 0.32 +
      edgeShimmerSignal * 0.34 +
      temporalFlickerSignal * 0.26,
    0,
    1.72
  );
  const isolateGroupedPixelsDensitySignal = clamp(
    model.densitySignal * (0.32 + blockHash * 0.52 + diagonalHash * 0.22) +
      colorSpread * model.pixelDensity * 0.28 +
      edge * model.pixelWeight * 0.18 * dwtProfile.edgeGain +
      dwtNoiseField * (0.18 + model.dwtSensitivity * 0.24),
    0,
    1.82
  );
  const dwtSubbandSignal = clamp(
    edge * dwtProfile.digitalNoiseWeight * 0.22 +
      Math.abs(luma - localAverage) * dwtProfile.luminanceNoiseWeight * 0.22 +
      colorSpread * dwtProfile.chrominanceNoiseWeight * 0.14 +
      midMask * dwtProfile.lowFrequencyWeight * 0.1 +
      dwtNoiseField * (0.34 + model.dwtSensitivity * 0.22),
    0,
    1.58
  );
  const isolateGroupedPixelsDefectSignal = clamp(
    Math.abs(luma - localAverage) * (2.8 + model.defectSignal * 3.8) +
      edge * (0.86 + model.distortionResponse * 1.75 + model.edgeRepair * 0.28) * dwtProfile.edgeGain +
      colorSpread * (0.44 + model.colorTarget * 0.74) +
      shadowMask * model.shadow * 0.42 +
      highlightMask * model.highlight * 0.44 +
      midMask * model.midtone * 0.28 +
      isolateGroupedPixelsDensitySignal * 0.26 -
      model.defectThreshold +
      dwtSubbandSignal * 0.48 +
      dwtNoiseField * 0.34,
    0,
    1.72
  );
  const activation = clamp(
    (isolateGroupedPixelsDefectSignal * (0.72 + model.sensitivity * 0.44 + model.dwtSensitivity * 0.28) + colorMatch * model.colorTarget * 0.26) *
      model.strength,
    0,
    1
  );
  if (activation <= 0.004) return [r, g, b];

  const dwtQuantPressure = clamp(dwtSubbandSignal * (0.5 + model.pixelDensity * 0.24 + model.dwtSensitivity * 0.2), 0, 1.05);
  const levels = Math.max(2, Math.round(14 - model.uniformity * 8 - model.isolation * 4 - dwtQuantPressure * 3));
  const step = 255 / Math.max(1, levels - 1);
  const groupGray = Math.round(gray / step) * step;
  const quantR = Math.round(r / step) * step;
  const quantG = Math.round(g / step) * step;
  const quantB = Math.round(b / step) * step;
  const groupAlpha = clamp(activation * (0.28 + model.isolation * 0.34 + model.uniformity * 0.28 + model.pixelWeight * 0.18), 0, 0.92);
  const chromaPreserve = clamp(1 - model.chromaLock * 0.72, 0.18, 1);
  let targetGroupedR = mixChannel(groupGray, quantR, chromaPreserve);
  let targetGroupedG = mixChannel(groupGray, quantG, chromaPreserve);
  let targetGroupedB = mixChannel(groupGray, quantB, chromaPreserve);

  const densityLift = 1 + isolateGroupedPixelsDensitySignal * model.pixelDensity * 0.22 * dwtProfile.densityGain;
  targetGroupedR = gray + (targetGroupedR - gray) * densityLift;
  targetGroupedG = gray + (targetGroupedG - gray) * densityLift;
  targetGroupedB = gray + (targetGroupedB - gray) * densityLift;

  r = mixChannel(r, targetGroupedR, groupAlpha);
  g = mixChannel(g, targetGroupedG, groupAlpha);
  b = mixChannel(b, targetGroupedB, groupAlpha);

  const noiseTintAlpha = clamp(activation * dwtNoiseField * (0.12 + model.dwtSensitivity * 0.18), 0, 0.42);
  if (noiseTintAlpha > 0.004) {
    const [nr, ng, nb] = thermalPaletteColor(clamp(0.2 + dwtNoiseField * 0.74 + colorMatch * 0.1, 0, 1), model.chromaNoise > 0.58 ? "red-lime" : "edge-spectrum");
    r = mixChannel(r, nr, noiseTintAlpha);
    g = mixChannel(g, ng, noiseTintAlpha * 0.96);
    b = mixChannel(b, nb, noiseTintAlpha * 0.9);
  }

  const defectDarken = clamp(activation * model.distortionResponse * (shadowMask * 0.28 + edge * 0.22), 0, 0.5);
  r *= 1 - defectDarken;
  g *= 1 - defectDarken * 0.94;
  b *= 1 - defectDarken * 0.88;

  const repairAlpha = clamp(activation * model.edgeRepair * (0.2 + edge * 0.58), 0, 0.62);
  const repaired = localAverage * 255;
  r = mixChannel(r, repaired + (r - gray) * (1 + model.pixelWeight * 0.2), repairAlpha * 0.42);
  g = mixChannel(g, repaired + (g - gray) * (1 + model.pixelWeight * 0.16), repairAlpha * 0.38);
  b = mixChannel(b, repaired + (b - gray) * (1 + model.pixelWeight * 0.12), repairAlpha * 0.34);

  const artifactAlpha = clamp(
    activation * model.artifactSuppression * dwtProfile.artifactSuppressionGain * (0.16 + model.smoothing * 0.36),
    0,
    0.58
  );
  const spectralValue = clamp(luma + edge * 0.38 + isolateGroupedPixelsDefectSignal * 0.24 + colorMatch * 0.12, 0, 1);
  const [sr, sg, sb] = thermalPaletteColor(spectralValue, model.colorTarget > 0.62 ? "red-lime" : "edge-spectrum");
  r = mixChannel(r, sr, artifactAlpha);
  g = mixChannel(g, sg, artifactAlpha * 0.94);
  b = mixChannel(b, sb, artifactAlpha * 0.88);

  const radialRepair = clamp(distanceFromCenter(x / Math.max(1, width - 1), y / Math.max(1, height - 1)) * model.smoothing * activation * 0.12, 0, 0.16);
  r = mixChannel(r, gray, radialRepair);
  g = mixChannel(g, gray, radialRepair);
  b = mixChannel(b, gray, radialRepair);

  return [r, g, b];
}

function smartSignalPixelModel(settings = {}, effect = {}, smartSignalEnabled = {}) {
  const model = {
    energy: 0,
    depth: 0,
    field: 0,
    range: 0,
    metric: 0,
    weight: 0,
    details: 0,
    midtones: 0,
    invert: 0,
    structure: 0,
    hotspot: 0,
    spectralBloom: 0,
    edgeFusion: 0,
    quantizer: 0,
    chromaticPressure: 0,
    blackpoint: 0,
    whitepoint: 0,
    lift: 0,
    amplify: 0,
    exposure: 0,
    isolate: 0,
    isolateEngine: null,
    smoothing: 0,
    palette: isThermalRenderMode(settings, effect) ? settings.thermalPalette || "full-range-rgb" : "full-range-rgb"
  };
  SMART_SIGNAL_PROCESSORS.forEach((processor) => {
    if (!smartSignalEnabled?.[processor.id]) return;
    const strength = smartSignalProcessorStrength(settings, processor);
    const isolation = smartSignalSetting(settings, processor, "Isolation") / 100;
    const smoothing = smartSignalSetting(settings, processor, "Smoothing") / 100;
    model.energy += strength;
    model.smoothing += smoothing * strength;
    if (processor.id === "depth") model.depth += strength;
    else if (processor.id === "field") model.field += strength;
    else if (processor.id === "range") model.range += strength;
    else if (processor.id === "metricMapping") model.metric += strength;
    else if (processor.id === "weight") model.weight += strength;
    else if (processor.id === "details") model.details += strength;
    else if (processor.id === "midtones") model.midtones += strength;
    else if (processor.id === "invert") model.invert += strength;
    else if (processor.id === "structure") model.structure += strength;
    else if (processor.id === "hotspotTrace") model.hotspot += strength;
    else if (processor.id === "spectralBloom") model.spectralBloom += strength;
    else if (processor.id === "edgeFusion") model.edgeFusion += strength;
    else if (processor.id === "toneQuantizer") model.quantizer += strength;
    else if (processor.id === "chromaticPressure") model.chromaticPressure += strength;
    else if (processor.id === "blackpoint") model.blackpoint += strength;
    else if (processor.id === "whitepoint") model.whitepoint += strength;
    else if (processor.id === "lift") model.lift += strength;
    else if (processor.id === "amplify") model.amplify += strength;
    else if (processor.id === "exposure") model.exposure += strength;
    else if (processor.id === "isolateGroupedPixels") {
      const isolateEngine = buildIsolateGroupedPixelModel(settings, processor);
      model.isolateEngine = isolateEngine;
      model.isolate += strength + isolateEngine.isolation * strength * 0.6;
      model.structure += isolateEngine.defectSignal * strength * 0.22;
      model.details += isolateEngine.pixelWeight * strength * 0.2;
      model.smoothing += isolateEngine.smoothing * strength * 0.34;
    }
    if (isolation > 0.45) model.isolate += isolation * strength * 0.38;
  });
  Object.keys(model).forEach((key) => {
    if (typeof model[key] === "number") model[key] = clamp(model[key], 0, key === "energy" ? 8 : 1.8);
  });
  model.smoothing = clamp(model.smoothing, 0, 1);
  return model;
}
function applyPixelateToContext(context, width, height, amount) {
  if (!context.canvas || amount <= 0) return;
  const blockSize = clamp(Math.round(2 + amount * 24), 2, 28);
  const workWidth = Math.max(1, Math.round(width / blockSize));
  const workHeight = Math.max(1, Math.round(height / blockSize));
  pixelateWorkCanvas ||= document.createElement("canvas");
  if (pixelateWorkCanvas.width !== workWidth) pixelateWorkCanvas.width = workWidth;
  if (pixelateWorkCanvas.height !== workHeight) pixelateWorkCanvas.height = workHeight;
  const workContext = pixelateWorkCanvas.getContext("2d", { alpha: false });
  if (!workContext) return;
  workContext.save();
  workContext.imageSmoothingEnabled = true;
  workContext.clearRect(0, 0, workWidth, workHeight);
  workContext.drawImage(context.canvas, 0, 0, width, height, 0, 0, workWidth, workHeight);
  workContext.restore();
  context.save();
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, width, height);
  context.drawImage(pixelateWorkCanvas, 0, 0, workWidth, workHeight, 0, 0, width, height);
  context.restore();
  context.imageSmoothingEnabled = true;
}

function thermalColdPalette(paletteName) {
  if (["rgb-spectrum", "full-range-rgb", "inverted-red-rgb", "red-lime", "orange-green", "solar-lime", "ember-green", "edge-spectrum", "flare-spectrum"].includes(paletteName)) return paletteName;
  if (["ironbow", "molten", "carbon-fire", "copper-hot", "midnight-ironbow"].includes(paletteName)) return "deep-ocean";
  if (["white-hot", "ghost-thermal", "xls"].includes(paletteName)) return "blue-core";
  if (["toxic-heat", "radar-heat", "emerald-heat"].includes(paletteName)) return "predator";
  return "dark-rainbow";
}

function thermalHotPalette(paletteName) {
  if (["rgb-spectrum", "full-range-rgb", "inverted-red-rgb", "red-lime", "orange-green", "solar-lime", "ember-green", "edge-spectrum", "flare-spectrum"].includes(paletteName)) return paletteName;
  if (["deep-ocean", "blue-core", "cold-room", "arctic", "blue-flame"].includes(paletteName)) return "lava-rainbow";
  if (["ghost-thermal", "xls", "white-hot"].includes(paletteName)) return "pink-plate";
  if (["black-hot"].includes(paletteName)) return "ironbow";
  return paletteName || "classic";
}

function thermalAllowsWhiteBackground(paletteName) {
  return ["white-hot", "ghost-thermal", "xls"].includes(paletteName);
}

function thermalUsesExpandedRgbRange(paletteName) {
  return ["rgb-spectrum", "full-range-rgb", "inverted-red-rgb", "red-lime", "orange-green", "solar-lime", "ember-green", "edge-spectrum", "flare-spectrum"].includes(paletteName);
}

function thermalPaletteColor(value, paletteName) {
  const palette = {
    "rgb-spectrum": [
      [0, 0, 0, 88],
      [0.08, 0, 0, 174],
      [0.16, 0, 42, 255],
      [0.26, 0, 222, 255],
      [0.34, 0, 255, 90],
      [0.42, 168, 255, 0],
      [0.5, 255, 242, 0],
      [0.58, 255, 128, 0],
      [0.66, 255, 0, 0],
      [1, 255, 255, 255]
    ],
    "full-range-rgb": [
      [0, 0, 0, 78],
      [0.08, 0, 0, 150],
      [0.16, 0, 56, 255],
      [0.24, 0, 184, 255],
      [0.32, 0, 255, 188],
      [0.4, 0, 255, 44],
      [0.48, 180, 255, 0],
      [0.56, 255, 244, 0],
      [0.64, 255, 112, 0],
      [0.72, 255, 0, 0],
      [1, 255, 255, 255]
    ],
    "inverted-red-rgb": [
      [0, 0, 0, 0],
      [0.08, 42, 0, 0],
      [0.18, 112, 0, 0],
      [0.32, 216, 0, 0],
      [0.48, 255, 76, 0],
      [0.62, 255, 196, 0],
      [0.76, 150, 255, 0],
      [0.9, 0, 238, 118],
      [1, 255, 252, 84]
    ],
    "red-lime": [
      [0, 0, 0, 52],
      [0.18, 0, 24, 150],
      [0.34, 0, 168, 255],
      [0.5, 38, 255, 78],
      [0.64, 202, 255, 0],
      [0.76, 255, 238, 0],
      [0.86, 255, 96, 0],
      [1, 255, 0, 0]
    ],
    "orange-green": [
      [0, 0, 0, 58],
      [0.2, 0, 30, 176],
      [0.36, 0, 210, 255],
      [0.52, 46, 255, 60],
      [0.68, 255, 230, 0],
      [0.84, 255, 116, 0],
      [1, 255, 36, 0]
    ],
    "solar-lime": [
      [0, 0, 0, 44],
      [0.16, 0, 42, 152],
      [0.3, 0, 192, 255],
      [0.44, 0, 255, 142],
      [0.58, 134, 255, 0],
      [0.72, 255, 252, 0],
      [0.86, 255, 126, 0],
      [1, 255, 0, 0]
    ],
    "ember-green": [
      [0, 0, 0, 28],
      [0.18, 0, 20, 84],
      [0.34, 0, 128, 170],
      [0.5, 38, 224, 80],
      [0.62, 198, 255, 0],
      [0.74, 255, 184, 0],
      [0.88, 255, 46, 0],
      [1, 255, 248, 54]
    ],
    "edge-spectrum": [
      [0, 0, 0, 76],
      [0.16, 0, 18, 170],
      [0.32, 0, 136, 255],
      [0.48, 0, 255, 220],
      [0.6, 20, 255, 74],
      [0.72, 238, 255, 0],
      [0.84, 255, 104, 0],
      [1, 255, 0, 0]
    ],
    "flare-spectrum": [
      [0, 0, 0, 18],
      [0.16, 0, 18, 120],
      [0.3, 0, 170, 255],
      [0.46, 0, 255, 110],
      [0.6, 180, 255, 0],
      [0.73, 255, 224, 0],
      [0.84, 255, 88, 0],
      [0.94, 255, 0, 0],
      [1, 255, 238, 72]
    ],
    rainbow: [
      [0, 0, 0, 96],
      [0.18, 0, 34, 255],
      [0.36, 0, 226, 255],
      [0.52, 40, 255, 76],
      [0.68, 255, 244, 0],
      [0.84, 255, 66, 0],
      [1, 255, 245, 44]
    ],
    predator: [
      [0, 0, 0, 68],
      [0.22, 0, 28, 188],
      [0.42, 0, 255, 235],
      [0.58, 84, 255, 0],
      [0.74, 255, 238, 0],
      [0.9, 255, 28, 0],
      [1, 255, 210, 34]
    ],
    "blue-core": [
      [0, 0, 0, 94],
      [0.25, 0, 72, 255],
      [0.48, 0, 222, 255],
      [0.66, 255, 236, 0],
      [0.84, 255, 67, 0],
      [1, 255, 218, 24]
    ],
    ironbow: [
      [0, 4, 0, 18],
      [0.22, 28, 0, 72],
      [0.42, 155, 0, 54],
      [0.62, 255, 74, 0],
      [0.8, 255, 199, 0],
      [1, 255, 222, 42]
    ],
    "white-hot": [
      [0, 0, 0, 0],
      [0.45, 72, 72, 72],
      [0.72, 196, 196, 196],
      [1, 255, 255, 255]
    ],
    "black-hot": [
      [0, 86, 96, 122],
      [0.42, 118, 126, 142],
      [0.72, 42, 48, 62],
      [1, 0, 0, 0]
    ],
    molten: [
      [0, 0, 0, 0],
      [0.3, 62, 0, 22],
      [0.52, 194, 0, 0],
      [0.72, 255, 111, 0],
      [0.9, 255, 228, 46],
      [1, 255, 238, 72]
    ],
    neon: [
      [0, 26, 0, 122],
      [0.25, 0, 72, 255],
      [0.45, 0, 255, 244],
      [0.62, 84, 255, 0],
      [0.78, 255, 238, 0],
      [0.92, 255, 0, 118],
      [1, 255, 226, 42]
    ],
    arctic: [
      [0, 4, 8, 84],
      [0.28, 0, 96, 255],
      [0.5, 0, 252, 255],
      [0.68, 215, 255, 130],
      [0.84, 255, 217, 0],
      [1, 255, 80, 0]
    ],
    "pink-plate": [
      [0, 25, 0, 70],
      [0.3, 40, 220, 255],
      [0.5, 102, 255, 167],
      [0.7, 255, 238, 28],
      [0.86, 255, 74, 168],
      [1, 255, 168, 218]
    ],
    "lava-rainbow": [
      [0, 0, 0, 56],
      [0.18, 0, 24, 180],
      [0.36, 0, 214, 255],
      [0.52, 66, 255, 42],
      [0.66, 255, 238, 0],
      [0.82, 255, 42, 0],
      [1, 255, 224, 36]
    ],
    "deep-ocean": [
      [0, 0, 0, 56],
      [0.22, 0, 28, 142],
      [0.42, 0, 110, 255],
      [0.62, 0, 236, 255],
      [0.78, 194, 255, 92],
      [1, 255, 218, 40]
    ],
    "toxic-heat": [
      [0, 0, 18, 42],
      [0.26, 0, 134, 70],
      [0.46, 92, 255, 0],
      [0.62, 230, 255, 0],
      [0.8, 255, 106, 0],
      [1, 255, 226, 36]
    ],
    "amber-blue": [
      [0, 0, 14, 82],
      [0.28, 0, 108, 255],
      [0.5, 0, 246, 255],
      [0.68, 255, 190, 46],
      [0.86, 255, 82, 0],
      [1, 255, 220, 42]
    ],
    "carbon-fire": [
      [0, 0, 0, 0],
      [0.34, 22, 22, 22],
      [0.5, 112, 0, 0],
      [0.68, 255, 52, 0],
      [0.86, 255, 204, 22],
      [1, 255, 226, 54]
    ],
    "spectral-ice": [
      [0, 8, 0, 96],
      [0.24, 42, 0, 190],
      [0.44, 0, 128, 255],
      [0.64, 0, 255, 240],
      [0.82, 218, 255, 255],
      [1, 236, 255, 214]
    ],
    "radar-heat": [
      [0, 0, 18, 18],
      [0.28, 0, 108, 58],
      [0.48, 38, 255, 80],
      [0.64, 186, 255, 0],
      [0.82, 255, 126, 0],
      [1, 255, 218, 44]
    ],
    "ghost-thermal": [
      [0, 16, 16, 24],
      [0.32, 90, 96, 130],
      [0.52, 188, 180, 232],
      [0.7, 255, 196, 238],
      [0.86, 255, 242, 220],
      [1, 240, 244, 255]
    ],
    "copper-hot": [
      [0, 0, 0, 16],
      [0.28, 74, 28, 10],
      [0.5, 188, 82, 28],
      [0.68, 255, 132, 34],
      [0.86, 255, 214, 124],
      [1, 255, 222, 88]
    ],
    "ultraviolet-heat": [
      [0, 0, 0, 88],
      [0.24, 36, 0, 160],
      [0.44, 132, 42, 255],
      [0.62, 255, 60, 236],
      [0.8, 255, 216, 42],
      [1, 255, 222, 54]
    ],
    "dark-rainbow": [
      [0, 0, 0, 96],
      [0.16, 0, 18, 150],
      [0.34, 0, 128, 255],
      [0.5, 0, 255, 214],
      [0.66, 54, 255, 0],
      [0.8, 255, 238, 0],
      [1, 255, 42, 0]
    ],
    "cold-room": [
      [0, 0, 8, 62],
      [0.22, 0, 34, 160],
      [0.44, 0, 160, 255],
      [0.62, 0, 255, 230],
      [0.78, 132, 255, 82],
      [1, 255, 214, 34]
    ],
    nightfire: [
      [0, 0, 0, 18],
      [0.26, 0, 18, 74],
      [0.46, 80, 0, 120],
      [0.62, 210, 0, 34],
      [0.8, 255, 96, 0],
      [1, 255, 226, 44]
    ],
    "cobalt-hot": [
      [0, 0, 0, 72],
      [0.24, 0, 38, 188],
      [0.44, 0, 156, 255],
      [0.6, 0, 255, 236],
      [0.76, 230, 255, 0],
      [1, 255, 80, 0]
    ],
    "emerald-heat": [
      [0, 0, 8, 42],
      [0.24, 0, 96, 80],
      [0.44, 0, 218, 112],
      [0.62, 190, 255, 0],
      [0.78, 255, 210, 0],
      [1, 255, 66, 0]
    ],
    "blue-flame": [
      [0, 0, 0, 118],
      [0.2, 0, 54, 218],
      [0.42, 0, 222, 255],
      [0.6, 122, 255, 255],
      [0.76, 255, 248, 0],
      [1, 255, 74, 0]
    ],
    "deep-sea-predator": [
      [0, 0, 4, 66],
      [0.2, 0, 22, 128],
      [0.4, 0, 110, 230],
      [0.58, 0, 255, 190],
      [0.76, 190, 255, 0],
      [1, 255, 52, 0]
    ],
    "midnight-ironbow": [
      [0, 0, 0, 26],
      [0.24, 16, 0, 78],
      [0.44, 110, 0, 80],
      [0.62, 230, 30, 0],
      [0.8, 255, 164, 0],
      [1, 255, 226, 56]
    ],
    "object-heat-isolate": [
      [0, 0, 0, 48],
      [0.32, 0, 30, 120],
      [0.5, 0, 148, 255],
      [0.66, 32, 255, 72],
      [0.82, 255, 238, 0],
      [1, 255, 48, 0]
    ],
    "lowlight-pop": [
      [0, 0, 0, 82],
      [0.28, 0, 52, 166],
      [0.48, 0, 208, 255],
      [0.64, 86, 255, 60],
      [0.82, 255, 226, 0],
      [1, 255, 78, 0]
    ],
    xls: [
      [0, 4, 10, 22],
      [0.24, 0, 110, 174],
      [0.46, 52, 255, 224],
      [0.64, 145, 255, 84],
      [0.82, 255, 77, 196],
      [1, 255, 255, 255]
    ],
    classic: [
      [0, 0, 0, 120],
      [0.25, 0, 79, 255],
      [0.44, 0, 224, 255],
      [0.58, 22, 255, 94],
      [0.72, 255, 232, 0],
      [0.88, 255, 52, 0],
      [1, 255, 228, 48]
    ]
  }[paletteName] || [
    [0, 0, 0, 120],
    [0.25, 0, 79, 255],
    [0.5, 0, 224, 255],
    [0.72, 255, 232, 0],
    [1, 255, 52, 0]
  ];
  return interpolatePalette(value, palette);
}

function interpolatePalette(value, stops) {
  const amount = clamp(value, 0, 1);
  for (let index = 1; index < stops.length; index += 1) {
    const previous = stops[index - 1];
    const next = stops[index];
    if (amount <= next[0]) {
      const local = clamp((amount - previous[0]) / Math.max(0.001, next[0] - previous[0]), 0, 1);
      return [
        mixChannel(previous[1], next[1], local),
        mixChannel(previous[2], next[2], local),
        mixChannel(previous[3], next[3], local)
      ];
    }
  }
  return stops[stops.length - 1].slice(1);
}

function mixChannel(a, b, amount) {
  return a * (1 - amount) + b * amount;
}

function isThermalRenderMode(settings, effect) {
  return Boolean(settings?.thermalPalette) || effect?.category?.includes("Thermal") || setting(settings, "thermalBlend") > 0 || setting(settings, "thermalContour") > 0;
}

function isThermalEffect(settings, effect) {
  return isThermalRenderMode(settings, effect);
}

function thermalOverlayWeight(settings, effect) {
  return isThermalRenderMode(settings, effect) ? 0.24 : 1;
}

function supportsCanvasContextFilter(context) {
  if (!context || !("filter" in context) || typeof document === "undefined") return false;
  if (typeof canvasFilterSupportMemo === "boolean") return canvasFilterSupportMemo;
  try {
    const probe = document.createElement("canvas");
    probe.width = 1;
    probe.height = 1;
    const probeContext = probe.getContext("2d", { alpha: false, willReadFrequently: true });
    if (!probeContext || !("filter" in probeContext)) {
      canvasFilterSupportMemo = false;
      return canvasFilterSupportMemo;
    }
    probeContext.fillStyle = "rgb(0,0,0)";
    probeContext.filter = "invert(100%)";
    probeContext.fillRect(0, 0, 1, 1);
    const pixel = probeContext.getImageData(0, 0, 1, 1).data;
    canvasFilterSupportMemo = pixel[0] > 245 && pixel[1] > 245 && pixel[2] > 245;
    return canvasFilterSupportMemo;
  } catch {
    canvasFilterSupportMemo = false;
    return canvasFilterSupportMemo;
  }
}

function parseFilterCss(filterCss = "") {
  const model = {
    blur: 0,
    sepia: 0,
    grayscale: 0,
    invert: 0,
    hue: 0,
    saturate: 1,
    brightness: 1,
    contrast: 1
  };
  const matcher = /([a-z-]+)\(([^)]*)\)/gi;
  for (const match of filterCss.matchAll(matcher)) {
    const name = match[1];
    const raw = match[2].trim();
    if (name === "blur") model.blur = parseCssNumber(raw);
    if (name === "sepia") model.sepia = parseCssAmount(raw, 1);
    if (name === "grayscale") model.grayscale = parseCssAmount(raw, 1);
    if (name === "invert") model.invert = parseCssAmount(raw, 1);
    if (name === "hue-rotate") model.hue = parseCssAngle(raw);
    if (name === "saturate") model.saturate = parseCssAmount(raw, 100);
    if (name === "brightness") model.brightness = parseCssAmount(raw, 100);
    if (name === "contrast") model.contrast = parseCssAmount(raw, 100);
  }
  return model;
}

function parseCssNumber(value) {
  const parsed = Number.parseFloat(String(value).replace(/px|deg|rad|turn|%/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCssAmount(value, percentBase) {
  const text = String(value).trim();
  const parsed = Number.parseFloat(text);
  if (!Number.isFinite(parsed)) return percentBase === 100 ? 1 : 0;
  if (text.includes("%")) return parsed / 100;
  return percentBase === 100 && parsed > 4 ? parsed / 100 : parsed;
}

function parseCssAngle(value) {
  const text = String(value).trim();
  const parsed = Number.parseFloat(text);
  if (!Number.isFinite(parsed)) return 0;
  if (text.endsWith("turn")) return parsed * 360;
  if (text.endsWith("rad")) return (parsed * 180) / Math.PI;
  return parsed;
}

function filterModelChangesPixels(model) {
  return (
    model.blur > 0.35 ||
    model.sepia > 0 ||
    model.grayscale > 0 ||
    model.invert > 0 ||
    Math.abs(model.hue) > 0.01 ||
    Math.abs(model.saturate - 1) > 0.001 ||
    Math.abs(model.brightness - 1) > 0.001 ||
    Math.abs(model.contrast - 1) > 0.001
  );
}

function rotateHue(r, g, b, degrees) {
  const angle = (degrees * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    r * (0.213 + cos * 0.787 - sin * 0.213) + g * (0.715 - cos * 0.715 - sin * 0.715) + b * (0.072 - cos * 0.072 + sin * 0.928),
    r * (0.213 - cos * 0.213 + sin * 0.143) + g * (0.715 + cos * 0.285 + sin * 0.14) + b * (0.072 - cos * 0.072 - sin * 0.283),
    r * (0.213 - cos * 0.213 - sin * 0.787) + g * (0.715 - cos * 0.715 + sin * 0.715) + b * (0.072 + cos * 0.928 + sin * 0.072)
  ];
}

function applyBoxBlur(data, width, height, radius) {
  if (radius <= 0) return;
  const temp = new Uint8ClampedArray(data.length);
  const channels = 4;
  const windowSize = radius * 2 + 1;
  for (let y = 0; y < height; y += 1) {
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    for (let x = -radius; x <= radius; x += 1) {
      const clampedX = clamp(x, 0, width - 1);
      const offset = (y * width + clampedX) * channels;
      r += data[offset];
      g += data[offset + 1];
      b += data[offset + 2];
      a += data[offset + 3];
    }
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * channels;
      temp[offset] = r / windowSize;
      temp[offset + 1] = g / windowSize;
      temp[offset + 2] = b / windowSize;
      temp[offset + 3] = a / windowSize;
      const removeX = clamp(x - radius, 0, width - 1);
      const addX = clamp(x + radius + 1, 0, width - 1);
      const removeOffset = (y * width + removeX) * channels;
      const addOffset = (y * width + addX) * channels;
      r += data[addOffset] - data[removeOffset];
      g += data[addOffset + 1] - data[removeOffset + 1];
      b += data[addOffset + 2] - data[removeOffset + 2];
      a += data[addOffset + 3] - data[removeOffset + 3];
    }
  }
  for (let x = 0; x < width; x += 1) {
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    for (let y = -radius; y <= radius; y += 1) {
      const clampedY = clamp(y, 0, height - 1);
      const offset = (clampedY * width + x) * channels;
      r += temp[offset];
      g += temp[offset + 1];
      b += temp[offset + 2];
      a += temp[offset + 3];
    }
    for (let y = 0; y < height; y += 1) {
      const offset = (y * width + x) * channels;
      data[offset] = r / windowSize;
      data[offset + 1] = g / windowSize;
      data[offset + 2] = b / windowSize;
      data[offset + 3] = a / windowSize;
      const removeY = clamp(y - radius, 0, height - 1);
      const addY = clamp(y + radius + 1, 0, height - 1);
      const removeOffset = (removeY * width + x) * channels;
      const addOffset = (addY * width + x) * channels;
      r += temp[addOffset] - temp[removeOffset];
      g += temp[addOffset + 1] - temp[removeOffset + 1];
      b += temp[addOffset + 2] - temp[removeOffset + 2];
      a += temp[addOffset + 3] - temp[removeOffset + 3];
    }
  }
}

function paintPreviewChrome(context, width, height, options = {}) {
  const scale = options.scale || 1;
  const compact = (options.cssWidth || width) < 720;
  const cornerInset = 26 * scale;
  const cornerLength = Math.min(width, height) * 0.16;
  const cornerStroke = Math.max(2, 2 * scale);

  context.save();
  context.globalCompositeOperation = "source-over";
  context.globalAlpha = 1;
  context.strokeStyle = "rgba(245,248,251,0.82)";
  context.lineWidth = cornerStroke;
  drawCornerLines(context, cornerInset, cornerInset, cornerLength, cornerStroke, "top-left");
  drawCornerLines(context, width - cornerInset, cornerInset, cornerLength, cornerStroke, "top-right");
  drawCornerLines(context, cornerInset, height - cornerInset, cornerLength, cornerStroke, "bottom-left");
  drawCornerLines(context, width - cornerInset, height - cornerInset, cornerLength, cornerStroke, "bottom-right");

  const badgeX = 42 * scale;
  const badgeY = 45 * scale;
  context.fillStyle = "#69df5c";
  context.shadowColor = "rgba(105,223,92,0.7)";
  context.shadowBlur = 14 * scale;
  context.beginPath();
  context.arc(badgeX, badgeY - 5 * scale, 4.5 * scale, 0, Math.PI * 2);
  context.fill();
  context.shadowBlur = 0;
  context.fillStyle = "#f5f8fb";
  context.font = `800 ${Math.max(13, 15 * scale)}px Fiona, "Fiona", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  context.textBaseline = "middle";
  context.fillText("LIVE", badgeX + 17 * scale, badgeY - 5 * scale);

  const labels = options.labels?.length ? options.labels : ["Local camera stream"];
  const metaHeight = (compact ? 96 : 45) * scale;
  const metaTop = height - metaHeight;
  context.fillStyle = "rgba(2,5,8,0.72)";
  context.fillRect(0, metaTop, width, metaHeight);
  context.strokeStyle = "rgba(133,160,184,0.26)";
  context.lineWidth = Math.max(1, scale);
  context.beginPath();
  context.moveTo(0, metaTop + 0.5 * scale);
  context.lineTo(width, metaTop + 0.5 * scale);
  context.stroke();
  context.fillStyle = "#d8e3eb";
  context.font = `500 ${Math.max(13, 13 * scale)}px Fiona, "Fiona", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  if (compact) {
    const left = 16 * scale;
    labels.slice(0, 3).forEach((label, index) => {
      context.fillText(label, left, metaTop + (21 + index * 28) * scale);
    });
  } else {
    const left = 16 * scale;
    const center = width / 2;
    const right = width - 16 * scale;
    context.textAlign = "left";
    context.fillText(labels[0] || "", left, metaTop + metaHeight / 2);
    context.textAlign = "center";
    context.fillText(labels[1] || "", center, metaTop + metaHeight / 2);
    context.textAlign = "right";
    context.fillText(labels[2] || "", right, metaTop + metaHeight / 2);
    context.textAlign = "left";
  }
  context.strokeStyle = "rgba(133,160,184,0.24)";
  context.strokeRect(0.5 * scale, 0.5 * scale, width - scale, height - scale);
  context.restore();
}

function drawCornerLines(context, x, y, length, stroke, corner) {
  const horizontal = corner.includes("right") ? -length : length;
  const vertical = corner.includes("bottom") ? -length : length;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + horizontal, y);
  context.moveTo(x, y);
  context.lineTo(x, y + vertical);
  context.stroke();
}

function buildFilterCss(settings, options = {}) {
  const includeInversion = options.includeInversion !== false;
  const rgbw = rgbwMixerInfluence(settings);
  const gammaLift = effectSetting(settings, "gamma") * 0.28;
  const shadowLift = effectSetting(settings, "shadows") * 0.22;
  const highlightLift = effectSetting(settings, "highlights") * 0.24;
  const clarityBoost = effectSetting(settings, "clarity") * 0.24;
  const dehazeBoost = effectSetting(settings, "dehaze") * 0.27;
  const vibranceBoost = effectSetting(settings, "vibrance") * 0.38;
  const channelAverage = (setting(settings, "redChannel", 100) + setting(settings, "greenChannel", 100) + setting(settings, "blueChannel", 100)) / 3 - 100;
  const classicInvert = includeInversion ? effectSetting(settings, "classicInvert") : 0;
  const lumaInvert = includeInversion ? effectSetting(settings, "lumaInvert") : 0;
  const channelInvert = includeInversion ? effectSetting(settings, "channelInvert") : 0;
  const spectralInvert = includeInversion ? effectSetting(settings, "spectralInvert") : 0;
  const thermalInvert = includeInversion ? effectSetting(settings, "thermalInvert") : 0;
  const redInvert = includeInversion ? effectSetting(settings, "redInvert") : 0;
  const greenInvert = includeInversion ? effectSetting(settings, "greenInvert") : 0;
  const blueInvert = includeInversion ? effectSetting(settings, "blueInvert") : 0;
  const shadowInvert = includeInversion ? effectSetting(settings, "shadowInvert") : 0;
  const highlightInvert = includeInversion ? effectSetting(settings, "highlightInvert") : 0;
  const selectiveInvertAverage = (redInvert + greenInvert + blueInvert + shadowInvert + highlightInvert) / 5;
  const exposureLift =
    effectSetting(settings, "exposure") * 0.7 +
    gammaLift +
    shadowLift +
    highlightLift * 0.38 +
    channelAverage * 0.12 +
    effectSetting(settings, "microExposure") * 0.42 +
    effectSetting(settings, "ambientLift") * 0.28 +
    effectSetting(settings, "specularControl") * 0.17 +
    effectSetting(settings, "whites") * 0.18 -
    effectSetting(settings, "blacks") * 0.15 +
    effectSetting(settings, "whitePoint") * 0.25 -
    effectSetting(settings, "blackPoint") * 0.2 -
    effectSetting(settings, "highlightRecovery") * 0.16 +
    rgbw.brightnessBoost;
  const contrastLift =
    Math.abs(effectSetting(settings, "exposure")) * 0.15 +
    clarityBoost +
    dehazeBoost -
    effectSetting(settings, "fade") * 0.34 +
    effectSetting(settings, "hdrRange") * 0.23 +
    effectSetting(settings, "midtoneContrast") * 0.3 +
    effectSetting(settings, "localContrast") * 0.28 +
    effectSetting(settings, "texture") * 0.15 +
    effectSetting(settings, "structure") * 0.17 +
    effectSetting(settings, "detailBoost") * 0.16 +
    effectSetting(settings, "fineSharpen") * 0.14 +
    effectSetting(settings, "clarityMask") * 0.18 +
    effectSetting(settings, "skinSmooth") * -0.18 +
    rgbw.contrastBoost;
  const brightness = clamp(100 + (setting(settings, "brightness", 100) - 100) * 1.18 + exposureLift, 5, 315);
  const contrast = clamp(100 + (setting(settings, "contrast", 100) - 100) * 1.2 + contrastLift, 5, 330);
  const saturation = clamp(
    100 +
      (setting(settings, "saturation", 100) - 100) * 1.22 +
      vibranceBoost +
      effectSetting(settings, "colorizeStrength") * 0.48 -
      effectSetting(settings, "matte") * 0.2 +
      spectralInvert * 0.65 +
      thermalInvert * 0.42 +
      effectSetting(settings, "colorHarmony") * 0.2 +
      effectSetting(settings, "colorLeak") * 0.32 +
      effectSetting(settings, "noiseColor") * 0.12 +
      effectSetting(settings, "uvaFluorescence") * 0.32 +
      effectSetting(settings, "chlorophyllGlow") * 0.28 +
      effectSetting(settings, "mineralPop") * 0.28 +
      effectSetting(settings, "auraBloom") * 0.32 +
      rgbw.saturationBoost,
    0,
    420
  );
  const hue = clamp(
    effectSetting(settings, "hue") +
      effectSetting(settings, "colorizeHue") * (effectSetting(settings, "colorizeStrength") / 110) +
      channelInvert * 1.65 +
      spectralInvert * 2.15 -
      thermalInvert * 0.72 +
      redInvert * 0.38 -
      greenInvert * 0.24 +
      blueInvert * 0.52 +
      effectSetting(settings, "redHueShift") * 0.58 +
      effectSetting(settings, "greenHueShift") * 0.48 +
      effectSetting(settings, "blueHueShift") * 0.6 +
      effectSetting(settings, "aquaShift") * 0.5 +
      effectSetting(settings, "purpleShift") * 0.56 +
      effectSetting(settings, "orangeShift") * 0.42 +
      effectSetting(settings, "skinToneWarmth") * 0.24 +
      effectSetting(settings, "colorSeparation") * 0.4 +
      effectSetting(settings, "nearIrBoost") * 0.38 -
      effectSetting(settings, "nightScope") * 0.3 +
      rgbw.hueShift,
    -360,
    360
  );
  const sepia = clamp(
    effectSetting(settings, "sepia") +
      effectSetting(settings, "whiteBalance") * 0.2 +
      Math.max(0, effectSetting(settings, "temperature")) * 0.2 +
      thermalInvert * 0.36 +
      effectSetting(settings, "orangeShift") * 0.24 +
      effectSetting(settings, "thermalBlend") * 0.22,
    0,
    100
  );
  const grayscale = clamp(
    effectSetting(settings, "grayscale") +
      effectSetting(settings, "threshold") * 0.28 -
      effectSetting(settings, "vibrance") * 0.12 +
      lumaInvert * 0.42 +
      effectSetting(settings, "xrayGhost") * 0.3 +
      effectSetting(settings, "negativeDepth") * 0.24,
    0,
    100
  );
  const invert = clamp(
    effectSetting(settings, "invert") +
      effectSetting(settings, "solarize") * 0.5 +
      classicInvert +
      lumaInvert * 0.62 +
      thermalInvert * 0.28 +
      selectiveInvertAverage * 0.32 +
      effectSetting(settings, "negativeDepth") * 0.34,
    0,
    100
  );
  const blur = clamp(
    effectSetting(settings, "blur") * 1.12 +
      effectSetting(settings, "softFocus") * 0.07 +
      effectSetting(settings, "radialBlur") * 0.04 +
      effectSetting(settings, "motionBlur") * 0.036 +
      effectSetting(settings, "bokehBloom") * 0.032 +
      effectSetting(settings, "skinSmooth") * 0.03 +
      effectSetting(settings, "tiltShift") * 0.016 -
      effectSetting(settings, "fineSharpen") * 0.024 -
      effectSetting(settings, "sharpen") * 0.018 -
      effectSetting(settings, "detailBoost") * 0.014 +
      effectSetting(settings, "fisheye") * 0.01 +
      effectSetting(settings, "barrelWarp") * 0.01,
    0,
    24
  );
  const glowRadius = clamp(
    effectSetting(settings, "glow") * 1.12 +
      effectSetting(settings, "glowRadius") * 0.42 +
      effectSetting(settings, "glowStrength") * 0.46 +
      effectSetting(settings, "bloom") * 0.2 +
      effectSetting(settings, "halation") * 0.25 +
      effectSetting(settings, "edgeGlow") * 0.24 +
      effectSetting(settings, "centerGlow") * 0.2 +
      effectSetting(settings, "chromaticGlow") * 0.22 +
      effectSetting(settings, "flareStreak") * 0.18 +
      effectSetting(settings, "lightWrap") * 0.16,
    0,
    140
  );
  return [
    `blur(${blur}px)`,
    `sepia(${sepia}%)`,
    `grayscale(${grayscale}%)`,
    `invert(${invert}%)`,
    `hue-rotate(${hue}deg)`,
    `saturate(${saturation}%)`,
    `brightness(${brightness}%)`,
    `contrast(${contrast}%)`,
    glowRadius ? `drop-shadow(0 0 ${glowRadius}px ${rgbwCss(settings, "highlights", 0.34)})` : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function buildOverlayStyle(effect, settings) {
  const temperature = effectSetting(settings, "temperature");
  const tintValue = effectSetting(settings, "tint");
  const warm = temperature > 0 ? `rgba(255,132,48,${temperature / 230})` : `rgba(51,143,255,${Math.abs(temperature) / 250})`;
  const tint = tintValue > 0 ? `rgba(255,69,190,${tintValue / 245})` : `rgba(67,255,122,${Math.abs(tintValue) / 265})`;
  const rgbw = rgbwMixerInfluence(settings);
  const main = rgbwCss(settings, "main", clamp(0.16 + effectSetting(settings, "overlayStrength") / 130 + rgbw.mainIntensity * 0.28, 0.08, 0.96));
  const secondary = rgbwCss(settings, "secondary", clamp(0.1 + effectSetting(settings, "duotone") / 135 + rgbw.secondaryIntensity * 0.25, 0.04, 0.88));
  const third = rgbwCss(settings, "third", clamp(0.08 + Math.abs(effectSetting(settings, "splitTone")) / 210 + rgbw.thirdIntensity * 0.24, 0.03, 0.76));
  const highlight = rgbwCss(settings, "highlights", clamp(0.06 + rgbw.highlightsIntensity * 0.25 + effectSetting(settings, "lightWrap") / 185, 0.02, 0.7));
  return {
    background: `linear-gradient(120deg, ${effect.overlayColor}, ${warm}, ${main}), linear-gradient(300deg, ${tint}, ${secondary}, transparent 62%), linear-gradient(180deg, transparent 0%, ${third} 56%, transparent 100%), linear-gradient(90deg, transparent 0%, ${highlight} 50%, transparent 100%)`,
    mixBlendMode: effect.blendMode,
    opacity: clamp(0.16 + effectSetting(settings, "duotone") / 120 + effectSetting(settings, "overlayStrength") / 165 + rgbw.totalIntensity * 0.22 + effectSetting(settings, "colorLeak") / 205, 0, 0.98)
  };
}

function buildSpecialOverlayStyle(settings) {
  const rgbw = rgbwMixerInfluence(settings);
  const main = rgbwCss(settings, "main", clamp(setting(settings, "overlayStrength") / 100 + rgbw.mainIntensity * 0.16, 0, 0.92));
  const secondary = rgbwCss(settings, "secondary", clamp(setting(settings, "colorDodge") / 120 + rgbw.secondaryIntensity * 0.14, 0, 0.86));
  const third = rgbwCss(settings, "third", clamp(setting(settings, "prismSplit") / 150 + rgbw.thirdIntensity * 0.14, 0, 0.78));
  const highlights = rgbwCss(
    settings,
    "highlights",
    clamp(
      (setting(settings, "bloom") +
        setting(settings, "halation") +
        setting(settings, "lensFlare") +
        setting(settings, "edgeGlow") +
        setting(settings, "centerGlow") +
        setting(settings, "chromaticGlow")) /
        340 +
        rgbw.highlightsIntensity * 0.12,
      0,
      0.92
    )
  );
  const infrared = `rgba(255, 48, 44, ${clamp(effectSetting(settings, "infraredWash") / 125, 0, 0.8)})`;
  const ultraviolet = `rgba(144, 82, 255, ${clamp((effectSetting(settings, "ultravioletWash") + effectSetting(settings, "uvaFluorescence")) / 120, 0, 0.86)})`;
  const thermal = `rgba(255, 188, 30, ${clamp((effectSetting(settings, "thermalBlend") + effectSetting(settings, "thermalContour") + effectSetting(settings, "heatEdge")) / 180, 0, 0.84)})`;
  const scanlineAlpha = clamp(effectSetting(settings, "scanlines") / 130, 0, 0.72);
  const grainAlpha = clamp((effectSetting(settings, "filmGrainSize") + effectSetting(settings, "noiseMono") + effectSetting(settings, "dust") * 0.5) / 170, 0, 0.72);
  const colorNoiseAlpha = clamp(effectSetting(settings, "noiseColor") / 150, 0, 0.58);
  const scratchAlpha = clamp(effectSetting(settings, "scratches") / 150, 0, 0.6);
  const split = clamp(effectSetting(settings, "chromaticAberration") + effectSetting(settings, "prismSplit") + effectSetting(settings, "glitchShift") + effectSetting(settings, "colorSeparation"), 0, 280);
  return {
    backgroundImage: `
      linear-gradient(140deg, transparent 0%, ${highlights} 48%, transparent ${clamp(70 + setting(settings, "bloom") * 0.12, 70, 86)}%),
      linear-gradient(24deg, transparent 30%, rgba(255,255,255,${clamp(setting(settings, "lensFlare") / 140, 0, 0.42)}) 50%, transparent 70%),
      linear-gradient(${88 + setting(settings, "colorizeHue") * 0.2}deg, ${main}, ${secondary}, ${third}, transparent 72%),
      linear-gradient(90deg, ${infrared}, transparent 38%, ${ultraviolet}, transparent 70%, ${thermal}),
      linear-gradient(${setting(settings, "flareStreak") * 1.8 + 24}deg, transparent 34%, ${rgbwCss(settings, "highlights", clamp(setting(settings, "flareStreak") / 140, 0, 0.62))} 48%, transparent 62%),
      linear-gradient(180deg, transparent 12%, ${rgbwCss(settings, "main", clamp(setting(settings, "centerGlow") / 210, 0, 0.36))} 52%, transparent 88%),
      repeating-linear-gradient(88deg, rgba(255,255,255,${scratchAlpha}) 0 1px, transparent 1px 46px),
      repeating-radial-gradient(circle at 18% 24%, rgba(255,64,96,${colorNoiseAlpha}) 0 1px, transparent 1px 9px),
      repeating-radial-gradient(circle at 82% 64%, rgba(64,196,255,${colorNoiseAlpha}) 0 1px, transparent 1px 11px),
      repeating-linear-gradient(0deg, rgba(255,255,255,${scanlineAlpha}) 0 1px, transparent 1px ${clamp(8 - setting(settings, "scanlines") / 20, 3, 8)}px),
      linear-gradient(90deg, rgba(0,0,0,${clamp(setting(settings, "shadowCrush") / 210, 0, 0.42)}), transparent 28%, transparent 72%, rgba(0,0,0,${clamp(setting(settings, "shadowCrush") / 210, 0, 0.42)})),
      repeating-linear-gradient(45deg, rgba(255,255,255,${grainAlpha}) 0 1px, transparent 1px 7px)
    `,
    mixBlendMode: setting(settings, "colorDodge") > 24 ? "color-dodge" : setting(settings, "matte") > 24 ? "soft-light" : "screen",
    opacity: clamp(
      0.06 +
        setting(settings, "overlayStrength") / 160 +
        setting(settings, "bloom") / 240 +
        setting(settings, "infraredWash") / 320 +
        setting(settings, "ultravioletWash") / 320 +
        setting(settings, "thermalBlend") / 320 +
        setting(settings, "colorLeak") / 360 +
        setting(settings, "auraBloom") / 320 +
        setting(settings, "mirrorGhost") / 360 +
        rgbw.totalIntensity * 0.08,
      0,
      0.94
    ),
    transform: `translateX(${(setting(settings, "redChannel", 100) - setting(settings, "blueChannel", 100)) * 0.018 + split * 0.018}px) scale(${1 + setting(settings, "crtCurve") * 0.0009 + setting(settings, "fisheye") * 0.0008 - setting(settings, "barrelWarp") * 0.0005})`,
    filter: `blur(${clamp(setting(settings, "halo") * 0.03 + setting(settings, "softFocus") * 0.02 + setting(settings, "bokehBloom") * 0.015, 0, 6)}px) contrast(${clamp(100 + setting(settings, "edgeEnhance") * 0.4 + setting(settings, "emboss") * 0.2 + setting(settings, "thermalContour") * 0.16, 100, 190)}%)`
  };
}

function paintOverlay(context, width, height, effect, settings) {
  const rgbw = rgbwMixerInfluence(settings);
  const overlayWeight = thermalOverlayWeight(settings, effect);
  context.save();
  context.globalAlpha = clamp((0.05 + effectSetting(settings, "duotone") / 120 + effectSetting(settings, "overlayStrength") / 165 + rgbw.totalIntensity * 0.16 + effectSetting(settings, "colorLeak") / 245) * overlayWeight, 0, 0.82);
  context.globalCompositeOperation = canvasCompositeMode(effect.blendMode);
  context.fillStyle = effect.overlayColor;
  context.fillRect(0, 0, width, height);
  const temperature = effectSetting(settings, "temperature");
  if (temperature !== 0) {
    context.globalAlpha = Math.abs(temperature) / 190;
    context.fillStyle = temperature > 0 ? "rgb(255,128,42)" : "rgb(54,138,255)";
    context.fillRect(0, 0, width, height);
  }
  context.globalCompositeOperation = "screen";
  const mixerAlpha = clamp((effectSetting(settings, "overlayStrength") / 125 + rgbw.totalIntensity * 0.22) * overlayWeight, 0, 0.82);
  if (mixerAlpha) {
    context.globalAlpha = mixerAlpha;
    const linear = context.createLinearGradient(0, 0, width, height);
    linear.addColorStop(0, rgbwCss(settings, "main", 1));
    linear.addColorStop(0.5, rgbwCss(settings, "secondary", 1));
    linear.addColorStop(1, rgbwCss(settings, "third", 1));
    context.fillStyle = linear;
    context.fillRect(0, 0, width, height);
  }
  if (setting(settings, "bloom") || setting(settings, "halation") || setting(settings, "lensFlare") || setting(settings, "edgeGlow") || setting(settings, "centerGlow") || setting(settings, "auraBloom")) {
    context.globalAlpha = clamp(
      ((effectSetting(settings, "bloom") +
          effectSetting(settings, "halation") +
          effectSetting(settings, "lensFlare") +
          effectSetting(settings, "edgeGlow") +
          effectSetting(settings, "centerGlow") +
          effectSetting(settings, "auraBloom") +
          effectSetting(settings, "glowStrength")) /
          245 +
          rgbw.highlightsIntensity * 0.08) *
        overlayWeight,
      0,
      0.9
    );
    const flare = context.createRadialGradient(width * 0.5, height * 0.52, 0, width * 0.5, height * 0.52, Math.max(width, height) * 0.46);
    flare.addColorStop(0, rgbwCss(settings, "highlights", 1));
    flare.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = flare;
    context.fillRect(0, 0, width, height);
  }
  if (setting(settings, "lightWrap") || setting(settings, "flareStreak") || setting(settings, "mirrorGhost")) {
    context.globalCompositeOperation = "screen";
    context.globalAlpha = clamp((effectSetting(settings, "lightWrap") + effectSetting(settings, "flareStreak") + effectSetting(settings, "mirrorGhost")) / 280, 0, 0.78);
    const streak = context.createLinearGradient(0, height * 0.15, width, height * 0.85);
    streak.addColorStop(0, "rgba(255,255,255,0)");
    streak.addColorStop(0.48, rgbwCss(settings, "highlights", 1));
    streak.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = streak;
    context.fillRect(0, 0, width, height);
  }
  if (setting(settings, "nightScope") || setting(settings, "nearIrBoost") || setting(settings, "uvaFluorescence") || setting(settings, "thermalContour")) {
    context.globalCompositeOperation = "soft-light";
    context.globalAlpha = clamp(
      (effectSetting(settings, "nightScope") + effectSetting(settings, "nearIrBoost") + effectSetting(settings, "uvaFluorescence") + effectSetting(settings, "thermalContour") * overlayWeight) / 330,
      0,
      0.7
    );
    const spectralGradient = context.createLinearGradient(0, 0, 0, height);
    spectralGradient.addColorStop(0, `rgba(142, 82, 255, ${clamp(setting(settings, "uvaFluorescence") / 100, 0, 1)})`);
    spectralGradient.addColorStop(0.52, `rgba(80, 255, 126, ${clamp(setting(settings, "nightScope") / 100, 0, 1)})`);
    spectralGradient.addColorStop(1, `rgba(255, 58, 38, ${clamp(setting(settings, "thermalContour") / 100, 0, 1)})`);
    context.fillStyle = spectralGradient;
    context.fillRect(0, 0, width, height);
  }
  context.restore();
}

function paintSpecialOverlay(context, width, height, settings, effect) {
  const rgbw = rgbwMixerInfluence(settings);
  const overlayWeight = thermalOverlayWeight(settings, effect);
  context.save();
  context.filter = `blur(${clamp(effectSetting(settings, "halo") * 0.03 + effectSetting(settings, "softFocus") * 0.026 + effectSetting(settings, "bokehBloom") * 0.02 + effectSetting(settings, "glowStrength") * 0.014, 0, 7)}px)`;
  context.globalCompositeOperation =
    setting(settings, "colorDodge") > 24 ? "color-dodge" : setting(settings, "matte") > 24 ? "soft-light" : "screen";
  const washAlpha = clamp(
      effectSetting(settings, "overlayStrength") / 125 +
      effectSetting(settings, "bloom") / 190 +
      effectSetting(settings, "infraredWash") / 250 +
      effectSetting(settings, "ultravioletWash") / 250 +
      (effectSetting(settings, "thermalBlend") * overlayWeight) / 250 +
      effectSetting(settings, "colorLeak") / 285 +
      effectSetting(settings, "auraBloom") / 250 +
      effectSetting(settings, "mirrorGhost") / 285 +
      rgbw.totalIntensity * 0.08,
    0,
    0.94
  );
  if (washAlpha) {
    context.globalAlpha = washAlpha;
    const wash = context.createLinearGradient(0, 0, width, height);
    wash.addColorStop(0, rgbwCss(settings, "main", 1));
    wash.addColorStop(0.34, rgbwCss(settings, "secondary", 1));
    wash.addColorStop(0.68, rgbwCss(settings, "third", 1));
    wash.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = wash;
    context.fillRect(0, 0, width, height);
  }

  const spectralAlpha = clamp(
    (effectSetting(settings, "infraredWash") +
      effectSetting(settings, "ultravioletWash") +
      effectSetting(settings, "thermalBlend") * overlayWeight +
      effectSetting(settings, "uvaFluorescence") +
      effectSetting(settings, "thermalContour") * overlayWeight +
      effectSetting(settings, "heatEdge") * overlayWeight) /
      390,
    0,
    0.86
  );
  if (spectralAlpha) {
    context.globalCompositeOperation = "soft-light";
    context.globalAlpha = spectralAlpha;
    const spectral = context.createLinearGradient(0, 0, width, height);
    spectral.addColorStop(0, `rgba(255, 48, 44, ${clamp(setting(settings, "infraredWash") / 100, 0, 1)})`);
    spectral.addColorStop(0.48, `rgba(144, 82, 255, ${clamp((setting(settings, "ultravioletWash") + setting(settings, "uvaFluorescence")) / 160, 0, 1)})`);
    spectral.addColorStop(1, `rgba(255, 188, 30, ${clamp((setting(settings, "thermalBlend") + setting(settings, "thermalContour")) / 170, 0, 1)})`);
    context.fillStyle = spectral;
    context.fillRect(0, 0, width, height);
  }

  const glowAlpha = clamp(
    ((effectSetting(settings, "bloom") +
        effectSetting(settings, "halation") +
        effectSetting(settings, "lensFlare") +
        effectSetting(settings, "edgeGlow") +
        effectSetting(settings, "centerGlow") +
        effectSetting(settings, "chromaticGlow") +
        effectSetting(settings, "glowStrength")) /
        265) *
      overlayWeight,
    0,
    0.92
  );
  if (glowAlpha) {
    context.globalCompositeOperation = "screen";
    context.globalAlpha = glowAlpha;
    const centerGlow = context.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.42);
    centerGlow.addColorStop(0, rgbwCss(settings, "highlights", clamp(glowAlpha, 0, 0.72)));
    centerGlow.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = centerGlow;
    context.fillRect(0, 0, width, height);
  }

  if (setting(settings, "flareStreak") || setting(settings, "lightWrap") || setting(settings, "mirrorGhost")) {
    context.globalCompositeOperation = "screen";
    context.globalAlpha = clamp((effectSetting(settings, "flareStreak") + effectSetting(settings, "lightWrap") + effectSetting(settings, "mirrorGhost")) / 280, 0, 0.78);
    const streak = context.createLinearGradient(0, height * 0.18, width, height * 0.82);
    streak.addColorStop(0, "rgba(255,255,255,0)");
    streak.addColorStop(0.48, rgbwCss(settings, "highlights", 1));
    streak.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = streak;
    context.fillRect(0, 0, width, height);
  }

  const scanlineAlpha = clamp(setting(settings, "scanlines") / 180, 0, 0.58);
  if (scanlineAlpha) {
    context.globalCompositeOperation = "screen";
    context.globalAlpha = scanlineAlpha;
    context.fillStyle = "rgba(255,255,255,0.72)";
    const step = clamp(8 - setting(settings, "scanlines") / 20, 3, 8);
    for (let y = 0; y < height; y += step) context.fillRect(0, y, width, 1);
  }

  const scratchAlpha = clamp(setting(settings, "scratches") / 220, 0, 0.44);
  if (scratchAlpha) {
    context.globalCompositeOperation = "screen";
    context.globalAlpha = scratchAlpha;
    context.strokeStyle = "rgba(255,255,255,0.7)";
    context.lineWidth = 1;
    for (let x = width * 0.08; x < width; x += 46) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x + width * 0.08, height);
      context.stroke();
    }
  }
  const tiltShiftAlpha = clamp(effectSetting(settings, "tiltShift") / 115, 0, 0.74);
  if (tiltShiftAlpha) {
    context.globalCompositeOperation = "multiply";
    context.globalAlpha = tiltShiftAlpha;
    context.filter = "none";
    const topBand = context.createLinearGradient(0, 0, 0, height * 0.45);
    topBand.addColorStop(0, "rgba(0,0,0,0.68)");
    topBand.addColorStop(1, "rgba(255,255,255,1)");
    context.fillStyle = topBand;
    context.fillRect(0, 0, width, height * 0.46);
    const bottomBand = context.createLinearGradient(0, height * 0.55, 0, height);
    bottomBand.addColorStop(0, "rgba(255,255,255,1)");
    bottomBand.addColorStop(1, "rgba(0,0,0,0.68)");
    context.fillStyle = bottomBand;
    context.fillRect(0, height * 0.54, width, height * 0.46);
  }
  context.restore();
}

function paintCanvasGrain(context, width, height, settings) {
  const alpha = clamp(
    (setting(settings, "grain") + setting(settings, "filmGrainSize") + setting(settings, "noiseMono") + setting(settings, "dust")) / 260,
    0,
    0.72
  );
  if (!alpha) return;
  context.save();
  context.globalCompositeOperation = "soft-light";
  context.globalAlpha = alpha;
  context.fillStyle = "rgba(255,255,255,0.45)";
  const firstStep = 7;
  const secondStep = 11;
  for (let y = 0; y < height; y += firstStep) {
    for (let x = (y / firstStep) % 2 === 0 ? 0 : 3; x < width; x += firstStep) {
      context.fillRect(x, y, 1, 1);
    }
  }
  context.globalAlpha = alpha * 0.72;
  context.fillStyle = "rgba(255,255,255,0.3)";
  for (let y = 2; y < height; y += secondStep) {
    for (let x = (y / secondStep) % 2 === 0 ? 5 : 0; x < width; x += secondStep) {
      context.fillRect(x, y, 1, 1);
    }
  }
  context.restore();
}

function setting(settings, key, fallback = 0) {
  const value = Number(settings?.[key] ?? fallback);
  return Number.isFinite(value) ? value : fallback;
}

function effectSetting(settings, key, fallback = 0, gain = EFFECT_OUTPUT_GAIN) {
  const range = settingRange(key);
  const value = setting(settings, key, fallback);
  const neutral = neutralSettingValue(key, fallback);
  return clamp(neutral + (value - neutral) * gain, range.min, range.max);
}

function neutralSettingValue(key, fallback = 0) {
  if (["brightness", "contrast", "saturation", "redChannel", "greenChannel", "blueChannel"].includes(key)) return 100;
  return fallback;
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
  const { r, g, b } = rgbwDeltaComponents(settings, groupKey);
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${clamp(alpha, 0, 1)})`;
}

function rgbwDefaults(groupKey) {
  return RGBW_MIXERS.find((group) => group.key === groupKey)?.defaults || { R: 0, G: 0, B: 0, W: 0 };
}

function rgbwDeltaComponents(settings, groupKey) {
  const defaults = rgbwDefaults(groupKey);
  const whiteDelta = setting(settings, `${groupKey}W`) - defaults.W;
  const redDelta = setting(settings, `${groupKey}R`) - defaults.R;
  const greenDelta = setting(settings, `${groupKey}G`) - defaults.G;
  const blueDelta = setting(settings, `${groupKey}B`) - defaults.B;
  return {
    r: clamp(128 + redDelta * RGBW_MIXER_GAIN + whiteDelta * 0.98, 0, 255),
    g: clamp(128 + greenDelta * RGBW_MIXER_GAIN + whiteDelta * 0.98, 0, 255),
    b: clamp(128 + blueDelta * RGBW_MIXER_GAIN + whiteDelta * 0.98, 0, 255)
  };
}

function rgbwIntensity(settings, groupKey) {
  const defaults = rgbwDefaults(groupKey);
  const delta =
    Math.abs(setting(settings, `${groupKey}R`) - defaults.R) +
    Math.abs(setting(settings, `${groupKey}G`) - defaults.G) +
    Math.abs(setting(settings, `${groupKey}B`) - defaults.B) +
    Math.abs(setting(settings, `${groupKey}W`) - defaults.W);
  return clamp((delta / (255 * 4)) * 1.35, 0, 1);
}

function rgbwMixerInfluence(settings) {
  const main = rgbwDeltaComponents(settings, "main");
  const secondary = rgbwDeltaComponents(settings, "secondary");
  const third = rgbwDeltaComponents(settings, "third");
  const highlights = rgbwDeltaComponents(settings, "highlights");
  const mainIntensity = rgbwIntensity(settings, "main");
  const secondaryIntensity = rgbwIntensity(settings, "secondary");
  const thirdIntensity = rgbwIntensity(settings, "third");
  const highlightsIntensity = rgbwIntensity(settings, "highlights");
  const totalIntensity = (mainIntensity + secondaryIntensity + thirdIntensity + highlightsIntensity) / 4;
  const redBias = (main.r + secondary.r * 0.65 + third.r * 0.45 + highlights.r * 0.32) / 2.42;
  const greenBias = (main.g + secondary.g * 0.65 + third.g * 0.45 + highlights.g * 0.32) / 2.42;
  const blueBias = (main.b + secondary.b * 0.65 + third.b * 0.45 + highlights.b * 0.32) / 2.42;
  const warmth = (redBias - blueBias) / 255;
  const greenMagenta = (greenBias - (redBias + blueBias) / 2) / 255;
  return {
    mainIntensity,
    secondaryIntensity,
    thirdIntensity,
    highlightsIntensity,
    totalIntensity,
    brightnessBoost: (totalIntensity - 0.5) * 34 + highlightsIntensity * 14,
    contrastBoost: Math.abs(warmth) * 18 + Math.abs(greenMagenta) * 14,
    saturationBoost: totalIntensity * 30 + (Math.max(redBias, greenBias, blueBias) / 255) * 20,
    hueShift: warmth * 52 - greenMagenta * 34
  };
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
  if (
    mode === "screen" ||
    mode === "overlay" ||
    mode === "soft-light" ||
    mode === "multiply" ||
    mode === "lighten" ||
    mode === "darken" ||
    mode === "color-dodge" ||
    mode === "difference" ||
    mode === "luminosity"
  ) {
    return mode;
  }
  return "source-over";
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await window.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function countCategory(category) {
  return CATEGORY_COUNTS.get(category) || 0;
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

function distanceFromCenter(x, y) {
  const dx = x - 0.5;
  const dy = y - 0.5;
  return clamp(Math.sqrt(dx * dx + dy * dy) * Math.SQRT2, 0, 1);
}

export default CameraStudio;
