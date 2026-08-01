# IR Filter Project Transfer Validation

Date: 2026-08-01

Transferred into:

```text
C:\Users\alola\OneDrive\Documents\IR filter
```

Source archive:

```text
C:\Users\alola\Documents\Codex\2026-07-29\research-search-how-to-make-an - Copy.zip
```

## Webapp

Commands run:

```powershell
cd "C:\Users\alola\OneDrive\Documents\IR filter\webapp"
npm ci
npm run build
```

Result:

- Dependency install completed with 0 vulnerabilities.
- Vite production build completed successfully.
- Local dev server is running from the transferred workspace on `0.0.0.0:5173`.
- Local URL returned HTTP 200: `http://127.0.0.1:5173/`.
- LAN URL advertised by Vite: `http://10.0.0.231:5173/`.

Browser checks:

- Desktop render loaded `Spectrum Camera Console`.
- Prototype metadata, ESP32-S3 references, ESP32-C6 references, and hologram panel were visible.
- Mobile-width render had no horizontal overflow.
- Browser console warnings/errors: none.

## Arduino Compile Checks

Commands run from the transferred project root:

```powershell
arduino-cli compile --fqbn arduino:avr:nano .\nano_rgbw_ir_uva_driver
arduino-cli compile --fqbn esp32:esp32:esp32s3 .\esp32_s3_gc2145_webapp
arduino-cli compile --fqbn esp32:esp32:esp32c6 .\esp32_c6_hologram_display
arduino-cli compile --fqbn esp32:esp32:esp32cam .\esp32_cam_ir_uv_webapp
```

Results:

- Nano lighting driver: pass.
- ESP32-S3 GC2145 camera/web firmware: pass.
- ESP32-C6 LCD hologram display firmware: pass.
- Legacy ESP32-CAM OV2640 backup firmware: pass.

Recursive sketch folder/name check:

- 36 `.ino` files checked.
- All sketch folder names match their `.ino` filename.

## PCB Files

Active current-path package:

```text
hardware\pcb\iphone16e_hologram_s3_c6_v0_9
```

Status:

- v0.9 is a measurement/planning package, not an orderable Gerber release.
- It includes `README_PCB_PLANNING.md`, `PINOUT.md`, `PRELIMINARY_BOM.md`, `MEASUREMENT_WORKSHEET.md`, `measurement_capture.csv`, `measurements_template.json`, and `iphone16e_hologram_s3_c6_v0_9_MEASUREMENT_PACKAGE.zip`.

Orderable backup package:

```text
hardware\pcb\iphone16e_2s_sk6812_two_board_v0_8
```

Fresh KiCad 10 DRC reports generated during transfer:

```text
hardware\pcb\iphone16e_2s_sk6812_two_board_v0_8\transfer_drc_main_v0_8.json
hardware\pcb\iphone16e_2s_sk6812_two_board_v0_8\transfer_drc_head_v0_8.json
```

Result:

- Main controller carrier: 0 violations, 0 unconnected items.
- LED/camera head: 0 violations, 0 unconnected items.

Orderable backup zips present:

```text
iphone16e_2s_sk6812_main_v0_8_GERBERS_DRC_CLEAN.zip
esp32_cam_led_head_v0_8_GERBERS_DRC_CLEAN.zip
iphone16e_2s_sk6812_two_board_v0_8_BOM_CPL.zip
iphone16e_2s_sk6812_two_board_v0_8_FULL_ORDER_PACKAGE.zip
```

## Notes

- The ESP32-CAM path is preserved as legacy backup.
- The current primary path is ESP32-S3 camera + ESP32-C6 LCD hologram display + Arduino Nano LED driver.
- Hardware was not physically bench-tested during this transfer.
