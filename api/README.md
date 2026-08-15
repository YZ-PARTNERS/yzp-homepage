# 資料請求フォームの自動返信メール

`sanbo.html`（サブスク参謀）と `launch.html`（ゼロイチ伴走）の資料請求フォームは
`/api/request-document` に送信され、次の2通が送られる。

| | 差出人 | 宛先 | 返信先 |
|---|---|---|---|
| 自動返信 | info@yz-partners.co.jp | 入力されたメールアドレス | info@yz-partners.co.jp |
| 社内通知 | info@yz-partners.co.jp | info@yz-partners.co.jp | 入力されたメールアドレス |

メール配信は [Resend](https://resend.com) を使用。

---

## 稼働に必要な設定（未完了）

以下の3つが揃うまで自動返信は送られない。フォーム送信時にエラーになる。

### 1. Resend でドメインを認証する

1. https://resend.com にアカウント作成
2. Domains → Add Domain → `yz-partners.co.jp` を登録
3. 表示される DNS レコード（SPF / DKIM / 通常は MX と TXT の計3〜4件）を
   ドメインの DNS に追加
4. Resend 側のステータスが `Verified` になるまで待つ（反映に数分〜数時間）

**この認証を飛ばすと Resend が 403 を返し、自動返信は送信できない。**
`info@yz-partners.co.jp` を差出人にする以上、この手順は省略できない。

### 2. API キーを発行して Vercel に登録する

1. Resend → API Keys → Create API Key（`re_` で始まる文字列）
2. Vercel のプロジェクト → Settings → Environment Variables
3. `RESEND_API_KEY` という名前で登録し、Production / Preview の両方に適用
4. 再デプロイ

### 3. 送信ドメインの整合を確認する

`api/request-document.js` の `FROM` は `info@yz-partners.co.jp` 固定。
Resend で認証したドメインと一致していること。

---

## 動作確認

デプロイ後、実際にフォームから自分のアドレスで資料請求してみる。

- 自動返信が届かない場合は Vercel の Functions ログを確認する
  - `autoreply failed Resend 403` → ドメイン未認証
  - `RESEND_API_KEY is not set` → 環境変数の登録漏れ
- 迷惑メールに入る場合は DKIM/SPF の設定を再確認する

## ローカルでの検証

Resend への通信をスタブ化したロジックテストを実施済み（バリデーション、
ハニーポット、HTMLエスケープ、失敗時の挙動）。実際の送信は本番デプロイ後に確認する。

## 補足

- 他ページ（お問い合わせフォーム 15ページ）は従来どおり Formspree のまま。
  自動返信は付いていない。
- 自動返信の文面は `SERVICES` 定数でサービスごとに出し分けている。
