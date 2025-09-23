export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);
  const path = Array.isArray(params.path) ? params.path.join("/") : (params.path || "");
  const target = `https://app.justice-bot.com/api/${path}${url.search}`;

  const init: RequestInit = {
    method: request.method,
    headers: new Headers(request.headers),
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
    redirect: "manual",
  };
  // Remove hop-by-hop headers that can confuse proxies
  init.headers.delete("host");
  init.headers.delete("content-length");

  const resp = await fetch(target, init);

  // Pass-through, but make sure same-origin is clean
  const headers = new Headers(resp.headers);
  // Optional: normalize CORS headers (not strictly needed since this is same-origin)
  headers.delete("access-control-allow-origin");
  headers.delete("access-control-allow-credentials");

  return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers });
}
