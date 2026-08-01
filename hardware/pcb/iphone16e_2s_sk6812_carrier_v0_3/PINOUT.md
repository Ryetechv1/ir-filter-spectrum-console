# Pinout

## Board Power

- P1: protected 2S LiPo/BMS positive, 6.0V to 8.4V range.
- P2: battery/system ground.
- P3/P4: 2S charger output pads. Use 8.4V 2S charger only.
- P5/P6: switched/fused 2S rail to the external buck regulator input.
- P7/P8: regulated 5V buck output back to this PCB.
- P9/P10: optional LED rail enable signal and ground.

Do not connect a 3S/12.6V charger to the 2S pack.

## Arduino Nano Pins

The Nano socket is rotated sideways to keep the board narrow and route the LED section cleanly.

- D2: RX from ESP32-CAM GPIO14
- D4: TX to ESP32-CAM GPIO13 through the 1k/2k divider
- D5: IR PWM
- D6: UVA PWM
- D7: SK6812 RGBW data
- D8: optional LED rail enable output

## SK6812 Pads

J6 and J7 are solder pads in the order:

1. +5V
2. DIN
3. GND
4. DOUT

J6 DOUT is routed to J7 DIN. J7 DOUT is exposed but not used by firmware.

## ESP32-CAM Upload

J3 pin order: GND, 5V, adapter TX to ESP U0R, adapter RX to ESP U0T.

JP1 shorts ESP IO0 to GND for flashing only. Remove the jumper and reset after upload.
