# iPhone 16e 2S SK6812 Two-Board PCB v0.6

This package contains two separate 2-layer KiCad PCB designs:

- Main controller carrier: `iphone16e_2s_sk6812_main_v0_6.kicad_pcb`
- Compact LED/camera/Glass head: `esp32_cam_led_head_v0_6.kicad_pcb`

The included v0.6 Gerber zip packages were regenerated with KiCad 10 and checked with DRC.

## What Changed From v0.5

- Removed the flat ribbon/FFC connector from both PCBs.
- Added 14-pin JST-GH 1.25 mm locking wire-harness connectors on the main board and LED head board.
- Kept the same electrical pinout so firmware and LED/OLED behavior do not need to change.
- Kept the M5Stack Unit Glass transparent OLED connector and fab-layer outlines.

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

- Verify JST-GH harness pin 1 to pin 1 before powering the boards. Use a straight-through 14-conductor crimped harness.
- Verify the Unit Glass HY2.0 cable pinout before power: GND, 5V, SDA, SCL. If your module pulls I2C to 5V, add a bidirectional I2C level shifter before connecting to ESP32-CAM GPIO15/16.
- Verify the SK6812 5 mm RGBW LED pinout from your exact vendor before PCBA ordering. The generated footprint maps pin 1 to +5V, pin 2 to DIN, pin 3 to GND, and pin 4 to DOUT.
- The fab-layer outline marks the transparent glass/display area. The full M5Stack Unit Glass module body is larger, so the printed chamber must be checked against the complete module board and cable exit at 1:1 scale.
- Print both PCB outlines at 1:1 and test-fit them in the Speck case and printed shell before ordering.
- UVA and IR are eye hazards. Use shielding and UV-rated eye protection.
