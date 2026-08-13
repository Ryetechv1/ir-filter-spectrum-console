# Camera Studio Access

The Camera Studio is opened from the main console with the `Studio` button. It renders at:

```text
?studio=camera
```

## Security Model

- The browser asks for camera permission only after unlock and a user click on `Start Camera`.
- The camera request uses `navigator.mediaDevices.getUserMedia({ video: true })`.
- The `Flip Camera` button restarts the local stream with a front/rear `facingMode` request where the browser supports it.
- The video feed stays inside the visitor's browser. It is not uploaded to GitHub Pages, the ESP32 device, or any server.
- MP4 recordings are generated from a local processing canvas so studio filters are applied to the saved video. Recording stops automatically at 3 minutes.
- The local capture shelf stores the latest 3 photos/videos as browser object URLs for the current browser session.
- The access code is checked locally with SHA-256. The plaintext trusted code is not stored in this repository.
- This is a static-site trust gate, not backend authentication. Anyone with repository/source access can inspect the gate logic, so high-security deployments should move the code check to a server or identity provider.

## Camera Controls

- `Start Camera` opens the browser camera permission prompt.
- `Stop Camera` stops all active video tracks.
- `Flip Camera` toggles between front and rear camera requests after a stream is active.
- `Rear Flashlight` requests the rear camera when needed and toggles the device torch with `MediaStreamTrack.applyConstraints({ advanced: [{ torch }] })` when the phone/browser exposes that capability.
- `Flashlight Studio` adds three managed rear-torch modes: `Hold Torch` for persistent on/off use, `Lock Rear Torch` for rear-stream lock/reapply behavior, and `Start Strobe` with an 80ms-2000ms interval slider. The panel includes a local debug log for unsupported streams, failed constraints, and strobe state changes.
- `Snapshot` downloads a local PNG with the current CSS/video effect stack painted into the image and adds it to the local capture shelf.
- `Start MP4` records a processed 1080P or 2K canvas stream as `.mp4` where the browser supports MP4 MediaRecorder.
- `Stop Recording` ends the current MP4 recording before the 3-minute cap.
- All visual effect presets are compiled through a 500% intensity amplifier. The amplifier boosts numeric preset settings away from their neutral value and increases preset overlay alpha while clamping to each control's safe range.
- Four RGBW mixer groups drive live gradient color layers and the main filter math: Main, Secondary, Third, and Highlights.
- Ten inversion controls add Classic RGB Invert, Luma Negative, Channel Swap Invert, Spectral Invert, Thermal Black-Hot Invert, Red Channel Invert, Green Channel Invert, Blue Channel Invert, Shadow Range Invert, and Highlight Range Invert.
- The adjustment surface is grouped into dropdown sections. It includes 12 core photo sliders, 10 inversion sliders, smart darker-edge controls, local Spatial Recognition Studio controls, 20 smart signal engines, the expanded Smart Isolate Grouped Pixels DWT/noise defect-distortion engine with 31 controls, Thermal Studio A-O hotspot recoloring, and 100 advanced effect sliders for exposure-style controls, color channels, bloom/halation, scanlines, IR/UVA/thermal washes, and other photobooth effects.
- The smart signal engines are local image-processing tools only. They do not identify people, match identities, store biometrics, or use face/wolf recognition.

## Spatial Recognition Studio

- Spatial Recognition Studio adapts the imported point-cloud prototype into the browser camera pipeline without adding heavy Three.js or LAS loader dependencies to the live static app.
- The preserved prototype handoff lives in `integrations/spatial_recognition_prototype/` for future Codex import work.
- The studio estimates pseudo-depth, contour bands, point-cloud dots, field curvature, and mesh overlays from visible luminance/edge gradients in the current camera/compositor canvas.
- The spatial pass is local and visual-only. It does not identify people, perform biometric matching, store a face model, or upload camera frames.

## AI-Orchestrated Defect / Distortion Isolation

- The Smart Isolate Grouped Pixels engine now includes an imported DWT adaptive quantization profile.
- The local Python package lives in `integrations/dwt_isolate_pipeline/` and imports `noise_loss.py`, `models.py`, and `export_visualizer.py`.
- The package validates OpenCV dataset hooks with `test_steg_pipeline.py` and exports `dwt_isolate_profile.json` for the static web app.
- Enabling Smart Isolate Grouped Pixels preserves the current preset/filter and layers the DWT-weighted grouping pass on top of the existing camera output.
- `DWT Isolation Studio` is a dedicated popup GUI for the imported profile. It shows the active preset, DWT status, profile parameters, profile JSON links, a detector map, and the Smart Isolate sliders without replacing the current filter/preset.
- The DWT/noise layer now exposes stronger sensitivity plus detectors for grain, speckle/salt noise, banding, block artifacts, chroma noise, hot pixels, shadow noise, highlight noise, edge shimmer, and temporal flicker.

## YouTube Channel Window

- The `YouTube channel` button opens a local GUI window for the Supernatural World channel.
- YouTube blocks the actual channel homepage from rendering inside third-party iframes, so the app uses the official embedded uploads playlist for the playable window.
- The popup also includes an in-app recent-upload browser with thumbnail cards that switch the embedded player to the selected video.
- API keys are not stored in the static GitHub Pages bundle. If automatic YouTube Data API refresh is needed later, put the key behind a server-side endpoint or a referrer-restricted backend worker.

Current trusted hash:

```text
5d24654cf27da2785c1bfcf4af2449005fcf4895fed21df42828a9188969c5cd
```

## Rotating The Code

Generate a new long code, hash it with SHA-256, then replace the hash in:

```text
webapp/src/CameraStudio.jsx
```

Only share the plaintext code directly with the trusted person.
