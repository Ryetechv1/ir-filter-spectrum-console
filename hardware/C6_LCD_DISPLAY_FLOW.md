# ESP32-C6 LCD output path

The web console's 172 x 320 canvas is a simulation of the current C6 sketch's LCD drawing commands. It is not a camera image and is not a live screen capture from the board. The physical result requires the `esp32_c6_hologram_display` sketch on a compatible ESP32-C6-LCD-1.47, a working display, and a network route from the browser to that board.

1. Set Display output, Pattern, Brightness, Motion, and Color 1/2/3 in the web console. These controls update the browser simulation first.
2. Press Apply. The web console sends the values to `GET /hologram` at the configured C6 address. The default `http://192.168.8.1` is the C6 access-point address, not a public service.
3. The C6 parses `power`, `mode`, `brightness`, `speed`, and `r1/g1/b1` through `r3/g3/b3`. It redraws its 172 x 320 ST7789 LCD and returns the current state as JSON.
4. The physical LCD displays one of the following patterns:
   - Off: black.
   - Solid: full-screen Color 1.
   - Gradient: a full-height Color 1 -> Color 2 -> Color 3 gradient.
   - Hologram cross: black field, four gradient panes, outlines, circles, and a center reticle.
   - Scan reticle: black field, horizontal lines, rings, crosshair, and a moving scan line.
5. Motion 0 holds the current animation frame. Values 1-255 advance animated patterns at approximately 180-18 ms per frame. Solid has no movement. Brightness scales all three colors. The LCD uses RGB565, so its displayed colors may differ slightly from the browser's RGB rendering.
6. A correctly positioned 45-degree acrylic or glass surface may reflect the LCD pattern into the camera chamber. Reflection reverses and dims the perceived image. Alignment, coating, ambient light, enclosure geometry, and the viewer's angle determine what is visible. This is an optical reflection, not a volumetric hologram.

The ESP32-S3 camera runs separately. The connected board reported sensor PID `0x3660` (OV3660) during the October 2026 serial test; the project also contains a GC2145-target variant. Its MJPEG stream appears in the web console's Live view; the C6 sketch does not receive camera frames. The separate ESP32 1.14 LCD driver controls external illumination. A public GitHub Pages URL can show the interface from anywhere, but it cannot directly control local `192.168.x.x` devices across the Internet. A remote-control deployment would need an authenticated HTTPS bridge and network design; do not expose the C6's unauthenticated `/hologram` endpoint directly to the public Internet.
