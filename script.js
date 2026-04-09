const rSlider = document.getElementById("rSlider");
const gSlider = document.getElementById("gSlider");
const bSlider = document.getElementById("bSlider");

const rValue = document.getElementById("rValue");
const gValue = document.getElementById("gValue");
const bValue = document.getElementById("bValue");

const gtagInput = document.getElementById("gtagInput");
const gtagOutput = document.getElementById("gtagOutput");
const rgbOutput = document.getElementById("rgbOutput");
const hexOutput = document.getElementById("hexOutput");

const colorBox = document.getElementById("colorBox");
const errorText = document.getElementById("errorText");
const statusText = document.getElementById("statusText");

const applyBtn = document.getElementById("applyBtn");
const copyHexBtn = document.getElementById("copyHexBtn");
const copyCodeBtn = document.getElementById("copyCodeBtn");

let statusTimer = null;

function to255(v) {
  return Math.round((v / 9) * 255);
}

function toHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function setError(message) {
  errorText.textContent = message;
}

function clearError() {
  errorText.textContent = "";
}

function setStatus(message) {
  statusText.textContent = message;

  if (statusTimer) {
    clearTimeout(statusTimer);
  }

  statusTimer = setTimeout(() => {
    statusText.textContent = "";
  }, 1500);
}

function getSliderValues() {
  return {
    r: parseInt(rSlider.value, 10),
    g: parseInt(gSlider.value, 10),
    b: parseInt(bSlider.value, 10),
  };
}

function setSliderValues(r, g, b) {
  rSlider.value = r;
  gSlider.value = g;
  bSlider.value = b;
}

function updateUI() {
  const { r, g, b } = getSliderValues();

  rValue.textContent = r;
  gValue.textContent = g;
  bValue.textContent = b;

  const rr = to255(r);
  const gg = to255(g);
  const bb = to255(b);

  const rgb = `rgb(${rr}, ${gg}, ${bb})`;
  const hex = toHex(rr, gg, bb);
  const code = `${r},${g},${b}`;

  gtagOutput.textContent = code;
  rgbOutput.textContent = rgb;
  hexOutput.textContent = hex;

  colorBox.style.background = rgb;
  gtagInput.value = code;
}

function parseGTAGInput(raw) {
  const parts = raw.split(",");

  if (parts.length !== 3) {
    return { ok: false, message: "Format: 2,4,9" };
  }

  const values = parts.map((part) => {
    const trimmed = part.trim();
    return trimmed === "" ? NaN : Number(trimmed);
  });

  if (values.some((value) => Number.isNaN(value))) {
    return { ok: false, message: "Use numbers only." };
  }

  const [r, g, b] = values.map((value) => Math.floor(value));

  if ([r, g, b].some((value) => value < 0 || value > 9)) {
    return { ok: false, message: "Use values from 0 to 9." };
  }

  return { ok: true, value: { r, g, b } };
}

function applyInput() {
  const raw = gtagInput.value.trim();

  if (!raw) {
    setError("Type a code like 2,4,9.");
    return;
  }

  const parsed = parseGTAGInput(raw);

  if (!parsed.ok) {
    setError(parsed.message);
    return;
  }

  clearError();
  setSliderValues(parsed.value.r, parsed.value.g, parsed.value.b);
  updateUI();
  setStatus("Code applied.");
}

async function copyToClipboard(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    setStatus(`${label} copied.`);
  } catch {
    setError("Copy failed in this browser.");
  }
}

rSlider.addEventListener("input", () => {
  clearError();
  updateUI();
});

gSlider.addEventListener("input", () => {
  clearError();
  updateUI();
});

bSlider.addEventListener("input", () => {
  clearError();
  updateUI();
});

gtagInput.addEventListener("input", () => {
  clearError();
});

gtagInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    applyInput();
  }
});

applyBtn.addEventListener("click", applyInput);

copyHexBtn.addEventListener("click", () => {
  copyToClipboard(hexOutput.textContent, "HEX");
});

copyCodeBtn.addEventListener("click", () => {
  copyToClipboard(gtagOutput.textContent, "GTAG");
});

updateUI();