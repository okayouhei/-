const http = require('node:http');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = Number(process.env.PORT || 3000);
const APP_ID = process.env.INSTAGRAM_APP_ID || '';
const APP_SECRET = process.env.INSTAGRAM_APP_SECRET || '';
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || `http://localhost:${PORT}/auth/instagram/callback`;
const SCOPES = (process.env.INSTAGRAM_SCOPES || 'instagram_business_basic,instagram_business_manage_messages').split(',');
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || 'v23.0';
const sessions = new Map();

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload, null, 2));
}

function sendRedirect(res, location) {
  res.writeHead(302, { Location: location, 'Cache-Control': 'no-store' });
  res.end();
}

function sendHtml(res, status, html) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(html);
}

function getCookie(req, name) {
  const cookies = req.headers.cookie || '';
  return cookies.split(';').map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${name}=`))?.split('=')[1];
}

async function exchangeCodeForToken(code) {
  const params = new URLSearchParams({
    client_id: APP_ID,
    client_secret: APP_SECRET,
    redirect_uri: REDIRECT_URI,
    code,
  });
  const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token?${params.toString()}`);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error?.message || 'アクセストークンの取得に失敗しました。');
  }
  return body;
}

async function fetchInstagramAccounts(accessToken) {
  const params = new URLSearchParams({
    fields: 'id,name,instagram_business_account{id,username,profile_picture_url}',
    access_token: accessToken,
  });
  const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/me/accounts?${params.toString()}`);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error?.message || 'Instagramアカウント情報の取得に失敗しました。');
  }
  return body.data || [];
}

async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/') {
    const html = await readFile(path.join(__dirname, 'public', 'index.html'), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  if (url.pathname === '/config') {
    sendJson(res, 200, { configured: Boolean(APP_ID && APP_SECRET), redirectUri: REDIRECT_URI, scopes: SCOPES });
    return;
  }

  if (url.pathname === '/auth/instagram') {
    if (!APP_ID || !APP_SECRET) {
      sendJson(res, 500, { error: 'INSTAGRAM_APP_ID と INSTAGRAM_APP_SECRET を設定してください。' });
      return;
    }
    const state = crypto.randomBytes(24).toString('hex');
    sessions.set(state, { createdAt: Date.now() });
    const params = new URLSearchParams({
      client_id: APP_ID,
      redirect_uri: REDIRECT_URI,
      state,
      scope: SCOPES.join(','),
      response_type: 'code',
    });
    res.setHeader('Set-Cookie', `ig_oauth_state=${state}; HttpOnly; SameSite=Lax; Path=/; Max-Age=600`);
    sendRedirect(res, `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth?${params.toString()}`);
    return;
  }

  if (url.pathname === '/auth/instagram/callback') {
    if (!url.search) {
      sendHtml(res, 200, `<!doctype html>
<html lang="ja">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Instagram連携の開始方法</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.8; max-width: 720px; margin: 48px auto; padding: 0 20px;">
  <h1>ここは連携後に戻ってくるURLです</h1>
  <p><code>/auth/instagram/callback</code> はGoogle検索やブラウザへ直接貼り付けて開くURLではありません。</p>
  <p>Instagram連携はトップページ、または下のボタンから開始してください。Metaの認可画面で許可すると、このURLへ自動で戻ってきます。</p>
  <p><a href="/" style="display: inline-block; padding: 12px 18px; border-radius: 999px; background: #c13584; color: white; text-decoration: none; font-weight: 700;">トップページから連携を始める</a></p>
</body>
</html>`);
      return;
    }
    const state = url.searchParams.get('state');
    const code = url.searchParams.get('code');
    if (!state || state !== getCookie(req, 'ig_oauth_state') || !sessions.has(state)) {
      sendJson(res, 400, { error: 'OAuth state が一致しません。最初から連携をやり直してください。' });
      return;
    }
    sessions.delete(state);
    if (!code) {
      sendJson(res, 400, { error: url.searchParams.get('error_message') || '認可コードがありません。' });
      return;
    }
    try {
      const token = await exchangeCodeForToken(code);
      const accounts = await fetchInstagramAccounts(token.access_token);
      sendJson(res, 200, {
        message: 'Instagram連携に成功しました。必要に応じてアクセストークンを安全なDBへ保存してください。',
        tokenType: token.token_type,
        expiresIn: token.expires_in,
        accounts,
      });
    } catch (error) {
      sendJson(res, 502, { error: error.message });
    }
    return;
  }

  sendJson(res, 404, { error: 'Not Found' });
}

http.createServer((req, res) => {
  route(req, res).catch((error) => sendJson(res, 500, { error: error.message }));
}).listen(PORT, () => {
  console.log(`Instagram連携アプリ: http://localhost:${PORT}`);
});
