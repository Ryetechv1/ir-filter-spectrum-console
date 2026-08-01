// Generated stage-specific Arduino Nano sketch for Prototype 3.
#define NANO_PROTOTYPE_BUILD 3
#include <Adafruit_NeoPixel.h>
#include <SoftwareSerial.h>
#include <stdlib.h>
#include <string.h>

// ESP32-CAM UART link:
// ESP32 GPIO14 TX -> Nano D2 RX
// Nano D4 TX -> ESP32 GPIO13 RX through the resistor divider on the carrier PCB
SoftwareSerial espLink(2, 4);

const uint32_t LINK_BAUD = 19200;
const uint32_t FAILSAFE_MS = 70000;

// 2S/5V carrier pin map.
const uint8_t IR_PWM_PIN = 5;
const uint8_t UVA_PWM_PIN = 6;
const uint8_t SK6812_DATA_PIN = 7;
const uint8_t POWER_ENABLE_PIN = 8;
const uint8_t SK6812_PIXEL_COUNT = 8;
const uint8_t RGBW_GROUP_COUNT = 5;
const uint8_t COMMAND_VALUE_COUNT = 35;

// SK6812 RGBW 5mm LEDs are usually GRBW order. If your LEDs show swapped
// colors, change NEO_GRBW to the order from the LED vendor's datasheet.
Adafruit_NeoPixel rgbwPixels(SK6812_PIXEL_COUNT, SK6812_DATA_PIN, NEO_GRBW + NEO_KHZ800);

char lineBuffer[256];
uint8_t linePosition = 0;
uint32_t lastCommandMs = 0;
bool outputActive = false;

struct RgbwGroup {
  bool enabled;
  uint8_t brightness;
  uint8_t r;
  uint8_t g;
  uint8_t b;
  uint8_t w;
};

const uint8_t RGBW_PIXEL_MAP[RGBW_GROUP_COUNT][2] = {
  {0, 0}, // RGBW 1: right of ESP32-CAM lens
  {1, 1}, // RGBW 2: left of ESP32-CAM lens
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
      scaleDuty(w, brightness)
    )
  );
}

void allOff() {
  analogWrite(IR_PWM_PIN, 0);
  analogWrite(UVA_PWM_PIN, 0);
  rgbwPixels.clear();
  rgbwPixels.show();
  digitalWrite(POWER_ENABLE_PIN, LOW);
  outputActive = false;
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
    return;
  }

  digitalWrite(POWER_ENABLE_PIN, HIGH);
  analogWrite(IR_PWM_PIN, irEnabled ? ir : 0);
  analogWrite(UVA_PWM_PIN, uvaEnabled ? uva : 0);
  for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
    writeRgbwGroup(index, groups[index]);
  }
  rgbwPixels.show();

  outputActive =
    (irEnabled && ir > 0) ||
    (uvaEnabled && uva > 0);

  for (uint8_t index = 0; index < RGBW_GROUP_COUNT; index++) {
    outputActive = outputActive || rgbwGroupActive(groups[index]);
  }

  lastCommandMs = millis();
}

void parseCommand(char *input) {
  if (input[0] != 'L' || input[1] != ',') {
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
      clampDuty(values[base + 4])
    };
  }

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
    }
  }
}

void setup() {
  pinMode(IR_PWM_PIN, OUTPUT);
  pinMode(UVA_PWM_PIN, OUTPUT);
  pinMode(POWER_ENABLE_PIN, OUTPUT);
  digitalWrite(POWER_ENABLE_PIN, LOW);

  Serial.begin(115200);
  espLink.begin(LINK_BAUD);

  rgbwPixels.begin();
  rgbwPixels.setBrightness(255);
  allOff();

  Serial.println("Nano 2S SK6812 RGBW IR UVA driver ready");
}

void loop() {
  pollEspLink();

  if (outputActive && millis() - lastCommandMs > FAILSAFE_MS) {
    allOff();
  }
}
