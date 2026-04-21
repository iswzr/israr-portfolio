/* ═══════════════════════════════════
   ISRAR AHMAD — main.js v2
═══════════════════════════════════ */

/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';
});

function animateCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

/* ── NAV SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
});

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
window.addEventListener('resize', resizeCanvas);

function spawnParticles() {
    particles = [];
    const count = Math.floor(window.innerWidth / 12);
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.2 + 0.3,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            alpha: Math.random() * 0.5 + 0.1,
        });
    }
}
spawnParticles();

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,240,${p.alpha})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
    });
    // draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0,200,240,${0.08 * (1 - dist / 90)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawParticles);
}
drawParticles();

/* ── 3D CARD TILT ── */
function initTilt() {
    document.querySelectorAll('[data-tilt]').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            el.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(4px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}
initTilt();

/* ── HERO CARD 3D MOUSE PARALLAX ── */
const heroCard = document.getElementById('heroCard');
if (heroCard) {
    document.addEventListener('mousemove', e => {
        const x = (e.clientX / window.innerWidth - 0.5) * 14;
        const y = (e.clientY / window.innerHeight - 0.5) * 14;
        heroCard.querySelector('.hcard-inner').style.transform =
            `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
}

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
    revealObserver.observe(el);
});

/* ── SKILL BAR ANIMATION ── */
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.sc-fill').forEach(fill => {
                setTimeout(() => {
                    fill.style.width = fill.dataset.w + '%';
                }, 100);
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

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

/* ── RE-INIT TILT after DOM updates ── */
window.reinitTilt = initTilt;