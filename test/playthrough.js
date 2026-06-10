'use strict';
/* 通しテスト：DOMスタブの上でゲームを最初から最後まで自動プレイし、
   スクリプトが詰まらず「了」まで到達することを検証する。 */

// 2D コンテキストのスタブ（描画呼び出しのタイポ・未定義変数を検出するため、
// すべてのメソッド呼び出しを受け付ける）
function makeCtxStub() {
  const stub = {
    measureText: t => ({ width: String(t).length * 8 }),
    createLinearGradient: () => ({ addColorStop() {} }),
  };
  return new Proxy(stub, {
    get(target, prop) {
      if (prop in target) return target[prop];
      return () => undefined; // メソッドは全て no-op
    },
    set(target, prop, v) { target[prop] = v; return true; },
  });
}
const makeCanvasStub = () => ({
  width: 0, height: 0, style: {},
  getContext: () => makeCtxStub(),
  addEventListener() {},
});

const els = {};
global.window = {}; // AudioContext なし → Snd は安全に無効化される
global.addEventListener = () => {};
global.innerWidth = 1280;
global.innerHeight = 720;
global.requestAnimationFrame = () => {};
global.document = {
  createElement: () => makeCanvasStub(),
  addEventListener() {},
  readyState: 'complete',
  getElementById(id) {
    if (!els[id]) {
      els[id] = id === 'screen' ? makeCanvasStub() : {
        style: {}, value: '', textContent: '', listeners: {},
        addEventListener(t, f) { this.listeners[t] = f; },
        removeEventListener(t) { delete this.listeners[t]; },
        focus() {},
      };
    }
    return els[id];
  },
};

const g = require('../game.js');
const { game, update, runScript, Key, pressAdv, pendingAdv, render, init } = g.__test;
init(); // 描画コンテキスト等を初期化（rAF はスタブなのでループは回らない）

// スプライト検証
const errs = g.validateSprites();
if (errs.length) {
  console.error('SPRITE ERRORS:', errs);
  process.exit(1);
}

game.mode = 'play';
runScript(g.buildScript());

const visited = new Set();
const dialogs = [];
let frames = 0;
const MAX = 400000;
let inputCount = 0;
let lastDialog = '';

for (; frames < MAX; frames++) {
  // 名前入力が開いたら、入力して「こたえる」を押す
  if (game.inputOpen) {
    els.nameInput.value = inputCount === 0 ? 'やや花' : 'やや花';
    inputCount++;
    els.nameBtn.listeners.click();
  }
  // 進行ボタンを定期的に押す
  if (frames % 3 === 0 && pendingAdv() === 0) pressAdv();
  // 歩行が必要なときは右へ
  Key.right = true;

  visited.add(game.scene);
  update();
  render(); // 描画コードも全フレーム実行して例外がないことを確認
  if (game.dialog && game.dialog.text !== lastDialog) {
    lastDialog = game.dialog.text;
    dialogs.push(lastDialog);
  }
  if (game.mode === 'fin') break;
}

console.log('frames:', frames);
console.log('scenes visited:', [...visited].join(', '));
console.log('name inputs:', inputCount);
console.log('dialog lines seen:', dialogs.length);

const must = ['prologue', 'town', 'festival', 'stairs', 'nightmare', 'void', 'hospital'];
const missing = must.filter(s => !visited.has(s));
let fail = false;
if (game.mode !== 'fin') { console.error('NG: 最後まで到達できませんでした (mode=' + game.mode + ', scene=' + game.scene + ')'); fail = true; }
if (missing.length) { console.error('NG: 未到達シーン:', missing); fail = true; }
if (inputCount !== 2) { console.error('NG: 名前入力の回数が想定外:', inputCount); fail = true; }

// 名前差し込みの検証
const joined = dialogs.join('\n');
if (!joined.includes('やや花ちゃん')) { console.error('NG: 大国主が本名を呼んでいません'); fail = true; }
if (!joined.includes('ただいま')) { console.error('NG: ラストの「ただいま」が見つかりません'); fail = true; }
if (!joined.includes('ななしちゃん、とお呼びしよう')) { console.error('NG: ななし呼びの導入が見つかりません'); fail = true; }

if (fail) process.exit(1);
console.log('OK: タイトル後〜「了」まで通しで完走しました');
