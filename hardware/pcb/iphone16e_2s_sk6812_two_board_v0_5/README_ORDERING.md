# iPhone 16e 2S SK6812 Two-Board PCB v0.5

This package contains two separate 2-layer KiCad PCB designs:

- Main controller carrier: `iphone16e_2s_sk6812_main_v0_5.kicad_pcb`
- Compact LED/camera/Glass head: `esp32_cam_led_head_v0_5.kicad_pcb`

The included v0.5 Gerber zip packages were regenerated with KiCad 10 and passed DRC with zero violations and zero unconnected items on both boards.

## What Changed From v0.4

- Added the M5Stack Unit Glass transparent OLED as an external chamber-mounted module.
- Added a 4-pin HY2.0/JST-PH style connector on the head board for Unit Glass: GND, 5V, SDA, SCL.
- Routed ESP32-CAM IO15/IO16 through the 14-pin FFC as Glass SDA/SCL.
- Added fab-layer outlines for the 42.04 x 27.22 mm glass and 35.05 x 18 mm active display area.
- The Glass Unit is a blue 1-bit transparent OLED. RGBW/gradient webapp controls are previewed in color and mapped to monochrome OLED brightness/dither output.

## Power Compatibility

This is still optimized for the selected OVONIC 2S 7.4V 450mAh LiPo pack.

Use a proper 2S/8.4V USB-C LiPo charger/BMS plus a 2S-to-5V buck regulator rated 1A minimum, 2A preferred.

Do not use the 3S/12.6V Adeept charger module with this 2S battery.

## Suggested Fab Settings

- 2 layers for each board
- FR-4, 1.6 mm for the main board
- FR-4, 0.8 mm or 1.0 mm recommended for the LED head if your shell needs a lower profile
- 1 oz copper acceptable for this low-current LED version, 2 oz preferred
- Lead-free HASL or ENIG

## Important Assembly Checks

- Verify FFC pin 1 to pin 1 before powering the boards. Use a 1.0 mm-pitch 14-conductor FFC/FPC cable.
- Verify the Unit Glass HY2.0 cable pinout before power: GND, 5V, SDA, SCL. If your module pulls I2C to 5V, add a bidirectional I2C level shifter before connecting to ESP32-CAM GPIO15/16.
- Verify the SK6812 5 mm RGBW LED pinout from your exact vendor before PCBA ordering. The generated footprint maps pin 1 to +5V, pin 2 to DIN, pin 3 to GND, and pin 4 to DOUT.
- The fab-layer outline marks the transparent glass/display area. The full M5Stack Unit Glass module body is larger, so the printed chamber must be checked against the complete module board and cable exit at 1:1 scale.
- Print both PCB outlines at 1:1 and test-fit them in the Speck case and printed shell before ordering.
- UVA and IR are eye hazards. Use shielding and UV-rated eye protection.
