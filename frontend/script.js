// frontend/script.js

// 1) Load env from config.json and expose to window.env
async function loadEnv() {
  const res = await fetch('./config.json', { cache: 'no-store' });
  if (!res.ok) throw new Error(`config.json ${res.status}`);
  const env = await res.json();
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in config.json');
  }
  if (!env.API_BASE_URL) env.API_BASE_URL = '/api';
  window.env = env;
  return env;
}

let supabase;
function $(id) { return document.getElementById(id); }
function log(msg) { const el = $('log'); if (el) el.textContent = msg; }
function show(obj, el = $('session')) { el.textContent = JSON.stringify(obj, null, 2); }

// 2) Supabase helpers
async function currentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
async function getAccessToken() {
  const s = await currentSession();
  return s?.access_token || null;
}

// 3) API helpers (through the Cloudflare Worker at /api/*)
async function callApi(path, opts = {}) {
  const token = await getAccessToken();
  const headers = new Headers(opts.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && opts.body) headers.set('Content-Type', 'application/json');

  const resp = await fetch(`${window.env.API_BASE_URL}${path}`, { ...opts, headers });
  const text = await resp.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: resp.status, body };
}

// 4) Wire up page
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const env = await loadEnv();
    // init Supabase
    // eslint-disable-next-line no-undef
    supabase = window.supabase.createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

    // Auth buttons
    $('btnSignUp')?.addEventListener('click', async () => {
      log('Signing up…');
      const email = $('email').value.trim();
      const password = $('password').value;
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { log(error.message); return; }
      log('Sign-up submitted. Check your email to confirm.');
      show(data);
    });

    $('btnSignIn')?.addEventListener('click', async () => {
      log('Signing in…');
      const email = $('email').value.trim();
      const password = $('password').value;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { log(error.message); return; }
      log('Signed in.');
      show(await currentSession());
    });

    $('btnSignOut')?.addEventListener('click', async () => {
      await supabase.auth.signOut();
      log('Signed out.');
      show(await currentSession());
    });

    $('btnShowSession')?.addEventListener('click', async () => {
      show(await currentSession());
    });

    // API tests
    $('btnGetHealth')?.addEventListener('click', async () => {
      log('Calling /api/health…');
      const r = await callApi('/health');
      $('apiResponse').textContent = JSON.stringify(r, null, 2);
      log('Done.');
    });

    $('btnGetWhoami')?.addEventListener('click', async () => {
      log('Calling /api/whoami…');
      const r = await callApi('/whoami');
      $('apiResponse').textContent = JSON.stringify(r, null, 2);
      log('Done.');
    });

    // Enter key to sign in
    $('password')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') $('btnSignIn').click();
    });

    log('Ready.');
  } catch (e) {
    console.error(e);
    log(`Error: ${e.message}`);
  }
});
