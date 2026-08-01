const REQUEST_TIMEOUT_MS = 3500;

export function normalizeDeviceAddress(rawValue) {
  const trimmed = rawValue.trim();
  if (!trimmed) return "";

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `http://${trimmed}`;

  return withProtocol.replace(/\/+$/, "");
}

export function captureUrl(baseUrl) {
  return `${baseUrl}/capture?t=${Date.now()}`;
}

export function streamUrl(baseUrl) {
  try {
    const url = new URL(baseUrl);
    url.port = "81";
    url.pathname = "/stream";
    url.search = `t=${Date.now()}`;
    return url.toString();
  } catch {
    return `${baseUrl}/stream?t=${Date.now()}`;
  }
}

export async function getStatus(baseUrl) {
  return fetchJson(`${baseUrl}/status`);
}

export async function setLights(baseUrl, channels) {
  const params = new URLSearchParams();

  for (const key of [
    "prototype",
    "power",
    "irOn",
    "uvaOn",
    "rgbw1On",
    "rgbw2On",
    "rgbw3On",
    "rgbw4On",
    "rgbw5On",
    "ir",
    "uva",
    "rgbw1Dim",
    "r1",
    "g1",
    "b1",
    "w1",
    "rgbw2Dim",
    "r2",
    "g2",
    "b2",
    "w2",
    "rgbw3Dim",
    "r3",
    "g3",
    "b3",
    "w3",
    "rgbw4Dim",
    "r4",
    "g4",
    "b4",
    "w4",
    "rgbw5Dim",
    "r5",
    "g5",
    "b5",
    "w5"
  ]) {
    if (channels[key] !== undefined && channels[key] !== null) {
      params.set(key, String(channels[key]));
    }
  }

  return fetchJson(`${baseUrl}/led?${params.toString()}`);
}

export async function setHologram(baseUrl, hologram) {
  const params = new URLSearchParams();

  for (const key of [
    "prototype",
    "power",
    "mode",
    "brightness",
    "speed",
    "r1",
    "g1",
    "b1",
    "r2",
    "g2",
    "b2",
    "r3",
    "g3",
    "b3"
  ]) {
    if (hologram[key] !== undefined && hologram[key] !== null) {
      params.set(key, String(hologram[key]));
    }
  }

  return fetchJson(`${baseUrl}/hologram?${params.toString()}`);
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      mode: "cors",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`.trim());
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}
