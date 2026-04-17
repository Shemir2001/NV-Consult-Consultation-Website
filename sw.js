// NVConsult Service Worker — Push Notifications
const CACHE_NAME = 'nvonsult-v1';

// Install
self.addEventListener('install', function (event) {
    self.skipWaiting();
});

// Activate
self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());
});

// Listen for push events (for future backend integration)
self.addEventListener('push', function (event) {
    var data = {};
    if (event.data) {
        data = event.data.json();
    }

    var title = data.title || 'NVConsult — New Update!';
    var options = {
        body: data.body || 'Check out our latest blog post!',
        icon: 'img/about-2.png',
        badge: 'img/about-2.png',
        tag: data.tag || 'nv-notification',
        data: {
            url: data.url || 'blog.html'
        },
        actions: [
            { action: 'read', title: 'Read Now' },
            { action: 'close', title: 'Dismiss' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.action === 'close') return;

    var urlToOpen = event.notification.data && event.notification.data.url
        ? event.notification.data.url
        : 'blog.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (windowClients) {
            // Check if there's already a window open
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open new window
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Periodic sync check for new posts (future enhancement)
self.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'NEW_POST') {
        self.registration.showNotification('New Blog Post — NVConsult', {
            body: event.data.title,
            icon: 'img/about-2.png',
            tag: 'nv-new-post-' + event.data.id,
            data: {
                url: 'blog-post.html?id=' + event.data.id
            }
        });
    }
});
