// NVConsult Posts System — Listing & Single Post View
(function () {
    'use strict';

    var POSTS_PER_PAGE = 6;

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

    // ─── Posts Listing ───
    function initPostsListing() {
        var container = document.getElementById('posts-grid');
        if (!container) return;

        var currentPage = 1;

        function renderPosts() {
            var posts = getPublishedPosts();
            var totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
            var start = (currentPage - 1) * POSTS_PER_PAGE;
            var pagePosts = posts.slice(start, start + POSTS_PER_PAGE);

            if (pagePosts.length === 0) {
                container.innerHTML = '<div class="col-12 no-posts"><i class="fas fa-thumbtack d-block" style="font-size:3rem;color:#ccc;margin-bottom:1rem;"></i><h4>No posts yet</h4><p class="text-muted">Check back soon for updates and announcements.</p></div>';
                return;
            }

            container.innerHTML = pagePosts.map(function (post, i) {
                var postUrl = 'post.html?slug=' + post.slug;
                return '<div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="' + (0.1 + (i * 0.1)) + 's">' +
                    '<div class="blog-card">' +
                        '<div class="blog-card-img">' +
                            '<img src="' + post.image + '" alt="' + post.title + '" onerror="this.src=\'img/carousel-1.jpg\'">' +
                        '</div>' +
                        '<div class="blog-card-body">' +
                            '<div class="blog-meta">' +
                                '<span><i class="fas fa-calendar-alt"></i> ' + formatDate(post.date) + '</span>' +
                                '<span><i class="fas fa-user"></i> ' + post.author + '</span>' +
                            '</div>' +
                            '<h5><a href="' + postUrl + '">' + post.title + '</a></h5>' +
                            '<p class="blog-excerpt">' + post.excerpt + '</p>' +
                        '</div>' +
                        '<div class="blog-card-footer">' +
                            '<a href="' + postUrl + '" class="read-more">Read More <i class="fas fa-arrow-right ms-1"></i></a>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('');

            renderPagination(totalPages);
            if (typeof WOW !== 'undefined') new WOW().init();
        }

        function renderPagination(totalPages) {
            var pag = document.getElementById('posts-pagination');
            if (!pag || totalPages <= 1) {
                if (pag) pag.innerHTML = '';
                return;
            }
            var html = '';
            if (currentPage > 1) html += '<button class="page-btn" data-page="' + (currentPage - 1) + '"><i class="fas fa-chevron-left"></i></button>';
            for (var i = 1; i <= totalPages; i++) {
                html += '<button class="page-btn' + (i === currentPage ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
            }
            if (currentPage < totalPages) html += '<button class="page-btn" data-page="' + (currentPage + 1) + '"><i class="fas fa-chevron-right"></i></button>';
            pag.innerHTML = html;

            pag.querySelectorAll('.page-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    currentPage = parseInt(this.dataset.page);
                    renderPosts();
                    window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
                });
            });
        }

        renderPosts();
    }

    // ─── Single Post View ───
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
            postContent.innerHTML = '<div class="text-center py-5"><h3>Post not found</h3><a href="posts.html" class="btn btn-primary mt-3">Back to Posts</a></div>';
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
        initPostsListing();
        initSinglePostView();
    });
})();
