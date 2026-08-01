# Assembly Layout

```text
Phone back / case top area

  [phone camera keepout]        [ESP32-CAM module on main carrier]
                                [compact LED head board over lens]

                                RGBW 2      LENS      RGBW 1
                                           CUTOUT

                                      UVA          IR

                                A1-L    ACRYLIC 1    A1-R
                                A2-L    ACRYLIC 2    A2-R
                                A3-L    ACRYLIC 3    A3-R

                                  14-pin JST-GH connector
                                           ||
                                           || wire harness
                                           ||
                                  Main carrier J8 JST-GH

Main board lower area:

  Arduino Nano + ESP32-CAM socket + charger/BMS pads + buck pads + 2S battery pads
```

The LED head board is intentionally compact and symmetric around the ESP32-CAM lens cutout. The main board remains the controller and power board.
