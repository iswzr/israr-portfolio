/* ═══════════════════════════════════════════════════
   ISRAR AHMAD — main.js v5  (Obsidian Edition)
═══════════════════════════════════════════════════ */

/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';
});

(function animateCursor() {
    cx += (mx - cx) * 0.10;
    cy += (my - cy) * 0.10;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
})();

/* ── NAV SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── MOBILE MENU ── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }
window.closeMobile = closeMobile;

/* ── HERO CANVAS (particle field) ── */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

function spawnParticles() {
    particles = [];
    const count = Math.floor(window.innerWidth / 14);
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.0 + 0.2,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,
            alpha: Math.random() * 0.4 + 0.08,
        });
    }
}
spawnParticles();
window.addEventListener('resize', spawnParticles, { passive: true });

(function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${p.alpha})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
    }

    // Draw connections (thinned out for performance)
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(59,130,246,${0.06 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawParticles);
})();

/* ── HERO CARD 3D PARALLAX ── */
const heroCard = document.getElementById('heroCard');
if (heroCard) {
    document.addEventListener('mousemove', e => {
        const x = (e.clientX / window.innerWidth - 0.5) * 12;
        const y = (e.clientY / window.innerHeight - 0.5) * 12;
        heroCard.querySelector('.hcard-inner').style.transform =
            `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
}

/* ── 3D CARD TILT ── */
function initTilt() {
    document.querySelectorAll('[data-tilt]').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            el.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(4px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
}
initTilt();
window.reinitTilt = initTilt;

/* ── MOUSE-TRACKING GLOW ── */
function initGlow() {
    document.querySelectorAll('.glass-card, .project-card, .acard, .skill-card, .tl-right, .svc-card, .cert-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });
}
initGlow();
window.reinitGlow = initGlow;

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 8) * 0.07}s`;
    revealObserver.observe(el);
});

/* ── SKILL BAR ANIMATION ── */
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.sc-fill').forEach((fill, i) => {
                setTimeout(() => {
                    fill.style.width = fill.dataset.w + '%';
                }, i * 60 + 100);
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.skills-grid').forEach(g => barObserver.observe(g));

/* ── MODAL ── */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

function openModal(html) {
    modalBody.innerHTML = html;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
window.openModal = openModal;

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const pos = btn.getBoundingClientRect();
        const x = e.clientX - pos.left - pos.width / 2;
        const y = e.clientY - pos.top - pos.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.4}px)`;
        btn.style.transition = 'none';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.175,0.885,0.32,1.275)';
    });
});

/* ── ACTIVE NAV HIGHLIGHT ON SCROLL ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(a => {
                a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--accent3)' : '';
            });
        }
    });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── SMOOTH COUNTER ANIMATION ── */
function animateCounter(el, target, duration = 1600) {
    const start = performance.now();
    const num = parseFloat(target);
    const suffix = target.replace(/[\d.]/g, '');
    (function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = (num * eased).toFixed(num % 1 !== 0 ? 1 : 0);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(update);
    })(start);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.hcs-num').forEach(el => {
                const raw = el.textContent;
                animateCounter(el, raw);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.hcard-stats').forEach(s => counterObserver.observe(s));