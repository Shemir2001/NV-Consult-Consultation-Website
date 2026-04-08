// Cal.com Embed Integration for NVConsult
(function (C, A, L) {
  let p = function (a, ar) { a.q.push(ar); };
  let d = C.document;
  C.Cal = C.Cal || function () {
    let cal = C.Cal;
    let ar = arguments;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      d.head.appendChild(d.createElement("script")).src = A;
      cal.loaded = true;
    }
    if (ar[0] === L) {
      const api = function () { p(api, arguments); };
      const namespace = ar[1];
      api.q = api.q || [];
      if (typeof namespace === "string") {
        cal.ns[namespace] = cal.ns[namespace] || api;
        p(cal.ns[namespace], ar);
        p(cal, ["initNamespace", namespace]);
      } else p(cal, ar);
      return;
    }
    p(cal, ar);
  };
})(window, "https://app.cal.com/embed/embed.js", "init");

Cal("init", { origin: "https://cal.com" });
Cal("ui", {
  "styles": { "branding": { "brandColor": "#F59E0B" } },
  "hideEventTypeDetails": false,
  "layout": "month_view"
});

// Auto-wire booking buttons on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  // Find all links/buttons that contain booking-related text
  var allLinks = document.querySelectorAll('a, button');
  
  allLinks.forEach(function (el) {
    var text = (el.textContent || '').trim().toLowerCase();
    
    // Skip non-booking elements
    if (el.classList.contains('back-to-top') || 
        el.classList.contains('whatsapp-btn') ||
        el.classList.contains('dropdown-item') ||
        el.classList.contains('dropdown-toggle') ||
        el.closest('.footer-item') ||
        el.closest('.breadcrumb')) return;
    
    // Already has cal-link, skip
    if (el.getAttribute('data-cal-link')) return;
    
    // Free consultation buttons → 15min
    if (text.includes('book free consultation') || 
        text.includes('book a free consultation') ||
        text.includes('book free slot') ||
        text.includes('check eligibility') ||
        text.includes('get started free') ||
        text.includes('start your journey')) {
      el.setAttribute('data-cal-link', 'euconsult/15min');
      el.setAttribute('data-cal-config', '{"layout":"month_view"}');
      el.style.cursor = 'pointer';
    }
    
    // Paid consultation buttons → 30min
    if (text === 'book now' || 
        text.includes('start premium') ||
        text.includes('start strategy') ||
        text.includes('get basic plan')) {
      el.setAttribute('data-cal-link', 'euconsult/30min');
      el.setAttribute('data-cal-config', '{"layout":"month_view"}');
      el.style.cursor = 'pointer';
    }
  });
});
