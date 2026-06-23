/* ═══════════════════════════════════════════
   projects.js — Sanity fetch, zero deps
═══════════════════════════════════════════ */

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

const catLabels = { powerbi: 'Power BI', saas: 'SaaS', analysis: 'Analysis', excel: 'Excel', other: 'Other' };
const catIcons = { powerbi: '📊', saas: '🏥', analysis: '🔍', excel: '📈', other: '📁' };

function statusBadge(s) {
  const labels = { live: '● Live', wip: '◐ In Progress', completed: '✓ Completed' };
  return `<span class="project-status ${s}">${labels[s] || s}</span>`;
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
    ? `<a class="project-link secondary" href="${meta.github_url}" target="_blank" onclick="event.stopPropagation()">GitHub ↗</a>`
    : '';

  const desc = (meta.bodyText || '').trim();

  return `
  <div class="project-card reveal ${meta.featured ? 'featured' : ''}"
       data-category="${meta.category || 'other'}"
       role="button" tabindex="0"
       onclick="openProjectModal(${index})"
       onkeydown="if(event.key==='Enter')openProjectModal(${index})">
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
      <div class="project-links">${liveLink}${ghLink}<span class="project-link details">Details →</span></div>
    </div>
  </div>`;
}

/* ── MODAL ── */
function renderModal(meta) {
  const liveLink = meta.live_url ? `<a class="btn-primary" href="${meta.live_url}" target="_blank">🌐 View Live</a>` : '';
  const resumeLink = meta.resume_file ? `<a class="btn-primary" href="${meta.resume_file}" target="_blank" download>📄 View Document</a>` : '';
  const ghLink = meta.github_url ? `<a class="btn-ghost" href="${meta.github_url}" target="_blank">GitHub ↗</a>` : '';
  const driveLink = meta.google_drive_url ? `<a class="btn-ghost" href="${meta.google_drive_url}" target="_blank">📁 Drive ↗</a>` : '';

  const cover = meta.cover
    ? `<img src="${meta.cover}" alt="${meta.title}" style="width:100%;height:200px;object-fit:cover;border-radius:10px;border:1px solid var(--border);margin-bottom:20px;">`
    : '';

  return `
  ${cover}
  <div class="project-top" style="margin-bottom:12px">
    <span class="project-cat">${catLabels[meta.category] || 'Other'}</span>
    ${statusBadge(meta.status || 'completed')}
    ${meta.featured ? '<span class="featured-badge">★ Featured</span>' : ''}
  </div>
  <div class="modal-title">${meta.title || 'Untitled'}</div>
  ${meta.tagline ? `<div class="modal-tagline">${meta.tagline}</div>` : ''}
  ${meta.bodyText ? `<div class="modal-desc">${meta.bodyText}</div>` : ''}
  ${meta.bodyText ? `
  <div class="modal-meta">
    <div class="modal-meta-item">
      <div class="modal-meta-label">CATEGORY</div>
      <div class="modal-meta-value">${catLabels[meta.category] || 'Other'}</div>
    </div>
    <div class="modal-meta-item">
      <div class="modal-meta-label">STATUS</div>
      <div class="modal-meta-value">${meta.status || 'Completed'}</div>
    </div>
  </div>` : ''}
  <div class="modal-links">${liveLink}${resumeLink}${ghLink}${driveLink}</div>`;
}

/* ── LOAD ── */
async function loadProjects() {
  const grid = document.getElementById('projectsGrid');

  // Skeleton
  grid.innerHTML = Array(3).fill(`
    <div class="project-card" style="pointer-events:none">
      <div style="width:100%;height:200px;background:linear-gradient(90deg,var(--surface) 25%,var(--surface2) 50%,var(--surface) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-bottom:1px solid var(--border)"></div>
      <div style="padding:20px">
        <div style="height:10px;width:40%;background:var(--surface2);border-radius:4px;margin-bottom:10px"></div>
        <div style="height:14px;width:70%;background:var(--surface2);border-radius:4px;margin-bottom:8px"></div>
        <div style="height:10px;width:90%;background:var(--surface2);border-radius:4px"></div>
      </div>
    </div>`).join('');

  try {
    const res = await fetch(SANITY_URL);
    const data = await res.json();
    allProjects = data.result || [];

    // Fallback covers
    allProjects.forEach(p => {
      if (!p.cover || p.cover === '') {
        const title = (p.title || '').toLowerCase();
        const cat = p.category || '';
        if (title.includes('clinicos') || cat === 'saas') {
          p.cover = '/assets/images/projects/clinicos.png';
        } else if (cat === 'powerbi' || title.includes('dashboard')) {
          p.cover = '/assets/images/projects/analytics.png';
        } else {
          p.cover = '/assets/images/projects/abstract.png';
        }
      }
    });

    allProjects.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    renderProjects('all');
  } catch (err) {
    grid.innerHTML = `
      <div class="projects-empty">
        <div style="font-size:24px;margin-bottom:12px">⚠</div>
        <div style="margin-bottom:12px">Failed to load projects</div>
        <button onclick="loadProjects()" class="btn-ghost" style="font-size:12px">Retry ↺</button>
      </div>`;
  }
}

function renderProjects(filter) {
  const grid = document.getElementById('projectsGrid');
  const filtered = filter === 'all'
    ? allProjects
    : allProjects.filter(p => p.category === filter);

  if (!filtered.length) {
    grid.innerHTML = `<div class="projects-empty">No projects in this category yet.</div>`;
    return;
  }

  grid.innerHTML = filtered.map((meta, i) => renderCard(meta, allProjects.indexOf(meta))).join('');

  // Re-init reveal observers for new cards
  if (window.initReveals) window.initReveals();
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