// NVConsult Newsletter & Push Notifications
(function () {
    'use strict';

    // ─── Newsletter Subscription ───
    function initNewsletter() {
        // Find all newsletter subscribe buttons
        document.querySelectorAll('.footer-item .btn-primary, .newsletter-subscribe-btn').forEach(function (btn) {
            // Check if it's a newsletter subscribe button
            const parent = btn.closest('.position-relative') || btn.closest('.footer-item');
            if (!parent) return;
            const input = parent.querySelector('input[type="text"], input[type="email"]');
            if (!input) return;

            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const email = input.value.trim();
                if (!email || !isValidEmail(email)) {
                    showToast('Invalid Email', 'Please enter a valid email address.', 'error');
                    return;
                }

                // Save subscriber
                const subs = JSON.parse(localStorage.getItem('nv_newsletter_subs') || '[]');
                if (subs.find(s => s.email === email)) {
                    showToast('Already Subscribed', 'This email is already subscribed to our newsletter.', 'info');
                    input.value = '';
                    return;
                }

                subs.push({
                    email: email,
                    date: new Date().toISOString().split('T')[0],
                    notificationsEnabled: false
                });
                localStorage.setItem('nv_newsletter_subs', JSON.stringify(subs));

                // Show success
                input.value = '';
                showToast('Subscribed!', 'You\'ve been added to our newsletter. Enable notifications to stay updated!', 'success');

                // Ask for notification permission
                requestNotificationPermission(email);
            });
        });
    }

    // ─── Notification Permission ───
    function requestNotificationPermission(email) {
        if (!('Notification' in window)) return;

        if (Notification.permission === 'default') {
            setTimeout(function () {
                showToast(
                    '🔔 Enable Notifications?',
                    'Get notified when we publish new blog posts and immigration updates. <a href="#" id="enable-notif-btn">Enable Notifications</a>',
                    'info',
                    10000
                );

                // Wait for the toast to render, then attach listener
                setTimeout(function () {
                    const enableBtn = document.getElementById('enable-notif-btn');
                    if (enableBtn) {
                        enableBtn.addEventListener('click', function (e) {
                            e.preventDefault();
                            Notification.requestPermission().then(function (permission) {
                                if (permission === 'granted') {
                                    // Update subscriber record
                                    updateSubNotification(email, true);
                                    showToast('Notifications Enabled!', 'You\'ll receive push notifications for new posts.', 'success');
                                    // Register service worker
                                    registerServiceWorker();
                                }
                            });
                        });
                    }
                }, 500);
            }, 2000);
        } else if (Notification.permission === 'granted') {
            updateSubNotification(email, true);
            registerServiceWorker();
        }
    }

    function updateSubNotification(email, enabled) {
        const subs = JSON.parse(localStorage.getItem('nv_newsletter_subs') || '[]');
        const sub = subs.find(s => s.email === email);
        if (sub) {
            sub.notificationsEnabled = enabled;
            localStorage.setItem('nv_newsletter_subs', JSON.stringify(subs));
        }
    }

    // ─── Service Worker Registration ───
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').then(function (reg) {
                console.log('NVConsult SW registered:', reg.scope);
            }).catch(function (err) {
                console.log('SW registration failed:', err);
            });
        }
    }

    // ─── Check for New Posts (for returning visitors) ───
    function checkNewPosts() {
        const newPostData = localStorage.getItem('nv_new_post');
        if (!newPostData) return;

        const newPost = JSON.parse(newPostData);
        const lastSeen = parseInt(localStorage.getItem('nv_last_post_seen') || '0');

        // Only show if this post is newer than what user last saw
        if (newPost.timestamp > lastSeen) {
            // Don't show on admin page
            if (window.location.pathname.includes('admin.html')) return;

            setTimeout(function () {
                var postUrl = newPost.slug ? 'blog-post.html?slug=' + newPost.slug : 'blog-post.html?id=' + newPost.id;
                showToast(
                    '📝 New Blog Post!',
                    '<strong>' + newPost.title + '</strong><br>' + newPost.excerpt.substring(0, 80) + '... <a href="' + postUrl + '">Read Now →</a>',
                    'info',
                    12000
                );

                // Also show browser notification
                if ('Notification' in window && Notification.permission === 'granted') {
                    try {
                        var notif = new Notification('New on NVConsult Blog', {
                            body: newPost.title,
                            icon: 'img/about-2.png',
                            tag: 'nv-new-post-' + newPost.id
                        });
                        notif.onclick = function () {
                            window.open(postUrl, '_blank');
                        };
                    } catch (e) { }
                }

                localStorage.setItem('nv_last_post_seen', Date.now().toString());
            }, 3000);
        }
    }

    // ─── Toast Notification ───
    function showToast(title, message, type, duration) {
        duration = duration || 5000;

        // Remove existing toast
        const existing = document.querySelector('.newsletter-toast');
        if (existing) existing.remove();

        const borderColor = type === 'error' ? '#fc8181' : type === 'success' ? '#48bb78' : '#F59E0B';

        const toast = document.createElement('div');
        toast.className = 'newsletter-toast';
        toast.style.borderLeftColor = borderColor;
        toast.innerHTML = `
            <div class="toast-header">
                <h6>${title}</h6>
                <button class="close-toast">&times;</button>
            </div>
            <div class="toast-body">
                <p>${message}</p>
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(function () { toast.classList.add('show'); }, 50);

        // Close button
        toast.querySelector('.close-toast').addEventListener('click', function () {
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 400);
        });

        // Auto dismiss
        setTimeout(function () {
            if (document.body.contains(toast)) {
                toast.classList.remove('show');
                setTimeout(function () { toast.remove(); }, 400);
            }
        }, duration);
    }

    // ─── Utility ───
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ─── Init ───
    document.addEventListener('DOMContentLoaded', function () {
        initNewsletter();
        checkNewPosts();

        // Auto-register service worker if notification already granted
        if ('Notification' in window && Notification.permission === 'granted') {
            registerServiceWorker();
        }
    });

})();
