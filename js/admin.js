// NVConsult Admin Panel — Blog & Posts Management
(function () {
    'use strict';

    var ADMIN_PASSWORD = 'nvonsult2024';
    var DEFAULT_CATEGORIES = ['Work Visas', 'Study Visas', 'Career Tips', 'Relocation', 'News'];

    // ─── Slug Generator ───
    function generateSlug(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // ─── Categories ───
    function getCategories() {
        var custom = JSON.parse(localStorage.getItem('nv_blog_categories') || '[]');
        var cats = DEFAULT_CATEGORIES.slice();
        custom.forEach(function (c) {
            if (cats.indexOf(c) === -1) cats.push(c);
        });
        return cats;
    }

    function addCategory(name) {
        name = name.trim();
        if (!name) return false;
        var custom = JSON.parse(localStorage.getItem('nv_blog_categories') || '[]');
        var all = DEFAULT_CATEGORIES.concat(custom);
        if (all.indexOf(name) !== -1) return false;
        custom.push(name);
        localStorage.setItem('nv_blog_categories', JSON.stringify(custom));
        return true;
    }

    // ─── Auth ───
    function isLoggedIn() { return sessionStorage.getItem('nv_admin_auth') === 'true'; }
    function login(password) {
        if (password === ADMIN_PASSWORD) { sessionStorage.setItem('nv_admin_auth', 'true'); return true; }
        return false;
    }
    function logout() { sessionStorage.removeItem('nv_admin_auth'); window.location.reload(); }

    // ─── Data ───
    function getBlogs() { return JSON.parse(localStorage.getItem('nv_blog_posts') || '[]'); }
    function saveBlogs(data) { localStorage.setItem('nv_blog_posts', JSON.stringify(data)); }
    function getSitePosts() { return JSON.parse(localStorage.getItem('nv_site_posts') || '[]'); }
    function saveSitePosts(data) { localStorage.setItem('nv_site_posts', JSON.stringify(data)); }
    function getSubscribers() { return JSON.parse(localStorage.getItem('nv_newsletter_subs') || '[]'); }
    function generateId(prefix) { return (prefix || 'item') + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5); }

    // ─── Image Upload Helper ───
    function handleFileUpload(fileInput, previewImg, callback) {
        fileInput.addEventListener('change', function () {
            var file = this.files[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2MB.'); return; }
            if (!file.type.startsWith('image/')) { alert('Please upload an image file.'); return; }

            var reader = new FileReader();
            reader.onload = function (e) {
                var dataUrl = e.target.result;
                previewImg.src = dataUrl;
                previewImg.style.display = 'block';
                if (callback) callback(dataUrl);
            };
            reader.readAsDataURL(file);
        });
    }

    // ─── Init ───
    function init() {
        var loginSection = document.getElementById('admin-login');
        var dashboardSection = document.getElementById('admin-dashboard');
        if (!loginSection || !dashboardSection) return;

        if (isLoggedIn()) {
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            renderDashboard();
        } else {
            loginSection.style.display = 'flex';
            dashboardSection.style.display = 'none';
            initLogin();
        }
    }

    function initLogin() {
        var form = document.getElementById('admin-login-form');
        var errorEl = document.getElementById('login-error');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var pw = document.getElementById('admin-password').value;
            if (login(pw)) {
                document.getElementById('admin-login').style.display = 'none';
                document.getElementById('admin-dashboard').style.display = 'block';
                renderDashboard();
            } else {
                errorEl.style.display = 'block';
                errorEl.textContent = 'Incorrect password. Please try again.';
                document.getElementById('admin-password').value = '';
            }
        });
    }

    // ─── Dashboard ───
    function renderDashboard() {
        renderStats();
        renderBlogsTable();
        renderPostsTable();
        renderSubscribers();
        setupTabs();
        setupLogout();
        setupNewButtons();
        setupViewSite();
        setupCancelButtons();
    }

    function renderStats() {
        var blogs = getBlogs();
        var posts = getSitePosts();
        var subs = getSubscribers();
        var allItems = blogs.concat(posts);
        var published = allItems.filter(function (p) { return p.status === 'published'; }).length;

        document.getElementById('stat-blogs').textContent = blogs.length;
        document.getElementById('stat-posts').textContent = posts.length;
        document.getElementById('stat-published').textContent = published;
        document.getElementById('stat-subscribers').textContent = subs.length;
    }

    // ─── Tabs ───
    function setupTabs() {
        document.querySelectorAll('.admin-tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                document.querySelectorAll('.admin-tab').forEach(function (t) { t.classList.remove('active'); });
                document.querySelectorAll('.admin-tab-content').forEach(function (c) { c.classList.remove('active'); });
                this.classList.add('active');
                document.getElementById('tab-' + this.dataset.tab).classList.add('active');
            });
        });
    }

    // ─── Blogs Table ───
    function renderBlogsTable() {
        var tbody = document.getElementById('blogs-tbody');
        if (!tbody) return;
        var blogs = getBlogs().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

        if (blogs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No blog posts yet. Click "New Blog" to create your first blog!</td></tr>';
            return;
        }

        tbody.innerHTML = blogs.map(function (post) {
            return '<tr>' +
                '<td><div class="post-title-cell"><img src="' + post.image + '" alt="" onerror="this.src=\'img/carousel-1.jpg\'"><span>' + post.title + '</span></div></td>' +
                '<td>' + post.category + '</td>' +
                '<td><span class="status-badge ' + post.status + '">' + post.status + '</span></td>' +
                '<td>' + formatDate(post.date) + '</td>' +
                '<td><div class="action-btns">' +
                '<button class="btn btn-sm btn-outline-primary edit-blog-btn" data-id="' + post.id + '"><i class="fas fa-edit"></i></button>' +
                '<button class="btn btn-sm btn-outline-danger delete-blog-btn" data-id="' + post.id + '"><i class="fas fa-trash"></i></button>' +
                '</div></td></tr>';
        }).join('');

        tbody.querySelectorAll('.edit-blog-btn').forEach(function (btn) {
            btn.addEventListener('click', function () { openBlogEditor(this.dataset.id); });
        });
        tbody.querySelectorAll('.delete-blog-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (confirm('Delete this blog post?')) { deleteBlog(this.dataset.id); }
            });
        });
    }

    // ─── Posts Table ───
    function renderPostsTable() {
        var tbody = document.getElementById('posts-tbody');
        if (!tbody) return;
        var posts = getSitePosts().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

        if (posts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">No posts yet. Click "New Post" to create your first post!</td></tr>';
            return;
        }

        tbody.innerHTML = posts.map(function (post) {
            return '<tr>' +
                '<td><div class="post-title-cell"><img src="' + post.image + '" alt="" onerror="this.src=\'img/carousel-1.jpg\'"><span>' + post.title + '</span></div></td>' +
                '<td><span class="status-badge ' + post.status + '">' + post.status + '</span></td>' +
                '<td>' + formatDate(post.date) + '</td>' +
                '<td><div class="action-btns">' +
                '<button class="btn btn-sm btn-outline-primary edit-sitepost-btn" data-id="' + post.id + '"><i class="fas fa-edit"></i></button>' +
                '<button class="btn btn-sm btn-outline-danger delete-sitepost-btn" data-id="' + post.id + '"><i class="fas fa-trash"></i></button>' +
                '</div></td></tr>';
        }).join('');

        tbody.querySelectorAll('.edit-sitepost-btn').forEach(function (btn) {
            btn.addEventListener('click', function () { openPostEditor(this.dataset.id); });
        });
        tbody.querySelectorAll('.delete-sitepost-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (confirm('Delete this post?')) { deletePost(this.dataset.id); }
            });
        });
    }

    function renderSubscribers() {
        var tbody = document.getElementById('subscribers-tbody');
        if (!tbody) return;
        var subs = getSubscribers();
        if (subs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-muted">No subscribers yet.</td></tr>';
            return;
        }
        tbody.innerHTML = subs.map(function (sub, i) {
            return '<tr><td>' + (i + 1) + '</td><td>' + sub.email + '</td><td>' + formatDate(sub.date) + '</td></tr>';
        }).join('');
    }

    // ─── Image Tab Toggle ───
    function setupImageTabs(container) {
        container.querySelectorAll('.img-tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                var parent = this.closest('.form-group');
                parent.querySelectorAll('.img-tab').forEach(function (t) { t.classList.remove('active'); });
                parent.querySelectorAll('.img-tab-content').forEach(function (c) { c.classList.remove('active'); });
                this.classList.add('active');
                var target = this.dataset.target;
                if (target === 'url') {
                    parent.querySelector('.img-tab-content:first-of-type').classList.add('active');
                } else {
                    parent.querySelector('.img-tab-content:last-of-type').classList.add('active');
                }
            });
        });
    }

    // ─── Blog Editor ───
    var currentBlogImageData = '';

    function openBlogEditor(blogId) {
        showEditor('admin-blog-editor');
        var isEdit = !!blogId;
        var blog = isEdit ? getBlogs().find(function (p) { return p.id === blogId; }) : null;

        document.getElementById('blog-editor-title').textContent = isEdit ? 'Edit Blog Post' : 'New Blog Post';
        renderCategorySelect('blog-category', blog ? blog.category : null);

        document.getElementById('blog-title').value = blog ? blog.title : '';
        document.getElementById('blog-excerpt').value = blog ? blog.excerpt : '';
        document.getElementById('blog-image-url').value = (blog && !blog.image.startsWith('data:')) ? blog.image : '';
        document.getElementById('blog-author').value = blog ? blog.author : 'NVConsult Team';
        document.getElementById('blog-status').value = blog ? blog.status : 'published';
        document.getElementById('blog-editor-content').innerHTML = blog ? blog.content : '<p>Start writing your blog post here...</p>';

        currentBlogImageData = '';
        var preview = document.getElementById('blog-image-preview');
        if (blog && blog.image) {
            preview.src = blog.image;
            preview.style.display = 'block';
            if (blog.image.startsWith('data:')) currentBlogImageData = blog.image;
        } else {
            preview.style.display = 'none';
        }

        // URL input preview
        var urlInput = document.getElementById('blog-image-url');
        urlInput.oninput = function () {
            if (urlInput.value) { preview.src = urlInput.value; preview.style.display = 'block'; currentBlogImageData = ''; }
            else { preview.style.display = 'none'; }
        };

        // File upload
        var fileInput = document.getElementById('blog-image-file');
        var newFileInput = fileInput.cloneNode(true);
        fileInput.parentNode.replaceChild(newFileInput, fileInput);
        handleFileUpload(newFileInput, preview, function (dataUrl) { currentBlogImageData = dataUrl; });

        setupImageTabs(document.getElementById('admin-blog-editor'));
        setupEditorToolbar(document.getElementById('blog-toolbar'));

        // Save
        var saveBtn = document.getElementById('save-blog-btn');
        var newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        newSaveBtn.addEventListener('click', function () { saveBlog(isEdit ? blogId : null); });
    }

    function saveBlog(editId) {
        var title = document.getElementById('blog-title').value.trim();
        var excerpt = document.getElementById('blog-excerpt').value.trim();
        var category = document.getElementById('blog-category').value;
        var imageUrl = document.getElementById('blog-image-url').value.trim();
        var author = document.getElementById('blog-author').value.trim() || 'NVConsult Team';
        var status = document.getElementById('blog-status').value;
        var content = document.getElementById('blog-editor-content').innerHTML;

        if (!title) { alert('Please enter a blog title.'); return; }
        if (!excerpt) { alert('Please enter an excerpt.'); return; }

        var image = currentBlogImageData || imageUrl || 'img/carousel-1.jpg';
        var blogs = getBlogs();
        var slug = generateSlug(title);

        if (editId) {
            var idx = -1;
            blogs.forEach(function (p, i) { if (p.id === editId) idx = i; });
            if (idx !== -1) {
                blogs[idx].title = title;
                blogs[idx].slug = slug;
                blogs[idx].excerpt = excerpt;
                blogs[idx].category = category;
                blogs[idx].image = image;
                blogs[idx].author = author;
                blogs[idx].status = status;
                blogs[idx].content = content;
            }
        } else {
            var newBlog = {
                id: generateId('blog'),
                slug: slug,
                title: title,
                excerpt: excerpt,
                content: content,
                category: category,
                author: author,
                date: new Date().toISOString().split('T')[0],
                image: image,
                status: status
            };
            blogs.unshift(newBlog);
            if (status === 'published') triggerNotification(newBlog);
        }

        saveBlogs(blogs);
        closeAllEditors();
        renderDashboard();
    }

    function deleteBlog(id) {
        var blogs = getBlogs().filter(function (p) { return p.id !== id; });
        saveBlogs(blogs);
        renderDashboard();
    }

    // ─── Post Editor ───
    var currentPostImageData = '';

    function openPostEditor(postId) {
        showEditor('admin-post-editor');
        var isEdit = !!postId;
        var post = isEdit ? getSitePosts().find(function (p) { return p.id === postId; }) : null;

        document.getElementById('post-editor-title').textContent = isEdit ? 'Edit Post' : 'New Post';
        document.getElementById('post-title').value = post ? post.title : '';
        document.getElementById('post-excerpt').value = post ? post.excerpt : '';
        document.getElementById('post-image-url').value = (post && !post.image.startsWith('data:')) ? post.image : '';
        document.getElementById('post-author').value = post ? post.author : 'NVConsult Team';
        document.getElementById('post-status').value = post ? post.status : 'published';
        document.getElementById('post-editor-content').innerHTML = post ? post.content : '<p>Start writing your post here...</p>';

        currentPostImageData = '';
        var preview = document.getElementById('post-image-preview');
        if (post && post.image) {
            preview.src = post.image;
            preview.style.display = 'block';
            if (post.image.startsWith('data:')) currentPostImageData = post.image;
        } else {
            preview.style.display = 'none';
        }

        var urlInput = document.getElementById('post-image-url');
        urlInput.oninput = function () {
            if (urlInput.value) { preview.src = urlInput.value; preview.style.display = 'block'; currentPostImageData = ''; }
            else { preview.style.display = 'none'; }
        };

        var fileInput = document.getElementById('post-image-file');
        var newFileInput = fileInput.cloneNode(true);
        fileInput.parentNode.replaceChild(newFileInput, fileInput);
        handleFileUpload(newFileInput, preview, function (dataUrl) { currentPostImageData = dataUrl; });

        setupImageTabs(document.getElementById('admin-post-editor'));
        setupEditorToolbar(document.getElementById('post-toolbar'));

        var saveBtn = document.getElementById('save-post-btn');
        var newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        newSaveBtn.addEventListener('click', function () { savePost(isEdit ? postId : null); });
    }

    function savePost(editId) {
        var title = document.getElementById('post-title').value.trim();
        var excerpt = document.getElementById('post-excerpt').value.trim();
        var imageUrl = document.getElementById('post-image-url').value.trim();
        var author = document.getElementById('post-author').value.trim() || 'NVConsult Team';
        var status = document.getElementById('post-status').value;
        var content = document.getElementById('post-editor-content').innerHTML;

        if (!title) { alert('Please enter a post title.'); return; }
        if (!excerpt) { alert('Please enter an excerpt.'); return; }

        var image = currentPostImageData || imageUrl || 'img/carousel-1.jpg';
        var posts = getSitePosts();
        var slug = generateSlug(title);

        if (editId) {
            var idx = -1;
            posts.forEach(function (p, i) { if (p.id === editId) idx = i; });
            if (idx !== -1) {
                posts[idx].title = title;
                posts[idx].slug = slug;
                posts[idx].excerpt = excerpt;
                posts[idx].image = image;
                posts[idx].author = author;
                posts[idx].status = status;
                posts[idx].content = content;
            }
        } else {
            var newPost = {
                id: generateId('post'),
                slug: slug,
                title: title,
                excerpt: excerpt,
                content: content,
                author: author,
                date: new Date().toISOString().split('T')[0],
                image: image,
                status: status
            };
            posts.unshift(newPost);
            if (status === 'published') triggerNotification(newPost);
        }

        saveSitePosts(posts);
        closeAllEditors();
        renderDashboard();
    }

    function deletePost(id) {
        var posts = getSitePosts().filter(function (p) { return p.id !== id; });
        saveSitePosts(posts);
        renderDashboard();
    }

    // ─── Category Select ───
    function renderCategorySelect(selectId, selectedCategory) {
        var catSelect = document.getElementById(selectId);
        var cats = getCategories();
        catSelect.innerHTML = cats.map(function (cat) {
            return '<option value="' + cat + '"' + (cat === selectedCategory ? ' selected' : '') + '>' + cat + '</option>';
        }).join('') + '<option value="__add_new__">+ Add New Category...</option>';

        var newCatSelect = catSelect.cloneNode(true);
        catSelect.parentNode.replaceChild(newCatSelect, catSelect);
        newCatSelect.addEventListener('change', function () {
            if (this.value === '__add_new__') {
                var newCat = prompt('Enter new category name:');
                if (newCat && newCat.trim()) {
                    if (addCategory(newCat.trim())) {
                        renderCategorySelect(selectId, newCat.trim());
                    } else {
                        alert('This category already exists.');
                        renderCategorySelect(selectId, selectedCategory);
                    }
                } else {
                    renderCategorySelect(selectId, selectedCategory);
                }
            }
        });
    }

    // ─── Editor Helpers ───
    function showEditor(editorId) {
        document.getElementById('admin-list-view').style.display = 'none';
        document.getElementById('admin-blog-editor').style.display = 'none';
        document.getElementById('admin-post-editor').style.display = 'none';
        document.getElementById(editorId).style.display = 'block';
    }

    function closeAllEditors() {
        document.getElementById('admin-list-view').style.display = 'block';
        document.getElementById('admin-blog-editor').style.display = 'none';
        document.getElementById('admin-post-editor').style.display = 'none';
    }

    function setupEditorToolbar(toolbar) {
        // ── Buttons ──
        toolbar.querySelectorAll('.toolbar-btn').forEach(function (btn) {
            var newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', function (e) {
                e.preventDefault();
                var cmd = this.dataset.command;
                var val = this.dataset.value || null;

                if (cmd === 'createLink') {
                    var url = prompt('Enter URL:');
                    if (url) document.execCommand(cmd, false, url);
                } else if (cmd === 'insertImageLocal') {
                    // Trigger the hidden file input next to this button
                    var fileInput = this.parentNode.querySelector('.toolbar-inline-file');
                    if (fileInput) fileInput.click();
                } else {
                    document.execCommand(cmd, false, val);
                }
            });
        });

        // ── Selects (Format Block, Font Size) ──
        toolbar.querySelectorAll('.toolbar-select').forEach(function (sel) {
            var newSel = sel.cloneNode(true);
            sel.parentNode.replaceChild(newSel, sel);
            newSel.addEventListener('change', function () {
                var cmd = this.dataset.command;
                var val = this.value;
                if (!val) return;
                if (cmd === 'formatBlock') {
                    document.execCommand(cmd, false, '<' + val + '>');
                } else {
                    document.execCommand(cmd, false, val);
                }
                this.selectedIndex = 0; // Reset to label
            });
        });

        // ── Color Pickers ──
        toolbar.querySelectorAll('.toolbar-color').forEach(function (colorInput) {
            var newColor = colorInput.cloneNode(true);
            colorInput.parentNode.replaceChild(newColor, colorInput);
            newColor.addEventListener('input', function () {
                document.execCommand(this.dataset.command, false, this.value);
            });
        });

        // ── Inline Image Upload ──
        toolbar.querySelectorAll('.toolbar-inline-file').forEach(function (fileInput) {
            var newFileInput = fileInput.cloneNode(true);
            fileInput.parentNode.replaceChild(newFileInput, fileInput);
            newFileInput.addEventListener('change', function () {
                var file = this.files[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB.'); return; }
                if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }

                var reader = new FileReader();
                reader.onload = function (e) {
                    // Insert the image at cursor position in the editor
                    var img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';
                    img.style.borderRadius = '8px';
                    img.style.margin = '12px 0';

                    // Try to insert at selection
                    var selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        var range = selection.getRangeAt(0);
                        range.deleteContents();
                        range.insertNode(img);
                        // Move cursor after the image
                        range.setStartAfter(img);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                };
                reader.readAsDataURL(file);
                // Reset so same file can be selected again
                this.value = '';
            });
        });
    }

    // ─── Push Notifications ───
    function triggerNotification(item) {
        localStorage.setItem('nv_new_post', JSON.stringify({
            id: item.id,
            slug: item.slug,
            title: item.title,
            excerpt: item.excerpt,
            timestamp: Date.now()
        }));
        if ('Notification' in window && Notification.permission === 'granted') {
            try { new Notification('New on NVConsult', { body: item.title, icon: 'img/about-2.png', tag: 'nv-new-post' }); }
            catch (e) { }
        }
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'NEW_POST', id: item.id, slug: item.slug, title: item.title });
        }
    }

    // ─── Button Setup ───
    function setupNewButtons() {
        var blogBtn = document.getElementById('new-blog-btn');
        var nb = blogBtn.cloneNode(true);
        blogBtn.parentNode.replaceChild(nb, blogBtn);
        nb.addEventListener('click', function () { openBlogEditor(null); });

        var postBtn = document.getElementById('new-post-btn');
        var np = postBtn.cloneNode(true);
        postBtn.parentNode.replaceChild(np, postBtn);
        np.addEventListener('click', function () { openPostEditor(null); });
    }

    function setupCancelButtons() {
        document.querySelectorAll('.cancel-editor-btn').forEach(function (btn) {
            btn.addEventListener('click', function () { closeAllEditors(); });
        });
    }

    function setupLogout() {
        var btn = document.getElementById('admin-logout-btn');
        if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); logout(); });
    }

    function setupViewSite() {
        var btn = document.getElementById('view-site-btn');
        if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); window.open('blog.html', '_blank'); });
    }

    function formatDate(dateStr) {
        var d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
