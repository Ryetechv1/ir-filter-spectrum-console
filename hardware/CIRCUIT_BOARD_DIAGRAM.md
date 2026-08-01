# ESP32-S3/C6 + Arduino Nano 2S SK6812/IR/UVA Board Diagram

Diagram and PCB files:

```text
hardware/esp32_nano_rgbw_ir_uva_board_diagram.svg
hardware/prototypes/PROTOTYPE_BUILDS.md
hardware/prototypes/prototype_01_wiring.svg
hardware/prototypes/prototype_02_wiring.svg
hardware/prototypes/prototype_03_wiring.svg
hardware/prototypes/prototype_04_wiring.svg
hardware/prototypes/hologram_camera_architecture_v0_9.svg
hardware/pcb/iphone16e_hologram_s3_c6_v0_9/
hardware/pcb/iphone16e_2s_sk6812_two_board_v0_8/
```

This revision is optimized for a low-current 2S LiPo phone-back build:

- ESP32-S3 N16R8 camera board hosts Wi-Fi, the web API, and the MJPEG camera stream.
- ESP32-C6-LCD-1.47 hosts the hologram/acrylic projection display and accepts `/hologram` webapp commands.
- Arduino Nano handles the lighting protocol.
- IR and UVA are simple 5 mm LEDs switched by low-side MOSFETs from a regulated 5 V rail.
- RGBW 1 and RGBW 2 are the two camera-side SK6812 RGBW LEDs.
- Acrylic 1, Acrylic 2, and Acrylic 3 each use a mirrored left/right SK6812 pair, giving 8 total physical RGBW LEDs controlled as 5 logical RGBW zones from one Nano data pin.
- The old transparent OLED branch remains removed. The active display branch is now the separate ESP32-C6 ST7789 LCD projection board.
- The older 12 V/PCA9685 architecture is no longer used for this parts list.

## Mechanical Target

Target phone footprint:

```text
iPhone 16e: 146.7 mm x 71.5 mm
Main PCB v0.8 backup: 70 mm x 136 mm
Head PCB v0.8 backup: 50 mm x 90 mm
v0.9 S3/C6 PCB: planning package, final outline pending physical module measurements
PCB camera/display chamber: must clear GC2145 lens, ESP32-C6 LCD reflection path, and phone case camera opening
```

The v0.8 cutout is intentionally conservative so the phone camera opening in the Speck Presidio Perfect-Clear ClickLock case is not covered. For v0.9, measure the exact S3 camera board, GC2145 module, C6 LCD board, acrylic/glass angle, and actual case camera opening before generating orderable Gerbers.

## Board-To-Board Connection

The legacy v0.8 PCB package does not use a flat ribbon/FFC connector. The main board J8 and LED head board J1 use matching 14-pin JST-GH 1.25 mm locking wire-harness connectors:

```text
PCB footprint: Connector_JST:JST_GH_SM14B-GHS-TB_1x14-1MP_P1.25mm_Horizontal
Cable housing: JST GHR-14V-S or compatible
Terminals: JST GH 1.25 mm crimp terminals, commonly SSHL-002T-P0.2
```

Use a straight-through pin-1-to-pin-1 harness. See `hardware/pcb/iphone16e_2s_sk6812_two_board_v0_8/INTERBOARD_HARNESS_PINOUT.md`.

Pins 8, 11, 12, 13, and 14 are intentionally spare in v0.8.

Battery shell allowance:

```text
OVONIC 2S LiPo pack: 61.9 mm x 16.3 mm x 13.4 mm
Recommended shell pocket: at least 64 mm x 18 mm x 15 mm
```

Do not compress the LiPo pack. Leave clearance for insulation, swelling margin, and strain relief.

## Power Path

Use a 2S LiPo power path:

```text
USB-C input
  -> proper 2S LiPo charger/BMS, 8.4 V full-charge output
  -> protected 2S LiPo pack, 7.4 V nominal / 8.4 V full
  -> fuse near battery positive
  -> main switch
  -> 2S battery rail
  -> 2S-to-5V buck regulator
  -> ESP32-S3 5V/VIN, ESP32-C6 5V/VIN or USB-C power, Nano 5V, IR/UVA LED resistors, SK6812 LEDs
```

Important: the Adeept 3S/12.6 V charger module is not compatible with a 2S LiPo pack. Use a 2S/8.4 V charger/BMS.

Use a 5 V buck regulator rated at least 1 A. A 2 A module is a better practical choice because the ESP32-S3 camera, ESP32-C6 LCD, and LEDs draw startup/display peaks.

## Logic Connections

```text
ESP32-S3 GPIO1 TX -> Arduino Nano D2 RX
Arduino Nano D4 TX -> 1k/2k divider -> ESP32-S3 GPIO2 RX
ESP32-S3 GND      -> Arduino Nano GND
```

The ESP32-C6 LCD display is controlled over Wi-Fi with `/hologram`; it does not need a wired signal line to the Nano in the current v0.9 prototype path.

## Nano Pin Map

```text
Nano D2 -> ESP32-S3 serial RX input
Nano D4 -> ESP32-S3 serial TX output through level divider
Nano D5 -> IR LED MOSFET gate through 150 ohm
Nano D6 -> UVA LED MOSFET gate through 150 ohm
Nano D7 -> SK6812 RGBW data through 330 ohm
Nano D8 -> optional LED rail enable output
```

## IR And UVA LED Circuits

IR LED:

```text
+5 V -> 100 ohm resistor -> 950 nm IR LED anode
IR LED cathode -> AO3400A drain
AO3400A source -> GND
Nano D5 -> 150 ohm gate resistor -> AO3400A gate
AO3400A gate -> 100k pulldown -> GND
```

With a 1.5 V IR LED forward voltage, 100 ohm limits current to about 35 mA from 5 V. This is below the 50 mA maximum continuous rating.

UVA LED:

```text
+5 V -> 68 ohm resistor -> 375 nm UVA LED anode
UVA LED cathode -> AO3400A drain
AO3400A source -> GND
Nano D6 -> 150 ohm gate resistor -> AO3400A gate
AO3400A gate -> 100k pulldown -> GND
```

With a 3.6 V UVA forward voltage, 68 ohm gives about 21 mA. With a 3.2 V forward voltage, it gives about 26 mA.

## SK6812 RGBW Wiring

```text
+5 V -> all SK6812 RGBW VDD pins
GND  -> all SK6812 RGBW GND pins
Nano D7 -> 330 ohm resistor -> RGBW 1 DIN
RGBW 1 DOUT -> RGBW 2 DIN
RGBW 2 DOUT -> Acrylic 1 left DIN
Acrylic 1 left DOUT -> Acrylic 1 right DIN
Acrylic 1 right DOUT -> Acrylic 2 left DIN
Acrylic 2 left DOUT -> Acrylic 2 right DIN
Acrylic 2 right DOUT -> Acrylic 3 left DIN
Acrylic 3 left DOUT -> Acrylic 3 right DIN
Acrylic 3 right DOUT -> not used
47 uF to 100 uF capacitor across +5 V/GND near the RGBW LEDs
```

Each SK6812 LED can draw about 60 mA at full RGBW white. Eight LEDs can draw about 480 mA, plus ESP32-S3 camera, ESP32-C6 LCD, and Nano current.

## Web App Lighting Model

The web app sends:

```text
/led?power=<0-or-1>&irOn=<0-or-1>&uvaOn=<0-or-1>&rgbw1On=<0-or-1>&rgbw2On=<0-or-1>&rgbw3On=<0-or-1>&rgbw4On=<0-or-1>&rgbw5On=<0-or-1>&ir=<0-255>&uva=<0-255>&rgbw1Dim=<0-255>&r1=<0-255>&g1=<0-255>&b1=<0-255>&w1=<0-255>&rgbw2Dim=<0-255>&r2=<0-255>&g2=<0-255>&b2=<0-255>&w2=<0-255>&rgbw3Dim=<0-255>&r3=<0-255>&g3=<0-255>&b3=<0-255>&w3=<0-255>&rgbw4Dim=<0-255>&r4=<0-255>&g4=<0-255>&b4=<0-255>&w4=<0-255>&rgbw5Dim=<0-255>&r5=<0-255>&g5=<0-255>&b5=<0-255>&w5=<0-255>
```

The Nano maps those fields directly:

```text
IR value  -> Nano D5 PWM
UVA value -> Nano D6 PWM
RGBW 1    -> SK6812 pixel 0, scaled by rgbw1Dim
RGBW 2    -> SK6812 pixel 1, scaled by rgbw2Dim
Acrylic 1 -> SK6812 pixels 2 and 3, scaled by rgbw3Dim
Acrylic 2 -> SK6812 pixels 4 and 5, scaled by rgbw4Dim
Acrylic 3 -> SK6812 pixels 6 and 7, scaled by rgbw5Dim
```

Turning off the power toggle resets every lighting value to zero. Turning off an individual IR, UVA, RGBW, or acrylic-zone toggle resets only that output's slider values unless it is the last active output.

The camera snapshot endpoint stays on port 80 at `/capture`. The live camera view uses the camera module MJPEG stream on port 81 at `/stream`.

## Firmware Files

```text
ESP32 web/camera firmware:
esp32_cam_ir_uv_webapp/esp32_cam_ir_uv_webapp.ino

Arduino Nano 2S SK6812 LED driver:
nano_rgbw_ir_uva_driver/nano_rgbw_ir_uva_driver.ino
```

## Safety

UVA and IR can be eye hazards even when the beam does not look bright. Build with a physical shroud, low test duty cycles, short auto-off timing, a master switch, a battery fuse, and UV-rated eye protection. Do not operate UVA LEDs toward skin or eyes.
