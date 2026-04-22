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

/* ── LABELS ── */
const catLabels = { powerbi: 'Power BI', saas: 'SaaS', analysis: 'Analysis', excel: 'Excel', other: 'Other' };
const catIcons = { powerbi: '📊', saas: '🏥', analysis: '🔍', excel: '📈', other: '📁' };

function statusBadge(s) {
    const map = { live: 'Live', wip: 'In Progress', completed: 'Completed' };
    return `<span class="project-status ${s}">${map[s] || s}</span>`;
}

/* ── CARD ── */
function renderCard(meta, index) {
    const cover = meta.cover
        ? `<img class="project-cover" src="${meta.cover}" alt="${meta.title}" loading="lazy">`
        : `<div class="project-cover-placeholder">${catIcons[meta.category] || '📁'}</div>`;

    const liveLink = meta.live_url
        ? `<a class="project-link primary" href="${meta.live_url}" target="_blank" onclick="event.stopPropagation()">🌐 Live</a>`
        : '';
    const ghLink = meta.github_url
        ? `<a class="project-link" href="${meta.github_url}" target="_blank" onclick="event.stopPropagation()">GitHub ↗</a>`
        : '';

    const desc = (meta.bodyText || '').trim();

    return `
  <div class="project-card glass-card ${meta.featured ? 'featured-card' : ''}"
       data-category="${meta.category || 'other'}"
       onclick="openProjectModal(${index})">
    ${cover}
    <div class="project-info">
      <div class="project-top">
        <span class="project-cat">${catLabels[meta.category] || 'Other'}</span>
        ${statusBadge(meta.status || 'completed')}
        ${meta.featured ? '<span class="featured-badge">★ Featured</span>' : ''}
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
  <div class="modal-links">${liveLink}${resumeLink}${ghLink}${driveLink}</div>`;
}

/* ── LOAD ── */
async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = `<div class="projects-loading mono">Loading projects…</div>`;

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
        grid.innerHTML = `<div class="projects-loading mono" style="color:#ef4444">Failed to load projects. Please try again.</div>`;
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
        renderProjects(btn.dataset.filter);
    });
});

/* ── MODAL OPEN ── */
window.openProjectModal = function (index) {
    openModal(renderModal(allProjects[index]));
};

// Boot
loadProjects();