# 14-Pin JST-GH Inter-Board Harness Pinout

Use one crimped 14-conductor JST-GH style wire harness between the main board J8 and the LED head board J1.

PCB connector footprint on both boards:

- `Connector_JST:JST_GH_SM14B-GHS-TB_1x14-1MP_P1.25mm_Horizontal`
- Matching cable housing: JST `GHR-14V-S` or compatible
- Matching crimp terminal family: JST GH 1.25 mm terminals, commonly `SSHL-002T-P0.2`

The generated PCBs use the same pin numbers on both ends:

| Pin | Net | Purpose |
| --- | --- | --- |
| 1 | UVA_NEG | UVA LED cathode return to Q2 drain |
| 2 | UVA_ANODE | Current-limited UVA LED anode from R4 |
| 3 | +5V_LED | Regulated 5V LED head rail |
| 4 | +5V_LED | Parallel regulated 5V LED head rail conductor |
| 5 | GND | LED head ground return |
| 6 | GND | Parallel LED head ground return |
| 7 | SK6812_DIN_1 | SK6812 RGBW data into RGBW LED 1 after R7 |
| 8 | NC | Spare |
| 9 | IR_ANODE | Current-limited IR LED anode from R1 |
| 10 | IR_NEG | IR LED cathode return to Q1 drain |
| 11 | NC | Spare |
| 12 | NC | Spare |
| 13 | NC | Spare |
| 14 | NC | Spare |

Pins 8, 11, 12, 13, and 14 are intentionally spare. The six added acrylic RGBW pixels live on the LED head PCB after the first two SK6812 camera pixels, so the existing single SK6812 data conductor still controls all eight addressable pixels. Use a straight pin-1-to-pin-1 harness. Mark pin 1 on the 3D shell before final assembly.
