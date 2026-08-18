/**
 * 資料請求フォーム（sabusuku-sanbo.html / zeroichi-banso.html）の受け口。
 *
 * 1. 入力されたメールアドレスへ自動返信（サービス紹介資料PDFを添付、日程調整リンク入り）
 * 2. 入力内容を info@yz-partners.co.jp へ通知
 *
 * 必要な環境変数（Vercel のプロジェクト設定 → Environment Variables）:
 *   RESEND_API_KEY  Resend の API キー（re_ で始まる）
 *
 * 差出人を info@yz-partners.co.jp にするには、Resend 側で yz-partners.co.jp を
 * ドメイン登録し、指示された DNS レコード（SPF / DKIM）を追加しておく必要がある。
 *
 * 添付PDFは assets/docs/ に置き、vercel.json の functions.includeFiles で
 * 関数バンドルに同梱している。読み込めなかった場合は公開URLからの取得に切り替える。
 */

const fs = require('fs');
const path = require('path');

const FROM = 'YZ PARTNERS <info@yz-partners.co.jp>';
const NOTIFY_TO = 'info@yz-partners.co.jp';
const SITE = 'https://yz-partners.co.jp';

// TimeRex の予約ページ。メールにはJSウィジェットを埋め込めないためリンクで案内する
const BOOKING_URL = 'https://timerex.net/s/kiyokawa.0712_fd05/9671619e';

// 送信元ページごとの文面・添付資料
const SERVICES = {
  'サブスク参謀': {
    lead: '「サブスク参謀」の資料をご請求いただき、ありがとうございます。',
    detail: '社長の右腕として経営に伴走する、月額制の経営参謀サービスです。',
    url: SITE + '/sabusuku-sanbo.html',
    docFile: 'sabusuku-sanbo-service-guide.pdf',
    docName: 'サブスク参謀_サービス紹介資料.pdf',
  },
  'ゼロイチ伴走': {
    lead: '「ゼロイチ伴走」の資料をご請求いただき、ありがとうございます。',
    detail: '新規事業の構想づくりから実行まで、社長と共に走る伴走サービスです。',
    url: SITE + '/zeroichi-banso.html',
    docFile: 'zeroichi-banso-service-guide.pdf',
    docName: 'ゼロイチ伴走_サービス紹介資料.pdf',
  },
};

function svcOf(service) {
  return SERVICES[service] || SERVICES['サブスク参謀'];
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function isValidEmail(v) {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
}

/**
 * 添付資料を組み立てる。
 * ローカル同梱ファイルを優先し、読めなければ公開URLからResendに取得させる。
 */
function buildAttachment(s) {
  const candidates = [
    path.join(process.cwd(), 'assets', 'docs', s.docFile),
    path.join(__dirname, '..', 'assets', 'docs', s.docFile),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        return { filename: s.docName, content: fs.readFileSync(p).toString('base64') };
      }
    } catch (err) {
      console.error('attachment read failed', p, err.message);
    }
  }
  console.error('attachment not found locally, falling back to URL:', s.docFile);
  return { filename: s.docName, path: SITE + '/assets/docs/' + s.docFile };
}

async function sendMail(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error('Resend ' + res.status + ': ' + body);
  }
  return res.json();
}

function autoReplyHtml({ name, company, service }) {
  const s = svcOf(service);
  const docUrl = SITE + '/assets/docs/' + s.docFile;
  return '<!doctype html>\n'
    + '<html lang="ja"><body style="margin:0;padding:24px;background:#F6F8FA;font-family:\'Hiragino Sans\',\'Noto Sans JP\',sans-serif;color:#2A3441;line-height:1.9">\n'
    + '  <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E4E8EE;border-radius:6px;padding:32px 28px">\n'
    + '    <p style="margin:0 0 24px;font-weight:700;font-size:1.05rem;color:#0F1E3D">' + escapeHtml(company) + '<br>' + escapeHtml(name) + ' 様</p>\n'
    + '    <p style="margin:0 0 16px">' + escapeHtml(s.lead) + '</p>\n'
    + '    <p style="margin:0 0 24px">' + escapeHtml(s.detail) + '<br><strong>サービス紹介資料を本メールに添付</strong>しておりますので、ご確認ください。</p>\n'
    + '    <div style="margin:0 0 28px;padding:20px 22px;background:#F6F8FA;border:1px solid #E4E8EE;border-radius:6px">\n'
    + '      <p style="margin:0 0 6px;font-weight:700;color:#0F1E3D">添付資料</p>\n'
    + '      <p style="margin:0;font-size:0.9rem">' + escapeHtml(s.docName) + '</p>\n'
    + '      <p style="margin:10px 0 0;font-size:0.85rem;color:#626C7A">添付が開けない場合は <a href="' + docUrl + '" style="color:#00785A">こちらからダウンロード</a> いただけます。</p>\n'
    + '    </div>\n'
    + '    <div style="margin:0 0 28px;padding:24px 22px;background:#FFFFFF;border:2px solid #00C896;border-radius:6px;text-align:center">\n'
    + '      <p style="margin:0 0 8px;font-weight:700;font-size:1.02rem;color:#0F1E3D">個別のご相談も承っています</p>\n'
    + '      <p style="margin:0 0 18px;font-size:0.88rem;color:#626C7A">30〜60分のオンライン面談です。ご相談のみでも構いません。<br>下のボタンからご都合のよい日時をお選びください。</p>\n'
    + '      <a href="' + BOOKING_URL + '" style="display:inline-block;padding:15px 40px;background-color:#00C896;color:#06382B;font-weight:700;font-size:0.95rem;letter-spacing:0.06em;border-radius:6px;text-decoration:none">日程を調整する</a>\n'
    + '      <p style="margin:14px 0 0;font-size:0.78rem;color:#626C7A;word-break:break-all">ボタンが押せない場合はこちら：<br><a href="' + BOOKING_URL + '" style="color:#00785A">' + BOOKING_URL + '</a></p>\n'
    + '    </div>\n'
    + '    <p style="margin:0 0 24px;font-size:0.9rem">ご不明な点やご相談は、本メールにそのままご返信ください。<br>サービス詳細： <a href="' + escapeHtml(s.url) + '" style="color:#00785A">' + escapeHtml(s.url) + '</a></p>\n'
    + '    <p style="margin:0 0 8px;font-size:0.85rem;color:#626C7A">※ 本メールは資料請求の受付を自動でお知らせするものです。</p>\n'
    + '    <hr style="border:none;border-top:1px solid #E4E8EE;margin:24px 0">\n'
    + '    <p style="margin:0;font-size:0.82rem;color:#626C7A">株式会社YZ PARTNERS<br><a href="mailto:info@yz-partners.co.jp" style="color:#00785A">info@yz-partners.co.jp</a></p>\n'
    + '  </div>\n'
    + '</body></html>';
}

function autoReplyText({ name, company, service }) {
  const s = svcOf(service);
  return [
    company,
    name + ' 様',
    '',
    s.lead,
    '',
    s.detail,
    'サービス紹介資料を本メールに添付しておりますので、ご確認ください。',
    '',
    '[添付資料]',
    s.docName,
    '添付が開けない場合: ' + SITE + '/assets/docs/' + s.docFile,
    '',
    '----------------------------------------',
    '[個別のご相談も承っています]',
    '30〜60分のオンライン面談です。ご相談のみでも構いません。',
    'ご都合のよい日時を下記からお選びください。',
    BOOKING_URL,
    '----------------------------------------',
    '',
    'ご不明な点やご相談は、本メールにそのままご返信ください。',
    'サービス詳細: ' + s.url,
    '',
    '※ 本メールは資料請求の受付を自動でお知らせするものです。',
    '',
    '株式会社YZ PARTNERS',
    'info@yz-partners.co.jp',
  ].join('\n');
}

function notifyHtml({ name, company, email, tel, service }) {
  const row = (k, v) => '<tr>'
    + '<th style="text-align:left;padding:8px 12px;background:#F6F8FA;border:1px solid #E4E8EE;white-space:nowrap">' + escapeHtml(k) + '</th>'
    + '<td style="padding:8px 12px;border:1px solid #E4E8EE">' + escapeHtml(v || '（未入力）') + '</td></tr>';
  return '<!doctype html>\n'
    + '<html lang="ja"><body style="font-family:\'Hiragino Sans\',\'Noto Sans JP\',sans-serif;color:#2A3441">\n'
    + '  <p style="font-weight:700;color:#0F1E3D">資料請求がありました（' + escapeHtml(service) + '）</p>\n'
    + '  <table style="border-collapse:collapse;font-size:0.9rem">\n'
    + row('サービス', service)
    + row('会社名', company)
    + row('お名前', name)
    + row('メールアドレス', email)
    + row('電話番号', tel)
    + '  </table>\n'
    + '  <p style="font-size:0.85rem;color:#626C7A">※ 申込者には資料PDFと日程調整リンクを添えた自動返信を送信済みです。</p>\n'
    + '</body></html>';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'server_misconfigured' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const company = String(body.company || '').trim();
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const tel = String(body.tel || '').trim();
  const service = String(body.service || '').trim();

  // ハニーポット：ボットが埋めたら成功を装って捨てる
  if (body._gotcha) return res.status(200).json({ ok: true });

  if (!company || !name || !isValidEmail(email)) {
    return res.status(400).json({ error: 'invalid_input' });
  }

  const payload = { name, company, email, tel, service };

  try {
    // 自動返信は失敗させたくないので先に送る
    await sendMail(apiKey, {
      from: FROM,
      to: [email],
      reply_to: NOTIFY_TO,
      subject: '【' + (service || '資料請求') + '】資料をお送りします｜YZ PARTNERS',
      html: autoReplyHtml(payload),
      text: autoReplyText(payload),
      attachments: [buildAttachment(svcOf(service))],
    });
  } catch (err) {
    console.error('autoreply failed', err);
    return res.status(502).json({ error: 'mail_failed' });
  }

  try {
    await sendMail(apiKey, {
      from: FROM,
      to: [NOTIFY_TO],
      reply_to: email,
      subject: '【資料請求】' + service + '／' + company + '／' + name + ' 様',
      html: notifyHtml(payload),
    });
  } catch (err) {
    // 通知が落ちても申込者側は完了しているので、成功として返す
    console.error('notification failed', err);
  }

  return res.status(200).json({ ok: true });
};
