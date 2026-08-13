"""OpenCV dataset bridge and browser profile export for the DWT isolate pipeline.

This module keeps the heavy PyTorch/DWT code optional. The web app consumes the
small JSON profile emitted here, while full training/validation can use the
downloaded torch modules when the environment has those dependencies installed.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass
from pathlib import Path
import json
import math
from typing import Iterable, Iterator

import cv2
import numpy as np


IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tif", ".tiff"}


@dataclass(frozen=True)
class DWTAdaptiveProfile:
    """Compact profile consumed by the browser isolate engine."""

    profile_id: str
    version: str
    source: str
    wavelet: str
    low_frequency_weight: float
    luminance_noise_weight: float
    chrominance_noise_weight: float
    digital_noise_weight: float
    quantization_floor: float
    quantization_ceiling: float
    defect_threshold_bias: float
    density_gain: float
    edge_gain: float
    chroma_lock_gain: float
    artifact_suppression_gain: float
    browser_notes: list[str]


def build_default_profile() -> DWTAdaptiveProfile:
    return DWTAdaptiveProfile(
        profile_id="dwt-adaptive-quantization-v1",
        version="2026-08-12",
        source="integrations/dwt_isolate_pipeline",
        wavelet="haar",
        low_frequency_weight=0.38,
        luminance_noise_weight=0.8,
        chrominance_noise_weight=1.5,
        digital_noise_weight=1.2,
        quantization_floor=0.035,
        quantization_ceiling=0.28,
        defect_threshold_bias=0.045,
        density_gain=1.32,
        edge_gain=1.18,
        chroma_lock_gain=1.1,
        artifact_suppression_gain=1.24,
        browser_notes=[
            "Profile derives from AdaptiveDWTStegEncoder subband weights.",
            "The browser uses deterministic canvas pixel math, not PyTorch.",
            "Smart isolate is additive and must preserve the active preset stack.",
        ],
    )


class OpenCVFrameDataset:
    """Tiny iterable OpenCV dataset adapter for images or generated smoke frames."""

    def __init__(self, root: str | Path | None = None, size: tuple[int, int] = (128, 128)):
        self.root = Path(root) if root else None
        self.size = size
        self.paths = self._collect_paths(self.root) if self.root else []

    def __len__(self) -> int:
        return len(self.paths) if self.paths else 3

    def __iter__(self) -> Iterator[np.ndarray]:
        if self.paths:
            for path in self.paths:
                frame = cv2.imread(str(path), cv2.IMREAD_COLOR)
                if frame is None:
                    continue
                yield self._normalize(frame)
            return
        yield from self._synthetic_frames()

    def _collect_paths(self, root: Path | None) -> list[Path]:
        if not root or not root.exists():
            return []
        return sorted(
            path
            for path in root.rglob("*")
            if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
        )

    def _normalize(self, frame: np.ndarray) -> np.ndarray:
        resized = cv2.resize(frame, self.size, interpolation=cv2.INTER_AREA)
        return resized.astype(np.float32) / 255.0

    def _synthetic_frames(self) -> Iterable[np.ndarray]:
        width, height = self.size
        x = np.linspace(0, 1, width, dtype=np.float32)
        y = np.linspace(0, 1, height, dtype=np.float32)
        grid_x, grid_y = np.meshgrid(x, y)
        for phase in (0.0, 0.33, 0.66):
            heat = (np.sin((grid_x + phase) * math.tau) + np.cos((grid_y - phase) * math.tau)) * 0.25 + 0.5
            block = np.zeros_like(heat)
            block[18:48, 16:54] = 1.0
            block[72:112, 78:116] = 0.7
            diagonal = (np.abs(grid_x - grid_y + phase * 0.25) < 0.02).astype(np.float32)
            heat = np.clip(heat * 0.72 + block * 0.22 + diagonal * 0.18, 0, 1)
            edges = cv2.Canny((heat * 255).astype(np.uint8), 40, 120).astype(np.float32) / 255.0
            frame = np.dstack(
                [
                    np.clip(heat + edges * 0.35, 0, 1),
                    np.clip(grid_x * 0.65 + heat * 0.35, 0, 1),
                    np.clip(1 - grid_y * 0.75 + edges * 0.25, 0, 1),
                ]
            )
            yield frame.astype(np.float32)


def probe_opencv_dataset(root: str | Path | None = None) -> dict[str, object]:
    dataset = OpenCVFrameDataset(root=root)
    frames = list(dataset)
    if not frames:
        raise RuntimeError("OpenCV dataset probe found no readable frames.")

    lumas = []
    edge_strengths = []
    for frame in frames:
        gray = cv2.cvtColor((frame * 255).astype(np.uint8), cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 40, 120)
        lumas.append(float(gray.mean() / 255.0))
        edge_strengths.append(float(edges.mean() / 255.0))

    return {
        "frames": len(frames),
        "shape": list(frames[0].shape),
        "mean_luma": round(float(np.mean(lumas)), 4),
        "mean_edge_strength": round(float(np.mean(edge_strengths)), 4),
        "opencv_version": cv2.__version__,
        "uses_synthetic_fallback": not bool(dataset.paths),
    }


def export_profile_json(path: str | Path, root: str | Path | None = None) -> dict[str, object]:
    profile = build_default_profile()
    payload = {
        "profile": asdict(profile),
        "opencvDatasetProbe": probe_opencv_dataset(root=root),
    }
    output_path = Path(path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return payload


if __name__ == "__main__":
    output = Path(__file__).resolve().parent / "exports" / "dwt_isolate_profile.json"
    payload = export_profile_json(output)
    print(json.dumps(payload, indent=2))
