# Camera Studio Access

The Camera Studio is opened from the main console with the `Studio` button. It renders at:

```text
?studio=camera
```

## Security Model

- The browser asks for camera permission with `navigator.mediaDevices.getUserMedia()`.
- The video feed stays inside the visitor's browser. It is not uploaded to GitHub Pages, the ESP32 device, or any server.
- The access code is checked locally with SHA-256. The plaintext trusted code is not stored in this repository.
- This is a static-site trust gate, not backend authentication. Anyone with repository/source access can inspect the gate logic, so high-security deployments should move the code check to a server or identity provider.

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
