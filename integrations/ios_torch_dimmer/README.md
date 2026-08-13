# iOS Torch Dimmer Integration

This folder contains a complete SwiftUI torch-dimmer app for native iPhone builds.

The web camera studio can request browser torch on/off with `MediaStreamTrack.applyConstraints({ advanced: [{ torch }] })`, but mobile browsers generally do not expose smooth torch brightness. This native SwiftUI integration uses AVFoundation directly:

```swift
try device.setTorchModeOn(level: brightness)
```

## Files

- `TorchDimmerApp.swift` - complete SwiftUI app with a torch on/off button and `0.1...1.0` brightness slider.
- `Info.plist` - includes `NSCameraUsageDescription` because the torch is part of the camera hardware.

## Xcode Import

1. Create a new iOS SwiftUI app in Xcode.
2. Replace the generated app/view file with `TorchDimmerApp.swift`.
3. Add the `NSCameraUsageDescription` key from `Info.plist` to the app target's Info settings.
4. Run on a physical iPhone. The Simulator does not expose a real torch.

## Implementation Notes

- Uses the rear torch-capable camera when available.
- Calls `lockForConfiguration()` before changing torch state.
- Uses `defer { device.unlockForConfiguration() }` so the capture device unlocks safely.
- Clamps brightness to `0.1...1.0`.
- Updates slider changes live while the torch is on.

## Web App Boundary

GitHub Pages cannot run AVFoundation or native SwiftUI code. Keep the React Flashlight Studio as a browser fallback and use this native iOS app when true variable torch brightness is required.
