/* ═══════════════════════════════════════════════════════════
   eLogbook — app.js
   Plain JS, no dependencies. Data persisted in localStorage.
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── Service worker registration ──────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

// ── Storage helpers ──────────────────────────────────────────
const STORAGE_KEY = 'elogbook_cases';
const PROFILE_KEY = 'elogbook_profile';

function loadCases() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCases(cases) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// ── Specialty colour map ─────────────────────────────────────
const SPECIALTY_COLOURS = {
  'General Surgery':          '#2dd4bf',
  'Colorectal Surgery':       '#34d399',
  'Upper GI Surgery':         '#60a5fa',
  'Hepatobiliary Surgery':    '#a78bfa',
  'Vascular Surgery':         '#f472b6',
  'Trauma & Orthopaedics':    '#fb923c',
  'Urology':                  '#facc15',
  'Cardiothoracic Surgery':   '#f87171',
  'Neurosurgery':             '#c084fc',
  'ENT':                      '#4ade80',
  'Maxillofacial Surgery':    '#38bdf8',
  'Plastics & Reconstructive':'#fb7185',
  'Paediatric Surgery':       '#a3e635',
};

function specialtyColour(s) {
  return SPECIALTY_COLOURS[s] || '#94afc8';
}

// ── UUID ─────────────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Toast ────────────────────────────────────────────────────
const toastEl = document.getElementById('toast');
let toastTimer;

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2500);
}

// ── Navigation ───────────────────────────────────────────────
const navBtns = document.querySelectorAll('.nav-btn');
let currentPage = 'dashboard';

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  navBtns.forEach(b => b.classList.toggle('active', b.dataset.page === name));
  currentPage = name;
  if (name === 'dashboard') renderDashboard();
  if (name === 'log')       renderLog();
  if (name === 'stats')     renderStats();
  if (name === 'profile')   renderProfile();
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.page));
});

document.getElementById('viewAllBtn').addEventListener('click', () => showPage('log'));

// ── Modal helpers ────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

// Close modals on overlay click
['caseModal', 'detailModal'].forEach(id => {
  document.getElementById(id).addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal(id);
  });
});

// ── Case form ────────────────────────────────────────────────
let editingId = null;

const caseModal  = document.getElementById('caseModal');
const caseForm   = document.getElementById('caseForm');
const modalTitle = document.getElementById('modalTitle');

function openCaseForm(caseData = null) {
  caseForm.reset();
  editingId = null;

  if (caseData) {
    editingId = caseData.id;
    modalTitle.textContent = 'Edit Case';
    document.getElementById('fieldDate').value        = caseData.date        || '';
    document.getElementById('fieldProcedure').value   = caseData.procedure   || '';
    document.getElementById('fieldSpecialty').value   = caseData.specialty   || '';
    document.getElementById('fieldApproach').value    = caseData.approach    || '';
    document.getElementById('fieldUrgency').value     = caseData.urgency     || '';
    document.getElementById('fieldRole').value        = caseData.role        || '';
    document.getElementById('fieldSupervision').value = caseData.supervision || '';
    document.getElementById('fieldSupervisor').value  = caseData.supervisor  || '';
    document.getElementById('fieldAge').value         = caseData.patientAge  || '';
    document.getElementById('fieldSex').value         = caseData.patientSex  || '';
    document.getElementById('fieldASA').value         = caseData.asa         || '';
    document.getElementById('fieldSetting').value     = caseData.setting     || '';
    document.getElementById('fieldFindings').value    = caseData.findings    || '';
    document.getElementById('fieldComplications').value = caseData.complications || '';
    document.getElementById('fieldReflection').value  = caseData.reflection  || '';
  } else {
    modalTitle.textContent = 'Log New Case';
    document.getElementById('fieldDate').value = new Date().toISOString().slice(0, 10);
  }

  // Scroll sheet to top
  caseModal.querySelector('.modal-sheet').scrollTop = 0;
  openModal('caseModal');
}

document.getElementById('fabBtn').addEventListener('click', () => openCaseForm());
document.getElementById('cancelBtn').addEventListener('click', () => closeModal('caseModal'));

caseForm.addEventListener('submit', e => {
  e.preventDefault();

  const procedure = document.getElementById('fieldProcedure').value.trim();
  const date      = document.getElementById('fieldDate').value;
  const specialty = document.getElementById('fieldSpecialty').value;
  const role      = document.getElementById('fieldRole').value;

  if (!procedure || !date || !specialty || !role) {
    showToast('Please fill in all required fields');
    return;
  }

  const caseObj = {
    id:             editingId || uid(),
    date,
    procedure,
    specialty,
    approach:       document.getElementById('fieldApproach').value,
    urgency:        document.getElementById('fieldUrgency').value,
    role,
    supervision:    document.getElementById('fieldSupervision').value,
    supervisor:     document.getElementById('fieldSupervisor').value.trim(),
    patientAge:     document.getElementById('fieldAge').value,
    patientSex:     document.getElementById('fieldSex').value,
    asa:            document.getElementById('fieldASA').value,
    setting:        document.getElementById('fieldSetting').value,
    findings:       document.getElementById('fieldFindings').value.trim(),
    complications:  document.getElementById('fieldComplications').value.trim(),
    reflection:     document.getElementById('fieldReflection').value.trim(),
    createdAt:      editingId ? undefined : Date.now(),
    updatedAt:      Date.now(),
  };

  if (!editingId) caseObj.createdAt = Date.now();

  const cases = loadCases();
  if (editingId) {
    const idx = cases.findIndex(c => c.id === editingId);
    if (idx !== -1) cases[idx] = { ...cases[idx], ...caseObj };
  } else {
    cases.unshift(caseObj);
  }

  saveCases(cases);
  closeModal('caseModal');
  showToast(editingId ? 'Case updated' : 'Case saved');

  // Refresh current view
  if (currentPage === 'dashboard') renderDashboard();
  if (currentPage === 'log')       renderLog();
  if (currentPage === 'stats')     renderStats();
});

// ── Case detail modal ────────────────────────────────────────
function openDetail(caseData) {
  const sup = caseData.supervision
    ? `Level ${caseData.supervision}`
    : '—';

  const supClass = caseData.supervision ? `level-${caseData.supervision}` : '';

  const rows = [
    ['Date',         formatDate(caseData.date)],
    ['Specialty',    caseData.specialty    || '—'],
    ['Approach',     caseData.approach     || '—'],
    ['Urgency',      caseData.urgency      || '—'],
    ['Your Role',    caseData.role         || '—'],
    ['Supervision',  `<span class="${supClass}">${sup}</span>`],
    ['Supervisor',   caseData.supervisor   || '—'],
    ['Patient Age',  caseData.patientAge   ? `${caseData.patientAge} yrs` : '—'],
    ['Patient Sex',  caseData.patientSex   || '—'],
    ['ASA Grade',    caseData.asa          || '—'],
    ['Setting',      caseData.setting      || '—'],
  ];

  const rowsHtml = rows.map(([k, v]) => `
    <div class="detail-row">
      <span class="detail-key">${k}</span>
      <span class="detail-value">${v}</span>
    </div>`).join('');

  const findingsHtml = caseData.findings ? `
    <p class="form-section-title">Operative Findings</p>
    <p class="text-sm" style="color:var(--text-secondary);white-space:pre-wrap">${escHtml(caseData.findings)}</p>` : '';

  const compHtml = caseData.complications ? `
    <p class="form-section-title">Complications</p>
    <p class="text-sm" style="color:var(--text-secondary);white-space:pre-wrap">${escHtml(caseData.complications)}</p>` : '';

  const reflHtml = caseData.reflection ? `
    <p class="form-section-title">Reflection</p>
    <p class="text-sm" style="color:var(--text-secondary);white-space:pre-wrap">${escHtml(caseData.reflection)}</p>` : '';

  document.getElementById('detailContent').innerHTML = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem;margin-bottom:1rem">
      <h2 style="font-family:var(--font-heading);font-size:1.35rem;line-height:1.3;color:var(--text-primary)">${escHtml(caseData.procedure)}</h2>
      <span class="badge badge-teal" style="flex-shrink:0">${escHtml(caseData.specialty || '')}</span>
    </div>
    <div class="card" style="padding:.75rem 1rem;margin-bottom:1rem">${rowsHtml}</div>
    ${findingsHtml}${compHtml}${reflHtml}
    <div style="display:flex;gap:.75rem;margin-top:1.5rem">
      <button class="btn btn-secondary" style="flex:1" id="detailEditBtn">Edit</button>
      <button class="btn btn-danger" style="flex:1" id="detailDeleteBtn">Delete</button>
    </div>`;

  document.getElementById('detailEditBtn').addEventListener('click', () => {
    closeModal('detailModal');
    openCaseForm(caseData);
  });

  document.getElementById('detailDeleteBtn').addEventListener('click', () => {
    closeModal('detailModal');
    confirmDelete(caseData.id);
  });

  document.getElementById('detailModal').querySelector('.modal-sheet').scrollTop = 0;
  openModal('detailModal');
}

// ── Delete confirmation ──────────────────────────────────────
let pendingDeleteId = null;
const confirmOverlay = document.getElementById('confirmOverlay');

function confirmDelete(id) {
  pendingDeleteId = id;
  confirmOverlay.classList.add('open');
}

document.getElementById('confirmNo').addEventListener('click', () => {
  confirmOverlay.classList.remove('open');
  pendingDeleteId = null;
});

document.getElementById('confirmYes').addEventListener('click', () => {
  if (!pendingDeleteId) return;
  const cases = loadCases().filter(c => c.id !== pendingDeleteId);
  saveCases(cases);
  confirmOverlay.classList.remove('open');
  pendingDeleteId = null;
  showToast('Case deleted');
  if (currentPage === 'dashboard') renderDashboard();
  if (currentPage === 'log')       renderLog();
  if (currentPage === 'stats')     renderStats();
});

// ── Render helpers ───────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

function caseCardHtml(c) {
  const colour = specialtyColour(c.specialty);
  const supLabel = c.supervision ? `Level ${c.supervision}` : null;
  const supClass = c.supervision ? `level-${c.supervision}` : '';

  return `
  <div class="card" data-id="${c.id}" style="cursor:pointer">
    <div class="log-card-inner">
      <div class="specialty-strip" style="background:${colour}"></div>
      <div style="flex:1;min-width:0">
        <div class="card-header" style="margin-bottom:.5rem">
          <span class="card-title">${escHtml(c.procedure)}</span>
          ${supLabel ? `<span class="badge badge-navy ${supClass}" style="flex-shrink:0">${supLabel}</span>` : ''}
        </div>
        <div class="card-meta">
          <span>${formatDate(c.date)}</span>
          <span>${escHtml(c.specialty || '')}</span>
          ${c.approach ? `<span>${escHtml(c.approach)}</span>` : ''}
          ${c.role ? `<span>${escHtml(c.role)}</span>` : ''}
        </div>
        ${c.supervisor ? `<div class="text-sm text-muted mt-1">${escHtml(c.supervisor)}</div>` : ''}
      </div>
    </div>
  </div>`;
}

function attachCardListeners(container) {
  container.querySelectorAll('.card[data-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      const c = loadCases().find(x => x.id === id);
      if (c) openDetail(c);
    });
  });
}

// ── Dashboard ────────────────────────────────────────────────
function renderDashboard() {
  const cases = loadCases();

  // Stats
  const specialties = [...new Set(cases.map(c => c.specialty).filter(Boolean))];
  const asLeadSurgeon = cases.filter(c => c.role === 'Surgeon').length;

  const statsGrid = document.getElementById('statsGrid');
  statsGrid.innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${cases.length}</div>
      <div class="stat-label">Total Cases</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${asLeadSurgeon}</div>
      <div class="stat-label">As Surgeon</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${specialties.length}</div>
      <div class="stat-label">Specialties</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${cases.filter(c => c.supervision === '1').length}</div>
      <div class="stat-label">Independent</div>
    </div>`;

  // Recent cases (last 5)
  const recentList = document.getElementById('recentList');
  const recent = cases.slice(0, 5);

  if (recent.length === 0) {
    recentList.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
        <h3>No cases yet</h3>
        <p>Tap the + button to log your first operative case.</p>
      </div>`;
    return;
  }

  recentList.innerHTML = recent.map(caseCardHtml).join('');
  attachCardListeners(recentList);
}

// ── Log (all cases) ──────────────────────────────────────────
let activeFilter = 'All';
let searchQuery  = '';

function buildFilterChips(cases) {
  const specialties = ['All', ...new Set(cases.map(c => c.specialty).filter(Boolean))];
  const chips = document.getElementById('filterChips');
  chips.innerHTML = specialties.map(s => `
    <button class="chip${s === activeFilter ? ' active' : ''}" data-filter="${escHtml(s)}">${escHtml(s)}</button>
  `).join('');

  chips.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      activeFilter = chip.dataset.filter;
      renderLog();
    });
  });
}

function renderLog() {
  const allCases = loadCases();
  buildFilterChips(allCases);

  let filtered = allCases;
  if (activeFilter !== 'All') {
    filtered = filtered.filter(c => c.specialty === activeFilter);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(c =>
      (c.procedure   || '').toLowerCase().includes(q) ||
      (c.specialty   || '').toLowerCase().includes(q) ||
      (c.supervisor  || '').toLowerCase().includes(q) ||
      (c.setting     || '').toLowerCase().includes(q)
    );
  }

  const logList = document.getElementById('logList');
  if (filtered.length === 0) {
    logList.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h3>${allCases.length === 0 ? 'No cases yet' : 'No results'}</h3>
        <p>${allCases.length === 0 ? 'Tap + to log your first case.' : 'Try a different search or filter.'}</p>
      </div>`;
    return;
  }

  logList.innerHTML = filtered.map(caseCardHtml).join('');
  attachCardListeners(logList);
}

document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value.trim();
  renderLog();
});

// ── Statistics page ──────────────────────────────────────────
function renderStats() {
  const cases = loadCases();
  const container = document.getElementById('statsDetail');

  if (cases.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
      <h3>No data yet</h3><p>Log some cases to see statistics.</p>
    </div>`;
    return;
  }

  // By specialty
  const bySpecialty = {};
  cases.forEach(c => {
    if (c.specialty) bySpecialty[c.specialty] = (bySpecialty[c.specialty] || 0) + 1;
  });

  // By supervision
  const bySup = { '1': 0, '2': 0, '3': 0, '4': 0 };
  cases.forEach(c => { if (c.supervision) bySup[c.supervision] = (bySup[c.supervision] || 0) + 1; });

  // By role
  const byRole = {};
  cases.forEach(c => { if (c.role) byRole[c.role] = (byRole[c.role] || 0) + 1; });

  // By urgency
  const byUrgency = {};
  cases.forEach(c => { if (c.urgency) byUrgency[c.urgency] = (byUrgency[c.urgency] || 0) + 1; });

  const barChart = (data, colourFn) => {
    const max = Math.max(...Object.values(data), 1);
    return Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .map(([label, count]) => {
        const pct = Math.round((count / max) * 100);
        const colour = colourFn ? colourFn(label) : 'var(--teal-400)';
        return `
          <div style="margin-bottom:.875rem">
            <div style="display:flex;justify-content:space-between;margin-bottom:.3rem">
              <span class="text-sm" style="color:var(--text-secondary)">${escHtml(label)}</span>
              <span class="text-sm" style="color:var(--text-primary);font-weight:600">${count}</span>
            </div>
            <div style="height:8px;background:var(--navy-700);border-radius:4px;overflow:hidden">
              <div style="height:100%;width:${pct}%;background:${colour};border-radius:4px;transition:width .4s"></div>
            </div>
          </div>`;
      }).join('');
  };

  const supLabels = { '1': 'Independent', '2': 'Supervised scrubbed', '3': 'With assistance', '4': 'Assisted trainer' };
  const supColours = { '1': 'var(--success)', '2': 'var(--teal-400)', '3': 'var(--warning)', '4': 'var(--danger)' };
  const supData = Object.fromEntries(
    Object.entries(bySup).filter(([, v]) => v > 0).map(([k, v]) => [supLabels[k], v])
  );

  container.innerHTML = `
    <div class="card mb-2">
      <p class="form-section-title" style="margin-top:0">By Specialty</p>
      ${barChart(bySpecialty, specialtyColour)}
    </div>
    <div class="card mb-2">
      <p class="form-section-title" style="margin-top:0">Supervision Level</p>
      ${Object.keys(supData).length
        ? barChart(supData, l => supColours[Object.entries(supLabels).find(([, v]) => v === l)?.[0]] || 'var(--teal-400)')
        : '<p class="text-sm text-muted">No supervision data recorded.</p>'}
    </div>
    <div class="card mb-2">
      <p class="form-section-title" style="margin-top:0">Role</p>
      ${barChart(byRole)}
    </div>
    ${Object.keys(byUrgency).length ? `
    <div class="card mb-2">
      <p class="form-section-title" style="margin-top:0">Urgency</p>
      ${barChart(byUrgency)}
    </div>` : ''}`;
}

// ── Profile page ─────────────────────────────────────────────
function renderProfile() {
  const p = loadProfile();
  document.getElementById('profileName').value      = p.name      || '';
  document.getElementById('profileGrade').value     = p.grade     || '';
  document.getElementById('profileSpecialty').value = p.specialty || '';
  document.getElementById('profileHospital').value  = p.hospital  || '';
}

document.getElementById('saveProfileBtn').addEventListener('click', () => {
  saveProfile({
    name:      document.getElementById('profileName').value.trim(),
    grade:     document.getElementById('profileGrade').value,
    specialty: document.getElementById('profileSpecialty').value,
    hospital:  document.getElementById('profileHospital').value.trim(),
  });
  showToast('Profile saved');
});

document.getElementById('clearDataBtn').addEventListener('click', () => {
  if (confirm('This will permanently delete ALL cases. Are you sure?')) {
    localStorage.removeItem(STORAGE_KEY);
    showToast('All cases deleted');
    renderDashboard();
  }
});

// ── Export ───────────────────────────────────────────────────
document.getElementById('exportBtn').addEventListener('click', () => {
  const cases   = loadCases();
  const profile = loadProfile();
  const blob = new Blob(
    [JSON.stringify({ profile, cases, exportedAt: new Date().toISOString() }, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = `elogbook_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Exported successfully');
});

// ── Init ─────────────────────────────────────────────────────
renderDashboard();
