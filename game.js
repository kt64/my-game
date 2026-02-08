let day = 1;
let time = 0; // 0:朝, 1:昼, 2:夜
let maxDays = 15;

let support = { youth: 0, middle: 0, senior: 0 };
let selectedPolicies = [];
let partyName = "";

// 公約ごとの支持率効果
const policyEffects = {
  tax: { youth: 3, middle: 2, senior: -2 },
  wage: { youth: 4, middle: 3, senior: -1 },
  child: { youth: 5, middle: 2, senior: -2 },
  pension: { youth: -1, middle: 2, senior: 5 },
  defense: { youth: -2, middle: 1, senior: 4 },
  peace: { youth: 2, middle: 2, senior: 0 },
  edu: { youth: 5, middle: 3, senior: -3 },
  reform: { youth: 3, middle: 2, senior: 0 }
};

// 行動ごとの支持率効果
const actionEffects = {
  speech: { youth: 0, middle: 2, senior: 3 },
  sns: { youth: 4, middle: 1, senior: -1 },
  tv: { youth: 1, middle: 3, senior: 1 },
  local: { youth: 0, middle: 1, senior: 4 }
};

function startGame() {
  partyName = document.getElementById("partyName").value;
  const checks = document.querySelectorAll("#policies input:checked");

  if (checks.length !== 5 || partyName === "") {
    alert("政党名を入力し、公約を5つ選んでください");
    return;
  }

  checks.forEach(c => {
    selectedPolicies.push(c.value);
    let e = policyEffects[c.value];
    support.youth += e.youth;
    support.middle += e.middle;
    support.senior += e.senior;
  });

  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "block";
  updateStatus();
}

function action(type) {
  let e = actionEffects[type];
  support.youth += e.youth;
  support.middle += e.middle;
  support.senior += e.senior;

  time++;
  if (time === 3) {
    time = 0;
    day++;
  }

  if (day > maxDays) {
    finish();
  } else {
    updateStatus();
  }
}

function updateStatus() {
  document.getElementById("status").textContent =
    `${day}日目 ${["朝","昼","夜"][time]} ／ ${partyName}`;

  document.getElementById("youth").textContent = support.youth;
  document.getElementById("middle").textContent = support.middle;
  document.getElementById("senior").textContent = support.senior;
}

function finish() {
  document.getElementById("game").style.display = "none";
  document.getElementById("result").style.display = "block";

  let total = support.youth + support.middle + support.senior;
  let voteRate = Math.max(30, Math.min(70, 50 + total / 20));

  let seats = Math.round(Math.pow(voteRate / 100, 1.3) * 465);

  document.getElementById("resultText").innerHTML =
    `政党名：${partyName}<br>
     得票率：約${voteRate.toFixed(1)}％<br>
     獲得議席数：${seats}議席<br>
     ${seats >= 233 ? "→ 与党になれる" : "→ 野党になる"}`;
}

