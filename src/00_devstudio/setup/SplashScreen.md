# 追加実装依頼書 — SplashScreen

# 対象: 既存プロジェクト (100min-sprint) への追加

# 作成日：2026-04-29

---

## 概要

アプリ起動時のローディング画面を追加する。既存の実装には手を加えず、新規ファイルの追加とルーター変更のみで完結させること。

---

## 変更ファイル一覧

```
追加:
  src/screens/SplashScreen.tsx

変更:
  src/router.tsx   （ / をSplashScreenに差し替え）
```

---

## SplashScreen 仕様

### ファイル

```
src/screens/SplashScreen.tsx
```

### レイアウト（縦方向）

```
┌─────────────────────────┐  ← 375px / 背景 #0D0F14 / min-height: 100dvh
│                         │
│     [装飾リング x2]      │  ← position:absolute、薄いcyan、演出用
│                         │
│     [円形タイマーリング] │  ← SVGで自前実装
│       42 : 30            │  ← mm:ss 大テキスト
│         42%              │  ← パーセント 小テキスト
│                         │
│     [ドット x3]          │  ← ローディングインジケーター
│                         │
│  ┌─────────────────────┐│
│  │ ✓ コンポーネント設計 DONE  ›││  ← タスクカード1
│  ├─────────────────────┤│
│  │ ▶ Stepper実装  DOING ›││  ← タスクカード2（アクティブ）
│  ├─────────────────────┤│
│  │ 3  Timer store 接続 TODO ›││  ← タスクカード3
│  └─────────────────────┘│
│                         │
└─────────────────────────┘
```

---

## アニメーション仕様

### シーケンス

```
0.0s  リング進捗: 0% → 現在値へ（2.0秒 ease-in-out）
0.0s  タイマー数値: 00:00 → 現在値へ同期カウントアップ
0.0s  ドットインジケーター: 260ms間隔で左→右→左と点滅
2.0s  アニメーション停止、ドット停止
2.2s  タスクカード1枚目フェードイン（opacity 0→1, translateY 14px→0）
2.3s  タスクカード2枚目フェードイン
2.4s  タスクカード3枚目フェードイン
5.4s  自動遷移: navigate('/sprint')（カード表示から3秒後）
```

### 数値の取得元

```typescript
// timerStore から取得
const elapsed = useTimerStore((s) => s.elapsed); // 秒
const isRunning = useTimerStore((s) => s.isRunning);

// sprintStore から取得
const sprint = useSprintStore((s) => s.sprints.find((sp) => sp.sprintId === s.activeSprint));
const duration = sprint?.duration ?? 100; // 分
```

---

## 円形タイマーリング（SVG）

```typescript
const RADIUS = 96;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 603.2

// 進捗率
const progress = elapsed / (duration * 60); // 0〜1

// strokeDashoffset
const offset = CIRCUMFERENCE * (1 - progress);
```

```tsx
<svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: "rotate(-90deg)" }}>
  {/* トラック */}
  <circle cx="110" cy="110" r={RADIUS} fill="none" stroke="#1A1D24" strokeWidth="5" />

  {/* グロー（装飾） */}
  <circle
    cx="110"
    cy="110"
    r={RADIUS}
    fill="none"
    stroke="#00D4CC"
    strokeWidth="13"
    strokeLinecap="round"
    opacity="0.06"
    strokeDasharray={CIRCUMFERENCE}
    strokeDashoffset={offset}
  />

  {/* 進捗arc */}
  <circle
    cx="110"
    cy="110"
    r={RADIUS}
    fill="none"
    stroke="#00D4CC"
    strokeWidth="5"
    strokeLinecap="round"
    strokeDasharray={CIRCUMFERENCE}
    strokeDashoffset={offset}
    style={{ transition: "stroke-dashoffset 0.04s linear" }}
  />
</svg>
```

---

## タスクカード

### データ取得ロジック

```typescript
// activeSprint の tasks から表示する3枚を選ぶ
function getDisplayTasks(tasks: Task[]): Task[] {
  const doingIdx = tasks.findIndex((t) => t.status === "DOING");
  if (doingIdx === -1) {
    // DOINGがなければ先頭から3枚
    return tasks.slice(0, 3);
  }
  const start = Math.max(0, doingIdx - 1);
  return tasks.slice(start, start + 3);
}
```

### カードUI

```tsx
// 1枚のカード
<div
  onClick={() => handleCardTap(task)}
  style={{
    opacity: task.status === "DONE" ? 0.45 : 1,
    pointerEvents: task.status === "DONE" ? "none" : "auto"
  }}>
  {/* 左: ステータスアイコン */}
  <StatusIcon status={task.status} />

  {/* 中: タイトル + メタ */}
  <div>
    <p>{task.title}</p>
    <p>
      {task.id} · 推定 {task.estimate}min
    </p>
  </div>

  {/* 右: バッジ + 矢印 */}
  <StatusBadge status={task.status} />
  <span>›</span>
</div>
```

### StatusIcon の色定義

```
DONE    → 背景 #22C55E18 / 文字 #22C55E / 表示: ✓
DOING   → 背景 #00D4CC22 / 文字 #00D4CC / 表示: ▶
TODO    → 背景 #1E2128   / 文字 #444444 / 表示: 数字
```

### タップ時の処理

```typescript
function handleCardTap(task: Task) {
  if (task.status === "DONE") return; // タップ不可

  if (task.status === "TODO") {
    // TODOをDOINGに変更してから遷移
    checkStep(task.id); // sprintStoreのaction
  }

  navigate(`/task/${task.id}`);
}
```

---

## ルーター変更

### src/router.tsx

```typescript
// 変更前
{ path: '/', element: <SprintBoard /> }

// 変更後
{ path: '/',       element: <SplashScreen /> },
{ path: '/sprint', element: <SprintBoard /> },
{ path: '/task/:id', element: <SprintBoard /> },
```

> SprintBoard側で useParams の id を受け取り、該当TaskまでscrollIntoViewする処理が既にある場合はそのまま流用。

---

## 再表示制御（2回目以降スキップ）

```typescript
// sessionStorage を使う（タブを閉じたらリセット）
const SPLASH_KEY = "splash_shown";

useEffect(() => {
  if (sessionStorage.getItem(SPLASH_KEY)) {
    navigate("/sprint", { replace: true });
    return;
  }
  sessionStorage.setItem(SPLASH_KEY, "1");
  // アニメーション開始
}, []);
```

---

## スタイル規則

```
背景色    : #0D0F14（var(--color-bg-primary)と同値）
アクセント: #00D4CC（var(--color-accent)と同値）
完了色    : #22C55E（var(--color-done)と同値）
ボーダー  : #1E2128（var(--color-border)と同値）
フォント  : var(--font-mono)
幅       : 375px固定（AppShellと同じ）
```

---

## Done定義

```
□ アプリ起動（/）でSplashScreenが表示される
□ タイマーリングが0%から現在値へアニメーションする
□ 数値（mm:ss）がリングと同期してカウントアップする
□ タスクカード3枚が時間差でフェードインする
□ DOINGカードタップ → /task/:id へ遷移する
□ TODOカードタップ → status変更後 /task/:id へ遷移する
□ DONEカードはタップ不可（opacity低下）
□ カード表示から3秒後に自動で /sprint へ遷移する
□ 2回目以降の起動でSplashがスキップされ /sprint へ直行する
□ npm run build がエラーなし
```

---

_既存コードへの影響範囲: router.tsx の / パスのみ_ _最終更新：2026-04-29_
