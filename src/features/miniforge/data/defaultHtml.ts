import type { HtmlEntry } from '../types'

const scenarioSheetV11 = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Scenario Sheet v1.1</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background:#111; color:#f0f0f0; font-family:sans-serif; line-height:1.6; padding:16px; max-width:600px; margin:auto; }
    h1 { font-size:24px; margin-bottom:16px; }
    h2 { font-size:18px; margin-bottom:12px; }
    .sheet-card { background:#1c1c1c; border:1px solid #333; border-radius:12px; padding:16px; margin-bottom:20px; }
    label { display:block; margin-bottom:8px; font-size:14px; color:#aaa; }
    input, textarea { width:100%; background:#222; color:#fff; border:1px solid #444; border-radius:8px; padding:12px; margin-bottom:16px; font-size:16px; }
    textarea { min-height:100px; resize:vertical; }
    button { width:100%; background:#3a6df0; color:white; border:none; border-radius:10px; padding:14px; font-size:16px; cursor:pointer; }
    button:active { transform:scale(0.98); }
  </style>
</head>
<body>
  <h1>TRPG風 Scenario Sheet</h1>
  <section class="sheet-card">
    <h2>世界観</h2>
    <label>世界名</label>
    <input type="text" id="worldName" placeholder="例：魔導帝国" />
    <label>世界の問題</label>
    <textarea id="worldProblem" placeholder="例：魔力格差による階級社会"></textarea>
  </section>
  <section class="sheet-card">
    <h2>キャラクター</h2>
    <label>名前</label>
    <input type="text" id="characterName" placeholder="例：灰騎士" />
    <label>目的</label>
    <textarea id="characterGoal" placeholder="例：妹を救う"></textarea>
  </section>
  <section class="sheet-card">
    <h2>必要システム</h2>
    <label>必要だと思うシステム</label>
    <textarea id="systems" placeholder="例：分岐、好感度、探索"></textarea>
  </section>
  <section class="sheet-card">
    <button onclick="exportJSON()">JSON Export</button>
  </section>
  <script>
    function exportJSON() {
      const data = {
        world: { name: document.getElementById("worldName").value, problem: document.getElementById("worldProblem").value },
        character: { name: document.getElementById("characterName").value, goal: document.getElementById("characterGoal").value },
        systems: document.getElementById("systems").value
      };
      const filename = "scenario_sheet.json";
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type:"application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
      window.parent.postMessage({ type:"mf-export", filename, data }, "*");
    }
  </script>
</body>
</html>`

const novelSheetV21 = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>NovelSheet v2.1</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0d0f14;
      --surface: #131620;
      --elevated: #1a1d24;
      --border: #1e2128;
      --accent: #00d4cc;
      --accent-dim: rgba(0,212,204,0.13);
      --done: #22c55e;
      --warning: #ff6b35;
      --text-hi: #ffffff;
      --text-mid: #888888;
      --text-lo: #444444;
      --radius: 12px;
      --radius-sm: 8px;
    }
    body {
      background: var(--bg);
      color: var(--text-hi);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      padding-bottom: 80px;
      max-width: 600px;
      margin: 0 auto;
      min-height: 100dvh;
    }
    .sheet-header {
      position: sticky; top: 0;
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      padding: 12px 16px;
      display: flex; flex-direction: column; gap: 8px;
      z-index: 10;
    }
    .sheet-title { font-size: 14px; font-weight: 700; color: var(--accent); letter-spacing: 0.05em; }
    .prog-row { display: flex; align-items: center; gap: 10px; }
    .prog-track { flex: 1; height: 4px; background: var(--border); border-radius: 9999px; overflow: hidden; }
    .prog-fill { height: 100%; background: var(--accent); border-radius: 9999px; transition: width 0.3s ease; }
    .prog-text { font-size: 10px; color: var(--text-lo); font-family: monospace; white-space: nowrap; }
    .card { margin: 12px 16px 0; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
    .card-title { font-size: 13px; font-weight: 700; color: var(--text-hi); margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
    .sub-title { font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid var(--border); }
    .char-block + .char-block { margin-top: 20px; }
    label { display: block; font-size: 11px; color: var(--text-lo); margin-bottom: 4px; letter-spacing: 0.04em; }
    input[type="text"], textarea {
      width: 100%; background: var(--elevated); color: var(--text-hi);
      border: 1px solid var(--border); border-radius: var(--radius-sm);
      padding: 11px 13px; font-size: 15px; margin-bottom: 12px;
      font-family: inherit; -webkit-appearance: none; transition: border-color 0.15s;
    }
    input[type="text"]:focus, textarea:focus { outline: none; border-color: var(--accent); }
    textarea { min-height: 76px; resize: vertical; line-height: 1.5; }
    .systems-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .sys-chip {
      display: flex; align-items: center; gap: 8px;
      background: var(--elevated); border: 1px solid var(--border);
      border-radius: var(--radius-sm); padding: 10px 12px;
      cursor: pointer; transition: border-color 0.15s, background 0.15s;
      user-select: none; -webkit-user-select: none;
    }
    .sys-chip input { display: none; }
    .chip-dot {
      width: 14px; height: 14px; border: 1.5px solid var(--text-lo);
      border-radius: 3px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s, border-color 0.15s;
    }
    .sys-chip.on { border-color: var(--accent); background: var(--accent-dim); }
    .sys-chip.on .chip-dot { border-color: var(--accent); background: var(--accent); }
    .sys-chip.on .chip-dot::after {
      content: '✓'; font-size: 9px; font-weight: 900; color: #000; line-height: 1;
    }
    .chip-lbl { font-size: 12px; color: var(--text-mid); }
    .sys-chip.on .chip-lbl { color: var(--accent); font-weight: 600; }
    .actions {
      position: fixed; bottom: 0; left: 0; right: 0;
      background: var(--bg); border-top: 1px solid var(--border);
      padding: 10px 16px; display: flex; gap: 8px; z-index: 10;
    }
    .btn {
      flex: 1; padding: 13px 6px; border: none; border-radius: var(--radius-sm);
      font-size: 13px; font-weight: 700; cursor: pointer; letter-spacing: 0.04em;
      -webkit-tap-highlight-color: transparent; transition: opacity 0.15s, transform 0.1s;
    }
    .btn:active { transform: scale(0.96); }
    .btn-clear { background: none; border: 1px solid var(--border); color: var(--text-mid); }
    .btn-save { background: none; border: 1px solid var(--done); color: var(--done); }
    .btn-export { background: var(--accent); color: #000; flex: 1.6; }
    .dialog-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.75);
      z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px;
    }
    .dialog-box { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; width: 100%; max-width: 320px; }
    .dialog-title { font-size: 15px; font-weight: 700; margin-bottom: 10px; }
    .dialog-msg { font-size: 13px; color: var(--text-mid); margin-bottom: 20px; line-height: 1.6; }
    .dialog-row { display: flex; gap: 10px; }
    .d-btn { flex: 1; padding: 12px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 700; cursor: pointer; border: none; }
    .d-cancel { background: none; border: 1px solid var(--border); color: var(--text-mid); }
    .d-confirm { background: var(--warning); color: #fff; }
    .hidden { display: none !important; }
    @media (min-width: 600px) {
      .actions { left: 50%; transform: translateX(-50%); width: 600px; }
    }
  </style>
</head>
<body>

<header class="sheet-header">
  <div style="display:flex;align-items:center;gap:8px">
    <span style="font-size:18px">🎭</span>
    <span class="sheet-title">ノベルゲーム生成シート v2.1</span>
  </div>
  <div class="prog-row">
    <div class="prog-track"><div class="prog-fill" id="pFill" style="width:0%"></div></div>
    <span class="prog-text" id="pText">0 / 17</span>
  </div>
</header>

<section class="card">
  <div class="card-title"><span>📋</span> Project Info</div>
  <label>ラベル（日本語）</label>
  <input type="text" id="metaLabel" placeholder="例：魔導帝国の物語" oninput="upd()" />
  <label>ファイルID（英数字・ハイフン）</label>
  <input type="text" id="metaId" placeholder="例：mado-empire-01" oninput="upd()" />
  <label>メモ</label>
  <textarea id="metaMemo" placeholder="コンセプト・備考など"></textarea>
</section>

<section class="card">
  <div class="card-title"><span>🌍</span> World</div>
  <label>世界名</label>
  <input type="text" id="wName" placeholder="例：魔導帝国" oninput="upd()" />
  <label>文明レベル</label>
  <input type="text" id="wCiv" placeholder="例：中世ファンタジー" oninput="upd()" />
  <label>支配構造</label>
  <input type="text" id="wPower" placeholder="例：魔法貴族による帝政" oninput="upd()" />
  <label>禁忌</label>
  <input type="text" id="wTaboo" placeholder="例：禁忌魔法の使用" oninput="upd()" />
  <label>世界の問題</label>
  <textarea id="wProblem" placeholder="例：魔力格差による階級社会が崩壊寸前" oninput="upd()"></textarea>
</section>

<section class="card">
  <div class="card-title"><span>👤</span> Characters</div>
  <div class="char-block">
    <div class="sub-title">主人公 · CHAR_001</div>
    <label>名前</label>
    <input type="text" id="c1Name" placeholder="例：灰騎士アッシュ" oninput="upd()" />
    <label>目的</label>
    <input type="text" id="c1Purpose" placeholder="例：妹を救う" oninput="upd()" />
    <label>恐怖</label>
    <input type="text" id="c1Fear" placeholder="例：大切な人を失う恐怖" oninput="upd()" />
    <label>欠点</label>
    <input type="text" id="c1Flaw" placeholder="例：感情を抑えられない" oninput="upd()" />
    <label>戦う理由</label>
    <textarea id="c1Fight" placeholder="例：妹が奪われた命を取り戻すため" oninput="upd()"></textarea>
  </div>
  <div class="char-block">
    <div class="sub-title">ヒロイン · CHAR_002</div>
    <label>名前</label>
    <input type="text" id="c2Name" placeholder="例：シルヴィア" oninput="upd()" />
    <label>主人公との関係</label>
    <input type="text" id="c2Rel" placeholder="例：幼馴染・敵対国の姫" oninput="upd()" />
    <label>隠し事</label>
    <textarea id="c2Secret" placeholder="例：主人公の妹の居場所を知っている"></textarea>
  </div>
</section>

<section class="card">
  <div class="card-title"><span>⚙️</span> Game Systems</div>
  <div class="systems-grid" id="sysGrid"></div>
</section>

<section class="card">
  <div class="card-title"><span>📖</span> Scenario Intro</div>
  <label>最初の事件</label>
  <textarea id="sIncident" placeholder="例：帝都で魔力暴走事件が発生、主人公が巻き込まれる" oninput="upd()"></textarea>
  <label>プレイヤー目的</label>
  <textarea id="sObjective" placeholder="例：真相を追いながら妹の行方を探す" oninput="upd()"></textarea>
  <label>第一章開始イベント</label>
  <textarea id="sChapter1" placeholder="例：廃墟で謎の少女（ヒロイン）と出会う" oninput="upd()"></textarea>
</section>

<div style="height:16px"></div>

<div class="actions">
  <button class="btn btn-clear" onclick="reqClear()">クリア</button>
  <button class="btn btn-save" id="saveBtn" onclick="saveDraft()">保存</button>
  <button class="btn btn-export" onclick="doExport()">⬇ Export</button>
</div>

<div class="dialog-overlay hidden" id="dlg">
  <div class="dialog-box">
    <div class="dialog-title">入力をクリアしますか？</div>
    <div class="dialog-msg">すべての入力内容が削除されます。<br>この操作は元に戻せません。</div>
    <div class="dialog-row">
      <button class="d-btn d-cancel" onclick="closeDlg()">キャンセル</button>
      <button class="d-btn d-confirm" onclick="doClear()">クリア</button>
    </div>
  </div>
</div>

<script>
  const SYSTEMS = [
    {v:'branch',l:'分岐'},{v:'affection',l:'好感度'},{v:'explore',l:'探索'},{v:'item',l:'アイテム'},
    {v:'battle',l:'戦闘'},{v:'glossary',l:'用語辞典'},{v:'cg',l:'CG収集'},{v:'multiend',l:'マルチエンド'},
  ];
  const grid = document.getElementById('sysGrid');
  SYSTEMS.forEach(s => {
    const el = document.createElement('label');
    el.className = 'sys-chip'; el.dataset.v = s.v;
    el.innerHTML = '<input type="checkbox" value="'+s.v+'"><span class="chip-dot"></span><span class="chip-lbl">'+s.l+'</span>';
    el.addEventListener('click', e => {
      e.preventDefault();
      const cb = el.querySelector('input'); cb.checked = !cb.checked;
      el.classList.toggle('on', cb.checked); upd();
    });
    grid.appendChild(el);
  });

  const REQ = ['metaLabel','metaId','wName','wCiv','wPower','wTaboo','wProblem','c1Name','c1Purpose','c1Fear','c1Flaw','c1Fight','c2Name','c2Rel','sIncident','sObjective','sChapter1'];
  function upd() {
    const filled = REQ.filter(id => { const e = document.getElementById(id); return e && e.value.trim(); }).length;
    const pct = Math.round(filled / REQ.length * 100);
    document.getElementById('pFill').style.width = pct + '%';
    document.getElementById('pText').textContent = filled + ' / ' + REQ.length;
  }

  function collect() {
    const sys = [...document.querySelectorAll('#sysGrid input:checked')].map(c => c.value);
    return {
      meta: { schema_version:'2.1', label:g('metaLabel'), id:g('metaId'), memo:g('metaMemo'), created_at: new Date().toISOString() },
      world: { name:g('wName'), civilization:g('wCiv'), power:g('wPower'), taboo:g('wTaboo'), problem:g('wProblem') },
      characters: [
        { characterID:'CHAR_001', role:'protagonist', name:g('c1Name'), purpose:g('c1Purpose'), fear:g('c1Fear'), flaw:g('c1Flaw'), fight_reason:g('c1Fight') },
        { characterID:'CHAR_002', role:'heroine', name:g('c2Name'), relationship:g('c2Rel'), secret:g('c2Secret') },
      ],
      systems: sys,
      scenario: { first_incident:g('sIncident'), player_objective:g('sObjective'), chapter1_event:g('sChapter1') },
    };
  }
  function g(id) { return (document.getElementById(id)||{}).value?.trim() ?? ''; }

  function reqClear() { document.getElementById('dlg').classList.remove('hidden'); }
  function closeDlg() { document.getElementById('dlg').classList.add('hidden'); }
  function doClear() {
    document.querySelectorAll('input[type="text"],textarea').forEach(e => e.value = '');
    document.querySelectorAll('.sys-chip').forEach(c => { c.classList.remove('on'); c.querySelector('input').checked = false; });
    upd(); closeDlg();
  }

  function saveDraft() {
    const data = collect();
    window.parent.postMessage({ type:'mf-save', data }, '*');
    const btn = document.getElementById('saveBtn');
    const prev = btn.textContent; btn.textContent = '✓ 保存済';
    setTimeout(() => { btn.textContent = prev; }, 1800);
  }

  function doExport() {
    const data = collect();
    const filename = (data.meta.id || 'novel_sheet') + '_v21.json';
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    window.parent.postMessage({ type:'mf-export', filename, data }, '*');
  }

  upd();

  // セーブスロットからのロード
  window.addEventListener('message', function(e) {
    if (!e.data || e.data.type !== 'mf-load') return;
    var d = e.data.data;
    if (!d) return;
    function set(id, val) { var el = document.getElementById(id); if (el) el.value = val || ''; }
    set('metaLabel', d.meta && d.meta.label);
    set('metaId', d.meta && d.meta.id);
    set('metaMemo', d.meta && d.meta.memo);
    set('wName', d.world && d.world.name);
    set('wCiv', d.world && d.world.civilization);
    set('wPower', d.world && d.world.power);
    set('wTaboo', d.world && d.world.taboo);
    set('wProblem', d.world && d.world.problem);
    var c0 = d.characters && d.characters[0];
    var c1 = d.characters && d.characters[1];
    set('c1Name', c0 && c0.name);
    set('c1Purpose', c0 && c0.purpose);
    set('c1Fear', c0 && c0.fear);
    set('c1Flaw', c0 && c0.flaw);
    set('c1Fight', c0 && c0.fight_reason);
    set('c2Name', c1 && c1.name);
    set('c2Rel', c1 && c1.relationship);
    set('c2Secret', c1 && c1.secret);
    set('sIncident', d.scenario && d.scenario.first_incident);
    set('sObjective', d.scenario && d.scenario.player_objective);
    set('sChapter1', d.scenario && d.scenario.chapter1_event);
    var systems = d.systems || [];
    document.querySelectorAll('.sys-chip').forEach(function(chip) {
      var val = chip.dataset.v;
      var cb = chip.querySelector('input');
      var on = systems.indexOf(val) >= 0;
      cb.checked = on;
      chip.classList.toggle('on', on);
    });
    upd();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // TAB移動・フォーカス時にfooterと被らないようスクロール補正
  function ensureVisible(el) {
    requestAnimationFrame(function() {
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight;
      var FOOTER_H = 58;
      var HEADER_H = 72;
      var bottomLimit = vh - FOOTER_H - 12;
      var topLimit = HEADER_H + 8;
      if (rect.bottom > bottomLimit) {
        window.scrollBy({ top: rect.bottom - bottomLimit, behavior: 'smooth' });
      } else if (rect.top < topLimit) {
        window.scrollBy({ top: rect.top - topLimit, behavior: 'smooth' });
      }
    });
  }
  document.querySelectorAll('input[type="text"], textarea').forEach(function(el) {
    el.addEventListener('focus', function() { ensureVisible(el); });
  });
</script>
</body>
</html>`

const eventSheetV11 = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>Event Sheet v1.1</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0d0f14; --surface: #131620; --elevated: #1a1d24; --border: #1e2128;
      --accent: #00d4cc; --accent-dim: rgba(0,212,204,0.13);
      --done: #22c55e; --warning: #ff6b35; --purple: #a78bfa;
      --text-hi: #fff; --text-mid: #888; --text-lo: #444;
      --radius: 12px; --radius-sm: 8px;
    }
    body { background:var(--bg); color:var(--text-hi); font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; line-height:1.6; padding-bottom:80px; max-width:600px; margin:0 auto; min-height:100dvh; }
    .sheet-header { position:sticky; top:0; background:var(--bg); border-bottom:1px solid var(--border); padding:12px 16px; display:flex; flex-direction:column; gap:8px; z-index:10; }
    .sheet-title { font-size:14px; font-weight:700; color:var(--accent); letter-spacing:0.05em; }
    .prog-row { display:flex; align-items:center; gap:10px; }
    .prog-track { flex:1; height:4px; background:var(--border); border-radius:9999px; overflow:hidden; }
    .prog-fill { height:100%; background:var(--accent); border-radius:9999px; transition:width 0.3s ease; }
    .prog-text { font-size:10px; color:var(--text-lo); font-family:monospace; white-space:nowrap; }
    .card { margin:12px 16px 0; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:16px; }
    .card-title { font-size:13px; font-weight:700; color:var(--text-hi); margin-bottom:14px; display:flex; align-items:center; gap:6px; }
    .divider { border:none; border-top:1px dashed var(--border); margin:4px 0 14px; }
    label { display:block; font-size:11px; color:var(--text-lo); margin-bottom:4px; letter-spacing:0.04em; }
    input[type="text"], textarea {
      width:100%; background:var(--elevated); color:var(--text-hi);
      border:1px solid var(--border); border-radius:var(--radius-sm);
      padding:11px 13px; font-size:15px; margin-bottom:12px;
      font-family:inherit; -webkit-appearance:none; transition:border-color 0.15s;
    }
    input[type="text"]:focus, textarea:focus { outline:none; border-color:var(--accent); }
    textarea { min-height:72px; resize:vertical; line-height:1.5; }
    /* キャラクター行 */
    .char-row { background:var(--elevated); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px; margin-bottom:10px; position:relative; }
    .char-row-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
    .char-num { font-family:monospace; font-size:10px; color:var(--accent); font-weight:700; letter-spacing:0.08em; }
    .char-remove { background:none; border:none; cursor:pointer; color:var(--text-lo); font-size:16px; line-height:1; padding:2px 6px; border-radius:4px; }
    .char-remove:active { color:var(--warning); }
    .char-fields input { margin-bottom:8px; }
    .char-fields input:last-child { margin-bottom:0; }
    .add-btn { display:flex; align-items:center; justify-content:center; gap:6px; width:100%; background:none; border:1px dashed var(--border); border-radius:var(--radius-sm); padding:10px; color:var(--text-lo); font-size:12px; cursor:pointer; margin-top:4px; transition:border-color 0.15s, color 0.15s; }
    .add-btn:active { border-color:var(--accent); color:var(--accent); }
    /* チップ選択 */
    .chip-row { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
    .chip { display:flex; align-items:center; gap:6px; background:var(--elevated); border:1px solid var(--border); border-radius:var(--radius-sm); padding:8px 14px; cursor:pointer; font-size:12px; color:var(--text-mid); user-select:none; -webkit-user-select:none; transition:border-color 0.15s, background 0.15s; }
    .chip input { display:none; }
    .chip.on { border-color:var(--accent); background:var(--accent-dim); color:var(--accent); font-weight:600; }
    /* ラジオチップ */
    .radio-row { display:flex; gap:8px; margin-bottom:12px; }
    .radio-chip { background:var(--elevated); border:1px solid var(--border); border-radius:var(--radius-sm); padding:8px 16px; cursor:pointer; font-size:12px; color:var(--text-mid); user-select:none; transition:border-color 0.15s, background 0.15s; }
    .radio-chip.on { border-color:var(--purple); background:rgba(167,139,250,0.13); color:var(--purple); font-weight:700; }
    /* 感情変化 */
    .emotion-row { display:grid; grid-template-columns:1fr auto 1fr; gap:8px; align-items:start; }
    .emotion-arrow { display:flex; align-items:center; justify-content:center; padding-top:12px; color:var(--text-lo); font-size:18px; }
    /* アクション */
    .actions { position:fixed; bottom:0; left:0; right:0; background:var(--bg); border-top:1px solid var(--border); padding:10px 16px; display:flex; gap:8px; z-index:10; }
    .btn { flex:1; padding:13px 6px; border:none; border-radius:var(--radius-sm); font-size:13px; font-weight:700; cursor:pointer; letter-spacing:0.04em; -webkit-tap-highlight-color:transparent; transition:transform 0.1s; }
    .btn:active { transform:scale(0.96); }
    .btn-clear { background:none; border:1px solid var(--border); color:var(--text-mid); }
    .btn-save { background:none; border:1px solid var(--done); color:var(--done); }
    .btn-export { background:var(--accent); color:#000; flex:1.6; }
    /* ダイアログ */
    .dialog-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.75); z-index:100; display:flex; align-items:center; justify-content:center; padding:24px; }
    .dialog-box { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:24px; width:100%; max-width:320px; }
    .dialog-title { font-size:15px; font-weight:700; margin-bottom:10px; }
    .dialog-msg { font-size:13px; color:var(--text-mid); margin-bottom:20px; line-height:1.6; }
    .dialog-row { display:flex; gap:10px; }
    .d-btn { flex:1; padding:12px; border-radius:var(--radius-sm); font-size:13px; font-weight:700; cursor:pointer; border:none; }
    .d-cancel { background:none; border:1px solid var(--border); color:var(--text-mid); }
    .d-confirm { background:var(--warning); color:#fff; }
    .hidden { display:none !important; }
    @media (min-width:600px) { .actions { left:50%; transform:translateX(-50%); width:600px; } }
  </style>
</head>
<body>

<header class="sheet-header">
  <div style="display:flex;align-items:center;gap:8px">
    <span style="font-size:18px">🎬</span>
    <span class="sheet-title">イベントシート v1.1</span>
  </div>
  <div class="prog-row">
    <div class="prog-track"><div class="prog-fill" id="pFill" style="width:0%"></div></div>
    <span class="prog-text" id="pText">0 / 13</span>
  </div>
</header>

<!-- 基本情報 -->
<section class="card">
  <div class="card-title"><span>📌</span> 基本情報</div>
  <label>章・話数</label>
  <input type="text" id="chapter" placeholder="例：第3章 第2話" oninput="upd()" />
  <label>サブタイトル</label>
  <input type="text" id="subtitle" placeholder="例：灰の騎士、再び立つ" oninput="upd()" />
  <label>場所・時間帯</label>
  <input type="text" id="locationTime" placeholder="例：魔導帝都 西区廃墟 / 夕暮れ" oninput="upd()" />
</section>

<!-- 登場人物 -->
<section class="card">
  <div class="card-title"><span>👥</span> 登場人物</div>
  <div id="charList"></div>
  <button class="add-btn" onclick="addChar()">＋ キャラクターを追加</button>
</section>

<!-- 構造 -->
<section class="card">
  <div class="card-title"><span>🏗</span> 構造</div>
  <label>説明（要約）：このイベントで起きること</label>
  <textarea id="summary" placeholder="例：主人公が廃墟でヒロインと再会し、互いの目的が交差する" oninput="upd()"></textarea>
  <hr class="divider" />
  <label>冒頭フック：どう読者を引き込むか</label>
  <textarea id="hook" placeholder="例：主人公が独り廃墟を歩くシーン→突然の物音" oninput="upd()"></textarea>
  <label>メイン：本文に書くこと・必須シーン</label>
  <textarea id="main" placeholder="例：ヒロインとの問答、過去の記憶がフラッシュバック" oninput="upd()"></textarea>
  <label>クライマックス：転換点・一番盛り上がる瞬間</label>
  <textarea id="climax" placeholder="例：ヒロインが妹の居場所を知っていると告白" oninput="upd()"></textarea>
  <label>ラスト：どう終わるか</label>
  <textarea id="ending" placeholder="例：二人が一時的に共闘を決断。月明かりの中を歩き出す" oninput="upd()"></textarea>
</section>

<!-- 感情 -->
<section class="card">
  <div class="card-title"><span>💫</span> 感情</div>
  <label>読者への感情ゴール</label>
  <input type="text" id="readerGoal" placeholder="例：切なさと希望が混在する余韻" oninput="upd()" />
  <label>主人公の感情変化</label>
  <div class="emotion-row">
    <div>
      <label style="margin-bottom:4px">冒頭</label>
      <input type="text" id="protStart" placeholder="例：孤独・怒り" oninput="upd()" style="margin-bottom:0" />
    </div>
    <div class="emotion-arrow">→</div>
    <div>
      <label style="margin-bottom:4px">ラスト</label>
      <input type="text" id="protEnd" placeholder="例：希望・決意" oninput="upd()" style="margin-bottom:0" />
    </div>
  </div>
</section>

<!-- この作品固有 -->
<section class="card">
  <div class="card-title"><span>⚡</span> この作品固有</div>
  <label>未来視の有無</label>
  <div class="radio-row" id="futureVisionRow">
    <div class="radio-chip on" data-v="なし" onclick="selectRadio('futureVisionRow',this,'futureVision')">なし</div>
    <div class="radio-chip" data-v="あり" onclick="selectRadio('futureVisionRow',this,'futureVision')">あり</div>
  </div>
  <input type="hidden" id="futureVision" value="なし" />
  <label>見えるもの（未来視ありの場合）</label>
  <input type="text" id="visionContent" placeholder="例：炎に包まれる帝都、崩れ落ちる塔" />
  <label>作るもの</label>
  <div class="chip-row" id="creationChips">
    <label class="chip" onclick="toggleChip(this)"><input type="checkbox" value="武器" />武器</label>
    <label class="chip" onclick="toggleChip(this)"><input type="checkbox" value="道具" />道具</label>
    <label class="chip" onclick="toggleChip(this)"><input type="checkbox" value="未完成品" />未完成品</label>
  </div>
</section>

<!-- 伏線 -->
<section class="card">
  <div class="card-title"><span>🔮</span> 伏線</div>
  <label>回収する伏線（前話から）</label>
  <textarea id="resolveFlag" placeholder="例：第1話で主人公が拾った紋章の意味が明かされる"></textarea>
  <label>新たに張る伏線</label>
  <textarea id="newFlag" placeholder="例：ヒロインの右手の傷→次章で言及"></textarea>
  <label>次章に伝えたいこと</label>
  <textarea id="nextChapter" placeholder="例：二人の共闘が始まる緊張感、敵組織の影" oninput="upd()"></textarea>
</section>

<!-- メモ -->
<section class="card" style="margin-bottom:16px">
  <div class="card-title"><span>📝</span> メモ</div>
  <textarea id="memo" placeholder="自由記述 — ト書き・BGMイメージ・参考URL etc." style="min-height:100px"></textarea>
</section>

<div class="actions">
  <button class="btn btn-clear" onclick="reqClear()">クリア</button>
  <button class="btn btn-save" id="saveBtn" onclick="saveDraft()">保存</button>
  <button class="btn btn-export" onclick="doExport()">⬇ Export</button>
</div>

<div class="dialog-overlay hidden" id="dlg">
  <div class="dialog-box">
    <div class="dialog-title">入力をクリアしますか？</div>
    <div class="dialog-msg">すべての入力内容が削除されます。<br>この操作は元に戻せません。</div>
    <div class="dialog-row">
      <button class="d-btn d-cancel" onclick="closeDlg()">キャンセル</button>
      <button class="d-btn d-confirm" onclick="doClear()">クリア</button>
    </div>
  </div>
</div>

<script>
  // =============================================
  // キャラクター行
  // =============================================
  var charCount = 0;
  function addChar(data) {
    charCount++;
    var row = document.createElement('div');
    row.className = 'char-row';
    row.dataset.idx = charCount;
    row.innerHTML =
      '<div class="char-row-header">' +
        '<span class="char-num">CHAR ' + String(charCount).padStart(2,'0') + '</span>' +
        '<button class="char-remove" onclick="removeChar(this)" aria-label="削除">×</button>' +
      '</div>' +
      '<div class="char-fields">' +
        '<input type="text" placeholder="名前" oninput="upd()" value="'+(data&&data.name||'')+'" />' +
        '<input type="text" placeholder="状態・心情" oninput="upd()" value="'+(data&&data.state||'')+'" />' +
        '<input type="text" placeholder="この話での役割" oninput="upd()" value="'+(data&&data.role||'')+'" />' +
      '</div>';
    document.getElementById('charList').appendChild(row);
    // TABスクロール補正を新要素にも適用
    row.querySelectorAll('input[type="text"]').forEach(function(el) {
      el.addEventListener('focus', function() { ensureVisible(el); });
    });
    upd();
  }
  function removeChar(btn) {
    btn.closest('.char-row').remove();
    upd();
  }
  // 初期2行
  addChar(); addChar();

  // =============================================
  // ラジオ・チップ
  // =============================================
  function selectRadio(rowId, el, hiddenId) {
    document.querySelectorAll('#'+rowId+' .radio-chip').forEach(function(c){ c.classList.remove('on'); });
    el.classList.add('on');
    document.getElementById(hiddenId).value = el.dataset.v;
  }
  function toggleChip(el) {
    el.classList.toggle('on');
  }

  // =============================================
  // 進捗
  // =============================================
  var REQ = ['chapter','subtitle','locationTime','summary','hook','main','climax','ending','readerGoal','protStart','protEnd','nextChapter'];
  var TOTAL = REQ.length + 1; // +1 for at least one character name

  function upd() {
    var filled = REQ.filter(function(id){ var e=document.getElementById(id); return e&&e.value.trim(); }).length;
    var hasChar = document.querySelector('#charList .char-fields input[placeholder="名前"]') &&
                  document.querySelector('#charList .char-fields input[placeholder="名前"]').value.trim();
    if (hasChar) filled++;
    var pct = Math.round(filled / TOTAL * 100);
    document.getElementById('pFill').style.width = pct + '%';
    document.getElementById('pText').textContent = filled + ' / ' + TOTAL;
  }

  // =============================================
  // データ収集
  // =============================================
  function collect() {
    var chars = [];
    document.querySelectorAll('#charList .char-row').forEach(function(row) {
      var inputs = row.querySelectorAll('.char-fields input');
      chars.push({ name: inputs[0].value.trim(), state: inputs[1].value.trim(), role: inputs[2].value.trim() });
    });
    var creation = [];
    document.querySelectorAll('#creationChips .chip.on input').forEach(function(cb){ creation.push(cb.value); });
    return {
      meta: { schema_version:'event-1.1', title: g('subtitle') || 'イベントシート', created_at: new Date().toISOString() },
      basic: { chapter: g('chapter'), subtitle: g('subtitle'), location_time: g('locationTime') },
      characters: chars,
      structure: { summary: g('summary'), hook: g('hook'), main: g('main'), climax: g('climax'), ending: g('ending') },
      emotion: { reader_goal: g('readerGoal'), protagonist_change: { start: g('protStart'), end: g('protEnd') } },
      work_specific: { future_vision: document.getElementById('futureVision').value, vision_content: g('visionContent'), creation: creation },
      foreshadowing: { resolve: g('resolveFlag'), new_flag: g('newFlag'), next_chapter: g('nextChapter') },
      memo: g('memo'),
    };
  }
  function g(id) { return (document.getElementById(id)||{}).value?.trim() ?? ''; }

  // =============================================
  // クリア
  // =============================================
  function reqClear() { document.getElementById('dlg').classList.remove('hidden'); }
  function closeDlg() { document.getElementById('dlg').classList.add('hidden'); }
  function doClear() {
    document.querySelectorAll('input[type="text"],textarea').forEach(function(e){ e.value=''; });
    document.getElementById('charList').innerHTML = ''; charCount = 0;
    addChar(); addChar();
    document.querySelectorAll('.chip').forEach(function(c){ c.classList.remove('on'); });
    selectRadio('futureVisionRow', document.querySelector('#futureVisionRow [data-v="なし"]'), 'futureVision');
    upd(); closeDlg();
  }

  // =============================================
  // 保存
  // =============================================
  function saveDraft() {
    window.parent.postMessage({ type:'mf-save', data: collect() }, '*');
    var btn = document.getElementById('saveBtn');
    var prev = btn.textContent; btn.textContent = '✓ 保存済';
    setTimeout(function(){ btn.textContent = prev; }, 1800);
  }

  // =============================================
  // Export
  // =============================================
  function doExport() {
    var data = collect();
    var filename = (data.basic.chapter || 'event').replace(/\s+/g,'-') + '_event_v11.json';
    var blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href=url; a.download=filename; a.click();
    URL.revokeObjectURL(url);
    window.parent.postMessage({ type:'mf-export', filename:filename, data:data }, '*');
  }

  // =============================================
  // ロード（セーブスロットから）
  // =============================================
  window.addEventListener('message', function(e) {
    if (!e.data || e.data.type !== 'mf-load') return;
    var d = e.data.data; if (!d) return;
    function set(id,val){ var el=document.getElementById(id); if(el) el.value=val||''; }
    var b = d.basic||{};
    set('chapter', b.chapter); set('subtitle', b.subtitle); set('locationTime', b.location_time);
    var st = d.structure||{};
    set('summary', st.summary); set('hook', st.hook); set('main', st.main); set('climax', st.climax); set('ending', st.ending);
    var em = d.emotion||{}; var pc = em.protagonist_change||{};
    set('readerGoal', em.reader_goal); set('protStart', pc.start); set('protEnd', pc.end);
    var ws = d.work_specific||{};
    set('visionContent', ws.vision_content);
    if (ws.future_vision) {
      var radioEl = document.querySelector('#futureVisionRow [data-v="'+ws.future_vision+'"]');
      if (radioEl) selectRadio('futureVisionRow', radioEl, 'futureVision');
    }
    document.querySelectorAll('#creationChips .chip').forEach(function(chip){
      var val = chip.querySelector('input').value;
      var on = (ws.creation||[]).indexOf(val)>=0;
      chip.classList.toggle('on', on);
    });
    var fr = d.foreshadowing||{};
    set('resolveFlag', fr.resolve); set('newFlag', fr.new_flag); set('nextChapter', fr.next_chapter);
    set('memo', d.memo);
    // キャラクター
    document.getElementById('charList').innerHTML=''; charCount=0;
    (d.characters||[]).forEach(function(c){ addChar(c); });
    if (charCount === 0) { addChar(); addChar(); }
    upd();
    window.scrollTo({top:0,behavior:'smooth'});
  });

  // =============================================
  // TABスクロール補正
  // =============================================
  function ensureVisible(el) {
    requestAnimationFrame(function() {
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight;
      var FOOTER_H = 58; var HEADER_H = 72;
      if (rect.bottom > vh - FOOTER_H - 12) {
        window.scrollBy({ top: rect.bottom - (vh - FOOTER_H - 12), behavior:'smooth' });
      } else if (rect.top < HEADER_H + 8) {
        window.scrollBy({ top: rect.top - (HEADER_H + 8), behavior:'smooth' });
      }
    });
  }
  document.querySelectorAll('input[type="text"], textarea').forEach(function(el) {
    el.addEventListener('focus', function(){ ensureVisible(el); });
  });
</script>
</body>
</html>`

export const DEFAULT_HTML: HtmlEntry[] = [
  {
    id: 'scenario-sheet-v11',
    filename: 'scenario_sheet_v1.1.html',
    html: scenarioSheetV11,
    createdAt: '2026-04-13T00:00:00Z',
  },
  {
    id: 'novel-sheet-v21',
    filename: 'novel_sheet_v2.1.html',
    html: novelSheetV21,
    createdAt: '2026-05-12T00:00:00Z',
  },
  {
    id: 'event-sheet-v11',
    filename: 'event_sheet_v1.1.html',
    html: eventSheetV11,
    createdAt: '2026-05-12T00:00:00Z',
  },
]
