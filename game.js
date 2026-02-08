document.addEventListener('DOMContentLoaded', () => {

  /* ===== 公約 ===== */
  const policyList = [
    '社会保障','経済','エネルギー',
    '農業','外交','教育','政治とカネ'
  ];

  const policiesDiv = document.getElementById('policies');

  policyList.forEach(p => {
    const label = document.createElement('label');
    label.style.display = 'block';
    label.innerHTML = `<input type="checkbox"> ${p}`;
    policiesDiv.appendChild(label);
  });

  /* ===== 日本地図（教育用SVG配置） ===== */
  const prefectures = [
    ['北海道',600,20],['青森',620,70],['岩手',650,90],['宮城',630,120],
    ['秋田',600,110],['山形',600,140],['福島',630,160],
    ['新潟',560,160],['富山',540,180],['石川',520,170],['福井',520,190],
    ['長野',560,200],['群馬',590,210],['栃木',610,210],['茨城',630,210],
    ['埼玉',600,230],['千葉',630,240],['東京',600,260],['神奈川',580,260],
    ['岐阜',520,230],['静岡',560,260],['愛知',530,260],['三重',510,280],
    ['滋賀',520,300],['京都',500,290],['大阪',500,310],['兵庫',480,300],
    ['奈良',520,320],['和歌山',500,340],
    ['鳥取',460,270],['島根',440,260],['岡山',460,290],
    ['広島',440,300],['山口',420,300],
    ['徳島',480,340],['香川',460,330],['愛媛',440,340],['高知',460,360],
    ['福岡',420,330],['佐賀',400,330],['長崎',380,330],
    ['熊本',400,360],['大分',420,360],['宮崎',420,390],
    ['鹿児島',400,390],['沖縄',300,390]
  ];

  const svg = document.getElementById('japanMap');
  let selectedPref = null;
  let seats = 200;
  let turn = 0;

  prefectures.forEach(p => {
    const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    r.setAttribute('x', p[1]);
    r.setAttribute('y', p[2]);
    r.setAttribute('width', 18);
    r.setAttribute('height', 18);
    r.classList.add('pref', 'yato');
    r.dataset.name = p[0];

    r.addEventListener('click', () => {
      document.querySelectorAll('.pref')
        .forEach(el => el.classList.remove('selected'));
      r.classList.add('selected');
      selectedPref = r;
    });

    svg.appendChild(r);
  });

  /* ===== ゲーム開始 ===== */
  document.getElementById('startBtn').onclick = () => {
    const checked = document.querySelectorAll('#policies input:checked');
    if (checked.length !== 5) {
      alert('公約は5つ選んでください');
      return;
    }
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    updateUI();
  };

  /* ===== 行動 ===== */
  document.getElementById('speechBtn').onclick = () => doAction(1, '街頭演説');
  document.getElementById('snsBtn').onclick = () => doAction(2, 'SNS発信');
  document.getElementById('debateBtn').onclick = () => doAction(3, '討論会');

  function doAction(add, text) {
    if (!selectedPref) {
      alert('都道府県を選択してください');
      return;
    }
    seats += add;
    turn++;

    selectedPref.classList.remove('yato');
    selectedPref.classList.add('yoto');
    selectedPref.classList.remove('selected');
    selectedPref = null;

    updateUI(text);
  }

  function updateUI(action) {
    document.getElementById('seats').textContent =
      `与党議席：${seats} / 465（過半数233）`;

    document.getElementById('seatBar').style.width =
      `${(seats / 465) * 100}%`;

    if (turn === 3 || turn === 6 || turn === 9) {
      document.getElementById('news').textContent =
        seats >= 233
          ? '情勢調査：与党が優勢、過半数の可能性'
          : '情勢調査：与党は苦戦';
    } else if (action) {
      document.getElementById('news').textContent =
        `${action}を実施しました`;
    }
  }

});

