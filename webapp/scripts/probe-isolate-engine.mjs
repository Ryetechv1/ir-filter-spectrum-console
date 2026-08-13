import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(resolve(root, "src", "CameraStudio.jsx"), "utf8");

const requiredMarkers = [
  "Smart Isolate Grouped Pixels",
  "AI-Orchestrated Defect / Distortion Isolation",
  "Pixel Color Target",
  "Pixel Size",
  "Pixel Weight",
  "Pixel Density",
  "Defect Sensitivity",
  "Distortion Response",
  "Grouping Uniformity",
  "Edge Repair",
  "Chroma Lock",
  "Artifact Suppression",
  "buildIsolateGroupedPixelModel",
  "applyIsolateGroupedPixelEngine",
  "isolateGroupedPixelsDefectSignal",
  "isolateGroupedPixelsDensitySignal",
  "DWT_ISOLATE_PROFILE",
  "dwtSubbandSignal",
  "dwt-adaptive-quantization-v1"
];

const missing = requiredMarkers.filter((marker) => !source.includes(marker));

if (missing.length) {
  console.error(`Missing isolate engine markers:\n${missing.map((marker) => `- ${marker}`).join("\n")}`);
  process.exit(1);
}

const groupSnippet = source.match(/function renderSmartSignalGroup\(group\) \{[\s\S]*?function renderSmartDarkEdgeGroup\(group\)/);
if (!groupSnippet) {
  console.error("Could not find Smart Signal group renderer.");
  process.exit(1);
}

const forbiddenMutations = ["setSelectedEffectId", "setManualSettings", "setSelectedCategory", "resetCameraSettings"];
const foundForbiddenMutation = forbiddenMutations.find((marker) => groupSnippet[0].includes(marker));
if (foundForbiddenMutation) {
  console.error(`Smart Isolate toggle must preserve the active preset, but found ${foundForbiddenMutation} in the toggle handler.`);
  process.exit(1);
}

if (!groupSnippet[0].includes("setSmartSignalEnabled")) {
  console.error("Smart Signal group renderer no longer toggles smartSignalEnabled.");
  process.exit(1);
}

console.log("Smart Isolate Grouped Pixels engine markers present.");
