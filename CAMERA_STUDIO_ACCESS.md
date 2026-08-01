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
- The access code is checked locally with SHA-256. The plaintext trusted code is not stored in this repository.
- This is a static-site trust gate, not backend authentication. Anyone with repository/source access can inspect the gate logic, so high-security deployments should move the code check to a server or identity provider.

## Camera Controls

- `Start Camera` opens the browser camera permission prompt.
- `Stop Camera` stops all active video tracks.
- `Flip Camera` toggles between front and rear camera requests after a stream is active.
- `Snapshot` downloads a local PNG with the current CSS/video effect stack painted into the image.
- Four RGBW mixer groups drive live gradient color layers: Main, Secondary, Third, and Highlights.
- The adjustment surface includes 12 core photo sliders plus 50 advanced effect sliders for exposure-style controls, color channels, bloom/halation, scanlines, IR/UVA/thermal washes, and other photobooth effects.

## Trusted User

Current trusted user label:

```text
Khiimori
```

Current trusted hash:

```text
41c2f45346727de86a361d793c1be4ac005f9d4b3d071dfd9433df206ba90874
```

## Rotating The Code

Generate a new long code, hash it with SHA-256, then replace the hash in:

```text
webapp/src/CameraStudio.jsx
```

Only share the plaintext code directly with the trusted person.
