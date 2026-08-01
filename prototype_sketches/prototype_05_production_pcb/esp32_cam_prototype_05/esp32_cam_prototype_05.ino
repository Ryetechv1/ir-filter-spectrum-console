// Generated stage-specific ESP32-CAM sketch for Prototype 5.
#define DEFAULT_PROTOTYPE_BUILD 5
#include "esp_camera.h"
#include <WiFi.h>
#include <SHA1Builder.h>
#include <ESPmDNS.h>
#include <WebServer.h>

// Replace these for station-mode use. If left unchanged or connection fails,
// the sketch starts its own ESP32-CAM-SPECTRUM access point.
const char *WIFI_SSID = "YOUR_WIFI_NAME";
const char *WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

const char *AP_SSID = "ESP32-CAM-SPECTRUM";
const char *AP_PASSWORD = "change-this-password";

// AI-Thinker ESP32-CAM camera pins.
#define PWDN_GPIO_NUM 32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM 0
#define SIOD_GPIO_NUM 26
#define SIOC_GPIO_NUM 27
#define Y9_GPIO_NUM 35
#define Y8_GPIO_NUM 34
#define Y7_GPIO_NUM 39
#define Y6_GPIO_NUM 36
#define Y5_GPIO_NUM 21
#define Y4_GPIO_NUM 19
#define Y3_GPIO_NUM 18
#define Y2_GPIO_NUM 5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM 23
#define PCLK_GPIO_NUM 22

// UART link to the ESP32 1.14 LCD LED driver. Use these only if the microSD slot
// is not used. ESP32 LCD driver UART is 3.3 V logic; no divider is required to the ESP32 RX pin.
const uint8_t LED_UART_RX_PIN = 13;
const uint8_t LED_UART_TX_PIN = 14;
const uint32_t LED_LINK_BAUD = 19200;
const uint32_t LIGHT_AUTO_OFF_MS = 60000;

#ifndef DEFAULT_PROTOTYPE_BUILD
#define DEFAULT_PROTOTYPE_BUILD 5
#endif

WebServer server(80);
WebServer streamServer(81);
HardwareSerial ledSerial(1);

const char *STREAM_BOUNDARY = "esp32camstream";
const uint32_t STREAM_FRAME_INTERVAL_MS = 45;

bool driverPower = false;
bool irOn = false;
bool uvaOn = false;
uint8_t irDuty = 0;
uint8_t uvaDuty = 0;
uint32_t lastLightChangeMs = 0;

const uint8_t RGBW_GROUP_COUNT = 5;
const uint8_t PROTOTYPE_MIN = 1;
const uint8_t PROTOTYPE_MAX = 5;
bool rgbwOn[RGBW_GROUP_COUNT] = {false, false, false, false, false};
uint8_t rgbwDim[RGBW_GROUP_COUNT] = {0, 0, 0, 0, 0};
uint8_t rgbwR[RGBW_GROUP_COUNT] = {0, 0, 0, 0, 0};
uint8_t rgbwG[RGBW_GROUP_COUNT] = {0, 0, 0, 0, 0};
uint8_t rgbwB[RGBW_GROUP_COUNT] = {0, 0, 0, 0, 0};
uint8_t rgbwW[RGBW_GROUP_COUNT] = {0, 0, 0, 0, 0};
uint8_t activePrototype = DEFAULT_PROTOTYPE_BUILD;

const uint8_t VISIBLE_R = 204;
const uint8_t VISIBLE_G = 186;
const uint8_t VISIBLE_B = 142;
const uint8_t VISIBLE_W = 255;
const uint8_t DEFAULT_RGBW_DIM = 180;

const char INDEX_HTML[] PROGMEM = R"HTML(
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>ESP32-CAM Spectrum</title>
  <style>
    :root {
      color-scheme: dark;
      font-family: Arial, Helvetica, sans-serif;
      background: #0d1117;
      color: #eef2f8;
    }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      grid-template-rows: auto 1fr auto;
    }
    header, footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 14px;
      background: #151b23;
      border-bottom: 1px solid #273241;
    }
    footer {
      border-top: 1px solid #273241;
      border-bottom: 0;
      justify-content: center;
      color: #9fb0c3;
      font-size: 12px;
      text-align: center;
    }
    h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
    }
    main {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 360px;
      gap: 14px;
      padding: 14px;
      align-items: start;
    }
    .viewer {
      background: #05070a;
      border: 1px solid #273241;
      min-height: 240px;
      display: grid;
      place-items: center;
      overflow: hidden;
    }
    #frame {
      width: 100%;
      height: auto;
      display: block;
    }
    .controls {
      display: grid;
      gap: 12px;
    }
    #rgbwControls {
      display: grid;
      gap: 12px;
    }
    section {
      border: 1px solid #273241;
      background: #111821;
      padding: 12px;
    }
    label {
      display: grid;
      gap: 8px;
      font-size: 14px;
      font-weight: 700;
    }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: center;
      margin-bottom: 10px;
    }
    .readout {
      color: #9fb0c3;
      font-weight: 400;
    }
    input[type="range"] {
      width: 100%;
      margin: 0;
      accent-color: #2f81f7;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 12px;
    }
    button {
      min-height: 38px;
      border: 1px solid #344357;
      background: #1f2937;
      color: #eef2f8;
      font-weight: 700;
      cursor: pointer;
    }
    button.active {
      color: #061017;
      border-color: #62d96b;
      background: #62d96b;
    }
    button:active {
      transform: translateY(1px);
    }
    .status {
      color: #9fb0c3;
      font-size: 13px;
      overflow-wrap: anywhere;
    }
    @media (max-width: 780px) {
      main, .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>ESP32-CAM Spectrum</h1>
    <button id="pause" type="button">Pause</button>
  </header>
  <main>
    <div class="viewer">
      <img id="frame" alt="Camera frame">
    </div>
    <div class="controls">
      <section>
        <div class="row">
          <strong>LED driver rail</strong>
          <button id="power" type="button">Power off</button>
        </div>
      </section>
      <section>
        <div class="row">
          <strong>IR 950 nm</strong>
          <button data-toggle="irOn" type="button">Off</button>
        </div>
        <label>
          Dimming <span id="irValue" class="readout">0</span>
          <input id="ir" type="range" min="0" max="255" value="0">
        </label>
      </section>
      <section>
        <div class="row">
          <strong>UVA 375 nm</strong>
          <button data-toggle="uvaOn" type="button">Off</button>
        </div>
        <label>
          Dimming <span id="uvaValue" class="readout">0</span>
          <input id="uva" type="range" min="0" max="255" value="0">
        </label>
      </section>
      <div id="rgbwControls"></div>
      <section class="status" id="status">Connecting</section>
    </div>
  </main>
  <footer>Lights auto-off after 60 seconds. ESP32 driver and ESP32-S3 pins carry signal only.</footer>
  <script>
    const frame = document.getElementById('frame');
    const pauseButton = document.getElementById('pause');
    const powerButton = document.getElementById('power');
    const statusBox = document.getElementById('status');
    const rgbwControls = document.getElementById('rgbwControls');
    const rgbwGroups = [
      { index: 1, title: 'RGBW 1', detail: 'Camera right pixel' },
      { index: 2, title: 'RGBW 2', detail: 'Camera left pixel' },
      { index: 3, title: 'Acrylic 1', detail: 'Square 1 left/right pixels' },
      { index: 4, title: 'Acrylic 2', detail: 'Square 2 left/right pixels' },
      { index: 5, title: 'Acrylic 3', detail: 'Square 3 left/right pixels' }
    ];

    for (const group of rgbwGroups) {
      rgbwControls.insertAdjacentHTML('beforeend', `
        <section data-rgbw="${group.index}">
          <div class="row">
            <div><strong>${group.title}</strong><br><span class="readout">${group.detail}</span></div>
            <button data-toggle="rgbw${group.index}On" type="button">Off</button>
          </div>
          <label>
            Brightness <span id="rgbw${group.index}DimValue" class="readout">0</span>
            <input id="rgbw${group.index}Dim" type="range" min="0" max="255" value="0">
          </label>
          <div class="grid">
            <label>R <span id="r${group.index}Value" class="readout">0</span><input id="r${group.index}" type="range" min="0" max="255" value="0"></label>
            <label>G <span id="g${group.index}Value" class="readout">0</span><input id="g${group.index}" type="range" min="0" max="255" value="0"></label>
            <label>B <span id="b${group.index}Value" class="readout">0</span><input id="b${group.index}" type="range" min="0" max="255" value="0"></label>
            <label>W <span id="w${group.index}Value" class="readout">0</span><input id="w${group.index}" type="range" min="0" max="255" value="0"></label>
          </div>
        </section>
      `);
    }

    const dutyIds = ['ir', 'uva', ...rgbwGroups.flatMap(group => [`rgbw${group.index}Dim`, `r${group.index}`, `g${group.index}`, `b${group.index}`, `w${group.index}`])];
    const switchIds = ['irOn', 'uvaOn', ...rgbwGroups.map(group => `rgbw${group.index}On`)];
    const apiIds = ['power', ...switchIds, ...dutyIds];
    const visibleProfile = { r: 204, g: 186, b: 142, w: 255 };
    const defaultRgbwDim = 180;
    const state = Object.fromEntries(apiIds.map(id => [id, 0]));
    const sliders = Object.fromEntries(dutyIds.map(id => [id, document.getElementById(id)]));
    const values = Object.fromEntries(dutyIds.map(id => [id, document.getElementById(id + 'Value')]));
    let running = true;
    let nextRefresh = 0;

    function clampDuty(value) {
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) return 0;
      return Math.max(0, Math.min(255, Math.round(parsed)));
    }

    function rgbwKeys(index) {
      return ['r' + index, 'g' + index, 'b' + index, 'w' + index];
    }

    function rgbwDimKey(index) {
      return 'rgbw' + index + 'Dim';
    }

    function rgbwOnKey(index) {
      return 'rgbw' + index + 'On';
    }

    function setStatus(text) {
      statusBox.textContent = text;
    }

    function streamUrl() {
      return location.protocol + '//' + location.hostname + ':81/stream?t=' + Date.now();
    }

    function allOffPatch() {
      return Object.fromEntries(apiIds.map(id => [id, 0]));
    }

    function groupOffPatch(key) {
      if (key === 'irOn') return { irOn: 0, ir: 0 };
      if (key === 'uvaOn') return { uvaOn: 0, uva: 0 };
      const match = key.match(/^rgbw(\d+)On$/);
      if (match) {
        const index = Number(match[1]);
        return {
          [rgbwOnKey(index)]: 0,
          [rgbwDimKey(index)]: 0,
          ['r' + index]: 0,
          ['g' + index]: 0,
          ['b' + index]: 0,
          ['w' + index]: 0
        };
      }
      return {};
    }

    function visiblePatch(index) {
      return {
        ['r' + index]: visibleProfile.r,
        ['g' + index]: visibleProfile.g,
        ['b' + index]: visibleProfile.b,
        ['w' + index]: visibleProfile.w
      };
    }

    function rgbwHasColor(index) {
      return rgbwKeys(index).some(id => state[id] > 0);
    }

    function applyRemote(remote) {
      for (const id of apiIds) {
        if (remote[id] !== undefined) state[id] = clampDuty(remote[id]);
      }
    }

    function hasOutput() {
      return state.power && (
        (state.irOn && state.ir > 0) ||
        (state.uvaOn && state.uva > 0) ||
        rgbwGroups.some(group => state[rgbwOnKey(group.index)] && state[rgbwDimKey(group.index)] > 0 && rgbwHasColor(group.index))
      );
    }

    function updateLabels() {
      for (const id of dutyIds) {
        sliders[id].value = state[id];
        values[id].textContent = state[id];
      }
      powerButton.textContent = state.power ? 'Power on' : 'Power off';
      powerButton.className = state.power ? 'active' : '';
      document.querySelectorAll('button[data-toggle]').forEach(button => {
        const enabled = state[button.dataset.toggle] > 0;
        button.textContent = enabled ? 'On' : 'Off';
        button.className = enabled ? 'active' : '';
      });
    }

    async function pushState(patch = {}) {
      if (patch.power === 0) {
        Object.assign(state, allOffPatch());
      }
      Object.assign(state, patch);

      if (patch.ir !== undefined && state.ir > 0) {
        state.irOn = 1;
        state.power = 1;
      }
      if (patch.uva !== undefined && state.uva > 0) {
        state.uvaOn = 1;
        state.power = 1;
      }

      for (const group of rgbwGroups) {
        const index = group.index;
        const dimKey = rgbwDimKey(index);
        const onKey = rgbwOnKey(index);
        if (patch[dimKey] !== undefined && state[dimKey] > 0) {
          state[onKey] = 1;
          state.power = 1;
          if (!rgbwHasColor(index)) Object.assign(state, visiblePatch(index));
        }
        if (rgbwKeys(index).some(id => patch[id] !== undefined && state[id] > 0)) {
          state[onKey] = 1;
          state.power = 1;
          if (state[dimKey] === 0 && patch[dimKey] === undefined) state[dimKey] = defaultRgbwDim;
        }
      }

      const query = new URLSearchParams();
      for (const id of apiIds) query.set(id, String(state[id]));
      const response = await fetch('/led?' + query.toString(), { cache: 'no-store' });
      if (!response.ok) throw new Error(response.statusText);
      applyRemote(await response.json());
      updateLabels();
      const rgbwStatus = rgbwGroups.map(group => {
        const index = group.index;
        return `${group.title} ${state[rgbwDimKey(index)]}:${state['r' + index]}/${state['g' + index]}/${state['b' + index]}/${state['w' + index]}`;
      }).join(' | ');
      setStatus(`Power ${state.power ? 'on' : 'off'} | IR ${state.irOn ? state.ir : 0} | UVA ${state.uvaOn ? state.uva : 0} | ${rgbwStatus}`);
    }

    function refreshFrame() {
      if (!running) return;
      clearTimeout(nextRefresh);
      frame.src = streamUrl();
    }

    frame.addEventListener('load', () => {
      setStatus('Live stream active');
    });
    frame.addEventListener('error', () => {
      setStatus('Camera stream failed');
      nextRefresh = setTimeout(refreshFrame, 1000);
    });

    powerButton.addEventListener('click', () => {
      pushState(state.power ? allOffPatch() : { power: 1 }).catch(err => setStatus(err.message));
    });

    document.querySelectorAll('button[data-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        const key = button.dataset.toggle;
        const turnOn = state[key] ? 0 : 1;
        const patch = { power: 1, [key]: turnOn };

        if (!turnOn) {
          Object.assign(patch, groupOffPatch(key));
        }

        if (turnOn && key === 'irOn' && state.ir === 0) patch.ir = 128;
        if (turnOn && key === 'uvaOn' && state.uva === 0) patch.uva = 96;
        const rgbwMatch = key.match(/^rgbw(\d+)On$/);
        if (turnOn && rgbwMatch) {
          const index = Number(rgbwMatch[1]);
          const dimKey = rgbwDimKey(index);
          if (!rgbwHasColor(index)) Object.assign(patch, visiblePatch(index));
          if (state[dimKey] === 0) patch[dimKey] = defaultRgbwDim;
        }

        const simulated = { ...state, ...patch };
        const anyOutput = (simulated.irOn && simulated.ir > 0) ||
          (simulated.uvaOn && simulated.uva > 0) ||
          rgbwGroups.some(group => simulated[rgbwOnKey(group.index)] && simulated[rgbwDimKey(group.index)] > 0 && rgbwKeys(group.index).some(id => simulated[id] > 0));
        if (!turnOn && !anyOutput) patch.power = 0;

        pushState(patch).catch(err => setStatus(err.message));
      });
    });

    for (const id of dutyIds) {
      sliders[id].addEventListener('input', () => {
        state[id] = clampDuty(sliders[id].value);
        updateLabels();
      });
      sliders[id].addEventListener('change', () => {
        pushState({ [id]: clampDuty(sliders[id].value) }).catch(err => setStatus(err.message));
      });
    }

    pauseButton.addEventListener('click', () => {
      running = !running;
      pauseButton.textContent = running ? 'Pause' : 'Resume';
      frame.src = running ? streamUrl() : '/capture?t=' + Date.now();
    });

    updateLabels();
    pushState().catch(err => setStatus(err.message));
    refreshFrame();
  </script>
</body>
</html>
)HTML";

uint8_t parseDuty(const String &value) {
  int parsed = value.toInt();
  if (parsed < 0) parsed = 0;
  if (parsed > 255) parsed = 255;
  return static_cast<uint8_t>(parsed);
}

bool parseSwitch(const String &value) {
  return value.toInt() > 0 || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("on");
}

bool rgbwHasColor(uint8_t r, uint8_t g, uint8_t b, uint8_t w) {
  return r > 0 || g > 0 || b > 0 || w > 0;
}

void seedVisibleProfile(uint8_t &r, uint8_t &g, uint8_t &b, uint8_t &w) {
  r = VISIBLE_R;
  g = VISIBLE_G;
  b = VISIBLE_B;
  w = VISIBLE_W;
}

uint8_t sanitizePrototype(int value) {
  if (value < PROTOTYPE_MIN) return PROTOTYPE_MIN;
  if (value > PROTOTYPE_MAX) return PROTOTYPE_MAX;
  return (uint8_t)value;
}

const char *prototypeName(uint8_t prototype) {
  switch (sanitizePrototype(prototype)) {
    case 1: return "Prototype 1 - Camera + ESP32 driver link";
    case 2: return "Prototype 2 - IR + UVA mono LEDs";
    case 3: return "Prototype 3 - Camera RGBW pair";
    case 4: return "Prototype 4 - Acrylic RGBW stack";
    default: return "Prototype 5 - Production PCB build";
  }
}

uint8_t prototypeRgbwGroups(uint8_t prototype) {
  switch (sanitizePrototype(prototype)) {
    case 1:
    case 2:
      return 0;
    case 3:
      return 2;
    default:
      return RGBW_GROUP_COUNT;
  }
}

bool prototypeHasMono(uint8_t prototype) {
  return sanitizePrototype(prototype) >= 2;
}

void applyPrototypeLimits(
  uint8_t prototype,
  bool &nextDriverPower,
  bool &nextIrOn,
  bool &nextUvaOn,
  uint8_t &nextIrDuty,
  uint8_t &nextUvaDuty,
  bool nextRgbwOn[],
  uint8_t nextRgbwDim[],
  uint8_t nextRgbwR[],
  uint8_t nextRgbwG[],
  uint8_t nextRgbwB[],
  uint8_t nextRgbwW[]
) {
  if (!prototypeHasMono(prototype)) {
    nextIrOn = false;
    nextUvaOn = false;
    nextIrDuty = 0;
    nextUvaDuty = 0;
  }

  const uint8_t allowedGroups = prototypeRgbwGroups(prototype);
  for (uint8_t index = allowedGroups; index < RGBW_GROUP_COUNT; index++) {
    nextRgbwOn[index] = false;
    nextRgbwDim[index] = 0;
    nextRgbwR[index] = 0;
    nextRgbwG[index] = 0;
    nextRgbwB[index] = 0;
    nextRgbwW[index] = 0;
  }

  bool anyAllowedOutput =
    (nextIrOn && nextIrDuty > 0) ||
    (nextUvaOn && nextUvaDuty > 0);
  for (uint8_t index = 0; index < allowedGroups; index++) {
    anyAllowedOutput = anyAllowedOutput ||
      (nextRgbwOn[index] &&
        nextRgbwDim[index] > 0 &&
        rgbwHasColor(nextRgbwR[index], nextRgbwG[index], nextRgbwB[index], nextRgbwW[index]));
  }
  if (!anyAllowedOutput) {
    nextDriverPower = false;
  }
}

bool rgbwGroupActive(uint8_t index) {
  return rgbwOn[index] && rgbwDim[index] > 0 && rgbwHasColor(rgbwR[index], rgbwG[index], rgbwB[index], rgbwW[index]);
}

bool lightsActive() {
  if (!driverPower) {
    return false;
  }

  if ((irOn && irDuty > 0) || (uvaOn && uvaDuty > 0)) {
    return true;
  }

  for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
    if (rgbwGroupActive(index)) {
      return true;
    }
  }

  return false;
}

void sendLightState() {
  ledSerial.printf("L,%u,%u,%u", driverPower ? 1 : 0, irOn ? 1 : 0, uvaOn ? 1 : 0);
  for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
    ledSerial.printf(",%u", rgbwOn[index] ? 1 : 0);
  }
  ledSerial.printf(",%u,%u", irDuty, uvaDuty);
  for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
    ledSerial.printf(",%u,%u,%u,%u,%u", rgbwDim[index], rgbwR[index], rgbwG[index], rgbwB[index], rgbwW[index]);
  }
  ledSerial.print('\n');
}

void writeLights(
  bool nextDriverPower,
  bool nextIrOn,
  bool nextUvaOn,
  uint8_t nextIrDuty,
  uint8_t nextUvaDuty,
  const bool nextRgbwOn[],
  const uint8_t nextRgbwDim[],
  const uint8_t nextRgbwR[],
  const uint8_t nextRgbwG[],
  const uint8_t nextRgbwB[],
  const uint8_t nextRgbwW[]
) {
  driverPower = nextDriverPower;
  irOn = nextIrOn;
  uvaOn = nextUvaOn;
  irDuty = nextIrDuty;
  uvaDuty = nextUvaDuty;
  for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
    rgbwOn[index] = nextRgbwOn[index];
    rgbwDim[index] = nextRgbwDim[index];
    rgbwR[index] = nextRgbwR[index];
    rgbwG[index] = nextRgbwG[index];
    rgbwB[index] = nextRgbwB[index];
    rgbwW[index] = nextRgbwW[index];
  }
  sendLightState();

  if (lightsActive()) {
    lastLightChangeMs = millis();
  } else {
    lastLightChangeMs = 0;
  }
}

void writeAllOff() {
  bool offOn[RGBW_GROUP_COUNT] = {false, false, false, false, false};
  uint8_t offValues[RGBW_GROUP_COUNT] = {0, 0, 0, 0, 0};
  writeLights(false, false, false, 0, 0, offOn, offValues, offValues, offValues, offValues, offValues);
}

void serviceLightTimeout() {
  if (lightsActive() && millis() - lastLightChangeMs > LIGHT_AUTO_OFF_MS) {
    writeAllOff();
  }
}

void sendCorsHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

bool initCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.grab_mode = CAMERA_GRAB_LATEST;

  if (psramFound()) {
    config.frame_size = FRAMESIZE_VGA;
    config.jpeg_quality = 10;
    config.fb_count = 2;
    config.fb_location = CAMERA_FB_IN_PSRAM;
  } else {
    config.frame_size = FRAMESIZE_QVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
    config.fb_location = CAMERA_FB_IN_DRAM;
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed: 0x%x\n", err);
    return false;
  }

  sensor_t *sensor = esp_camera_sensor_get();
  if (sensor) {
    sensor->set_framesize(sensor, psramFound() ? FRAMESIZE_VGA : FRAMESIZE_QVGA);
    sensor->set_saturation(sensor, -2);
    sensor->set_brightness(sensor, 0);
    sensor->set_whitebal(sensor, 1);
    sensor->set_awb_gain(sensor, 1);
  }
  return true;
}

void initLights() {
  ledSerial.begin(LED_LINK_BAUD, SERIAL_8N1, LED_UART_RX_PIN, LED_UART_TX_PIN);
  writeAllOff();
}

void initWiFi() {
  const bool credentialsMissing = String(WIFI_SSID).startsWith("YOUR_");

  if (!credentialsMissing) {
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    WiFi.setSleep(false);

    Serial.print("Connecting to Wi-Fi");
    for (uint8_t i = 0; i < 30 && WiFi.status() != WL_CONNECTED; i++) {
      delay(500);
      Serial.print(".");
    }
    Serial.println();

    if (WiFi.status() == WL_CONNECTED) {
      Serial.print("Camera web app: http://");
      Serial.println(WiFi.localIP());
      Serial.print("Camera stream: http://");
      Serial.print(WiFi.localIP());
      Serial.println(":81/stream");
      if (MDNS.begin("esp32cam")) {
        Serial.println("mDNS: http://esp32cam.local/");
      }
      return;
    }
  }

  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_PASSWORD);
  WiFi.setSleep(false);
  Serial.print("Access point started. Connect to http://");
  Serial.println(WiFi.softAPIP());
  Serial.print("Access point stream: http://");
  Serial.print(WiFi.softAPIP());
  Serial.println(":81/stream");
}

void handleRoot() {
  sendCorsHeaders();
  server.send_P(200, "text/html", INDEX_HTML);
}

String lightStatusJson() {
  String body;
  body.reserve(1900);
  body += "{\"prototype\":";
  body += String(activePrototype);
  body += ",\"prototypeName\":\"";
  body += prototypeName(activePrototype);
  body += "\",\"rgbwGroups\":";
  body += String(prototypeRgbwGroups(activePrototype));
  body += ",\"power\":";
  body += driverPower ? "1" : "0";
  body += ",\"irOn\":";
  body += irOn ? "1" : "0";
  body += ",\"uvaOn\":";
  body += uvaOn ? "1" : "0";
  for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
    const uint8_t id = index + 1;
    body += ",\"rgbw";
    body += String(id);
    body += "On\":";
    body += rgbwOn[index] ? "1" : "0";
  }
  body += ",\"ir\":";
  body += String(irDuty);
  body += ",\"uva\":";
  body += String(uvaDuty);
  for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
    const uint8_t id = index + 1;
    body += ",\"rgbw";
    body += String(id);
    body += "Dim\":";
    body += String(rgbwDim[index]);
    body += ",\"r";
    body += String(id);
    body += "\":";
    body += String(rgbwR[index]);
    body += ",\"g";
    body += String(id);
    body += "\":";
    body += String(rgbwG[index]);
    body += ",\"b";
    body += String(id);
    body += "\":";
    body += String(rgbwB[index]);
    body += ",\"w";
    body += String(id);
    body += "\":";
    body += String(rgbwW[index]);
  }
  body += ",\"rgbwPixels\":8,\"driver\":\"esp32-lcd-1.14-sk6812-acrylic-v1.0\"}";
  return body;
}

void handleStatus() {
  sendCorsHeaders();
  server.send(200, "application/json", lightStatusJson());
}

void handleLed() {
  uint8_t nextPrototype = server.hasArg("prototype") ? sanitizePrototype(server.arg("prototype").toInt()) : activePrototype;
  bool nextDriverPower = server.hasArg("power") ? parseSwitch(server.arg("power")) : driverPower;
  bool nextIrOn = server.hasArg("irOn") ? parseSwitch(server.arg("irOn")) : irOn;
  bool nextUvaOn = server.hasArg("uvaOn") ? parseSwitch(server.arg("uvaOn")) : uvaOn;
  uint8_t nextIrDuty = server.hasArg("ir") ? parseDuty(server.arg("ir")) : irDuty;
  uint8_t nextUvaDuty = server.hasArg("uva") ? parseDuty(server.arg("uva")) : uvaDuty;
  bool nextRgbwOn[RGBW_GROUP_COUNT];
  uint8_t nextRgbwDim[RGBW_GROUP_COUNT];
  uint8_t nextRgbwR[RGBW_GROUP_COUNT];
  uint8_t nextRgbwG[RGBW_GROUP_COUNT];
  uint8_t nextRgbwB[RGBW_GROUP_COUNT];
  uint8_t nextRgbwW[RGBW_GROUP_COUNT];
  bool rgbwColorTouched[RGBW_GROUP_COUNT];

  for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
    const String id = String(index + 1);
    const String onKey = "rgbw" + id + "On";
    const String dimKey = "rgbw" + id + "Dim";
    const String rKey = "r" + id;
    const String gKey = "g" + id;
    const String bKey = "b" + id;
    const String wKey = "w" + id;

    nextRgbwOn[index] = server.hasArg(onKey) ? parseSwitch(server.arg(onKey)) : rgbwOn[index];
    nextRgbwDim[index] = server.hasArg(dimKey) ? parseDuty(server.arg(dimKey)) : rgbwDim[index];
    nextRgbwR[index] = server.hasArg(rKey) ? parseDuty(server.arg(rKey)) : rgbwR[index];
    nextRgbwG[index] = server.hasArg(gKey) ? parseDuty(server.arg(gKey)) : rgbwG[index];
    nextRgbwB[index] = server.hasArg(bKey) ? parseDuty(server.arg(bKey)) : rgbwB[index];
    nextRgbwW[index] = server.hasArg(wKey) ? parseDuty(server.arg(wKey)) : rgbwW[index];
    rgbwColorTouched[index] = server.hasArg(rKey) || server.hasArg(gKey) || server.hasArg(bKey) || server.hasArg(wKey);
  }

  if (!server.hasArg("irOn") && server.hasArg("ir") && nextIrDuty > 0) nextIrOn = true;
  if (!server.hasArg("uvaOn") && server.hasArg("uva") && nextUvaDuty > 0) nextUvaOn = true;

  for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
    const String id = String(index + 1);
    const String onKey = "rgbw" + id + "On";
    const String dimKey = "rgbw" + id + "Dim";

    if (server.hasArg(dimKey) && nextRgbwDim[index] > 0 && !rgbwHasColor(nextRgbwR[index], nextRgbwG[index], nextRgbwB[index], nextRgbwW[index])) {
      seedVisibleProfile(nextRgbwR[index], nextRgbwG[index], nextRgbwB[index], nextRgbwW[index]);
    }
    if (rgbwColorTouched[index] &&
        rgbwHasColor(nextRgbwR[index], nextRgbwG[index], nextRgbwB[index], nextRgbwW[index]) &&
        nextRgbwDim[index] == 0 &&
        !server.hasArg(dimKey)) {
      nextRgbwDim[index] = DEFAULT_RGBW_DIM;
    }
    if (server.hasArg(onKey) && nextRgbwOn[index]) {
      if (!rgbwHasColor(nextRgbwR[index], nextRgbwG[index], nextRgbwB[index], nextRgbwW[index])) {
        seedVisibleProfile(nextRgbwR[index], nextRgbwG[index], nextRgbwB[index], nextRgbwW[index]);
      }
      if (nextRgbwDim[index] == 0 && !server.hasArg(dimKey)) {
        nextRgbwDim[index] = DEFAULT_RGBW_DIM;
      }
    }
    if (!server.hasArg(onKey) &&
        ((server.hasArg(dimKey) && nextRgbwDim[index] > 0) ||
          (rgbwColorTouched[index] && rgbwHasColor(nextRgbwR[index], nextRgbwG[index], nextRgbwB[index], nextRgbwW[index])))) {
      nextRgbwOn[index] = true;
    }
  }

  applyPrototypeLimits(
    nextPrototype,
    nextDriverPower,
    nextIrOn,
    nextUvaOn,
    nextIrDuty,
    nextUvaDuty,
    nextRgbwOn,
    nextRgbwDim,
    nextRgbwR,
    nextRgbwG,
    nextRgbwB,
    nextRgbwW
  );

  bool anyNextOutput =
    (nextIrOn && nextIrDuty > 0) ||
    (nextUvaOn && nextUvaDuty > 0);

  for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
    anyNextOutput = anyNextOutput ||
      (nextRgbwOn[index] &&
        nextRgbwDim[index] > 0 &&
        rgbwHasColor(nextRgbwR[index], nextRgbwG[index], nextRgbwB[index], nextRgbwW[index]));
  }

  if (!server.hasArg("power") && anyNextOutput) {
    nextDriverPower = true;
  }

  if (!nextDriverPower) {
    nextIrOn = false;
    nextUvaOn = false;
    nextIrDuty = 0;
    nextUvaDuty = 0;
    for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
      nextRgbwOn[index] = false;
      nextRgbwDim[index] = 0;
      nextRgbwR[index] = 0;
      nextRgbwG[index] = 0;
      nextRgbwB[index] = 0;
      nextRgbwW[index] = 0;
    }
  } else {
    if (!nextIrOn) nextIrDuty = 0;
    if (!nextUvaOn) nextUvaDuty = 0;
    for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
      if (!nextRgbwOn[index]) {
        nextRgbwDim[index] = 0;
        nextRgbwR[index] = 0;
        nextRgbwG[index] = 0;
        nextRgbwB[index] = 0;
        nextRgbwW[index] = 0;
      }
    }
  }

  activePrototype = nextPrototype;
  writeLights(nextDriverPower, nextIrOn, nextUvaOn, nextIrDuty, nextUvaDuty, nextRgbwOn, nextRgbwDim, nextRgbwR, nextRgbwG, nextRgbwB, nextRgbwW);
  handleStatus();
}

void handleCapture() {
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    sendCorsHeaders();
    server.send(503, "text/plain", "Camera capture failed");
    return;
  }

  WiFiClient client = server.client();
  sendCorsHeaders();
  server.sendHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  server.sendHeader("Pragma", "no-cache");
  server.setContentLength(fb->len);
  server.send(200, "image/jpeg", "");
  client.write(fb->buf, fb->len);
  esp_camera_fb_return(fb);
}

void handleStream() {
  WiFiClient client = streamServer.client();

  client.println("HTTP/1.1 200 OK");
  client.println("Access-Control-Allow-Origin: *");
  client.println("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  client.println("Pragma: no-cache");
  client.println("Connection: close");
  client.print("Content-Type: multipart/x-mixed-replace; boundary=");
  client.println(STREAM_BOUNDARY);
  client.println();

  while (client.connected()) {
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb) {
      delay(50);
      server.handleClient();
      serviceLightTimeout();
      continue;
    }

    client.print("--");
    client.println(STREAM_BOUNDARY);
    client.println("Content-Type: image/jpeg");
    client.print("Content-Length: ");
    client.println(fb->len);
    client.println();
    const size_t written = client.write(fb->buf, fb->len);
    client.println();
    esp_camera_fb_return(fb);

    if (written != fb->len) {
      break;
    }

    server.handleClient();
    serviceLightTimeout();
    delay(STREAM_FRAME_INTERVAL_MS);
    yield();
  }
}

void handleOptions() {
  sendCorsHeaders();
  server.send(204);
}

void handleStreamOptions() {
  streamServer.sendHeader("Access-Control-Allow-Origin", "*");
  streamServer.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  streamServer.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  streamServer.send(204);
}

void handleStreamNotFound() {
  streamServer.sendHeader("Access-Control-Allow-Origin", "*");
  streamServer.send(404, "text/plain", "Not found");
}

void handleNotFound() {
  sendCorsHeaders();
  server.send(404, "text/plain", "Not found");
}

void initServer() {
  server.on("/", HTTP_GET, handleRoot);
  server.on("/", HTTP_OPTIONS, handleOptions);
  server.on("/status", HTTP_GET, handleStatus);
  server.on("/status", HTTP_OPTIONS, handleOptions);
  server.on("/led", HTTP_GET, handleLed);
  server.on("/led", HTTP_OPTIONS, handleOptions);
  server.on("/capture", HTTP_GET, handleCapture);
  server.on("/capture", HTTP_OPTIONS, handleOptions);
  server.onNotFound(handleNotFound);
  server.begin();

  streamServer.on("/", HTTP_GET, handleStream);
  streamServer.on("/", HTTP_OPTIONS, handleStreamOptions);
  streamServer.on("/stream", HTTP_GET, handleStream);
  streamServer.on("/stream", HTTP_OPTIONS, handleStreamOptions);
  streamServer.onNotFound(handleStreamNotFound);
  streamServer.begin();
}

void setup() {
  Serial.begin(115200);
  Serial.println();

  activePrototype = sanitizePrototype(DEFAULT_PROTOTYPE_BUILD);
  initLights();
  if (!initCamera()) {
    writeAllOff();
    return;
  }

  initWiFi();
  initServer();
  Serial.println("Ready");
}

void loop() {
  server.handleClient();
  streamServer.handleClient();
  serviceLightTimeout();
}
