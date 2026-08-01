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
- When the full camera frame scrolls away, it becomes a hovering HUD preview that stays visible while scrolling. Tapping the HUD scrolls back to the full camera frame for downloads, snapshots, and recording controls.
- `Snapshot` downloads a local PNG with the current CSS/video effect stack painted into the image and adds it to the local capture shelf.
- `Start MP4` records a processed 1080P or 2K canvas stream as `.mp4` where the browser supports MP4 MediaRecorder.
- `Stop Recording` ends the current MP4 recording before the 3-minute cap.
- Four RGBW mixer groups drive live gradient color layers: Main, Secondary, Third, and Highlights.
- The adjustment surface includes 12 core photo sliders plus 50 advanced effect sliders for exposure-style controls, color channels, bloom/halation, scanlines, IR/UVA/thermal washes, and other photobooth effects.

## YouTube Channel Window

- The `YouTube channel` button opens a local GUI window for the Supernatural World channel.
- YouTube blocks the actual channel homepage from rendering inside third-party iframes, so the app uses the official embedded uploads playlist for the playable window.
- The popup also includes an in-app recent-upload browser with thumbnail cards that switch the embedded player to the selected video.
- API keys are not stored in the static GitHub Pages bundle. If automatic YouTube Data API refresh is needed later, put the key behind a server-side endpoint or a referrer-restricted backend worker.

Current trusted hash:

```text
89bf6309ac1633d01b1fc6af1c3e79fcb55464450e6db4534fd01084375c4a65
```

## Rotating The Code

Generate a new long code, hash it with SHA-256, then replace the hash in:

```text
webapp/src/CameraStudio.jsx
```

Only share the plaintext code directly with the trusted person.
