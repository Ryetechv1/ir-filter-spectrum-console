#!/bin/bash
set -e
echo "Running validation suite..."
python -m pytest -v test_steg_pipeline.py
python opencv_dataset_bridge.py
python export_visualizer.py
echo "Package configuration successfully deployed."
