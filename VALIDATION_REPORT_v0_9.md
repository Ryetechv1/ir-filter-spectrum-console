# v0.9 Hologram/S3 Update Validation Report

Date: 2026-07-31

## Backup

Pre-hologram backup created before edits:

```text
backups/pre_hologram_20260731_175914
C:\Users\alola\OneDrive\Documents\Arduino\019fb0a6-5215-7131-a62e-84994a0bef41\backups\pre_hologram_20260731_175914
```

## Arduino CLI

Validated with `arduino-cli 1.5.1` and `esp32:esp32 3.3.11`.

Installed display dependency:

```text
arduino-cli lib install "GFX Library for Arduino"
```

Compile checks:

```text
arduino-cli compile --fqbn esp32:esp32:esp32 esp32_lcd_rgbw_ir_uva_driver
arduino-cli compile --fqbn esp32:esp32:esp32s3 esp32_s3_gc2145_webapp
arduino-cli compile --fqbn esp32:esp32:esp32c6 esp32_c6_hologram_display
arduino-cli compile --fqbn esp32:esp32:esp32cam esp32_cam_ir_uv_webapp
arduino-cli compile --fqbn esp32:esp32:esp32 prototype_sketches/prototype_05_production_pcb/esp32_lcd_driver_prototype_05
```

All commands above completed successfully after the Arduino Nano lighting driver was replaced by the ESP32 1.14 inch LCD lighting driver. The remaining prototype sketches were recursively checked for matching Arduino folder names and correct default prototype macros; they are mechanically generated from the same compiled roots.

## Webapp

Build check:

```text
npm run build
```

Result: Vite build completed successfully.

Browser checks against `http://127.0.0.1:5173/`:

- Desktop viewport: Prototype 5 selection, hologram panel visible, display address placeholder `http://192.168.8.1`, S3/C6 build files visible, zero console/page errors.
- Mobile viewport 390 x 844: prototype, hologram, viewer, and lighting panels visible; no horizontal overflow; zero console/page errors.

## PCB

Created v0.9 PCB planning package:

```text
hardware/pcb/iphone16e_hologram_s3_c6_v0_9/
```

This is not an orderable Gerber release yet. It intentionally requires physical measurements of the ESP32-S3 board, GC2145 camera module, ESP32-C6 LCD board, acrylic/glass projection sheet, and phone case camera opening before KiCad geometry and Gerbers are regenerated.
