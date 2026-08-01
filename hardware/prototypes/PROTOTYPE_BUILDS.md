# Five Prototype Build Plan

This file splits the spectrum camera project into five practical build stages after the v0.9 hologram/S3 update. The old AI-Thinker ESP32-CAM/OV2640 firmware and prototype folders are preserved as the legacy backup path. The new primary path uses:

- ESP32-S3 N16R8 camera board with GC2145 ribbon camera
- Arduino Nano LED driver
- ESP32-C6-LCD-1.47 board for the acrylic/glass hologram projection
- The same Nano LED protocol used by the previous webapp

Quick wiring diagrams:

```text
hardware/prototypes/prototype_01_wiring.svg
hardware/prototypes/prototype_02_wiring.svg
hardware/prototypes/prototype_03_wiring.svg
hardware/prototypes/prototype_04_wiring.svg
hardware/prototypes/hologram_camera_architecture_v0_9.svg
```

## Common Power And Signal Rules

- Use a regulated 5 V rail for the Arduino Nano, LED resistors, SK6812 LEDs, and camera/display dev boards when they are not powered from USB-C.
- Connect every ground together: ESP32-S3 GND, Nano GND, 5 V buck GND, LED GND, battery/BMS GND, and ESP32-C6 GND if you add a hardwired shared power rail.
- ESP32-S3 GPIO1 TX connects to Nano D2 RX.
- Nano D4 TX connects to ESP32-S3 GPIO2 RX through a divider or level shifter because the ESP32-S3 is 3.3 V logic.
- Keep the ESP32-C6 LCD as a separate programmable device. It is controlled over `/hologram`, not through the Nano.
- If the S3 and C6 are on separate access points, your phone/laptop can only control the board whose Wi-Fi you are currently joined to. For full combined operation, configure both sketches for the same local Wi-Fi network and use their printed IP addresses in the webapp.
- Keep UVA and IR emitters shielded and start with low duty cycles.

## Prototype 1: S3 Camera + Nano + Hologram Display

Goal: prove camera streaming, Wi-Fi/webapp access, Nano serial wiring, and the ESP32-C6 LCD projection before adding LEDs.

Arduino IDE sketch folders:

```text
prototype_sketches/prototype_01_camera_arduino/esp32_s3_camera_prototype_01
prototype_sketches/prototype_01_camera_arduino/esp32_c6_hologram_prototype_01
prototype_sketches/prototype_01_camera_arduino/nano_prototype_01
```

Legacy backup camera sketch:

```text
prototype_sketches/prototype_01_camera_arduino/esp32_cam_prototype_01
```

Core wiring:

```text
5 V regulated rail -> ESP32-S3 5V/VIN when not using USB-C
5 V regulated rail -> Nano 5V
GND rail           -> ESP32-S3 GND + Nano GND
ESP32-S3 GPIO1 TX  -> Nano D2 RX
Nano D4 TX         -> 1k resistor -> ESP32-S3 GPIO2 RX
ESP32-S3 GPIO2 RX  -> 2k resistor -> GND
```

Hologram display:

```text
ESP32-C6-LCD-1.47 -> USB-C power/programming
Display AP        -> SpectrumHolo / holo-change-me
Display URL       -> http://192.168.8.1
```

Bench test:

1. Upload all three Prototype 1 sketches.
2. Open the webapp and select Prototype 1.
3. Connect the camera address printed by the ESP32-S3 serial monitor.
4. Set the display address to the ESP32-C6 printed IP or `http://192.168.8.1`.
5. Confirm the live stream appears and the hologram preview can Apply to the C6 display.

## Prototype 2: IR + UVA LEDs

Goal: add the two mono illumination channels and verify independent on/off plus dimming.

Arduino IDE sketch folders:

```text
prototype_sketches/prototype_02_ir_uva/esp32_s3_camera_prototype_02
prototype_sketches/prototype_02_ir_uva/esp32_c6_hologram_prototype_02
prototype_sketches/prototype_02_ir_uva/nano_prototype_02
```

Additional parts:

```text
1x 950 nm 5 mm IR LED
1x 375 nm 5 mm UVA LED
2x AO3400A logic-level N-MOSFET
1x 100 ohm 0.25 W resistor for IR
1x 68 ohm 0.25 W resistor for UVA
2x 150 ohm gate resistor
2x 100k gate pulldown resistor
```

IR wiring:

```text
+5 V -> 100 ohm -> IR LED anode
IR LED cathode -> AO3400A drain
AO3400A source -> GND
Nano D5 -> 150 ohm -> AO3400A gate
AO3400A gate -> 100k -> GND
```

UVA wiring:

```text
+5 V -> 68 ohm -> UVA LED anode
UVA LED cathode -> AO3400A drain
AO3400A source -> GND
Nano D6 -> 150 ohm -> AO3400A gate
AO3400A gate -> 100k -> GND
```

Bench test:

1. Select Prototype 2 in the webapp.
2. Set IR to 10-20 percent and verify D5 PWM switching.
3. Set UVA to 5-10 percent and verify D6 PWM switching.
4. Turn each toggle off and verify its slider returns to zero.
5. Confirm the C6 display still applies pattern changes independently.

## Prototype 3: Camera RGBW Pair

Goal: add the two camera-side SK6812 RGBW LEDs and verify independent RGBW mixing with the hologram chamber in place.

Arduino IDE sketch folders:

```text
prototype_sketches/prototype_03_camera_rgbw/esp32_s3_camera_prototype_03
prototype_sketches/prototype_03_camera_rgbw/esp32_c6_hologram_prototype_03
prototype_sketches/prototype_03_camera_rgbw/nano_prototype_03
```

Additional parts:

```text
2x SK6812 RGBW 5 mm LED
1x 330 ohm data resistor
1x 47 uF to 100 uF capacitor across +5 V/GND near the LEDs
1x 45 degree clear acrylic/glass projection sheet
```

SK6812 wiring:

```text
+5 V -> RGBW 1 VDD and RGBW 2 VDD
GND  -> RGBW 1 GND and RGBW 2 GND
Nano D7 -> 330 ohm -> RGBW 1 DIN
RGBW 1 DOUT -> RGBW 2 DIN
RGBW 2 DOUT -> not connected for Prototype 3
47 uF to 100 uF capacitor -> +5 V/GND near RGBW LEDs
```

Bench test:

1. Select Prototype 3 in the webapp.
2. Use RGBW 1 sliders to verify the first LED.
3. Use RGBW 2 sliders to verify the second LED.
4. Confirm RGBW 1 and RGBW 2 can have different colors.
5. Place the acrylic/glass at 45 degrees and confirm the C6 display reflection does not block the camera frame.

## Prototype 4: Full Acrylic RGBW Stack

Goal: breadboard the complete LED load and the hologram chamber before ordering/assembling a revised PCB.

Arduino IDE sketch folders:

```text
prototype_sketches/prototype_04_acrylic_rgbw/esp32_s3_camera_prototype_04
prototype_sketches/prototype_04_acrylic_rgbw/esp32_c6_hologram_prototype_04
prototype_sketches/prototype_04_acrylic_rgbw/nano_prototype_04
```

Additional parts beyond Prototype 3:

```text
6x SK6812 RGBW 5 mm LED
3x clear acrylic square test pieces
Extra +5 V and GND bus wiring
```

SK6812 chain:

```text
Nano D7 -> 330 ohm -> RGBW 1 camera-right DIN
RGBW 1 DOUT -> RGBW 2 camera-left DIN
RGBW 2 DOUT -> Acrylic 1 left DIN
Acrylic 1 left DOUT -> Acrylic 1 right DIN
Acrylic 1 right DOUT -> Acrylic 2 left DIN
Acrylic 2 left DOUT -> Acrylic 2 right DIN
Acrylic 2 right DOUT -> Acrylic 3 left DIN
Acrylic 3 left DOUT -> Acrylic 3 right DIN
Acrylic 3 right DOUT -> not connected
```

Bench test:

1. Select Prototype 4 in the webapp.
2. Set Acrylic 1 to red, Acrylic 2 to green, and Acrylic 3 to blue.
3. Confirm each acrylic square illuminates separately from its neighbors.
4. Apply the C6 hologram cross and scan-reticle patterns.
5. Run All off and verify every LED channel returns to zero.

## Prototype 5: Production PCB Build

Goal: convert the proven Prototype 4 wiring into the next PCB revision. The v0.8 PCB remains the DRC-clean orderable fallback for the old ESP32-CAM geometry. The v0.9 S3/C6 package is a planning package until the exact ESP32-S3 board, GC2145 ribbon board, and C6 LCD board are physically measured.

Production sketch folders:

```text
esp32_s3_gc2145_webapp
esp32_c6_hologram_display
nano_rgbw_ir_uva_driver
```

Legacy production backup:

```text
esp32_cam_ir_uv_webapp
hardware/pcb/iphone16e_2s_sk6812_two_board_v0_8/
```

New PCB planning package:

```text
hardware/pcb/iphone16e_hologram_s3_c6_v0_9/
```

Final test:

1. Select Prototype 5 in the webapp.
2. Verify the ESP32-S3 GC2145 stream.
3. Verify the ESP32-C6 hologram Apply flow.
4. Verify IR and UVA dimming.
5. Verify RGBW 1 and RGBW 2 around the camera.
6. Verify Acrylic 1-3 left/right pairs.
7. Run All off and confirm every Nano-driven LED output is zero.
