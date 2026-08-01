# v0.9 Physical Measurement Worksheet

Status: required before v0.9 KiCad geometry, Gerbers, BOM/CPL, or housing updates are generated.

Use this worksheet with digital calipers and the actual parts you will build with. Record all dimensions in millimeters. Prefer 0.1 mm precision when possible, and measure each critical dimension at least twice.

## Coordinate Convention

Use a consistent top-left origin for each board or opening:

```text
origin: top-left corner when the board/component text is readable upright
x: left to right
y: top to bottom
z: thickness or height above the board/back surface
```

If a board has no obvious upright orientation, take a photo, mark the origin on the photo, and use that orientation for every measurement.

## Tools

- Digital calipers.
- Ruler or caliper depth probe for slot depth and case thickness.
- Flatbed scanner or straight-down phone photo with a ruler in frame for cross-checking outlines.
- Fine marker or low-tack tape for marking datum points.

## Measurement Rules

- Do not use marketplace listing dimensions as final PCB data. They are often rounded.
- Measure connector shells, button caps, USB-C plugs, and tall components as real keepouts, not just board copper outlines.
- Record whether USB-C ports need direct cable access, removable service access, or pogo/programming pads.
- Keep antenna areas free of copper, batteries, dense wiring, and metalized coatings.
- Do not order v0.9 PCBs until every required row below has an actual measured value or a deliberate "not used" note.

## ESP32-S3 Camera Board

| ID | Measurement | Value mm | Tolerance | Notes |
|---|---|---:|---:|---|
| S3-01 | Board overall width |  | +/-0.2 | x dimension |
| S3-02 | Board overall height |  | +/-0.2 | y dimension |
| S3-03 | PCB thickness |  | +/-0.1 | Usually about 1.0-1.6 mm |
| S3-04 | Maximum component height, top side |  | +/-0.2 | Include camera connector and headers if populated |
| S3-05 | Maximum component height, bottom side |  | +/-0.2 | Include solder joints |
| S3-06 | USB-C shell center x from origin |  | +/-0.2 | Service/access cutout |
| S3-07 | USB-C shell center y from origin |  | +/-0.2 | Service/access cutout |
| S3-08 | USB-C shell width |  | +/-0.2 | Include cable plug clearance separately if needed |
| S3-09 | USB-C shell depth/height keepout |  | +/-0.2 | Projection from board edge |
| S3-10 | Antenna keepout rectangle x/y/width/height |  | +/-0.5 | Mark exact antenna end of board |
| S3-11 | Mounting hole 1 center x/y and diameter |  | +/-0.2 | Repeat for each hole |
| S3-12 | Mounting hole 2 center x/y and diameter |  | +/-0.2 |  |
| S3-13 | Mounting hole 3 center x/y and diameter |  | +/-0.2 | If present |
| S3-14 | Mounting hole 4 center x/y and diameter |  | +/-0.2 | If present |
| S3-15 | Header row 1 first pin center x/y |  | +/-0.2 | If populated or socketed |
| S3-16 | Header row 1 pitch and pin count |  | +/-0.1 |  |
| S3-17 | Header row 2 first pin center x/y |  | +/-0.2 | If present |
| S3-18 | Header row 2 pitch and pin count |  | +/-0.1 |  |
| S3-19 | GC2145/FPC connector center x/y |  | +/-0.2 | Camera ribbon connector on S3 board |
| S3-20 | Reset/boot button keepouts x/y/width/height |  | +/-0.2 | Include finger/tool access if enclosed |

## GC2145 Ribbon Camera Module

| ID | Measurement | Value mm | Tolerance | Notes |
|---|---|---:|---:|---|
| CAM-01 | Camera PCB width |  | +/-0.1 | x dimension |
| CAM-02 | Camera PCB height |  | +/-0.1 | y dimension |
| CAM-03 | Camera PCB thickness |  | +/-0.1 |  |
| CAM-04 | Lens optical center x from camera PCB origin |  | +/-0.1 | Most important optical datum |
| CAM-05 | Lens optical center y from camera PCB origin |  | +/-0.1 | Most important optical datum |
| CAM-06 | Lens barrel outside diameter |  | +/-0.1 | Defines chamber opening |
| CAM-07 | Lens total height above PCB |  | +/-0.1 | Include focus ring if present |
| CAM-08 | Ribbon tail width |  | +/-0.1 |  |
| CAM-09 | Ribbon free length from module to connector |  | +/-0.5 | Minimum bend radius matters |
| CAM-10 | Ribbon exit side and direction |  |  | top, bottom, left, right |
| CAM-11 | Required lens-to-phone-case-opening clearance |  | +/-0.2 | Measure with module placed in intended orientation |

## ESP32-C6-LCD-1.47 Display Board

| ID | Measurement | Value mm | Tolerance | Notes |
|---|---|---:|---:|---|
| C6-01 | Board overall width |  | +/-0.2 | x dimension |
| C6-02 | Board overall height |  | +/-0.2 | y dimension |
| C6-03 | PCB thickness |  | +/-0.1 |  |
| C6-04 | LCD active area width |  | +/-0.1 | Lit image only |
| C6-05 | LCD active area height |  | +/-0.1 | Lit image only |
| C6-06 | LCD active area top-left x/y from board origin |  | +/-0.1 | Required for projection alignment |
| C6-07 | Cover glass/display stack height above PCB |  | +/-0.1 |  |
| C6-08 | Maximum component height, top side |  | +/-0.2 | Include USB-C/buttons |
| C6-09 | Maximum component height, bottom side |  | +/-0.2 |  |
| C6-10 | USB-C shell center x/y |  | +/-0.2 | Must remain accessible or serviceable |
| C6-11 | USB-C shell width/depth keepout |  | +/-0.2 | Include plug clearance if needed |
| C6-12 | Reset/boot button keepouts x/y/width/height |  | +/-0.2 | If present |
| C6-13 | Mounting hole centers and diameters |  | +/-0.2 | List all holes |
| C6-14 | Antenna keepout rectangle x/y/width/height |  | +/-0.5 | Keep copper/metal/battery away |

## Acrylic Or Glass Projection Sheet

| ID | Measurement | Value mm/deg | Tolerance | Notes |
|---|---|---:|---:|---|
| OPT-01 | Sheet width |  | +/-0.2 |  |
| OPT-02 | Sheet height |  | +/-0.2 |  |
| OPT-03 | Sheet thickness |  | +/-0.1 | Acrylic or glass |
| OPT-04 | Target sheet angle | 45 | +/-1 deg | Confirm actual built angle |
| OPT-05 | Slot insertion depth |  | +/-0.2 |  |
| OPT-06 | Visible projection area width |  | +/-0.2 | In final chamber |
| OPT-07 | Visible projection area height |  | +/-0.2 | In final chamber |
| OPT-08 | LCD active area to sheet distance |  | +/-0.5 | Along optical path |
| OPT-09 | Camera lens center to sheet nearest point |  | +/-0.5 | Prevent blocking camera image |
| OPT-10 | Sheet edge-to-LED distances for Acrylic 1/2/3 |  | +/-0.5 | Check light injection path |

## iPhone 16e Case And Camera Opening

| ID | Measurement | Value mm | Tolerance | Notes |
|---|---|---:|---:|---|
| CASE-01 | Case outer width at camera area |  | +/-0.2 |  |
| CASE-02 | Case outer height reference near camera area |  | +/-0.2 |  |
| CASE-03 | Camera opening width |  | +/-0.1 | Actual clear aperture |
| CASE-04 | Camera opening height |  | +/-0.1 | Actual clear aperture |
| CASE-05 | Camera opening top-left x/y from case top-left |  | +/-0.2 | Use physical case datum |
| CASE-06 | Camera opening corner radius |  | +/-0.2 | If rounded rectangle |
| CASE-07 | Case thickness at camera opening lip |  | +/-0.1 | z clearance |
| CASE-08 | Case back thickness where sled attaches |  | +/-0.1 | z clearance |
| CASE-09 | Available flat mounting area width/height |  | +/-0.5 | Avoid buttons, magnets, lip features |
| CASE-10 | Phone camera lens protrusion clearance needed |  | +/-0.2 | Measure with phone installed if possible |

## Assembly Clearances

| ID | Measurement | Value mm | Tolerance | Notes |
|---|---|---:|---:|---|
| ASM-01 | Minimum clearance from GC2145 lens to case opening edge |  | >=0.5 | More is better |
| ASM-02 | Minimum clearance from C6 LCD board to phone/case |  | >=0.5 | Include flex and plug access |
| ASM-03 | Battery clearance to S3 antenna keepout |  | >=5.0 | Avoid antenna shielding |
| ASM-04 | Battery clearance to C6 antenna keepout |  | >=5.0 | Avoid antenna shielding |
| ASM-05 | USB-C plug insertion/removal path for S3 |  |  | Describe access |
| ASM-06 | USB-C plug insertion/removal path for C6 |  |  | Describe access |
| ASM-07 | Main sled total thickness added to phone |  | +/-0.5 | Include tallest stack |
| ASM-08 | Hologram chamber total height above phone back |  | +/-0.5 | Include cover/retainer |

## Photo Evidence Checklist

Take straight-down photos with a ruler in frame for:

- ESP32-S3 board front.
- ESP32-S3 board back.
- GC2145 camera module front.
- GC2145 camera module back/ribbon route.
- ESP32-C6 LCD board front with active display lit.
- ESP32-C6 LCD board back.
- Phone case camera opening, phone removed.
- Phone case camera opening, phone installed.
- Acrylic/glass test sheet in the intended 45 degree holder.

## Next Step After Capture

After every required row is filled, copy the values into `measurements_template.json` or `measurement_capture.csv`. Then regenerate the v0.9 KiCad geometry and run:

```text
KiCad DRC
BOM/CPL export
Gerber export
3D/housing clearance update
webapp/package validation
```
