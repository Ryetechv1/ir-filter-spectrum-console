import {
  Camera,
  Download,
  ExternalLink,
  FlipHorizontal,
  Film,
  KeyRound,
  LockKeyhole,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Square,
  Trash2,
  Video,
  Youtube,
  Zap,
  X
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./cameraStudio.css";

const STUDIO_UNLOCK_KEY = "ir-filter-camera-studio-unlocked";
const YOUTUBE_CHANNEL_HANDLE = "@azel222";
const YOUTUBE_CHANNEL_NAME = "Supernatural World";
const YOUTUBE_CHANNEL_ID = "UCZd1C1Gw4Pjm4tiIJep4Oaw";
const YOUTUBE_UPLOADS_PLAYLIST_ID = `UU${YOUTUBE_CHANNEL_ID.slice(2)}`;
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@azel222";
const YOUTUBE_SHARED_CHANNEL_URL = "https://youtube.com/@azel222?si=Uj_ZFMax1TYTZWbJ";
const YOUTUBE_UPLOADS_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${YOUTUBE_UPLOADS_PLAYLIST_ID}`;
const YOUTUBE_UPLOADS_PLAYER_URL = `https://www.youtube.com/embed/videoseries?list=${YOUTUBE_UPLOADS_PLAYLIST_ID}&rel=0&modestbranding=1&playsinline=1`;
const SUPERNATURAL_DATABASE_URL = "https://sites.google.com/view/official-supernatural-database/home?igu=1";
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
const CONTACT_EMAIL = "alola99990@gmail.com";
const CAPTURE_LIBRARY_LIMIT = 3;
const MAX_RECORDING_MS = 180000;
const RECORDING_RESOLUTIONS = {
  "1080p": { label: "1080P", width: 1920, height: 1080 },
  "2k": { label: "2K", width: 2560, height: 1440 }
};
const MP4_MIME_TYPES = [
  "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
  "video/mp4;codecs=h264",
  "video/mp4"
];
const PREVIEW_CANVAS_SCALE_CAP = 1.25;
const THERMAL_EFFECT_PIXEL_BUDGET = 170_000;
let thermalWorkCanvas;
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

const FINISH_ADJUSTMENTS = [
  ["sepia", "Sepia", 0, 100, "%", 0],
  ["grayscale", "Grayscale", 0, 100, "%", 0],
  ["invert", "Base Invert", 0, 100, "%", 0]
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
  vignette: 12,
  grain: 0,
  duotone: 0,
  glow: 0,
  sepia: 0,
  grayscale: 0,
  invert: 0,
  ...Object.fromEntries(INVERSION_ADJUSTMENTS.map(([key, , , , , initial = 0]) => [key, initial])),
  ...Object.fromEntries(ADVANCED_ADJUSTMENTS.map(([key, , , , , initial = 0]) => [key, initial])),
  ...Object.fromEntries(
    RGBW_MIXERS.flatMap((group) =>
      RGBW_CHANNELS.map((channel) => [`${group.key}${channel.key}`, group.defaults[channel.key]])
    )
  )
};

const STACKED_SETTING_KEYS = new Set([
  ...INVERSION_ADJUSTMENTS.map(([key]) => key),
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
    description: "Fast brightness, exposure, contrast, temperature, blur, glow, grain, and vignette controls.",
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
    controls: ["overlayStrength", "glow", "grain", "vignette", "sepia", "grayscale", "invert"]
  }
];

const ADJUSTMENT_LOOKUP = new Map([...CORE_ADJUSTMENTS, ...FINISH_ADJUSTMENTS, ...INVERSION_ADJUSTMENTS, ...ADVANCED_ADJUSTMENTS].map((control) => [control[0], control]));

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
    settings: { brightness: 115, contrast: 152, saturation: 170, hue: -18, duotone: 36, glow: 20, thermalPalette: "classic", thermalBlend: 70, thermalContour: 44, heatEdge: 36 }
  },
  {
    category: "Thermal Variations",
    variants: [
      {
        name: "Prismatic Heat",
        color: "rgba(255, 224, 32, 0.34)",
        settings: { thermalPalette: "rainbow", thermalBlend: 100, thermalContour: 68, heatEdge: 66, brightness: 118, contrast: 170, saturation: 230, posterize: 18, edgeEnhance: 34 }
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
      }
    ],
    color: "rgba(255,76,18,0.28)",
    blendMode: "color-dodge",
    settings: { brightness: 114, contrast: 166, saturation: 220, thermalBlend: 92, thermalContour: 60, heatEdge: 54, overlayStrength: 30 }
  },
  {
    category: "XLS Camera",
    names: ["XLS Spectral Camera"],
    color: "rgba(90, 255, 214, 0.32)",
    blendMode: "screen",
    settings: { brightness: 112, contrast: 168, saturation: 205, hue: 20, thermalPalette: "xls", thermalBlend: 82, thermalContour: 70, heatEdge: 58, xrayGhost: 42, nearIrBoost: 34, ultravioletWash: 28, infraredWash: 24, edgeEnhance: 22, glow: 12 }
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
  (family.variants || family.names.map((name) => ({ name }))).map((variant, index) => {
    const baseSettings = { ...family.settings, ...(variant.settings || {}) };
    const wave = index - 4.5;
    return {
      id: `${family.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
      name: variant.name,
      category: family.category,
      overlayColor: variant.color || family.color,
      blendMode: variant.blendMode || family.blendMode,
      favorite: index === 0 || index === 5,
      settings: {
        ...DEFAULT_SETTINGS,
        ...baseSettings,
        brightness: clamp((baseSettings.brightness ?? 100) + Math.round(wave * 1.5), 20, 220),
        contrast: clamp((baseSettings.contrast ?? 100) + Math.round((index % 5) * 3), 20, 220),
        saturation: clamp((baseSettings.saturation ?? 100) + Math.round((index % 4) * 5), 0, 260),
        hue: clamp((baseSettings.hue ?? 0) + ((familyIndex * 17 + index * 9) % 82) - 41, -180, 180),
        vignette: clamp((baseSettings.vignette ?? 12) + (index % 3) * 5, 0, 90),
        grain: clamp((baseSettings.grain ?? 0) + (index % 4) * 2, 0, 80),
        glow: clamp((baseSettings.glow ?? 0) + (index % 3) * 3, 0, 60)
      }
    };
  })
);

const CATEGORIES = ["All Presets", "Favorites", ...EFFECT_FAMILIES.map((family) => family.category)];

function CameraStudio() {
  const videoRef = useRef(null);
  const hudVideoRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const hudCanvasRef = useRef(null);
  const cameraFrameRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const recordingCanvasRef = useRef(null);
  const recordingFrameRef = useRef(0);
  const previewFrameRef = useRef(0);
  const recordingTimerRef = useRef(null);
  const recordingStartedAtRef = useRef(0);
  const captureShelfRef = useRef([]);
  const renderStateRef = useRef({
    filterCss: "",
    selectedEffect: CAMERA_EFFECTS[0],
    manualSettings: CAMERA_EFFECTS[0].settings,
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
  const [databaseWindowOpen, setDatabaseWindowOpen] = useState(false);
  const [selectedYoutubeVideoId, setSelectedYoutubeVideoId] = useState(YOUTUBE_RECENT_UPLOADS[0]?.id || "");
  const [torchActive, setTorchActive] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Presets");
  const [search, setSearch] = useState("");
  const [selectedEffectId, setSelectedEffectId] = useState(CAMERA_EFFECTS[0].id);
  const [manualSettings, setManualSettings] = useState(CAMERA_EFFECTS[0].settings);
  const [openAdjustmentGroups, setOpenAdjustmentGroups] = useState(() => new Set(ADJUSTMENT_GROUPS.filter((group) => group.open).map((group) => group.id)));
  const [snapshotUrl, setSnapshotUrl] = useState("");
  const [cameraHudVisible, setCameraHudVisible] = useState(false);

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

  const youtubePlayerUrl = useMemo(() => {
    if (!selectedYoutubeVideoId) return YOUTUBE_UPLOADS_PLAYER_URL;
    return `https://www.youtube.com/embed/${selectedYoutubeVideoId}?rel=0&modestbranding=1&playsinline=1`;
  }, [selectedYoutubeVideoId]);

  const selectedYoutubeVideo = useMemo(
    () => YOUTUBE_RECENT_UPLOADS.find((video) => video.id === selectedYoutubeVideoId) || YOUTUBE_RECENT_UPLOADS[0],
    [selectedYoutubeVideoId]
  );

  const filterCss = useMemo(() => buildFilterCss(manualSettings), [manualSettings]);

  useEffect(() => {
    renderStateRef.current = { filterCss, selectedEffect, manualSettings, cameraFacing };
  }, [cameraFacing, filterCss, manualSettings, selectedEffect]);

  useEffect(() => {
    if (!cameraActive) {
      clearCameraOutputCanvas(previewCanvasRef.current);
      clearCameraOutputCanvas(hudCanvasRef.current);
      return undefined;
    }
    let lastDraw = 0;
    const drawPreview = (timestamp) => {
      const video = videoRef.current;
      const renderState = renderStateRef.current;
      if (video?.readyState >= 2) {
        if (!lastDraw || timestamp - lastDraw > 58) {
          drawCameraOutputCanvas(previewCanvasRef.current, cameraFrameRef.current, video, renderState, {
            includePreviewChrome: true,
            metaLabels: ["Local camera stream", renderState.cameraFacing === "user" ? "Front camera" : "Rear camera", renderState.selectedEffect.name]
          });
          if (cameraHudVisible) {
            drawCameraOutputCanvas(hudCanvasRef.current, null, video, renderState, {
              includePreviewChrome: true,
              metaLabels: ["Local camera stream", renderState.cameraFacing === "user" ? "Front camera" : "Rear camera", renderState.selectedEffect.name]
            });
          }
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
    const frame = cameraFrameRef.current;
    if (!frame) return undefined;
    const syncHudVisibility = () => {
      const rect = frame.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      const visibilityRatio = clamp(visibleHeight / Math.max(rect.height, 1), 0, 1);
      setCameraHudVisible(window.scrollY > 80 && visibilityRatio < 0.68);
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

  const updateTorchCapability = useCallback((stream) => {
    const videoTrack = stream?.getVideoTracks?.()[0];
    const capabilities = videoTrack?.getCapabilities?.() || {};
    const supported = Boolean(capabilities.torch);
    setTorchSupported(supported);
    setTorchActive(false);
    return supported;
  }, []);

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
    updateTorchCapability(stream);
    setCameraFacing(nextFacing);
    setCameraActive(true);
    setCameraStatus("Camera active. The video is local to this device and is not uploaded.");
  }, [cameraFacing, updateTorchCapability]);

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
    if (hudVideoRef.current) hudVideoRef.current.srcObject = null;
    setTorchActive(false);
    setTorchSupported(false);
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

  const toggleTorch = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("Flashlight access is not supported in this browser.");
      return;
    }
    try {
      let stream = streamRef.current;
      if (!stream || cameraFacing !== "environment") {
        stopCamera();
        setCameraStatus("Requesting rear camera for flashlight access...");
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } });
        await attachCameraStream(stream, "environment");
      }
      const videoTrack = stream.getVideoTracks()[0];
      const capabilities = videoTrack?.getCapabilities?.() || {};
      if (!capabilities.torch) {
        setTorchSupported(false);
        setTorchActive(false);
        setCameraStatus("This device/browser does not expose rear-camera flashlight control for this stream.");
        return;
      }
      const nextTorch = !torchActive;
      await videoTrack.applyConstraints({ advanced: [{ torch: nextTorch }] });
      setTorchSupported(true);
      setTorchActive(nextTorch);
      setCameraStatus(nextTorch ? "Rear camera flashlight is on. Stream remains local to this device." : "Rear camera flashlight is off.");
    } catch (error) {
      setTorchActive(false);
      setCameraStatus(`Flashlight toggle failed: ${error.message || error}`);
    }
  }, [attachCameraStream, cameraFacing, stopCamera, torchActive]);

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
      const renderState = renderStateRef.current;
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
      if (previewFrameRef.current) window.cancelAnimationFrame(previewFrameRef.current);
      stopRecording("Recording stopped because the studio closed.");
      stopCamera();
      captureShelfRef.current.forEach((item) => URL.revokeObjectURL(item.url));
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
    setManualSettings((current) => ({
      ...effect.settings,
      ...Object.fromEntries([...STACKED_SETTING_KEYS].map((key) => [key, current[key] ?? DEFAULT_SETTINGS[key] ?? 0]))
    }));
  }

  function updateSetting(key, value) {
    setManualSettings((current) => ({ ...current, [key]: Number(value) }));
  }

  function setAdjustmentGroupOpen(groupId, open) {
    setOpenAdjustmentGroups((current) => {
      const next = new Set(current);
      if (open) next.add(groupId);
      else next.delete(groupId);
      return next;
    });
  }

  function handleStopCamera() {
    stopRecording("Recording stopped because the camera was stopped.");
    stopCamera();
    setCameraStatus("Camera stopped. Press Start Camera to request camera access again.");
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
    const previewCanvas = previewCanvasRef.current;
    drawCameraOutputCanvas(previewCanvas, cameraFrameRef.current, video, { filterCss, selectedEffect, manualSettings, cameraFacing }, {
      includePreviewChrome: true,
      metaLabels: ["Local camera stream", cameraFacing === "user" ? "Front camera" : "Rear camera", selectedEffect.name]
    });
    if (!previewCanvas?.width || !previewCanvas?.height) {
      setCameraStatus("Snapshot failed because the preview canvas is not ready yet.");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = previewCanvas.width;
    canvas.height = previewCanvas.height;
    const context = canvas.getContext("2d");
    context.drawImage(previewCanvas, 0, 0);
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
      const link = document.createElement("a");
      link.href = url;
      link.download = `spectral-imaging-studio-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
      link.click();
      setCameraStatus("Snapshot downloaded locally.");
    } catch (error) {
      setCameraStatus(`Snapshot export failed: ${error.message || error}`);
    }
  }

  function scrollToCameraFrame() {
    cameraFrameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
          onInput={(event) => updateSetting(key, event.currentTarget.value)}
          onChange={(event) => updateSetting(key, event.target.value)}
          style={{ "--value": `${((value - min) / (max - min)) * 100}%` }}
        />
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
                    onInput={(event) => updateSetting(settingKey, event.currentTarget.value)}
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

  function renderAdjustmentGroup(group) {
    const count =
      group.type === "rgbw"
        ? RGBW_MIXERS.length * RGBW_CHANNELS.length
        : group.controls.length;
    return (
      <details
        key={group.id}
        className="adjustment-dropdown"
        open={openAdjustmentGroups.has(group.id)}
        onToggle={(event) => setAdjustmentGroupOpen(group.id, event.currentTarget.open)}
      >
        <summary>
          <span>
            <strong>{group.title}</strong>
            <small>{group.description}</small>
          </span>
          <em>{count}</em>
        </summary>
        {group.type === "rgbw" ? (
          renderRgbwMixerGroup()
        ) : (
          <div className="adjustment-list">
            {group.controls.map((controlKey) =>
              renderAdjustmentSlider(
                Array.isArray(controlKey) ? controlKey : ADJUSTMENT_LOOKUP.get(controlKey),
                group.controlClassName
              )
            )}
          </div>
        )}
      </details>
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
            <li>{CAMERA_EFFECTS.length} local visual presets for IR-style, UVA-style, thermal, XLS, cinematic, monochrome, duotone, retro, and color-lab looks.</li>
            <li>Four RGBW gradient mixers for Main, Secondary, Third, and Highlights color layers that now drive overlays and filter math.</li>
            <li>12 core photo controls, 10 color inversion tools, and 100 advanced sliders for exposure, color channels, glow, scanlines, IR/UVA washes, and more.</li>
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
                  <span>{selectedEffect.name}</span>
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
            <button type="button" onClick={flipCamera} disabled={!cameraActive}>
              <FlipHorizontal size={18} />
              Flip Camera
            </button>
            <button type="button" className={torchActive ? "studio-torch active" : "studio-torch"} onClick={toggleTorch}>
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
        </section>

        <aside className="adjustments-panel studio-panel">
          <div className="studio-panel-heading">
            <h2>Adjustments</h2>
            <button type="button" onClick={resetStudio}>Reset all</button>
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
              GUI wrapper is testing the Google Sites `?igu=1` view. If Google blocks this iframe on your device, use the external button below.
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
                <span>Using /home?igu=1. Google Sites may still block embedded viewing with X-Frame-Options on some browsers.</span>
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
            <div className="camera-floating-hud-label">
              <span>{cameraFacing === "user" ? "Front" : "Rear"}</span>
              <strong>{selectedEffect.name}</strong>
            </div>
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

function drawCameraOutputCanvas(canvas, frameElement, video, renderState, options = {}) {
  if (!canvas || !video) return false;
  const fallbackWidth = video.videoWidth || 1280;
  const fallbackHeight = video.videoHeight || 720;
  const size = getRenderedCameraFrameSize(frameElement || canvas, fallbackWidth, fallbackHeight, {
    scaleCap: PREVIEW_CANVAS_SCALE_CAP
  });
  if (!size.width || !size.height) return false;
  if (canvas.width !== size.width) canvas.width = size.width;
  if (canvas.height !== size.height) canvas.height = size.height;
  const context = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
  if (!context) return false;
  drawStudioFrame(context, size.width, size.height, video, renderState, {
    includePreviewChrome: options.includePreviewChrome,
    forcePixelFilters: true,
    pixelScale: size.scale,
    cssWidth: size.cssWidth,
    metaLabels: options.metaLabels
  });
  return true;
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

function drawStudioFrame(context, width, height, video, renderState, options = {}) {
  const { filterCss, selectedEffect, manualSettings, cameraFacing } = renderState;
  const previewFilterCss = filterCss || buildFilterCss(manualSettings);
  const useCanvasFilter = !options.forcePixelFilters && supportsCanvasContextFilter(context);
  context.save();
  context.filter = "none";
  context.globalAlpha = 1;
  context.globalCompositeOperation = "source-over";
  context.fillStyle = "#030508";
  context.fillRect(0, 0, width, height);
  if (video?.readyState >= 2) {
    const sourceWidth = video.videoWidth || width;
    const sourceHeight = video.videoHeight || height;
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
    context.drawImage(video, sx, sy, sw, sh, 0, 0, width, height);
  }
  context.restore();
  if (!useCanvasFilter) applyCanvasPreviewFilters(context, width, height, previewFilterCss);
  applyAdvancedCameraPixelEffects(context, width, height, manualSettings, selectedEffect);
  paintOverlay(context, width, height, selectedEffect, manualSettings);
  paintSpecialOverlay(context, width, height, manualSettings);
  paintCanvasGrain(context, width, height, manualSettings);
  paintCanvasVignette(context, width, height, manualSettings);
  if (options.includePreviewChrome) {
    paintPreviewChrome(context, width, height, {
      scale: options.pixelScale || 1,
      cssWidth: options.cssWidth || width,
      labels: options.metaLabels || []
    });
  }
}

function applyCanvasPreviewFilters(context, width, height, filterCss) {
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

function applyAdvancedCameraPixelEffects(context, width, height, settings, effect) {
  const paletteName = settings?.thermalPalette || "";
  const thermalSignal = setting(settings, "thermalBlend") + setting(settings, "thermalContour") * 0.75 + setting(settings, "heatEdge") * 0.68;
  const thermalPresetSignal = paletteName || effect?.category?.includes("Thermal") ? 54 : 0;
  const xlsSignal = setting(settings, "xrayGhost") + (paletteName === "xls" || effect?.category === "XLS Camera" ? 72 : 0);
  const thermalAmount = clamp((thermalSignal + thermalPresetSignal) / 210, 0, 1);
  const xlsAmount = clamp(xlsSignal / 150, 0, 1);
  if (!thermalAmount && !xlsAmount) return;
  const palette = paletteName || (xlsAmount > thermalAmount ? "xls" : "classic");

  if (context.canvas && width * height > THERMAL_EFFECT_PIXEL_BUDGET) {
    const scale = Math.sqrt(THERMAL_EFFECT_PIXEL_BUDGET / (width * height));
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
    applyAdvancedCameraPixelEffectsToContext(workContext, workWidth, workHeight, settings, { palette, thermalAmount, xlsAmount });
    context.save();
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.clearRect(0, 0, width, height);
    context.drawImage(thermalWorkCanvas, 0, 0, workWidth, workHeight, 0, 0, width, height);
    context.restore();
    return;
  }

  applyAdvancedCameraPixelEffectsToContext(context, width, height, settings, { palette, thermalAmount, xlsAmount });
}

function applyAdvancedCameraPixelEffectsToContext(context, width, height, settings, effectModel) {
  const { palette, thermalAmount, xlsAmount } = effectModel;
  let frame;
  try {
    frame = context.getImageData(0, 0, width, height);
  } catch {
    return;
  }

  const data = frame.data;
  const source = setting(settings, "heatEdge") || setting(settings, "thermalContour") ? new Uint8ClampedArray(data) : data;
  const edgeBoost = clamp((setting(settings, "heatEdge") + setting(settings, "thermalContour") * 0.48) / 140, 0, 1);
  const contrastPush = 1 + setting(settings, "thermalContour") / 115;

  for (let index = 0; index < data.length; index += 4) {
    let r = data[index];
    let g = data[index + 1];
    let b = data[index + 2];
    const pixel = index / 4;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    let luma = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;

    if (edgeBoost && x > 0 && y > 0) {
      const left = index - 4;
      const up = index - width * 4;
      const leftLuma = (source[left] * 0.2126 + source[left + 1] * 0.7152 + source[left + 2] * 0.0722) / 255;
      const upLuma = (source[up] * 0.2126 + source[up + 1] * 0.7152 + source[up + 2] * 0.0722) / 255;
      const edge = clamp(Math.abs(luma - leftLuma) + Math.abs(luma - upLuma), 0, 1);
      luma = clamp(luma + edge * edgeBoost * 1.55, 0, 1);
    }

    const mappedLuma = clamp((luma - 0.5) * contrastPush + 0.5, 0, 1);
    if (thermalAmount) {
      const [tr, tg, tb] = thermalPaletteColor(mappedLuma, palette);
      r = mixChannel(r, tr, thermalAmount);
      g = mixChannel(g, tg, thermalAmount);
      b = mixChannel(b, tb, thermalAmount);
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

    data[index] = clamp(r, 0, 255);
    data[index + 1] = clamp(g, 0, 255);
    data[index + 2] = clamp(b, 0, 255);
  }
  context.putImageData(frame, 0, 0);
}

function thermalPaletteColor(value, paletteName) {
  const palette = {
    rainbow: [
      [0, 0, 0, 96],
      [0.18, 0, 34, 255],
      [0.36, 0, 226, 255],
      [0.52, 40, 255, 76],
      [0.68, 255, 244, 0],
      [0.84, 255, 66, 0],
      [1, 255, 255, 255]
    ],
    predator: [
      [0, 0, 0, 68],
      [0.22, 0, 28, 188],
      [0.42, 0, 255, 235],
      [0.58, 84, 255, 0],
      [0.74, 255, 238, 0],
      [0.9, 255, 28, 0],
      [1, 255, 255, 210]
    ],
    "blue-core": [
      [0, 0, 0, 94],
      [0.25, 0, 72, 255],
      [0.48, 0, 222, 255],
      [0.66, 255, 236, 0],
      [0.84, 255, 67, 0],
      [1, 255, 238, 210]
    ],
    ironbow: [
      [0, 4, 0, 18],
      [0.22, 28, 0, 72],
      [0.42, 155, 0, 54],
      [0.62, 255, 74, 0],
      [0.8, 255, 199, 0],
      [1, 255, 255, 230]
    ],
    "white-hot": [
      [0, 0, 0, 0],
      [0.45, 72, 72, 72],
      [0.72, 196, 196, 196],
      [1, 255, 255, 255]
    ],
    "black-hot": [
      [0, 255, 255, 255],
      [0.42, 160, 160, 160],
      [0.72, 52, 52, 52],
      [1, 0, 0, 0]
    ],
    molten: [
      [0, 0, 0, 0],
      [0.3, 62, 0, 22],
      [0.52, 194, 0, 0],
      [0.72, 255, 111, 0],
      [0.9, 255, 228, 46],
      [1, 255, 255, 255]
    ],
    neon: [
      [0, 26, 0, 122],
      [0.25, 0, 72, 255],
      [0.45, 0, 255, 244],
      [0.62, 84, 255, 0],
      [0.78, 255, 238, 0],
      [0.92, 255, 0, 118],
      [1, 255, 255, 255]
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
      [1, 255, 235, 242]
    ],
    "lava-rainbow": [
      [0, 0, 0, 56],
      [0.18, 0, 24, 180],
      [0.36, 0, 214, 255],
      [0.52, 66, 255, 42],
      [0.66, 255, 238, 0],
      [0.82, 255, 42, 0],
      [1, 255, 255, 245]
    ],
    "deep-ocean": [
      [0, 0, 0, 56],
      [0.22, 0, 28, 142],
      [0.42, 0, 110, 255],
      [0.62, 0, 236, 255],
      [0.78, 194, 255, 92],
      [1, 255, 248, 176]
    ],
    "toxic-heat": [
      [0, 0, 18, 42],
      [0.26, 0, 134, 70],
      [0.46, 92, 255, 0],
      [0.62, 230, 255, 0],
      [0.8, 255, 106, 0],
      [1, 255, 255, 232]
    ],
    "amber-blue": [
      [0, 0, 14, 82],
      [0.28, 0, 108, 255],
      [0.5, 0, 246, 255],
      [0.68, 255, 190, 46],
      [0.86, 255, 82, 0],
      [1, 255, 250, 218]
    ],
    "carbon-fire": [
      [0, 0, 0, 0],
      [0.34, 22, 22, 22],
      [0.5, 112, 0, 0],
      [0.68, 255, 52, 0],
      [0.86, 255, 204, 22],
      [1, 255, 255, 238]
    ],
    "spectral-ice": [
      [0, 8, 0, 96],
      [0.24, 42, 0, 190],
      [0.44, 0, 128, 255],
      [0.64, 0, 255, 240],
      [0.82, 218, 255, 255],
      [1, 255, 255, 255]
    ],
    "radar-heat": [
      [0, 0, 18, 18],
      [0.28, 0, 108, 58],
      [0.48, 38, 255, 80],
      [0.64, 186, 255, 0],
      [0.82, 255, 126, 0],
      [1, 255, 245, 198]
    ],
    "ghost-thermal": [
      [0, 16, 16, 24],
      [0.32, 90, 96, 130],
      [0.52, 188, 180, 232],
      [0.7, 255, 196, 238],
      [0.86, 255, 242, 220],
      [1, 255, 255, 255]
    ],
    "copper-hot": [
      [0, 0, 0, 16],
      [0.28, 74, 28, 10],
      [0.5, 188, 82, 28],
      [0.68, 255, 132, 34],
      [0.86, 255, 214, 124],
      [1, 255, 255, 238]
    ],
    "ultraviolet-heat": [
      [0, 0, 0, 88],
      [0.24, 36, 0, 160],
      [0.44, 132, 42, 255],
      [0.62, 255, 60, 236],
      [0.8, 255, 216, 42],
      [1, 255, 255, 236]
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
      [1, 255, 255, 210]
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

function supportsCanvasContextFilter(context) {
  return context && "filter" in context;
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
  context.font = `800 ${Math.max(13, 15 * scale)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
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
  context.font = `500 ${Math.max(13, 13 * scale)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
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
  const gammaLift = setting(settings, "gamma") * 0.2;
  const shadowLift = setting(settings, "shadows") * 0.16;
  const highlightLift = setting(settings, "highlights") * 0.18;
  const clarityBoost = setting(settings, "clarity") * 0.18;
  const dehazeBoost = setting(settings, "dehaze") * 0.2;
  const vibranceBoost = setting(settings, "vibrance") * 0.28;
  const channelAverage = (setting(settings, "redChannel", 100) + setting(settings, "greenChannel", 100) + setting(settings, "blueChannel", 100)) / 3 - 100;
  const classicInvert = includeInversion ? setting(settings, "classicInvert") : 0;
  const lumaInvert = includeInversion ? setting(settings, "lumaInvert") : 0;
  const channelInvert = includeInversion ? setting(settings, "channelInvert") : 0;
  const spectralInvert = includeInversion ? setting(settings, "spectralInvert") : 0;
  const thermalInvert = includeInversion ? setting(settings, "thermalInvert") : 0;
  const redInvert = includeInversion ? setting(settings, "redInvert") : 0;
  const greenInvert = includeInversion ? setting(settings, "greenInvert") : 0;
  const blueInvert = includeInversion ? setting(settings, "blueInvert") : 0;
  const shadowInvert = includeInversion ? setting(settings, "shadowInvert") : 0;
  const highlightInvert = includeInversion ? setting(settings, "highlightInvert") : 0;
  const selectiveInvertAverage = (redInvert + greenInvert + blueInvert + shadowInvert + highlightInvert) / 5;
  const exposureLift =
    settings.exposure * 0.55 +
    gammaLift +
    shadowLift +
    highlightLift * 0.38 +
    channelAverage * 0.12 +
    setting(settings, "microExposure") * 0.32 +
    setting(settings, "ambientLift") * 0.2 +
    setting(settings, "specularControl") * 0.12 +
    setting(settings, "whites") * 0.12 -
    setting(settings, "blacks") * 0.1 +
    setting(settings, "whitePoint") * 0.18 -
    setting(settings, "blackPoint") * 0.13 -
    setting(settings, "highlightRecovery") * 0.1 +
    rgbw.brightnessBoost;
  const contrastLift =
    Math.abs(settings.exposure) * 0.12 +
    clarityBoost +
    dehazeBoost -
    setting(settings, "fade") * 0.28 +
    setting(settings, "hdrRange") * 0.16 +
    setting(settings, "midtoneContrast") * 0.2 +
    setting(settings, "localContrast") * 0.18 +
    setting(settings, "texture") * 0.08 +
    setting(settings, "structure") * 0.1 +
    setting(settings, "detailBoost") * 0.09 +
    setting(settings, "fineSharpen") * 0.08 +
    setting(settings, "clarityMask") * 0.12 +
    setting(settings, "skinSmooth") * -0.12 +
    rgbw.contrastBoost;
  const brightness = clamp(settings.brightness + exposureLift, 5, 290);
  const contrast = clamp(settings.contrast + contrastLift, 5, 300);
  const saturation = clamp(
    settings.saturation +
      vibranceBoost +
      setting(settings, "colorizeStrength") * 0.35 -
      setting(settings, "matte") * 0.15 +
      spectralInvert * 0.65 +
      thermalInvert * 0.42 +
      setting(settings, "colorHarmony") * 0.12 +
      setting(settings, "colorLeak") * 0.22 +
      setting(settings, "noiseColor") * 0.06 +
      setting(settings, "uvaFluorescence") * 0.24 +
      setting(settings, "chlorophyllGlow") * 0.18 +
      setting(settings, "mineralPop") * 0.18 +
      setting(settings, "auraBloom") * 0.22 +
      rgbw.saturationBoost,
    0,
    360
  );
  const hue = clamp(
    settings.hue +
      setting(settings, "colorizeHue") * (setting(settings, "colorizeStrength") / 120) +
      channelInvert * 1.65 +
      spectralInvert * 2.15 -
      thermalInvert * 0.72 +
      redInvert * 0.38 -
      greenInvert * 0.24 +
      blueInvert * 0.52 +
      setting(settings, "redHueShift") * 0.42 +
      setting(settings, "greenHueShift") * 0.34 +
      setting(settings, "blueHueShift") * 0.46 +
      setting(settings, "aquaShift") * 0.36 +
      setting(settings, "purpleShift") * 0.44 +
      setting(settings, "orangeShift") * 0.3 +
      setting(settings, "skinToneWarmth") * 0.16 +
      setting(settings, "colorSeparation") * 0.28 +
      setting(settings, "nearIrBoost") * 0.28 -
      setting(settings, "nightScope") * 0.22 +
      rgbw.hueShift,
    -360,
    360
  );
  const sepia = clamp(
    settings.sepia +
      setting(settings, "whiteBalance") * 0.12 +
      Math.max(0, setting(settings, "temperature")) * 0.12 +
      thermalInvert * 0.36 +
      setting(settings, "orangeShift") * 0.16 +
      setting(settings, "thermalBlend") * 0.18,
    0,
    100
  );
  const grayscale = clamp(
    settings.grayscale +
      setting(settings, "threshold") * 0.2 -
      setting(settings, "vibrance") * 0.08 +
      lumaInvert * 0.42 +
      setting(settings, "xrayGhost") * 0.22 +
      setting(settings, "negativeDepth") * 0.16,
    0,
    100
  );
  const invert = clamp(
    settings.invert +
      setting(settings, "solarize") * 0.35 +
      classicInvert +
      lumaInvert * 0.62 +
      thermalInvert * 0.28 +
      selectiveInvertAverage * 0.32 +
      setting(settings, "negativeDepth") * 0.26,
    0,
    100
  );
  const blur = clamp(
    settings.blur +
      setting(settings, "softFocus") * 0.04 +
      setting(settings, "radialBlur") * 0.02 +
      setting(settings, "motionBlur") * 0.018 +
      setting(settings, "bokehBloom") * 0.018 +
      setting(settings, "skinSmooth") * 0.018 -
      setting(settings, "fineSharpen") * 0.018 -
      setting(settings, "sharpen") * 0.012 -
      setting(settings, "detailBoost") * 0.01 +
      setting(settings, "fisheye") * 0.006 +
      setting(settings, "barrelWarp") * 0.006,
    0,
    20
  );
  const glowRadius = clamp(
    settings.glow +
      setting(settings, "glowRadius") * 0.28 +
      setting(settings, "bloom") * 0.13 +
      setting(settings, "halation") * 0.18 +
      setting(settings, "edgeGlow") * 0.16 +
      setting(settings, "centerGlow") * 0.12 +
      setting(settings, "chromaticGlow") * 0.14 +
      setting(settings, "flareStreak") * 0.12 +
      setting(settings, "lightWrap") * 0.1,
    0,
    100
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
  const warm = settings.temperature > 0 ? `rgba(255,132,48,${settings.temperature / 260})` : `rgba(51,143,255,${Math.abs(settings.temperature) / 280})`;
  const tint = settings.tint > 0 ? `rgba(255,69,190,${settings.tint / 280})` : `rgba(67,255,122,${Math.abs(settings.tint) / 300})`;
  const rgbw = rgbwMixerInfluence(settings);
  const main = rgbwCss(settings, "main", clamp(0.14 + setting(settings, "overlayStrength") / 160 + rgbw.mainIntensity * 0.22, 0.08, 0.88));
  const secondary = rgbwCss(settings, "secondary", clamp(0.08 + setting(settings, "duotone") / 165 + rgbw.secondaryIntensity * 0.2, 0.04, 0.78));
  const third = rgbwCss(settings, "third", clamp(0.07 + setting(settings, "splitTone") / 260 + rgbw.thirdIntensity * 0.18, 0.03, 0.66));
  const highlight = rgbwCss(settings, "highlights", clamp(0.05 + rgbw.highlightsIntensity * 0.2 + setting(settings, "lightWrap") / 240, 0.02, 0.58));
  return {
    background: `linear-gradient(120deg, ${effect.overlayColor}, ${warm}, ${main}), linear-gradient(300deg, ${tint}, ${secondary}, transparent 62%), radial-gradient(circle at 50% 12%, ${third}, transparent 46%), radial-gradient(circle at 52% 22%, ${highlight}, transparent 32%)`,
    mixBlendMode: effect.blendMode,
    opacity: clamp(0.14 + settings.duotone / 150 + setting(settings, "overlayStrength") / 210 + rgbw.totalIntensity * 0.18 + setting(settings, "colorLeak") / 260, 0, 0.96)
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
  const infrared = `rgba(255, 48, 44, ${clamp(setting(settings, "infraredWash") / 150, 0, 0.68)})`;
  const ultraviolet = `rgba(144, 82, 255, ${clamp((setting(settings, "ultravioletWash") + setting(settings, "uvaFluorescence")) / 145, 0, 0.78)})`;
  const thermal = `rgba(255, 188, 30, ${clamp((setting(settings, "thermalBlend") + setting(settings, "thermalContour") + setting(settings, "heatEdge")) / 210, 0, 0.76)})`;
  const scanlineAlpha = clamp(setting(settings, "scanlines") / 160, 0, 0.62);
  const grainAlpha = clamp((setting(settings, "filmGrainSize") + setting(settings, "noiseMono") + setting(settings, "dust") * 0.5) / 210, 0, 0.62);
  const colorNoiseAlpha = clamp(setting(settings, "noiseColor") / 190, 0, 0.48);
  const scratchAlpha = clamp(setting(settings, "scratches") / 190, 0, 0.5);
  const split = clamp(setting(settings, "chromaticAberration") + setting(settings, "prismSplit") + setting(settings, "glitchShift") + setting(settings, "colorSeparation"), 0, 240);
  return {
    backgroundImage: `
      radial-gradient(circle at 18% 18%, ${highlights}, transparent ${clamp(28 + setting(settings, "bloom") * 0.22, 28, 54)}%),
      radial-gradient(circle at 84% 14%, rgba(255,255,255,${clamp(setting(settings, "lensFlare") / 110, 0, 0.66)}), transparent 24%),
      linear-gradient(${88 + setting(settings, "colorizeHue") * 0.2}deg, ${main}, ${secondary}, ${third}, transparent 72%),
      linear-gradient(90deg, ${infrared}, transparent 38%, ${ultraviolet}, transparent 70%, ${thermal}),
      linear-gradient(${setting(settings, "flareStreak") * 1.8 + 24}deg, transparent 34%, ${rgbwCss(settings, "highlights", clamp(setting(settings, "flareStreak") / 140, 0, 0.62))} 48%, transparent 62%),
      radial-gradient(circle at 50% 50%, ${rgbwCss(settings, "main", clamp(setting(settings, "centerGlow") / 160, 0, 0.58))}, transparent 36%),
      repeating-linear-gradient(88deg, rgba(255,255,255,${scratchAlpha}) 0 1px, transparent 1px 46px),
      repeating-radial-gradient(circle at 18% 24%, rgba(255,64,96,${colorNoiseAlpha}) 0 1px, transparent 1px 9px),
      repeating-radial-gradient(circle at 82% 64%, rgba(64,196,255,${colorNoiseAlpha}) 0 1px, transparent 1px 11px),
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
  context.save();
  context.globalAlpha = clamp(0.1 + settings.duotone / 150 + rgbw.totalIntensity * 0.12 + setting(settings, "colorLeak") / 320, 0, 0.88);
  context.globalCompositeOperation = canvasCompositeMode(effect.blendMode);
  context.fillStyle = effect.overlayColor;
  context.fillRect(0, 0, width, height);
  if (settings.temperature !== 0) {
    context.globalAlpha = Math.abs(settings.temperature) / 220;
    context.fillStyle = settings.temperature > 0 ? "rgb(255,128,42)" : "rgb(54,138,255)";
    context.fillRect(0, 0, width, height);
  }
  context.globalCompositeOperation = "screen";
  const mixerAlpha = clamp(setting(settings, "overlayStrength") / 160 + rgbw.totalIntensity * 0.16, 0, 0.72);
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
      (setting(settings, "bloom") +
        setting(settings, "halation") +
        setting(settings, "lensFlare") +
        setting(settings, "edgeGlow") +
        setting(settings, "centerGlow") +
        setting(settings, "auraBloom")) /
        330 +
        rgbw.highlightsIntensity * 0.08,
      0,
      0.82
    );
    const flare = context.createRadialGradient(width * 0.5, height * 0.52, 0, width * 0.5, height * 0.52, Math.max(width, height) * 0.46);
    flare.addColorStop(0, rgbwCss(settings, "highlights", 1));
    flare.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = flare;
    context.fillRect(0, 0, width, height);
  }
  if (setting(settings, "lightWrap") || setting(settings, "flareStreak") || setting(settings, "mirrorGhost")) {
    context.globalCompositeOperation = "screen";
    context.globalAlpha = clamp((setting(settings, "lightWrap") + setting(settings, "flareStreak") + setting(settings, "mirrorGhost")) / 360, 0, 0.64);
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
      (setting(settings, "nightScope") + setting(settings, "nearIrBoost") + setting(settings, "uvaFluorescence") + setting(settings, "thermalContour")) / 420,
      0,
      0.58
    );
    const spectralGradient = context.createLinearGradient(0, 0, 0, height);
    spectralGradient.addColorStop(0, `rgba(142, 82, 255, ${clamp(setting(settings, "uvaFluorescence") / 100, 0, 1)})`);
    spectralGradient.addColorStop(0.52, `rgba(80, 255, 126, ${clamp(setting(settings, "nightScope") / 100, 0, 1)})`);
    spectralGradient.addColorStop(1, `rgba(255, 58, 38, ${clamp(setting(settings, "thermalContour") / 100, 0, 1)})`);
    context.fillStyle = spectralGradient;
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

function paintSpecialOverlay(context, width, height, settings) {
  const rgbw = rgbwMixerInfluence(settings);
  context.save();
  context.filter = `blur(${clamp(setting(settings, "halo") * 0.03 + setting(settings, "softFocus") * 0.02 + setting(settings, "bokehBloom") * 0.015, 0, 6)}px)`;
  context.globalCompositeOperation =
    setting(settings, "colorDodge") > 24 ? "color-dodge" : setting(settings, "matte") > 24 ? "soft-light" : "screen";
  const washAlpha = clamp(
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
    (setting(settings, "infraredWash") +
      setting(settings, "ultravioletWash") +
      setting(settings, "thermalBlend") +
      setting(settings, "uvaFluorescence") +
      setting(settings, "thermalContour") +
      setting(settings, "heatEdge")) /
      520,
    0,
    0.76
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
    (setting(settings, "bloom") +
      setting(settings, "halation") +
      setting(settings, "lensFlare") +
      setting(settings, "edgeGlow") +
      setting(settings, "centerGlow") +
      setting(settings, "chromaticGlow")) /
      360,
    0,
    0.86
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
    context.globalAlpha = clamp((setting(settings, "flareStreak") + setting(settings, "lightWrap") + setting(settings, "mirrorGhost")) / 360, 0, 0.64);
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

function paintCanvasVignette(context, width, height, settings) {
  const alpha = clamp((setting(settings, "vignette") + setting(settings, "shadowDepth") * 0.24 + setting(settings, "negativeDepth") * 0.18) / 100, 0, 0.96);
  if (!alpha) return;
  context.save();
  context.globalCompositeOperation = "multiply";
  const radius = Math.max(width, height) * 0.72;
  const vignette = context.createRadialGradient(width / 2, height / 2, Math.max(width, height) * 0.2, width / 2, height / 2, radius);
  vignette.addColorStop(0, "rgba(255,255,255,1)");
  vignette.addColorStop(0.46, "rgba(255,255,255,1)");
  vignette.addColorStop(1, `rgba(0,0,0,${alpha * 0.82})`);
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);
  context.restore();
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
    r: clamp(128 + redDelta + whiteDelta * 0.72, 0, 255),
    g: clamp(128 + greenDelta + whiteDelta * 0.72, 0, 255),
    b: clamp(128 + blueDelta + whiteDelta * 0.72, 0, 255)
  };
}

function rgbwIntensity(settings, groupKey) {
  const defaults = rgbwDefaults(groupKey);
  const delta =
    Math.abs(setting(settings, `${groupKey}R`) - defaults.R) +
    Math.abs(setting(settings, `${groupKey}G`) - defaults.G) +
    Math.abs(setting(settings, `${groupKey}B`) - defaults.B) +
    Math.abs(setting(settings, `${groupKey}W`) - defaults.W);
  return clamp(delta / (255 * 4), 0, 1);
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
    brightnessBoost: (totalIntensity - 0.5) * 22 + highlightsIntensity * 8,
    contrastBoost: Math.abs(warmth) * 10 + Math.abs(greenMagenta) * 8,
    saturationBoost: totalIntensity * 18 + Math.max(redBias, greenBias, blueBias) / 255 * 12,
    hueShift: warmth * 34 - greenMagenta * 22
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
