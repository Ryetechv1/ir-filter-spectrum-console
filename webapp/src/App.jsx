import {
  Activity,
  AlertTriangle,
  Camera,
  Clock3,
  Cpu,
  Crosshair,
  Gauge,
  Maximize,
  Palette,
  Pause,
  Play,
  Power,
  RadioTower,
  RefreshCw,
  Router,
  SatelliteDish,
  ShieldAlert,
  SlidersHorizontal,
  TimerReset,
  Unplug,
  Wifi
} from "lucide-react";
import React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  captureUrl,
  getStatus,
  normalizeDeviceAddress,
  setHologram as sendHologram,
  setLights as sendLights,
  streamUrl
} from "./deviceApi.js";
import { DEFAULT_PROTOTYPE_ID, PROTOTYPES, getPrototype } from "./prototypes.js";

const DEFAULT_ADDRESS = "http://192.168.4.1";
const DEFAULT_HOLOGRAM_ADDRESS = "http://192.168.8.1";
const AUTO_OFF_SECONDS = 300;
const STORAGE_KEY = "esp32cam-ir-uva-console";
const HOLOGRAM_STORAGE_KEY = "esp32cam-ir-uva-console-hologram";
const PROFILE_STORAGE_KEY = "esp32cam-ir-uva-console-prototype";

const VISIBLE_PROFILE = {
  r: 204,
  g: 186,
  b: 142,
  w: 255
};

const RGBW_GROUPS = {
  rgbw1: {
    title: "RGBW 1",
    onKey: "rgbw1On",
    dimKey: "rgbw1Dim",
    keys: { r: "r1", g: "g1", b: "b1", w: "w1" },
    pwm: "SK6812 pixel 1",
    role: "Camera right"
  },
  rgbw2: {
    title: "RGBW 2",
    onKey: "rgbw2On",
    dimKey: "rgbw2Dim",
    keys: { r: "r2", g: "g2", b: "b2", w: "w2" },
    pwm: "SK6812 pixel 2",
    role: "Camera left"
  },
  rgbw3: {
    title: "Acrylic 1",
    onKey: "rgbw3On",
    dimKey: "rgbw3Dim",
    keys: { r: "r3", g: "g3", b: "b3", w: "w3" },
    pwm: "SK6812 pixels 3+4",
    role: "Square 1 left/right"
  },
  rgbw4: {
    title: "Acrylic 2",
    onKey: "rgbw4On",
    dimKey: "rgbw4Dim",
    keys: { r: "r4", g: "g4", b: "b4", w: "w4" },
    pwm: "SK6812 pixels 5+6",
    role: "Square 2 left/right"
  },
  rgbw5: {
    title: "Acrylic 3",
    onKey: "rgbw5On",
    dimKey: "rgbw5Dim",
    keys: { r: "r5", g: "g5", b: "b5", w: "w5" },
    pwm: "SK6812 pixels 7+8",
    role: "Square 3 left/right"
  }
};

const RGBW_GROUP_KEYS = Object.keys(RGBW_GROUPS);
const DUTY_KEYS = [
  "ir",
  "uva",
  ...RGBW_GROUP_KEYS.flatMap((groupKey) => Object.values(RGBW_GROUPS[groupKey].keys))
];
const DIM_KEYS = RGBW_GROUP_KEYS.map((groupKey) => RGBW_GROUPS[groupKey].dimKey);
const SWITCH_KEYS = ["irOn", "uvaOn", ...RGBW_GROUP_KEYS.map((groupKey) => RGBW_GROUPS[groupKey].onKey)];

const DEFAULT_LIGHTS = {
  power: 0,
  irOn: 0,
  uvaOn: 0,
  ir: 0,
  uva: 0,
  ...Object.fromEntries(
    RGBW_GROUP_KEYS.flatMap((groupKey) => {
      const group = RGBW_GROUPS[groupKey];
      return [
        [group.onKey, 0],
        [group.dimKey, 0],
        [group.keys.r, 0],
        [group.keys.g, 0],
        [group.keys.b, 0],
        [group.keys.w, 0]
      ];
    })
  )
};

const DEFAULT_HOLOGRAM = {
  power: 0,
  mode: 2,
  brightness: 180,
  speed: 96,
  r1: 0,
  g1: 210,
  b1: 255,
  r2: 255,
  g2: 60,
  b2: 190,
  r3: 255,
  g3: 255,
  b3: 255
};

const hologramModes = [
  { value: 0, label: "Solid" },
  { value: 1, label: "Gradient" },
  { value: 2, label: "Hologram cross" },
  { value: 3, label: "Scan reticle" }
];

const presets = [
  {
    key: "visible",
    label: "Visible",
    lights: {
      ...DEFAULT_LIGHTS,
      power: 1,
      rgbw1On: 1,
      rgbw2On: 1,
      rgbw1Dim: 220,
      rgbw2Dim: 220,
      ...visibleProfilePatch("rgbw1"),
      ...visibleProfilePatch("rgbw2")
    }
  },
  {
    key: "ir",
    label: "IR",
    lights: { ...DEFAULT_LIGHTS, power: 1, irOn: 1, ir: 170 }
  },
  {
    key: "fluorescence",
    label: "Fluorescence",
    lights: { ...DEFAULT_LIGHTS, power: 1, uvaOn: 1, uva: 96 }
  }
];

const telemetrySeed = [
  ["Link", "ESP32-S3 UART to Nano"],
  ["Battery", "2S LiPo to 5V buck"],
  ["Power state", "Firmware output shutdown"],
  ["IR / UVA", "Nano D5 / D6 PWM"],
  ["RGBW data", "Nano D7 SK6812"],
  ["RGBW LEDs", "8 pixels / 5 control zones"],
  ["Acrylic stack", "3 paired left/right square zones"],
  ["Hologram", "ESP32-C6 LCD over acrylic glass"]
];

function loadSavedAddress() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_ADDRESS;
  } catch {
    return DEFAULT_ADDRESS;
  }
}

function loadSavedHologramAddress() {
  try {
    return window.localStorage.getItem(HOLOGRAM_STORAGE_KEY) || DEFAULT_HOLOGRAM_ADDRESS;
  } catch {
    return DEFAULT_HOLOGRAM_ADDRESS;
  }
}

function loadSavedPrototypeId() {
  try {
    return Number(window.localStorage.getItem(PROFILE_STORAGE_KEY)) || DEFAULT_PROTOTYPE_ID;
  } catch {
    return DEFAULT_PROTOTYPE_ID;
  }
}

function clampDuty(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(255, Math.round(parsed)));
}

function normalizeSwitch(value) {
  return Number(value) > 0 ? 1 : 0;
}

function normalizeHologram(source = {}, fallback = DEFAULT_HOLOGRAM) {
  return {
    power: normalizeSwitch(source.power ?? fallback.power),
    mode: Math.max(0, Math.min(3, Number(source.mode ?? fallback.mode) || 0)),
    brightness: clampDuty(source.brightness ?? fallback.brightness),
    speed: clampDuty(source.speed ?? fallback.speed),
    r1: clampDuty(source.r1 ?? fallback.r1),
    g1: clampDuty(source.g1 ?? fallback.g1),
    b1: clampDuty(source.b1 ?? fallback.b1),
    r2: clampDuty(source.r2 ?? fallback.r2),
    g2: clampDuty(source.g2 ?? fallback.g2),
    b2: clampDuty(source.b2 ?? fallback.b2),
    r3: clampDuty(source.r3 ?? fallback.r3),
    g3: clampDuty(source.g3 ?? fallback.g3),
    b3: clampDuty(source.b3 ?? fallback.b3)
  };
}

function normalizeLights(source = {}, fallback = DEFAULT_LIGHTS) {
  const normalized = {
    power: normalizeSwitch(source.power ?? fallback.power)
  };

  for (const key of SWITCH_KEYS) {
    normalized[key] = normalizeSwitch(source[key] ?? fallback[key]);
  }

  for (const key of DUTY_KEYS) {
    normalized[key] = clampDuty(source[key] ?? fallback[key]);
  }

  for (const key of DIM_KEYS) {
    normalized[key] = clampDuty(source[key] ?? fallback[key]);
  }

  return normalized;
}

function prototypeSupportsMono(prototype, groupKey) {
  if (groupKey === "ir") return Boolean(prototype.controls.ir);
  if (groupKey === "uva") return Boolean(prototype.controls.uva);
  return false;
}

function prototypeSupportsRgbw(prototype, groupKey) {
  return prototype.controls.rgbwGroups.includes(groupKey);
}

function prototypeSupportsHologram(prototype) {
  return Boolean(prototype.controls.hologram);
}

function prototypeSupportsPreset(prototype, presetKey) {
  if (presetKey === "ir") return prototypeSupportsMono(prototype, "ir");
  if (presetKey === "fluorescence") return prototypeSupportsMono(prototype, "uva");
  if (presetKey === "visible") return prototypeSupportsRgbw(prototype, "rgbw1") && prototypeSupportsRgbw(prototype, "rgbw2");
  return true;
}

function constrainLightsForPrototype(lights, prototype) {
  const constrained = normalizeLights(lights);

  if (!prototypeSupportsMono(prototype, "ir")) {
    Object.assign(constrained, groupOffPatch("ir"));
  }
  if (!prototypeSupportsMono(prototype, "uva")) {
    Object.assign(constrained, groupOffPatch("uva"));
  }

  for (const groupKey of RGBW_GROUP_KEYS) {
    if (!prototypeSupportsRgbw(prototype, groupKey)) {
      Object.assign(constrained, groupOffPatch(groupKey));
    }
  }

  if (!hasActiveOutput({ ...constrained, power: 1 })) {
    constrained.power = 0;
  }

  return normalizeLights(constrained);
}

function visibleProfilePatch(groupKey) {
  const group = RGBW_GROUPS[groupKey];

  return {
    [group.keys.r]: VISIBLE_PROFILE.r,
    [group.keys.g]: VISIBLE_PROFILE.g,
    [group.keys.b]: VISIBLE_PROFILE.b,
    [group.keys.w]: VISIBLE_PROFILE.w
  };
}

function scaleDuty(value, brightness) {
  return Math.round((clampDuty(value) * clampDuty(brightness)) / 255);
}

function rgbwHasColor(lights, groupKey) {
  const group = RGBW_GROUPS[groupKey];
  return Object.values(group.keys).some((key) => lights[key] > 0);
}

function groupHasLevel(lights, groupKey) {
  if (groupKey === "ir") return lights.ir > 0;
  if (groupKey === "uva") return lights.uva > 0;

  const group = RGBW_GROUPS[groupKey];
  return lights[group.dimKey] > 0 && rgbwHasColor(lights, groupKey);
}

function hasActiveOutput(lights) {
  return Boolean(
    lights.power &&
      ((lights.irOn && lights.ir > 0) ||
        (lights.uvaOn && lights.uva > 0) ||
        RGBW_GROUP_KEYS.some((groupKey) => lights[RGBW_GROUPS[groupKey].onKey] && groupHasLevel(lights, groupKey)))
  );
}

function formatCountdown(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function dutyToPercent(value) {
  return Math.round((value / 255) * 100);
}

function colorCss(hologram, index) {
  return `rgb(${hologram[`r${index}`]}, ${hologram[`g${index}`]}, ${hologram[`b${index}`]})`;
}

function dimmedColorCss(hologram, index) {
  const scale = hologram.brightness / 255;
  return `rgb(${Math.round(hologram[`r${index}`] * scale)}, ${Math.round(hologram[`g${index}`] * scale)}, ${Math.round(
    hologram[`b${index}`] * scale
  )})`;
}


function rgbwLevel(lights, groupKey) {
  const group = RGBW_GROUPS[groupKey];
  return lights[group.dimKey];
}

function rgbwStatus(lights, groupKey) {
  const group = RGBW_GROUPS[groupKey];
  const mix = `${lights[group.keys.r]}/${lights[group.keys.g]}/${lights[group.keys.b]}/${lights[group.keys.w]}`;
  const effective = [
    scaleDuty(lights[group.keys.r], lights[group.dimKey]),
    scaleDuty(lights[group.keys.g], lights[group.dimKey]),
    scaleDuty(lights[group.keys.b], lights[group.dimKey]),
    scaleDuty(lights[group.keys.w], lights[group.dimKey])
  ].join("/");
  return `Brightness ${lights[group.dimKey]} / 255 (${dutyToPercent(lights[group.dimKey])}%) - mix ${mix} - PWM ${effective}`;
}

function groupDefaults(groupKey) {
  if (groupKey === "ir") return { ir: 128 };
  if (groupKey === "uva") return { uva: 96 };

  const group = RGBW_GROUPS[groupKey];
  return {
    [group.dimKey]: 180,
    ...visibleProfilePatch(groupKey)
  };
}

function groupOffPatch(groupKey) {
  if (groupKey === "ir") return { irOn: 0, ir: 0 };
  if (groupKey === "uva") return { uvaOn: 0, uva: 0 };

  const group = RGBW_GROUPS[groupKey];
  return {
    [group.onKey]: 0,
    [group.dimKey]: 0,
    [group.keys.r]: 0,
    [group.keys.g]: 0,
    [group.keys.b]: 0,
    [group.keys.w]: 0
  };
}

function App() {
  const [address, setAddress] = useState(loadSavedAddress);
  const [hologramAddress, setHologramAddress] = useState(loadSavedHologramAddress);
  const [deviceBase, setDeviceBase] = useState("");
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusText, setStatusText] = useState("Ready to connect");
  const [frameUrl, setFrameUrl] = useState("");
  const [framePaused, setFramePaused] = useState(false);
  const [frameFit, setFrameFit] = useState("fit");
  const [selectedPrototypeId, setSelectedPrototypeId] = useState(loadSavedPrototypeId);
  const [lights, setLightsState] = useState(DEFAULT_LIGHTS);
  const [hologram, setHologram] = useState(DEFAULT_HOLOGRAM);
  const [hologramStatus, setHologramStatus] = useState("Preview ready");
  const [mode, setMode] = useState("visible");
  const [autoOff, setAutoOff] = useState(true);
  const [countdown, setCountdown] = useState(AUTO_OFF_SECONDS);
  const [lastResponseAt, setLastResponseAt] = useState(null);
  const [frameState, setFrameState] = useState("idle");
  const lightPushRef = useRef(0);
  const lightsRef = useRef(DEFAULT_LIGHTS);
  const prototypeRef = useRef(getPrototype(selectedPrototypeId));

  const selectedPrototype = useMemo(() => getPrototype(selectedPrototypeId), [selectedPrototypeId]);
  const connectionTarget = useMemo(() => normalizeDeviceAddress(address), [address]);
  const hologramTarget = useMemo(() => normalizeDeviceAddress(hologramAddress), [hologramAddress]);
  const liveBase = useMemo(() => (connected && deviceBase ? deviceBase : ""), [connected, deviceBase]);
  const connectedToInput = useMemo(
    () => Boolean(connected && deviceBase && connectionTarget === deviceBase),
    [connected, connectionTarget, deviceBase]
  );
  const connectionButtonLabel = isConnecting ? "Connecting" : connectedToInput ? "Disconnect" : connected ? "Switch" : "Connect";
  const anyLightOn = useMemo(() => hasActiveOutput(lights), [lights]);
  const hologramEnabled = prototypeSupportsHologram(selectedPrototype);

  useEffect(() => {
    lightsRef.current = lights;
  }, [lights]);

  useEffect(() => {
    prototypeRef.current = selectedPrototype;
  }, [selectedPrototype]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, String(selectedPrototypeId));
    } catch {
      // Safari private mode can reject localStorage writes after a valid selection.
    }
  }, [selectedPrototypeId]);

  useEffect(() => {
    try {
      window.localStorage.setItem(HOLOGRAM_STORAGE_KEY, hologramTarget || hologramAddress);
    } catch {
      // Safari private mode can reject localStorage writes after a valid selection.
    }
  }, [hologramAddress, hologramTarget]);

  const setLocalLights = useCallback((patch) => {
    setLightsState((current) => {
      const nextLights = constrainLightsForPrototype(normalizeLights({ ...current, ...patch }, current), prototypeRef.current);
      lightsRef.current = nextLights;
      return nextLights;
    });
  }, []);

  const refreshFrame = useCallback(() => {
    if (!liveBase) return;
    setFrameState(framePaused ? "paused" : "streaming");
    setFrameUrl(framePaused ? captureUrl(liveBase) : streamUrl(liveBase));
  }, [framePaused, liveBase]);

  const connect = useCallback(async () => {
    const base = connectionTarget;
    if (!base) {
      setStatusText("Enter a device address first");
      return;
    }

    setIsConnecting(true);
    setStatusText(`Connecting to ${base}...`);
    try {
      const status = await getStatus(base);
      const statusPrototype = status.prototype ? getPrototype(status.prototype) : prototypeRef.current;
      setSelectedPrototypeId(statusPrototype.id);
      prototypeRef.current = statusPrototype;
      const nextLights = constrainLightsForPrototype(normalizeLights(status), statusPrototype);
      lightsRef.current = nextLights;
      setLightsState(nextLights);
      setDeviceBase(base);
      setConnected(true);
      setFramePaused(false);
      setFrameState("streaming");
      setFrameUrl(streamUrl(base));
      setLastResponseAt(new Date());
      setStatusText("Connected");
      try {
        window.localStorage.setItem(STORAGE_KEY, base);
      } catch {
        // Safari private mode can reject localStorage writes after a valid connection.
      }
    } catch (error) {
      setConnected(false);
      setDeviceBase("");
      setFrameUrl("");
      setFramePaused(false);
      setFrameState("failed");
      setStatusText(`Connection failed: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  }, [connectionTarget]);

  const disconnect = useCallback(() => {
    setConnected(false);
    setFrameUrl("");
    setDeviceBase("");
    setStatusText("Disconnected");
    setFrameState("idle");
    setFramePaused(false);
  }, []);

  const toggleConnection = useCallback(() => {
    if (isConnecting) return;
    if (connectedToInput) {
      disconnect();
      return;
    }
    connect();
  }, [connect, connectedToInput, disconnect, isConnecting]);

  const pushLights = useCallback(
    async (patch, nextMode = mode) => {
      const base = liveBase;
      const prototype = prototypeRef.current;
      const normalizedPatch = patch.power === 0 ? { ...DEFAULT_LIGHTS, ...patch } : patch;
      const nextLights = constrainLightsForPrototype(normalizeLights({ ...lightsRef.current, ...normalizedPatch }, lightsRef.current), prototype);

      if (normalizedPatch.power === undefined && hasActiveOutput({ ...nextLights, power: 1 })) {
        nextLights.power = 1;
      }

      const sequence = lightPushRef.current + 1;
      lightPushRef.current = sequence;

      lightsRef.current = nextLights;
      setLightsState(nextLights);
      setMode(nextMode);

      if (autoOff && hasActiveOutput(nextLights)) {
        setCountdown(AUTO_OFF_SECONDS);
      }

      if (!base) return;

      try {
        const status = await sendLights(base, { ...nextLights, prototype: prototype.id });
        if (lightPushRef.current !== sequence) return;
        const confirmedPrototype = status.prototype ? getPrototype(status.prototype) : prototype;
        setSelectedPrototypeId(confirmedPrototype.id);
        prototypeRef.current = confirmedPrototype;
        const confirmedLights = constrainLightsForPrototype(normalizeLights(status, nextLights), confirmedPrototype);
        lightsRef.current = confirmedLights;
        setLightsState(confirmedLights);
        setConnected(true);
        setLastResponseAt(new Date());
        setStatusText("Lighting updated");
      } catch (error) {
        setStatusText(`Light update failed: ${error.message}`);
      }
    },
    [autoOff, liveBase, mode]
  );

  const applyPreset = useCallback(
    (preset) => {
      pushLights(preset.lights, preset.key);
    },
    [pushLights]
  );

  const allOff = useCallback(() => {
    pushLights(DEFAULT_LIGHTS, "visible");
    setCountdown(AUTO_OFF_SECONDS);
  }, [pushLights]);

  const selectPrototype = useCallback(
    (nextPrototypeId) => {
      const prototype = getPrototype(nextPrototypeId);
      setSelectedPrototypeId(prototype.id);
      prototypeRef.current = prototype;
      const constrained = constrainLightsForPrototype(lightsRef.current, prototype);
      lightsRef.current = constrained;
      setLightsState(constrained);
      setMode("custom");
      setCountdown(AUTO_OFF_SECONDS);
      pushLights(constrained, "custom");
    },
    [pushLights]
  );

  const openSnapshot = useCallback(() => {
    if (liveBase) {
      window.open(captureUrl(liveBase), "_blank", "noopener,noreferrer");
    }
  }, [liveBase]);

  const toggleDriverPower = useCallback(() => {
    pushLights(lightsRef.current.power ? DEFAULT_LIGHTS : { power: 1 }, "custom");
  }, [pushLights]);

  const toggleGroup = useCallback(
    (groupKey) => {
      const prototype = prototypeRef.current;
      if ((groupKey === "ir" || groupKey === "uva") && !prototypeSupportsMono(prototype, groupKey)) return;
      if (RGBW_GROUPS[groupKey] && !prototypeSupportsRgbw(prototype, groupKey)) return;

      const current = lightsRef.current;
      const onKey = groupKey === "ir" ? "irOn" : groupKey === "uva" ? "uvaOn" : RGBW_GROUPS[groupKey].onKey;
      const turnOn = !current[onKey];
      const patch = {
        power: turnOn ? 1 : current.power,
        [onKey]: turnOn ? 1 : 0
      };

      if (turnOn && !groupHasLevel(current, groupKey)) {
        if (RGBW_GROUPS[groupKey] && rgbwHasColor(current, groupKey)) {
          patch[RGBW_GROUPS[groupKey].dimKey] = 180;
        } else {
          Object.assign(patch, groupDefaults(groupKey));
        }
      }

      if (!turnOn) {
        Object.assign(patch, groupOffPatch(groupKey));
        const simulated = normalizeLights({ ...current, ...patch }, current);
        if (!hasActiveOutput({ ...simulated, power: 1 })) {
          patch.power = 0;
        }
      }

      pushLights(patch, "custom");
    },
    [pushLights]
  );

  const updateMonoChannel = useCallback(
    (groupKey, value) => {
      if (!prototypeSupportsMono(prototypeRef.current, groupKey)) return;
      const dutyKey = groupKey;
      const onKey = groupKey === "ir" ? "irOn" : "uvaOn";
      const patch = { [dutyKey]: value };

      if (value > 0) {
        patch.power = 1;
        patch[onKey] = 1;
      }

      setLocalLights(patch);
      setMode("custom");
    },
    [setLocalLights]
  );

  const commitMonoChannel = useCallback(
    (groupKey, value) => {
      if (!prototypeSupportsMono(prototypeRef.current, groupKey)) return;
      const onKey = groupKey === "ir" ? "irOn" : "uvaOn";
      const patch = { [groupKey]: value };

      if (value > 0) {
        patch.power = 1;
        patch[onKey] = 1;
      }

      pushLights(patch, "custom");
    },
    [pushLights]
  );

  const updateRgbwMix = useCallback(
    (groupKey, value) => {
      if (!prototypeSupportsRgbw(prototypeRef.current, groupKey)) return;
      const group = RGBW_GROUPS[groupKey];
      const patch = { [group.dimKey]: value };

      if (value > 0) {
        patch.power = 1;
        patch[group.onKey] = 1;
        if (!rgbwHasColor(lightsRef.current, groupKey)) {
          Object.assign(patch, visibleProfilePatch(groupKey));
        }
      }

      setLocalLights(patch);
      setMode("custom");
    },
    [setLocalLights]
  );

  const commitRgbwMix = useCallback(
    (groupKey, value) => {
      if (!prototypeSupportsRgbw(prototypeRef.current, groupKey)) return;
      const group = RGBW_GROUPS[groupKey];
      const patch = { [group.dimKey]: value };

      if (value > 0) {
        patch.power = 1;
        patch[group.onKey] = 1;
        if (!rgbwHasColor(lightsRef.current, groupKey)) {
          Object.assign(patch, visibleProfilePatch(groupKey));
        }
      }

      pushLights(patch, "custom");
    },
    [pushLights]
  );

  const updateRgbwChannel = useCallback(
    (groupKey, color, value) => {
      if (!prototypeSupportsRgbw(prototypeRef.current, groupKey)) return;
      const group = RGBW_GROUPS[groupKey];
      const patch = { [group.keys[color]]: value };

      if (value > 0) {
        patch.power = 1;
        patch[group.onKey] = 1;
        if (lightsRef.current[group.dimKey] === 0) {
          patch[group.dimKey] = 180;
        }
      }

      setLocalLights(patch);
      setMode("custom");
    },
    [setLocalLights]
  );

  const commitRgbwChannel = useCallback(
    (groupKey, color, value) => {
      if (!prototypeSupportsRgbw(prototypeRef.current, groupKey)) return;
      const group = RGBW_GROUPS[groupKey];
      const patch = { [group.keys[color]]: value };

      if (value > 0) {
        patch.power = 1;
        patch[group.onKey] = 1;
        if (lightsRef.current[group.dimKey] === 0) {
          patch[group.dimKey] = 180;
        }
      }

      pushLights(patch, "custom");
    },
    [pushLights]
  );

  const updateHologram = useCallback((patch) => {
    setHologram((current) => normalizeHologram({ ...current, ...patch }, current));
    setHologramStatus("Preview changed");
  }, []);

  const toggleHologramPower = useCallback(() => {
    if (!prototypeSupportsHologram(prototypeRef.current)) return;
    setHologram((current) => {
      const nextPower = current.power ? 0 : 1;
      return normalizeHologram({
        ...current,
        power: nextPower,
        brightness: nextPower && current.brightness === 0 ? DEFAULT_HOLOGRAM.brightness : current.brightness
      });
    });
    setHologramStatus("Preview changed");
  }, []);

  const applyHologram = useCallback(async () => {
    const base = hologramTarget;
    if (!base) {
      setHologramStatus("Enter a display address first");
      return;
    }
    if (!prototypeSupportsHologram(prototypeRef.current)) {
      setHologramStatus("Selected prototype has no display");
      return;
    }

    setHologramStatus(`Applying to ${base}...`);
    try {
      const status = await sendHologram(base, { ...hologram, prototype: prototypeRef.current.id });
      setHologram(normalizeHologram(status, hologram));
      setHologramStatus("Hologram display updated");
    } catch (error) {
      setHologramStatus(`Hologram update failed: ${error.message}`);
    }
  }, [hologram, hologramTarget]);

  const toggleFramePaused = useCallback(() => {
    setFramePaused((current) => {
      const nextPaused = !current;
      if (liveBase) {
        setFrameState(nextPaused ? "paused" : "streaming");
        setFrameUrl(nextPaused ? captureUrl(liveBase) : streamUrl(liveBase));
      }
      return nextPaused;
    });
  }, [liveBase]);

  useEffect(() => {
    if (!connected) return;
    refreshFrame();
  }, [connected, refreshFrame]);

  useEffect(() => {
    if (!autoOff || !anyLightOn) return undefined;

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          pushLights(DEFAULT_LIGHTS, "visible");
          return AUTO_OFF_SECONDS;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [anyLightOn, autoOff, pushLights]);

  const hasLightingHardware =
    selectedPrototype.controls.ir || selectedPrototype.controls.uva || selectedPrototype.controls.rgbwGroups.length > 0;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <Camera size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h1>Spectrum Camera Console</h1>
          </div>
        </div>

        <form
          className="connection-form"
          onSubmit={(event) => {
            event.preventDefault();
            toggleConnection();
          }}
        >
          <label htmlFor="device-address">Device address</label>
          <div className="address-row">
            <input
              id="device-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              spellCheck="false"
              placeholder="http://192.168.4.1"
            />
            <button
              type="submit"
              className={connectedToInput ? "primary-action disconnect-action" : "primary-action"}
              aria-busy={isConnecting}
              disabled={isConnecting}
            >
              {connectedToInput ? <Unplug size={17} /> : <Wifi size={17} />}
              {connectionButtonLabel}
            </button>
          </div>
        </form>

        <div className="connection-state">
          <span className={connected ? "status-dot online" : "status-dot"} />
          <div>
            <strong>{connected ? "Connected" : "Offline"}</strong>
            <span>{deviceBase || connectionTarget || "No address"}</span>
          </div>
          <button type="button" className="icon-button" onClick={disconnect} title="Disconnect">
            <Unplug size={18} />
          </button>
        </div>
      </header>

      <main className="console-grid">
        <section className="prototype-panel">
          <PanelHeader title="Prototype selection" icon={<Cpu size={18} />} meta={selectedPrototype.stage} />
          <div className="prototype-selector-row">
            <label>
              Build target
              <select value={selectedPrototype.id} onChange={(event) => selectPrototype(Number(event.target.value))}>
                {PROTOTYPES.map((prototype) => (
                  <option key={prototype.id} value={prototype.id}>
                    {prototype.label}: {prototype.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="prototype-summary">
              <strong>{selectedPrototype.title}</strong>
              <span>{selectedPrototype.summary}</span>
            </div>
          </div>
          <div className="prototype-detail-grid">
            <PrototypeList title="Hardware" items={selectedPrototype.hardware} />
            <PrototypeList title="Tests" items={selectedPrototype.tests} />
            <div className="prototype-files">
              <span>Build files</span>
              {Object.entries(selectedPrototype.sketches).map(([name, path]) => (
                <code key={name}>
                  {name}: {path}
                </code>
              ))}
              <code>{selectedPrototype.diagram}</code>
              <code>{selectedPrototype.docs}</code>
            </div>
          </div>
        </section>

        <section className="hologram-panel">
          <PanelHeader title="Hologram display" icon={<Palette size={18} />} meta={hologramStatus} />
          <div className="hologram-content">
            <form
              className="hologram-address"
              onSubmit={(event) => {
                event.preventDefault();
                applyHologram();
              }}
            >
              <label htmlFor="hologram-address">Display address</label>
              <div className="address-row">
                <input
                  id="hologram-address"
                  value={hologramAddress}
                  onChange={(event) => setHologramAddress(event.target.value)}
                  spellCheck="false"
                  placeholder="http://192.168.8.1"
                  disabled={!hologramEnabled}
                />
                <button type="submit" className="primary-action" disabled={!hologramEnabled}>
                  <Palette size={17} />
                  Apply
                </button>
              </div>
            </form>

            <HologramPreview hologram={hologram} disabled={!hologramEnabled} />

            <div className="hologram-controls">
              <SwitchHeader
                icon={<Power size={16} />}
                title="Display output"
                detail={hologram.power ? "On" : "Off"}
                enabled={Boolean(hologram.power)}
                disabled={!hologramEnabled}
                onToggle={toggleHologramPower}
              />

              <label className="hologram-mode">
                Pattern
                <select
                  value={hologram.mode}
                  onChange={(event) => updateHologram({ mode: Number(event.target.value), power: 1 })}
                  disabled={!hologramEnabled}
                >
                  {hologramModes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <HologramSlider
                label="Brightness"
                value={hologram.brightness}
                disabled={!hologramEnabled}
                onChange={(value) => updateHologram({ brightness: value, power: value > 0 ? 1 : hologram.power })}
              />
              <HologramSlider
                label="Motion"
                value={hologram.speed}
                disabled={!hologramEnabled}
                onChange={(value) => updateHologram({ speed: value })}
              />
              {[1, 2, 3].map((index) => (
                <HologramColorMixer key={index} index={index} hologram={hologram} disabled={!hologramEnabled} onChange={updateHologram} />
              ))}
            </div>
          </div>
        </section>

        <section className="viewer-panel">
          <PanelHeader title="Live view" icon={<RadioTower size={18} />} meta={frameState === "streaming" ? "Live stream" : frameState} />
          <div className={`viewer-frame viewer-${frameFit}`}>
            {frameUrl ? (
              <img
                src={frameUrl}
                alt="ESP32-S3 camera live stream"
                onLoad={() => setFrameState(framePaused ? "paused" : "streaming")}
                onError={() => {
                  setFrameState("failed");
                  setStatusText("Camera stream failed");
                }}
              />
            ) : (
              <div className="viewer-placeholder">
                <Crosshair size={48} />
                <strong>Connect to the module</strong>
                <span>Live video appears from the camera module MJPEG stream.</span>
              </div>
            )}
          </div>
          <div className="viewer-toolbar">
            <button type="button" onClick={openSnapshot} disabled={!connected || !liveBase}>
              <Camera size={17} />
              Snapshot
            </button>
            <button type="button" onClick={refreshFrame} disabled={!connected || !liveBase}>
              <RefreshCw size={17} />
              Restart
            </button>
            <button type="button" onClick={toggleFramePaused} disabled={!connected || !liveBase}>
              {framePaused ? <Play size={17} /> : <Pause size={17} />}
              {framePaused ? "Resume" : "Pause"}
            </button>
            <button type="button" onClick={() => setFrameFit((value) => (value === "fit" ? "one" : "fit"))}>
              <Maximize size={17} />
              {frameFit === "fit" ? "1:1" : "Fit"}
            </button>
          </div>
        </section>

        <aside className="lighting-panel">
          <PanelHeader title="Lighting control" icon={<SlidersHorizontal size={18} />} meta="2 PWM + 5 RGBW zones" />

          <div className="mode-row" aria-label="Mode preset">
            {presets.map((preset) => (
              <button
                key={preset.key}
                type="button"
                className={mode === preset.key ? "mode-button active" : "mode-button"}
                disabled={!prototypeSupportsPreset(selectedPrototype, preset.key)}
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <section className="power-gate-panel">
            <SwitchHeader
              icon={<Power size={18} />}
              title="LED power"
              detail={lights.power ? "Outputs enabled" : "Outputs disabled"}
              enabled={Boolean(lights.power)}
              disabled={!hasLightingHardware}
              onToggle={toggleDriverPower}
            />
          </section>

          <DimmableLedControl
            channel="IR"
            wavelength="950 nm"
            pwm="Nano D5 PWM"
            value={lights.ir}
            enabled={Boolean(lights.irOn)}
            disabled={!prototypeSupportsMono(selectedPrototype, "ir")}
            accent="ir"
            onToggle={() => toggleGroup("ir")}
            onChange={(value) => updateMonoChannel("ir", value)}
            onCommit={(value) => commitMonoChannel("ir", value)}
          />

          <DimmableLedControl
            channel="UVA"
            wavelength="375 nm"
            pwm="Nano D6 PWM"
            value={lights.uva}
            enabled={Boolean(lights.uvaOn)}
            disabled={!prototypeSupportsMono(selectedPrototype, "uva")}
            accent="uva"
            onToggle={() => toggleGroup("uva")}
            onChange={(value) => updateMonoChannel("uva", value)}
            onCommit={(value) => commitMonoChannel("uva", value)}
          />

          {RGBW_GROUP_KEYS.map((groupKey) => (
            <RgbwControl
              key={groupKey}
              groupKey={groupKey}
              lights={lights}
              disabled={!prototypeSupportsRgbw(selectedPrototype, groupKey)}
              onToggle={() => toggleGroup(groupKey)}
              onMixChange={updateRgbwMix}
              onMixCommit={commitRgbwMix}
              onChannelChange={updateRgbwChannel}
              onChannelCommit={commitRgbwChannel}
            />
          ))}

          <button type="button" className="all-off" onClick={allOff}>
            <Power size={22} />
            All off
          </button>

          <section className="auto-off-panel">
            <SwitchHeader
              icon={<Clock3 size={18} />}
              title="Auto-off"
              detail={autoOff ? "Enabled" : "Disabled"}
              enabled={autoOff}
              onToggle={() => setAutoOff((value) => !value)}
            />
            <div className="timer-row">
              <strong>{formatCountdown(anyLightOn && autoOff ? countdown : AUTO_OFF_SECONDS)}</strong>
              <button type="button" onClick={() => setCountdown(AUTO_OFF_SECONDS)} title="Reset timer">
                <TimerReset size={16} />
                Reset
              </button>
            </div>
          </section>
        </aside>

        <section className="device-panel">
          <PanelHeader title="Device status" icon={<Activity size={18} />} meta={statusText} />
          <div className="status-list">
            <StatusRow icon={<Router size={16} />} label="Address" value={deviceBase || connectionTarget || "No address"} />
            <StatusRow icon={<Cpu size={16} />} label="Prototype" value={`${selectedPrototype.label} - ${selectedPrototype.title}`} />
            <StatusRow icon={<Power size={16} />} label="LED power" value={lights.power ? "Enabled" : "Disabled"} />
            <StatusRow icon={<Gauge size={16} />} label="IR" value={`${lights.irOn ? "On" : "Off"} - ${lights.ir} / 255 (${dutyToPercent(lights.ir)}%)`} />
            <StatusRow icon={<Gauge size={16} />} label="UVA" value={`${lights.uvaOn ? "On" : "Off"} - ${lights.uva} / 255 (${dutyToPercent(lights.uva)}%)`} />
            {RGBW_GROUP_KEYS.map((groupKey) => {
              const group = RGBW_GROUPS[groupKey];
              return (
                <StatusRow
                  key={groupKey}
                  icon={<Palette size={16} />}
                  label={group.title}
                  value={`${lights[group.onKey] ? "On" : "Off"} - ${rgbwStatus(lights, groupKey)}`}
                />
              );
            })}
            <StatusRow
              icon={<Palette size={16} />}
              label="Hologram"
              value={`${hologramEnabled ? (hologram.power ? "On" : "Off") : "Unavailable"} - mode ${hologram.mode}, brightness ${hologram.brightness}, display ${
                hologramTarget || "No address"
              }`}
            />
            <StatusRow icon={<Clock3 size={16} />} label="Last response" value={lastResponseAt ? lastResponseAt.toLocaleTimeString() : "Not connected"} />
            <StatusRow icon={<Cpu size={16} />} label="Firmware API" value="/status, /led, /hologram, /capture, :81/stream" />
          </div>
        </section>

        <section className="capture-panel">
          <PanelHeader title="Stream & capture" icon={<Camera size={18} />} meta="Local view" />
          <div className="capture-grid">
            <label>
              Stream endpoint
              <span className="field-readout">{connected && liveBase ? streamUrl(liveBase).replace(/\?t=.*/, "") : "Connect first"}</span>
            </label>
            <label>
              Image fit
              <select value={frameFit} onChange={(event) => setFrameFit(event.target.value)}>
                <option value="fit">Fit frame</option>
                <option value="one">1:1 crop</option>
              </select>
            </label>
          </div>
        </section>

        <section className="hardware-panel">
          <PanelHeader title="Hardware reference" icon={<SatelliteDish size={18} />} meta="S3 camera, C6 display, Nano driver" />
          <div className="hardware-content">
            <figure>
              <img src="/assets/esp32-front.jpg" alt="ESP32-CAM front with OV2640 camera" />
              <figcaption>Legacy ESP32-CAM front</figcaption>
            </figure>
            <figure>
              <img src="/assets/esp32-back.jpg" alt="ESP32-CAM back with ESP32 module" />
              <figcaption>Legacy ESP32-CAM back</figcaption>
            </figure>
            <div className="telemetry-list">
              {telemetrySeed.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="wiring-panel">
          <PanelHeader title="Wiring" icon={<ShieldAlert size={18} />} meta="External LED power" />
          <div className="wiring-diagram" aria-label="Wiring diagram">
            <div className="board-box">
              <strong>ESP32-S3 CAM</strong>
              <span className="pin tx-pin">GPIO1 TX</span>
              <span className="pin rx-pin">GPIO2 RX</span>
            </div>
            <div className="wire-lines" aria-hidden="true">
              <span />
              <span />
            </div>
            <div className="driver-box">
              <strong>Arduino Nano 2S driver</strong>
              <span>D5/D6 PWM + D7 SK6812 data + C6 LCD display on its own USB-C board</span>
            </div>
            <div className="led-stack">
              {selectedPrototype.controls.ir ? <div className="led-box ir-led">IR LED<br />950 nm</div> : null}
              {selectedPrototype.controls.uva ? <div className="led-box uva-led">UVA LED<br />375 nm</div> : null}
              {RGBW_GROUP_KEYS.filter((groupKey) => prototypeSupportsRgbw(selectedPrototype, groupKey)).map((groupKey) => (
                <div key={groupKey} className="led-box rgbw-led">
                  {RGBW_GROUPS[groupKey].title}<br />{groupKey === "rgbw1" ? "camera right" : groupKey === "rgbw2" ? "camera left" : "2 pixels"}
                </div>
              ))}
              {!hasLightingHardware ? <div className="led-box link-led">No LEDs<br />link test only</div> : null}
            </div>
          </div>
          <div className="safety-callout">
            <AlertTriangle size={18} />
            <div>
              <strong>Nano and ESP32 pins carry signal only.</strong>
              <span>Use a fused 2S pack, a regulated 5 V buck rail, MOSFET switching for IR/UVA, and separate USB-C programming/power access for the S3 and C6 boards.</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function PanelHeader({ title, icon, meta }) {
  return (
    <div className="panel-header">
      <div>
        {icon}
        <h2>{title}</h2>
      </div>
      {meta ? <span>{meta}</span> : null}
    </div>
  );
}

function PrototypeList({ title, items }) {
  return (
    <div className="prototype-list">
      <span>{title}</span>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function SwitchHeader({ icon, title, detail, enabled, disabled = false, onToggle }) {
  return (
    <div className="auto-title">
      {icon}
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      <button type="button" className={enabled ? "toggle active" : "toggle"} aria-pressed={enabled} onClick={onToggle} disabled={disabled}>
        <span />
      </button>
    </div>
  );
}

function DimmableLedControl({ channel, wavelength, pwm, value, enabled, disabled = false, accent, onToggle, onChange, onCommit }) {
  return (
    <section className={`light-card ${accent} ${enabled ? "" : "off"} ${disabled ? "unavailable" : ""}`}>
      <div className="light-topline">
        <div>
          <span className="light-dot" />
          <strong>{channel}</strong>
          <small>{wavelength}</small>
        </div>
        <span>{pwm}</span>
      </div>
      <SwitchHeader
        icon={<Power size={16} />}
        title={`${channel} output`}
        detail={enabled ? "On" : "Off"}
        enabled={enabled}
        disabled={disabled}
        onToggle={onToggle}
      />
      <input
        type="range"
        min="0"
        max="255"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        onPointerUp={(event) => onCommit(Number(event.currentTarget.value))}
        onKeyUp={(event) => onCommit(Number(event.currentTarget.value))}
        onBlur={(event) => onCommit(Number(event.currentTarget.value))}
        style={{ "--value": `${dutyToPercent(value)}%` }}
        aria-label={`${channel} dimming`}
      />
      <div className="light-footer">
        <span>0%</span>
        <span>25%</span>
        <strong>{dutyToPercent(value)}%</strong>
        <span>75%</span>
        <span>100%</span>
      </div>
    </section>
  );
}

function RgbwControl({ groupKey, lights, disabled = false, onToggle, onMixChange, onMixCommit, onChannelChange, onChannelCommit }) {
  const group = RGBW_GROUPS[groupKey];
  const enabled = Boolean(lights[group.onKey]);
  const level = rgbwLevel(lights, groupKey);

  return (
    <section className={`rgbw-panel ${enabled ? "" : "off"} ${disabled ? "unavailable" : ""}`}>
      <div className="rgbw-topline">
        <div>
          <Palette size={18} />
          <strong>{group.title}</strong>
          <small>{group.role}</small>
        </div>
        <span>{group.pwm}</span>
      </div>
      <SwitchHeader
        icon={<Power size={16} />}
        title={`${group.title} output`}
        detail={enabled ? "On" : "Off"}
        enabled={enabled}
        disabled={disabled}
        onToggle={onToggle}
      />
      <label className="spectrum-control">
        <span>Brightness</span>
        <output>{dutyToPercent(level)}%</output>
        <input
          type="range"
          min="0"
          max="255"
          value={level}
          disabled={disabled}
          onChange={(event) => onMixChange(groupKey, Number(event.target.value))}
          onPointerUp={(event) => onMixCommit(groupKey, Number(event.currentTarget.value))}
          onKeyUp={(event) => onMixCommit(groupKey, Number(event.currentTarget.value))}
          onBlur={(event) => onMixCommit(groupKey, Number(event.currentTarget.value))}
          style={{ "--value": `${dutyToPercent(level)}%` }}
          aria-label={`${group.title} brightness`}
        />
      </label>
      <div className="color-grid">
        <ColorChannelSlider
          label="R"
          channel="r"
          value={lights[group.keys.r]}
          disabled={disabled}
          onChange={(color, value) => onChannelChange(groupKey, color, value)}
          onCommit={(color, value) => onChannelCommit(groupKey, color, value)}
        />
        <ColorChannelSlider
          label="G"
          channel="g"
          value={lights[group.keys.g]}
          disabled={disabled}
          onChange={(color, value) => onChannelChange(groupKey, color, value)}
          onCommit={(color, value) => onChannelCommit(groupKey, color, value)}
        />
        <ColorChannelSlider
          label="B"
          channel="b"
          value={lights[group.keys.b]}
          disabled={disabled}
          onChange={(color, value) => onChannelChange(groupKey, color, value)}
          onCommit={(color, value) => onChannelCommit(groupKey, color, value)}
        />
        <ColorChannelSlider
          label="W"
          channel="w"
          value={lights[group.keys.w]}
          disabled={disabled}
          onChange={(color, value) => onChannelChange(groupKey, color, value)}
          onCommit={(color, value) => onChannelCommit(groupKey, color, value)}
        />
      </div>
    </section>
  );
}

function ColorChannelSlider({ label, channel, value, disabled = false, onChange, onCommit }) {
  return (
    <label className={`color-channel channel-${channel}`}>
      <span>
        <strong>{label}</strong>
        <output>{value}</output>
      </span>
      <input
        type="range"
        min="0"
        max="255"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(channel, Number(event.target.value))}
        onPointerUp={(event) => onCommit(channel, Number(event.currentTarget.value))}
        onKeyUp={(event) => onCommit(channel, Number(event.currentTarget.value))}
        onBlur={(event) => onCommit(channel, Number(event.currentTarget.value))}
        style={{ "--value": `${dutyToPercent(value)}%` }}
        aria-label={`${label} channel brightness`}
      />
    </label>
  );
}

function HologramPreview({ hologram, disabled = false }) {
  const previewStyle = {
    "--holo-c1": dimmedColorCss(hologram, 1),
    "--holo-c2": dimmedColorCss(hologram, 2),
    "--holo-c3": dimmedColorCss(hologram, 3),
    "--holo-alpha": hologram.power && !disabled ? Math.max(0.08, hologram.brightness / 255) : 0.04
  };

  return (
    <div className={`hologram-preview mode-${hologram.mode} ${hologram.power && !disabled ? "" : "off"}`} style={previewStyle}>
      <div className="hologram-glass" aria-label="Hologram acrylic preview">
        <span className="holo-pane pane-top" />
        <span className="holo-pane pane-right" />
        <span className="holo-pane pane-bottom" />
        <span className="holo-pane pane-left" />
        <span className="holo-reticle" />
      </div>
      <div className="hologram-palette-strip">
        <span style={{ background: colorCss(hologram, 1) }} />
        <span style={{ background: colorCss(hologram, 2) }} />
        <span style={{ background: colorCss(hologram, 3) }} />
      </div>
    </div>
  );
}

function HologramSlider({ label, value, disabled = false, onChange }) {
  return (
    <label className="hologram-slider">
      <span>
        <strong>{label}</strong>
        <output>{value}</output>
      </span>
      <input
        type="range"
        min="0"
        max="255"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--value": `${dutyToPercent(value)}%` }}
      />
    </label>
  );
}

function HologramColorMixer({ index, hologram, disabled = false, onChange }) {
  const labels = ["Primary", "Secondary", "Highlight"];
  const patchFor = (channel, value) => {
    onChange({
      [`${channel}${index}`]: value,
      power: 1
    });
  };

  return (
    <section className="hologram-mixer">
      <div>
        <strong>{labels[index - 1]}</strong>
        <span style={{ background: colorCss(hologram, index) }} />
      </div>
      <div className="color-grid">
        <ColorChannelSlider
          label="R"
          channel="r"
          value={hologram[`r${index}`]}
          disabled={disabled}
          onChange={patchFor}
          onCommit={patchFor}
        />
        <ColorChannelSlider
          label="G"
          channel="g"
          value={hologram[`g${index}`]}
          disabled={disabled}
          onChange={patchFor}
          onCommit={patchFor}
        />
        <ColorChannelSlider
          label="B"
          channel="b"
          value={hologram[`b${index}`]}
          disabled={disabled}
          onChange={patchFor}
          onCommit={patchFor}
        />
      </div>
    </section>
  );
}

function StatusRow({ icon, label, value }) {
  return (
    <div className="status-row">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
