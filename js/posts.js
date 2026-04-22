// NVConsult Posts System — Renders posts on blog page & handles single post view
(function () {
    'use strict';

    function getSitePosts() {
        return JSON.parse(localStorage.getItem('nv_site_posts') || '[]');
    }

    function getPublishedPosts() {
        return getSitePosts().filter(function (p) { return p.status === 'published'; })
            .sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    }

    function getPostBySlug(slug) {
        return getSitePosts().find(function (p) { return p.slug === slug; });
    }

    function getPostById(id) {
        return getSitePosts().find(function (p) { return p.id === id; });
    }

    function formatDate(dateStr) {
        var d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    // ─── Posts Section on Blog Page ───
    function initPostsSection() {
        var container = document.getElementById('site-posts-grid');
        if (!container) return;

        var posts = getPublishedPosts();

        if (posts.length === 0) {
            // Hide the entire posts section if no posts exist
            var section = container.closest('.container-fluid');
            if (section) section.style.display = 'none';
            return;
        }

        // Show up to 6 latest posts
        var displayPosts = posts.slice(0, 6);

        container.innerHTML = displayPosts.map(function (post, i) {
            var postUrl = 'post.html?slug=' + post.slug;
            return '<div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="' + (0.1 + (i * 0.1)) + 's">' +
                '<div class="site-post-card">' +
                    '<div class="site-post-img">' +
                        '<img src="' + post.image + '" alt="' + post.title + '" onerror="this.src=\'img/carousel-1.jpg\'">' +
                        '<div class="site-post-date"><i class="fas fa-calendar-alt me-1"></i> ' + formatDate(post.date) + '</div>' +
                    '</div>' +
                    '<div class="site-post-body">' +
                        '<h5><a href="' + postUrl + '">' + post.title + '</a></h5>' +
                        '<p>' + post.excerpt + '</p>' +
                        '<a href="' + postUrl + '" class="site-post-link">Read More <i class="fas fa-arrow-right ms-1"></i></a>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join('');

        if (typeof WOW !== 'undefined') new WOW().init();
    }

    // ─── Single Post View (post.html) ───
    function initSinglePostView() {
        var postContent = document.getElementById('single-post-content');
        if (!postContent) return;

        var params = new URLSearchParams(window.location.search);
        var slug = params.get('slug');
        var id = params.get('id');

        var post = null;
        if (slug) post = getPostBySlug(slug);
        else if (id) post = getPostById(id);

        if (!post) {
            postContent.innerHTML = '<div class="text-center py-5"><h3>Post not found</h3><a href="blog.html" class="btn btn-primary mt-3">Back to Blog</a></div>';
            return;
        }

        document.title = post.title + ' — NVConsult';

        postContent.innerHTML =
            '<div class="post-header">' +
                '<h1>' + post.title + '</h1>' +
            '</div>' +
            '<div class="post-meta">' +
                '<span><i class="fas fa-calendar-alt"></i> ' + formatDate(post.date) + '</span>' +
                '<span><i class="fas fa-user"></i> ' + post.author + '</span>' +
            '</div>' +
            '<div class="post-featured-img">' +
                '<img src="' + post.image + '" alt="' + post.title + '" onerror="this.src=\'img/carousel-1.jpg\'">' +
            '</div>' +
            '<div class="post-body">' +
                post.content +
            '</div>' +
            '<div class="post-share">' +
                '<strong>Share:</strong>' +
                '<a href="https://facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href) + '" target="_blank" class="share-btn facebook"><i class="fab fa-facebook-f"></i></a>' +
                '<a href="https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent(post.title) + '" target="_blank" class="share-btn twitter"><i class="fab fa-twitter"></i></a>' +
                '<a href="https://linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(window.location.href) + '" target="_blank" class="share-btn linkedin"><i class="fab fa-linkedin-in"></i></a>' +
                '<a href="https://wa.me/?text=' + encodeURIComponent(post.title + ' ' + window.location.href) + '" target="_blank" class="share-btn whatsapp"><i class="fab fa-whatsapp"></i></a>' +
            '</div>';

        // Sidebar: Recent Posts
        var recentEl = document.getElementById('recent-site-posts');
        if (recentEl) {
            var recent = getPublishedPosts().filter(function (p) { return p.id !== post.id; }).slice(0, 4);
            recentEl.innerHTML = recent.map(function (p) {
                return '<div class="recent-post">' +
                    '<img src="' + p.image + '" alt="' + p.title + '" onerror="this.src=\'img/carousel-1.jpg\'">' +
                    '<div class="rp-content">' +
                        '<h6><a href="post.html?slug=' + p.slug + '">' + p.title + '</a></h6>' +
                        '<small><i class="fas fa-calendar-alt me-1"></i>' + formatDate(p.date) + '</small>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        var breadcrumb = document.getElementById('breadcrumb-post-title');
        if (breadcrumb) breadcrumb.textContent = post.title;
    }

    // ─── Init ───
    document.addEventListener('DOMContentLoaded', function () {
        initPostsSection();
        initSinglePostView();
    });
})();
