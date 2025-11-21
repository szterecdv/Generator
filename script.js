const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const pwDisplay = document.getElementById("pwChars");
const genBtn = document.getElementById("genBtn");
const copyBtn = document.getElementById("copyBtn");
const revealBtn = document.getElementById("revealBtn");
const meterBar = document.getElementById("meterBar");
const entropyEl = document.getElementById("entropy");
const historyBox = document.getElementById("history");
const snack = document.getElementById("snack");
const timeChip = document.getElementById("timeChip");
let hidden = true;
let lastPw = "";

function genRandomLetter() {
  const arr = new Uint32Array(1);
  window.crypto.getRandomValues(arr);
  return chars[arr[0] % chars.length];
}

function generatePw() {
  let out = "";
  for (let i = 0; i < 16; i++) out += genRandomLetter();
  lastPw = out;
  renderPw();
  addHistory(out);
  updateEntropy();
  updateTime();

  // TXT fájl automatikus mentése
  const blob = new Blob([out], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jelszo.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

genBtn.onclick = generatePw;

function renderPw() {
  if (hidden) {
    pwDisplay.textContent = "•".repeat(16);
    revealBtn.textContent = "Mutat";
  } else {
    pwDisplay.textContent = lastPw;
    revealBtn.textContent = "Rejt";
  }
}

revealBtn.onclick = () => {
  hidden = !hidden;
  renderPw();
};

copyBtn.onclick = async () => {
  if (!lastPw) return;
  await navigator.clipboard.writeText(lastPw);
  snack.classList.add("show");
  setTimeout(() => snack.classList.remove("show"), 1200);
};

function updateEntropy() {
  const entropy = Math.round(16 * Math.log2(chars.length));
  entropyEl.textContent = entropy;
  let pct = Math.min(entropy / 112 * 100, 100);
  meterBar.style.width = pct + "%";
}

function addHistory(pw) {
  const item = document.createElement("div");
  item.className = "hist-item";
  item.textContent = pw;
  historyBox.prepend(item);
}

function updateTime() {
  const d = new Date();
  const t = d.toLocaleTimeString("hu-HU", {hour:"2-digit", minute:"2-digit", second:"2-digit"});
  timeChip.textContent = "Utolsó: " + t;
}

renderPw();
