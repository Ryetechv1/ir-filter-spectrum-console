# Assembly Layout

```text
Phone back / case top area

  [phone camera keepout]        [ESP32-CAM module on main carrier]
                                [compact LED/Glass head board over lens]
                                [M5 Unit Glass above printed chamber]

                                RGBW 2      LENS      RGBW 1
                                           CUTOUT

                                      UVA          IR

                                  Glass J2 GND 5V SDA SCL
                                  14-pin FFC connector
                                           ||
                                           || ribbon cable
                                           ||
                                  Main carrier J8 FFC

Main board lower area:

  Arduino Nano + ESP32-CAM socket + charger/BMS pads + buck pads + 2S battery pads
```

The LED head board is intentionally compact and symmetric around the ESP32-CAM lens cutout. The M5Stack Unit Glass is chamber-mounted above the head board using the fab-layer outline. The main board remains the controller and power board.
