# ESP32-CAM 2S RGBW/IR/UVA Web Camera Build

> v0.9 note: the current primary prototype path is now the ESP32-S3 GC2145 camera board plus ESP32-C6-LCD-1.47 hologram display. This ESP32-CAM/OV2640 build is preserved as the legacy backup path. See `hardware/prototypes/PROTOTYPE_BUILDS.md` and `hardware/pcb/iphone16e_hologram_s3_c6_v0_9/README_PCB_PLANNING.md` for the updated S3/C6 architecture.

## Current Hardware Revision

This revision removes the transparent OLED from the active build. The project now contains:

- ESP32-CAM AI-Thinker module with OV2640 camera.
- ESP32 1.14 inch LCD board replaces the Arduino Nano as the LED controller.
- OVONIC 2S 7.4 V 450 mAh LiPo pack, XT30 plug, about 61.9 mm x 16.3 mm x 13.4 mm.
- 950 nm 5 mm IR LED, 50 mA maximum continuous current, about 1.5 V forward voltage.
- 375 nm 5 mm UVA LED, 25 mA to 30 mA target current, about 3.2 V to 3.6 V forward voltage.
- Eight SK6812 5 mm RGBW LEDs, cool white 7000 K, about 60 mA each at full RGBW white.
  - RGBW 1 and RGBW 2 sit beside the ESP32-CAM lens.
  - Acrylic 1, Acrylic 2, and Acrylic 3 each use a mirrored left/right LED pair for separate stacked acrylic illumination.
- Solder pads for battery/charger/buck wiring and a 14-pin JST-GH locking wire harness for the LED head.
- Speck Presidio Perfect-Clear ClickLock-style case target with a conservative PCB camera cutout.

The older 12 V/PCA9685 version is no longer the recommended electrical design. The ESP32 LCD driver controls two PWM mono LEDs and one SK6812 RGBW data line with five logical RGBW zones.

## Prototype Build Stages

The project is now split into five selectable build targets:

```text
Prototype 1 -> camera module + ESP32 LCD driver serial link only
Prototype 2 -> Prototype 1 + IR LED + UVA LED
Prototype 3 -> Prototype 2 + first two camera-side RGBW LEDs
Prototype 4 -> Prototype 3 + six acrylic-edge RGBW LEDs
Prototype 5 -> full production two-board PCB build
```

Use `hardware/prototypes/PROTOTYPE_BUILDS.md` for the quick wiring builds and `hardware/prototypes/prototype_0x_wiring.svg` for the stage diagrams. The webapp dropdown sends the selected prototype to the ESP32-CAM, and the firmware clamps unavailable LED outputs off for that build target.

## Critical Charger Note

The Adeept module described as 3S / 12.6 V is not compatible with a 2S LiPo pack. A 2S LiPo is charged to 8.4 V full, not 12.6 V.

Use a proper 2S / 8.4 V USB-C LiPo charger/BMS module. Do not connect a 3S charger to this 2S battery.

## Power Architecture

```text
USB-C input
  -> 2S LiPo charger/BMS, 8.4 V full-charge output
  -> protected 2S LiPo pack
  -> fuse near battery positive
  -> main switch
  -> 2S battery rail
  -> 2S-to-5V buck regulator, 1A minimum / 2A recommended
  -> ESP32-CAM 5V, ESP32 LCD 5V/VIN, IR/UVA LED resistors, SK6812 LEDs
```

Expected 5 V current budget:

```text
ESP32-CAM Wi-Fi/camera peak: about 300 mA to 500 mA
ESP32 1.14 LCD driver:       allow about 120 mA to 200 mA with LCD backlight
IR LED:                      about 35 mA with 100 ohm resistor
UVA LED:                     about 21 mA to 26 mA with 68 ohm resistor
8x SK6812 full RGBW white:   about 480 mA
Recommended buck rating:     1 A minimum, 2 A preferred
```

## ESP32-CAM Upload And Web Role

The ESP32-CAM has no USB port. Upload with an ESP32-CAM-MB programmer board or a 3.3 V logic USB-to-TTL adapter:

```text
USB serial TX -> ESP32-CAM U0R
USB serial RX -> ESP32-CAM U0T
USB serial GND -> ESP32-CAM GND
USB serial 5V -> ESP32-CAM 5V/VCC
ESP32-CAM IO0 -> GND only while uploading
```

After upload, remove the IO0-to-GND jumper and reset/power-cycle.

ESP32-CAM firmware:

```text
esp32_cam_ir_uv_webapp/esp32_cam_ir_uv_webapp.ino
```

It hosts:

```text
/              built-in fallback page
/status        JSON status
/led           lighting control API
/capture       still JPEG snapshot
:81/stream     live MJPEG stream
```

## ESP32-CAM To ESP32 LCD Driver Link

```text
ESP32-CAM GPIO14 TX -> ESP32 LCD GPIO16 RX2
ESP32 LCD GPIO17 TX2 -> ESP32-CAM GPIO13 RX
Common GND between ESP32-CAM, ESP32 LCD driver, buck regulator, and battery/BMS
```

Both sides are 3.3 V ESP32 logic, so the old Nano TX divider is removed. GPIO13 and GPIO14 conflict with the ESP32-CAM microSD slot, so this build assumes no microSD card.

## ESP32 LCD Driver Lighting Pin Map

ESP32 LCD driver firmware:

```text
esp32_lcd_rgbw_ir_uva_driver/esp32_lcd_rgbw_ir_uva_driver.ino
```

Pins:

```text
GPIO16 RX2: serial RX from ESP32-CAM GPIO14
GPIO17 TX2: serial TX to ESP32-CAM GPIO13
GPIO25: IR PWM MOSFET gate through 150 ohm
GPIO26: UVA PWM MOSFET gate through 150 ohm
GPIO27: 3.3 V-to-5 V buffer -> 330 ohm -> SK6812 RGBW data
GPIO33: optional LED-enable output
Onboard ST7789: CS GPIO15, DC GPIO2, RST GPIO4, BL GPIO32, SCLK GPIO18, MOSI GPIO23
```

Serial protocol from ESP32-CAM to ESP32 LCD driver:

```text
L,<power>,<irOn>,<uvaOn>,<rgbw1On>,<rgbw2On>,<rgbw3On>,<rgbw4On>,<rgbw5On>,<ir>,<uva>,<rgbw1Dim>,<r1>,<g1>,<b1>,<w1>,<rgbw2Dim>,<r2>,<g2>,<b2>,<w2>,<rgbw3Dim>,<r3>,<g3>,<b3>,<w3>,<rgbw4Dim>,<r4>,<g4>,<b4>,<w4>,<rgbw5Dim>,<r5>,<g5>,<b5>,<w5>
```

The ESP32 LCD driver maps this to:

```text
IR value  -> GPIO25 PWM
UVA value -> GPIO26 PWM
RGBW 1    -> SK6812 pixel 0, scaled by rgbw1Dim
RGBW 2    -> SK6812 pixel 1, scaled by rgbw2Dim
Acrylic 1 -> SK6812 pixels 2 and 3, scaled by rgbw3Dim
Acrylic 2 -> SK6812 pixels 4 and 5, scaled by rgbw4Dim
Acrylic 3 -> SK6812 pixels 6 and 7, scaled by rgbw5Dim
```

## LED Circuits

IR 950 nm:

```text
+5 V -> 100 ohm resistor -> IR LED anode
IR LED cathode -> AO3400A drain
AO3400A source -> GND
ESP32 LCD GPIO25 -> 150 ohm -> AO3400A gate
AO3400A gate -> 100k -> GND
```

UVA 375 nm:

```text
+5 V -> 68 ohm resistor -> UVA LED anode
UVA LED cathode -> AO3400A drain
AO3400A source -> GND
ESP32 LCD GPIO26 -> 150 ohm -> AO3400A gate
AO3400A gate -> 100k -> GND
```

SK6812 RGBW:

```text
+5 V -> all SK6812 VDD pins
GND -> all SK6812 GND pins
ESP32 LCD GPIO27 -> 330 ohm -> SK6812 RGBW 1 DIN
RGBW 1 DOUT -> RGBW 2 DIN
RGBW 2 DOUT -> Acrylic 1 left DIN
Acrylic 1 left DOUT -> Acrylic 1 right DIN
Acrylic 1 right DOUT -> Acrylic 2 left DIN
Acrylic 2 left DOUT -> Acrylic 2 right DIN
Acrylic 2 right DOUT -> Acrylic 3 left DIN
Acrylic 3 left DOUT -> Acrylic 3 right DIN
Acrylic 3 right DOUT -> not used
47 uF to 100 uF capacitor across +5 V/GND near LEDs on the head PCB
```

## Web App

Run the React web app locally:

```text
cd webapp
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

On the Windows PC:

```text
http://127.0.0.1:5173/
```

On iPhone Safari, use the PC's LAN address instead of localhost:

```text
http://<PC-LAN-IP>:5173/
```

Enter the ESP32-CAM address in the web app, such as `http://192.168.4.1` or the station-mode IP printed in Serial Monitor.

## PCB Package

Current no-display 2S/SK6812 PCB source:

```text
hardware/pcb/iphone16e_2s_sk6812_two_board_v0_8/
```

The package includes a main controller carrier and a 50 mm x 90 mm LED/camera/acrylic head board. The old ribbon/FFC connector is not used; the active v0.8 boards use a 14-pin JST-GH 1.25 mm locking wire-harness connector on each board. Pins 8, 11, 12, 13, and 14 are spare after removing the display.

## Safety

UVA and IR can damage eyes even when the beam is not visibly bright. Use shielding, low test duty cycles, a short auto-off timer, UV-rated eye protection, a fuse near the battery, and a main switch. Do not run UVA toward skin or eyes.
