/**
 * Cookie Consent Manager — NVConsult.eu
 * GDPR/ePrivacy Directive compliant cookie consent system.
 *
 * Features:
 * - Blocks analytics & marketing scripts until user consents
 * - Loads Google Analytics (GA4) and Facebook Pixel only after "Accept All"
 * - Sets a consent cookie (1 year expiry) per ePrivacy requirements
 * - Provides "Manage Preferences" link in footer to re-open banner
 * - Properly deletes tracking cookies when user revokes consent
 *
 * Required: Add your GA4 Measurement ID and FB Pixel ID below.
 */
(function () {
    'use strict';

    // ══════════════════════════════════════════════════
    // CONFIGURATION — Replace with your actual IDs
    // ══════════════════════════════════════════════════
    var GA_MEASUREMENT_ID = '';   // e.g. 'G-XXXXXXXXXX'  — leave empty to skip GA
    var FB_PIXEL_ID       = '';   // e.g. '1234567890'     — leave empty to skip FB Pixel

    // ══════════════════════════════════════════════════
    // COOKIE HELPERS
    // ══════════════════════════════════════════════════
    function setCookie(name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        var secure = (window.location.protocol === 'https:') ? ';Secure' : '';
        document.cookie = name + '=' + value +
            ';expires=' + d.toUTCString() +
            ';path=/;SameSite=Lax' + secure;
        // Also persist in localStorage as fallback (works on file:// protocol)
        try { localStorage.setItem(name, value); } catch(e) {}
    }

    function getCookie(name) {
        var v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        if (v) return v.pop();
        // Fallback to localStorage
        try { return localStorage.getItem(name); } catch(e) { return null; }
    }

    function deleteCookie(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax';
        try { localStorage.removeItem(name); } catch(e) {}
    }

    // ══════════════════════════════════════════════════
    // TRACKING SCRIPT LOADERS
    // ══════════════════════════════════════════════════
    function loadGoogleAnalytics() {
        if (!GA_MEASUREMENT_ID || document.getElementById('ga-script')) return;

        // Load gtag.js
        var script = document.createElement('script');
        script.id = 'ga-script';
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
        document.head.appendChild(script);

        // Initialize dataLayer
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
            anonymize_ip: true,               // GDPR: anonymise IP
            cookie_expires: 63072000,          // 2 years (GA default)
            cookie_flags: 'SameSite=Lax;Secure'
        });
    }

    function loadFacebookPixel() {
        if (!FB_PIXEL_ID || window.fbq) return;

        // Facebook Pixel base code
        !function(f,b,e,v,n,t,s) {
            if(f.fbq) return;
            n = f.fbq = function(){n.callMethod ?
                n.callMethod.apply(n,arguments) : n.queue.push(arguments);};
            if(!f._fbq) f._fbq = n;
            n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = [];
            t = b.createElement(e); t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s);
        }(window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');

        window.fbq('init', FB_PIXEL_ID);
        window.fbq('track', 'PageView');
    }

    // ══════════════════════════════════════════════════
    // COOKIE CLEANUP — remove tracking cookies
    // ══════════════════════════════════════════════════
    function removeTrackingCookies() {
        // Google Analytics cookies
        var gaCookies = ['_ga', '_gid', '_gat', '_ga_' + (GA_MEASUREMENT_ID || '').replace('G-', '')];
        gaCookies.forEach(function (name) {
            deleteCookie(name);
            // Also try domain variations
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + window.location.hostname;
        });

        // Facebook cookies
        ['_fbp', '_fbc'].forEach(function (name) {
            deleteCookie(name);
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + window.location.hostname;
        });

        // Google Ads cookies
        ['_gcl_au', '_gcl_aw'].forEach(function (name) {
            deleteCookie(name);
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + window.location.hostname;
        });

        // Remove GA script elements if loaded
        var gaScript = document.getElementById('ga-script');
        if (gaScript) gaScript.remove();
    }

    // ══════════════════════════════════════════════════
    // CONSENT HANDLING
    // ══════════════════════════════════════════════════
    function applyConsent(level) {
        // Set the consent cookie (1 year, as stated in Cookie Policy)
        setCookie('cookieconsent_status', level, 365);

        if (level === 'all') {
            loadGoogleAnalytics();
            loadFacebookPixel();
        } else {
            // essential-only: remove any existing tracking cookies
            removeTrackingCookies();
            // Disable GA if it was somehow loaded
            if (window.gtag) {
                window['ga-disable-' + GA_MEASUREMENT_ID] = true;
            }
        }
    }

    function getConsentLevel() {
        return getCookie('cookieconsent_status');
    }

    // ══════════════════════════════════════════════════
    // BANNER UI
    // ══════════════════════════════════════════════════
    function createBanner() {
        var banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.id = 'cookieConsentBanner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Cookie consent');
        banner.innerHTML =
            '<div class="cookie-inner">' +
                '<span class="cookie-icon"><i class="fas fa-cookie-bite"></i></span>' +
                '<div class="cookie-text">' +
                    '<p>We use cookies to improve your experience, analyse site traffic, and measure our ad performance. ' +
                    'Essential cookies are always active. You can choose which optional cookies to accept. ' +
                    '<a href="cookie-policy.html">Learn more</a></p>' +
                '</div>' +
                '<div class="cookie-buttons">' +
                    '<button class="cookie-btn cookie-btn-accept" id="cookieAcceptAll">Accept All</button>' +
                    '<button class="cookie-btn cookie-btn-essential" id="cookieEssentialOnly">Essential Only</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(banner);

        // Animate in after delay
        setTimeout(function () {
            banner.classList.add('show');
        }, 800);

        // Accept All
        document.getElementById('cookieAcceptAll').addEventListener('click', function () {
            applyConsent('all');
            closeBanner(banner);
        });

        // Essential Only
        document.getElementById('cookieEssentialOnly').addEventListener('click', function () {
            applyConsent('essential');
            closeBanner(banner);
        });
    }

    function closeBanner(banner) {
        banner.classList.remove('show');
        setTimeout(function () {
            if (banner && banner.parentNode) {
                banner.parentNode.removeChild(banner);
            }
        }, 600);
    }

    // ══════════════════════════════════════════════════
    // "MANAGE PREFERENCES" LINK IN FOOTER
    // ══════════════════════════════════════════════════
    function addManageLink() {
        var footerLinks = document.querySelectorAll('.legal-footer-links');
        footerLinks.forEach(function (container) {
            // Don't add if already present
            if (container.querySelector('.manage-cookies-link')) return;

            var sep = document.createElement('span');
            sep.className = 'separator';
            sep.textContent = '·';

            var link = document.createElement('a');
            link.href = '#';
            link.className = 'manage-cookies-link';
            link.textContent = 'Manage Cookies';
            link.addEventListener('click', function (e) {
                e.preventDefault();
                // Remove existing consent and re-show banner
                deleteCookie('cookieconsent_status');
                try { localStorage.removeItem('cookieconsent_status'); } catch(ex) {}
                removeTrackingCookies();
                var existing = document.getElementById('cookieConsentBanner');
                if (existing) existing.remove();
                createBanner();
            });

            container.appendChild(sep);
            container.appendChild(link);
        });
    }

    // ══════════════════════════════════════════════════
    // INITIALIZATION
    // ══════════════════════════════════════════════════
    var consent = getConsentLevel();

    if (consent === 'all') {
        // User previously accepted all — load tracking scripts
        loadGoogleAnalytics();
        loadFacebookPixel();
    } else if (consent === 'essential') {
        // User chose essential only — ensure tracking cookies are cleared
        removeTrackingCookies();
    } else {
        // No consent given yet — show banner (scripts blocked by default = GDPR compliant)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createBanner);
        } else {
            createBanner();
        }
    }

    // Add "Manage Cookies" link to footer on all pages
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addManageLink);
    } else {
        addManageLink();
    }

})();
