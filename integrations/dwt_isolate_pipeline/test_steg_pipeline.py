from pathlib import Path

import cv2
import numpy as np

from opencv_dataset_bridge import OpenCVFrameDataset, export_profile_json, probe_opencv_dataset


def test_opencv_dataset_bridge_reads_synthetic_frames():
    probe = probe_opencv_dataset()
    assert probe["frames"] == 3
    assert probe["shape"] == [128, 128, 3]
    assert probe["mean_edge_strength"] > 0
    assert probe["uses_synthetic_fallback"] is True


def test_opencv_dataset_bridge_reads_image_folder(tmp_path):
    frame = np.zeros((64, 64, 3), dtype=np.uint8)
    frame[:, :32] = (255, 32, 16)
    frame[:, 32:] = (12, 220, 255)
    image_path = tmp_path / "sample.png"
    assert cv2.imwrite(str(image_path), frame)

    dataset = OpenCVFrameDataset(tmp_path)
    frames = list(dataset)
    assert len(frames) == 1
    assert frames[0].shape == (128, 128, 3)
    assert 0 <= float(frames[0].mean()) <= 1


def test_browser_profile_export_shape(tmp_path):
    output = tmp_path / "dwt_isolate_profile.json"
    payload = export_profile_json(output)
    assert output.exists()
    assert payload["profile"]["profile_id"] == "dwt-adaptive-quantization-v1"
    assert payload["profile"]["wavelet"] == "haar"
    assert payload["opencvDatasetProbe"]["frames"] >= 1
