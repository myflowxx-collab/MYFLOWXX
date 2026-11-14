
importScripts("https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js");

// Configuración del proyecto Firebase myflowxx-app
firebase.initializeApp({
    apiKey: "AIzaSyCv87Ta8VxDtaWSmoI8dCoOVeL9PwkLyvk",
    authDomain: "myflowxx-app.firebaseapp.com",
    databaseURL: "https://myflowxx-app-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "myflowxx-app",
    storageBucket: "myflowxx-app.firebasestorage.app",
    messagingSenderId: "349064527408",
    appId: "1:349064527408:web:74b9538b6d2eaba99e77f5",
    measurementId: "G-K5DE0FXPSD"
});

const messaging = firebase.messaging();

// Recibir notificaciones en segundo plano
messaging.onBackgroundMessage((payload) => {
    // Las notificaciones con payload.notification las gestiona Firebase.
    if (payload.notification) return;

    const data = payload.data || {};

    const title = data.title || "MYFLOWXX";
    const options = {
        body: data.body || "Tienes una nueva notificación.",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        data: {
            url: data.url || "/"
        }
    };

    self.registration.showNotification(title, options);
});

// Abrir la web al pulsar la notificación
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const targetUrl = new URL(
        event.notification.data?.url || "/",
        self.location.origin
    ).href;

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then((windowClients) => {
            for (const client of windowClients) {
                if (client.url.startsWith(self.location.origin)) {
                    return client.navigate(targetUrl).then(() => client.focus());
                }
            }

            return clients.openWindow(targetUrl);
        })
    );
});
