# Prototype Arduino Sketches

Each prototype folder now contains up to four Arduino IDE sketch folders:

- `esp32_s3_camera_prototype_XX`: primary ESP32-S3 GC2145 camera/webapp firmware.
- `esp32_c6_hologram_prototype_XX`: ESP32-C6 1.47 inch LCD hologram display firmware.
- `nano_prototype_XX`: Arduino Nano lighting driver target for the same prototype stage.
- `esp32_cam_prototype_XX`: legacy ESP32-CAM OV2640 backup firmware from the pre-v0.9 build.

The staged sketches are generated from the canonical project sketches with a default prototype macro prepended for Arduino IDE/CLI compatibility. Use the primary S3/C6/Nano sketches for the current v0.9 prototype path. Use the legacy ESP32-CAM sketch only if you intentionally return to the older module.

Canonical production sketches:

```text
esp32_s3_gc2145_webapp
esp32_c6_hologram_display
nano_rgbw_ir_uva_driver
```

Legacy production backup:

```text
esp32_cam_ir_uv_webapp
```
