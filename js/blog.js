// NVConsult Blog System — Data Management & Rendering
(function () {
    'use strict';

    // ─── Slug Generator ───
    function generateSlug(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // ─── Seed Data ───
    var SEED_POSTS = [
        {
            id: 'post-1',
            slug: 'top-5-european-countries-for-work-visas-in-2025',
            title: 'Top 5 European Countries for Work Visas in 2025',
            excerpt: 'Discover which European countries are making it easiest for skilled workers to obtain work visas this year, including Germany, Czech Republic, and Poland.',
            content: '<h2>The Shifting Landscape of European Work Visas</h2><p>Europe continues to be a top destination for skilled professionals seeking new career opportunities. With aging populations and growing labor shortages, many European nations have reformed their immigration policies to attract international talent.</p><p>Here are the top 5 countries that stand out in 2025:</p><h3>1. Germany — The Blue Card Gateway</h3><p>Germany remains the gold standard for work migration in Europe. The EU Blue Card, now with lower salary thresholds, makes it accessible for IT professionals, engineers, and healthcare workers. The new Chancenkarte (Opportunity Card) adds a points-based path for job seekers.</p><h3>2. Czech Republic — Hidden Gem of Central Europe</h3><p>The Czech Republic offers an excellent quality of life at a fraction of Western European costs. The Employee Card process has been streamlined, and Prague\'s booming tech sector actively sponsors international talent.</p><h3>3. Poland — Fastest Growing Economy</h3><p>Poland\'s economy is one of Europe\'s strongest performers. The simplified work permit process and relatively low cost of living make it an attractive option, especially for candidates from neighboring regions.</p><h3>4. Portugal — Digital Nomad Paradise</h3><p>Portugal\'s D7 and Digital Nomad visas have made it a hotspot. With its welcoming culture, affordable living, and growing startup scene, it\'s perfect for tech professionals and remote workers.</p><h3>5. The Netherlands — Innovation Hub</h3><p>The Dutch Highly Skilled Migrant program fast-tracks work permits for qualified professionals. Amsterdam and Rotterdam offer vibrant international communities and excellent career prospects.</p><blockquote>Pro Tip: Start your application process at least 6 months before your intended move date. This gives you time for document preparation, apostille, and visa processing.</blockquote><p>At NVConsult, we specialize in guiding you through the visa application process for all these countries. <strong>Book a free consultation</strong> to discuss which destination best matches your profile and career goals.</p>',
            category: 'Work Visas',
            author: 'NVConsult Team',
            date: '2025-04-10',
            image: 'https://images.unsplash.com/photo-1485081669829-bacb8c7bb1f3?w=800&h=400&fit=crop',
            status: 'published'
        },
        {
            id: 'post-2',
            slug: 'how-to-optimize-your-cv-for-european-employers',
            title: 'How to Optimize Your CV for European Employers',
            excerpt: 'European CVs have different standards than American resumes. Learn how to format, structure, and customize your CV to land interviews with European companies.',
            content: '<h2>Why Your Current CV May Not Work in Europe</h2><p>If you\'re applying to European companies with a standard American-style resume, you might be missing out on opportunities. European employers expect a different format, structure, and level of detail.</p><h3>Key Differences</h3><ul><li><strong>Photo:</strong> Many European countries expect a professional headshot on your CV</li><li><strong>Personal Details:</strong> Date of birth, nationality, and marital status are common (unlike the US)</li><li><strong>Length:</strong> A 2-page CV is standard, with detailed work experience descriptions</li><li><strong>Education:</strong> List your degrees with European equivalents when possible</li></ul><h3>The Europass Format</h3><p>The Europass CV is a standardized template recognized across the EU. While not always required, using this format ensures your qualifications are easily understood by European HR departments.</p><h3>Language Skills Matter</h3><p>Always include language proficiency levels using the CEFR scale (A1-C2). Even basic knowledge of the local language can set you apart from other international candidates.</p><h3>ATS Optimization</h3><p>Just like in the US, many European companies use Applicant Tracking Systems. Use keywords from the job description, avoid complex formatting, and save as PDF unless instructed otherwise.</p><blockquote>Our Premium Support plan includes professional CV optimization tailored specifically for your target country\'s job market.</blockquote><p>Need personalized help? Our team has helped hundreds of candidates craft CVs that get results. <strong>Book a consultation</strong> to get started.</p>',
            category: 'Career Tips',
            author: 'NVConsult Team',
            date: '2025-04-05',
            image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop',
            status: 'published'
        },
        {
            id: 'post-3',
            slug: 'study-visa-guide-top-universities-in-europe-for-international-students',
            title: 'Study Visa Guide: Top Universities in Europe for International Students',
            excerpt: 'A comprehensive guide to studying in Europe — from choosing the right university to understanding visa requirements and scholarship opportunities.',
            content: '<h2>Your Complete Guide to Studying in Europe</h2><p>Europe is home to some of the world\'s oldest and most prestigious universities. With affordable tuition (many countries offer free education!) and diverse programs taught in English, it\'s no wonder international student enrollment continues to grow.</p><h3>Countries with Free or Low-Cost Tuition</h3><ul><li><strong>Germany:</strong> Public universities charge no tuition for most programs</li><li><strong>Norway:</strong> Free tuition at all public universities</li><li><strong>Czech Republic:</strong> Free tuition for programs taught in Czech</li><li><strong>Austria:</strong> Very low tuition for EU and non-EU students alike</li></ul><h3>Top Programs for International Students</h3><p>Engineering, Computer Science, Business Administration, and Medicine are among the most popular choices. Many universities now offer complete degree programs in English.</p><h3>Student Visa Requirements</h3><p>Most EU countries require:</p><ol><li>Acceptance letter from a recognized institution</li><li>Proof of financial means (typically €8,000-€12,000 per year)</li><li>Health insurance coverage</li><li>Language proficiency certificate</li><li>Clean criminal record</li></ol><h3>Scholarships and Funding</h3><p>Programs like DAAD (Germany), Erasmus Mundus (EU-wide), and Holland Scholarship (Netherlands) offer generous funding for international students. Applications typically open 12-18 months before the academic year.</p><blockquote>Did you know? Many student visas allow 20 hours of part-time work per week, helping you gain experience while studying.</blockquote><p>Confused about which country or program is right for you? <strong>Book a free consultation</strong> and let us guide you through the entire process.</p>',
            category: 'Study Visas',
            author: 'NVConsult Team',
            date: '2025-03-28',
            image: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&h=400&fit=crop',
            status: 'published'
        },
        {
            id: 'post-4',
            slug: 'germany-blue-card-2025-complete-requirements-application-process',
            title: 'Germany Blue Card 2025: Complete Requirements & Application Process',
            excerpt: 'Everything you need to know about the EU Blue Card for Germany — salary requirements, eligible professions, and step-by-step application guide.',
            content: '<h2>The EU Blue Card: Your Gateway to Germany</h2><p>The EU Blue Card is the most popular work permit for skilled professionals moving to Germany. Following the 2024 reform, it\'s now more accessible than ever.</p><h3>New Salary Thresholds (2025)</h3><p>The minimum salary requirement has been revised:</p><ul><li><strong>Standard professions:</strong> €43,800 gross per year</li><li><strong>Shortage occupations (IT, Engineering, Healthcare):</strong> €39,682 gross per year</li></ul><h3>Eligibility Requirements</h3><ol><li>A recognized university degree (check anabin database)</li><li>A binding job offer or employment contract</li><li>Meeting the minimum salary threshold</li><li>Valid passport</li><li>Health insurance in Germany</li></ol><h3>Application Process</h3><p>Step 1: Get your degree recognized through the anabin database or a credential evaluation agency.</p><p>Step 2: Secure a job offer from a German employer.</p><p>Step 3: Apply for the Blue Card at the German embassy in your country or directly at the Ausländerbehörde if you\'re already in Germany on a different visa.</p><p>Step 4: Processing typically takes 4-8 weeks at the embassy.</p><h3>Benefits of the Blue Card</h3><ul><li>Permanent residence after 21-33 months</li><li>Family reunification rights</li><li>Freedom to travel within the Schengen area</li><li>Pathway to German citizenship</li></ul><blockquote>Important: The Blue Card is valid for 4 years or the duration of the work contract plus 3 months, whichever is shorter.</blockquote><p>Ready to start your Blue Card application? <strong>Book a consultation</strong> with our Germany visa specialists today.</p>',
            category: 'Work Visas',
            author: 'NVConsult Team',
            date: '2025-03-20',
            image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=400&fit=crop',
            status: 'published'
        },
        {
            id: 'post-5',
            slug: 'cost-of-living-comparison-european-cities-for-expats',
            title: 'Cost of Living Comparison: European Cities for Expats',
            excerpt: 'Compare living costs across major European cities to help you budget for your relocation — from rent and groceries to transport and healthcare.',
            content: '<h2>Budgeting for Your European Move</h2><p>One of the biggest factors in choosing your destination is the cost of living. We\'ve broken down monthly expenses across popular expat cities to help you plan.</p><h3>Monthly Cost Comparison (Single Person)</h3><p><strong>Prague, Czech Republic:</strong> €800-€1,200/month<br>Rent: €400-€700 | Food: €200-€300 | Transport: €25</p><p><strong>Warsaw, Poland:</strong> €750-€1,100/month<br>Rent: €350-€600 | Food: €200-€250 | Transport: €30</p><p><strong>Berlin, Germany:</strong> €1,200-€1,800/month<br>Rent: €600-€1,000 | Food: €250-€350 | Transport: €86</p><p><strong>Amsterdam, Netherlands:</strong> €1,600-€2,500/month<br>Rent: €900-€1,500 | Food: €300-€400 | Transport: €100</p><p><strong>Lisbon, Portugal:</strong> €1,000-€1,600/month<br>Rent: €500-€900 | Food: €200-€300 | Transport: €40</p><h3>What\'s Included in Most European Countries</h3><ul><li><strong>Healthcare:</strong> Covered through mandatory insurance (often employer-paid)</li><li><strong>Public Transport:</strong> Excellent and affordable compared to driving</li><li><strong>Education:</strong> Free public schools for children</li><li><strong>Vacation:</strong> Minimum 20-25 paid days off per year</li></ul><blockquote>Remember: While Western European cities have higher costs, salaries are proportionally higher. Eastern European cities offer excellent purchasing power.</blockquote><p>Want personalized relocation budgeting? <strong>Our strategy session</strong> includes a detailed cost analysis for your specific situation.</p>',
            category: 'Relocation',
            author: 'NVConsult Team',
            date: '2025-03-15',
            image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&h=400&fit=crop',
            status: 'published'
        },
        {
            id: 'post-6',
            slug: 'linkedin-optimization-getting-noticed-by-european-recruiters',
            title: 'LinkedIn Optimization: Getting Noticed by European Recruiters',
            excerpt: 'Transform your LinkedIn profile to attract European recruiters and hiring managers. Expert tips on keywords, headline, and networking strategies.',
            content: '<h2>Make Your LinkedIn Work for Your European Job Search</h2><p>LinkedIn is the #1 professional networking platform used by European recruiters. A well-optimized profile can generate inbound recruiter messages within weeks.</p><h3>Headline: Your Digital Elevator Pitch</h3><p>Instead of just your job title, craft a headline that includes your expertise and target location:</p><p><em>Bad: "Software Developer at XYZ Company"</em></p><p><em>Good: "Senior Full-Stack Developer | React & Node.js | Open to Opportunities in Germany 🇩🇪"</em></p><h3>About Section: Tell Your Story</h3><p>Your About section should:</p><ul><li>Highlight your key skills and achievements</li><li>Mention your interest in European opportunities</li><li>Include relevant keywords recruiters search for</li><li>Add a call-to-action (e.g., "Open to relocation — let\'s connect!")</li></ul><h3>Experience Section: Quantify Everything</h3><p>European employers value measurable results. Instead of listing responsibilities, focus on achievements:</p><ul><li>❌ "Managed a team of developers"</li><li>✅ "Led a team of 8 developers, delivering 3 major product releases that increased revenue by 40%"</li></ul><h3>Skills & Endorsements</h3><p>Add at least 20 relevant skills. The platform\'s algorithm uses these to match you with recruiters. Prioritize skills mentioned in job descriptions you\'re targeting.</p><blockquote>Pro Tip: Set your location preferences to your target European city. Recruiters filter by location, and this ensures you appear in their searches.</blockquote><p>Our Premium Support plan includes a complete LinkedIn makeover by our career specialists. <strong>Book a consultation</strong> to get started.</p>',
            category: 'Career Tips',
            author: 'NVConsult Team',
            date: '2025-03-08',
            image: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&h=400&fit=crop',
            status: 'published'
        }
    ];

    var DEFAULT_CATEGORIES = ['All', 'Work Visas', 'Study Visas', 'Career Tips', 'Relocation'];
    var POSTS_PER_PAGE = 6;

    // ─── Categories (with localStorage custom ones) ───
    function getCategories() {
        var custom = JSON.parse(localStorage.getItem('nv_blog_categories') || '[]');
        var cats = DEFAULT_CATEGORIES.slice();
        custom.forEach(function(c) {
            if (cats.indexOf(c) === -1) cats.push(c);
        });
        return cats;
    }

    // ─── Data Layer ───
    function getPosts() {
        var posts = JSON.parse(localStorage.getItem('nv_blog_posts') || '[]');
        if (posts.length === 0) {
            localStorage.setItem('nv_blog_posts', JSON.stringify(SEED_POSTS));
            posts = SEED_POSTS;
        }
        // Ensure all posts have slugs
        var needsSave = false;
        posts.forEach(function(p) {
            if (!p.slug) {
                p.slug = generateSlug(p.title);
                needsSave = true;
            }
        });
        if (needsSave) localStorage.setItem('nv_blog_posts', JSON.stringify(posts));
        return posts;
    }

    function getPublishedPosts() {
        return getPosts().filter(function(p) { return p.status === 'published'; }).sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    }

    function getPostById(id) {
        return getPosts().find(function(p) { return p.id === id; });
    }

    function getPostBySlug(slug) {
        return getPosts().find(function(p) { return p.slug === slug; });
    }

    // ─── Blog Listing Page ───
    function initBlogListing() {
        var container = document.getElementById('blog-grid');
        if (!container) return;

        var currentPage = 1;
        var currentCategory = 'All';
        var searchQuery = '';

        // Check URL for category filter
        var urlParams = new URLSearchParams(window.location.search);
        var urlCat = urlParams.get('category');
        if (urlCat) currentCategory = urlCat;

        function getFilteredPosts() {
            var posts = getPublishedPosts();
            if (currentCategory !== 'All') {
                posts = posts.filter(function(p) { return p.category === currentCategory; });
            }
            if (searchQuery) {
                var q = searchQuery.toLowerCase();
                posts = posts.filter(function(p) {
                    return p.title.toLowerCase().indexOf(q) !== -1 ||
                        p.excerpt.toLowerCase().indexOf(q) !== -1 ||
                        p.category.toLowerCase().indexOf(q) !== -1;
                });
            }
            return posts;
        }

        function renderPosts() {
            var posts = getFilteredPosts();
            var totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
            var start = (currentPage - 1) * POSTS_PER_PAGE;
            var pagePosts = posts.slice(start, start + POSTS_PER_PAGE);

            if (pagePosts.length === 0) {
                container.innerHTML = '<div class="col-12 no-posts"><i class="fas fa-search d-block"></i><h4>No posts found</h4><p class="text-muted">Try a different search or category filter.</p></div>';
            } else {
                container.innerHTML = pagePosts.map(function(post, i) {
                    var postUrl = 'blog-post.html?slug=' + post.slug;
                    return '<div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="' + (0.1 + (i * 0.1)) + 's">' +
                        '<div class="blog-card">' +
                            '<div class="blog-card-img">' +
                                '<img src="' + post.image + '" alt="' + post.title + '" onerror="this.src=\'img/carousel-1.jpg\'">' +
                                '<span class="blog-category">' + post.category + '</span>' +
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
            }

            renderPagination(totalPages);
            if (typeof WOW !== 'undefined') new WOW().init();
        }

        function renderPagination(totalPages) {
            var pag = document.getElementById('blog-pagination');
            if (!pag || totalPages <= 1) {
                if (pag) pag.innerHTML = '';
                return;
            }
            var html = '';
            if (currentPage > 1) {
                html += '<button class="page-btn" data-page="' + (currentPage - 1) + '"><i class="fas fa-chevron-left"></i></button>';
            }
            for (var i = 1; i <= totalPages; i++) {
                html += '<button class="page-btn' + (i === currentPage ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
            }
            if (currentPage < totalPages) {
                html += '<button class="page-btn" data-page="' + (currentPage + 1) + '"><i class="fas fa-chevron-right"></i></button>';
            }
            pag.innerHTML = html;

            pag.querySelectorAll('.page-btn').forEach(function(btn) {
                btn.addEventListener('click', function () {
                    currentPage = parseInt(this.dataset.page);
                    renderPosts();
                    window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
                });
            });
        }

        // Category filter buttons
        var filtersEl = document.getElementById('blog-filters');
        if (filtersEl) {
            var cats = getCategories();
            filtersEl.innerHTML = cats.map(function(cat) {
                return '<button class="filter-btn' + (cat === currentCategory ? ' active' : '') + '" data-category="' + cat + '">' + cat + '</button>';
            }).join('');

            filtersEl.querySelectorAll('.filter-btn').forEach(function(btn) {
                btn.addEventListener('click', function () {
                    filtersEl.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
                    this.classList.add('active');
                    currentCategory = this.dataset.category;
                    currentPage = 1;
                    renderPosts();
                });
            });
        }

        // Search
        var searchInput = document.getElementById('blog-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                searchQuery = this.value;
                currentPage = 1;
                renderPosts();
            });
        }

        renderPosts();
    }

    // ─── Single Post Page ───
    function initSinglePost() {
        var postContent = document.getElementById('post-content-area');
        if (!postContent) return;

        var params = new URLSearchParams(window.location.search);
        var postSlug = params.get('slug');
        var postId = params.get('id');

        var post = null;
        if (postSlug) {
            post = getPostBySlug(postSlug);
        } else if (postId) {
            post = getPostById(postId);
        }

        if (!post) {
            postContent.innerHTML = '<div class="text-center py-5"><h3>Post not found</h3><a href="blog.html" class="btn btn-primary mt-3">Back to Blog</a></div>';
            return;
        }

        // Update page title
        document.title = post.title + ' — NVConsult Blog';

        // Render post
        postContent.innerHTML =
            '<div class="post-header">' +
                '<span class="post-category">' + post.category + '</span>' +
                '<h1>' + post.title + '</h1>' +
            '</div>' +
            '<div class="post-meta">' +
                '<span><i class="fas fa-calendar-alt"></i> ' + formatDate(post.date) + '</span>' +
                '<span><i class="fas fa-user"></i> ' + post.author + '</span>' +
                '<span><i class="fas fa-folder"></i> ' + post.category + '</span>' +
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
                '<a href="#" class="share-btn copy-link" id="copy-link-btn" title="Copy link"><i class="fas fa-link"></i></a>' +
            '</div>';

        // Copy link
        var copyBtn = document.getElementById('copy-link-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function (e) {
                e.preventDefault();
                navigator.clipboard.writeText(window.location.href).then(function () {
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(function() { copyBtn.innerHTML = '<i class="fas fa-link"></i>'; }, 2000);
                });
            });
        }

        // Sidebar: Recent Posts
        var recentPostsEl = document.getElementById('recent-posts');
        if (recentPostsEl) {
            var recent = getPublishedPosts().filter(function(p) { return p.id !== post.id; }).slice(0, 4);
            recentPostsEl.innerHTML = recent.map(function(p) {
                return '<div class="recent-post">' +
                    '<img src="' + p.image + '" alt="' + p.title + '" onerror="this.src=\'img/carousel-1.jpg\'">' +
                    '<div class="rp-content">' +
                        '<h6><a href="blog-post.html?slug=' + p.slug + '">' + p.title + '</a></h6>' +
                        '<small><i class="fas fa-calendar-alt me-1"></i>' + formatDate(p.date) + '</small>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        // Sidebar: Categories
        var categoriesEl = document.getElementById('sidebar-categories');
        if (categoriesEl) {
            var allPosts = getPublishedPosts();
            var catCounts = {};
            allPosts.forEach(function(p) { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
            categoriesEl.innerHTML = Object.keys(catCounts).map(function(cat) {
                return '<a href="blog.html?category=' + encodeURIComponent(cat) + '">' + cat + ' <span>' + catCounts[cat] + '</span></a>';
            }).join('');
        }

        // Update breadcrumb
        var breadcrumbPost = document.getElementById('breadcrumb-post-title');
        if (breadcrumbPost) breadcrumbPost.textContent = post.title;
    }

    // ─── Utility ───
    function formatDate(dateStr) {
        var d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    // ─── Init ───
    document.addEventListener('DOMContentLoaded', function () {
        initBlogListing();
        initSinglePost();
    });

    // Expose for admin
    window.NVBlog = { getPosts: getPosts, getPublishedPosts: getPublishedPosts, getPostById: getPostById, getPostBySlug: getPostBySlug, getCategories: getCategories, generateSlug: generateSlug, DEFAULT_CATEGORIES: DEFAULT_CATEGORIES };
})();
