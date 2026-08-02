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
  const hudVideoRef = useRef(null);
  const cameraFrameRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const recordingCanvasRef = useRef(null);
  const recordingFrameRef = useRef(0);
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
  const overlayStyle = useMemo(() => buildOverlayStyle(selectedEffect, manualSettings), [manualSettings, selectedEffect]);
  const specialOverlayStyle = useMemo(() => buildSpecialOverlayStyle(manualSettings), [manualSettings]);
  const grainOpacity = useMemo(
    () => clamp((manualSettings.grain + setting(manualSettings, "filmGrainSize") + setting(manualSettings, "noiseMono") + setting(manualSettings, "dust")) / 260, 0, 0.72),
    [manualSettings]
  );
  const vignetteOpacity = useMemo(
    () => clamp((manualSettings.vignette + setting(manualSettings, "shadowDepth") * 0.24 + setting(manualSettings, "negativeDepth") * 0.18) / 100, 0, 0.96),
    [manualSettings]
  );
  const videoStyle = useMemo(
    () => ({
      filter: filterCss,
      imageRendering: manualSettings.pixelate > 48 ? "pixelated" : "auto"
    }),
    [filterCss, manualSettings.pixelate]
  );

  useEffect(() => {
    renderStateRef.current = { filterCss, selectedEffect, manualSettings, cameraFacing };
  }, [cameraFacing, filterCss, manualSettings, selectedEffect]);

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
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    const snapshotSize = getRenderedCameraFrameSize(cameraFrameRef.current, width, height);
    const canvas = document.createElement("canvas");
    canvas.width = snapshotSize.width;
    canvas.height = snapshotSize.height;
    const context = canvas.getContext("2d");
    drawStudioFrame(context, snapshotSize.width, snapshotSize.height, video, { filterCss, selectedEffect, manualSettings, cameraFacing });
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
            <li>120 local visual presets for IR-style, UVA-style, thermal, cinematic, monochrome, duotone, retro, and color-lab looks.</li>
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
            <video ref={videoRef} className={cameraFacing === "user" ? "is-mirrored" : ""} autoPlay playsInline muted style={videoStyle} />
            <div className="studio-color-overlay" style={overlayStyle} />
            <div className="studio-special-overlay" style={specialOverlayStyle} />
            <div className="studio-grain" style={{ opacity: grainOpacity }} />
            <div className="studio-vignette" style={{ opacity: vignetteOpacity }} />
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
              <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer">
                <ExternalLink size={16} />
                Open channel
              </a>
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
              <a href={YOUTUBE_UPLOADS_PLAYLIST_URL} target="_blank" rel="noreferrer">
                <Film size={16} />
                Open Uploads Player
              </a>
            </div>
          </section>
        </div>
      )}

      {cameraActive && cameraHudVisible && (
        <button className="camera-floating-hud" type="button" onClick={scrollToCameraFrame} aria-label="Return to full camera preview">
          <div className="camera-floating-hud-frame">
            <video ref={hudVideoRef} className={cameraFacing === "user" ? "is-mirrored" : ""} autoPlay playsInline muted style={videoStyle} />
            <div className="studio-color-overlay" style={overlayStyle} />
            <div className="studio-special-overlay" style={specialOverlayStyle} />
            <div className="studio-grain" style={{ opacity: grainOpacity }} />
            <div className="studio-vignette" style={{ opacity: vignetteOpacity }} />
            <div className="camera-corners" aria-hidden="true" />
            <div className="camera-live-badge">Live</div>
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

function getRenderedCameraFrameSize(frameElement, fallbackWidth, fallbackHeight) {
  if (!frameElement?.getBoundingClientRect) {
    return {
      width: Math.max(1, Math.round(fallbackWidth || 1280)),
      height: Math.max(1, Math.round(fallbackHeight || 720))
    };
  }
  const rect = frameElement.getBoundingClientRect();
  const deviceScale = clamp(window.devicePixelRatio || 1, 1, 2);
  const width = Math.round(rect.width * deviceScale);
  const height = Math.round(rect.height * deviceScale);
  if (width > 0 && height > 0) return { width, height };
  return {
    width: Math.max(1, Math.round(fallbackWidth || 1280)),
    height: Math.max(1, Math.round(fallbackHeight || 720))
  };
}

function drawStudioFrame(context, width, height, video, renderState) {
  const { filterCss, selectedEffect, manualSettings, cameraFacing } = renderState;
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
    context.filter = filterCss || buildFilterCss(manualSettings);
    if (cameraFacing === "user") {
      context.translate(width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(video, sx, sy, sw, sh, 0, 0, width, height);
  }
  context.restore();
  paintOverlay(context, width, height, selectedEffect, manualSettings);
  paintSpecialOverlay(context, width, height, manualSettings);
  paintCanvasGrain(context, width, height, manualSettings);
  paintCanvasVignette(context, width, height, manualSettings);
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
  context.globalAlpha = clamp(setting(settings, "overlayStrength") / 160 + rgbw.mainIntensity * 0.08, 0.04, 0.72);
  const linear = context.createLinearGradient(0, 0, width, height);
  linear.addColorStop(0, rgbwCss(settings, "main", 1));
  linear.addColorStop(0.5, rgbwCss(settings, "secondary", 1));
  linear.addColorStop(1, rgbwCss(settings, "third", 1));
  context.fillStyle = linear;
  context.fillRect(0, 0, width, height);
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
    const flare = context.createRadialGradient(width * 0.5, height * 0.14, 0, width * 0.5, height * 0.14, width * 0.58);
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
  context.globalAlpha = clamp(
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
  );

  const wash = context.createLinearGradient(0, 0, width, height);
  wash.addColorStop(0, rgbwCss(settings, "main", 1));
  wash.addColorStop(0.34, rgbwCss(settings, "secondary", 1));
  wash.addColorStop(0.68, rgbwCss(settings, "third", 1));
  wash.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = wash;
  context.fillRect(0, 0, width, height);

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
      360 +
      rgbw.highlightsIntensity * 0.1,
    0,
    0.86
  );
  if (glowAlpha) {
    context.globalCompositeOperation = "screen";
    context.globalAlpha = glowAlpha;
    const topGlow = context.createRadialGradient(width * 0.5, height * 0.18, 0, width * 0.5, height * 0.18, width * 0.55);
    topGlow.addColorStop(0, rgbwCss(settings, "highlights", 1));
    topGlow.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = topGlow;
    context.fillRect(0, 0, width, height);

    const centerGlow = context.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.42);
    centerGlow.addColorStop(0, rgbwCss(settings, "main", clamp(setting(settings, "centerGlow") / 120, 0, 0.7)));
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
  const { r, g, b } = rgbwComponents(settings, groupKey);
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${clamp(alpha, 0, 1)})`;
}

function rgbwIntensity(settings, groupKey) {
  const { r, g, b } = rgbwComponents(settings, groupKey);
  return clamp((r + g + b) / (255 * 3), 0, 1);
}

function rgbwMixerInfluence(settings) {
  const main = rgbwComponents(settings, "main");
  const secondary = rgbwComponents(settings, "secondary");
  const third = rgbwComponents(settings, "third");
  const highlights = rgbwComponents(settings, "highlights");
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
