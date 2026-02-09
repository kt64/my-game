const partyName = localStorage.getItem("partyName");
const policy = localStorage.getItem("policy");
const mode = localStorage.getItem("mode");

document.getElementById("partyDisplay").textContent = `あなたの政党：${partyName}`;

let day = 1;
const TOTAL_SEATS = 465;
const MAJORITY = 233;
const prefectures = PREF_DATA;
const status = {};
Object.keys(prefectures).forEach(p => status[p] = "neutral");

let currentAction = null;

// 地図の生成
const map = document.getElementById("japan-map");
Object.keys(prefectures).forEach((p) => {
  const d = document.createElement("div");
  d.className = "pref";
  d.id = `pref-${p}`;
  d.textContent = p;
  d.style.left = prefectures[p].x + "px";
  d.style.top = prefectures[p].y + "px";

  d.onclick = () => {
    if (currentAction === "speech") {
      status[p] = "you";
      renderMap();
      updateSeats();
      endTurn();
    }
  };
  map.appendChild(d);
});

function renderMap() {
  Object.keys(status).forEach(p => {
    const el = document.getElementById(`pref-${p}`);
    el.className = "pref " + status[p];
  });
}

function policyBonus(pref) {
  const t = prefectures[pref].type;
  if (policy === "welfare" && t === "rural") return 2;
  if (policy === "economy" && t === "industry") return 2;
  if (policy === "politics") return 1;
  return 0;
}

function startSpeech() {
  currentAction = "speech";
  document.getElementById("news").textContent = "演説する都道府県をクリックしてください";
}

function doSNS() {
  Object.keys(prefectures).forEach(p => {
    if (prefectures[p].type === "urban") status[p] = "you";
  });
  document.getElementById("news").textContent = "SNSで都市部の支持が拡大！";
  renderMap();
  updateSeats();
  endTurn();
}

function doSurvey() {
  const you = calculateCurrentSeats();
  let msg = "【情勢】";
  if (you < 100) msg += "苦戦を強いられています。";
  else if (you < 200) msg += "過半数まであと一歩です。";
  else msg += "過半数獲得の勢いです！";
  document.getElementById("news").textContent = msg;
  endTurn();
}

function calculateCurrentSeats() {
  let total = 0;
  Object.keys(status).forEach(p => {
    if (status[p] === "you") total += prefectures[p].seats + policyBonus(p);
  });
  return total;
}

function updateSeats() {
  let you = calculateCurrentSeats();
  let ai = 0;
  Object.keys(status).forEach(p => {
    if (status[p] === "ai") ai += prefectures[p].seats;
  });

  document.getElementById("seats").textContent = you;
  document.getElementById("barYou").style.width = (you / TOTAL_SEATS) * 100 + "%";
  document.getElementById("barAI").style.width = (ai / TOTAL_SEATS) * 100 + "%";
}

function aiTurn() {
  if (mode === "two") return;
  const keys = Object.keys(status).filter(k => status[k] !== "you");
  if (keys.length > 0) {
    const target = keys[Math.floor(Math.random() * keys.length)];
    status[target] = "ai";
  }
}

function endTurn() {
  currentAction = null;
  day++;
  if (day > 15) {
    showResult();
    return;
  }
  document.getElementById("dayDisplay").textContent = `選挙戦 ${day}日目 / 15日`;
  aiTurn();
  renderMap();
  updateSeats();
}

function showResult() {
  const you = calculateCurrentSeats();
  const modal = document.getElementById("resultModal");
  modal.style.display = "flex";
  document.getElementById("finalSeats").textContent = `${partyName}：${you} 議席`;
  
  if (you >= MAJORITY) {
    document.getElementById("resultTitle").textContent = "✨ 選挙に勝利！ ✨";
    document.getElementById("resultText").textContent = "過半数を獲得し、政権奪取に成功しました！";
  } else {
    document.getElementById("resultTitle").textContent = "● 選挙に敗北 ●";
    document.getElementById("resultText").textContent = "過半数に届きませんでした。野党として再起を図りましょう。";
  }
}


