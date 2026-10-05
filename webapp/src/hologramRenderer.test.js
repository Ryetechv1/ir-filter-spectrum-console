import test from "node:test";
import assert from "node:assert/strict";
import { drawHologramFrame, LCD_HEIGHT, LCD_WIDTH, motionIntervalMs } from "./hologramRenderer.js";

const hologram = {
  power: 1,
  brightness: 255,
  speed: 96,
  mode: 2,
  r1: 255, g1: 0, b1: 0,
  r2: 0, g2: 255, b2: 0,
  r3: 0, g3: 0, b3: 255
};

function mockContext() {
  return {
    rects: [],
    circles: [],
    fillRect(x, y, width, height) {
      this.rects.push({ x, y, width, height, color: this.fillStyle });
    },
    beginPath() {},
    roundRect() {},
    arc(x, y, radius) { this.circles.push({ x, y, radius }); },
    stroke() {}
  };
}

test("motion zero stops and higher settings shorten the frame interval", () => {
  assert.equal(motionIntervalMs(0), null);
  assert.equal(motionIntervalMs(255), 18);
  assert.ok(motionIntervalMs(200) < motionIntervalMs(50));
});

test("solid mode paints the entire LCD with color 1", () => {
  const ctx = mockContext();
  drawHologramFrame(ctx, { ...hologram, mode: 0 });
  assert.deepEqual(ctx.rects.at(-1), { x: 0, y: 0, width: LCD_WIDTH, height: LCD_HEIGHT, color: "rgb(255,0,0)" });
});

test("gradient mode shifts its colors as motion advances", () => {
  const first = mockContext();
  const next = mockContext();
  drawHologramFrame(first, { ...hologram, mode: 1 }, 0);
  drawHologramFrame(next, { ...hologram, mode: 1 }, 1);
  assert.notEqual(first.rects[1].color, next.rects[1].color);
});

test("scan reticle moves and uses color 3 for the scan line", () => {
  const first = mockContext();
  const next = mockContext();
  drawHologramFrame(first, { ...hologram, mode: 3 }, 1);
  drawHologramFrame(next, { ...hologram, mode: 3 }, 2);
  assert.ok(first.rects.some((rect) => rect.y === 3 && rect.width === LCD_WIDTH && rect.color === "rgb(0,0,255)"));
  assert.ok(next.rects.some((rect) => rect.y === 6 && rect.width === LCD_WIDTH && rect.color === "rgb(0,0,255)"));
});

test("powered-off preview remains black", () => {
  const ctx = mockContext();
  drawHologramFrame(ctx, { ...hologram, power: 0 });
  assert.equal(ctx.rects.length, 1);
  assert.equal(ctx.rects[0].color, "#000");
});
