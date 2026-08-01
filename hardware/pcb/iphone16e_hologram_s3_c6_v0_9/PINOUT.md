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

ESP32 LCD driver serial link:

| Signal | Pin |
|---|---|
| ESP32-S3 TX to ESP32 LCD driver RX | GPIO1 -> ESP32 LCD GPIO16 RX2 |
| ESP32 LCD driver TX to ESP32-S3 RX | ESP32 LCD GPIO17 TX2 -> GPIO2 |
| Ground reference | ESP32-S3 GND <-> ESP32 LCD GND |

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

The C6 display currently has no wired signal link to the S3 or lighting driver. It is controlled by HTTP over Wi-Fi:

```text
GET /status
GET /hologram?power=1&mode=2&brightness=180&speed=96&r1=0&g1=210&b1=255&r2=255&g2=60&b2=190&r3=255&g3=255&b3=255
```

## ESP32 1.14 LCD Lighting Driver

| Function | ESP32 1.14 LCD board pin |
|---|---|
| Serial RX from ESP32-S3 | GPIO16 RX2 |
| Serial TX to ESP32-S3 | GPIO17 TX2 |
| IR LED PWM | GPIO25 |
| UVA LED PWM | GPIO26 |
| SK6812 RGBW data | GPIO27 through 3.3 V-to-5 V buffer |
| Optional LED rail enable | GPIO33 |
| Onboard ST7789 CS / DC / RST / BL / SCLK / MOSI | GPIO15 / GPIO2 / GPIO4 / GPIO32 / GPIO18 / GPIO23 |

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
