// CTHZ 88.1 offline cache. Bump VERSION when the app changes.
const VERSION = "cthz-v3";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request;
  if(r.method !== "GET" || r.url.startsWith("blob:")) return;
  e.respondWith(caches.match(r, {ignoreSearch: true}).then(hit => {
    const net = fetch(r).then(res => { if(res && (res.ok || res.type === "opaque")){ const copy = res.clone(); caches.open(VERSION).then(c => c.put(r, copy)); } return res; }).catch(() => hit);
    return hit || net;
  }));
});
