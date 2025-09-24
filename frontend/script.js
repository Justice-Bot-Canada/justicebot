// frontend/script.js
// Works with your /dev.html and any page that has the IDs used below.

// ---------- tiny DOM helpers ----------
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const setText = (sel, val) => { const el = $(sel); if (el) el.textContent = typeof val === 'string' ? val : JSON.stringify(val, null, 2); };
const setHTML = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };

// Prefer these outputs if present; fall back to older IDs.
const logAuth = (x) => {
  if ($('#authlog')) setText('#authlog', x);
  else if ($('#session')) setText('#session', x);
  else console.log('AUTH:', x);
};
const logApi = (x) => {
  if ($('#apilog')) setText('#apilog', x);
  else if ($('#apiResponse')) setText('#apiResponse', x);
  else console.log('API:', x);
};
const logLine = (msg) => {
  if ($('#log')) setText('#log', msg);
  else console.log(msg);
};

// ---------- 1) Load config.json ----------
async function loadConfig() {
  const res = await fetch('./config.json', { cache: 'no-store' });
  if (!res.ok) throw new Error(`config.json ${res.status}`);
  const cfg = await res.json();

  // Defaults
  cfg.API_BASE_URL = cfg.API_BASE_URL || '/api';

  // Render env summary on either layout you used
  if ($('#env')) {
    setHTML('#env',
      `SUPABASE_URL: <code>${cfg.SUPABASE_URL || '(missing)'}</code><br>` +
      `API_BASE_URL: <code>${cfg.API_BASE_URL}</code><br>` +
      `PAYPAL_CLIENT_ID: <code>${cfg.PAYPAL_CLIENT_ID ? '(set)' : '(missing)'}</code>`
    );
  }
  if ($('#cfg-url')) setText('#cfg-url', cfg.SUPABASE_URL || '(missing)');
  if ($('#cfg-api')) setText('#cfg-api', cfg.API_BASE_URL);
  if ($('#cfg-pp'))  setText('#cfg-pp',  cfg.PAYPAL_CLIENT_ID ? '(set)' : '(missing)');

  return cfg;
}

// ---------- 2) Supabase client (via CDN global) ----------
let supabase;
async function initSupabase(SUPABASE_URL, SUPABASE_ANON_KEY) {
  if (!window.supabase) throw new Error('Supabase CDN not loaded. Include it before script.js');
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in config.json');
  }
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  // On state change, reflect the session
  supabase.auth.onAuthStateChange(async (_event, session) => logAuth(session ?? '(no session)'));
  const { data } = await supabase.auth.getSession();
  logAuth(data);
  return supabase;
}

async function currentSession() {
  const { data } = await supabase.auth.getSession();
  return data?.session ?? null;
}
async function getAccessToken() {
  return (await currentSession())?.access_token || null;
}

// ---------- 3) API helper (goes through Worker at /api/*) ----------
async function callApi(base, path, { method='GET', body, headers } = {}) {
  const token = await getAccessToken();
  const h = new Headers(headers || {});
  if (token) h.set('Authorization', `Bearer ${token}`);
  if (body && !h.has('Content-Type')) h.set('Content-Type', 'application/json');

  const url = `${base}${path}`;
  const resp = await fetch(url, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  const text = await resp.text();
  let parsed; try { parsed = JSON.parse(text); } catch { parsed = text; }
  return { status: resp.status, body: parsed };
}

// ---------- 4) Wire up Auth buttons ----------
function wireAuth(cfg) {
  $('#btnSignUp')?.addEventListener('click', onSignUp);
  $('#signup')?.addEventListener('click', onSignUp);

  $('#btnSignIn')?.addEventListener('click', onSignIn);
  $('#signin')?.addEventListener('click', onSignIn);

  $('#btnSignOut')?.addEventListener('click', onSignOut);
  $('#signout')?.addEventListener('click', onSignOut);

  $('#btnShowSession')?.addEventListener('click', async () => logAuth(await currentSession()));
  $('#reset')?.addEventListener('click', onReset);

  $('#password')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') onSignIn(); });

  async function onSignUp() {
    const email = $('#email')?.value?.trim();
    const password = $('#password')?.value || '';
    if (!email || !password) return logLine('Enter email and password');
    logLine('Signing up…');
    const { data, error } = await supabase.auth.signUp({ email, password });
    logAuth(error ?? data);
    if (!error && !data.session) logLine('Check your email to confirm, then Sign In.');
  }

  async function onSignIn() {
    const email = $('#email')?.value?.trim();
    const password = $('#password')?.value || '';
    if (!email || !password) return logLine('Enter email and password');
    logLine('Signing in…');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    logAuth(error ?? data);
    if (!error) logLine('Signed in.');
  }

  async function onSignOut() {
    await supabase.auth.signOut();
    logAuth('(signed out)');
  }

  async function onReset() {
    const email = $('#email')?.value?.trim();
    if (!email) return logLine('Enter your email first');
    const redirectTo = location.origin; // or hardcode to https://justice-bot.com
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    logAuth(error ?? data);
    if (!error) logLine('Password reset email sent.');
  }
}

// ---------- 5) Wire up API test buttons ----------
function wireApiTests(cfg) {
  $('#btnGetHealth')?.addEventListener('click', async () => {
    logLine('Calling /api/health…');
    logApi(await callApi(cfg.API_BASE_URL, '/health'));
  });
  $('#ping')?.addEventListener('click', async () => {
    logLine('Calling /api/health…');
    logApi(await callApi(cfg.API_BASE_URL, '/health'));
  });

  $('#btnGetWhoami')?.addEventListener('click', async () => {
    logLine('Calling /api/whoami…');
    logApi(await callApi(cfg.API_BASE_URL, '/whoami'));
  });
  $('#whoami')?.addEventListener('click', async () => {
    logLine('Calling /api/whoami…');
    logApi(await callApi(cfg.API_BASE_URL, '/whoami'));
  });

  $('#getEnt')?.addEventListener('click', async () => {
    logLine('Calling /api/entitlements…');
    logApi(await callApi(cfg.API_BASE_URL, '/entitlements'));
  });
}

// ---------- 6) PayPal Buttons ----------
function wirePayPal(cfg) {
  const container = $('#paypal-container');
  const note = $('#paypal-note');

  if (!container) return; // page may not have payments section

  if (!cfg.PAYPAL_CLIENT_ID) {
    if (note) note.textContent = 'No PAYPAL_CLIENT_ID in config.json — buttons disabled.';
    return;
  }

  // Load SDK
  const sdk = document.createElement('script');
  sdk.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cfg.PAYPAL_CLIENT_ID)}&currency=CAD&intent=capture&components=buttons`;
  sdk.onload = renderButtons;
  sdk.onerror = () => { if (note) note.textContent = 'Failed to load PayPal SDK.'; };
  document.head.appendChild(sdk);

  function renderButtons() {
    // PayPal global is provided by the SDK script
    // eslint-disable-next-line no-undef
    paypal.Buttons({
      async createOrder() {
        const r = await callApi(cfg.API_BASE_URL, '/payments/create-order', {
          method: 'POST',
          body: { productId: 'doc_small' }
        });
        if (r.status !== 200 || !r.body?.id) throw new Error('Create order failed: ' + JSON.stringify(r.body));
        return r.body.id;
      },
      async onApprove(data) {
        const r = await callApi(cfg.API_BASE_URL, '/payments/capture-order', {
          method: 'POST',
          body: { orderId: data.orderID, productId: 'doc_small' }
        });
        if (r.status !== 200) {
          alert('Payment error: ' + JSON.stringify(r.body));
          return;
        }
        alert('Payment captured! Entitlement granted.');
        $('#getEnt')?.click();
      },
      onError(err) { alert('Payment error: ' + err); }
    }).render('#paypal-container');
  }
}

// ---------- 7) Boot ----------
(async function boot() {
  try {
    const cfg = await loadConfig();
    await initSupabase(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    wireAuth(cfg);
    wireApiTests(cfg);
    wirePayPal(cfg);

    // Optional: special-case when running on *.pages.dev and you want to hit production API directly.
    // if (location.hostname.endsWith('.pages.dev')) {
    //   cfg.API_BASE_URL = 'https://justice-bot.com/api';
    // }

    logLine('Ready.');
  } catch (e) {
    console.error(e);
    logLine(`Error: ${e.message}`);
  }
})();
