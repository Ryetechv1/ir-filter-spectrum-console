# v0.9 Pinout Plan

## ESP32-S3 Camera Board

Camera pin map used by `esp32_s3_gc2145_webapp`:

| Camera signal | ESP32-S3 GPIO |
|---|---:|
| SIOD | 4 |
| SIOC | 5 |
| VSYNC | 6 |
| HREF | 7 |
| XCLK | 15 |
| Y9 | 16 |
| Y8 | 17 |
| Y7 | 18 |
| Y6 | 12 |
| Y5 | 10 |
| Y4 | 8 |
| Y3 | 9 |
| Y2 | 11 |
| PCLK | 13 |
| PWDN | -1 |
| RESET | -1 |

Nano serial link:

| Signal | Pin |
|---|---|
| ESP32-S3 TX to Nano RX | GPIO1 -> Nano D2 |
| Nano TX to ESP32-S3 RX | Nano D4 -> divider/level shifter -> GPIO2 |
| Ground reference | ESP32-S3 GND <-> Nano GND |

## ESP32-C6 LCD Board

Display pin map used by `esp32_c6_hologram_display`:

| LCD signal | ESP32-C6 GPIO |
|---|---:|
| CS | 14 |
| MOSI / SDA | 6 |
| SCLK | 7 |
| MISO | 13 |
| DC | 15 |
| Backlight | 22 |
| RST | 21 |

The C6 display currently has no wired signal link to the S3 or Nano. It is controlled by HTTP over Wi-Fi:

```text
GET /status
GET /hologram?power=1&mode=2&brightness=180&speed=96&r1=0&g1=210&b1=255&r2=255&g2=60&b2=190&r3=255&g3=255&b3=255
```

## Arduino Nano LED Driver

| Function | Nano pin |
|---|---|
| Serial RX from ESP32-S3 | D2 |
| Serial TX to ESP32-S3 | D4 |
| IR LED PWM | D5 |
| UVA LED PWM | D6 |
| SK6812 RGBW data | D7 |

## SK6812 Chain Order

```text
1. Camera right RGBW
2. Camera left RGBW
3. Acrylic 1 left
4. Acrylic 1 right
5. Acrylic 2 left
6. Acrylic 2 right
7. Acrylic 3 left
8. Acrylic 3 right
```
