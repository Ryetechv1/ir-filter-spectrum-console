# iPhone 16e 2S SK6812 Two-Board PCB v0.4

This package contains two separate 2-layer KiCad PCB designs:

- Main controller carrier: `iphone16e_2s_sk6812_main_v0_4.kicad_pcb`
- Compact LED/camera head: `esp32_cam_led_head_v0_4.kicad_pcb`

The included v0.4 Gerber zip packages were regenerated with KiCad 10 and passed DRC with zero violations and zero unconnected items on both boards.

## What Changed From v0.3

- The LEDs moved off the main phone-back carrier and onto a compact LED head board.
- The LED head uses the reference layout: RGBW 2 left of lens, RGBW 1 right of lens, UVA and IR centered below the lens.
- A 14-pin 1.0 mm FFC/ribbon cable connects the main board to the LED head board.
- The IR/UVA MOSFET drivers and current-limit resistors stay on the main board so the LED head can remain compact.
- The LED head receives regulated 5V from the main board. The webapp power toggle disables LED outputs in firmware.

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
- Verify the SK6812 5 mm RGBW LED pinout from your exact vendor before PCBA ordering. The generated footprint maps pin 1 to +5V, pin 2 to DIN, pin 3 to GND, and pin 4 to DOUT.
- Print both PCB outlines at 1:1 and test-fit them in the Speck case and printed shell before ordering.
- UVA and IR are eye hazards. Use shielding and UV-rated eye protection.
