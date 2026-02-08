let day = 1;
let time = 0;
let maxDays = 15;

let support = { youth:0, middle:0, senior:0 };
let partyName = "";
let selectedPolicies = [];

let prefSupport = {};
const prefectures = ["hokkaido","aomori","iwate","miyagi","akita","yamagata","fukushima",
  "ibaraki","tochigi","gunma","saitama","chiba","tokyo","kanagawa","niigata","toyama",
  "ishikawa","fukui","yamanashi","nagano","gifu","shizuoka","aichi","mie","shiga","kyoto",
  "osaka","hyogo","nara","wakayama","tottori","shimane","okayama","hiroshima","yamaguchi",
  "tokushima","kagawa","ehime","kochi","fukuoka","saga","nagasaki","kumamoto","oita","miyazaki",
  "kagoshima","okinawa"];

prefectures.forEach(p=>prefSupport[p]=0);

const policyEffects = {
  tax:{youth:3,middle:2,senior:-2}, wage:{youth:4,middle:3,senior:-1},
  child:{youth:5,middle:2,senior:-2}, pension:{youth:-1,middle:2,senior:5},
  defense:{youth:-2,middle:1,senior:4}, peace:{youth:2,middle:2,senior:0},
  edu:{youth:5,middle:3,senior:-3}, reform:{youth:3,middle:2,senior:0},
  agri:{youth:1,middle:2,senior:3}, immigration:{youth:2,middle:1,senior:-1},
  corruption:{youth:-2,middle:0,senior:2}, energy:{youth:1,middle:2,senior:1}
};

const actionEffects = {
  speech:{youth:0,middle:2,senior:3},
  sns:{youth:4,middle:1,senior:-1},
  tv:{youth:1,middle:3,senior:1},
  local:{youth:0,middle:1,senior:4}
};

function startGame(){
  partyName = document.getElementById("partyName").value;
  const checks = document.querySelectorAll("#policies input:checked");
  if(partyName=="" || checks.length!=5){ alert("政党名を入力して公約を5つ選んでください"); return; }
  selectedPolicies=[]; support={youth:0,middle:0,senior:0};
  checks.forEach(c=>{
    selectedPolicies.push(c.value);
    let e=policyEffects[c.value];
    support.youth+=e.youth; support.middle+=e.middle; support.senior+=e.senior;
  });
  document.getElementById("setup").style.display="none";
  document.getElementById("game").style.display="block";
  updateStatus(); updateNews(); updateSeats();
}

function action(type){
  let e=actionEffects[type];
  support.youth+=e.youth; support.middle+=e.middle; support.senior+=e.senior;
  time++; if(time===3){time=0; day++;}
  if(day>maxDays){ finish(); } else { updateStatus(); updateNews(); updateSeats(); }
}

function clickPref(pref){
  prefSupport[pref]++;
  let map=document.getElementById(pref);
  let level=Math.min(prefSupport[pref],5);
  map.setAttribute("fill", `rgb(${200-level*30}, ${50+level*30}, ${50})`);
  updateSeats(); updateNews();
}

function updateStatus(){
  document.getElementById("status").textContent=`${day}日目 ${["朝","昼","夜"][time]} ／ ${partyName}`;
  document.getElementById("youth").textContent=support.youth;
  document.getElementById("middle").textContent=support.middle;
  document.getElementById("senior").textContent=support.senior;
}

function updateSeats(){
  let total = support.youth+support.middle+support.senior;
  total += Object.values(prefSupport).reduce((a,b)=>a+b,0)*2;
  let voteRate=Math.max(30,Math.min(70,50+total/20));
  let seats=Math.round(Math.pow(voteRate/100,1.3)*465);
  document.getElementById("seatsText").textContent=`予測議席：${seats}議席（過半数233）`;
}

function updateNews(){
  let message="";
  if(day<=5) message="序盤情勢調査：与党がやや優勢です。";
  else if(day<=10) message="中盤情勢調査：支持率に変動があります。";
  else message="終盤情勢調査：接戦模様です。";
  document.getElementById("newsText").textContent=message;
}

function finish(){
  document.getElementById("game").style.display="none";
  document.getElementById("result").style.display="block";
  let total=support.youth+support.middle+support.senior;
  total+=Object.values(prefSupport).reduce((a,b)=>a+b,0)*2;
  let voteRate=Math.max(30,Math.min(70,50+total/20));
  let seats=Math.round(Math.pow(voteRate/100,1.3)*465);
  document.getElementById("resultText").innerHTML=
    `政党名：${partyName}<br>
     得票率：約${voteRate.toFixed(1)}％<br>
     獲得議席数：${seats}議席<br>
     ${seats>=233 ? "→ 与党" : "→ 野党"}`;
}

