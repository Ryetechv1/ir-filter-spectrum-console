export const LCD_WIDTH = 172;
export const LCD_HEIGHT = 320;

export function motionIntervalMs(speed) {
  const value = Math.max(0, Math.min(255, Number(speed) || 0));
  return value === 0 ? null : Math.round(180 - (162 * value) / 255);
}

function rgb(hologram, index, extraBrightness = 0) {
  const brightness = Math.min(255, hologram.brightness + extraBrightness) / 255;
  const channels = ["r", "g", "b"].map((channel) => Math.floor(hologram[`${channel}${index}`] * brightness));
  return channels;
}

function cssColor(channels) {
  return `rgb(${channels.join(",")})`;
}

function mix(a, b, amount) {
  return a.map((value, index) => Math.floor((value * (255 - amount) + b[index] * amount) / 255));
}

function gradientColor(hologram, phase) {
  const first = rgb(hologram, 1);
  const second = rgb(hologram, 2);
  const third = rgb(hologram, 3);
  return phase < 128 ? mix(first, second, phase * 2) : mix(second, third, (phase - 128) * 2);
}

function fillGradient(ctx, hologram, frame, x, y, width, height, horizontal, reverse = false) {
  const steps = horizontal ? width : height;
  for (let index = 0; index < steps; index += 1) {
    const phase = (Math.floor((index * 255) / Math.max(1, steps - 1)) + frame) & 255;
    ctx.fillStyle = cssColor(gradientColor(hologram, reverse ? 255 - phase : phase));
    if (horizontal) ctx.fillRect(x + index, y, 1, height);
    else ctx.fillRect(x, y + index, width, 1);
  }
}

function outline(ctx, x, y, width, height, radius, color) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function circle(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function pane(ctx, hologram, frame, x, y, width, height, rotation) {
  fillGradient(ctx, hologram, frame, x, y, width, height, rotation % 2 === 0, rotation > 1);
  const glow = cssColor(rgb(hologram, 3, 35));
  const edge = cssColor(rgb(hologram, 1, 18));
  outline(ctx, x, y, width, height, 8, edge);
  outline(ctx, x + 2, y + 2, width - 4, height - 4, 6, glow);
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const pulse = 6 + (Math.floor(frame / 8) % 18);
  circle(ctx, centerX, centerY, pulse, glow);
  circle(ctx, centerX, centerY, pulse + 6, edge);
  ctx.fillStyle = glow;
  ctx.fillRect(centerX - 26, centerY, 52, 1);
  ctx.fillRect(centerX, centerY - 22, 1, 44);
}

export function drawHologramFrame(ctx, hologram, frame = 0, disabled = false) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, LCD_WIDTH, LCD_HEIGHT);
  if (disabled || !hologram.power || hologram.brightness === 0) return;

  const first = cssColor(rgb(hologram, 1));
  const second = cssColor(rgb(hologram, 2));
  const third = cssColor(rgb(hologram, 3));
  if (hologram.mode === 0) {
    ctx.fillStyle = first;
    ctx.fillRect(0, 0, LCD_WIDTH, LCD_HEIGHT);
  } else if (hologram.mode === 1) {
    fillGradient(ctx, hologram, frame, 0, 0, LCD_WIDTH, LCD_HEIGHT, false);
  } else if (hologram.mode === 3) {
    for (let y = 0; y < LCD_HEIGHT; y += 18) {
      ctx.fillStyle = Math.floor(y / 18) % 2 ? first : second;
      ctx.fillRect(14, y, LCD_WIDTH - 28, 1);
    }
    const scan = (frame * 3) % LCD_HEIGHT;
    ctx.fillStyle = third;
    ctx.fillRect(0, scan, LCD_WIDTH, 1);
    ctx.fillStyle = second;
    ctx.fillRect(0, Math.max(0, scan - 2), LCD_WIDTH, 1);
    outline(ctx, 20, 58, LCD_WIDTH - 40, LCD_HEIGHT - 116, 16, first);
    circle(ctx, LCD_WIDTH / 2, LCD_HEIGHT / 2, 44, second);
    circle(ctx, LCD_WIDTH / 2, LCD_HEIGHT / 2, 22, third);
    ctx.fillStyle = third;
    ctx.fillRect(38, LCD_HEIGHT / 2, 96, 1);
    ctx.fillRect(LCD_WIDTH / 2, 112, 1, 96);
  } else {
    pane(ctx, hologram, frame, 28, 15, 116, 62, 0);
    pane(ctx, hologram, frame, 28, 243, 116, 62, 2);
    pane(ctx, hologram, frame, 9, 103, 62, 114, 3);
    pane(ctx, hologram, frame, 101, 103, 62, 114, 1);
    circle(ctx, LCD_WIDTH / 2, LCD_HEIGHT / 2, 18, second);
    circle(ctx, LCD_WIDTH / 2, LCD_HEIGHT / 2, 31, third);
    ctx.fillStyle = second;
    ctx.fillRect(54, LCD_HEIGHT / 2, 64, 1);
    ctx.fillRect(LCD_WIDTH / 2, 128, 1, 64);
  }
}
