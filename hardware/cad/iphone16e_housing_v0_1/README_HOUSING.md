# iPhone ESP32-CAM Housing v0.1

This CAD package is generated for the current electronics stack:

- Main PCB v0.8: 70.0 x 136.0 mm
- LED/camera head PCB v0.8: 50.0 x 90.0 mm
- OVONIC 2S LiPo: 61.9 x 16.3 x 13.4 mm, pocket modeled at 64.5 x 18.9 x 15.4 mm
- Protective acrylic panel: 49.0 x 35.0 x 1.0 mm
- Three RGBW-lit acrylic squares: 18.0 x 18.0 x 1.0 mm each

## Parts

The `stl/` folder contains separate printable/importable parts:

- `01_phone_back_sled.stl`: case-backed sled with phone camera keepout and M3 bosses.
- `02_main_board_retainer.stl`: low retainer frame for the main PCB.
- `03_ovonic_2s_battery_cradle.stl`: open-top battery pocket with internal anti-slide stops.
- `04_head_board_camera_effect_chamber.stl`: head-board chamber with acrylic slide rails, lens ring, and M3 tabs.
- `06_clear_acrylic_lens_panel_template.stl`: 1 mm acrylic reference part.
- `07_left_reflective_insert.stl` and `07_right_reflective_insert.stl`: optional flat chamber side reflector backers.
- `08_acrylic_square_1_template.stl`, `09_acrylic_square_2_template.stl`, and `10_acrylic_square_3_template.stl`: clear square acrylic templates for the three independently lit RGBW zones.
- `00_housing_all_parts_preview.stl`: non-print assembly preview. It is not imported by the Fusion script because it would duplicate the real components.

## Fusion 360

Use `iphone16e_housing_v0_1.py` in Autodesk Fusion 360 to import the generated STLs as separate named mesh components. `fusion360_import_housing_components.py` is kept as a descriptive duplicate. The script skips the preview STL and places the printable parts at their assembly offsets so each component stays accessible from the Fusion browser.

## Screw Hardware

- Use M3 hex-socket screws.
- Modeled clearance holes: 3.2 mm.
- Modeled boss OD: 7.0 mm.
- Modeled cap-head/counterbore reference: 6.2 mm.
- Start with M3 x 6 mm for covers/retainers and M3 x 8 mm where the chamber stack needs more bite.

## Print-Fit Notes

- Print the sled and chamber at 1:1 before final fabrication. The Speck/FarmingtonSpeck case camera opening is not published as a dimensional drawing.
- The v0.8 main PCB is almost the same width as the phone body, so the housing uses shallow retainer rails instead of thick full-width side walls.
- The v0.8 head board is taller to hold six added RGBW edge LEDs. Confirm that the three acrylic-square slots line up with D5-D10 before final print.
- The clear acrylic slot is modeled with 0.45 mm total clearance around 1.0 mm sheet. Adjust if your acrylic is laser-cut oversized.
- The side reflector inserts are plastic backing strips. Apply mirror mylar, chrome vinyl, or polished foil to the inward face.
- Keep UVA/IR leakage contained; use black opaque filament for the chamber body and only use clear acrylic at the intended protective lens.

## Generated Bounds

```json
{
  "01_phone_back_sled.stl": {
    "triangles": 1224,
    "bounds_mm": {
      "min": [
        0,
        0,
        0
      ],
      "max": [
        76.8,
        151.0,
        7.2
      ],
      "size": [
        76.8,
        151.0,
        7.2
      ]
    }
  },
  "02_main_board_retainer.stl": {
    "triangles": 2364,
    "bounds_mm": {
      "min": [
        2.6,
        3.0,
        0
      ],
      "max": [
        74.2,
        144.3,
        8.0
      ],
      "size": [
        71.6,
        141.3,
        8.0
      ]
    }
  },
  "03_ovonic_2s_battery_cradle.stl": {
    "triangles": 108,
    "bounds_mm": {
      "min": [
        0,
        0,
        0
      ],
      "max": [
        68.5,
        22.9,
        17.4
      ],
      "size": [
        68.5,
        22.9,
        17.4
      ]
    }
  },
  "04_head_board_camera_effect_chamber.stl": {
    "triangles": 2336,
    "bounds_mm": {
      "min": [
        0,
        0,
        0
      ],
      "max": [
        58.0,
        114.0,
        16.05
      ],
      "size": [
        58.0,
        114.0,
        16.05
      ]
    }
  },
  "06_clear_acrylic_lens_panel_template.stl": {
    "triangles": 12,
    "bounds_mm": {
      "min": [
        0,
        0,
        0
      ],
      "max": [
        49.0,
        35.0,
        1.0
      ],
      "size": [
        49.0,
        35.0,
        1.0
      ]
    }
  },
  "07_left_reflective_insert.stl": {
    "triangles": 12,
    "bounds_mm": {
      "min": [
        0,
        0,
        0
      ],
      "max": [
        1.0,
        37.5,
        10.8
      ],
      "size": [
        1.0,
        37.5,
        10.8
      ]
    }
  },
  "07_right_reflective_insert.stl": {
    "triangles": 12,
    "bounds_mm": {
      "min": [
        0.0,
        0,
        0
      ],
      "max": [
        1.0,
        37.5,
        10.8
      ],
      "size": [
        1.0,
        37.5,
        10.8
      ]
    }
  },
  "08_acrylic_square_1_template.stl": {
    "triangles": 12,
    "bounds_mm": {
      "min": [
        0,
        0,
        0
      ],
      "max": [
        18.0,
        18.0,
        1.0
      ],
      "size": [
        18.0,
        18.0,
        1.0
      ]
    }
  },
  "09_acrylic_square_2_template.stl": {
    "triangles": 12,
    "bounds_mm": {
      "min": [
        0,
        0,
        0
      ],
      "max": [
        18.0,
        18.0,
        1.0
      ],
      "size": [
        18.0,
        18.0,
        1.0
      ]
    }
  },
  "10_acrylic_square_3_template.stl": {
    "triangles": 12,
    "bounds_mm": {
      "min": [
        0,
        0,
        0
      ],
      "max": [
        18.0,
        18.0,
        1.0
      ],
      "size": [
        18.0,
        18.0,
        1.0
      ]
    }
  },
  "00_housing_all_parts_preview.stl": {
    "triangles": 6104,
    "bounds_mm": {
      "min": [
        0.0,
        0.0,
        0.0
      ],
      "max": [
        76.8,
        151.0,
        34.4
      ],
      "size": [
        76.8,
        151.0,
        34.4
      ]
    }
  }
}
```
