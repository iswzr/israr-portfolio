/* ═══════════════════════════════════════════════════════
   projects.js — Sanity API Integration  (Obsidian v5)
═══════════════════════════════════════════════════════ */

const PROJECT_ID = 'kjynuziu';
const DATASET = 'production';

const QUERY = encodeURIComponent(`*[_type == "project"] | order(featured desc, order asc) {
  title, tagline, category, status, featured,
  "cover": cover.asset->url,
  "resume_file": resume_file.asset->url,
  live_url, github_url, google_drive_url,
  "bodyText": pt::text(body)
}`);

const SANITY_URL = `https://${PROJECT_ID}.api.sanity.io/v2022-03-07/data/query/${DATASET}?query=${QUERY}`;

let allProjects = [];

/* ── SKELETON SHIMMER KEYFRAME ── */
if (!document.getElementById('shimmerStyle')) {
    const s = document.createElement('style');
    s.id = 'shimmerStyle';
    s.textContent = `@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`;
    document.head.appendChild(s);
}

/* ── LABELS ── */
const catLabels = { powerbi: 'Power BI', saas: 'SaaS', analysis: 'Analysis', excel: 'Excel', other: 'Other' };
const catIcons = { powerbi: '📊', saas: '🏥', analysis: '🔍', excel: '📈', other: '📁' };

function statusBadge(s) {
    const styles = {
        live: 'background:rgba(22,163,74,0.08);color:#059669;border:1px solid rgba(22,163,74,0.2);',
        wip: 'background:rgba(217,119,6,0.06);color:#d97706;border:1px solid rgba(217,119,6,0.18)',
        completed: 'background:rgba(79,70,229,0.06);color:#4f46e5;border:1px solid rgba(79,70,229,0.18)'
    };
    const labels = { live: '● Live', wip: '◐ In Progress', completed: '✓ Completed' };
    return `<span class="project-status ${s}" style="padding:3px 10px;border-radius:4px;font-size:11px;font-family:var(--mono);letter-spacing:0.08em;${styles[s] || ''}">${labels[s] || s}</span>`;
}

/* ── CARD ── */
function renderCard(meta, index) {
    const cover = meta.cover
        ? `<img class="project-cover" src="${meta.cover}" alt="${meta.title}" loading="lazy" style="transition:transform 0.6s ease;transform:scale(1.05)">`
        : `<div class="project-cover-placeholder" style="width:100%;height:180px;display:flex;align-items:center;justify-content:center;font-size:48px;background:linear-gradient(135deg,rgba(0,0,0,0.02),rgba(99,102,241,0.03));border-radius:10px;border:1px solid rgba(0,0,0,0.04);margin-bottom:16px">${catIcons[meta.category] || '📁'}</div>`;

    const liveLink = meta.live_url
        ? `<a class="project-link primary" href="${meta.live_url}" target="_blank" onclick="event.stopPropagation()" style="background:var(--accent2);color:#fff;padding:6px 14px;border-radius:6px;font-size:12px;font-family:var(--mono);text-decoration:none;transition:all 0.2s">🌐 Live</a>`
        : '';
    const ghLink = meta.github_url
        ? `<a class="project-link" href="${meta.github_url}" target="_blank" onclick="event.stopPropagation()" style="background:transparent;color:var(--text2);border:1px solid rgba(0,0,0,0.1);padding:6px 14px;border-radius:6px;font-size:12px;font-family:var(--mono);text-decoration:none;transition:all 0.2s">GitHub ↗</a>`
        : '';

    const desc = (meta.bodyText || '').trim();

    return `
  <div class="project-card glass-card reveal-up ${meta.featured ? 'featured-card bento-span-2' : 'bento-span-1'}"
       data-category="${meta.category || 'other'}"
       data-tilt
       role="button"
       tabindex="0"
       aria-label="View project: ${meta.title}"
       style="cursor:pointer"
       onclick="openProjectModal(${index})"
       onkeydown="if(event.key==='Enter')openProjectModal(${index})">
    <div class="glass-glow" aria-hidden="true"></div>
    <div class="glass-shimmer" aria-hidden="true"></div>
    ${cover}
    <div class="project-info">
      <div class="project-top">
        <span class="project-cat">${catLabels[meta.category] || 'Other'}</span>
        ${statusBadge(meta.status || 'completed')}
        ${meta.featured ? '<span class="featured-badge" style="background:rgba(217,119,6,0.08);color:#d97706;border:1px solid rgba(217,119,6,0.2);padding:3px 10px;border-radius:4px;font-size:11px;font-family:var(--mono);letter-spacing:0.1em;">★ FEATURED</span>' : ''}
      </div>
      <div class="project-title">${meta.title || 'Untitled'}</div>
      ${meta.tagline ? `<div class="project-tagline">${meta.tagline}</div>` : ''}
      <div class="project-desc">${desc.slice(0, 190)}${desc.length > 190 ? '…' : ''}</div>
      <div class="project-links">${liveLink}${ghLink}<span class="project-link">Details →</span></div>
    </div>
  </div>`;
}

/* ── MODAL ── */
function renderModal(meta) {
    const liveLink = meta.live_url ? `<a class="btn-primary" href="${meta.live_url}" target="_blank">🌐 View Live</a>` : '';
    const resumeLink = meta.resume_file ? `<a class="btn-primary" href="${meta.resume_file}" target="_blank" download>📄 View Document</a>` : '';
    const ghLink = meta.github_url ? `<a class="btn-ghost"   href="${meta.github_url}" target="_blank">GitHub ↗</a>` : '';
    const driveLink = meta.google_drive_url ? `<a class="btn-ghost" href="${meta.google_drive_url}" target="_blank">📁 Drive ↗</a>` : '';

    const cover = meta.cover
        ? `<img src="${meta.cover}" alt="${meta.title}" style="width:100%;height:220px;object-fit:cover;border-radius:10px;border:1px solid var(--border);margin-bottom:1.5rem;">`
        : '';

    return `
  ${cover}
  <div class="project-top" style="margin-bottom:1rem">
    <span class="project-cat">${catLabels[meta.category] || 'Other'}</span>
    ${statusBadge(meta.status || 'completed')}
    ${meta.featured ? '<span class="featured-badge">★ Featured</span>' : ''}
  </div>
  <div class="modal-title">${meta.title || 'Untitled'}</div>
  ${meta.tagline ? `<div class="modal-tagline">${meta.tagline}</div>` : ''}
  ${meta.bodyText ? `<div class="modal-desc">${meta.bodyText}</div>` : ''}
  ${meta.bodyText ? `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0">
    <div style="background:rgba(0,212,200,0.06);border:1px solid rgba(0,212,200,0.15);border-radius:8px;padding:14px 16px">
      <div style="font-family:var(--mono);font-size:10px;color:#5a6075;letter-spacing:0.1em;margin-bottom:6px">CATEGORY</div>
      <div style="font-size:14px;color:#e8eaf0">${catLabels[meta.category] || 'Other'}</div>
    </div>
    <div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.15);border-radius:8px;padding:14px 16px">
      <div style="font-family:var(--mono);font-size:10px;color:#5a6075;letter-spacing:0.1em;margin-bottom:6px">STATUS</div>
      <div style="font-size:14px;color:#e8eaf0">${meta.status || 'Completed'}</div>
    </div>
  </div>` : ''}
  <div class="modal-links" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px">${liveLink}${resumeLink}${ghLink}${driveLink}</div>`;
}

/* ── LOAD ── */
async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = `
  ${Array(4).fill(`
    <div class="project-card glass-card bento-span-1" style="pointer-events:none">
      <div style="width:100%;height:180px;background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:10px;margin-bottom:16px;"></div>
      <div style="height:12px;width:60%;background:rgba(255,255,255,0.05);border-radius:4px;margin-bottom:10px;animation:shimmer 1.4s infinite 0.1s;"></div>
      <div style="height:10px;width:80%;background:rgba(255,255,255,0.04);border-radius:4px;animation:shimmer 1.4s infinite 0.2s;"></div>
    </div>`).join('')}`;

    try {
        const res = await fetch(SANITY_URL);
        const data = await res.json();
        allProjects = data.result || [];

        // Inject local mockup images
        allProjects.forEach(p => {
            const title = (p.title || '').toLowerCase();
            const cat = p.category || '';
            if (!p.cover || p.cover === '') {
                if (title.includes('clinicos') || cat === 'saas') {
                    p.cover = '/assets/images/projects/clinicos.png';
                } else if (cat === 'powerbi' || title.includes('dashboard')) {
                    p.cover = '/assets/images/projects/analytics.png';
                } else {
                    p.cover = '/assets/images/projects/abstract.png';
                }
            }
        });

        // Featured first
        allProjects.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

        renderProjects('all');
    } catch (err) {
        console.error('Sanity fetch error:', err);
        grid.innerHTML = `
          <div style="text-align:center;padding:60px 24px;color:#6b7280;font-family:var(--mono);font-size:13px">
            <div style="font-size:32px;margin-bottom:16px">⚠</div>
            <div style="color:#ef4444;margin-bottom:12px">Failed to load projects</div>
            <button onclick="loadProjects()" style="background:rgba(0,212,200,0.1);color:#00d4c8;border:1px solid rgba(0,212,200,0.25);padding:8px 20px;border-radius:6px;font-family:var(--mono);font-size:12px;cursor:pointer">
              Retry ↺
            </button>
          </div>`;
    }
}

function renderProjects(filter) {
    const grid = document.getElementById('projectsGrid');
    const filtered = filter === 'all'
        ? allProjects
        : allProjects.filter(p => p.category === filter);

    if (!filtered.length) {
        grid.innerHTML = `<div class="projects-loading mono">No projects in this category yet.</div>`;
        return;
    }

    grid.innerHTML = filtered.map((meta, i) => renderCard(meta, allProjects.indexOf(meta))).join('');

    // Re-init interactions
    if (window.reinitTilt) window.reinitTilt();
    if (window.reinitGlow) window.reinitGlow();

    // Re-observe new cards for reveal
    grid.querySelectorAll('.project-card').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(32px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${i * 0.06}s`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }));
    });
}

/* ── FILTER BUTTONS ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const grid = document.getElementById('projectsGrid');
        gsap.to(grid, {
            opacity: 0, y: 12, duration: 0.2, ease: "power2.in",
            onComplete: () => {
                renderProjects(btn.dataset.filter);
                gsap.fromTo(grid,
                    { opacity: 0, y: 12 },
                    { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
                );
            }
        });
    });
});

/* ── MODAL OPEN ── */
window.openProjectModal = function (index) {
    openModal(renderModal(allProjects[index]));
};

// Boot
loadProjects();