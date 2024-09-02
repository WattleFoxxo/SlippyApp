
self.addEventListener('message', (event) => {
    if (!event.data) return;

    switch (event.data.type) {
        case "notification":
            let notificationData = event.data.data;
            self.registration.showNotification(notificationData.title, notificationData.options);
            break
    }
});
