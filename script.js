// Users who asked their device to reduce motion get instant jumps instead of smooth scrolling
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollMode = reduceMotion ? 'auto' : 'smooth';

// ==================== NAVBAR SCROLL EFFECT ====================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==================== MOBILE MENU TOGGLE ====================
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link, .dropdown-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Mobile dropdown toggle
document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', function(e) {
        if (window.innerWidth <= 1100) {
            const toggle = this.querySelector('.dropdown-toggle');
            if (e.target === toggle || toggle.contains(e.target)) {
                e.preventDefault();
                this.classList.toggle('open');
            }
        }
    });
});

// ==================== ACTIVE NAV LINK HIGHLIGHT ====================
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            // Sections inside #domain belong to the "Project Scope" dropdown
            const activeId = section.closest('#domain') ? 'domain'
                : sectionId === 'field-visit' ? 'results' : sectionId;
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + activeId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ==================== COUNTER ANIMATION ====================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(easeOut * target);
            
            counter.textContent = current + (counter.dataset.suffix || '');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);

        // Make sure the final value is shown even if animation frames are
        // throttled (e.g. background tab)
        setTimeout(() => {
            counter.textContent = target + (counter.dataset.suffix || '');
        }, duration + 100);
    });
}

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// ==================== SCROLL REVEAL ANIMATION ====================
function addRevealClasses() {
    const revealElements = document.querySelectorAll(
        '.lit-card, .gap-card, .problem-box, .solution-box, ' +
        '.objective-card, .method-step, .tech-category, ' +
        '.milestone-item, .doc-category, .pres-card, ' +
        '.supervisor-card, .team-card, .arch-layer, ' +
        '.contact-item, .contact-form-wrapper, ' +
        '.visit-feature, .visit-info, .visit-thumb'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });
}

addRevealClasses();

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

// ==================== HERO PARTICLES ====================
function createParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        container.appendChild(particle);
    }
}

createParticles();

// ==================== DOCUMENT LINKS ====================
// Items with a real link open in a new tab; items still on href="#"
// are shown as "Coming soon" (or "Pending" for data-status="pending").
document.querySelectorAll('.doc-item').forEach(item => {
    const href = item.getAttribute('href');

    if (href && href !== '#') {
        item.target = '_blank';
        item.rel = 'noopener';
        return;
    }

    const pending = item.dataset.status === 'pending';
    item.removeAttribute('href');
    item.classList.add('is-unavailable');
    item.setAttribute('aria-disabled', 'true');

    const badge = document.createElement('span');
    badge.className = 'doc-badge' + (pending ? ' doc-badge-pending' : '');
    badge.textContent = pending ? 'Pending' : 'Coming soon';

    const icon = item.querySelector('.doc-download');
    if (icon) icon.replaceWith(badge);
    else item.appendChild(badge);
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        // Only in-page links; a link whose href was changed later (e.g. to mailto:) works normally
        if (!href.startsWith('#')) return;
        e.preventDefault();
        if (href === '#') return; // placeholder link, nothing to scroll to
        const target = document.querySelector(href);
        if (target) {
            // Milestones are accordions: open the one that was chosen
            if (target.tagName === 'DETAILS') target.open = true;
            const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: scrollMode
            });
            if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
        }
    });
});

// ==================== CONTACT FORM ====================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        // The chosen topic decides which team member the e-mail goes to
        const topic = document.getElementById('contact-topic');
        const option = topic ? topic.options[topic.selectedIndex] : null;
        const to = (option && option.dataset.email) || this.dataset.email;

        // General e-mail template sent to the research team
        const body =
            'Dear R26-IT-126 Research Team,\n\n' +
            (option ? 'Topic: ' + option.text + '\n\n' : '') +
            message + '\n\n' +
            'Regards,\n' +
            name + '\n' +
            email;

        window.location.href = 'mailto:' + to +
            '?subject=' + encodeURIComponent('[R26-IT-126] ' + subject) +
            '&body=' + encodeURIComponent(body);

        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-envelope-open-text"></i> Opening your email app...';

        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 3000);
    });
}

// ==================== EMAIL TEMPLATE ====================
// The first two lines of the template are "To:" and "Subject:", the rest is the body.
const emailTemplate = document.getElementById('email-template');

if (emailTemplate) {
    const lines = emailTemplate.textContent.split('\n');
    const templateTo = lines[0].replace(/^To:\s*/, '');
    const templateSubject = lines[1].replace(/^Subject:\s*/, '');
    const templateBody = lines.slice(2).join('\n').trim();

    document.getElementById('open-template').href = 'mailto:' + templateTo +
        '?subject=' + encodeURIComponent(templateSubject) +
        '&body=' + encodeURIComponent(templateBody);

    const copyBtn = document.getElementById('copy-template');
    const copyLabel = copyBtn.innerHTML;

    function copiedFeedback(ok) {
        copyBtn.innerHTML = ok
            ? '<i class="fas fa-check"></i> Copied'
            : '<i class="fas fa-times"></i> Copy failed';
        setTimeout(() => { copyBtn.innerHTML = copyLabel; }, 2000);
    }

    copyBtn.addEventListener('click', () => {
        const text = emailTemplate.textContent;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => copiedFeedback(true), () => copiedFeedback(false));
            return;
        }
        // Fallback for browsers without the Clipboard API
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        area.remove();
        copiedFeedback(ok);
    });
}

// ==================== SITE SEARCH ====================
// Builds an index from the page content itself, so new cards, documents
// or members are searchable without any extra work.
const searchOverlay = document.getElementById('search-overlay');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchHint = document.getElementById('search-hint');

const SEARCH_ITEMS = [
    '.lit-card', '.gap-card', '.problem-box', '.solution-box',
    '.objective-card', '.method-step', '.tech-item', '.arch-node',
    '.milestone-item', '.doc-item', '.pres-card', '.pres-video',
    '.supervisor-card', '.team-card', '.contact-item',
    '.visit-facts li', '.visit-feedback', '.visit-thumb', '.acknowledgements'
].join(', ');

function cleanText(el) {
    return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

let searchIndex = null;

function buildSearchIndex() {
    const index = [];

    // Whole sections (e.g. "Methodology", "Documents")
    document.querySelectorAll('section[id]').forEach(section => {
        const title = cleanText(section.querySelector('.section-title'));
        if (!title) return;
        index.push({
            el: section,
            title: title,
            section: 'Section',
            text: cleanText(section.querySelector('.section-desc')),
            weight: 2
        });
    });

    // Individual cards / items
    document.querySelectorAll(SEARCH_ITEMS).forEach(el => {
        const heading = el.querySelector('.milestone-title, .doc-name, .tech-name, h3, h4, .arch-node > span, figcaption');
        const title = cleanText(heading) || cleanText(el).slice(0, 60);
        const section = el.closest('section[id]');
        index.push({
            el: el,
            title: title,
            section: section ? cleanText(section.querySelector('.section-title')) : '',
            text: cleanText(el).replace(title, '').trim(),
            weight: 1
        });
    });

    return index;
}

function snippet(text, word) {
    const i = text.toLowerCase().indexOf(word);
    if (i < 0) return text.slice(0, 110) + (text.length > 110 ? '...' : '');
    const start = Math.max(0, i - 40);
    return (start > 0 ? '...' : '') + text.slice(start, start + 120) + (start + 120 < text.length ? '...' : '');
}

function highlight(str, words) {
    let html = escapeHtml(str);
    words.forEach(w => {
        html = html.replace(new RegExp('(' + escapeRegExp(escapeHtml(w)) + ')', 'gi'), '<mark>$1</mark>');
    });
    return html;
}

let searchMatches = [];
let searchActive = -1;

function runSearch() {
    if (!searchIndex) searchIndex = buildSearchIndex();
    const query = searchInput.value.trim().toLowerCase();
    const words = query.split(/\s+/).filter(Boolean);
    searchResults.innerHTML = '';
    searchActive = -1;

    if (!words.length) {
        searchMatches = [];
        searchHint.hidden = false;
        return;
    }
    searchHint.hidden = true;

    searchMatches = searchIndex
        .map(item => {
            const title = item.title.toLowerCase();
            const all = (item.title + ' ' + item.text).toLowerCase();
            if (!words.every(w => all.includes(w))) return null;
            let score = item.weight;
            words.forEach(w => { if (title.includes(w)) score += 5; });
            if (title.startsWith(words[0])) score += 3;
            return { item, score };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .slice(0, 12)
        .map(m => m.item);

    if (!searchMatches.length) {
        searchResults.innerHTML = '<li class="search-empty">No results for &ldquo;' + escapeHtml(searchInput.value.trim()) + '&rdquo;</li>';
        return;
    }

    searchMatches.forEach((item, i) => {
        const li = document.createElement('li');
        li.className = 'search-result';
        li.setAttribute('role', 'option');
        li.innerHTML =
            '<span class="search-result-section">' + escapeHtml(item.section) + '</span>' +
            '<span class="search-result-title">' + highlight(item.title, words) + '</span>' +
            '<span class="search-result-text">' + highlight(snippet(item.text, words[0]), words) + '</span>';
        li.addEventListener('click', () => goToResult(i));
        li.addEventListener('mousemove', () => setActiveResult(i));
        searchResults.appendChild(li);
    });
    setActiveResult(0);
}

function setActiveResult(i) {
    const items = searchResults.querySelectorAll('.search-result');
    items.forEach((li, n) => li.classList.toggle('active', n === i));
    searchActive = i;
    if (items[i]) items[i].scrollIntoView({ block: 'nearest' });
}

function goToResult(i) {
    const item = searchMatches[i];
    if (!item) return;
    closeSearch();

    const el = item.el;
    // Open the milestone accordion that contains the result
    const details = el.tagName === 'DETAILS' ? el : el.closest('details');
    if (details) details.open = true;
    el.classList.add('reveal', 'active');

    const top = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: top, behavior: scrollMode });

    el.classList.remove('search-flash');
    void el.offsetWidth; // restart the animation
    el.classList.add('search-flash');
    setTimeout(() => el.classList.remove('search-flash'), 2200);
}

function openSearch() {
    searchOverlay.hidden = false;
    document.body.classList.add('search-open');
    searchInput.focus();
    searchInput.select();
    runSearch();
}

function closeSearch() {
    searchOverlay.hidden = true;
    document.body.classList.remove('search-open');
}

if (searchOverlay) {
    document.getElementById('search-open').addEventListener('click', openSearch);
    document.getElementById('search-close').addEventListener('click', closeSearch);
    searchInput.addEventListener('input', runSearch);

    // Click outside the box closes the search
    searchOverlay.addEventListener('click', e => {
        if (e.target === searchOverlay) closeSearch();
    });

    document.addEventListener('keydown', e => {
        const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
        if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing && searchOverlay.hidden)) {
            e.preventDefault();
            openSearch();
            return;
        }
        if (searchOverlay.hidden) return;
        if (e.key === 'Escape') {
            closeSearch();
        } else if (e.key === 'ArrowDown' && searchMatches.length) {
            e.preventDefault();
            setActiveResult((searchActive + 1) % searchMatches.length);
        } else if (e.key === 'ArrowUp' && searchMatches.length) {
            e.preventDefault();
            setActiveResult((searchActive - 1 + searchMatches.length) % searchMatches.length);
        } else if (e.key === 'Enter' && searchActive >= 0) {
            e.preventDefault();
            goToResult(searchActive);
        }
    });
}

// ==================== FIELD VISIT PHOTO VIEWER ====================
const lightbox = document.getElementById('lightbox');
const visitPhotos = [...document.querySelectorAll('.visit-photo-link')];
let lightboxIndex = 0;

function showPhoto(i) {
    lightboxIndex = (i + visitPhotos.length) % visitPhotos.length;
    const link = visitPhotos[lightboxIndex];
    const img = document.getElementById('lightbox-img');
    img.src = link.getAttribute('href');
    img.alt = link.dataset.caption;
    document.getElementById('lightbox-caption').textContent = link.dataset.caption;
}

function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove('search-open');
}

if (lightbox && visitPhotos.length) {
    visitPhotos.forEach((link, i) => {
        link.addEventListener('click', e => {
            e.preventDefault();
            showPhoto(i);
            lightbox.hidden = false;
            document.body.classList.add('search-open'); // stop page scrolling
        });
    });

    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev').addEventListener('click', () => showPhoto(lightboxIndex - 1));
    document.getElementById('lightbox-next').addEventListener('click', () => showPhoto(lightboxIndex + 1));

    lightbox.addEventListener('click', e => {
        if (e.target === lightbox || e.target.tagName === 'FIGURE') closeLightbox();
    });

    document.addEventListener('keydown', e => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') showPhoto(lightboxIndex - 1);
        else if (e.key === 'ArrowRight') showPhoto(lightboxIndex + 1);
    });
}

// ==================== STAGGERED REVEAL FOR GRIDS ====================
function staggerReveal(selector, delayIncrement = 100) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.reveal');
                children.forEach((child, index) => {
                    child.style.transitionDelay = (index * delayIncrement) + 'ms';
                    child.classList.add('active');
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(selector).forEach(container => {
        observer.observe(container);
    });
}

staggerReveal('.lit-review-content', 120);
staggerReveal('.gap-grid', 120);
staggerReveal('.objectives-grid', 120);
staggerReveal('.tech-grid', 100);
staggerReveal('.presentations-grid', 100);
staggerReveal('.team-grid', 120);
staggerReveal('.visit-gallery', 100);

// ==================== TYPING EFFECT FOR HERO (subtle) ====================
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    heroTitle.style.opacity = '1';
}

// ==================== LAST UPDATED (from latest GitHub commit) ====================
// Shows the date and time of the most recent push. If GitHub can't be
// reached, the date written in index.html stays as the fallback.
const lastUpdated = document.getElementById('last-updated');
if (lastUpdated) {
    fetch('https://api.github.com/repos/AshenMayuranga/r26-it-126-website/commits?per_page=1')
        .then(res => res.ok ? res.json() : Promise.reject(res.status))
        .then(commits => {
            const date = new Date(commits[0].commit.committer.date);
            const day = date.toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Colombo'
            });
            const time = date.toLocaleTimeString('en-US', {
                hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Colombo'
            });
            lastUpdated.dateTime = date.toISOString();
            lastUpdated.textContent = `${day}, ${time}`;
        })
        .catch(() => {});
}

// ==================== NAVBAR LINK CLICK FEEDBACK ====================
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

console.log('🌿 Smart Waste Management System - R26-IT-126 - Website loaded successfully.');
