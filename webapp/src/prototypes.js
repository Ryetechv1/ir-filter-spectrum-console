export const PROTOTYPES = [
  {
    id: 1,
    label: "Prototype 1",
    title: "S3 camera + Nano + hologram display",
    stage: "Camera link, Arduino serial link, and C6 LCD projection",
    summary:
      "Bring up the ESP32-S3 GC2145 stream, Nano serial link, and ESP32-C6 LCD hologram pattern before any external LEDs are attached.",
    controls: {
      ir: false,
      uva: false,
      hologram: true,
      rgbwGroups: []
    },
    hardware: [
      "ESP32-S3 N16R8 camera board with GC2145 ribbon camera",
      "Arduino Nano",
      "ESP32-C6-LCD-1.47 hologram display",
      "USB-C cables for S3/C6 programming",
      "5 V bench/buck supply",
      "ESP32-S3-to-Nano serial wiring"
    ],
    tests: ["ESP32-S3 live stream", "Connect button/status", "Nano UART link idle", "C6 LCD hologram preview/apply"],
    sketches: {
      camera: "prototype_sketches/prototype_01_camera_arduino/esp32_s3_camera_prototype_01",
      display: "prototype_sketches/prototype_01_camera_arduino/esp32_c6_hologram_prototype_01",
      nano: "prototype_sketches/prototype_01_camera_arduino/nano_prototype_01",
      legacyCamera: "prototype_sketches/prototype_01_camera_arduino/esp32_cam_prototype_01"
    },
    diagram: "hardware/prototypes/prototype_01_wiring.svg",
    docs: "hardware/prototypes/PROTOTYPE_BUILDS.md#prototype-1-s3-camera--nano--hologram-display"
  },
  {
    id: 2,
    label: "Prototype 2",
    title: "IR + UVA mono LEDs",
    stage: "Camera, Arduino, hologram display, IR LED, and UVA LED",
    summary: "Add low-current MOSFET-switched IR and UVA channels with independent toggles and dimming.",
    controls: {
      ir: true,
      uva: true,
      hologram: true,
      rgbwGroups: []
    },
    hardware: [
      "Prototype 1 hardware",
      "950 nm IR LED",
      "375 nm UVA LED",
      "2x AO3400A NMOS",
      "100 ohm IR resistor",
      "68 ohm UVA resistor",
      "2x 150 ohm gate resistors",
      "2x 100k pulldowns"
    ],
    tests: ["IR dimming on Nano D5", "UVA dimming on Nano D6", "Toggle-off resets IR/UVA sliders", "C6 hologram remains independently controllable"],
    sketches: {
      camera: "prototype_sketches/prototype_02_ir_uva/esp32_s3_camera_prototype_02",
      display: "prototype_sketches/prototype_02_ir_uva/esp32_c6_hologram_prototype_02",
      nano: "prototype_sketches/prototype_02_ir_uva/nano_prototype_02",
      legacyCamera: "prototype_sketches/prototype_02_ir_uva/esp32_cam_prototype_02"
    },
    diagram: "hardware/prototypes/prototype_02_wiring.svg",
    docs: "hardware/prototypes/PROTOTYPE_BUILDS.md#prototype-2-ir--uva-leds"
  },
  {
    id: 3,
    label: "Prototype 3",
    title: "Camera RGBW pair",
    stage: "Camera, Arduino, hologram display, IR, UVA, and first 2 RGBW LEDs",
    summary: "Add the two camera-side SK6812 RGBW LEDs and verify color mixing before adding acrylic zones.",
    controls: {
      ir: true,
      uva: true,
      hologram: true,
      rgbwGroups: ["rgbw1", "rgbw2"]
    },
    hardware: [
      "Prototype 2 hardware",
      "2x SK6812 RGBW 5 mm LEDs",
      "330 ohm SK6812 data resistor",
      "47 uF to 100 uF LED rail capacitor",
      "45 degree acrylic/glass projection sheet above the camera chamber"
    ],
    tests: ["RGBW 1 independent mix", "RGBW 2 independent mix", "Visible preset drives only the two camera LEDs", "Hologram overlay alignment check"],
    sketches: {
      camera: "prototype_sketches/prototype_03_camera_rgbw/esp32_s3_camera_prototype_03",
      display: "prototype_sketches/prototype_03_camera_rgbw/esp32_c6_hologram_prototype_03",
      nano: "prototype_sketches/prototype_03_camera_rgbw/nano_prototype_03",
      legacyCamera: "prototype_sketches/prototype_03_camera_rgbw/esp32_cam_prototype_03"
    },
    diagram: "hardware/prototypes/prototype_03_wiring.svg",
    docs: "hardware/prototypes/PROTOTYPE_BUILDS.md#prototype-3-camera-rgbw-pair"
  },
  {
    id: 4,
    label: "Prototype 4",
    title: "Acrylic RGBW stack",
    stage: "Full LED load plus three acrylic squares",
    summary: "Breadboard the full LED load, hologram overlay, and all five RGBW zones before committing to PCB assembly.",
    controls: {
      ir: true,
      uva: true,
      hologram: true,
      rgbwGroups: ["rgbw1", "rgbw2", "rgbw3", "rgbw4", "rgbw5"]
    },
    hardware: [
      "Prototype 3 hardware",
      "6x additional SK6812 RGBW 5 mm LEDs",
      "Three stacked acrylic squares",
      "ESP32-C6 LCD positioned for acrylic reflection",
      "Extra 5 V/GND bus wiring"
    ],
    tests: ["Acrylic 1 pair mix", "Acrylic 2 pair mix", "Acrylic 3 pair mix", "Full 8-pixel chain order", "Projection visibility through the camera chamber"],
    sketches: {
      camera: "prototype_sketches/prototype_04_acrylic_rgbw/esp32_s3_camera_prototype_04",
      display: "prototype_sketches/prototype_04_acrylic_rgbw/esp32_c6_hologram_prototype_04",
      nano: "prototype_sketches/prototype_04_acrylic_rgbw/nano_prototype_04",
      legacyCamera: "prototype_sketches/prototype_04_acrylic_rgbw/esp32_cam_prototype_04"
    },
    diagram: "hardware/prototypes/prototype_04_wiring.svg",
    docs: "hardware/prototypes/PROTOTYPE_BUILDS.md#prototype-4-full-acrylic-rgbw-stack"
  },
  {
    id: 5,
    label: "Prototype 5",
    title: "Production PCB build",
    stage: "Final production target with S3 camera, C6 LCD, Nano driver, and PCB carrier",
    summary:
      "Use the v0.9 hologram/S3 planning package for the next PCB revision while keeping the DRC-clean v0.8 ESP32-CAM PCB package as the fallback order set.",
    controls: {
      ir: true,
      uva: true,
      hologram: true,
      rgbwGroups: ["rgbw1", "rgbw2", "rgbw3", "rgbw4", "rgbw5"]
    },
    hardware: [
      "Prototype 4 electrical load",
      "ESP32-S3 GC2145 camera board",
      "ESP32-C6-LCD-1.47 hologram display",
      "Main carrier PCB v0.9 planning package",
      "Legacy DRC-clean two-board PCB v0.8 backup",
      "2S LiPo charger/BMS and fused switch"
    ],
    tests: ["S3 camera compile", "C6 display compile", "Nano compile", "Webapp camera/light/display controls", "v0.9 PCB mechanical clearance review"],
    sketches: {
      camera: "esp32_s3_gc2145_webapp",
      display: "esp32_c6_hologram_display",
      nano: "nano_rgbw_ir_uva_driver",
      legacyCamera: "esp32_cam_ir_uv_webapp"
    },
    diagram: "hardware/prototypes/hologram_camera_architecture_v0_9.svg",
    docs: "hardware/pcb/iphone16e_hologram_s3_c6_v0_9/README_PCB_PLANNING.md"
  }
];

export const DEFAULT_PROTOTYPE_ID = 5;
export const PROTOTYPE_BY_ID = Object.fromEntries(PROTOTYPES.map((prototype) => [prototype.id, prototype]));

export function getPrototype(id) {
  return PROTOTYPE_BY_ID[Number(id)] || PROTOTYPE_BY_ID[DEFAULT_PROTOTYPE_ID];
}
