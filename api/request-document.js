/**
 * 資料請求フォーム（sanbo.html / launch.html）の受け口。
 *
 * 1. 入力内容を info@yz-partners.co.jp へ通知
 * 2. 入力されたメールアドレスへ自動返信（差出人も info@yz-partners.co.jp）
 *
 * 必要な環境変数（Vercel のプロジェクト設定 → Environment Variables）:
 *   RESEND_API_KEY  Resend の API キー（re_ で始まる）
 *
 * 差出人を info@yz-partners.co.jp にするには、Resend 側で yz-partners.co.jp を
 * ドメイン登録し、指示された DNS レコード（SPF / DKIM）を追加しておく必要がある。
 * 未認証のまま送ると Resend が 403 を返す。
 */

const FROM = 'YZ PARTNERS <info@yz-partners.co.jp>';
const NOTIFY_TO = 'info@yz-partners.co.jp';

// 送信元ページごとの文面差分
const SERVICES = {
  'サブスク参謀': {
    lead: '「サブスク参謀」の資料をご請求いただき、ありがとうございます。',
    detail: '社長の右腕として経営に伴走する、月額制の経営参謀サービスです。',
    url: 'https://www.yz-partners.co.jp/sanbo.html',
  },
  'ゼロイチ伴走': {
    lead: '「ゼロイチ伴走」の資料をご請求いただき、ありがとうございます。',
    detail: '新規事業の構想づくりから実行まで、社長と共に走る伴走サービスです。',
    url: 'https://www.yz-partners.co.jp/launch.html',
  },
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function isValidEmail(v) {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
}

async function sendMail(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
  return res.json();
}

function autoReplyHtml({ name, company, service }) {
  const s = SERVICES[service] || SERVICES['サブスク参謀'];
  return `<!doctype html>
<html lang="ja"><body style="margin:0;padding:24px;background:#F6F8FA;font-family:'Hiragino Sans','Noto Sans JP',sans-serif;color:#2A3441;line-height:1.9">
  <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E4E8EE;border-radius:6px;padding:32px 28px">
    <p style="margin:0 0 24px;font-weight:700;font-size:1.05rem;color:#0F1E3D">${escapeHtml(company)}<br>${escapeHtml(name)} 様</p>
    <p style="margin:0 0 16px">${escapeHtml(s.lead)}</p>
    <p style="margin:0 0 24px">${escapeHtml(s.detail)}<br>サービス資料を添付・ご案内のうえ、担当者より改めてご連絡いたします。</p>
    <p style="margin:0 0 24px;padding:16px 18px;background:#F6F8FA;border-left:3px solid #00C896;border-radius:0 6px 6px 0;font-size:0.9rem">
      ご不明な点やご相談は、本メールにそのままご返信ください。<br>
      サービス詳細： <a href="${escapeHtml(s.url)}" style="color:#00785A">${escapeHtml(s.url)}</a>
    </p>
    <p style="margin:0 0 8px;font-size:0.85rem;color:#626C7A">
      ※ 本メールは資料請求の受付を自動でお知らせするものです。
    </p>
    <hr style="border:none;border-top:1px solid #E4E8EE;margin:24px 0">
    <p style="margin:0;font-size:0.82rem;color:#626C7A">
      株式会社YZ PARTNERS<br>
      <a href="mailto:info@yz-partners.co.jp" style="color:#00785A">info@yz-partners.co.jp</a>
    </p>
  </div>
</body></html>`;
}

function autoReplyText({ name, company, service }) {
  const s = SERVICES[service] || SERVICES['サブスク参謀'];
  return [
    `${company}`,
    `${name} 様`,
    '',
    s.lead,
    '',
    s.detail,
    'サービス資料を添付・ご案内のうえ、担当者より改めてご連絡いたします。',
    '',
    'ご不明な点やご相談は、本メールにそのままご返信ください。',
    `サービス詳細: ${s.url}`,
    '',
    '※ 本メールは資料請求の受付を自動でお知らせするものです。',
    '',
    '----------------------------------------',
    '株式会社YZ PARTNERS',
    'info@yz-partners.co.jp',
  ].join('\n');
}

function notifyHtml({ name, company, email, tel, service }) {
  const row = (k, v) => `<tr>
    <th style="text-align:left;padding:8px 12px;background:#F6F8FA;border:1px solid #E4E8EE;white-space:nowrap">${escapeHtml(k)}</th>
    <td style="padding:8px 12px;border:1px solid #E4E8EE">${escapeHtml(v || '（未入力）')}</td></tr>`;
  return `<!doctype html>
<html lang="ja"><body style="font-family:'Hiragino Sans','Noto Sans JP',sans-serif;color:#2A3441">
  <p style="font-weight:700;color:#0F1E3D">資料請求がありました（${escapeHtml(service)}）</p>
  <table style="border-collapse:collapse;font-size:0.9rem">
    ${row('サービス', service)}
    ${row('会社名', company)}
    ${row('お名前', name)}
    ${row('メールアドレス', email)}
    ${row('電話番号', tel)}
  </table>
</body></html>`;
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
      subject: `【${service || '資料請求'}】資料請求を承りました｜YZ PARTNERS`,
      html: autoReplyHtml(payload),
      text: autoReplyText(payload),
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
      subject: `【資料請求】${service}／${company}／${name} 様`,
      html: notifyHtml(payload),
    });
  } catch (err) {
    // 通知が落ちても申込者側は完了しているので、成功として返す
    console.error('notification failed', err);
  }

  return res.status(200).json({ ok: true });
};
