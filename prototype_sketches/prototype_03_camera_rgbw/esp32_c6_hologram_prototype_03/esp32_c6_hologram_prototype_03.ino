#define DEFAULT_HOLOGRAM_PROTOTYPE 3
/*
  Spectrum Hologram Display
  Target: Waveshare-style ESP32-C6-LCD-1.47 / ST7789 172x320 LCD

  The display shows a mirrored high-contrast pattern for a 45 degree acrylic
  Pepper's-ghost window over the camera chamber. It is controlled from the
  webapp with:

    GET /status
    GET /hologram?power=1&mode=2&brightness=180&speed=120
        &r1=0&g1=220&b1=255&r2=255&g2=60&b2=180&r3=255&g3=255&b3=255

  Board defaults use the public ESP32-C6-LCD-1.47 ST7789 pin map:
    CS 14, MOSI 6, SCLK 7, MISO 13, DC 15, BL 22, RST 21.
*/

#include <Arduino.h>
#include <Arduino_GFX_Library.h>
#include <WebServer.h>
#include <WiFi.h>

#ifndef DEFAULT_HOLOGRAM_PROTOTYPE
#define DEFAULT_HOLOGRAM_PROTOTYPE 5
#endif

// Fill these in when you want the display to join the same LAN as the camera.
const char *WIFI_STA_SSID = "";
const char *WIFI_STA_PASSWORD = "";

const char *AP_SSID = "SpectrumHolo";
const char *AP_PASSWORD = "holo-change-me";
IPAddress AP_IP(192, 168, 8, 1);
IPAddress AP_GATEWAY(192, 168, 8, 1);
IPAddress AP_MASK(255, 255, 255, 0);

constexpr uint8_t LCD_CS = 14;
constexpr uint8_t LCD_MOSI = 6;
constexpr uint8_t LCD_SCLK = 7;
constexpr uint8_t LCD_MISO = 13;
constexpr uint8_t LCD_DC = 15;
constexpr uint8_t LCD_BL = 22;
constexpr uint8_t LCD_RST = 21;
constexpr int16_t LCD_W = 172;
constexpr int16_t LCD_H = 320;
constexpr uint16_t COLOR_BLACK = 0x0000;

Arduino_DataBus *bus = new Arduino_ESP32SPI(LCD_DC, LCD_CS, LCD_SCLK, LCD_MOSI, LCD_MISO);
Arduino_GFX *gfx = new Arduino_ST7789(
    bus,
    LCD_RST,
    0,
    true,
    LCD_W,
    LCD_H,
    34,
    0,
    34,
    0);

WebServer server(80);

struct RgbColor {
  uint8_t r;
  uint8_t g;
  uint8_t b;
};

struct HologramState {
  bool power = false;
  uint8_t mode = 2;
  uint8_t brightness = 180;
  uint8_t speed = 96;
  RgbColor c1 = {0, 210, 255};
  RgbColor c2 = {255, 60, 190};
  RgbColor c3 = {255, 255, 255};
  uint32_t frame = 0;
};

HologramState holo;
uint32_t lastDrawAt = 0;

uint8_t clampByteArg(const String &name, uint8_t fallback) {
  if (!server.hasArg(name)) return fallback;
  const int value = server.arg(name).toInt();
  return (uint8_t)max(0, min(255, value));
}

bool parseSwitchArg(const String &name, bool fallback) {
  if (!server.hasArg(name)) return fallback;
  const String value = server.arg(name);
  return value == "1" || value == "true" || value == "on";
}

uint16_t to565(RgbColor c, uint8_t brightness) {
  const uint16_t r = ((uint16_t)c.r * brightness) / 255;
  const uint16_t g = ((uint16_t)c.g * brightness) / 255;
  const uint16_t b = ((uint16_t)c.b * brightness) / 255;
  return gfx->color565(r, g, b);
}

RgbColor blend(RgbColor a, RgbColor b, uint8_t amount) {
  return {
      (uint8_t)(((uint16_t)a.r * (255 - amount) + (uint16_t)b.r * amount) / 255),
      (uint8_t)(((uint16_t)a.g * (255 - amount) + (uint16_t)b.g * amount) / 255),
      (uint8_t)(((uint16_t)a.b * (255 - amount) + (uint16_t)b.b * amount) / 255)};
}

String statusJson() {
  String body = "{";
  body += "\"prototype\":";
  body += String(DEFAULT_HOLOGRAM_PROTOTYPE);
  body += ",\"display\":\"esp32-c6-lcd-1.47-st7789\"";
  body += ",\"power\":";
  body += holo.power ? "1" : "0";
  body += ",\"mode\":";
  body += String(holo.mode);
  body += ",\"brightness\":";
  body += String(holo.brightness);
  body += ",\"speed\":";
  body += String(holo.speed);
  body += ",\"r1\":";
  body += String(holo.c1.r);
  body += ",\"g1\":";
  body += String(holo.c1.g);
  body += ",\"b1\":";
  body += String(holo.c1.b);
  body += ",\"r2\":";
  body += String(holo.c2.r);
  body += ",\"g2\":";
  body += String(holo.c2.g);
  body += ",\"b2\":";
  body += String(holo.c2.b);
  body += ",\"r3\":";
  body += String(holo.c3.r);
  body += ",\"g3\":";
  body += String(holo.c3.g);
  body += ",\"b3\":";
  body += String(holo.c3.b);
  body += ",\"ip\":\"";
  body += WiFi.getMode() == WIFI_MODE_AP ? WiFi.softAPIP().toString() : WiFi.localIP().toString();
  body += "\"}";
  return body;
}

void addCors() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void sendJson(const String &body) {
  addCors();
  server.send(200, "application/json", body);
}

void handleOptions() {
  addCors();
  server.send(204);
}

void drawGradientRect(int16_t x, int16_t y, int16_t w, int16_t h, bool horizontal, bool reverse) {
  if (w <= 0 || h <= 0) return;

  const int16_t steps = horizontal ? w : h;
  for (int16_t i = 0; i < steps; i++) {
    const uint8_t phase = (uint8_t)((((uint32_t)i * 255) / max<int16_t>(1, steps - 1) + holo.frame) & 0xFF);
    const uint8_t t = reverse ? (255 - phase) : phase;
    RgbColor c = t < 128 ? blend(holo.c1, holo.c2, t * 2) : blend(holo.c2, holo.c3, (t - 128) * 2);
    const uint16_t color = to565(c, holo.brightness);
    if (horizontal) {
      gfx->drawFastVLine(x + i, y, h, color);
    } else {
      gfx->drawFastHLine(x, y + i, w, color);
    }
  }
}

void drawPane(int16_t x, int16_t y, int16_t w, int16_t h, uint8_t rotation) {
  drawGradientRect(x, y, w, h, rotation % 2 == 0, rotation > 1);
  const uint16_t glow = to565(holo.c3, min<uint8_t>(255, holo.brightness + 35));
  const uint16_t edge = to565(holo.c1, min<uint8_t>(255, holo.brightness + 18));

  gfx->drawRoundRect(x, y, w, h, 8, edge);
  gfx->drawRoundRect(x + 2, y + 2, w - 4, h - 4, 6, glow);

  const int16_t cx = x + w / 2;
  const int16_t cy = y + h / 2;
  const int16_t pulse = 6 + ((holo.frame / 8) % 18);
  gfx->drawCircle(cx, cy, pulse, glow);
  gfx->drawCircle(cx, cy, pulse + 6, edge);
  gfx->drawFastHLine(cx - 26, cy, 52, glow);
  gfx->drawFastVLine(cx, cy - 22, 44, glow);
}

void drawSolid() {
  gfx->fillScreen(to565(holo.c1, holo.brightness));
}

void drawTwoOrThreeColorFill() {
  drawGradientRect(0, 0, LCD_W, LCD_H, false, false);
}

void drawHologramCross() {
  gfx->fillScreen(COLOR_BLACK);
  drawPane(28, 15, 116, 62, 0);
  drawPane(28, 243, 116, 62, 2);
  drawPane(9, 103, 62, 114, 3);
  drawPane(101, 103, 62, 114, 1);

  const uint16_t center = to565(holo.c2, holo.brightness);
  gfx->drawCircle(LCD_W / 2, LCD_H / 2, 18, center);
  gfx->drawCircle(LCD_W / 2, LCD_H / 2, 31, to565(holo.c3, holo.brightness));
  gfx->drawFastHLine(54, LCD_H / 2, 64, center);
  gfx->drawFastVLine(LCD_W / 2, 128, 64, center);
}

void drawScanReticle() {
  gfx->fillScreen(COLOR_BLACK);
  const uint16_t primary = to565(holo.c1, holo.brightness);
  const uint16_t accent = to565(holo.c2, holo.brightness);
  const uint16_t white = to565(holo.c3, holo.brightness);
  const int16_t scan = (holo.frame * 3) % LCD_H;

  for (int16_t y = 0; y < LCD_H; y += 18) {
    gfx->drawFastHLine(14, y, LCD_W - 28, (y / 18) % 2 ? primary : accent);
  }
  gfx->drawFastHLine(0, scan, LCD_W, white);
  gfx->drawFastHLine(0, max(0, scan - 2), LCD_W, accent);
  gfx->drawRoundRect(20, 58, LCD_W - 40, LCD_H - 116, 16, primary);
  gfx->drawCircle(LCD_W / 2, LCD_H / 2, 44, accent);
  gfx->drawCircle(LCD_W / 2, LCD_H / 2, 22, white);
  gfx->drawFastHLine(38, LCD_H / 2, 96, white);
  gfx->drawFastVLine(LCD_W / 2, 112, 96, white);
}

void drawHologram() {
  if (!holo.power || holo.brightness == 0) {
    gfx->fillScreen(COLOR_BLACK);
    return;
  }

  switch (holo.mode) {
    case 0:
      drawSolid();
      break;
    case 1:
      drawTwoOrThreeColorFill();
      break;
    case 3:
      drawScanReticle();
      break;
    case 2:
    default:
      drawHologramCross();
      break;
  }
}

void handleRoot() {
  addCors();
  server.send(
      200,
      "text/html",
      "<!doctype html><meta name='viewport' content='width=device-width,initial-scale=1'>"
      "<title>Spectrum Hologram Display</title>"
      "<body style='font-family:system-ui;background:#05080d;color:#eaf6fb'>"
      "<h1>Spectrum Hologram Display</h1>"
      "<p>Use /hologram to set power, mode, brightness, speed, r1/g1/b1, r2/g2/b2, r3/g3/b3.</p>"
      "<pre id='s'></pre><script>fetch('/status').then(r=>r.json()).then(j=>s.textContent=JSON.stringify(j,null,2))</script>");
}

void handleStatus() {
  sendJson(statusJson());
}

void handleHologram() {
  holo.power = parseSwitchArg("power", holo.power);
  holo.mode = min<uint8_t>(3, clampByteArg("mode", holo.mode));
  holo.brightness = clampByteArg("brightness", holo.brightness);
  holo.speed = clampByteArg("speed", holo.speed);
  holo.c1 = {clampByteArg("r1", holo.c1.r), clampByteArg("g1", holo.c1.g), clampByteArg("b1", holo.c1.b)};
  holo.c2 = {clampByteArg("r2", holo.c2.r), clampByteArg("g2", holo.c2.g), clampByteArg("b2", holo.c2.b)};
  holo.c3 = {clampByteArg("r3", holo.c3.r), clampByteArg("g3", holo.c3.g), clampByteArg("b3", holo.c3.b)};
  drawHologram();
  sendJson(statusJson());
}

void handleNotFound() {
  addCors();
  server.send(404, "application/json", "{\"error\":\"not-found\"}");
}

void startNetwork() {
  WiFi.mode(WIFI_STA);

  if (strlen(WIFI_STA_SSID) > 0) {
    WiFi.begin(WIFI_STA_SSID, WIFI_STA_PASSWORD);
    Serial.print("Connecting to Wi-Fi");
    for (uint8_t i = 0; i < 30 && WiFi.status() != WL_CONNECTED; i++) {
      delay(250);
      Serial.print(".");
    }
    Serial.println();

    if (WiFi.status() == WL_CONNECTED) {
      Serial.print("Hologram display: http://");
      Serial.println(WiFi.localIP());
      return;
    }
  }

  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(AP_IP, AP_GATEWAY, AP_MASK);
  WiFi.softAP(AP_SSID, AP_PASSWORD);
  Serial.print("Hologram AP started: ");
  Serial.print(AP_SSID);
  Serial.print(" http://");
  Serial.println(WiFi.softAPIP());
}

void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println();
  Serial.println("Spectrum Hologram Display booting");

  pinMode(LCD_BL, OUTPUT);
  digitalWrite(LCD_BL, HIGH);

  if (!gfx->begin(80000000)) {
    Serial.println("LCD begin failed");
  }
  gfx->invertDisplay(true);
  drawHologram();

  startNetwork();

  server.on("/", HTTP_GET, handleRoot);
  server.on("/", HTTP_OPTIONS, handleOptions);
  server.on("/status", HTTP_GET, handleStatus);
  server.on("/status", HTTP_OPTIONS, handleOptions);
  server.on("/hologram", HTTP_GET, handleHologram);
  server.on("/hologram", HTTP_OPTIONS, handleOptions);
  server.onNotFound(handleNotFound);
  server.begin();

  Serial.println("Ready");
}

void loop() {
  server.handleClient();

  const uint16_t intervalMs = map(holo.speed, 0, 255, 180, 18);
  if (holo.power && millis() - lastDrawAt >= intervalMs) {
    lastDrawAt = millis();
    holo.frame++;
    if (holo.mode >= 2) {
      drawHologram();
    }
  }
}

