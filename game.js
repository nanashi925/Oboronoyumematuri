'use strict';
/* =========================================================
   朧の夢祀り ―Oboro no Yume-Matsuri―
   レトロドット絵アドベンチャー（想定プレイ時間：約10分）
   ========================================================= */

const W = 640, H = 360;          // 内部解像度
const PX = 2;                    // ドットの大きさ（スプライト1マス＝2px）
const GROUND = 300;              // 基本の地面の高さ

/* ---------------------------------------------------------
   パレット
--------------------------------------------------------- */
const PAL = {
  // ななし
  'h': '#cdb37e', 'H': '#9d8a5c', 'f': '#efe9f0',
  'b': '#17131f', 'B': '#2b2540',
  's': '#f2dfd4', 'l': '#d8c2b8',
  'e': '#2e3050', 'w': '#f4f0f7', 'W': '#c9bfd8', 'p': '#e8e4ee',
  // 幽世
  'g': '#d3d5de', 'G': '#a9abba',
  'k': '#241d31', 'K': '#372b49', 'v': '#5e4090', 'V': '#8a6cc0',
  'i': '#6a6580',
  // 名無死
  'q': '#e8e6e2', 'Q': '#b9b3ae', 'd': '#aa9aa0', 'm': '#ff5fd0',
  't': '#16161a', 'r': '#7a1f33', 'n': '#5d5a56',
  // 大国主
  'y': '#d9b86a', 'Y': '#b08f3e', 'R': '#b8443c', 'S': '#f3d7be',
  'o': '#fdfbf4', 'O': '#e3dcc8', 'z': '#23201d',
  // 母（影）
  'x': '#dfe5ee', 'X': '#2a0d12', 'M': '#c03a4a',
  // 恋人・現実のわたし
  'c': '#5a4632', 'C': '#43331f', 'u': '#9b8fc0', 'U': '#7e6fa8',
  'a': '#dccaae', 'A': '#c4b193', 'E': '#6b4a36', 'j': '#3a4a6b',
  '1': '#fefefe', '2': '#cfd6e2',
};

/* ---------------------------------------------------------
   スプライト（1文字＝1ドット、'.'＝透明）
--------------------------------------------------------- */
const SPR = {};

SPR.nanashi = [
  '....hhhhhhhh....',
  '...hhhhhhhhhh...',
  '..hhhhhhhhhhhf..',
  'hHHHHHHHHHHHHHHh',
  '..bbbbbbbbbbbb..',
  '.bbbbbbbbbbbbbb.',
  '.bbssssssssssbb.',
  '.bbsessssessbbb.',
  '.bbssssssssssbb.',
  '.bbsssslsssssbb.',
  '.bbbssssssssbbb.',
  '.bbb.wwwwww.bbb.',
  '.bb.wwwwwwww.bb.',
  '.bb.wwwwwwww.bb.',
  '.bbswwwwwwwwsbb.',
  '.bbswwwwwwwwsbb.',
  '.bb.wwwwwwww.bb.',
  '.bb.wWwwwwWw.bb.',
  '.bbwwwwwwwwwwbb.',
  '.b.wwwwwwwwww.b.',
  '.b.wWwwwwwwWw.b.',
  '...wwwwwwwwww...',
  '....ss....ss....',
  '....ss....ss....',
  '....pp....pp....',
  '....pp....pp....',
];
SPR.nanashiWalk = SPR.nanashi.slice(0, 22).concat([
  '...ss....ss.....',
  '...ss......ss...',
  '...pp......pp...',
  '...pp......pp...',
]);

SPR.kakuriyo = [
  '....gggggggg....',
  '..gggggggggggg..',
  '.gggggggggggggg.',
  '.gggssssssssggg.',
  '.ggsesssssesggg.',
  '.ggssssssssssgg.',
  '.ggsssslssssggg.',
  '.gggssssssssggg.',
  'gg..kkkkkkkk..gg',
  'ggkkkkkkkkkkkkgg',
  'ggkkkkvkkvkkkkgg',
  'gGkkkkkvvkkkkkGg',
  'gkkkkkkvvkkkkkkg',
  'gKkkkkvkkvkkkkKg',
  'gkkkkkvkkvkkkkkg',
  'gGkkkkkkkkkkkkGg',
  'g.kkkkkkkkkkkk.g',
  'g.kkkkkkkkkkkk.g',
  'g.kkkkkkkkkkkk.g',
  '..kkkkkkkkkkkk..',
  '..kkkvkkkkvkkk..',
  '..kkkkvkkvkkkk..',
  '..kkkkkkkkkkkk..',
  '..kkkkkkkkkkkk..',
  '..kkkkkkkkkkkk..',
  '..kKkkkkkkkkKk..',
  '..KK........KK..',
  '................',
];

SPR.nanashinu = [ // 名無死（ボス・拡大表示）
  '......rrrrrr......',
  '....rrbbbbbbrr....',
  '...rbbbbbbbbbbr...',
  '...bbbbbbbbbbbb...',
  '..bbbddddddddbb...',
  '..bbddddmdddddbb..',
  '..bbdmddddddmdbb..',
  '..bbddddddddddbb..',
  '..bbdddlddddddbb..',
  '..bbbddddddddbbb..',
  '..bb.qqqqqqqq.bb..',
  '..bbqqqtqqqqqqbb..',
  '..bqqqqtqqtqqqqb..',
  '..bqqqttqqqqqqqb..',
  '.bsqqqqtqqqqqqsb..',
  '.bsqqqqqqqtqqqsb..',
  '..bqqQqqqqtqqqb...',
  '..bqQqqqttqqQqb...',
  '..bqqqqqqqqqqqb...',
  '...qQqqqqqqqQq....',
  '...qq.qqqqq.qq....',
  '....q..qqq..q.....',
  '.....q..q..q......',
  '..................',
];

SPR.okuninushi = [
  '.......zzzz.........',
  '......zzzzzz........',
  '.......zzzz.........',
  '....zzzzzzzzzz......',
  '...zzSSSSSSSSzz.....',
  '...zSSSSSSSSSSz.....',
  '...zSzSSSSzSSSz.....',
  '...zSSSSSSSSSSz.....',
  '...zSSSSlSSSSSz.....',
  '....SSSSSSSSSS......',
  '...ooooooooooooo....',
  '..oooooyyyyoooooo...',
  '.ooooooyRRyooooooo..',
  '.oooooooyyooooooooo.',
  'ooooooooRRoooooooooo',
  'oooooooyRRyooooooooo',
  'ooOoooooyyoooooOoooo',
  'oooooooooooooooooooo',
  'ooOooooyyyyooooOoooo',
  '.ooooooyooyoooooooo.',
  '.ooooooyyyyoooooooo.',
  '..oooooooooooooooo..',
  '..oOoooooooooooOoo..',
  '...oooooooooooooo...',
  '...yy..........yy...',
  '...yy..........yy...',
];

SPR.mother = [
  '....XXXXXXXX....',
  '...XXXXXXXXXX...',
  '..XXXXXXXXXXXX..',
  '..XXXMXXXXMXXX..',
  '..XXXXXXXXXXXX..',
  '..XXXXXXXXXXXX..',
  '...XXXXXXXXXX.x.',
  '..XXXXXXXXXX.xx.',
  '..XXXXXXXXXXxx..',
  '..XXXXXXXXXXXX..',
  '..XXXXXXXXXXXX..',
  '.XXXXXXXXXXXXX..',
  '.XXXXXXXXXXXXX..',
  '.XXXXXXXXXXXXXX.',
  '.XXXXXXXXXXXXXX.',
  'XXXXXXXXXXXXXXXX',
  'XXXXXXXXXXXXXXXX',
  'XXXXXXXXXXXXXXXX',
  'XXXXXXXXXXXXXXXX',
  'XXXXXXXXXXXXXXXX',
  '.XXXXXXXXXXXXXX.',
  '..XXXX....XXXX..',
  '..XXXX....XXXX..',
];

SPR.koibito = [
  '....cccccccc....',
  '...cccccccccc...',
  '...ccCcccccCc...',
  '...cssssssssc...',
  '...csessssesc...',
  '...cssssssssc...',
  '...cssslssssc...',
  '....ssssssss....',
  '....11111111....',
  '...1111111111...',
  '..s1111111111s..',
  '..s1112111211s..',
  '..s1111111111s..',
  '...1111111111...',
  '...1111111111...',
  '...jjjjjjjjjj...',
  '...jjjjjjjjjj...',
  '...jjjj..jjjj...',
  '...jjjj..jjjj...',
  '...jjjj..jjjj...',
  '...jjjj..jjjj...',
  '...cccc..cccc...',
];

SPR.watashi = [ // 目覚めた「わたし」：黒髪ショートボブ・茶色の目
  '....bbbbbbbb....',
  '..bbbbbbbbbbbb..',
  '.bbbbbbbbbbbbbb.',
  '.bbbssssssssbbb.',
  '.bbsEssssEssbbb.',
  '.bbssssssssssbb.',
  '.bbsssslsssssbb.',
  '..bbssssssssbb..',
  '....aaaaaaaa....',
  '...aaa1111aaa...',
  '..saaa1111aaas..',
  '..saaa1111aaas..',
  '..saaaaaaaaaas..',
  '...aaaaaaaaaa...',
  '...uuuuuuuuuu...',
  '...uuUuuuuUuu...',
  '..uuuuuuuuuuuu..',
  '..uuUuuuuuuUuu..',
  '....11....11....',
  '....ss....ss....',
  '....cc....cc....',
  '....cc....cc....',
];

// スプライトの整合性チェック（行の長さ・未定義色）
function validateSprites() {
  const errs = [];
  for (const k in SPR) {
    const rows = SPR[k];
    const w = rows[0].length;
    rows.forEach((row, i) => {
      if (row.length !== w) errs.push(`${k} row ${i}: 長さ ${row.length} != ${w}`);
      for (const ch of row) {
        if (ch !== '.' && !PAL[ch]) errs.push(`${k} row ${i}: 未定義の色 '${ch}'`);
      }
    });
  }
  return errs;
}

/* ---------------------------------------------------------
   オーディオ（WebAudio・チップチューン風）
--------------------------------------------------------- */
const Snd = {
  ac: null, master: null, muted: false,
  bgmName: null, bgmTimer: null, bgmStep: 0,
  ensure() {
    if (!this.ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ac = new AC();
      this.master = this.ac.createGain();
      this.master.gain.value = this.muted ? 0 : 0.5;
      this.master.connect(this.ac.destination);
    }
    if (this.ac.state === 'suspended') this.ac.resume();
    return true;
  },
  mute(on) {
    this.muted = on;
    if (this.master) this.master.gain.value = on ? 0 : 0.5;
  },
  f(m) { return 440 * Math.pow(2, (m - 69) / 12); },
  tone(midi, dur, type, vol, when, bendTo) {
    if (!this.ac) return;
    const t0 = this.ac.currentTime + (when || 0);
    const o = this.ac.createOscillator(), g = this.ac.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(this.f(midi), t0);
    if (bendTo) o.frequency.exponentialRampToValueAtTime(this.f(bendTo), t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(this.master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  },
  noise(dur, vol, when) {
    if (!this.ac) return;
    const t0 = this.ac.currentTime + (when || 0);
    const len = Math.floor(this.ac.sampleRate * dur);
    const buf = this.ac.createBuffer(1, len, this.ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ac.createBufferSource(); src.buffer = buf;
    const g = this.ac.createGain(); g.gain.value = vol;
    src.connect(g); g.connect(this.master); src.start(t0);
  },
  sfx(name) {
    if (!this.ensure()) return;
    switch (name) {
      case 'blip': this.tone(86, 0.04, 'square', 0.04); break;
      case 'ok': this.tone(76, 0.07, 'square', 0.08); this.tone(83, 0.1, 'square', 0.08, 0.07); break;
      case 'pop': this.tone(95, 0.06, 'triangle', 0.1, 0, 70); break;
      case 'bell': this.tone(88, 1.2, 'sine', 0.12); this.tone(95, 1.2, 'sine', 0.05, 0.02); break;
      case 'heart': this.tone(38, 0.1, 'sine', 0.3); this.tone(36, 0.12, 'sine', 0.25, 0.16); break;
      case 'slash': this.noise(0.18, 0.18); this.tone(100, 0.15, 'sawtooth', 0.08, 0, 60); break;
      case 'shatter': this.noise(0.5, 0.25); this.tone(96, 0.4, 'square', 0.06, 0, 50); break;
      case 'heal': [72, 76, 79, 84].forEach((m, i) => this.tone(m, 0.8, 'sine', 0.1, i * 0.12)); break;
      case 'wake': [60, 64, 67, 72].forEach((m, i) => this.tone(m, 0.6, 'triangle', 0.08, i * 0.2)); break;
    }
  },
  // BGM パターン
  patterns: {
    dream:     { bpm: 132, wave: 'sine',     vol: 0.10, seq: [69, null, 76, null, 72, null, 79, null, 71, null, 76, null, 72, null, 64, null], bass: [45, null, null, null, 40, null, null, null] },
    festival:  { bpm: 150, wave: 'triangle', vol: 0.10, seq: [69, 72, 76, 72, 79, 76, 72, 76, 71, 74, 79, 74, 81, 79, 76, 74], bass: [45, null, 45, null, 43, null, 43, null] },
    dusk:      { bpm: 110, wave: 'sine',     vol: 0.09, seq: [64, null, 69, null, 71, null, 67, null, 65, null, 64, null, 59, null, null, null], bass: [40, null, null, null, 38, null, null, null] },
    nightmare: { bpm: 96,  wave: 'sawtooth', vol: 0.05, seq: [44, null, 45, null, 44, null, 43, null, 44, null, 50, null, 44, null, 42, null], bass: [32, null, null, null, 31, null, null, null] },
    boss:      { bpm: 180, wave: 'square',   vol: 0.06, seq: [57, 57, 60, 57, 62, 57, 63, 62, 57, 57, 60, 57, 55, 57, 53, 55], bass: [33, 33, null, 33, 31, 31, null, 31] },
    heal:      { bpm: 100, wave: 'sine',     vol: 0.10, seq: [72, null, 76, 79, 84, null, 79, 76, 74, null, 77, 81, 86, null, 81, 77], bass: [48, null, null, null, 50, null, null, null] },
    hospital:  { bpm: 90,  wave: 'triangle', vol: 0.09, seq: [72, null, 74, null, 76, null, 79, null, 76, null, 74, null, 72, null, null, null], bass: [48, null, null, null, 43, null, null, null] },
  },
  bgm(name) {
    if (name === this.bgmName) return;
    this.bgmName = name;
    if (this.bgmTimer) { clearInterval(this.bgmTimer); this.bgmTimer = null; }
    if (!name) return;
    if (!this.ensure()) return;
    const p = this.patterns[name];
    this.bgmStep = 0;
    const beat = 60000 / p.bpm / 2; // 8分音符
    this.bgmTimer = setInterval(() => {
      if (this.bgmName !== name || !this.ac) return;
      const i = this.bgmStep++;
      const n = p.seq[i % p.seq.length];
      if (n != null) this.tone(n, beat / 1000 * 1.8, p.wave, p.vol);
      const b = p.bass[Math.floor(i / 2) % p.bass.length];
      if (b != null && i % 2 === 0) this.tone(b, beat / 1000 * 3, 'triangle', 0.08);
    }, beat);
  },
};

/* ---------------------------------------------------------
   入力
--------------------------------------------------------- */
const Key = { left: false, right: false, adv: false, up: false, down: false };
let advQueue = 0; // 決定ボタンのエッジ

function bindInput(cv) {
  addEventListener('keydown', e => {
    if (game.inputOpen) return; // 名前入力中はゲーム側で取らない
    if (e.repeat) return;
    if (['ArrowLeft', 'a', 'A'].includes(e.key)) Key.left = true;
    if (['ArrowRight', 'd', 'D'].includes(e.key)) Key.right = true;
    if (['ArrowUp', 'w', 'W'].includes(e.key)) { Key.up = true; moveChoice(-1); }
    if (['ArrowDown', 's', 'S'].includes(e.key)) { Key.down = true; moveChoice(1); }
    if (['z', 'Z', 'Enter', ' '].includes(e.key)) { advQueue++; Snd.ensure(); e.preventDefault(); }
    if (['m', 'M'].includes(e.key)) Snd.mute(!Snd.muted);
  });
  addEventListener('keyup', e => {
    if (['ArrowLeft', 'a', 'A'].includes(e.key)) Key.left = false;
    if (['ArrowRight', 'd', 'D'].includes(e.key)) Key.right = false;
    if (['ArrowUp', 'w', 'W'].includes(e.key)) Key.up = false;
    if (['ArrowDown', 's', 'S'].includes(e.key)) Key.down = false;
  });
  // フォーカスを失ったら移動キーを離した扱いにする
  addEventListener('blur', () => { Key.left = false; Key.right = false; });

  // 画面のどこをタップ／クリックしても「すすむ」。選択肢は直接タップでも選べる。
  const canvasPos = (cx, cy) => {
    const r = cv.getBoundingClientRect();
    return { x: (cx - r.left) / r.width * W, y: (cy - r.top) / r.height * H };
  };
  const tapAdvance = (cx, cy) => {
    if (game.inputOpen) return;
    Snd.ensure();
    if (game.choice) {
      const p = canvasPos(cx, cy);
      if (p.x >= 0 && p.x <= W && p.y >= 0 && p.y <= H) { pickChoiceAt(p); return; }
    }
    advQueue++;
  };
  const skipTarget = e => e.target && e.target.closest && e.target.closest('.tbtn, #nameOverlay');
  document.addEventListener('mousedown', e => {
    if (skipTarget(e)) return;
    tapAdvance(e.clientX, e.clientY);
  });
  document.addEventListener('touchstart', e => {
    if (skipTarget(e)) return;
    tapAdvance(e.touches[0].clientX, e.touches[0].clientY);
    e.preventDefault();
  }, { passive: false });

  // スマホ用ボタン（◀ ▶ ✦）：押している間だけ移動
  const hold = (id, on, off) => {
    const el = document.getElementById(id);
    if (!el) return;
    const start = e => {
      Snd.ensure();
      if (!game.inputOpen) on();
      e.preventDefault(); e.stopPropagation();
    };
    const end = e => {
      if (off) off();
      if (e && e.preventDefault) e.preventDefault();
    };
    el.addEventListener('touchstart', start, { passive: false });
    el.addEventListener('touchend', end, { passive: false });
    el.addEventListener('touchcancel', end, { passive: false });
    el.addEventListener('mousedown', start);
    el.addEventListener('mouseup', end);
    el.addEventListener('mouseleave', () => { if (off) off(); });
  };
  hold('padL', () => { Key.left = true; }, () => { Key.left = false; });
  hold('padR', () => { Key.right = true; }, () => { Key.right = false; });
  hold('btnA', () => { advQueue++; }, null);

  // タッチ端末ではメディアクエリに関係なくボタンを表示する
  if (typeof navigator !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    const ui = document.getElementById('touchUI');
    if (ui) ui.style.display = 'block';
  }
}

/* ---------------------------------------------------------
   ゲーム状態
--------------------------------------------------------- */
const game = {
  mode: 'title',          // title | play | fin
  t: 0,
  realName: '',           // ユーザーが入力した本名
  stack: [],              // スクリプト実行スタック [{list,pc,wait}]
  scene: 'prologue',
  worldW: W,
  cam: 0,
  actors: {},             // id -> {x, sprite, flip, visible, walk, bob, scale, glow}
  control: false,
  freeWait: null,
  dialog: null,           // {name,text,shown,color,thought}
  choice: null,           // {opts,idx}
  card: null, memory: null, chase: null,
  fade: 1, fadeTo: 1, fadeSpd: 0.02, fadeColor: '#000',
  flash: 0, flashColor: '#fff',
  shakeT: 0, shakeMag: 0,
  redness: 0,             // 悪夢の侵食度 0..1
  inputOpen: false,
  particles: [],
  bossFx: { halo: 0, thorns: 0, roses: 0 },
  hint: '',
};

function actor(id, props) {
  if (!game.actors[id]) game.actors[id] = { x: 0, sprite: null, flip: false, visible: false, walk: 0, scale: PX, yoff: 0 };
  Object.assign(game.actors[id], props);
  return game.actors[id];
}

/* ---------------------------------------------------------
   地面の高さ（シーン依存）
--------------------------------------------------------- */
function groundY(x) {
  if (game.scene === 'stairs') {
    const step = Math.max(0, Math.min(10, Math.floor((x - 560) / 90)));
    return GROUND - step * 13;
  }
  return GROUND;
}

/* ---------------------------------------------------------
   スクリプトエンジン
--------------------------------------------------------- */
function runScript(list) { game.stack = [{ list, pc: 0, wait: null }]; }

function pushSub(list) { game.stack.push({ list, pc: 0, wait: null }); }

function tickScript() {
  let guard = 0;
  while (game.stack.length && guard++ < 200) {
    const f = game.stack[game.stack.length - 1];
    if (f.wait) {
      if (updateWait(f.wait)) f.wait = null; else return;
    }
    if (f.pc >= f.list.length) { game.stack.pop(); continue; }
    const cmd = f.list[f.pc++];
    const w = execCmd(cmd);
    if (w) f.wait = w;
  }
}

function execCmd(cmd) {
  switch (cmd.c) {
    case 'scene': {
      game.scene = cmd.name;
      game.worldW = cmd.w || W;
      game.particles = [];
      if (cmd.cam != null) game.cam = cmd.cam;
      if (cmd.clear) game.actors = {};
      return null;
    }
    case 'actor': actor(cmd.id, cmd.set); return null;
    case 'bgm': Snd.bgm(cmd.name); return null;
    case 'sfx': Snd.sfx(cmd.name); return null;
    case 'red': game.redness = cmd.v; return null;
    case 'hint': game.hint = cmd.t || ''; return null;
    case 'flag': game[cmd.k] = cmd.v; return null;
    case 'fade': {
      game.fadeTo = cmd.to;
      game.fadeSpd = 1 / (cmd.t || 40);
      game.fadeColor = cmd.color || '#000';
      return { type: 'fade' };
    }
    case 'wait': return { type: 'time', t: cmd.t };
    case 'say': {
      game.dialog = { name: cmd.n || '', text: fmt(cmd.t), shown: 0, thought: !cmd.n, color: cmd.color || nameColor(cmd.n) };
      return { type: 'say' };
    }
    case 'card': {
      game.card = { text: cmd.t, sub: cmd.sub || '', a: 0, phase: 0 };
      return { type: 'card' };
    }
    case 'input': {
      openNameInput(cmd.prompt, cmd.store || 'realName');
      return { type: 'input' };
    }
    case 'walk': {
      const a = game.actors[cmd.id];
      a.visible = true;
      return { type: 'walk', id: cmd.id, to: cmd.to, spd: cmd.spd || 1.6 };
    }
    case 'free': {
      game.control = true;
      game.hint = cmd.hint || '';
      return { type: 'free', until: cmd.until, triggers: (cmd.triggers || []).map(t => ({ ...t, fired: false })) };
    }
    case 'flash': {
      game.flash = 1; game.flashColor = cmd.color || '#fff';
      Snd.sfx(cmd.sfx || 'shatter');
      return { type: 'time', t: cmd.t || 20 };
    }
    case 'shake': { game.shakeT = cmd.t || 30; game.shakeMag = cmd.mag || 4; return null; }
    case 'memory': {
      game.memory = { lines: cmd.lines.map(fmt), idx: 0, shown: 0 };
      Snd.bgm(null); Snd.sfx('heart');
      return { type: 'memory' };
    }
    case 'choice': {
      game.choice = { opts: cmd.opts, idx: 0 };
      return { type: 'choice' };
    }
    case 'chase': {
      game.chase = { caught: false, done: false, whisperT: 0, whisper: '', hb: 0 };
      actor('player', { x: 160, visible: true, flip: false });
      actor('mother', { x: 10, visible: true, sprite: 'mother', flip: false });
      game.control = false;
      game.hint = '→キー／▶ボタン おしっぱなしで にげろ！';
      return { type: 'chase' };
    }
    case 'bossfx': Object.assign(game.bossFx, cmd.set); return null;
    case 'fin': { game.mode = 'fin'; game.finT = 0; return { type: 'forever' }; }
  }
  return null;
}

function updateWait(w) {
  switch (w.type) {
    case 'time': return --w.t <= 0;
    case 'fade': return Math.abs(game.fade - game.fadeTo) < 0.001;
    case 'say': {
      const d = game.dialog;
      d.shown = Math.min(d.text.length, d.shown + 0.55);
      if (advQueue > 0) {
        advQueue--;
        if (d.shown < d.text.length) { d.shown = d.text.length; }
        else { game.dialog = null; Snd.sfx('ok'); return true; }
      }
      if (Math.floor(d.shown) % 6 === 0 && d.shown < d.text.length) Snd.sfx('blip');
      return false;
    }
    case 'card': {
      const c = game.card;
      if (c.phase === 0) { c.a += 0.02; if (c.a >= 1) { c.a = 1; c.phase = 1; c.t = 70; } }
      else if (c.phase === 1) { if (--c.t <= 0 || advQueue > 0) { if (advQueue > 0) advQueue--; c.phase = 2; } }
      else { c.a -= 0.03; if (c.a <= 0) { game.card = null; return true; } }
      return false;
    }
    case 'input': return !game.inputOpen;
    case 'walk': {
      const a = game.actors[w.id];
      const dx = w.to - a.x;
      if (Math.abs(dx) <= w.spd) { a.x = w.to; a.walk = 0; return true; }
      a.x += Math.sign(dx) * w.spd;
      a.flip = dx < 0;
      a.walk += 0.18;
      return false;
    }
    case 'free': {
      const p = game.actors.player;
      for (const tr of w.triggers) {
        if (!tr.fired && p.x >= tr.x) {
          tr.fired = true;
          game.control = false;
          pushSub(tr.run.concat([{ c: 'flag', k: 'control', v: true }]));
          return false;
        }
      }
      if (p.x >= w.until) { game.control = false; game.hint = ''; return true; }
      return false;
    }
    case 'memory': {
      const m = game.memory;
      m.shown = Math.min(m.lines[m.idx].length, m.shown + 0.4);
      if (advQueue > 0) {
        advQueue--;
        if (m.shown < m.lines[m.idx].length) m.shown = m.lines[m.idx].length;
        else {
          m.idx++; m.shown = 0; Snd.sfx('heart');
          if (m.idx >= m.lines.length) { game.memory = null; return true; }
        }
      }
      return false;
    }
    case 'choice': {
      if (advQueue > 0) {
        advQueue--;
        const o = game.choice.opts[game.choice.idx];
        game.choice = null; Snd.sfx('ok');
        if (o.run) pushSub(o.run);
        return true;
      }
      return false;
    }
    case 'chase': return updateChase();
    case 'forever': return false;
  }
  return true;
}

function moveChoice(d) {
  if (!game.choice) return;
  const n = game.choice.opts.length;
  game.choice.idx = (game.choice.idx + d + n) % n;
  Snd.sfx('blip');
}
function pickChoiceAt(p) {
  if (!game.choice) return;
  const n = game.choice.opts.length;
  const y0 = H - 70 - n * 26;
  const i = Math.floor((p.y - y0) / 26);
  if (i >= 0 && i < n) { game.choice.idx = i; advQueue++; }
}

function fmt(s) { return s.replace(/\{name\}/g, game.realName || 'ひかり'); }
function nameColor(n) {
  switch (n) {
    case 'ななし': return '#cdc3e8';
    case '幽世': return '#9f86d8';
    case '名無死': return '#ff5fd0';
    case '大国主': return '#e8c87a';
    case '母': return '#c03a4a';
    case '声': return '#c03a4a';
    case '恋人': return '#8fb7e8';
    default: return '#cfd2dc';
  }
}

/* ---------------------------------------------------------
   チェイス（母の追跡）
--------------------------------------------------------- */
function updateChase() {
  const ch = game.chase, p = game.actors.player, m = game.actors.mother;
  if (ch.done) { game.chase = null; game.hint = ''; return true; }
  // プレイヤー
  if (Key.right) { p.x += 3.1; p.walk += 0.3; p.flip = false; }
  else if (Key.left) { p.x = Math.max(m.x + 30, p.x - 1.5); p.walk += 0.2; p.flip = true; }
  // 母（止まると一気に迫る）
  m.x += Key.right ? 2.55 : 4.2;
  m.walk += 0.25;
  // 鼓動
  if (--ch.hb <= 0) { Snd.sfx('heart'); ch.hb = 36; }
  // ささやき
  if (--ch.whisperT <= 0) {
    const ws = ['まって', 'どこへいくの', 'あんたのせいで', 'にげるの？', 'ころして…あげる', 'いっしょに、しのうね'];
    ch.whisper = ws[Math.floor(Math.random() * ws.length)];
    ch.whisperT = 80;
  }
  game.shakeT = 2; game.shakeMag = 2;
  if (m.x >= p.x - 26 || p.x >= game.worldW - 60) {
    ch.done = true; ch.caught = true;
    p.x = Math.min(p.x, game.worldW - 60);
    m.x = p.x - 30;
  }
  return false;
}

/* ---------------------------------------------------------
   名前入力（DOMオーバーレイ・IME対応）
--------------------------------------------------------- */
function openNameInput(prompt, store) {
  game.inputOpen = true;
  const wrap = document.getElementById('nameOverlay');
  const label = document.getElementById('namePrompt');
  const input = document.getElementById('nameInput');
  const btn = document.getElementById('nameBtn');
  label.textContent = prompt;
  input.value = '';
  wrap.style.display = 'flex';
  setTimeout(() => input.focus(), 50);
  const submit = () => {
    let v = input.value.trim().slice(0, 8);
    if (store === 'realName' && !v) v = 'ひかり';
    game[store] = v;
    wrap.style.display = 'none';
    game.inputOpen = false;
    btn.removeEventListener('click', submit);
    input.removeEventListener('keydown', onKey);
    Snd.sfx('ok');
  };
  const onKey = e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } e.stopPropagation(); };
  btn.addEventListener('click', submit);
  input.addEventListener('keydown', onKey);
}

/* =========================================================
   シナリオ
   ========================================================= */
function buildScript() {
  const N = 'ななし', K = '幽世', O = '大国主';
  return [
    /* ---------- 序：白い部屋 ---------- */
    { c: 'scene', name: 'prologue', clear: true },
    { c: 'bgm', name: null },
    { c: 'fade', to: 0, t: 60 },
    { c: 'say', t: '……ピッ……ピッ……と、機械の音がする。' },
    { c: 'say', t: '遠くで、誰かが泣いている。' },
    { c: 'say', n: '？？？', t: '「——さん。——さん、聞こえますか」' },
    { c: 'say', n: '？？？', t: '「あなたの、お名前は？」' },
    { c: 'input', prompt: 'あなたの ほんとうの なまえは？' },
    { c: 'say', t: '（{name}。わたしの、なまえ。……そのはず、なのに）' },
    { c: 'say', t: '（とても、とおい。じぶんの名前なのに、ひとごとみたい）' },
    { c: 'say', t: '（……かえりたく、ない）' },
    { c: 'say', t: '音が、とおざかる。ふかく、ふかく、しずんでいく——' },
    { c: 'fade', to: 1, t: 60 },
    { c: 'wait', t: 30 },

    /* ---------- 一ノ祀：月隠れの町 ---------- */
    { c: 'card', t: '一ノ祀', sub: '月隠れの町' },
    { c: 'scene', name: 'town', w: 1600, clear: true, cam: 0 },
    { c: 'actor', id: 'player', set: { x: 90, sprite: 'nanashi', visible: true } },
    { c: 'bgm', name: 'dream' },
    { c: 'fade', to: 0, t: 80 },
    { c: 'say', t: '（……つめたい。石畳の、うえ？）' },
    { c: 'say', t: '（よる。提灯。桜のはなびら。——しらない町）' },
    { c: 'say', t: '（だれも、いない）' },
    { c: 'say', t: '（…………よかった）' },
    { c: 'free', until: 480, hint: '←→キー／◀▶ボタンで あるく' },
    { c: 'say', t: '（お祭り、みたいなのに。屋台にも、だれもいない）' },
    { c: 'say', t: '（しずかで、やさしい夜。ずっとこんな場所を、さがしてた気がする）' },
    { c: 'free', until: 760 },
    // 幽世 登場
    { c: 'actor', id: 'kakuriyo', set: { x: 900, sprite: 'kakuriyo', visible: true, flip: true } },
    { c: 'say', t: '（——ひと？）' },
    { c: 'say', t: '（こわい。にげなきゃ。……でも）' },
    { c: 'say', t: '（あのひとの周りだけ、夜が、しずかに澄んでる）' },
    { c: 'walk', id: 'player', to: 830 },
    { c: 'say', n: '？？？', t: '「おお。今宵の夢祀りに、迷い子とは珍しい」' },
    { c: 'say', n: '？？？', t: '「我は幽世。大した者ではない。貴殿は、名を何と申すか」' },
    { c: 'say', t: '（こたえようとした。たしかに、声にしたはずだった）' },
    { c: 'say', t: 'けれど その音は、口にした端から、夜気にとけて消えてしまった。' },
    { c: 'say', n: N, t: '「……っ……。…………」' },
    { c: 'say', n: K, t: '「……名が、届かぬか。ふむ」' },
    { c: 'say', n: K, t: '「ならば——〝ななし〟。そう呼ばせてもらうぞ、ななし」' },
    { c: 'say', n: N, t: '「…………」' },
    { c: 'say', t: '（へんなひと。……でも、ふしぎと、こわくない）' },
    { c: 'say', n: K, t: '「今宵は朧月夜。この町では〝夢祀り〟と申してな、年に一度、灯だけの祭が立つのだ」' },
    { c: 'say', n: K, t: '「我もちょうど夜歩きの途中。なに、行き先は同じよ。共に参ろう」' },

    // 死亡フラグ其の一：古井戸
    { c: 'free', until: 1080, triggers: [
      { x: 1010, run: [
        { c: 'say', t: '（……みず、のみたい……）' },
        { c: 'say', n: '？？？', t: '『……こっち……いどの みず、つめたくて きもちいいよ……』' },
        { c: 'say', t: '（井戸の底から、よんでる。のぞきこめば、きっと——）' },
        { c: 'walk', id: 'player', to: 1060, spd: 0.8 },
        { c: 'actor', id: 'kakuriyo', set: { visible: true } },
        { c: 'walk', id: 'kakuriyo', to: 1085, spd: 3.2 },
        { c: 'say', n: K, t: '「ああ、ななし。その井戸はやめておけ。古い水の匂いがする」' },
        { c: 'say', n: K, t: '「月見の水なら、社の手水のほうがずっと旨い。……それより、ほら」' },
        { c: 'sfx', name: 'pop' },
        { c: 'say', n: K, t: '「あちらの屋台から、飴の匂いがせぬか」' },
        { c: 'say', t: '（いわれてみれば、あまい匂い。……井戸のこと、もう忘れてた）' },
        // 記憶のかけら 其の一
        { c: 'flash', color: '#fff', t: 14, sfx: 'bell' },
        { c: 'memory', lines: [
          'つめたい みず。ふろばの、つめたい みず。',
          '97てんの テストようしが、ぬれて やぶれていく。',
          '『理科97点？　英語は？』',
          '『全部平均できなかったら、人間のクズだわ』',
          '『1教科やるなら、誰にでもできるわ』',
          '『数学90点？　また？　他は？』',
          'なんてんを とれば、クズじゃなく なれたんだろう。',
        ] },
        { c: 'say', n: N, t: '「……っ」' },
        { c: 'say', n: K, t: '「どうした、ななし」' },
        { c: 'say', n: N, t: '「……ううん。なんでも、ない」' },
      ] },
    ] },
    { c: 'fade', to: 1, t: 40 },

    /* ---------- 二ノ祀：灯らぬ祭 ---------- */
    { c: 'card', t: '二ノ祀', sub: '灯らぬ祭' },
    { c: 'scene', name: 'festival', w: 1500, clear: true, cam: 0 },
    { c: 'actor', id: 'player', set: { x: 90, sprite: 'nanashi', visible: true, flip: false } },
    { c: 'actor', id: 'kakuriyo', set: { x: 150, sprite: 'kakuriyo', visible: true, flip: false } },
    { c: 'bgm', name: 'festival' },
    { c: 'fade', to: 0, t: 60 },
    { c: 'say', n: K, t: '「祭の通りだ。売り子はおらぬが、品はある。夢祀りとはそういうものでな」' },
    { c: 'say', t: '（だれもいないお祭り。……わたしのための、お祭りみたい）' },
    { c: 'free', until: 620, triggers: [
      { x: 540, run: [
        { c: 'say', t: '（りんご飴のお店。ひとつだけ、のこってる）' },
        { c: 'say', t: '（——きれい。血みたいに、あかい）' },
        { c: 'say', n: '？？？', t: '『たべて……あまいよ……たべたら、ずっと ここに いられるよ……』' },
        { c: 'walk', id: 'player', to: 575, spd: 0.8 },
        { c: 'walk', id: 'kakuriyo', to: 600, spd: 3.4 },
        { c: 'say', n: K, t: '「待たれよ、ななし」' },
        { c: 'say', n: K, t: '「……ふむ。売り物にしては、いささか出来が良すぎる。毒見と参ろう」' },
        { c: 'say', t: 'そう言って幽世は、ひょいと飴をつまんで、かじった。' },
        { c: 'sfx', name: 'pop' },
        { c: 'say', n: K, t: '「————渋いな。これは外れだ。やめておけ」' },
        { c: 'say', n: K, t: '「ほれ、代わりに金平糖をやろう。こちらは当たりの味がする」' },
        { c: 'say', t: '（てのひらに、ちいさな星みたいな金平糖。……くちにいれると）' },
        { c: 'say', t: '（あまい。なんだか、なつかしい——）' },
        // 記憶のかけら 其の二
        { c: 'flash', color: '#fff', t: 14, sfx: 'bell' },
        { c: 'memory', lines: [
          'きょうしつの すみ。ひとりで たべる パン。',
          '『お前、友達いないんか』',
          '『そうだよな、お前みたいな奴、友達いないわな』',
          '『あの子も虐待されてるけど、あの子は良い子だ』',
          '『お前は、悪い子だ』',
          'わるいこ。わるいこは、わたし。',
        ] },
        { c: 'say', n: N, t: '「……っ、……」' },
        { c: 'say', t: '（ゆびさきが、ふるえてる。どうして？　ここは、こんなにしずかなのに）' },
        { c: 'say', n: K, t: '「……ななし。寒いか」' },
        { c: 'say', n: N, t: '「…………すこし」' },
        { c: 'say', n: K, t: '「ならば歩こう。体があたたまる。……社はもう、すぐそこだ」' },
      ] },
    ] },
    { c: 'say', t: '（空のはしが、すこしだけ——あかい？）' },
    { c: 'red', v: 0.15 },
    { c: 'free', until: 1320 },
    { c: 'fade', to: 1, t: 40 },

    /* ---------- 三ノ祀：誰そ彼の社 ---------- */
    { c: 'card', t: '三ノ祀', sub: '誰そ彼の社' },
    { c: 'scene', name: 'stairs', w: 1700, clear: true, cam: 0 },
    { c: 'actor', id: 'player', set: { x: 90, sprite: 'nanashi', visible: true, flip: false } },
    { c: 'actor', id: 'kakuriyo', set: { x: 150, sprite: 'kakuriyo', visible: true, flip: false } },
    { c: 'bgm', name: 'dusk' },
    { c: 'red', v: 0.2 },
    { c: 'fade', to: 0, t: 60 },
    { c: 'say', n: K, t: '「この石段の上が社だ。夢祀りの灯は、あそこで納める」' },
    { c: 'free', until: 700, triggers: [
      { x: 620, run: [
        { c: 'say', t: '（石段のわき、やぶの中に、ほそい近道がある）' },
        { c: 'say', n: '？？？', t: '『こっち……ちかみち……らくだよ……くらいほうへ……』' },
        { c: 'say', t: '（やみの中から、しろい手が、まねいてる——）' },
        { c: 'walk', id: 'kakuriyo', to: 660, spd: 3.0 },
        { c: 'say', n: K, t: '「ななし、石段は左側を登るのが作法でな」' },
        { c: 'say', n: K, t: '「神前の作法よ。我の隣を歩くがいい」' },
        { c: 'sfx', name: 'pop' },
        { c: 'say', t: '（幽世がわたしと藪のあいだに立つと、しろい手は、すうっと闇にひっこんだ）' },
        { c: 'say', t: '（……いまのは、なんだったんだろう。まあ、いいか）' },
      ] },
    ], hint: '石段を のぼろう' },
    { c: 'walk', id: 'kakuriyo', to: 1380, spd: 3.2 },
    { c: 'free', until: 1400 },
    // 社の上での対話
    { c: 'say', n: K, t: '「着いたぞ。……ここからは、町がよく見える」' },
    { c: 'say', t: '（眼下に、灯のともった夜の町。だれもいない、わたしだけの町）' },
    { c: 'say', n: K, t: '「ななし。この町を、どう思う」' },
    { c: 'say', n: N, t: '「……しずか。だれも、いない」' },
    { c: 'say', n: N, t: '「……すき、かも」' },
    { c: 'say', n: K, t: '「……そうか」' },
    { c: 'say', n: K, t: '「——ななし。帰りたい場所は、あるか」' },
    { c: 'choice', opts: [
      { t: '「ない」' },
      { t: '「……わからない」' },
    ] },
    { c: 'say', n: N, t: '「……かえりたく、ない。ずっと、ここにいたい」' },
    { c: 'say', n: K, t: '「…………」' },
    { c: 'say', t: '幽世は何も言わず、ただ朧の月を見ていた。' },
    // 記憶のかけら 其の三
    { c: 'flash', color: '#fff', t: 14, sfx: 'bell' },
    { c: 'memory', lines: [
      'なつなのに、ながそで。',
      'アザは、かくさなきゃ いけないから。',
      '『愛がある暴力は、暴力じゃない』',
      '『母親に歯向かうなんて、お前は人として最低だ』',
      '『刃向かったと知られたら、お前のまわりから人がいなくなるぞ』',
      'だから——だれにも、いえなかった。',
    ] },
    { c: 'red', v: 0.45 },
    { c: 'shake', t: 30, mag: 3 },
    { c: 'say', n: N, t: '「……ぁ……」' },
    { c: 'say', t: '（そらが、あかい。提灯のひかりが、ちかちかと、悲鳴みたいに点滅してる）' },
    { c: 'say', n: K, t: '「————来たか。今宵は、ずいぶんと気が早い」' },
    { c: 'say', n: K, t: '「ななし、我から離れるな。……夢祀りの仕舞いだ」' },
    { c: 'fade', to: 1, t: 30 },

    /* ---------- 四ノ祀：夢、醒め ---------- */
    { c: 'card', t: '四ノ祀', sub: '夢、醒め' },
    { c: 'scene', name: 'nightmare', w: 1700, clear: true, cam: 0 },
    { c: 'actor', id: 'player', set: { x: 160, sprite: 'nanashi', visible: true, flip: false } },
    { c: 'bgm', name: 'nightmare' },
    { c: 'red', v: 0.8 },
    { c: 'fade', to: 0, t: 40 },
    { c: 'say', t: '（——町が、こわれていく）' },
    { c: 'say', t: '（提灯は割れ、桜は黒ずみ、ささやき声が、そこらじゅうから）' },
    { c: 'say', n: '？？？', t: '『いたい』『さむい』『ごめんなさい』『ごめんなさい』『ごめんなさい』——' },
    { c: 'say', t: '（ゆうせい……ううん、幽世は？　どこ？　すがたが、みえない）' },
    { c: 'wait', t: 20 },
    { c: 'sfx', name: 'heart' },
    { c: 'say', n: '？？？', t: '『みィ……つけた』' },
    { c: 'say', t: '（ふりむいた さきに——ほうちょうを にぎった、おかあさんが、いた）' },
    { c: 'say', n: '母', t: '『どこへ いくの。ねえ。どこへも いかせない』' },
    { c: 'chase' },
    // 追い詰められる
    { c: 'say', t: '（いきどまり——！）' },
    { c: 'say', n: '母', t: '『あんたの せいで。あんたさえ いなければ』' },
    { c: 'say', n: '母', t: '『お前を殺して——私も、死ぬから』' },
    { c: 'flash', color: '#fff', t: 20, sfx: 'shatter' },
    { c: 'memory', lines: [
      'だいどころ。ひかる、ほうちょう。',
      'はだしで にげた、よるの どうろ。',
      '『お前を殺して、私も死ぬ』',
      '——あれは、ゆめじゃ ない。',
      'ほんとうに、あったこと。',
      'わたしが わすれたかった、ぜんぶ。',
    ] },
    { c: 'shake', t: 60, mag: 5 },
    { c: 'say', n: N, t: '「あ……ああ……」' },
    { c: 'say', n: N, t: '「イヤダ。イヤダ。カエリタクナイ」' },
    { c: 'say', n: N, t: '「カエリタクナイ カエリタクナイ カエリタクナイ カエリタクナイ——」' },
    { c: 'flash', color: '#1a0a14', t: 30, sfx: 'shatter' },
    { c: 'say', t: 'ななしの輪郭が、夜に、にじんで、ほどけて——' },
    { c: 'fade', to: 1, t: 20, color: '#000' },

    /* ---------- 終ノ祀：名無死 ---------- */
    { c: 'card', t: '終ノ祀', sub: '名無死' },
    { c: 'scene', name: 'void', w: W, clear: true, cam: 0 },
    { c: 'bgm', name: 'boss' },
    { c: 'red', v: 0 },
    { c: 'actor', id: 'boss', set: { x: 420, sprite: 'nanashinu', visible: true, scale: 4, yoff: -60, flip: false } },
    { c: 'actor', id: 'kakuriyo', set: { x: 130, sprite: 'kakuriyo', visible: true, flip: false } },
    { c: 'bossfx', set: { halo: 1, thorns: 1 } },
    { c: 'fade', to: 0, t: 40 },
    { c: 'say', n: '名無死', t: '『カエリタクナイ。ダレモ コナイデ。ナマエナンテ イラナイ』' },
    { c: 'say', n: '名無死', t: '『ワタシハ ココデ シヌ。ユメノナカデ シヌ。ソレダケガ ノゾミ』' },
    { c: 'say', n: K, t: '「————名を亡くした死、か。憐れな」' },
    { c: 'say', n: K, t: '「黙っていてすまなかったな、ななし。我の名は幽世——」' },
    { c: 'say', n: K, t: '「〝幽冥主宰大神〟。黄泉路を統べ、迷い子を渡す者なり」' },
    { c: 'say', n: K, t: '「貴殿の死出の路は、何度も塞がせてもらった。井戸も、飴も、藪の手も——な」' },
    { c: 'say', n: '名無死', t: '『ジャマヲ シタノハ オマエカ。シナセテ。シナセテ。シナセテヨォ……！』' },
    { c: 'say', n: K, t: '「させぬ。……御免」' },
    { c: 'flash', color: '#fff', t: 10, sfx: 'slash' },
    { c: 'shake', t: 20, mag: 6 },
    { c: 'flash', color: '#fff', t: 10, sfx: 'slash' },
    { c: 'shake', t: 20, mag: 6 },
    { c: 'bossfx', set: { thorns: 0 } },
    { c: 'say', t: '光の太刀が、棘の闇を薙ぎはらう。名無死は、くずおれ——' },
    { c: 'say', t: '——そして、また、立ちあがる。' },
    { c: 'bossfx', set: { thorns: 1 } },
    { c: 'say', n: '名無死', t: '『カエリタクナイ カエリタクナイ カエリタクナイ カエリタクナイ』' },
    { c: 'flash', color: '#fff', t: 10, sfx: 'slash' },
    { c: 'shake', t: 20, mag: 6 },
    { c: 'say', t: '怨念のなかから、声が、あふれだす。——ぜんぶ、聞きおぼえのある、声だ。' },
    { c: 'say', n: '声', t: '『お前、悲劇のヒロインだな』' },
    { c: 'say', n: '声', t: '『被害者ぶってるけど、私も殴られたからな』' },
    { c: 'say', n: '声', t: '『お前、まだ過去のこと言ってるんか』' },
    { c: 'say', n: '声', t: '『愛がある暴力は、暴力じゃない』' },
    { c: 'say', t: '幾度斬っても、怨念は際限なく湧きあがる。' },
    { c: 'say', n: K, t: '「……斬っても斬っても、きりがない。これは怨念ではない——」' },
    { c: 'say', n: K, t: '「〝願い〟だ。願いは、刃では断てぬ」' },
    { c: 'say', n: K, t: '「……はぁ。」' },
    { c: 'say', n: K, t: '「いやだなぁ…この姿、見せたくなかったんだけどねェ…」' },
    { c: 'bgm', name: null },
    { c: 'wait', t: 30 },
    { c: 'sfx', name: 'heal' },
    { c: 'fade', to: 1, t: 50, color: '#fff' },
    { c: 'actor', id: 'kakuriyo', set: { visible: false } },
    { c: 'actor', id: 'okuni', set: { x: 130, sprite: 'okuninushi', visible: true, flip: false } },
    { c: 'bgm', name: 'heal' },
    { c: 'fade', to: 0, t: 50, color: '#fff' },
    { c: 'say', t: '白銀の髪も黒い装束もほどけて——そこに立っていたのは、ふくよかで、あたたかな御仁。' },
    { c: 'say', n: O, t: '「やぁ。僕は大国主。出雲の、縁むすびの神さま」' },
    { c: 'say', n: O, t: '「はじめまして——いや、ずっと隣を歩いてたから、はじめましてでも、ないか。ね、ななしちゃん」' },
    { c: 'say', n: '名無死', t: '『チカヨルナ。カエラナイ。ワタシニハ ナニモナイ。ナマエモ ナイ』' },
    { c: 'say', n: O, t: '「名前がない、か。たしかに夢のなかの君は、ななしちゃんだった。……でもね、あるんだよ」' },
    { c: 'say', n: O, t: '「{name}ちゃん」' },
    { c: 'say', t: 'その名を呼ばれた瞬間、棘の闇が、びくりと、ふるえた。' },
    { c: 'say', n: O, t: '「君を、取り戻す為に。『助けてほしい』と祈る、君の恋人の為に」' },
    { c: 'say', n: O, t: '「来たんだけどなぁ……僕は！」' },
    { c: 'sfx', name: 'heal' },
    { c: 'bossfx', set: { roses: 1 } },
    { c: 'say', t: 'のばされた手から、あたたかな光。棘がほどけ、ひとつ、またひとつ、花にかわる。' },
    { c: 'say', n: '名無死', t: '『イヤダ……カエッタラ、マタ イタイ。マタ コワイ。マタ——』' },
    { c: 'say', n: O, t: '「うん。こわかったね。いたかったね。……ぜんぶ、ほんとうに、あったことだ」' },
    { c: 'say', n: O, t: '「ねえ、ななしちゃん。『愛がある暴力は、暴力じゃない』——あれは、ぜんぶ嘘だ」' },
    { c: 'say', n: O, t: '「愛があってもなくても、暴力は暴力だ。痛かったものは、痛かったんだ」' },
    { c: 'say', n: O, t: '「97点は、すごい。クズなんかじゃ、ぜんぜんない。ひとりで食べたパンの分まで、君はえらかった」' },
    { c: 'say', n: O, t: '「君は、悪い子じゃなかった。ただの一度も、だ。それだけは、神さまの僕が保証する」' },
    { c: 'say', n: O, t: '「それにね——もう、あの人の手は届かない。君はもう、大人になったんだから」' },
    { c: 'say', n: O, t: '「そして今は、君の名前を呼んで、泣いてるひとがいる。一週間も、ずっと、そばで」' },
    { c: 'choice', opts: [
      { t: '「……ほんとう？」' },
      { t: '「……こわい」' },
    ] },
    { c: 'say', n: O, t: '「ほんとうとも。神さまは、嘘がへたなんだ」' },
    { c: 'bossfx', set: { thorns: 0, halo: 0 } },
    { c: 'actor', id: 'boss', set: { visible: false } },
    { c: 'actor', id: 'nanashi2', set: { x: 430, sprite: 'nanashi', visible: true, flip: true } },
    { c: 'say', t: '黒い帳がほどけて、麦わら帽子の女の子が、ぽつんと、たちつくしていた。' },
    { c: 'say', n: N, t: '「……ゆめ、おわるの？」' },
    { c: 'say', n: O, t: '「うん。——おはようの、時間だ」' },
    { c: 'say', n: O, t: '「夢のことは、ぜんぶ忘れていい。ただ、よく眠れた朝みたいに、すこしだけ軽くなってるはずだよ」' },
    { c: 'say', n: O, t: '「いっておいで、{name}ちゃん。——縁は、むすんでおいたから」' },
    { c: 'sfx', name: 'wake' },
    { c: 'fade', to: 1, t: 120, color: '#fff' },
    { c: 'wait', t: 40 },

    /* ---------- 暁：ただいま ---------- */
    { c: 'card', t: '暁', sub: 'ただいま' },
    { c: 'scene', name: 'hospital', w: W, clear: true, cam: 0 },
    { c: 'bgm', name: 'hospital' },
    { c: 'actor', id: 'me', set: { x: 360, sprite: 'watashi', visible: false } },
    { c: 'actor', id: 'lover', set: { x: 250, sprite: 'koibito', visible: true, flip: false } },
    { c: 'fade', to: 0, t: 100, color: '#fff' },
    { c: 'say', t: '……ピッ……ピッ……と、機械の音。' },
    { c: 'say', t: 'しろい てんじょう。あさの ひかり。くすりの においが、すこし。' },
    { c: 'say', t: '（ゆび が、うごく。からだが、おもい。……どれくらい、ねてたんだろう）' },
    { c: 'say', n: '恋人', t: '「————{name}！？」' },
    { c: 'say', n: '恋人', t: '「{name}……！　よかった……よかった……っ」' },
    { c: 'say', t: 'ベッドのよこで、ずっと待っていたらしいそのひとは、泣きながら、わたしを抱きしめた。' },
    { c: 'say', n: '医師', t: '「過去の記憶のフラッシュバックによる失神——そのまま一週間、目を覚まされませんでした」' },
    { c: 'say', n: '医師', t: '「ですがもう、大丈夫。ゆっくり、休んでいきましょう。……これからは、ひとりで抱えこまずに、ね」' },
    { c: 'say', t: '（ながい、ながい ゆめを みていた きがする）' },
    { c: 'say', t: '（おまつりの夜を、だれかと、ずっと あるいてた ような——）' },
    { c: 'say', t: '（……おもいだせない。でも、むねの おくが、ふしぎと かるい）' },
    { c: 'say', t: '窓のそとで、桜のはなびらが、ひとひら。' },
    { c: 'say', t: 'わたしは、{name}。なまえを よんで、ないてくれる ひとが いる。' },
    { c: 'say', t: 'だから、ちゃんと いおう。' },
    { c: 'wait', t: 30 },
    { c: 'say', n: '{name}', t: '「————ただいま」', color: '#e8c87a' },
    { c: 'bgm', name: null },
    { c: 'sfx', name: 'bell' },
    { c: 'fade', to: 1, t: 140, color: '#fff' },
    { c: 'fin' },
  ];
}

/* =========================================================
   描画
   ========================================================= */
let cv, ctx;

function pr(x, y, w, h, col) { ctx.fillStyle = col; ctx.fillRect(Math.round(x), Math.round(y), w, h); }

function drawSprite(name, x, y, flip, scale, frame) {
  const rows = SPR[name];
  if (!rows) return;
  const s = scale || PX;
  const w = rows[0].length;
  for (let r = 0; r < rows.length; r++) {
    const line = rows[r];
    for (let c = 0; c < w; c++) {
      const ch = line[flip ? w - 1 - c : c];
      if (ch === '.') continue;
      pr(x + c * s, y + r * s, s, s, PAL[ch]);
    }
  }
}

function drawActor(a, id) {
  if (!a.visible || !a.sprite) return;
  const rows = SPR[a.sprite];
  const s = a.scale || PX;
  const h = rows.length * s, w = rows[0].length * s;
  let spriteName = a.sprite;
  if (a.sprite === 'nanashi' && Math.floor(a.walk * 2) % 2 === 1) spriteName = 'nanashiWalk';
  const gy = (id === 'boss') ? GROUND : groundY(a.x + w / 2);
  let bob = 0;
  if (id === 'boss') bob = Math.sin(game.t * 0.05) * 6;
  const sx = a.x - game.cam, sy = gy - h + (a.yoff || 0) + bob;
  // ボスの後光・棘
  if (id === 'boss' && game.bossFx.halo) {
    const cx = sx + w / 2, cyy = sy + 30;
    ctx.strokeStyle = 'rgba(170,80,220,' + (0.5 + Math.sin(game.t * 0.1) * 0.2) + ')';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cyy, 56, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const an = i / 12 * Math.PI * 2 + game.t * 0.01;
      pr(cx + Math.cos(an) * 64 - 2, cyy + Math.sin(an) * 64 - 2, 4, 8, '#7a3fb0');
    }
  }
  if (id === 'boss' && game.bossFx.thorns) {
    ctx.strokeStyle = '#4a4540'; ctx.lineWidth = 4;
    for (let i = 0; i < 5; i++) {
      const an = game.t * 0.008 + i * 1.4;
      const cx = sx + w / 2, cyy = sy + h / 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(an) * 40, cyy + Math.sin(an) * 30);
      ctx.lineTo(cx + Math.cos(an + 0.5) * 95, cyy + Math.sin(an + 0.5) * 70);
      ctx.stroke();
    }
  }
  drawSprite(spriteName, sx, sy, a.flip, s);
  if (id === 'boss' && game.bossFx.roses) {
    for (let i = 0; i < 6; i++) {
      const an = i * 1.05 + game.t * 0.02;
      pr(sx + w / 2 + Math.cos(an) * 70, sy + h / 2 + Math.sin(an) * 50, 6, 6, '#c95a7a');
      pr(sx + w / 2 + Math.cos(an) * 70 + 2, sy + h / 2 + Math.sin(an) * 50 - 3, 3, 3, '#e8a8c0');
    }
  }
}

/* ----- 背景部品 ----- */
function bgSky(top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top); g.addColorStop(1, bottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function bgMoon(x, y, r) {
  for (let dy = -r; dy <= r; dy += 2) {
    const w2 = Math.floor(Math.sqrt(r * r - dy * dy));
    pr(x - w2, y + dy, w2 * 2, 2, '#e8e4da');
  }
  pr(x - r * 0.3, y - r * 0.2, 8, 6, '#cfc9bc');
  pr(x + r * 0.2, y + r * 0.3, 10, 6, '#d7d1c4');
  pr(x - r * 0.1, y + r * 0.05, 6, 4, '#cfc9bc');
  ctx.fillStyle = 'rgba(232,228,218,0.08)';
  ctx.beginPath(); ctx.arc(x, y, r + 16, 0, Math.PI * 2); ctx.fill();
}
function bgStars(seed) {
  for (let i = 0; i < 60; i++) {
    const x = (i * 137 + seed) % W, y = (i * 73) % (H * 0.5);
    const tw = (Math.sin(game.t * 0.05 + i) + 1) / 2;
    if (tw > 0.4) pr(x, y, 2, 2, 'rgba(220,225,240,' + (0.3 + tw * 0.4) + ')');
  }
}
function bgHouse(wx, wide, tall) {
  const x = wx - game.cam;
  if (x < -200 || x > W + 50) return;
  const base = GROUND;
  pr(x, base - tall, wide, tall, '#171221');
  pr(x - 8, base - tall - 4, wide + 16, 10, '#0d0a16');
  for (let i = 0; i < 3; i++) pr(x - 8 + i * 6, base - tall - 10 + i * 2, wide + 16 - i * 12, 4, '#0d0a16');
  for (let i = 8; i < wide - 10; i += 22) pr(x + i, base - tall + 14, 10, 12, '#0a0812');
  pr(x + 4, base - 24, 8, 24, '#120e1c');
}
function bgLantern(wx, hy, flicker) {
  const x = wx - game.cam;
  if (x < -30 || x > W + 30) return;
  const fl = flicker ? (Math.sin(game.t * 0.3 + wx) > 0.6 ? 0.3 : 1) : 1;
  pr(x, hy - 40, 3, 40, '#241d31');
  pr(x - 6, hy, 15, 18, `rgba(232,140,90,${0.85 * fl})`);
  pr(x - 4, hy + 2, 11, 14, `rgba(255,190,120,${0.9 * fl})`);
  pr(x - 6, hy - 3, 15, 3, '#241d31');
  pr(x - 6, hy + 18, 15, 3, '#241d31');
  ctx.fillStyle = `rgba(255,170,100,${0.07 * fl})`;
  ctx.beginPath(); ctx.arc(x + 1, hy + 9, 30, 0, Math.PI * 2); ctx.fill();
}
function bgTorii(wx, scale) {
  const x = wx - game.cam, s = scale || 1;
  if (x < -200 || x > W + 200) return;
  const c = game.redness > 0.5 ? '#5a1a22' : '#a03a30';
  const top = GROUND - 150 * s;
  pr(x - 70 * s, top, 140 * s, 10 * s, c);
  pr(x - 80 * s, top - 10 * s, 160 * s, 8 * s, c);
  pr(x - 55 * s, top + 18 * s, 110 * s, 7 * s, c);
  pr(x - 50 * s, top, 10 * s, 150 * s, c);
  pr(x + 40 * s, top, 10 * s, 150 * s, c);
  pr(x - 6 * s, top + 18 * s, 12 * s, 16 * s, '#d8cfa8');
}
function bgWell(wx) {
  const x = wx - game.cam;
  if (x < -80 || x > W + 80) return;
  pr(x, GROUND - 26, 52, 26, '#3a3d4a');
  pr(x + 2, GROUND - 24, 48, 4, '#4d5160');
  pr(x + 4, GROUND - 50, 5, 26, '#2a2435');
  pr(x + 43, GROUND - 50, 5, 26, '#2a2435');
  pr(x - 4, GROUND - 58, 60, 8, '#1c1726');
  pr(x + 18, GROUND - 22, 16, 18, '#07060c');
}
function bgStall(wx, c1, c2, label) {
  const x = wx - game.cam;
  if (x < -120 || x > W + 60) return;
  pr(x, GROUND - 58, 76, 8, c1);
  for (let i = 0; i < 76; i += 12) pr(x + i, GROUND - 58, 6, 8, c2);
  pr(x - 4, GROUND - 52, 84, 6, c1);
  pr(x + 2, GROUND - 46, 5, 46, '#2a2233');
  pr(x + 69, GROUND - 46, 5, 46, '#2a2233');
  pr(x + 6, GROUND - 30, 64, 12, '#382e44');
  if (label === 'apple') {
    pr(x + 32, GROUND - 40, 8, 8, '#c01a2a');
    pr(x + 34, GROUND - 42, 2, 4, '#7a4a2a');
    pr(x + 33, GROUND - 39, 2, 2, '#ff8a96');
  } else if (label === 'candy') {
    for (let i = 0; i < 5; i++) pr(x + 14 + i * 9, GROUND - 38, 4, 4, ['#e8c8d8', '#c8d8e8', '#e8e2c8'][i % 3]);
  }
}
function bgTree(wx, dark) {
  const x = wx - game.cam;
  if (x < -160 || x > W + 160) return;
  const leaf = dark ? '#2a1626' : '#5a3a56';
  const leaf2 = dark ? '#3a1c30' : '#7a4e74';
  pr(x - 5, GROUND - 90, 12, 90, '#241a28');
  pr(x - 60, GROUND - 130, 120, 36, leaf);
  pr(x - 44, GROUND - 152, 90, 30, leaf2);
  pr(x - 20, GROUND - 166, 50, 20, leaf);
  for (let i = 0; i < 14; i++) {
    const px2 = x - 56 + ((i * 53) % 112), py = GROUND - 158 + ((i * 31) % 52);
    pr(px2, py, 3, 3, dark ? '#6a2a4a' : '#d8a8c8');
  }
}

/* ----- シーン描画 ----- */
function drawScene() {
  const t = game.t;
  switch (game.scene) {
    case 'prologue': {
      bgSky('#06060a', '#0c0c14');
      ctx.fillStyle = 'rgba(220,225,235,0.05)';
      ctx.fillRect(0, H * 0.4 + Math.sin(t * 0.02) * 10, W, 4);
      break;
    }
    case 'town': case 'festival': case 'nightmare': {
      const red = game.redness;
      const top = lerpColor('#0a0c1e', '#2a0810', red);
      const bot = lerpColor('#1c1430', '#3a0a14', red);
      bgSky(top, bot);
      bgStars(0);
      bgMoon(W * 0.72 - game.cam * 0.15, 70, 34);
      // 遠景の山
      ctx.fillStyle = lerpColor('#0e0e20', '#220812', red);
      for (let x = 0; x < W; x += 8) {
        const hgt = 50 + Math.sin((x + game.cam * 0.3) * 0.01) * 22;
        ctx.fillRect(x, GROUND - 60 - hgt, 8, hgt + 60);
      }
      // 家並み
      for (let i = 0; i < 14; i++) {
        const wx = i * 230 + ((i * 77) % 60);
        bgHouse(wx, 120 + (i % 3) * 30, 90 + (i % 4) * 18);
      }
      if (game.scene === 'town') {
        bgTree(380, red > 0.4); bgTree(1480, red > 0.4);
        bgTorii(900, 1);
        bgWell(1030);
        for (let i = 0; i < 8; i++) bgLantern(140 + i * 200, GROUND - 96, red > 0.3);
      }
      if (game.scene === 'festival') {
        for (let i = 0; i < 10; i++) bgLantern(90 + i * 150, GROUND - 100, red > 0.3);
        bgStall(300, '#7a2a3a', '#d8cfa8', 'candy');
        bgStall(540, '#2a4a6a', '#d8cfa8', 'apple');
        bgStall(800, '#5a3a6a', '#d8cfa8', 'candy');
        bgStall(1080, '#7a2a3a', '#d8cfa8', 'candy');
        bgTree(1300, red > 0.4);
      }
      if (game.scene === 'nightmare') {
        bgTorii(900, 1);
        bgTree(380, true); bgTree(1480, true);
        for (let i = 0; i < 8; i++) bgLantern(140 + i * 200, GROUND - 96, true);
        // グリッチ
        if (Math.random() < 0.2) {
          const gy = Math.random() * H;
          ctx.fillStyle = 'rgba(255,60,90,0.12)';
          ctx.fillRect(0, gy, W, 3 + Math.random() * 6);
        }
        // 行き止まりの壁
        const wallX = game.worldW - 40 - game.cam;
        if (wallX < W + 40) { pr(wallX, GROUND - 170, 60, 170, '#16101e'); pr(wallX - 4, GROUND - 174, 6, 174, '#23182c'); }
      }
      // 石畳
      drawRoad(red);
      break;
    }
    case 'stairs': {
      const red = game.redness;
      bgSky(lerpColor('#0a0c1e', '#301018', red), lerpColor('#241638', '#481020', red));
      bgStars(40);
      bgMoon(W * 0.3 - game.cam * 0.1, 64, 30);
      ctx.fillStyle = '#0e0e20';
      for (let x = 0; x < W; x += 8) {
        const hgt = 70 + Math.sin((x + game.cam * 0.25) * 0.012) * 26;
        ctx.fillRect(x, GROUND - 90 - hgt, 8, hgt + 90);
      }
      // 石段
      for (let wx = 0; wx < game.worldW; wx += 8) {
        const gy = groundY(wx);
        const x = wx - game.cam;
        if (x < -10 || x > W) continue;
        pr(x, gy, 8, H - gy, '#1e1a2c');
        pr(x, gy, 8, 3, '#322a44');
      }
      bgTorii(1500, 1.1);
      for (let i = 0; i < 7; i++) bgLantern(200 + i * 220, groundY(200 + i * 220) - 80, red > 0.3);
      bgTree(1620, red > 0.4);
      // 社
      const sx = 1560 - game.cam;
      if (sx < W + 100) {
        const gy = groundY(1560);
        pr(sx, gy - 70, 90, 70, '#241c30');
        pr(sx - 10, gy - 84, 110, 16, '#171221');
        pr(sx + 36, gy - 36, 18, 36, '#0e0a16');
        pr(sx + 30, gy - 60, 30, 6, '#d8cfa8');
      }
      break;
    }
    case 'void': {
      bgSky('#050308', '#150a20');
      for (let i = 0; i < 40; i++) {
        const x = (i * 167 + t * (0.2 + i % 3 * 0.1)) % W;
        const y = (i * 91 + t * 0.15) % H;
        pr(x, y, 2, 2, 'rgba(160,100,220,' + (0.2 + (i % 5) * 0.1) + ')');
      }
      ctx.fillStyle = 'rgba(90,40,140,0.06)';
      ctx.beginPath(); ctx.arc(W * 0.65, H * 0.45, 130 + Math.sin(t * 0.03) * 10, 0, Math.PI * 2); ctx.fill();
      pr(0, GROUND, W, H - GROUND, '#0a0612');
      pr(0, GROUND, W, 2, '#2a1a3c');
      break;
    }
    case 'hospital': {
      bgSky('#f2ede2', '#e2dccb');
      // 窓と朝の光
      pr(60, 40, 130, 110, '#bcd8e8');
      pr(60, 40, 130, 6, '#d8d2c0'); pr(60, 144, 130, 6, '#d8d2c0');
      pr(60, 40, 6, 110, '#d8d2c0'); pr(184, 40, 6, 110, '#d8d2c0');
      pr(120, 40, 5, 110, '#d8d2c0');
      pr(80, 60, 26, 14, '#fdfbf0');
      pr(140, 80, 30, 12, '#fdfbf0');
      ctx.fillStyle = 'rgba(255,250,220,0.25)';
      ctx.beginPath();
      ctx.moveTo(66, 46); ctx.lineTo(186, 46); ctx.lineTo(320, H); ctx.lineTo(140, H);
      ctx.closePath(); ctx.fill();
      // カーテン
      pr(210, 20, 16, 240, '#d8e2d8');
      pr(226, 20, 8, 240, '#c4d2c4');
      // 床
      pr(0, GROUND, W, H - GROUND, '#cfc8b4');
      pr(0, GROUND, W, 3, '#b8b09a');
      // ベッド＋わたし（上体を起こしている）
      pr(316, GROUND - 60, 8, 60, '#9a917c'); pr(496, GROUND - 60, 8, 60, '#9a917c');
      pr(320, GROUND - 44, 180, 44, '#fdfbf4');
      pr(456, GROUND - 52, 38, 12, '#e8e4d8');
      drawSprite('watashi', 352, GROUND - 82, false, PX);
      pr(326, GROUND - 50, 168, 44, '#e2ecf2');
      pr(326, GROUND - 50, 168, 4, '#cfdce8');
      // 点滴スタンド
      pr(540, GROUND - 120, 3, 120, '#9aa2aa');
      pr(528, GROUND - 124, 28, 4, '#9aa2aa');
      pr(548, GROUND - 116, 10, 18, '#cfe2ea');
      // モニター
      pr(560, GROUND - 80, 50, 36, '#3a4048');
      pr(564, GROUND - 76, 42, 24, '#16241c');
      const hb = Math.floor(t / 3) % 42;
      pr(564 + hb, GROUND - 66 + (hb % 7 === 0 ? -6 : 0), 3, 3, '#5ae88a');
      // 花瓶
      pr(280, GROUND - 70, 18, 22, '#c8d8e2');
      pr(284, GROUND - 82, 4, 12, '#5a7a4a');
      pr(280, GROUND - 88, 8, 8, '#e8c8d8');
      pr(290, GROUND - 86, 7, 7, '#e8e2c8');
      break;
    }
  }
}
function drawRoad(red) {
  pr(0, GROUND, W, H - GROUND, lerpColor('#1c1830', '#2a0e16', red));
  ctx.fillStyle = lerpColor('#262040', '#3a141e', red);
  for (let wx = Math.floor(game.cam / 26) * 26; wx < game.cam + W + 26; wx += 26) {
    const x = wx - game.cam;
    ctx.fillRect(x, GROUND, 22, 6);
    ctx.fillRect(x + 13, GROUND + 9, 22, 6);
    ctx.fillRect(x, GROUND + 18, 22, 6);
  }
  pr(0, GROUND, W, 2, lerpColor('#332b52', '#4a1a26', red));
}

function lerpColor(a, b, t2) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) + (((pb >> 16) & 255) - ((pa >> 16) & 255)) * t2);
  const g = Math.round(((pa >> 8) & 255) + (((pb >> 8) & 255) - ((pa >> 8) & 255)) * t2);
  const bl = Math.round((pa & 255) + ((pb & 255) - (pa & 255)) * t2);
  return `rgb(${r},${g},${bl})`;
}

/* ----- パーティクル ----- */
function updateParticles() {
  const outdoor = game.mode !== 'play' || ['town', 'festival', 'stairs', 'nightmare'].includes(game.scene);
  if (outdoor && game.particles.length < 26 && Math.random() < 0.3) {
    game.particles.push({
      x: Math.random() * (W + 100) - 50, y: -10,
      vx: -0.3 - Math.random() * 0.5, vy: 0.4 + Math.random() * 0.5,
      ph: Math.random() * 6.28,
      kind: game.redness > 0.5 ? 'ember' : 'petal',
    });
  }
  if (game.scene === 'void' && game.particles.length < 20 && Math.random() < 0.25) {
    game.particles.push({ x: Math.random() * W, y: H + 10, vx: 0, vy: -0.5 - Math.random() * 0.5, ph: Math.random() * 6.28, kind: 'soul' });
  }
  for (let i = game.particles.length - 1; i >= 0; i--) {
    const p = game.particles[i];
    p.x += p.vx + Math.sin(game.t * 0.05 + p.ph) * 0.4;
    p.y += p.vy;
    if (p.y > H + 20 || p.y < -20) game.particles.splice(i, 1);
  }
}
function drawParticles() {
  for (const p of game.particles) {
    if (p.kind === 'petal') pr(p.x, p.y, 3, 3, 'rgba(216,168,200,0.8)');
    else if (p.kind === 'ember') pr(p.x, p.y, 3, 3, 'rgba(220,70,90,0.8)');
    else pr(p.x, p.y, 3, 5, 'rgba(150,110,220,0.6)');
  }
}

/* ----- UI ----- */
function fontPx(size) { return `${size}px "DotGothic16", monospace`; }

function wrapText(text, maxW, size) {
  ctx.font = fontPx(size);
  const lines = [];
  let line = '';
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxW) { lines.push(line); line = ch; }
    else line += ch;
  }
  if (line) lines.push(line);
  return lines;
}

function drawDialog() {
  const d = game.dialog;
  if (!d) return;
  const bx = 20, by = H - 92, bw = W - 40, bh = 80;
  ctx.fillStyle = 'rgba(10,8,20,0.88)';
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = '#8a7ab8'; ctx.lineWidth = 2;
  ctx.strokeRect(bx + 2, by + 2, bw - 4, bh - 4);
  let ty = by + 22;
  if (d.name) {
    ctx.font = fontPx(15);
    ctx.fillStyle = 'rgba(10,8,20,0.88)';
    const nw = ctx.measureText(fmt(d.name)).width;
    ctx.fillRect(bx + 8, by - 22, nw + 12, 22);
    ctx.strokeStyle = '#8a7ab8';
    ctx.strokeRect(bx + 8, by - 22, nw + 12, 22);
    ctx.fillStyle = d.color;
    ctx.fillText(fmt(d.name), bx + 14, by - 5);
  }
  const visible = d.text.slice(0, Math.floor(d.shown));
  const lines = wrapText(visible, bw - 36, 16);
  ctx.font = fontPx(16);
  ctx.fillStyle = d.thought ? '#a8b0c8' : '#f0eef8';
  for (let i = 0; i < lines.length && i < 3; i++) ctx.fillText(lines[i], bx + 18, ty + i * 22);
  if (d.shown >= d.text.length && Math.floor(game.t / 20) % 2 === 0) {
    ctx.fillStyle = '#cdc3e8';
    ctx.fillText('▼', bx + bw - 28, by + bh - 12);
  }
}

function drawChoice() {
  const c = game.choice;
  if (!c) return;
  const n = c.opts.length;
  const bw = 280, bx = (W - bw) / 2;
  const y0 = H - 70 - n * 26;
  ctx.fillStyle = 'rgba(10,8,20,0.92)';
  ctx.fillRect(bx, y0 - 8, bw, n * 26 + 14);
  ctx.strokeStyle = '#8a7ab8'; ctx.lineWidth = 2;
  ctx.strokeRect(bx + 2, y0 - 6, bw - 4, n * 26 + 10);
  ctx.font = fontPx(16);
  c.opts.forEach((o, i) => {
    const sel = i === c.idx;
    ctx.fillStyle = sel ? '#f0e8b8' : '#9a92b8';
    ctx.fillText((sel ? '▶ ' : '　 ') + o.t, bx + 16, y0 + 16 + i * 26);
  });
}

function drawCard() {
  const c = game.card;
  if (!c) return;
  ctx.fillStyle = `rgba(4,3,8,${0.9 * c.a})`;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = c.a;
  ctx.font = fontPx(30);
  ctx.fillStyle = '#e8e2f0';
  const w1 = ctx.measureText(c.text).width;
  ctx.fillText(c.text, (W - w1) / 2, H / 2 - 8);
  ctx.font = fontPx(17);
  ctx.fillStyle = '#9f86d8';
  const w2 = ctx.measureText('―　' + c.sub + '　―').width;
  ctx.fillText('―　' + c.sub + '　―', (W - w2) / 2, H / 2 + 26);
  ctx.globalAlpha = 1;
}

function drawMemory() {
  const m = game.memory;
  if (!m) return;
  ctx.fillStyle = 'rgba(240,238,240,0.94)';
  ctx.fillRect(0, 0, W, H);
  // ノイズ
  for (let i = 0; i < 40; i++) {
    pr(Math.random() * W, Math.random() * H, 2, 2, 'rgba(40,30,40,0.15)');
  }
  const sh = () => (Math.random() - 0.5) * 2;
  ctx.font = fontPx(18);
  ctx.fillStyle = '#2a1e28';
  for (let i = 0; i <= m.idx && i < m.lines.length; i++) {
    const text = i === m.idx ? m.lines[i].slice(0, Math.floor(m.shown)) : m.lines[i];
    const lw = ctx.measureText(m.lines[i]).width;
    ctx.fillText(text, (W - lw) / 2 + sh(), 90 + i * 36 + sh());
  }
  if (m.shown >= m.lines[m.idx]?.length && Math.floor(game.t / 20) % 2 === 0) {
    ctx.fillStyle = '#7a2a3a';
    ctx.fillText('▼', W - 50, H - 30);
  }
}

function drawChaseUI() {
  if (!game.chase) return;
  const ch = game.chase;
  const m = game.actors.mother;
  if (ch.whisper) {
    ctx.font = fontPx(15);
    ctx.fillStyle = `rgba(220,80,100,${0.5 + Math.sin(game.t * 0.2) * 0.3})`;
    ctx.fillText(ch.whisper, m.x - game.cam - 10, groundY(m.x) - 110 + Math.sin(game.t * 0.1) * 4);
  }
  ctx.fillStyle = 'rgba(120,10,25,0.18)';
  ctx.fillRect(0, 0, W, H);
}

function drawHint() {
  if (!game.hint || game.dialog || game.card || game.memory || game.choice) return;
  ctx.font = fontPx(14);
  ctx.fillStyle = 'rgba(10,8,20,0.7)';
  const tw = ctx.measureText(game.hint).width;
  ctx.fillRect((W - tw) / 2 - 10, 14, tw + 20, 26);
  ctx.fillStyle = '#e8e2c8';
  ctx.fillText(game.hint, (W - tw) / 2, 32);
}

/* ----- タイトル／エンディング ----- */
function drawTitle() {
  bgSky('#0a0c1e', '#241638');
  bgStars(0);
  bgMoon(W * 0.7, 80, 40);
  game.cam = 0;
  for (let i = 0; i < 4; i++) bgHouse(i * 200 + 30, 130, 90 + i % 2 * 20);
  bgTorii(320, 0.9);
  drawRoad(0);
  updateParticles(); drawParticles();
  drawSprite('nanashi', 120, GROUND - 52, false, PX);
  drawSprite('kakuriyo', 460, GROUND - 56, true, PX);

  ctx.font = fontPx(44);
  ctx.fillStyle = '#0a0814';
  const title = '朧の夢祀り';
  const tw = ctx.measureText(title).width;
  ctx.fillText(title, (W - tw) / 2 + 3, 123);
  ctx.fillStyle = '#e8e2f0';
  ctx.fillText(title, (W - tw) / 2, 120);
  ctx.font = fontPx(15);
  ctx.fillStyle = '#9f86d8';
  const sub = '― おぼろの ゆめまつり ―';
  ctx.fillText(sub, (W - ctx.measureText(sub).width) / 2, 148);

  if (Math.floor(game.t / 30) % 2 === 0) {
    ctx.font = fontPx(16);
    ctx.fillStyle = '#f0eef8';
    const msg = 'Zキー か タップ で はじめる';
    ctx.fillText(msg, (W - ctx.measureText(msg).width) / 2, 230);
  }
  ctx.font = fontPx(12);
  ctx.fillStyle = '#6a6488';
  const warn = '※虐待に関する描写が含まれます／音が鳴ります（Mで消音）';
  ctx.fillText(warn, (W - ctx.measureText(warn).width) / 2, H - 14);

  if (advQueue > 0) {
    advQueue = 0;
    game.mode = 'play';
    game.fade = 1; game.fadeTo = 1;
    Snd.ensure();
    runScript(buildScript());
  }
}

function drawFin() {
  game.finT++;
  bgSky('#0a0c1e', '#241638');
  bgStars(10);
  bgMoon(W * 0.5, 90, 36);
  updateParticles(); drawParticles();
  const a1 = Math.min(1, game.finT / 120);
  ctx.globalAlpha = a1;
  ctx.font = fontPx(34);
  ctx.fillStyle = '#e8e2f0';
  const t1 = '朧の夢祀り　―了―';
  ctx.fillText(t1, (W - ctx.measureText(t1).width) / 2, 150);
  ctx.globalAlpha = 1;
  if (game.finT > 200) {
    const a2 = Math.min(1, (game.finT - 200) / 120);
    ctx.globalAlpha = a2;
    ctx.font = fontPx(14);
    ctx.fillStyle = '#9f86d8';
    const lines = [
      'あの夜、誰かがそっと、三度だけ道を変えてくれたことを。',
      '彼女は、知らない。',
    ];
    lines.forEach((l, i) => ctx.fillText(l, (W - ctx.measureText(l).width) / 2, 210 + i * 24));
    ctx.globalAlpha = 1;
  }
  if (game.finT > 380) {
    ctx.font = fontPx(13);
    ctx.fillStyle = '#6a6488';
    const t3 = 'Thank you for playing ／ Zキーでタイトルへ';
    ctx.fillText(t3, (W - ctx.measureText(t3).width) / 2, H - 24);
    if (advQueue > 0) {
      advQueue = 0;
      game.mode = 'title';
      game.fade = 0; game.fadeTo = 0;
      game.redness = 0;
      game.actors = {};
      game.stack = [];
      game.bossFx = { halo: 0, thorns: 0, roses: 0 };
      Snd.bgm(null);
    }
  } else advQueue = 0;
}

/* =========================================================
   メインループ
   ========================================================= */
function update() {
  game.t++;
  // フェード
  if (game.fade < game.fadeTo) game.fade = Math.min(game.fadeTo, game.fade + game.fadeSpd);
  else if (game.fade > game.fadeTo) game.fade = Math.max(game.fadeTo, game.fade - game.fadeSpd);
  if (game.flash > 0) game.flash -= 0.06;
  if (game.shakeT > 0) game.shakeT--;

  if (game.mode === 'play') {
    // プレイヤー操作
    const p = game.actors.player;
    if (game.control && p && !game.dialog && !game.card && !game.memory && !game.choice && !game.inputOpen) {
      if (Key.right) { p.x = Math.min(game.worldW - 40, p.x + 2.2); p.flip = false; p.walk += 0.2; }
      else if (Key.left) { p.x = Math.max(20, p.x - 2.2); p.flip = true; p.walk += 0.2; }
      else p.walk = 0;
    }
    // カメラ
    const focus = game.chase ? game.actors.player : (p && p.visible ? p : null);
    if (focus) {
      const target = Math.max(0, Math.min(game.worldW - W, focus.x - W * 0.4));
      game.cam += (target - game.cam) * 0.12;
    }
    tickScript();
    updateParticles();
  }
}

function render() {
  ctx.save();
  if (game.shakeT > 0) {
    ctx.translate((Math.random() - 0.5) * game.shakeMag * 2, (Math.random() - 0.5) * game.shakeMag * 2);
  }
  if (game.mode === 'title') { drawTitle(); ctx.restore(); drawScanlines(); return; }
  if (game.mode === 'fin') { drawFin(); ctx.restore(); drawScanlines(); return; }

  drawScene();
  // アクター（player は手前）
  const order = Object.keys(game.actors).filter(k => k !== 'player');
  order.forEach(id => drawActor(game.actors[id], id));
  if (game.actors.player) drawActor(game.actors.player, 'player');
  drawParticles();
  if (game.redness > 0) {
    ctx.fillStyle = `rgba(140,10,30,${game.redness * 0.16})`;
    ctx.fillRect(0, 0, W, H);
  }
  drawChaseUI();
  drawHint();
  drawDialog();
  drawChoice();
  drawCard();
  drawMemory();

  // フェード・フラッシュ
  if (game.fade > 0) {
    ctx.globalAlpha = game.fade;
    ctx.fillStyle = game.fadeColor;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }
  if (game.flash > 0) {
    ctx.globalAlpha = Math.max(0, game.flash);
    ctx.fillStyle = game.flashColor;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  drawScanlines();
}

let scanCache = null;
function drawScanlines() {
  if (!scanCache) {
    scanCache = document.createElement('canvas');
    scanCache.width = W; scanCache.height = H;
    const c2 = scanCache.getContext('2d');
    c2.fillStyle = 'rgba(0,0,0,0.10)';
    for (let y = 0; y < H; y += 4) c2.fillRect(0, y, W, 1);
  }
  ctx.drawImage(scanCache, 0, 0);
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

function fitCanvas() {
  const scale = Math.min(innerWidth / W, innerHeight / H);
  cv.style.width = Math.floor(W * scale) + 'px';
  cv.style.height = Math.floor(H * scale) + 'px';
}

function init() {
  cv = document.getElementById('screen');
  cv.width = W; cv.height = H;
  ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.textBaseline = 'alphabetic';
  const errs = validateSprites();
  if (errs.length) console.warn('Sprite warnings:', errs);
  bindInput(cv);
  fitCanvas();
  addEventListener('resize', fitCanvas);
  loop();
}

if (typeof module !== 'undefined' && module.exports !== undefined) {
  // Node からのテスト用
  module.exports = {
    SPR, PAL, validateSprites,
    buildScript: () => buildScript(),
    __test: {
      game, update, runScript, Key, init,
      render: () => render(),
      pressAdv: () => { advQueue++; },
      pendingAdv: () => advQueue,
    },
  };
} else if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}
