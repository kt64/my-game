let turn = 0;
let currentPlayer = "ruling";
let speechMode = false;

let seats = {
  ruling: 200,
  opposition: 265
};

// 都道府県の勢力（正：与党／負：野党）
let power = {};
document.querySelectorAll("svg path").forEach(p => power[p.id] = 0);

// 街頭演説
function startSpeech() {
  speechMode = true;
  document.getElementById("news").textContent =
    (currentPlayer === "ruling")
      ? "与党が街頭演説を開始"
      : "野党が街頭演説を開始";
}

// 地図クリック
document.querySelectorAll("svg path").forEach(path => {
  path.addEventListener("click", () => {
    if (!speechMode) return;

    const id = path.id;

    if (currentPlayer === "ruling") {
      power[id]++;
      seats.ruling++;
      seats.opposition--;
      path.style.fill = getRulingColor(power[id]);
    } else {
      power[id]--;
      seats.opposition++;
      seats.ruling--;
      path.style.fill = getOppositionColor(power[id]);
    }

    speechMode = false;
    turn++;
    generateNews();
    switchPlayer();
    updateUI();
  });
});

// 色（色覚多様性）
function getRulingColor(v) {
  return `rgb(${230},${160 - v*10},0)`; // オレンジ系
}

function getOppositionColor(v) {
  return `rgb(0,${140 - Math.abs(v)*10},178)`; // 青緑系
}

// ニュース
function generateNews() {
  let phase = turn < 15 ? "序盤" : turn < 30 ? "中盤" : "終盤";
  let diff = seats.ruling - seats.opposition;
  let trend =
    diff > 20 ? "与党優勢" :
    diff < -20 ? "野党優勢" : "接戦";

  document.getElementById("news").textContent =
    `【${phase}情勢】${trend}`;
}

// 手番交代
function switchPlayer() {
  currentPlayer = currentPlayer === "ruling" ? "opposition" : "ruling";
  document.getElementById("player").textContent =
    currentPlayer === "ruling" ? "与党" : "野党";
}

// 表示更新
function updateUI() {
  document.getElementById("turn").textContent =
    `ターン：${turn} / 45`;

  document.getElementById("seats").textContent =
    `与党${seats.ruling}｜野党${seats.opposition}（過半数233）`;
}

