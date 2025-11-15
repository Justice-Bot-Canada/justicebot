// public/index.mjs — minimal, CSP-friendly

const
 blockedPrefixes = [
'/app'
, 
'/dashboard'
, 
'/account'
, 
'/settings'
, 
'/profile'
, 
'/admin'
];
const
 isBlockedPath = 
(
p
) =>
 blockedPrefixes.some(
(
bp
) =>
 p === bp || p.startsWith(bp + 
'/'
));
function
 
hasAuthCookie
(
) 
{
  
const
 c = 
`; 
${
document
.cookie || 
''
}
;`
;
  
return
 (
    c.includes(
'; sb-access-token='
) ||
    c.includes(
'; sb-refresh-token='
) ||
    c.includes(
'; supabase-auth-token'
) ||
    c.includes(
'; auth-token='
)
  );
}
function
 
shouldRunZaraz
(
) 
{
  
try
 {
    
const
 path = 
new
 URL(location.href).pathname || 
'/'
;
    
if
 (isBlockedPath(path)) 
return
 
false
;
    
if
 (hasAuthCookie()) 
return
 
false
;
    
return
 
true
;
  } 
catch
 {
    
return
 
false
;
  }
}
if
 (shouldRunZaraz()) {
  
const
 s = 
document
.createElement(
'script'
);
  s.src = 
'/cdn-cgi/zaraz/s.js'
;
  s.defer = 
true
;
  s.referrerPolicy = 
'origin'
;
  
document
.head.appendChild(s);
