# Assembly Layout

```text
Phone back / case top area

  [phone camera keepout]        [ESP32-CAM module on main carrier]
                                [compact LED head board over lens]

                                RGBW 2      LENS      RGBW 1
                                           CUTOUT

                                      UVA          IR

                                  14-pin FFC connector
                                           ||
                                           || ribbon cable
                                           ||
                                  Main carrier J8 FFC

Main board lower area:

  Arduino Nano + ESP32-CAM socket + charger/BMS pads + buck pads + 2S battery pads
```

The LED head board is intentionally compact and symmetric around the ESP32-CAM lens cutout. The main board remains the controller and power board.
