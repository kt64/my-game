const partyName = localStorage.getItem("partyName");
const policy = localStorage.getItem("policy");
const mode = localStorage.getItem("mode");

document.getElementById("partyDisplay").textContent =
  `あなたの政党：${partyName}`;

let day = 1;
const TOTAL = 465;
const MAJORITY = 233;

/* 都道府県データ（簡略） */
const prefectures = {
  東京: { seats: 25, type: "urban" },
  北海道: { seats: 12, type: "rural" },
  愛知: { seats: 15, type: "industry" },
  大阪: { seats: 19, type: "urban" },
  福岡: { seats: 11, type: "urban" }
};

/* 状態 */
const status = {};
Object.keys(prefectures).forEach(p => status[p] = "neutral");

/* 地図生成 */
const map = document.getElementById("japan-map");
Object.keys(prefectures).forEach((p, i) => {
  const d = document.createElement("div");
  d.className = "pref";
  d.textContent = p;
  d.style.top = 50 + i * 60 + "px";
  d.style.left = "300px";

  d.onclick = () => {
    if (currentAction === "speech") {
      status[p] = "you";
      d.className = "pref you";
      updateSeats();
      endTurn();
    }
  };

  map.appendChild(d);
});

let currentAction = null;

/* A：公約×地域 */
function policyBonus(pref) {
  const t = prefectures[pref].type;
  if (policy === "welfare" && t === "rural") return 2;
  if (policy === "economy" && t === "industry") return 2;
  if (policy === "politics") return 1;
  return 0;
}

/* B：街頭演説 */
function startSpeech() {
  currentAction = "speech";
  document.getElementById("news").textContent =
    "演説する都道府県を選んでください";
}

/* SNS */
function doSNS() {
  Object.keys(prefectures).forEach(p => {
    if (prefectures[p].type === "urban") status[p] = "you";
  });
  document.getElementById("news").textContent =
    "都市部で支持が拡大しました";
  endTurn();
}

/* 情勢調査 */
function doSurvey() {
  document.getElementById("news").textContent =
    "【情勢】過半数まであと少しです";
  endTurn();
}

/* 議席計算 */
function updateSeats() {
  let you = 0;
  let ai = 0;

  Object.keys(status).forEach(p => {
    if (status[p] === "you")
      you += prefectures[p].seats + policyBonus(p);
    if (status[p] === "ai")
      ai += prefectures[p].seats;
  });

  document.getElementById("seats").textContent = you;
  document.getElementById("barYou").style.width = (you / TOTAL) * 100 + "%";
  document.getElementById("barAI").style.width = (ai / TOTAL) * 100 + "%";

  if (you >= MAJORITY) {
    document.getElementById("news").textContent =
      "過半数に到達しました！";
  }
}

/* C：モード別AI */
function aiTurn() {
  if (mode === "two") return;

  if (mode === "solo" || mode === "hard") {
    const keys = Object.keys(status);
    const target = keys[Math.floor(Math.random() * keys.length)];
    status[target] = "ai";
  }

  if (mode === "hard" && day >= 10) {
    document.getElementById("news").textContent =
      "野党各党が選挙協力を発表しました";
  }
}

/* ターン処理 */
function endTurn() {
  currentAction = null;
  day++;
  document.getElementById("dayDisplay").textContent =
    `選挙戦 ${day}日目 / 15日`;
  aiTurn();
  updateSeats();
}


