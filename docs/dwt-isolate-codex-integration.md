# DWT Adaptive Quantization Integration

## Purpose

The AI-Orchestrated Defect / Distortion Isolation module in Camera Studio now
has a local DWT adaptive quantization package under:

```text
integrations/dwt_isolate_pipeline/
```

The package imports the user-supplied `noise_loss.py`, `models.py`, and
`export_visualizer.py` files and adds an OpenCV dataset bridge so Codex can
validate image-frame ingestion without requiring a browser camera stream.

## Browser Rule

Enabling **Smart Isolate Grouped Pixels** must preserve the current camera state:

- active preset
- active preset category
- manual adjustment stack
- equation-generated settings
- overlay media stack
- paused/live camera state

The toggle only changes `smartSignalEnabled.isolateGroupedPixels`. The DWT
profile is additive and runs after the active preset has already rendered.

## Validation Commands

```powershell
cd "C:\Users\alola\OneDrive\Documents\IR filter\integrations\dwt_isolate_pipeline"
python -m pip install -r requirements.txt
.\run_pipeline.ps1
```

Shell execution mode:

```bash
cd integrations/dwt_isolate_pipeline
bash run_pipeline.sh
```

The runner executes:

1. `python -m pytest -v test_steg_pipeline.py`
2. `python opencv_dataset_bridge.py`
3. `python export_visualizer.py`

## Generated Browser Profile

The Python bridge exports:

```text
integrations/dwt_isolate_pipeline/exports/dwt_isolate_profile.json
```

The app consumes the mirrored public asset:

```text
webapp/public/assets/dwt-isolate/dwt_isolate_profile.json
```

The active runtime constants live in:

```text
webapp/src/CameraStudio.jsx
```

Search for `DWT_ISOLATE_PROFILE`.

The current browser profile includes higher default sensitivity plus detector
gains for fine grain, speckle/salt noise, banding, block artifacts, chroma
noise, hot pixels, shadow noise, highlight noise, edge shimmer, and temporal
flicker. These controls remain additive and should not replace the selected
camera preset.

## NVIDIA AI-Q Readiness

This package is ready to be wrapped by an AI-Q agent skill/tool later, but it
does not require a live AI-Q backend. If an AI-Q backend is available, use it to
generate updated profile JSON artifacts and copy them into the public asset
path above.
