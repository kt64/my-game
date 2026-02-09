const partyName = localStorage.getItem("partyName");
const policy = localStorage.getItem("policy");

document.getElementById("partyDisplay").textContent =
  `あなたの政党：${partyName}`;

let day = 1;
let seats = 200;
let aiSeats = 240;

const map = document.getElementById("map");

// 簡易都道府県（後で47に拡張）
for (let i = 1; i <= 24; i++) {
  const d = document.createElement("div");
  d.className = "pref";
  d.textContent = i;
  d.onclick = () => {
    d.classList.toggle("you");
  };
  map.appendChild(d);
}

update();

function doAction(type) {
  if (type === "speech") seats += 1;
  if (type === "sns") seats += 2;
  if (type === "survey")
    document.getElementById("news").textContent =
      "【情勢】与党と野党が接戦です";

  day++;
  update();
}

function update() {
  document.getElementById("dayDisplay").textContent =
    `選挙戦 ${day}日目 / 15日`;

  document.getElementById("seats").textContent = seats;

  document.getElementById("barYou").style.width = seats + "px";
  document.getElementById("barAI").style.width = aiSeats + "px";
}


