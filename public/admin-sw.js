// Service worker of the chat panel (/admin) — only for notifications. The server sends an empty push;
// here we ask it what is new and show the notification. Clicking it opens the panel on that chat or the calls list.
// (The public site has no service worker; BaseLayout removes old ones but keeps this one — scope /admin.)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  event.waitUntil(
    (async () => {
      let n = { title: 'Новое сообщение на сайте', body: 'Откройте чат', tag: 'msuv', url: '/admin', unread: 0 };
      try {
        const r = await fetch('/api/admin/notify', { credentials: 'include', cache: 'no-store' });
        if (r.ok) n = { ...n, ...(await r.json()) };
      } catch (_) {
        /* offline: show the generic text */
      }
      if (n.unread && self.navigator.setAppBadge) self.navigator.setAppBadge(n.unread).catch(() => {});
      await self.registration.showNotification(n.title, {
        body: n.body,
        tag: n.tag,
        renotify: true,
        icon: '/favicon-192.png',
        badge: '/favicon-192.png',
        data: { url: n.url },
      });
    })(),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || '/admin', self.location.origin).href;
  event.waitUntil(
    (async () => {
      const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const c of list) {
        if (c.url.includes('/admin')) {
          await c.focus();
          return c.navigate(url);
        }
      }
      return self.clients.openWindow(url);
    })(),
  );
});
