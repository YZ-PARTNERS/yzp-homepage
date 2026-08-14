# YZ PARTNERS コーポレートホームページ 開発ルール

## プロジェクト概要

YZ PARTNERS のコーポレートホームページ。シンプル・誠実・プロフェッショナルなデザインを基本方針とする。
全体的に **ダークテーマ（#0a0a0f 系）** で統一。アクセントはミントグリーン（#00C896）。

## 担当ファイル

| ファイル | 役割 |
|---|---|
| `index.html` | メインHTML構造 |
| `style.css` | スタイル定義 |
| `script.js` | インタラクション・動作 |

## クラス名一覧

| クラス名 | 対応セクション |
|---|---|
| `.navbar` | グローバルナビゲーション |
| `.hero-section` | トップのヒーローエリア |
| `.services-section` | サービス紹介セクション |
| `.results-section` | 実績セクション |
| `.cases-section` | 事例セクション |
| `.about-section` | 私たちについてセクション |
| `.news-section` | ニュースセクション |
| `.contact-section` | お問い合わせセクション |

クラス名は上記に統一すること。新たなセクションを追加する場合も `*-section` の命名規則に従う。

---

## カラーパレット

### CSS カスタムプロパティ（:root）

```css
:root {
  --color-main: #FFFFFF;        /* テキスト・見出し（ダーク背景上） */
  --color-bg: #f0ede8;          /* ページ背景（ベージュ）※サブページで使用 */
  --color-bg-light: #f0ede8;    /* セクション背景（--color-bg と同値） */
  --color-accent: #00C896;      /* アクセント（ロゴカラー：ミントグリーン） */
  --color-accent-hover: #00DBA9; /* アクセントhover（少し明るいミントグリーン） */
  --color-text: #0a0a0f;        /* 本文テキスト（ほぼ黒） */
  --color-text-muted: #6b6b72;  /* 補足・リード文など */
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.07);
  --shadow-card-hover: 0 12px 36px rgba(0, 0, 0, 0.13);
  --radius: 6px;
  --transition: 0.25s ease;
}
```

### セクション背景色パターン

**index.html は全セクション ダークテーマで統一**：

| セクション | 背景色 |
|---|---|
| `.hero-section` | `#0a0a0f` |
| `.services-section` | `#0a0a0f` |
| `.results-section` | `#0a0a0f` |
| `.cases-section` | `#0a0a0f` |
| `.about-section` | `#0a0a0f` |
| `.news-section` | `#0a0a0f` |
| `.contact-section` | `#0a0a0f` |
| `.footer` | `#0a0a0a` |
| `.service-recommend-section` | `#0d0d12` |

**ラジアルグラデーション（複数セクション共通装飾）**：

```css
background:
  radial-gradient(ellipse 60% 55% at 8% 50%, rgba(0, 200, 150, 0.22) 0%, transparent 55%),
  radial-gradient(ellipse 45% 60% at 92% 30%, rgba(0, 200, 150, 0.14) 0%, transparent 50%),
  #0a0a0f;
```

---

## フォント

Google Fonts の日本語対応フォントを使用する。

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
```

```css
body {
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 400;
  color: #0a0a0f;
  background: #f0ede8;
  line-height: 1.8;
  -webkit-font-smoothing: antialiased;
}
```

- 本文：`font-weight: 400`
- サブ見出し・ボタン：`font-weight: 500`
- 見出し・強調：`font-weight: 700`

---

## ナビゲーションバー

```css
.navbar {
  background-color: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  height: 68px;
}
.navbar__list li a {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
}
/* hover: アンダーライン（2px solid #00C896）がwidth 0→100% */
/* モバイルhover: color #00C896、padding-left 40px */
```

---

## ボタンデザイン

### 標準CTAボタン（Hero / Contact Submit / More）

```css
padding: 16px 48px;
border: 1px solid rgba(255, 255, 255, 0.5);
color: #FFFFFF;
background: transparent;
border-radius: 6px;
font-weight: 500;
font-size: 0.88rem;
letter-spacing: 0.16em;
position: relative;
overflow: hidden;

/* hover */
background: rgba(255, 255, 255, 0.1);
border-color: rgba(255, 255, 255, 0.85);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
transform: translateY(-2px);
```

### シマーエフェクト（::before）

```css
@keyframes shimmerPass {
  from { transform: translateX(-120%) skewX(-20deg); }
  to   { transform: translateX(220%) skewX(-20deg); }
}

.btn::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 45%; height: 100%;
  background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
  animation: shimmerPass 0.65s ease forwards; /* またはループ: 2.8s ease-in-out infinite */
}
```

---

## カードデザイン

### Glassmorphism カード（サービスセクション等）

```css
padding: 40px 32px;
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.09);
border-radius: 6px; /* = var(--radius) */

/* hover */
background: rgba(255, 255, 255, 0.09);
border-color: rgba(0, 200, 150, 0.5);
transform: translateY(-10px);
box-shadow: 0 0 0 1px rgba(0, 200, 150, 0.2), 0 24px 60px rgba(0, 0, 0, 0.55);
```

### パネルカード（aboutセクション・4パネル）

```css
background: #1a1a1a;
border: 1px solid rgba(255, 255, 255, 0.09);
border-radius: 8px;
min-height: 280px;
padding: 40px;

/* hover */
background: #252525;
border-color: #00C896;
transform: translateY(-4px);
box-shadow: var(--shadow-card-hover);
```

---

## アニメーション

### heroFadeUp（ページロード時フェードイン）

```css
@keyframes heroFadeUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: none; }
}
/* duration: 0.9s ease */
```

### animate-on-scroll（スクロール連動フェードイン）

```css
/* 初期状態 */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
/* JS で .is-visible クラスを付与して発火 */
.animate-on-scroll.is-visible {
  opacity: 1;
  transform: none;
}
```

---

## レスポンシブ対応

ブレークポイントは **2段階**：

```css
/* モバイルファーストで記述する */

/* タブレット・デスクトップ */
@media (min-width: 768px) { ... }

/* ワイドデスクトップ */
@media (min-width: 1100px) { ... }

/* モバイルのみ上書き */
@media (max-width: 767px) { ... }
```

- モバイル：シングルカラム、padding 小
- 768px 以上：2〜3列グリッド、font-size 増加
- 1100px 以上：最大幅 `1100px`（セクション inner の max-width）、4列グリッド

---

## フッター

```css
.footer {
  background: #0a0a0a;
  color: rgba(255, 255, 255, 0.55);
  padding: 80px 32px; /* 768px以上: 80px 48px */
}
.footer a {
  color: #aaaaaa;
}
.footer a:hover {
  color: #ffffff;
}
.footer__copy {
  color: rgba(255, 255, 255, 0.22);
}
```

---

## コーディング規約

- インデント：スペース2つ
- CSSはセクション単位でコメント区切りを入れる（例：`/* === NAVBAR === */`）
- JavaScriptは `DOMContentLoaded` イベント内にまとめる
- 外部ライブラリは原則使用しない（Google Fontsは除く）
- `script.js` は直接編集しない。ページ固有のスクリプトはインラインで追記する

---

## 実装済み機能・変更履歴（2026-04-08 セッション）

### お問い合わせフォーム（Formspree 連携）

- Formspree ID: `xpqolqvp`（送信先: info@yz-partners.co.jp）
- 静的サイトのため、フォーム送信は Formspree の AJAX API を使用
- 各ページ末尾に以下のインラインスクリプトを追加（`script.js` は触らない）：

```js
const FORMSPREE_ID = 'xpqolqvp';
const contactForm = document.querySelector('.contact-section__form');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.stopImmediatePropagation(); e.preventDefault();
    const submitBtn = contactForm.querySelector('.contact-section__submit');
    const originalText = submitBtn.textContent;
    const required = contactForm.querySelectorAll('[required]');
    let valid = true;
    required.forEach((el) => {
      if (el.type === 'checkbox' && !el.checked) valid = false;
      else if (el.type !== 'checkbox' && !el.value.trim()) valid = false;
    });
    if (!valid) { alert('必須項目をすべてご入力ください。'); return; }
    submitBtn.disabled = true; submitBtn.textContent = '送信中…';
    try {
      const res = await fetch('https://formspree.io/f/' + FORMSPREE_ID, {
        method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(contactForm)
      });
      if (res.ok) { contactForm.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.85);padding:40px 0;line-height:2">お問い合わせを受け付けました。<br>担当者よりご連絡いたします。</p>'; }
      else { throw new Error(); }
    } catch { alert('送信に失敗しました。しばらく経ってから再度お試しください。'); submitBtn.disabled = false; submitBtn.textContent = originalText; }
  }, true);
}
```

- 送信ボタンは `.contact-section__field--full` に `text-align: center` を付与して中央寄せ

### ファイル一覧

| ファイル | 状態 | 主な変更内容 |
|---|---|---|
| `index.html` | 更新 | 「私たちについて」4パネル化、フッター修正、採用情報リンク追加、Formspree スクリプト追加 |
| `style.css` | 更新 | パネル・サービスページ・CTA等のスタイル追加・修正 |
| `about.html` | 更新（ユーザー編集） | 会社概要スタンドアロンページ |
| `vision.html` | 新規作成 | ビジョン・ミッション・価値観ページ、お問い合わせフォーム付き |
| `message.html` | 新規作成 | 代表挨拶ページ、プロフィール・経歴・お問い合わせフォーム付き |
| `cases.html` | 更新 | CTA→お問い合わせフォームに置き換え、フッターロゴ修正、採用情報リンク追加 |
| `case-01/02/03.html` | 更新 | CTAボタンをシマーデザインに統一、フッターロゴ修正 |
| `service-ax/dx/pmo/ai.html` | 更新 | ダークテーマ統一、CTAセクション→お問い合わせフォームに置き換え、フッターロゴ修正 |
| `news.html` / `news-01〜04.html` | 更新 | フッターロゴ修正 |
| `members.html` | 更新 | フッターロゴ修正 |

### 「私たちについて」セクション（index.html）

4パネルグリッド構成（2列×2行、`max-width: 800px`）：

| パネル | 背景素材 | リンク先 |
|---|---|---|
| 会社概要 | 動画: `黒 シンプル 東京 YouTube 動画.mp4` | `about.html#company` |
| ビジョン | 動画: `Blue and Pink Modern Thanks for Watching Video.mp4` | `vision.html` |
| メンバー紹介 | 動画: `White Blue Minimalist Join the Business Video (1).mp4` | `members.html` |
| 代表挨拶 | 画像: `Zhang.JPG` (object-position: center top) | `message.html` |

- 動画背景：`<video>` を `position: absolute` で配置し `.about-section__panel--video` クラスで制御
- 画像背景：`background-image` + `overflow: hidden` で制御（`::after` の `border-radius` は削除済み）
- hover 時：アクセントカラー枠線（`#00C896`）+ `translateY(-4px)` アニメーション
- 通常時：グレー枠線（`rgba(255,255,255,0.09)`）

### サービスページ ダークテーマ統一

サービスページ（service-ax/dx/pmo/ai.html）のセクション背景を index.html に合わせてダークテーマに統一：

- `.service-overview-section`：背景 `#0a0a0f` + radial gradient、ガラスカード
- `.service-recommend-section`：背景 `#0d0d12`、ガラスカード
- `.service-cta-section`：ダーク背景、シマーボタン

### フッター修正

- フッターロゴ：全ページで `image/logo_2619300_print.png` に統一（旧: `IMG_6662.PNG`）
- `index.html` / `cases.html` / `about.html` のフッターカラムラベルは英語サブスパン付き構造（`footer__col-label-en` / `footer__col-label-ja`）
- その他ページ（vision.html, message.html 等）はシンプルな日本語のみのラベル
- 採用情報（`recruit.html`）リンクをナビバー・フッターに追加（index.html, cases.html, about.html）

### 代表挨拶パネルの枠線バグ修正

- **問題**: `::after` オーバーレイに `border-radius: 8px` + `inset: 0` を設定すると、親要素の角丸部分で枠線が途切れる
- **修正**: `.about-section__panel--bg-img` に `overflow: hidden` を追加し、`::after` および `.about-section__panel-overlay` の `border-radius` を削除

### Vercel デプロイ

- Vercel CLI は未インストール
- Web UI（vercel.com/new）から GitHub リポジトリを連携してデプロイすることを案内済み
- 静的サイトのためフレームワーク指定不要、ルートディレクトリそのまま

### 未作成ページ

- `recruit.html`：採用情報ページ。ナビバーおよびフッターからリンク済みだが、ページ本体は未作成。

---

## LP「a tenth（アテンス）」（2026-08-07 セッション）

### `a-tenth.html` — リード獲得用ランディングページ

- **サービス内容**: マッキンゼー・BCG・アクセンチュア・Big4等ビッグファーム出身コンサルタントを低稼働（10〜30%）・低価格（月14〜40万円）でお試し活用できる中小企業向けサービス。AIサービス導入（500〜2000万円規模）受注への「入り口」という位置づけ（大きく儲けない前提）。
- **サービス名**: 「a tenth（アテンス）」= 英語で「10分の1」。価格破壊（従来の1/10）に由来
- **フローティングCTA**: 白カード（`.lp-float-cta__btn`）に代表・清川の全身写真（`image/ceo-standing.png`）を入れ、下辺にアクセント色のバー「CEO清川に相談する」を付けた縦型カード。
  - **写真は加工しない方針**（ユーザー指示）。背景透明化を試すと白シャツ・腕まで削れるため禁止。元画像 `ceo_standing.png`（純白背景・アルファなし）に対し、縦方向の余白トリミングとリサイズのみ実施（369×440px）。白背景はカードの白地と同化させて活用する
  - `image/ceo-avatar.jpg`（顔クロップ丸アバター）は旧版で現在未使用
- **構成**: ヒーロー → 課題共感(PROBLEM) → 選ばれる理由(WHY) → 価格比較(PRICE) → 料金プラン(PLAN: 10%/14万・20%/27万・30%/40万) → 実績(TRUST) → 活用シーン(USE CASE) → 利用の流れ(FLOW) → FAQ → 日程調整(RESERVE)
- **実装方針**:
  - `style.css` を読み込み、LP固有スタイルは `<head>` 内の `<style>` にインライン記述（クラス名は `lp-*-section` 規則）
  - ヘッダー・フッターは既存サイトと共通の `.navbar` / `.footer` を使用
  - CTAボタンはアクセント塗りつぶし（`.lp-cta-btn`、シマーループ 2.8s infinite）。リンク先は `#contact`（RESERVEセクション）
  - フローティングCTA（`.lp-float-cta`）はRESERVEセクション表示中に自動非表示
  - CVは TimeRex 埋め込みウィジェットで日程調整（`#timerex_calendar`、URL: timerex.net/s/kiyokawa.0712_fd05/9671619e）。お問い合わせフォーム（Formspree）は廃止済み
  - FAQ は `<details>` を Web Animations API でスムーズ開閉（インラインスクリプト）
- どこからもリンクされていない独立LP（広告・営業用URL想定）
- **出身ファームロゴマーキー**: ヒーロー下部に `image/logos/`（mckinsey / bcg / accenture / kearney / deloitte / pwc / kpmg / ey / baycurrent / sigmaxyz / northsand / fpt の透明PNG、高さ80px）を左→右に流す無限ループ（`.lp-logo-marquee`、48s linear）。bain.png はファイルとして残っているがマーキーからは除外済み（ユーザー指示）。ダーク背景で視認できるよう `filter: brightness(0) invert(1)` で白色モノクロ化（この1行を消せば元のカラーロゴに戻る）。ロゴ元画像の白背景透明化は sharp の白マット除去スクリプトで実施

### ローカルプレビュー

- `.claude/launch.json` に `static-site`（npx http-server ポート8123）を定義済み

---

## LP刷新「サブスク参謀」「ゼロイチ伴走」（2026-08-14 セッション・lp-renewalブランチ）

### 概要

`a-tenth.html` を2つのサービスLPに分割するリニューアル。修正仕様は `G:\マイドライブ\Claude\LP修正内容_a-tenth.md` に集約。

| ファイル | 役割 |
|---|---|
| `sanbo.html` | LP-A「サブスク参謀」— 社長の右腕をつくる経営参謀サービス |
| `launch.html` | LP-B「ゼロイチ伴走」— 新規事業立ち上げ伴走サービス |
| `request-thanks.html` | 資料請求サンクスページ（TimeRex埋め込み・noindex） |
| `lp-shared.css` | 上記3ページ共通の白テーマスタイル |

### ⚠️ ダークテーマ例外ルール

この3ページは **白背景テーマ（`.lpw-body`）** で、サイト全体のダークテーマ統一ルールの例外。
ナビバー・フッターは共通の `style.css`（ダーク）をそのまま使用。白テーマの色変数は `lp-shared.css` の `.lpw-body` に定義（`--lpw-*`）。アクセントはミントグリーンを継承しつつ、白背景上の小さめテキストにはコントラスト確保のため濃色 `--lpw-accent-text: #009270` を使用。

### 主な仕様（旧 a-tenth.html との差分）

- CV は全て「資料請求する」（旧: 無料相談）。フォームは Formspree（ID: `xpqolqvp`）AJAX送信 → `request-thanks.html` にリダイレクト。hidden の `service` / `_subject` でどちらのLPからの請求か判別
- 金額表示は「月20万円〜」に統一。料金プラン（LIGHT/STANDARD/GROWTH）セクションは廃止
- 「価格破壊」「稼働率」という言葉は使用禁止（削除済み）
- FVの数字コンテンツ（稼働率など）は削除
- 選ばれる理由: ①大手ファーム出身トップ10%（実績審査・ケース面接）②1ヶ月単位・最短1週間・初期費用0円 ③実行伴走
- コンサルタント紹介は横スクロールカルーセル（`.lp-members-section__track`、scroll-snap + PC用矢印ボタン）。プロフィールは members.html から流用
- ロゴマーキーは白背景なので `invert` フィルタなし（カラーのまま）。bain.png は除外（既存方針）
- TimeRex はサンクスページのみ。白背景なので invert フィルタ不要
- 資料送付メールの自動化は未実装（Formspree の自動返信 or 手動運用。要検討）
- 旧 `a-tenth.html` は現状維持。公開時のリダイレクト/振り分けは未決定
