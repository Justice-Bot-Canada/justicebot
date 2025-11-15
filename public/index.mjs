— safe loader for Zaraz on public pages only const blockedPrefixes = ['/app', '/dashboard', '/account', '/settings', '/profile']; const isBlockedPath = (pathname) => blockedPrefixes.some((p) => pathname === p || pathname.startsWith(p + '/'));

const hasAuthCookie = () => { const c = document.cookie || ''; return ( c.includes('sb-access-token=') || c.includes('sb-refresh-token=') || c.includes('supabase-auth-token') || c.includes('auth-token=') ); };

const shouldRunZaraz = () => { const path = location.pathname || '/'; if (isBlockedPath(path)) return false; if (hasAuthCookie()) return false; return true; };

if (shouldRunZaraz()) { const s = document.createElement('script'); s.src = '/cdn-cgi/zaraz/s.js'; s.defer = true; s.referrerPolicy = 'origin'; document.head.appendChild(s); }
