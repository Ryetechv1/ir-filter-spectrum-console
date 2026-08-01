# iPhone Spectrum Hologram PCB v0.9 Planning Package

Status: planning/mechanical integration package, not an orderable Gerber release.

The previous `iphone16e_2s_sk6812_two_board_v0_8` package remains the DRC-clean backup order set for the original ESP32-CAM geometry. This v0.9 package updates the architecture for:

- ESP32-S3 N16R8 camera board with GC2145 ribbon camera
- ESP32-C6-LCD-1.47 display board for acrylic/glass hologram projection
- ideaspark ESP32 1.14 inch LCD board replaces the Arduino Nano as the LED driver
- Same 2S 7.4 V 450 mAh LiPo power target
- Same IR, UVA, two camera RGBW LEDs, and six acrylic RGBW LEDs

## Mechanical Intent

The camera chamber now has two active boards near the optical head:

```text
camera opening
  -> GC2145 lens and ribbon camera
  -> IR/UVA/RGBW LED cluster around the chamber
  -> 45 degree acrylic/glass projection sheet
  -> ESP32-C6 LCD positioned so its image reflects into the acrylic/glass
```

The ESP32-C6 LCD must remain serviceable. Do not permanently bury its USB-C port unless programming pads or a removable access path are added.

## Electrical Architecture

```text
2S LiPo -> charger/BMS -> fused switch -> 5 V buck rail
5 V rail -> ESP32 1.14 LCD driver
5 V rail -> SK6812 RGBW chain
5 V rail -> IR/UVA LED resistor + NMOS channels
5 V or USB-C -> ESP32-S3 camera board
5 V or USB-C -> ESP32-C6 LCD display board

ESP32-S3 GPIO1 TX -> ESP32 LCD GPIO16 RX2
ESP32 LCD GPIO17 TX2 -> ESP32-S3 GPIO2 RX
ESP32 LCD GPIO25 -> IR NMOS gate resistor
ESP32 LCD GPIO26 -> UVA NMOS gate resistor
ESP32 LCD GPIO27 -> 3.3 V-to-5 V buffer -> 330 ohm -> SK6812 DIN
```

The S3 and ESP32 LCD lighting driver are both 3.3 V logic, so the old Nano divider is removed. The ESP32-C6 display is controlled over Wi-Fi at `/hologram`; it does not require a hardwired data line to the lighting driver or S3 in the current prototype plan.

## Required Measurements Before Gerbers

Use `MEASUREMENT_WORKSHEET.md` for the printable checklist. Capture the final values in either `measurements_template.json` or `measurement_capture.csv` before regenerating KiCad geometry.

1. Exact ESP32-S3 camera board outline, mounting-hole positions, USB-C positions, antenna keepout, and header spacing.
2. Exact GC2145 camera ribbon board dimensions and lens optical-center offset.
3. Exact ESP32-C6-LCD-1.47 board outline, LCD active-area position, USB-C position, reset/boot button positions, antenna keepout, and mounting holes.
4. Acrylic/glass projection sheet thickness, angle, and slot depth.
5. FarmingtonSpeck/Presidio case camera-opening measurements on the actual case.
6. Clearance between the phone camera opening, external GC2145 lens, and projected hologram acrylic/glass.

## PCB Work To Do After Measurements

- Replace v0.8 ESP32-CAM head-board keepout with GC2145/S3 chamber keepouts.
- Add LCD board mounting/mechanical keepout layer for the C6 display.
- Add USB-C access cutouts for ESP32-S3 and ESP32-C6 boards or programming pogo pads.
- Keep the SK6812 chain order unchanged: camera right, camera left, acrylic 1 left/right, acrylic 2 left/right, acrylic 3 left/right.
- Keep IR/UVA NMOS/resistor values unchanged for the specified 5 mm LEDs.
- Re-run KiCad DRC and produce new BOM/CPL/Gerbers only after all physical modules are measured.

## Current Validated Firmware

```text
esp32_s3_gc2145_webapp
esp32_c6_hologram_display
esp32_lcd_rgbw_ir_uva_driver
```

Compile targets:

```text
arduino-cli compile --fqbn esp32:esp32:esp32s3 esp32_s3_gc2145_webapp
arduino-cli compile --fqbn esp32:esp32:esp32c6 esp32_c6_hologram_display
arduino-cli compile --fqbn esp32:esp32:esp32 esp32_lcd_rgbw_ir_uva_driver
```

## Folder Contents

```text
README_PCB_PLANNING.md    planning overview and blocking decisions
PINOUT.md                 S3, C6, ESP32 LCD driver, and SK6812 signal plan
PRELIMINARY_BOM.md        v0.9 module/BOM delta against the v0.8 baseline
MEASUREMENT_WORKSHEET.md  printable physical measurement checklist
measurements_template.json structured capture template for CAD/KiCad scripting
measurement_capture.csv   spreadsheet-friendly capture sheet
iphone16e_hologram_s3_c6_v0_9_MEASUREMENT_PACKAGE.zip
                          zipped measurement worksheet/templates for transfer
```
