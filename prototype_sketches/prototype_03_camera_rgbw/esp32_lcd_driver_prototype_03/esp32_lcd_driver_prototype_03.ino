// Generated stage-specific ESP32 1.14 inch LCD lighting driver sketch for Prototype 3.
#define DEFAULT_DRIVER_PROTOTYPE 3

/*
  ESP32 1.14 inch LCD RGBW IR/UVA Driver
  Target: ideaspark ESP32 Development Board Integrated 1.14 inch ST7789
          135x240 TFT LCD, ESP32-WROOM-32, CH340 USB-C, solder-pin version.

  This replaces the previous Arduino Nano lighting controller while keeping the
  same serial lighting protocol used by the ESP32-S3 camera firmware.

  Verified product profile:
    ASIN: B0GPIO27S7YQMC
    LCD: 1.14 inch ST7789, 135x240
    USB: CH340 over USB-C

  Built-in LCD pin map used by the public board examples:
    CS 15, DC 2, RST 4, BL 32, SCLK 18, MOSI 23.

  S3 serial link:
    ESP32-S3 GPIO1 TX  -> ESP32 LCD driver GPIO16 RX2
    ESP32 LCD GPIO17 TX2 -> ESP32-S3 GPIO2 RX
    GND shared between boards

  Lighting outputs:
    GPIO25 -> IR LED MOSFET gate through 150 ohm
    GPIO26 -> UVA LED MOSFET gate through 150 ohm
    GPIO27 -> 74AHCT/5 V level shifter -> 330 ohm -> SK6812 DIN
    GPIO33 -> optional LED rail enable output

  Note: ESP32 GPIO is 3.3 V. Use a 3.3 V-to-5 V buffer for the SK6812 data
  line when the RGBW LEDs are powered from the 5 V rail.
*/

#include <Arduino.h>
#include <Arduino_GFX_Library.h>
#include <Adafruit_NeoPixel.h>
#include <stdlib.h>
#include <string.h>

#if __has_include(<esp_arduino_version.h>)
#include <esp_arduino_version.h>
#endif

#ifndef ESP_ARDUINO_VERSION_MAJOR
#define ESP_ARDUINO_VERSION_MAJOR 2
#endif

#ifndef DEFAULT_DRIVER_PROTOTYPE
#define DEFAULT_DRIVER_PROTOTYPE 5
#endif

constexpr uint32_t LINK_BAUD = 19200;
constexpr uint32_t FAILSAFE_MS = 70000;
constexpr uint32_t STATUS_REDRAW_MS = 500;

// UART2 keeps USB Serial free for programming and diagnostics.
constexpr uint8_t ESP_LINK_RX_PIN = 16;
constexpr uint8_t ESP_LINK_TX_PIN = 17;

// Lighting output pin map.
constexpr uint8_t IR_PWM_PIN = 25;
constexpr uint8_t UVA_PWM_PIN = 26;
constexpr uint8_t SK6812_DATA_PIN = 27;
constexpr uint8_t POWER_ENABLE_PIN = 33;
constexpr uint8_t IR_PWM_CHANNEL = 0;
constexpr uint8_t UVA_PWM_CHANNEL = 1;
constexpr uint32_t PWM_FREQUENCY = 20000;
constexpr uint8_t PWM_RESOLUTION_BITS = 8;

// Built-in 1.14 inch ST7789 display.
constexpr uint8_t LCD_CS = 15;
constexpr uint8_t LCD_DC = 2;
constexpr uint8_t LCD_RST = 4;
constexpr uint8_t LCD_BL = 32;
constexpr uint8_t LCD_SCLK = 18;
constexpr uint8_t LCD_MOSI = 23;
constexpr int8_t LCD_MISO = -1;
constexpr int16_t LCD_W = 135;
constexpr int16_t LCD_H = 240;
constexpr uint16_t COLOR_BLACK = 0x0000;
constexpr uint16_t COLOR_WHITE = 0xFFFF;
constexpr uint16_t COLOR_CYAN = 0x07FF;
constexpr uint16_t COLOR_GREEN = 0x07E0;
constexpr uint16_t COLOR_AMBER = 0xFD20;
constexpr uint16_t COLOR_RED = 0xF800;

constexpr uint8_t SK6812_PIXEL_COUNT = 8;
constexpr uint8_t RGBW_GROUP_COUNT = 5;
constexpr uint8_t COMMAND_VALUE_COUNT = 35;

HardwareSerial espLink(2);
Arduino_DataBus *bus = new Arduino_ESP32SPI(LCD_DC, LCD_CS, LCD_SCLK, LCD_MOSI, LCD_MISO);
Arduino_GFX *gfx = new Arduino_ST7789(bus, LCD_RST, 1, true, LCD_W, LCD_H, 52, 40, 53, 40);
Adafruit_NeoPixel rgbwPixels(SK6812_PIXEL_COUNT, SK6812_DATA_PIN, NEO_GRBW + NEO_KHZ800);

char lineBuffer[256];
uint8_t linePosition = 0;
uint32_t lastCommandMs = 0;
uint32_t lastStatusDrawMs = 0;
uint32_t commandCount = 0;
uint32_t badCommandCount = 0;
bool outputActive = false;
bool displayReady = false;
bool lastPowerEnabled = false;
uint8_t lastIr = 0;
uint8_t lastUva = 0;

struct RgbwGroup {
  bool enabled;
  uint8_t brightness;
  uint8_t r;
  uint8_t g;
  uint8_t b;
  uint8_t w;
};

RgbwGroup activeGroups[RGBW_GROUP_COUNT] = {};

const uint8_t RGBW_PIXEL_MAP[RGBW_GROUP_COUNT][2] = {
  {0, 0}, // RGBW 1: right of ESP32-S3/GC2145 lens
  {1, 1}, // RGBW 2: left of ESP32-S3/GC2145 lens
  {2, 3}, // Acrylic square 1: left/right edge LEDs
  {4, 5}, // Acrylic square 2: left/right edge LEDs
  {6, 7}, // Acrylic square 3: left/right edge LEDs
};

uint8_t clampDuty(long value) {
  if (value < 0) return 0;
  if (value > 255) return 255;
  return static_cast<uint8_t>(value);
}

uint8_t scaleDuty(uint8_t value, uint8_t brightness) {
  return static_cast<uint8_t>((static_cast<uint16_t>(value) * brightness + 127) / 255);
}

bool rgbwHasColor(uint8_t r, uint8_t g, uint8_t b, uint8_t w) {
  return r > 0 || g > 0 || b > 0 || w > 0;
}

void setupPwmPin(uint8_t pin, uint8_t channel) {
#if ESP_ARDUINO_VERSION_MAJOR >= 3
  ledcAttach(pin, PWM_FREQUENCY, PWM_RESOLUTION_BITS);
#else
  ledcSetup(channel, PWM_FREQUENCY, PWM_RESOLUTION_BITS);
  ledcAttachPin(pin, channel);
#endif
}

void writePwmPin(uint8_t pin, uint8_t channel, uint8_t value) {
#if ESP_ARDUINO_VERSION_MAJOR >= 3
  ledcWrite(pin, value);
#else
  ledcWrite(channel, value);
#endif
}

void drawStatus(const char *message) {
  if (!displayReady) return;
  const uint32_t now = millis();
  if (message == nullptr && now - lastStatusDrawMs < STATUS_REDRAW_MS) return;
  lastStatusDrawMs = now;

  gfx->fillScreen(COLOR_BLACK);
  gfx->setTextSize(2);
  gfx->setTextColor(COLOR_CYAN);
  gfx->setCursor(8, 8);
  gfx->println("ESP32 LCD");
  gfx->setTextColor(COLOR_WHITE);
  gfx->setTextSize(1);
  gfx->println("RGBW IR/UVA driver");
  gfx->println();
  gfx->print("Proto: ");
  gfx->println(DEFAULT_DRIVER_PROTOTYPE);
  gfx->print("Power: ");
  gfx->println(lastPowerEnabled ? "ON" : "OFF");
  gfx->print("IR/UVA: ");
  gfx->print(lastIr);
  gfx->print(" / ");
  gfx->println(lastUva);
  gfx->print("Commands: ");
  gfx->println(commandCount);
  gfx->print("Bad: ");
  gfx->println(badCommandCount);

  gfx->setTextColor(outputActive ? COLOR_GREEN : COLOR_AMBER);
  gfx->println(outputActive ? "Outputs active" : "Outputs idle");

  gfx->setTextColor(message ? COLOR_CYAN : COLOR_WHITE);
  gfx->println();
  gfx->println(message ? message : "Waiting for S3 link");
}

void writeRgbwPixel(uint8_t index, bool enabled, uint8_t brightness, uint8_t r, uint8_t g, uint8_t b, uint8_t w) {
  if (!enabled || brightness == 0 || !rgbwHasColor(r, g, b, w)) {
    rgbwPixels.setPixelColor(index, rgbwPixels.Color(0, 0, 0, 0));
    return;
  }

  rgbwPixels.setPixelColor(
      index,
      rgbwPixels.Color(
          scaleDuty(r, brightness),
          scaleDuty(g, brightness),
          scaleDuty(b, brightness),
          scaleDuty(w, brightness)));
}

void allOff() {
  writePwmPin(IR_PWM_PIN, IR_PWM_CHANNEL, 0);
  writePwmPin(UVA_PWM_PIN, UVA_PWM_CHANNEL, 0);
  rgbwPixels.clear();
  rgbwPixels.show();
  digitalWrite(POWER_ENABLE_PIN, LOW);
  outputActive = false;
  lastPowerEnabled = false;
  lastIr = 0;
  lastUva = 0;
  memset(activeGroups, 0, sizeof(activeGroups));
}

void writeRgbwGroup(uint8_t groupIndex, const RgbwGroup &group) {
  const uint8_t firstPixel = RGBW_PIXEL_MAP[groupIndex][0];
  const uint8_t secondPixel = RGBW_PIXEL_MAP[groupIndex][1];
  writeRgbwPixel(firstPixel, group.enabled, group.brightness, group.r, group.g, group.b, group.w);
  if (secondPixel != firstPixel) {
    writeRgbwPixel(secondPixel, group.enabled, group.brightness, group.r, group.g, group.b, group.w);
  }
}

bool rgbwGroupActive(const RgbwGroup &group) {
  return group.enabled && group.brightness > 0 && rgbwHasColor(group.r, group.g, group.b, group.w);
}

void applyLights(bool powerEnabled, bool irEnabled, bool uvaEnabled, uint8_t ir, uint8_t uva, const RgbwGroup groups[]) {
  if (!powerEnabled) {
    allOff();
    lastCommandMs = millis();
    drawStatus("All outputs off");
    return;
  }

  digitalWrite(POWER_ENABLE_PIN, HIGH);
  writePwmPin(IR_PWM_PIN, IR_PWM_CHANNEL, irEnabled ? ir : 0);
  writePwmPin(UVA_PWM_PIN, UVA_PWM_CHANNEL, uvaEnabled ? uva : 0);
  for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
    activeGroups[index] = groups[index];
    writeRgbwGroup(index, groups[index]);
  }
  rgbwPixels.show();

  outputActive = (irEnabled && ir > 0) || (uvaEnabled && uva > 0);
  for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
    outputActive = outputActive || rgbwGroupActive(groups[index]);
  }

  lastPowerEnabled = powerEnabled;
  lastIr = irEnabled ? ir : 0;
  lastUva = uvaEnabled ? uva : 0;
  lastCommandMs = millis();
  drawStatus("Command applied");
}

void parseCommand(char *input) {
  if (input[0] != 'L' || input[1] != ',') {
    badCommandCount++;
    drawStatus("Bad prefix");
    return;
  }

  long values[COMMAND_VALUE_COUNT];
  memset(values, 0, sizeof(values));
  char *token = strtok(input + 2, ",");
  uint8_t count = 0;

  while (token != NULL && count < COMMAND_VALUE_COUNT) {
    values[count] = atol(token);
    token = strtok(NULL, ",");
    count++;
  }

  if (count != COMMAND_VALUE_COUNT) {
    badCommandCount++;
    drawStatus("Wrong value count");
    return;
  }

  RgbwGroup groups[RGBW_GROUP_COUNT];
  for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
    const uint8_t base = 10 + index * 5;
    groups[index] = RgbwGroup{
        values[3 + index] > 0,
        clampDuty(values[base]),
        clampDuty(values[base + 1]),
        clampDuty(values[base + 2]),
        clampDuty(values[base + 3]),
        clampDuty(values[base + 4])};
  }

  commandCount++;
  applyLights(values[0] > 0, values[1] > 0, values[2] > 0, clampDuty(values[8]), clampDuty(values[9]), groups);
  espLink.println("OK");
}

void pollEspLink() {
  while (espLink.available() > 0) {
    char incoming = static_cast<char>(espLink.read());

    if (incoming == '\r') {
      continue;
    }

    if (incoming == '\n') {
      lineBuffer[linePosition] = '\0';
      parseCommand(lineBuffer);
      linePosition = 0;
      continue;
    }

    if (linePosition < sizeof(lineBuffer) - 1) {
      lineBuffer[linePosition++] = incoming;
    } else {
      linePosition = 0;
      badCommandCount++;
      drawStatus("Line overflow");
    }
  }
}

void setupDisplay() {
  pinMode(LCD_BL, OUTPUT);
  digitalWrite(LCD_BL, HIGH);
  displayReady = gfx->begin();
  if (displayReady) {
    gfx->setRotation(1);
    drawStatus("Driver booting");
  }
}

void setup() {
  pinMode(POWER_ENABLE_PIN, OUTPUT);
  digitalWrite(POWER_ENABLE_PIN, LOW);

  Serial.begin(115200);
  espLink.begin(LINK_BAUD, SERIAL_8N1, ESP_LINK_RX_PIN, ESP_LINK_TX_PIN);

  setupPwmPin(IR_PWM_PIN, IR_PWM_CHANNEL);
  setupPwmPin(UVA_PWM_PIN, UVA_PWM_CHANNEL);

  rgbwPixels.begin();
  rgbwPixels.setBrightness(255);
  allOff();

  setupDisplay();

  Serial.println("ESP32 1.14 LCD RGBW IR UVA driver ready");
  Serial.println("UART2 RX GPIO16, TX GPIO17, 19200 baud");
  drawStatus("Waiting for S3 link");
}

void loop() {
  pollEspLink();

  if (outputActive && millis() - lastCommandMs > FAILSAFE_MS) {
    allOff();
    drawStatus("Failsafe timeout");
  } else {
    drawStatus(nullptr);
  }
}


