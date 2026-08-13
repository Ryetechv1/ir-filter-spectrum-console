import SwiftUI
import AVFoundation

@main
struct SpectralTorchDimmerApp: App {
    var body: some Scene {
        WindowGroup {
            TorchView()
        }
    }
}

struct TorchView: View {
    @State private var brightness: Float = 0.5
    @State private var isOn = false
    @State private var statusMessage = "Torch ready"

    var body: some View {
        VStack(spacing: 30) {
            VStack(spacing: 8) {
                Text("Torch Dimmer")
                    .font(.largeTitle)
                    .bold()

                Text(statusMessage)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
            }

            Button(isOn ? "Turn Off" : "Turn On") {
                toggleTorch(on: !isOn)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)

            VStack(spacing: 12) {
                Slider(value: $brightness, in: 0.1...1.0, step: 0.05) {
                    Text("Brightness")
                }
                .onChange(of: brightness) { _, newValue in
                    guard isOn else { return }
                    setTorchBrightness(newValue)
                }

                Text("Level: \(Int(brightness * 100))%")
                    .font(.headline)
                    .monospacedDigit()
            }

            Text("Uses AVCaptureDevice.setTorchModeOn(level:) for true native iPhone torch brightness when the device supports torch control.")
                .font(.footnote)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding(28)
    }

    private func toggleTorch(on: Bool) {
        guard let device = Self.backCameraTorchDevice() else {
            isOn = false
            statusMessage = "No rear torch-capable camera found."
            return
        }

        do {
            try device.lockForConfiguration()
            defer { device.unlockForConfiguration() }

            if on {
                try device.setTorchModeOn(level: clampedTorchLevel(brightness))
                isOn = true
                statusMessage = "Torch on at \(Int(brightness * 100))%."
            } else {
                device.torchMode = .off
                isOn = false
                statusMessage = "Torch off."
            }
        } catch {
            isOn = device.torchMode == .on
            statusMessage = "Torch error: \(error.localizedDescription)"
        }
    }

    private func setTorchBrightness(_ level: Float) {
        guard let device = Self.backCameraTorchDevice() else {
            isOn = false
            statusMessage = "No rear torch-capable camera found."
            return
        }

        do {
            try device.lockForConfiguration()
            defer { device.unlockForConfiguration() }

            try device.setTorchModeOn(level: clampedTorchLevel(level))
            isOn = true
            statusMessage = "Torch level \(Int(level * 100))%."
        } catch {
            statusMessage = "Brightness error: \(error.localizedDescription)"
        }
    }

    private func clampedTorchLevel(_ level: Float) -> Float {
        min(max(level, 0.1), 1.0)
    }

    private static func backCameraTorchDevice() -> AVCaptureDevice? {
        let discovery = AVCaptureDevice.DiscoverySession(
            deviceTypes: [.builtInWideAngleCamera, .builtInDualCamera, .builtInTripleCamera],
            mediaType: .video,
            position: .back
        )

        if let device = discovery.devices.first(where: { $0.hasTorch && $0.isTorchModeSupported(.on) }) {
            return device
        }

        if let fallback = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back),
           fallback.hasTorch,
           fallback.isTorchModeSupported(.on) {
            return fallback
        }

        return nil
    }
}

#Preview {
    TorchView()
}
