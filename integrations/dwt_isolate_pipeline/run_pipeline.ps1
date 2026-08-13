$ErrorActionPreference = "Stop"

Write-Host "Running DWT isolate pipeline validation suite..."
python -m pytest -v test_steg_pipeline.py
python opencv_dataset_bridge.py
python export_visualizer.py
Write-Host "Package configuration successfully deployed."
