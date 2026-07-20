// Self-destructing service worker to clear any cached coi-serviceworker registration
self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        self.registration.unregister().then(() => {
            console.log("Cleared coi-serviceworker registration.");
            return self.clients.matchAll();
        }).then(clients => {
            clients.forEach(client => {
                if (client.url) {
                    client.navigate(client.url);
                }
            });
        })
    );
});
