// Service worker de DECOGLASS: recibe las notificaciones push del servidor
// y las muestra aunque la app esté cerrada. También abre el pedido/sector
// correspondiente si tocás la notificación.

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let datos = {};
  try { datos = event.data ? event.data.json() : {}; } catch (e) { datos = { title: "DECOGLASS", body: event.data ? event.data.text() : "" }; }

  const titulo = datos.title || "DECOGLASS";
  const opciones = {
    body: datos.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: { url: datos.url || "/" },
    tag: datos.tag || undefined,
    renotify: !!datos.tag,
  };

  event.waitUntil(self.registration.showNotification(titulo, opciones));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((lista) => {
      for (const cliente of lista) {
        if (cliente.url.includes(self.location.origin) && "focus" in cliente) {
          cliente.navigate(url);
          return cliente.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
