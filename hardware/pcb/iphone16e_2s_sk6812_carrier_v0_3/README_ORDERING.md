# iPhone 16e 2S SK6812 Carrier PCB v0.3

This KiCad 8 carrier board is updated for:

- OVONIC 2S 7.4V 450mAh LiPo long pack, 61.9mm x 16.3mm x 13.4mm.
- Proper 2S/8.4V USB-C LiPo charger/BMS.
- Separate solder pads for 2S buck input and regulated 5V buck output.
- 950nm 5mm IR LED with a 100 ohm current-limit resistor.
- 375nm 5mm UVA LED with a 68 ohm current-limit resistor.
- Two SK6812 5mm RGBW LEDs chained from one Nano data pin.
- Arduino Nano retained.
- ESP32-CAM retained for Wi-Fi/web/camera.
- Solder pads instead of plug connectors for power and LED wiring.

## Mechanical Target

Board outline is 70mm x 136mm with a 36mm x 42mm top-left physical camera cutout. This is a conservative keep-out for the Speck Presidio Perfect-Clear ClickLock clear case family. Exact camera-opening dimensions are not published on the retailer/manufacturer pages I found, so print this PCB at 1:1 and verify against your actual case before ordering.

Battery shell allowance: reserve at least 64mm x 18mm x 15mm for the OVONIC pack plus clearance, insulation, and strain relief.

## Required External Modules

- Proper 2S/8.4V USB-C LiPo charger/BMS.
- 2S-to-5V buck regulator, 1A minimum, 2A recommended.
- Inline fuse near battery positive.
- Main switch.

The 3S/12.6V Adeept charger board is not compatible with this 2S battery. Use a 2S/8.4V LiPo charger/BMS instead.

## Suggested Fab Settings

- 2 layers
- FR-4, 1.6mm
- 1oz copper acceptable for this low LED current version, 2oz preferred
- Lead-free HASL or ENIG

## Assembly Notes

The SK6812 5mm LED pinout can vary by vendor. This PCB exposes labeled solder pads instead of assuming one package pinout. Wire each LED to the labeled +5V/DIN/GND/DOUT pads.

UVA and IR are eye hazards. Build a shroud and test at low duty.
