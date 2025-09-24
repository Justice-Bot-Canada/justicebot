// frontend/script.js
(async () => {
  const $ = (sel) => document.querySelector(sel);
  const log = (msg) => {
    console.log(msg);
    const el = $('#log');
    if (el) el.textContent = String(msg);
  };

  // 1) Load config.json (no cache so updates take effect immediately)
  let env;
  try {
    const res = await fetch('config.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`config.json ${res.status}`);
    env = await res.json();
    window.env = env;
  } catch (e) {
    alert('Failed to load config.json: ' + e.message);
    return;
  }

  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    alert('Missing SUPABASE_URL or SUPABASE_ANON_KEY in config.json');
    return;
  }

  // 2) Init Supabase client
  const supabase = window.supabase.createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  window.sb = supabase; // handy for debugging in DevTools

  async function showSession() {
    const { data } = await supabase.auth.getSession();
    const pre = $('#session');
    if (pre) pre.textContent = JSON.stringify(data, null, 2);
    return data?.session ?? null;
  }

  // 3) Wire up buttons
  $('#btnSignUp')?.addEventListener('click', async () => {
    const email = $('#email')?.value?.trim();
    const password = $('#password')?.value ?? '';
    if (!email || !password) return log('Enter email and password');

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return log('SignUp error: ' + error.message);

    // If email confirmation is ON, session will be null until you click the email
    if (!data.session) log('Sign up ok. Check your email to confirm, then Sign In.');
    else log('Signed up and logged in.');
    await showSession();
  });

  $('#btnSignIn')?.addEventListener('click', async () => {
    const email = $('#email')?.value?.trim();
    const password = $('#password')?.value ?? '';
    if (!email || !password) return log('Enter email and password');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return log('SignIn error: ' + error.message);

    log('Signed in.');
    await showSession();
  });

  $('#btnSignOut')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    log('Signed out.');
    await showSession();
  });

  $('#btnShowSession')?.addEventListener('click', showSession);

  // API test buttons
  $('#btnGetHealth')?.addEventListener('click', async () => {
    const r = await fetch('/api/health');
    $('#apiResponse').textContent = (await r.text()) || r.status;
  });

  $('#btnGetWhoami')?.addEventListener('click', async () => {
    const sess = await showSession();
    const token = sess?.access_token;
    const r = await fetch('/api/whoami', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    $('#apiResponse').textContent = await r.text();
  });

  // Show whatever session exists right away
  await showSession();
  log('Ready.');
})();
