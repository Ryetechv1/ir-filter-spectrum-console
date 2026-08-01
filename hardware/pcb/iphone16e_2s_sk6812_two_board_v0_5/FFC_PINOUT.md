# 14-Pin FFC Pinout

Use one 14-conductor 1.0 mm pitch FFC cable between the main board J8 and the LED head board J1.

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

The pinout is arranged left-to-right to match the physical LED head: UVA on the left, shared power/ground/data/I2C through the center, and IR on the right. Use a cable orientation that maps pin 1 to pin 1. Mark pin 1 on the 3D shell before final assembly.
