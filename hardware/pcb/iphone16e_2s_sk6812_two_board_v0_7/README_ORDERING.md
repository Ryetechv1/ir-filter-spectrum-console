# iPhone 16e 2S SK6812 Two-Board PCB v0.7

This package contains two separate 2-layer KiCad PCB designs:

- Main controller carrier: `iphone16e_2s_sk6812_main_v0_7.kicad_pcb`
- Compact LED/camera head: `esp32_cam_led_head_v0_7.kicad_pcb`

The included v0.7 Gerber zip packages were regenerated with KiCad 10 and checked with DRC.

## What Changed From v0.6

- Removed the transparent OLED from the active build.
- Removed the head-board Unit Glass connector and display fab outlines.
- Removed ESP32-CAM IO15/IO16 I2C routing from the main board and inter-board harness.
- Kept the 14-pin JST-GH 1.25 mm locking wire-harness connectors; former OLED pins are spare.

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
- Verify the SK6812 5 mm RGBW LED pinout from your exact vendor before PCBA ordering. The generated footprint maps pin 1 to +5V, pin 2 to DIN, pin 3 to GND, and pin 4 to DOUT.
- Print both PCB outlines at 1:1 and test-fit them in the Speck case and printed shell before ordering.
- UVA and IR are eye hazards. Use shielding and UV-rated eye protection.
