# Board Pinout

## Main Board

- ESP32-CAM stays on the main board socket for Wi-Fi, web API, and camera stream.
- Arduino Nano stays on the main board and still runs the lighting protocol.
- J8 is the 14-pin JST-GH connector to the compact LED/lens head board.
- Nano D8 remains available to the firmware as a logical power/off command; the PCB routes the LED head from the regulated 5V rail.

## Arduino Nano Pins

- D2: RX from ESP32-CAM GPIO14 through R10.
- D4: TX to ESP32-CAM GPIO13 through the R8/R9 divider.
- D5: IR PWM to the main-board Q1 gate through R2.
- D6: UVA PWM to the main-board Q2 gate through R5.
- D7: SK6812 RGBW data to harness pin 7 through R7.
- D8: firmware logical LED power state. No high-side load switch is populated on v0.7.

## 14-Pin JST-GH Harness Nets

- Pin 1: UVA LED cathode return to Q2 drain.
- Pin 2: UVA LED anode after R4.
- Pins 3 and 4: regulated +5V LED rail.
- Pins 5 and 6: GND.
- Pin 7: SK6812 data into RGBW LED 1.
- Pin 8: spare.
- Pin 9: IR LED anode after R1.
- Pin 10: IR LED cathode return to Q1 drain.
- Pins 11, 12, 13, and 14: spare.

## LED Head Board

Layout follows the supplied reference image:

- RGBW LED 2 is centered to the left of the ESP32-CAM lens cutout.
- RGBW LED 1 is centered to the right of the ESP32-CAM lens cutout.
- UVA and IR are centered below the lens as a matched lower pair, UVA left and IR right.
- The 14-pin JST-GH connector sits along the bottom edge of the head board.

The head board has a circular lens cutout centered at 17.0 mm x 14.0 mm. Print the head board at 1:1 and check it against the actual ESP32-CAM lens before ordering.
