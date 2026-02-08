let day = 1;
let time = 0;
let maxDays = 15;

let support = { youth:0, middle:0, senior:0 };
let partyName = "";
let selectedPolicies = [];

let prefSupport = {};
let mapClickMode = false;

// 初期勢力設定
// 与党: red, 野党: blue, 中立: gray
let prefFaction = {
  hokkaido:"opposition", aomori:"opposition", iwate:"opposition", miyagi:"opposition",
  akita:"opposition", yamagata:"opposition", fukushima:"opposition",
  tokyo:"ruling", kanagawa:"ruling", saitama:"ruling", chiba:"ruling",
  aichi:"ruling", osaka:"ruling", hyogo:"ruling", kyoto:"ruling",
  fukuoka:"ruling", okinawa:"opposition"
};
const prefectures=[
  "hokkaido","aomori","iwate","miyagi","akita","yamagata","fukushima",
  "ibaraki","tochigi","gunma","saitama","chiba","tokyo","kanagawa",
  "niigata","toyama","ishikawa","fukui","yamanashi","nagano","gifu",
  "shizuoka","aichi","mie","shiga","kyoto","osaka","hyogo","nara","wakayama",
  "tottori","shimane","okayama","hiroshima","yamaguchi",
  "tokushima","kagawa","ehime","kochi",
  "fukuoka","saga","nagasaki","kumamoto","oita","miyazaki","kagoshima","okinawa"
];
prefectures.forEach(p=>prefSupport[p]=0);

// 初期色設定
function initMapColor(){
  prefectures.forEach(p=>{
    let elem=document.getElementById(p);
    if(!elem) return;
    if(prefFaction[p]==="ruling") elem.setAttribute("fill","rgb(200,50,50)");
    else if(prefFaction[p]==="opposition") elem.setAttribute("fill","rgb(50,50,200)");
    else elem.setAttribute("fill","rgb(200,200,200)");
  });
}

// スタート
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
  initMapColor();
  updateStatus(); updateNews(); updateSeats();
}

// 街頭演説ボタン
function action(type){
  if(type==="speech"){
    mapClickMode=true;
    alert("演説する都道府県を地図から選んでください");
  } else {
    applyAction(type);
  }
}

// 地図クリック
function clickPref(pref){
  if(!mapClickMode) return;
  prefSupport[pref]++;
  let elem=document.getElementById(pref);
  let level=Math.min(prefSupport[pref],5);
  // 与党:赤濃淡, 野党:青濃淡
  if(prefFaction[p]==="ruling") elem.setAttribute("fill",`rgb(${200-level*30},${50},${50})`);
  else if(prefFaction[p]==="opposition") elem.setAttribute("fill",`rgb(${50},${50},${200-level*30})`);
  else elem.setAttribute("fill",`rgb(${200-level*30},${200-level*30},${200-level*30})`);
  mapClickMode=false;
  applyAction('speech', pref);
}

// 効果反映
function applyAction(type,pref=null){
  let e=actionEffects[type];
  support.youth+=e.youth; support.middle+=e.middle; support.senior+=e.senior;

  if(type==="speech" && pref){
    let regionEffect = prefSupport[pref]*2;
    support.youth+=regionEffect; support.middle+=regionEffect; support.senior+=regionEffect;
  }

  time++; if(time===3){ time=0; day++; }

  updateStatus(); updateSeats(); updateNews();

  if(day>maxDays) finish();
}

// 状態更新
function updateStatus(){
  document.getElementById("status").textContent=`${day}日目 ${["朝","昼","夜"][time]} ／ ${partyName}`;
  document.getElementById("youth").textContent=support.youth;
  document.getElementById("middle").textContent=support.middle;
  document.getElementById("senior").textContent=support.senior;
}

// 議席予測
function updateSeats(){
  let total=support.youth+support.middle+support.senior;
  total+=Object.values(prefSupport).reduce((a,b)=>a+b,0)*2;
  let voteRate=Math.max(30,Math.min(70,50+total/20));
  let seats=Math.round(Math.pow(voteRate/100,1.3)*465);
  document.getElementById("seatsText").textContent=`予測議席：${seats}議席（過半数233）`;
}

// ニュース速報
function updateNews(){
  let message="";
  if(day<=5) message="序盤情勢調査：与党がやや優勢です。";
  else if(day<=10) message="中盤情勢調査：支持率に変動があります。";
  else message="終盤情勢調査：接戦模様です。";
  document.getElementById("newsText").textContent=message;
}

// 最終結果
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

// 初期色設定を読み込み
initMapColor();

