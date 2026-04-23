/* ═══════════════════════════════════════════════════
   ISRAR AHMAD — Antigravity Build (v6)
   Tech: GSAP + Three.js + Lenis
   Design: Liquid Glass & Deep Obsidian
═══════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ── TAB VISIBILITY PAUSE ── */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        lenis?.stop();
        gsap.globalTimeline.pause();
    } else {
        lenis?.start();
        gsap.globalTimeline.resume();
    }
});

/* ── REDUCED MOTION ── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.globalTimeline.timeScale(0);
    lenis?.destroy();
    document.documentElement.style.scrollBehavior = 'auto';
}

/* ── PAGE LOAD CINEMATIC ENTRANCE ── */
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    tl.from('.nav-logo', { opacity: 0, x: -20, duration: 0.6, ease: "power3.out" })
        .from('.nav-links a', { opacity: 0, y: -12, stagger: 0.07, duration: 0.5, ease: "power3.out" }, "-=0.3")
        .from('.nav-cta', { opacity: 0, scale: 0.85, duration: 0.5, ease: "back.out(1.7)" }, "-=0.2")
        .from('.hero-eyebrow', { opacity: 0, x: -24, duration: 0.6, ease: "power3.out" }, "-=0.3")
        .from('.hero-headline .line-1', { opacity: 0, y: 50, duration: 0.7, ease: "power4.out" }, "-=0.4")
        .from('.hero-headline .line-2', { opacity: 0, y: 50, duration: 0.7, ease: "power4.out" }, "-=0.5")
        .from('.hero-sub', { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" }, "-=0.3")
        .from('.hero-ctas', { opacity: 0, y: 16, duration: 0.5, ease: "power3.out" }, "-=0.3")
        .from('#heroCard', { opacity: 0, x: 40, duration: 0.8, ease: "power3.out" }, "-=0.5");
});

/* ── 1. FLUID SMOOTH SCROLL (Lenis) ── */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    lerp: 0.075,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false
});

function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);

/* ── 2. CUSTOM CURSOR & ATMOSPHERIC TRACKING ── */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
const meshBg = document.getElementById('meshBg');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';

    document.addEventListener('mousedown', () => {
        gsap.to(cursor, { scale: 0.6, duration: 0.15, ease: "power2.out" });
        gsap.to(cursorDot, { scale: 2, opacity: 0.6, duration: 0.15 });
    });
    document.addEventListener('mouseup', () => {
        gsap.to(cursor, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" });
        gsap.to(cursorDot, { scale: 1, opacity: 1, duration: 0.3 });
    });

    // Background Mesh Tracking
    if (meshBg) {
        meshBg.style.setProperty('--m-x', `${(mx / window.innerWidth) * 100}%`);
        meshBg.style.setProperty('--m-y', `${(my / window.innerHeight) * 100}%`);
    }

    // Ghost Grid Tracking
    const ghostGrid = document.getElementById('ghostGrid');
    if (ghostGrid) {
        ghostGrid.style.setProperty('--mouse-x', `${(mx / window.innerWidth) * 100}%`);
        ghostGrid.style.setProperty('--mouse-y', `${(my / window.innerHeight) * 100}%`);
    }
});

(function animateCursor() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
})();

/* THREE.JS PARTICLE FIELD REMOVED FOR ATMOSPHERIC RADIAL GRADIENTS */

/* ── SCROLL PROGRESS BAR ── */
const progressBar = document.createElement('div');
progressBar.id = 'scrollProgress';
progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; width: 0%;
    background: linear-gradient(90deg, #00d4c8, #818cf8);
    z-index: 9999; pointer-events: none;
    box-shadow: 0 0 8px rgba(0,212,200,0.6);
    transition: width 0.1s linear;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
}, { passive: true });

/* ── NAV SCROLL SHRINK + GLASS ── */
const nav = document.querySelector('nav') || document.querySelector('.navbar') || document.querySelector('header');
if (nav) {
    ScrollTrigger.create({
        start: 'top -60',
        onUpdate: self => {
            if (self.progress > 0) {
                nav.style.backdropFilter = 'blur(20px)';
                nav.style.background = 'rgba(7,8,18,0.85)';
                nav.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
                nav.style.padding = '10px 32px';
            } else {
                nav.style.backdropFilter = 'blur(0px)';
                nav.style.background = 'transparent';
                nav.style.borderBottom = 'none';
                nav.style.padding = '20px 32px';
            }
        }
    });
}

/* ── HERO PARALLAX DEPTH ── */
window.addEventListener('mousemove', e => {
    const xPct = (e.clientX / window.innerWidth - 0.5);
    const yPct = (e.clientY / window.innerHeight - 0.5);
    gsap.to('.hero-headline', { x: xPct * 12, y: yPct * 8, duration: 0.8, ease: "power2.out" });
    gsap.to('.hero-sub', { x: xPct * 7, y: yPct * 5, duration: 0.9, ease: "power2.out" });
    gsap.to('#heroCard', { x: xPct * -18, y: yPct * -12, duration: 1, ease: "power2.out" });
    gsap.to('.floating-chips', { x: xPct * 22, y: yPct * 14, duration: 1.1, ease: "power2.out" });
});

/* ── 5. MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta, .magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (dist < 100) {
            const strength = (100 - dist) / 100;
            const x = (e.clientX - centerX) * 0.55 * strength;
            const y = (e.clientY - centerY) * 0.55 * strength;
            gsap.to(btn, {
                x: x,
                y: y,
                duration: 0.25,
                ease: "power3.out"
            });
        }
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

/* ── BUTTON RIPPLE ── */
document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', e => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height) * 2;
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px; height: ${size}px;
            left: ${e.clientX - rect.left - size / 2}px;
            top: ${e.clientY - rect.top - size / 2}px;
            background: rgba(255,255,255,0.15);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
        `;
        btn.appendChild(ripple);
        gsap.to(ripple, {
            scale: 1, opacity: 0, duration: 0.7,
            ease: "power2.out",
            onComplete: () => ripple.remove()
        });
    });
});

/* ── 6. CURSOR HOVER EFFECTS ── */
document.querySelectorAll('a, button, .ht-pill, [data-tilt]').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2.5)';
        cursor.style.borderColor = 'var(--accent)';
        if (el.classList.contains('ht-pill')) {
            el.style.boxShadow = 'inset 0 0 20px var(--accent)';
        }
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        el.style.boxShadow = '';
    });
});

/* ── 7. 3D CARD TILT (Refined) ── */
function initTilt() {
    document.querySelectorAll('[data-tilt], #heroCard').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;

            // Surface Glow Tracking for ID Card
            if (el.id === 'heroCard') {
                const inner = el.querySelector('.hcard-inner');
                if (inner) {
                    inner.style.setProperty('--mouse-x', `${(e.clientX - r.left) / r.width * 100}%`);
                    inner.style.setProperty('--mouse-y', `${(e.clientY - r.top) / r.height * 100}%`);
                }
            }

            gsap.to(el, {
                rotateY: x * 6,
                rotateX: -y * 6,
                z: 12,
                duration: 0.4,
                ease: "power2.out"
            });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                rotateY: 0,
                rotateX: 0,
                z: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}
initTilt();

/* ── PROJECT CARD IMAGE REVEAL ── */
document.querySelectorAll('.project-card').forEach(card => {
    const img = card.querySelector('.project-thumb, img');
    if (!img) return;
    gsap.set(img, { scale: 1.08, transformOrigin: 'center center' });
    card.addEventListener('mouseenter', () => {
        gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });
        gsap.to(card, { y: -6, duration: 0.4, ease: "power2.out" });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(img, { scale: 1.08, duration: 0.6, ease: "power2.inOut" });
        gsap.to(card, { y: 0, duration: 0.5, ease: "power3.out" });
    });
});

/* ── SKILL CARD GLOW HOVER ── */
document.querySelectorAll('.skill-card').forEach(card => {
    const accent = card.dataset.accent || '#00d4c8';
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            boxShadow: `0 0 0 1px ${accent}55, 0 8px 32px ${accent}22`,
            y: -4,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
            y: 0,
            duration: 0.5,
            ease: "power3.out"
        });
    });
});

/* ── SKILL BAR ANIMATIONS ── */
const skillBars = document.querySelectorAll('.skill-bar-fill');
if (skillBars.length) {
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const target = bar.dataset.width || bar.style.width;
                bar.style.width = '0%';
                gsap.to(bar, {
                    width: target,
                    duration: 1.1,
                    ease: "expo.out",
                    delay: parseFloat(bar.dataset.delay || 0)
                });
                barObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });
    skillBars.forEach((bar, i) => {
        bar.dataset.delay = (i * 0.06);
        bar.dataset.width = bar.style.width;
        bar.style.width = '0%';
        barObserver.observe(bar);
    });
}

/* ── ANIMATED NUMBER COUNTERS ── */
document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = el.dataset.decimals || 0;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.fromTo({ val: 0 },
                    { val: 0 },
                    {
                        val: target,
                        duration: 1.8,
                        ease: "power2.out",
                        onUpdate: function () {
                            el.textContent = prefix + this.targets()[0].val.toFixed(decimals) + suffix;
                        }
                    }
                );
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(el);
});

// Staggered Stats Reveal
gsap.to(".reveal-hstat", {
    opacity: 1,
    y: 0,
    stagger: 0.15,
    duration: 1,
    ease: "back.out(1.7)",
    delay: 1.5,
    scrollTrigger: {
        trigger: "#hero",
        start: "top center"
    }
});

/* ── 8. SCROLL REVEAL (De-blur & Entrance) ── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.to(entry.target, {
                opacity: 1,
                y: 0,
                x: 0,
                filter: "blur(0px)",
                duration: 0.9,
                ease: "power3.out",
                delay: entry.target.dataset.delay || 0
            });
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

/* ── SECTION LABEL COUNTER ANIMATION ── */
document.querySelectorAll('.section-label, .section-num').forEach(label => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.from(label, {
                    opacity: 0, x: -16,
                    duration: 0.5, ease: "power3.out"
                });
                observer.unobserve(label);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(label);
});

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .project-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = el.classList.contains('reveal-left') ? 'translateX(-50px)' : (el.classList.contains('reveal-right') ? 'translateX(50px)' : 'translateY(40px)');
    el.style.filter = 'blur(8px)';
    el.style.willChange = 'transform, opacity, filter';
    el.dataset.delay = (i % 4) * 0.08;
    revealObserver.observe(el);
});

ScrollTrigger.batch('.bento-card, .skill-card, .cert-card', {
    onEnter: batch => gsap.from(batch, {
        opacity: 0, y: 30, scale: 0.97,
        stagger: 0.07, duration: 0.7,
        ease: "power3.out"
    }),
    start: "top 88%"
});

/* ── 9. TIMELINE BEAD SCROLL ── */
const timelineBead = document.getElementById('timelineBead');
if (timelineBead) {
    window.addEventListener('scroll', () => {
        const container = document.querySelector('.experience-container');
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const winH = window.innerHeight;

        if (rect.top < winH && rect.bottom > 0) {
            const progress = Math.max(0, Math.min(1, (winH - rect.top) / (winH + rect.height)));
            timelineBead.style.top = `${progress * 100}%`;

            // Light up dots
            document.querySelectorAll('.tl-item').forEach(item => {
                const itemRect = item.getBoundingClientRect();
                if (itemRect.top < winH * 0.6 && !item.classList.contains('active')) {
                    item.classList.add('active');
                    const dot = item.querySelector('.tl-dot');
                    if (dot) {
                        gsap.fromTo(dot,
                            { scale: 0.4, boxShadow: '0 0 0px rgba(0,212,200,0)' },
                            { scale: 1, boxShadow: '0 0 16px rgba(0,212,200,0.7)', duration: 0.5, ease: "back.out(2)" }
                        );
                    }
                }
            });
        }
    }, { passive: true });
}

/* ── AMBIENT SECTION GLOW ON SCROLL ── */
const glowMap = {
    'hero': 'rgba(0,212,200,0.06)',
    'about': 'rgba(129,140,248,0.06)',
    'skills': 'rgba(0,212,200,0.05)',
    'projects': 'rgba(251,146,60,0.05)',
    'experience': 'rgba(129,140,248,0.06)',
    'contact': 'rgba(0,212,200,0.07)'
};
const ambientObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const color = glowMap[entry.target.id] || 'transparent';
            gsap.to('body', {
                '--ambient': color,
                duration: 1.2,
                ease: "power2.inOut"
            });
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('section[id]').forEach(s => ambientObserver.observe(s));

/* ── 10. CONTACT SECTION — NO JS ANIMATION ── */
// Scramble and dynamic weight logic removed per user request for static, professional finish.

/* Text scramble listeners removed */

// Portal Entrance Animation
gsap.to("#contactPortal", {
    scrollTrigger: {
        trigger: "#contact",
        start: "top 60%",
        end: "top 20%",
        toggleActions: "play none none reverse"
    },
    opacity: 1,
    scale: 1,
    duration: 1.5,
    ease: "power4.out"
});

/* ── CONTACT FORM SUBMIT FEEDBACK ── */
const contactForm = document.querySelector('#contactForm, .contact-form, form');
if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = contactForm.querySelector('[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = '⏳ Sending...';
        btn.disabled = true;
        gsap.to(btn, { scale: 0.97, duration: 0.15 });
        await new Promise(r => setTimeout(r, 1800));
        btn.innerHTML = '✓ Message Sent!';
        btn.style.background = '#00d4c8';
        btn.style.color = '#000';
        gsap.to(btn, { scale: 1, duration: 0.4, ease: "back.out(1.7)" });
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
            contactForm.reset();
        }, 3000);
    });
}

/* ── COPY TO CLIPBOARD (Email chip) ── */
document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
        navigator.clipboard.writeText(el.dataset.copy).then(() => {
            const original = el.innerHTML;
            el.innerHTML = '✓ Copied!';
            el.style.color = '#00d4c8';
            el.style.borderColor = 'rgba(0,212,200,0.4)';
            setTimeout(() => {
                el.innerHTML = original;
                el.style.color = '';
                el.style.borderColor = '';
            }, 2000);
        });
    });
});

/* ── 11. MODAL ── */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

function openModal(html) {
    modalBody.innerHTML = html;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    const panel = modalOverlay.querySelector('.modal-panel') || modalOverlay;
    gsap.fromTo(panel,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
    );
    gsap.fromTo(modalOverlay,
        { backdropFilter: 'blur(0px)' },
        { backdropFilter: 'blur(16px)', duration: 0.4, ease: "power2.out" }
    );
}
function closeModal() {
    const panel = modalOverlay.querySelector('.modal-panel') || modalOverlay;
    gsap.to(panel, {
        opacity: 0, y: 24, scale: 0.97,
        duration: 0.35, ease: "power2.in",
        onComplete: () => {
            modalOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
window.openModal = openModal;

/* ── LAZY IMAGE LOADING ── */
const lazyImages = document.querySelectorAll('img[data-src]');
if (lazyImages.length) {
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.style.opacity = '0';
                img.onload = () => gsap.to(img, { opacity: 1, duration: 0.6, ease: "power2.out" });
                imgObserver.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });
    lazyImages.forEach(img => imgObserver.observe(img));
}

/* ── 10. ACTIVE NAV ── */
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('.nav-links a').forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { rootMargin: '-40% 0px -40% 0px' });
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

/* ── MOBILE HORIZONTAL DRAG SCROLL ── */
document.querySelectorAll('.skill-row, .cert-row, .tag-row').forEach(row => {
    let isDown = false, startX, scrollLeft;
    row.addEventListener('mousedown', e => {
        isDown = true;
        row.style.cursor = 'grabbing';
        startX = e.pageX - row.offsetLeft;
        scrollLeft = row.scrollLeft;
    });
    row.addEventListener('mouseleave', () => { isDown = false; row.style.cursor = 'grab'; });
    row.addEventListener('mouseup', () => { isDown = false; row.style.cursor = 'grab'; });
    row.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - row.offsetLeft;
        row.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
});

/* ── FOOTER ENTRANCE ── */
gsap.from('footer', {
    scrollTrigger: { trigger: 'footer', start: 'top 90%' },
    opacity: 0, y: 30, duration: 0.8, ease: "power3.out"
});
gsap.from('footer *', {
    scrollTrigger: { trigger: 'footer', start: 'top 85%' },
    opacity: 0, y: 16, stagger: 0.08, duration: 0.6, ease: "power3.out"
});