const partyName = localStorage.getItem("partyName") || "あなた";
const policy = localStorage.getItem("policy");
const mode = localStorage.getItem("mode");

document.getElementById("partyDisplay").textContent = `党首：${partyName}`;

let day = 1;
let turnStep = 0; // 0:朝, 1:昼, 2:夜
const STEPS = ["朝", "昼", "夜"];
const TOTAL_DAYS = 15;
const TOTAL_SEATS = 465;
const MAJORITY = 233;

const prefectures = PREF_DATA;
const status = {}; 
// 初期状態はすべて中立
Object.keys(prefectures).forEach(p => status[p] = "neutral");

let currentAction = null;

// 地図の生成（PREF_DATAから47個すべて生成）
const map = document.getElementById("japan-map");
function createMap() {
    map.innerHTML = "";
    Object.keys(prefectures).forEach((p) => {
        const d = document.createElement("div");
        d.className = "pref neutral";
        d.id = `pref-${p}`;
        d.textContent = p;
        d.style.left = prefectures[p].x + "px";
        d.style.top = prefectures[p].y + "px";
        d.onclick = () => clickPref(p);
        map.appendChild(d);
    });
}

function clickPref(p) {
    if (currentAction === "speech") {
        status[p] = "you";
        document.getElementById("news").textContent = `${p}で熱い演説を行いました！`;
        nextStep();
    }
}

function startSpeech() {
    currentAction = "speech";
    document.getElementById("news").textContent = "演説する都道府県をクリックしてください";
}

function doSNS() {
    Object.keys(prefectures).forEach(p => {
        if (prefectures[p].type === "urban" && Math.random() > 0.7) status[p] = "you";
    });
    document.getElementById("news").textContent = "SNSで都市部の若者にアピールしました。";
    nextStep();
}

function doSurvey() {
    const you = calculateSeats("you");
    document.getElementById("news").textContent = `【情勢】現在${you}議席確保の見込みです。`;
    nextStep();
}

function calculateSeats(owner) {
    let total = 0;
    Object.keys(status).forEach(p => {
        if (status[p] === owner) {
            let bonus = 0;
            const t = prefectures[p].type;
            if (policy === "welfare" && t === "rural") bonus = 2;
            if (policy === "economy" && t === "industry") bonus = 2;
            total += prefectures[p].seats + bonus;
        }
    });
    return total;
}

function updateUI() {
    const you = calculateSeats("you");
    const ai = calculateSeats("ai");
    const neutral = TOTAL_SEATS - you - ai;

    document.getElementById("seats").textContent = you;
    document.getElementById("dayDisplay").textContent = `残り ${TOTAL_DAYS - day + 1}日`;
    document.getElementById("timeDisplay").textContent = `${day}日目：${STEPS[turnStep]}`;

    // バーの更新
    document.getElementById("barYou").style.width = (you / TOTAL_SEATS) * 100 + "%";
    document.getElementById("barAI").style.width = (ai / TOTAL_SEATS) * 100 + "%";
    document.getElementById("barNeutral").style.width = (Math.max(0, neutral) / TOTAL_SEATS) * 100 + "%";

    // 地図の色更新
    Object.keys(status).forEach(p => {
        const el = document.getElementById(`pref-${p}`);
        if (el) el.className = `pref ${status[p]}`;
    });
}

function nextStep() {
    currentAction = null;
    turnStep++;

    if (turnStep > 2) {
        // 夜が明けたらAIの番
        aiTurn();
        turnStep = 0;
        day++;
    }

    if (day > TOTAL_DAYS) {
        showResult();
    } else {
        updateUI();
    }
}

function aiTurn() {
    if (mode === "two") return;
    // AIが3回分（1日分）まとめて行動するイメージ
    for (let i = 0; i < 2; i++) {
        const neutrals = Object.keys(status).filter(k => status[k] === "neutral");
        if (neutrals.length > 0) {
            const target = neutrals[Math.floor(Math.random() * neutrals.length)];
            status[target] = "ai";
        }
    }
}

function showResult() {
    const you = calculateSeats("you");
    const modal = document.getElementById("resultModal");
    modal.style.display = "flex";
    
    const title = document.getElementById("resultTitle");
    const seatsDisp = document.getElementById("finalSeats");
    const text = document.getElementById("resultText");

    seatsDisp.textContent = `${you} 議席獲得`;
    if (you >= MAJORITY) {
        title.textContent = "勝利！政権交代達成";
        text.textContent = "あなたの政党が第一党となり、新しい内閣が発足します！";
    } else {
        title.textContent = "敗北… 下野";
        text.textContent = "過半数に届きませんでした。次の選挙に向けて力を蓄えましょう。";
    }
}

// 初期起動
createMap();
updateUI();

