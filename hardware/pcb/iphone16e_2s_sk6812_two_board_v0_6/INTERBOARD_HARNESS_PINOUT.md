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
| 8 | GLASS_SDA | I2C SDA from ESP32-CAM GPIO15 to Unit Glass connector J2 pin 3 |
| 9 | IR_ANODE | Current-limited IR LED anode from R1 |
| 10 | IR_NEG | IR LED cathode return to Q1 drain |
| 11 | GLASS_SCL | I2C SCL from ESP32-CAM GPIO16 to Unit Glass connector J2 pin 4 |
| 12 | NC | Spare |
| 13 | NC | Spare |
| 14 | NC | Spare |

The pinout is arranged left-to-right to match the physical LED head: UVA on the left, shared power/ground/data/I2C through the center, and IR on the right. Use a straight pin-1-to-pin-1 harness. Mark pin 1 on the 3D shell before final assembly.
