const policyList = ['社会保障','経済','エネルギー','農業','外交','教育','政治とカネ'];
let selectedPref = null;
let turn = 0;


const svg = document.getElementById('japanMap');


prefectures.forEach(p => {
const r = document.createElementNS('http://www.w3.org/2000/svg','rect');
r.setAttribute('x',p[1]);
r.setAttribute('y',p[2]);
r.setAttribute('width',18);
r.setAttribute('height',18);
r.classList.add('pref','yato');
r.dataset.name = p[0];
r.addEventListener('click',()=>selectPref(r));
svg.appendChild(r);
});


function selectPref(el){
document.querySelectorAll('.pref').forEach(p=>p.classList.remove('selected'));
el.classList.add('selected');
selectedPref = el;
}


startBtn.onclick = () => {
const checked = document.querySelectorAll('#policies input:checked');
if(checked.length !== 5){ alert('公約は5つ選んでください'); return; }
document.getElementById('setup').classList.add('hidden');
document.getElementById('game').classList.remove('hidden');
updateUI();
};


function doAction(type){
if(!selectedPref){ alert('都道府県を選択してください'); return; }
turn++;
seats += type==='speech'?1:type==='sns'?2:3;
selectedPref.classList.remove('yato');
selectedPref.classList.add('yoto');
selectedPref.classList.remove('selected');
selectedPref = null;
updateUI(type);
}


function updateUI(type){
document.getElementById('seats').textContent = `与党議席：${seats} / 465（過半数233）`;
document.getElementById('seatBar').style.width = `${(seats/465)*100}%`;


if(turn===3||turn===6||turn===9){
document.getElementById('news').textContent = seats>=233
? '情勢調査：与党が優勢、過半数の可能性'
: '情勢調査：与党は苦戦';
} else if(type){
document.getElementById('news').textContent = `${type}を実施`;
}
}

