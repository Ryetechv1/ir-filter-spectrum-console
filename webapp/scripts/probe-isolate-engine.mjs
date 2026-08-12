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
  "isolateGroupedPixelsDensitySignal"
];

const missing = requiredMarkers.filter((marker) => !source.includes(marker));

if (missing.length) {
  console.error(`Missing isolate engine markers:\n${missing.map((marker) => `- ${marker}`).join("\n")}`);
  process.exit(1);
}

console.log("Smart Isolate Grouped Pixels engine markers present.");
