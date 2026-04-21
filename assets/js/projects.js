/* ═══════════════════════════════════════════
   projects.js — fixed front-matter parser
═══════════════════════════════════════════ */

function parseFrontMatter(raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return { meta: {}, body: raw.trim() };

    const meta = {};
    const lines = match[1].split(/\r?\n/);
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // skip blank lines
        if (!line.trim()) { i++; continue; }

        // top-level key: value
        const topMatch = line.match(/^([a-zA-Z_]\w*):\s*(.*)/);
        if (!topMatch) { i++; continue; }

        const key = topMatch[1];
        const val = topMatch[2].trim();

        if (val === '' || val === '[]') {
            // could be a list
            const items = [];
            i++;
            while (i < lines.length) {
                const nextLine = lines[i];
                if (!nextLine.match(/^\s+-/)) break;

                const itemVal = nextLine.replace(/^\s+-\s*/, '').trim();

                // check if it's a sub-object (next lines are indented key: value)
                if (itemVal === '') {
                    // sub-object
                    const obj = {};
                    i++;
                    while (i < lines.length && lines[i].match(/^\s{2,}\w/)) {
                        const sub = lines[i].match(/^\s+(\w+):\s*(.*)/);
                        if (sub) obj[sub[1]] = sub[2].trim().replace(/^["']|["']$/g, '');
                        i++;
                    }
                    if (Object.keys(obj).length) items.push(obj);
                } else {
                    items.push(itemVal.replace(/^["']|["']$/g, ''));
                    i++;
                }
            }
            meta[key] = val === '[]' ? [] : items;
        } else {
            // scalar
            const clean = val.replace(/^["']|["']$/g, '');
            if (clean === 'true') meta[key] = true;
            else if (clean === 'false') meta[key] = false;
            else if (!isNaN(clean) && clean !== '') meta[key] = Number(clean);
            else meta[key] = clean;
            i++;
        }
    }

    const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim();
    return { meta, body };
}

/* ── LABELS ── */
const catLabels = {
    powerbi: 'Power BI', saas: 'SaaS', analysis: 'Analysis', excel: 'Excel', other: 'Other'
};
const catIcons = {
    powerbi: '📊', saas: '🏥', analysis: '🔍', excel: '📈', other: '📁'
};

function statusBadge(s) {
    const map = { live: 'Live', wip: 'In Progress', completed: 'Completed' };
    return `<span class="project-status ${s}">${map[s] || s}</span>`;
}

/* ── CARD ── */
function renderCard(meta, body, index) {
    const cover = meta.cover && meta.cover !== ''
        ? `<img class="project-cover" src="${meta.cover}" alt="${meta.title}" loading="lazy">`
        : `<div class="project-cover-placeholder">${catIcons[meta.category] || '📁'}</div>`;

    const stack = (meta.stack || [])
        .map((t, i) => `<span class="stack-tag${i < 3 ? ' hl' : ''}">${t}</span>`).join('');

    const liveLink = meta.live_url
        ? `<a class="project-link primary" href="${meta.live_url}" target="_blank" onclick="event.stopPropagation()">🌐 Live</a>` : '';
    const ghLink = meta.github_url
        ? `<a class="project-link" href="${meta.github_url}" target="_blank" onclick="event.stopPropagation()">GitHub ↗</a>` : '';

    return `
    <div class="project-card ${meta.featured ? 'featured-card' : ''}"
         data-category="${meta.category || 'other'}"
         onclick="openProjectModal(${index})">
      ${cover}
      <div class="project-top">
        <span class="project-cat">${catLabels[meta.category] || 'Other'}</span>
        ${statusBadge(meta.status || 'completed')}
        ${meta.featured ? '<span class="featured-badge">★ Featured</span>' : ''}
      </div>
      <div class="project-title">${meta.title || 'Untitled'}</div>
      ${meta.tagline ? `<div class="project-tagline">${meta.tagline}</div>` : ''}
      <div class="project-desc">${(meta.description || body || '').slice(0, 180)}${(meta.description || body || '').length > 180 ? '...' : ''}</div>
      <div class="project-stack">${stack}</div>
      <div class="project-links">${liveLink}${ghLink}<span class="project-link">Details →</span></div>
    </div>`;
}

/* ── MODAL ── */
function renderModal(meta, body) {
    const gallery = (meta.gallery || [])
        .filter(Boolean).map(img => `<img src="${img}" alt="${meta.title}">`).join('');
    const stack = (meta.stack || [])
        .map(t => `<span class="stack-tag">${t}</span>`).join('');
    const files = (meta.files || [])
        .map(f => `<a class="modal-file-link" href="${f.path}" download>📎 ${f.label}</a>`).join('');
    const liveLink = meta.live_url
        ? `<a class="btn-primary" href="${meta.live_url}" target="_blank">🌐 View Live</a>` : '';
    const ghLink = meta.github_url
        ? `<a class="btn-ghost" href="${meta.github_url}" target="_blank">GitHub ↗</a>` : '';

    return `
    ${gallery ? `<div class="modal-gallery">${gallery}</div>` : ''}
    <div class="project-top" style="margin-bottom:1rem">
      <span class="project-cat">${catLabels[meta.category] || 'Other'}</span>
      ${statusBadge(meta.status || 'completed')}
      ${meta.featured ? '<span class="featured-badge">★ Featured</span>' : ''}
    </div>
    <div class="modal-title">${meta.title || 'Untitled'}</div>
    ${meta.tagline ? `<div class="modal-tagline">${meta.tagline}</div>` : ''}
    <div class="modal-desc">${meta.description || ''}</div>
    ${body ? `<div class="modal-desc" style="white-space:pre-line;margin-top:0">${body}</div>` : ''}
    ${stack ? `<div class="modal-sec">Tech Stack</div><div class="modal-stack">${stack}</div>` : ''}
    ${files ? `<div class="modal-sec">Downloads</div><div class="modal-files">${files}</div>` : ''}
    <div class="modal-links">${liveLink}${ghLink}</div>`;
}

/* ── LOAD ── */
let allProjects = [];

async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    let files = [];
    try {
        const res = await fetch('/content/projects/manifest.json');
        if (res.ok) files = await res.json();
    } catch (_) { }

    if (!files.length) {
        grid.innerHTML = `<div class="projects-loading">No projects yet — add via <a href="/admin" style="color:var(--accent)">CMS</a>.</div>`;
        return;
    }

    const results = await Promise.allSettled(files.map(f => fetch(`/content/projects/${f}`).then(r => r.text())));

    allProjects = results
        .filter(r => r.status === 'fulfilled')
        .map(r => parseFrontMatter(r.value))
        .sort((a, b) => {
            if (b.meta.featured && !a.meta.featured) return 1;
            if (a.meta.featured && !b.meta.featured) return -1;
            return (a.meta.order || 99) - (b.meta.order || 99);
        });

    renderProjects('all');
    if (window.reinitTilt) window.reinitTilt();
}

function renderProjects(filter) {
    const grid = document.getElementById('projectsGrid');
    const filtered = allProjects.filter(p => filter === 'all' || p.meta.category === filter);
    grid.innerHTML = filtered.length
        ? filtered.map(({ meta, body }, i) => renderCard(meta, body, i)).join('')
        : `<div class="projects-loading">No projects in this category.</div>`;
    if (window.reinitTilt) window.reinitTilt();
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects(btn.dataset.filter);
    });
});

window.openProjectModal = function (index) {
    const { meta, body } = allProjects[index];
    openModal(renderModal(meta, body));
};

loadProjects();