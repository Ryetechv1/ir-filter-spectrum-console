# Preliminary v0.9 BOM Delta

This is a planning BOM delta for the S3/C6 hologram update. Use the v0.8 BOM/CPL files as the electrical baseline for resistors, MOSFETs, SK6812 LEDs, IR/UVA LED channels, battery input, buck/charger module pads, and replace the old Nano carrier area with the ESP32 1.14 inch LCD driver footprint/headers.

## New / Changed Modules

| Qty | Item | Notes |
|---:|---|---|
| 1 | ESP32-S3 N16R8 camera development board | Primary camera/web controller. Confirm exact board outline before PCB revision. |
| 1 | GC2145 ribbon camera module | Primary sensor. Confirm ribbon connector orientation and lens center. |
| 1 | ideaspark ESP32 1.14 inch LCD solder-pin board | Replaces the Arduino Nano lighting controller. Uses ESP32-WROOM-32, CH340 USB-C, and onboard ST7789 135x240 status LCD. |
| 1 | ESP32-C6-LCD-1.47 ST7789 display board | Hologram projection display. Needs USB-C or programming access. |
| 1 | 45 degree clear acrylic/glass projection sheet | Thickness and slot angle define the housing and board keepouts. |
| 1 | Optional matte-black camera chamber insert | Reduces internal reflections around LEDs and camera lens. |

## Unchanged Electrical Components

| Qty | Item | Rating / Function |
|---:|---|---|
| 1 | ESP32 1.14 LCD driver | LED driver controller retained. |
| 1 | 2S 7.4 V 450 mAh LiPo pack | OVONIC long pack target, XT30 plug. |
| 1 | 5 V buck regulator | Size/rating must support the ESP32 LCD driver, S3/C6 if rail-powered, and LED load. |
| 1 | 74AHCT125, SN74AHCT1G125, or equivalent level shifter | Converts ESP32 GPIO27 3.3 V SK6812 data to a 5 V-compatible LED data signal. |
| 2 | AO3400A or equivalent logic-level N-MOSFET | IR and UVA low-side switching. |
| 2 | 150 ohm resistors | MOSFET gate series resistors. |
| 2 | 100k resistors | MOSFET gate pulldowns. |
| 1 | 100 ohm resistor | 950 nm IR LED current limit from 5 V. |
| 1 | 68 ohm resistor | 375 nm UVA LED current limit from 5 V. |
| 1 | 330 ohm resistor | SK6812 data-line series resistor. |
| 1 | 47 uF to 100 uF capacitor | SK6812 5 V rail local bulk capacitor. |
| 8 | SK6812 RGBW 5 mm LEDs | 2 camera LEDs plus 6 acrylic-square LEDs. |
| 1 | 950 nm 5 mm IR LED | Max continuous current 50 mA. |
| 1 | 375 nm 5 mm UVA LED | Typical 25-30 mA continuous current. |

## Orderable PCB Status

Do not order v0.9 Gerbers yet. This folder is a planning package only until the new S3 and C6 modules are measured and the KiCad geometry is regenerated.
