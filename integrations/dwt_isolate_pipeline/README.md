# DWT Isolate Pipeline Integration

This package imports the local module layout supplied for the AI-Orchestrated
Defect / Distortion Isolation engine:

- `models.py` - adaptive DWT encoder/extractor/evaluator modules.
- `noise_loss.py` - multi-head noise loss weights.
- `export_visualizer.py` - OpenCV export visualizer.
- `opencv_dataset_bridge.py` - OpenCV dataset probe and browser JSON profile exporter.
- `test_steg_pipeline.py` - smoke tests for OpenCV dataset wiring and profile export.
- `run_pipeline.sh` / `run_pipeline.ps1` - shell runners for validation and export.

## Web App Contract

The browser app cannot run PyTorch, CUDA, or OpenCV directly from GitHub Pages.
Instead, this package exports a compact profile:

```text
exports/dwt_isolate_profile.json
```

That profile is copied into:

```text
webapp/public/assets/dwt-isolate/dwt_isolate_profile.json
```

The Camera Studio uses matching constants in `CameraStudio.jsx` to weight the
Smart Isolate Grouped Pixels pass. Enabling that pass must not change the active
preset, active category, selected media, or adjustment stack; it only layers the
DWT-style quantization profile on top of whatever filter is already active.

## Local Commands

PowerShell:

```powershell
python -m pip install -r requirements.txt
.\run_pipeline.ps1
```

Git Bash / WSL-style shell:

```bash
python -m pip install -r requirements.txt
bash run_pipeline.sh
```

Docker:

```bash
docker compose up --build
```

The Docker path expects NVIDIA container runtime support. The local shell path
only needs Python packages for the OpenCV smoke test and visualizer.

Install `requirements-gpu.txt` only when running the full PyTorch/DWT modules
outside Docker.

## AI-Q Notes

This integration is AI-Q-ready, but it does not assume a live AI-Q backend. The
current app remains a static browser app plus local Python validation package.
If an AI-Q backend is later deployed, it can consume this package as an agent
skill/tool target and return updated `dwt_isolate_profile.json` artifacts.
