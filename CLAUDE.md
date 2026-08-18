# YZ PARTNERS コーポレートホームページ 開発ルール

## プロジェクト概要

YZ PARTNERS のコーポレートホームページ。シンプル・誠実・プロフェッショナルなデザインを基本方針とする。
全体的に **白テーマ（#FFFFFF / #F6F8FA）** で統一。アクセントはミントグリーン（#00C896）。

> 2026-08-15 に全ページをダークテーマ（#0a0a0f 系）から白テーマへ刷新した。
> 配色の実体は `style.css` の `:root` に一本化してある。旧ダークテーマの記述が
> 残っている箇所があれば、それは古い情報。

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

配色の実体は `style.css` の `:root` に一本化されている。**色をベタ書きせず、必ずこの変数を参照すること。**

```css
:root {
  /* サーフェス */
  --color-bg: #FFFFFF;             /* ページ地色・セクション背景（明） */
  --color-bg-alt: #F6F8FA;         /* セクション背景（交互に使う淡いグレー） */
  --color-bg-light: #F6F8FA;       /* 旧名の互換 */
  --color-surface: #F6F8FA;        /* カード面 */
  --color-surface-hover: #EEF2F6;  /* カード面 hover */

  /* テキスト */
  --color-main: #0F1E3D;           /* 見出し（旧ダークテーマでは白だった） */
  --color-heading: #0F1E3D;
  --color-text: #2A3441;           /* 本文 */
  --color-text-muted: #626C7A;     /* 補足・リード文 */
  --color-muted: #626C7A;          /* 旧名の別名 */

  /* 境界 */
  --color-border: #E4E8EE;
  --color-border-strong: #D3DAE3;

  /* アクセント */
  --color-accent: #00C896;         /* ロゴカラー。面・装飾用 */
  --color-accent-hover: #00DBA9;
  --color-accent-text: #00785A;    /* 白背景で読ませる濃いめアクセント */

  --shadow-card: 0 4px 20px rgba(15, 30, 61, 0.06);
  --shadow-card-hover: 0 12px 36px rgba(15, 30, 61, 0.12);
  --radius: 6px;
  --transition: 0.25s ease;
}
```

### ⚠️ アクセント色の使い分け

ミントグリーン `--color-accent` (#00C896) は**白背景上で 2.16:1 しかない**。
文字色に使うと WCAG AA を満たさないため、**文字には必ず `--color-accent-text` (#00785A) を使う**。
`--color-accent` は塗り・枠線・装飾のみ。

### セクション背景色パターン

白（`--color-bg`）と淡グレー（`--color-bg-alt`）を**交互**に敷いてリズムをつくる。

| セクション（index.html） | 背景 |
|---|---|
| `.hero-section` | 白（背景動画＋白ベール0.62） |
| `.services-section` | `--color-bg` |
| `.results-section` | `--color-bg-alt` |
| `.cases-section` | `--color-bg` |
| `.about-section` | `--color-bg-alt` |
| `.news-section` | `--color-bg` |
| `.contact-section` | `--color-bg-alt` |
| `.footer` | 白＋ミント5%のグラデーション |

**ラジアルグラデーション（複数セクション共通装飾）**：

白地では濃い緑は汚れて見えるため、不透明度は **0.09 以下**に抑える。

```css
background:
  radial-gradient(ellipse 60% 55% at 8% 50%, rgba(0, 200, 150, 0.09) 0%, transparent 55%),
  radial-gradient(ellipse 45% 60% at 92% 30%, rgba(0, 200, 150, 0.05) 0%, transparent 50%),
  var(--color-bg);
```

### 例外：白文字を維持している箇所

暗い素材の上に文字を載せるため、ここだけ白文字を使う。

- `.about-section__panel-*`（「私たちについて」の動画・写真パネル4枚）
- `.hero-section__overlay` 配下ではなく、パネル内のタイトル・説明文

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
  color: var(--color-text);
  background-color: var(--color-bg);
  line-height: 1.8;
  -webkit-font-smoothing: antialiased;
}
```

- 本文：`font-weight: 400`
- サブ見出し・ボタン：`font-weight: 500`
- 見出し・強調：`font-weight: 700`

---

## ナビゲーションバー

全ページ共通。マークアップは `zeroichi-banso.html` のものを正とし、**9項目で統一**する。

サービス / サブスク参謀 / ゼロイチ伴走 / 実績 / 事例 / 私たちについて / ニュース / お問い合わせ / 採用情報

```css
.navbar {
  background-color: rgba(246, 253, 251, 0.85); /* 地色にテーマ色をうすくかけた半透明 */
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 200, 150, 0.18);
  height: 68px;
}
.navbar__list li a {
  color: var(--color-heading);
  font-size: 0.9rem;
}
.navbar__toggle span {
  background-color: #1F2A3A; /* 明るいナビバー上のハンバーガー線 */
}
/* hover: アンダーライン（2px solid #00C896）がwidth 0→100% */
```

**9項目は768px幅では横並びに収まらない。** そのため `style.css` に
`@media (min-width: 768px) and (max-width: 1099px)` でハンバーガー表示を維持する
ルールを置いている。ナビ項目を増減する場合はここも見直すこと。

---

## ボタンデザイン

### 標準CTAボタン

**サイト内の全CVボタンは同一仕様に統一されている。** 該当クラスは以下の4つ。

`.lp-cta-btn`（LP） / `.hero-section__cta` / `.contact-section__submit` / `.case-cta__btn` / `.service-cta-section__btn`

```css
padding: 18px 56px;
background-color: var(--color-accent);
color: #06382B;         /* 黒ではなく地色と同系の深緑。約6:1 */
font-weight: 500;
font-size: 1rem;
letter-spacing: 0.1em;
border: none;
border-radius: var(--radius);
box-shadow: 0 8px 28px rgba(0, 200, 150, 0.3);
position: relative;
overflow: hidden;

/* hover */
background-color: var(--color-accent-hover);
transform: translateY(-2px);
box-shadow: 0 12px 36px rgba(0, 200, 150, 0.4);
```

**白背景にミント塗りのボタンでは、白文字は使えない**（コントラスト 2.16:1）。
文字色は必ず深緑 `#06382B` にすること。

### シマーエフェクト（::before）

CVボタンは **hover 待ちではなく常時2.8秒ループ**で光らせる。

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
  background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
  transform: translateX(-120%) skewX(-20deg);
  animation: shimmerPass 2.8s ease-in-out infinite;
  pointer-events: none;
}
```

---

## カードデザイン

### 標準カード（サービスセクション等）

```css
padding: 40px 32px;
background-color: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: 6px; /* = var(--radius) */

/* hover */
background-color: var(--color-surface-hover);
border-color: rgba(0, 200, 150, 0.5);
transform: translateY(-10px);
box-shadow: var(--shadow-card-hover);
```

白背景では `backdrop-filter` によるガラス効果は視覚的にほぼ消えるため、
淡いグレー面（`--color-surface`）＋境界線で表現する。

### パネルカード（aboutセクション・4パネル）

**このパネルだけは例外的にダーク。** 動画・写真（暗い素材）に黒オーバーレイを
重ね、その上に白文字を載せる設計のため。

```css
background-color: #000;          /* 動画背景 */
border: 1px solid var(--color-border);
border-radius: 8px;
min-height: 280px;
padding: 40px;
/* オーバーレイ: rgba(0, 0, 0, 0.55) */
/* タイトル: #FFFFFF / 説明文: rgba(255,255,255,0.82) */

/* hover */
border-color: #00C896;
transform: translateY(-4px);
box-shadow: var(--shadow-card-hover);
```

> 白いページの中で4枚だけ黒く浮くため、素材差し替えかセクション再設計が検討課題。

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

全ページ共通。マークアップは `zeroichi-banso.html` のものを正とし、**サービス欄は6件**で統一する。

サブスク参謀 / ゼロイチ伴走 / AIXコンサルティング / DXコンサルティング / AI SaaS事業 / AI Native事業

```css
.footer {
  background:
    linear-gradient(rgba(0, 200, 150, 0.05), rgba(0, 200, 150, 0.05)),
    var(--color-bg);
  color: var(--color-text-muted);
  border-top: 1px solid rgba(0, 200, 150, 0.18);
  padding: 80px 32px; /* 768px以上: 80px 48px */
}
.footer a {
  color: #4E5A6B;
}
.footer a:hover {
  color: var(--color-heading);
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
      if (res.ok) { contactForm.innerHTML = '<p style="text-align:center;color:var(--color-heading);padding:40px 0;line-height:2">お問い合わせを受け付けました。<br>担当者よりご連絡いたします。</p>'; }
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
- 通常時：グレー枠線（`var(--color-border)`）

### サービスページのセクション背景

サービスページ（service-ax / dx / native / saas）のセクション背景も index.html と同じトークンを使う：

- `.service-overview-section`：`var(--color-bg)` + ミントのradial gradient
- `.service-recommend-section`：`var(--color-bg-alt)`
- `.service-cta-section`：`var(--color-bg)`、アクセント塗りのシマーボタン

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

## 削除済み：LP「a tenth（アテンス）」

`a-tenth.html` は 2026-08-15 に削除。`sabusuku-sanbo.html`（サブスク参謀）と
`zeroichi-banso.html`（ゼロイチ伴走）に分割・置き換えられたため。
どこからもリンクされていない独立LPだったため、参照切れは発生していない。
画像アセット（`image/logos/` など）は分割後のLPが引き続き使用している。

### ローカルプレビュー

- `.claude/launch.json` に `static-site`（npx http-server ポート8123）を定義済み

## LP刷新「サブスク参謀」「ゼロイチ伴走」（2026-08-14 セッション・lp-renewalブランチ）

### 概要

`a-tenth.html` を2つのサービスLPに分割するリニューアル。修正仕様は `G:\マイドライブ\Claude\LP修正内容_a-tenth.md` に集約。

| ファイル | 役割 |
|---|---|
| `sabusuku-sanbo.html` | LP-A「サブスク参謀」— 社長の右腕をつくる経営参謀サービス |
| `zeroichi-banso.html` | LP-B「ゼロイチ伴走」— 新規事業立ち上げ伴走サービス |
| `request-thanks.html` | 資料請求サンクスページ（TimeRex埋め込み・noindex） |
| `lp-shared.css` | 上記3ページ共通の白テーマスタイル |

### テーマの扱い（2026-08-15 更新）

かつてこの3ページだけが白テーマの「例外」だったが、**サイト全体が白テーマになったため例外ではなくなった。**

配色の実体は `style.css` の `:root` に一本化済み。`lp-shared.css` の `--lpw-*` は
既存の参照を壊さないための**別名（エイリアス）**として残しているだけで、値は持っていない。
ナビバー・フッターの明色化も `style.css` 側へ移設し、重複定義は撤去した。

### 主な仕様（旧 a-tenth.html との差分）

- CV は全て「資料請求する」（旧: 無料相談）。**送信先は Formspree ではなく自社の `/api/request-document`**（詳細は後述）→ `request-thanks.html` にリダイレクト。hidden の `service` でどちらのLPからの請求か判別
- 金額表示は「月20万円〜」に統一。料金プラン（LIGHT/STANDARD/GROWTH）セクションは廃止
- 「価格破壊」「稼働率」という言葉は使用禁止（削除済み）
- FVの数字コンテンツ（稼働率など）は削除
- 選ばれる理由: ①大手ファーム出身トップ10%（実績審査・ケース面接）②1ヶ月単位・最短1週間・初期費用0円 ③実行伴走
- コンサルタント紹介は横スクロールカルーセル（`.lp-members-section__track`、scroll-snap + PC用矢印ボタン）。プロフィールは members.html から流用
- ロゴマーキーは白背景なので `invert` フィルタなし（カラーのまま）。bain.png は除外（既存方針）
- TimeRex はサンクスページのみ。白背景なので invert フィルタ不要
- 旧 `a-tenth.html` は削除済み（2026-08-15）

---

## 資料請求フォームの自動返信メール（2026-08-15 セッション）

`sabusuku-sanbo.html` / `zeroichi-banso.html` の資料請求は `/api/request-document`（Vercel Function）が受け、
Resend 経由で2通送る。実装は `api/request-document.js`、設定手順は `api/README.md`。
自動返信には **サービス紹介資料PDFを添付** し、TimeRex の日程調整リンクを本文に載せている。

| | 差出人 | 宛先 | 返信先 |
|---|---|---|---|
| 自動返信 | info@yz-partners.co.jp | 入力されたアドレス | info@yz-partners.co.jp |
| 社内通知 | info@yz-partners.co.jp | info@yz-partners.co.jp | 入力されたアドレス |

- 稼働には環境変数 `RESEND_API_KEY` と、Resend でのドメイン認証が必要
- **その他15ページのお問い合わせフォームは従来どおり Formspree のまま**（自動返信なし）
- Vercel Functions を有効にするため `package.json` を追加している
