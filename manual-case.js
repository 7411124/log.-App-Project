// manual-case.js v3

// ─── Data from signup prefs ───────────────────────────────────────────────────
const savedConsultants = JSON.parse(sessionStorage.getItem('selectedConsultants') || '[]');
const savedOperations  = JSON.parse(sessionStorage.getItem('selectedOperations')  || '[]');
const savedHospitals   = JSON.parse(sessionStorage.getItem('selectedHospitals')   || '[]');
const savedSubspecs    = JSON.parse(sessionStorage.getItem('selectedSubspecs')    || '[]');

// ─── Operations data ──────────────────────────────────────────────────────────
const ALL_OPERATIONS = {
  'Hip & Knee Arthroplasty':    ['Total Hip Replacement','Total Knee Replacement','Unicompartmental Knee Replacement','Hip Resurfacing','Revision Hip Replacement','Revision Knee Replacement','Hemiarthroplasty (Hip)'],
  'Foot & Ankle':               ['1st MTPJ Fusion','Cheilectomy','Hallux Valgus Correction','Total Ankle Replacement','Ankle Arthroscopy','Achilles Tendon Repair','Triple Fusion','Subtalar Fusion','Calcaneal Osteotomy'],
  'Shoulder & Elbow':           ['Total Shoulder Replacement','Reverse Shoulder Replacement','Rotator Cuff Repair','Shoulder Stabilisation','Elbow Replacement','Tennis Elbow Release','Cubital Tunnel Decompression'],
  'Spine':                      ['Lumbar Discectomy','Cervical Discectomy & Fusion','Lumbar Decompression','Spinal Fusion (TLIF/PLIF)','Vertebroplasty','Kyphoplasty'],
  'Hand & Wrist':               ['Carpal Tunnel Decompression','Trigger Finger Release','Dupuytren\'s Fasciectomy','Wrist Arthroscopy','Scaphoid Fixation','Wrist Fusion','Tendon Repair'],
  'Trauma':                     ['DHS','IM Nail (Femur)','IM Nail (Tibia)','ORIF Ankle','ORIF Radius/Ulna','ORIF Clavicle','Hemiarthroplasty (Trauma)','Ex-Fix Application','Wound Debridement','Fasciotomy'],
  'Colorectal Surgery':         ['Right Hemicolectomy','Left Hemicolectomy','Anterior Resection','Abdominoperineal Resection','Hartmann\'s Procedure','Loop Ileostomy','Loop Colostomy','Reversal of Stoma','Appendicectomy','Haemorrhoidectomy'],
  'Upper GI Surgery':           ['Laparoscopic Cholecystectomy','Oesophagectomy','Gastrectomy','Hiatus Hernia Repair','Nissen Fundoplication','Whipple\'s Procedure','Inguinal Hernia Repair (TEP)','Open Inguinal Hernia Repair','Umbilical Hernia Repair'],
  'Hepatobiliary Surgery':      ['Liver Resection','Cholecystectomy','Hepaticojejunostomy','Bile Duct Exploration','Laparoscopic Liver Resection'],
  'Vascular Surgery':           ['EVAR','Open AAA Repair','Carotid Endarterectomy','Femoral-Popliteal Bypass','AV Fistula Formation','Amputation (BKA)','Amputation (AKA)','Varicose Vein Surgery'],
  'Urology':                    ['TURP','TURBT','Radical Prostatectomy','Nephrectomy','Pyeloplasty','Ureterorenoscopy (URS)','PCNL','Cystoscopy','Orchidectomy'],
  'Cardiothoracic Surgery':     ['CABG','AVR','MVR','VATS Lobectomy','Open Lobectomy','Pleurectomy','Pericardial Window'],
  'Neurosurgery':               ['Craniotomy','Burr Hole Evacuation','VP Shunt','Lumbar Discectomy','Laminectomy'],
  'ENT':                        ['Tonsillectomy','Myringotomy & Grommets','Septoplasty','FESS','Parotidectomy','Thyroidectomy','Tracheostomy','Mastoidectomy'],
  'Maxillofacial Surgery':      ['Orthognathic Surgery','Mandible Fracture ORIF','Zygoma Fracture ORIF','Dental Extractions (GA)'],
  'Plastics & Reconstructive':  ['Split Skin Graft','Full Thickness Skin Graft','Free Flap','Pedicled Flap','Scar Revision','Burn Debridement','Breast Reconstruction'],
  'Paediatric Surgery':         ['Orchidopexy','Circumcision','Pyloromyotomy','Intussusception Reduction','Inguinal Hernia Repair (Paeds)'],
  'General Surgery':            ['Laparoscopic Appendicectomy','Open Appendicectomy','Laparoscopic Cholecystectomy','Laparotomy','Bowel Resection','Stoma Formation','Hernia Repair','Abscess I&D','Skin Lesion Excision'],
};

const ALL_OPS_FLAT = [...new Set(Object.values(ALL_OPERATIONS).flat())].sort();

// ─── State ────────────────────────────────────────────────────────────────────
let selectedOperation  = '';
let selectedHospital   = '';
let selectedConsultant = '';

// ─── Date: pre-fill today ─────────────────────────────────────────────────────
const dateInput = document.getElementById('dateInput');
dateInput.value = new Date().toISOString().split('T')[0];

document.getElementById('todayBtn').addEventListener('click', () => {
  dateInput.value = new Date().toISOString().split('T')[0];
});

// ─── Pill rows (CEPOD, ASA, Supervision) ─────────────────────────────────────
function initPillRow(rowId) {
  const row = document.getElementById(rowId);
  row.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
      row.querySelectorAll('.pill').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
}

initPillRow('cepodRow');
initPillRow('asaRow');
initPillRow('supervisionRow');

// ─── Consultant ───────────────────────────────────────────────────────────────
const consultantChips = document.getElementById('consultantChips');
const consultantInput = document.getElementById('consultantInput');
const consultantList  = document.getElementById('consultantList');

savedConsultants.forEach(name => {
  const chip = document.createElement('button');
  chip.className = 'fav-chip';
  chip.type = 'button';
  chip.textContent = name;
  chip.addEventListener('click', () => {
    consultantChips.querySelectorAll('.fav-chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    selectedConsultant = name;
    consultantInput.value = '';
    consultantList.classList.add('hidden');
  });
  consultantChips.appendChild(chip);
});

consultantInput.addEventListener('input', () => {
  const q = consultantInput.value.trim().toLowerCase();
  if (!q) { consultantList.classList.add('hidden'); return; }
  const matches = ALL_OPS_FLAT // reuse for demo — in prod: consultant DB
    .filter(() => false); // show nothing unless we have real data
  // Just allow free text for now
  consultantList.classList.add('hidden');
});

consultantInput.addEventListener('change', () => {
  if (consultantInput.value.trim()) {
    consultantChips.querySelectorAll('.fav-chip').forEach(c => c.classList.remove('selected'));
    selectedConsultant = consultantInput.value.trim();
  }
});

consultantInput.addEventListener('blur', () => {
  setTimeout(() => consultantList.classList.add('hidden'), 150);
});

// ─── Operations tabs ──────────────────────────────────────────────────────────
const opTabBar     = document.getElementById('opTabBar');
const opTabContent = document.getElementById('opTabContent');

// Build tabs: one per saved subspecialty + "Other"
const opTabs = savedSubspecs.length > 0 ? [...savedSubspecs, 'Other'] : ['Other'];

opTabs.forEach((sub, i) => {
  // Tab button
  const btn = document.createElement('button');
  btn.className = 'tab-btn' + (i === 0 ? ' active' : '');
  btn.type = 'button';
  btn.textContent = sub === 'Other' ? 'Other' : shortLabel(sub);
  btn.dataset.tab = 'op-' + i;
  btn.addEventListener('click', () => switchTab(opTabBar, opTabContent, 'op-' + i));
  opTabBar.appendChild(btn);

  // Panel
  const panel = document.createElement('div');
  panel.className = 'tab-panel' + (i === 0 ? ' active' : '');
  panel.id = 'op-' + i;

  if (sub === 'Other') {
    // Search panel
    panel.innerHTML = `
      <div class="tab-search-wrap search-field-wrap">
        <input type="text" class="field" placeholder="Search all procedures…" autocomplete="off" spellcheck="false" id="opSearchInput">
        <ul class="dropdown hidden" id="opSearchList"></ul>
      </div>`;
  } else {
    // Chips for this subspecialty
    const ops = ALL_OPERATIONS[sub] || savedOperations;
    const grid = document.createElement('div');
    grid.className = 'chip-grid';
    ops.forEach(op => {
      const chip = document.createElement('button');
      chip.className = 'sel-chip';
      chip.type = 'button';
      chip.textContent = op;
      chip.addEventListener('click', () => {
        opTabContent.querySelectorAll('.sel-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedOperation = op;
      });
      grid.appendChild(chip);
    });
    panel.appendChild(grid);
  }

  opTabContent.appendChild(panel);
});

// Wire up op search
const opSearchInput = document.getElementById('opSearchInput');
const opSearchList  = document.getElementById('opSearchList');
if (opSearchInput) {
  opSearchInput.addEventListener('input', () => {
    const q = opSearchInput.value.trim().toLowerCase();
    if (!q) { opSearchList.classList.add('hidden'); return; }
    const matches = ALL_OPS_FLAT.filter(op => op.toLowerCase().includes(q)).slice(0, 12);
    renderDropdown(opSearchList, matches, val => {
      selectedOperation = val;
      opSearchInput.value = val;
      opSearchList.classList.add('hidden');
    });
  });
  opSearchInput.addEventListener('blur', () => setTimeout(() => opSearchList.classList.add('hidden'), 150));
}

// ─── Hospital tabs ────────────────────────────────────────────────────────────
const hospTabBar     = document.getElementById('hospTabBar');
const hospTabContent = document.getElementById('hospTabContent');

const hospTabs = savedHospitals.length > 0 ? [...savedHospitals] : [];
hospTabs.push('Other');

hospTabs.forEach((hosp, i) => {
  const btn = document.createElement('button');
  btn.className = 'tab-btn' + (i === 0 ? ' active' : '');
  btn.type = 'button';
  btn.textContent = hosp === 'Other' ? 'Other' : hosp;
  btn.dataset.tab = 'hosp-' + i;
  btn.addEventListener('click', () => {
    switchTab(hospTabBar, hospTabContent, 'hosp-' + i);
    if (hosp !== 'Other') selectedHospital = hosp;
  });
  hospTabBar.appendChild(btn);

  const panel = document.createElement('div');
  panel.className = 'tab-panel' + (i === 0 ? ' active' : '');
  panel.id = 'hosp-' + i;

  if (hosp === 'Other') {
    panel.innerHTML = `
      <div class="tab-search-wrap">
        <input type="text" class="field" placeholder="Type hospital name…" autocomplete="off" id="hospOtherInput" style="margin-top:0.5rem">
      </div>`;
  } else {
    // Auto-select if it's the first tab (favourite)
    if (i === 0) selectedHospital = hosp;
    panel.innerHTML = `<p style="padding:0.5rem 0;font-size:0.88rem;color:var(--text-secondary)">${hosp}</p>`;
  }

  hospTabContent.appendChild(panel);
});

const hospOtherInput = document.getElementById('hospOtherInput');
if (hospOtherInput) {
  hospOtherInput.addEventListener('input', () => {
    selectedHospital = hospOtherInput.value.trim();
  });
}

// ─── Tab switcher ─────────────────────────────────────────────────────────────
function switchTab(barEl, contentEl, id) {
  barEl.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
  contentEl.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === id));
}

// ─── Short label helper ───────────────────────────────────────────────────────
function shortLabel(str) {
  // Shorten long subspecialty names for tab display
  const map = {
    'Hip & Knee Arthroplasty': 'Hip & Knee',
    'Shoulder & Elbow': 'Shoulder',
    'Hand & Wrist': 'Hand',
    'Colorectal Surgery': 'Colorectal',
    'Upper GI Surgery': 'Upper GI',
    'Hepatobiliary Surgery': 'HPB',
    'Vascular Surgery': 'Vascular',
    'Cardiothoracic Surgery': 'Cardiothoracic',
    'Plastics & Reconstructive': 'Plastics',
    'Paediatric Surgery': 'Paediatrics',
    'General Surgery': 'General',
  };
  return map[str] || str;
}

// ─── Dropdown helper ──────────────────────────────────────────────────────────
function renderDropdown(ul, items, onPick) {
  ul.innerHTML = '';
  if (!items.length) { ul.classList.add('hidden'); return; }
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    li.addEventListener('mousedown', e => { e.preventDefault(); onPick(item); });
    ul.appendChild(li);
  });
  ul.classList.remove('hidden');
}

// ─── Voice notes ──────────────────────────────────────────────────────────────
const voiceNoteBtn = document.getElementById('voiceNoteBtn');
const notesInput   = document.getElementById('notesInput');
let noteRecognition = null;
let noteRecording = false;

voiceNoteBtn.addEventListener('click', () => {
  if (noteRecording) {
    stopNoteRecording();
  } else {
    startNoteRecording();
  }
});

function startNoteRecording() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { alert('Voice not supported on this browser.'); return; }

  noteRecognition = new SR();
  noteRecognition.lang = 'en-GB';
  noteRecognition.continuous = true;
  noteRecognition.interimResults = true;

  const existing = notesInput.value;
  let interim = '';

  noteRecognition.onresult = e => {
    interim = '';
    let final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
      else interim += e.results[i][0].transcript;
    }
    notesInput.value = existing + final + interim;
  };

  noteRecognition.onend = () => {
    if (noteRecording) try { noteRecognition.start(); } catch(_) {}
  };

  noteRecognition.start();
  noteRecording = true;
  voiceNoteBtn.classList.add('recording');
}

function stopNoteRecording() {
  noteRecording = false;
  voiceNoteBtn.classList.remove('recording');
  if (noteRecognition) { try { noteRecognition.stop(); } catch(_) {} }
  noteRecognition = null;
}

// ─── Info popup ───────────────────────────────────────────────────────────────
const INFO = {
  cepod: {
    title: 'CEPOD classification',
    items: [
      { label: 'Emergency', desc: 'Life-, limb- or organ-saving intervention. Resuscitation simultaneous with surgery.' },
      { label: 'Urgency', desc: 'Acute onset or deterioration. Resuscitation possible before surgery. Within hours.' },
      { label: 'Scheduled', desc: 'Condition stable but early surgery required. Within days.' },
      { label: 'Elective', desc: 'Planned procedure. Scheduled at a mutually convenient time.' },
    ]
  },
  asa: {
    title: 'ASA Physical Status',
    items: [
      { label: 'ASA I', desc: 'Normal healthy patient.' },
      { label: 'ASA II', desc: 'Mild systemic disease, no functional limitation.' },
      { label: 'ASA III', desc: 'Severe systemic disease with functional limitation.' },
      { label: 'ASA IV', desc: 'Severe systemic disease that is a constant threat to life.' },
      { label: 'ASA V', desc: 'Moribund patient not expected to survive without the operation.' },
    ]
  },
  supervision: {
    title: 'Supervision / role',
    items: [
      { label: 'Observed', desc: 'You watched the procedure without active participation.' },
      { label: 'Assisting', desc: 'You assisted the operating surgeon (retraction, suturing, etc.).' },
      { label: 'S-TS', desc: 'Supervised — Trainer Scrubbed. You operated with your trainer scrubbed in.' },
      { label: 'S-TU', desc: 'Supervised — Trainer Unscrubbed. Trainer present in theatre but not scrubbed.' },
      { label: 'Performed', desc: 'You performed the operation as the primary surgeon (with or without distant supervision).' },
      { label: 'Training', desc: 'You were the supervising surgeon, training a more junior colleague.' },
    ]
  }
};

const infoPopup      = document.getElementById('infoPopup');
const infoPopupTitle = document.getElementById('infoPopupTitle');
const infoPopupList  = document.getElementById('infoPopupList');

document.querySelectorAll('.info-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.group;
    const content = INFO[group];
    if (!content) return;
    infoPopupTitle.textContent = content.title;
    infoPopupList.innerHTML = content.items.map(item =>
      `<li><strong>${item.label}</strong>${item.desc}</li>`
    ).join('');
    infoPopup.classList.remove('hidden');
  });
});

document.getElementById('infoPopupClose').addEventListener('click', () => infoPopup.classList.add('hidden'));
infoPopup.addEventListener('click', e => { if (e.target === infoPopup) infoPopup.classList.add('hidden'); });

// ─── Save ─────────────────────────────────────────────────────────────────────
function saveCase() {
  const op = selectedOperation || document.getElementById('opSearchInput')?.value.trim();
  if (!op) {
    alert('Please select or enter an operation.');
    return;
  }

  const caseData = {
    id:           Date.now(),
    patientId:    document.getElementById('patientId').value.trim(),
    age:          document.getElementById('patientAge').value,
    date:         dateInput.value,
    cepod:        document.querySelector('#cepodRow .pill.selected')?.dataset.val || '',
    asa:          document.querySelector('#asaRow .pill.selected')?.dataset.val || '',
    consultant:   selectedConsultant || document.getElementById('consultantInput').value.trim(),
    supervision:  document.querySelector('#supervisionRow .pill.selected')?.dataset.val || '',
    robotic:      document.getElementById('roboticToggle').checked,
    operation:    op,
    hospital:     selectedHospital || document.getElementById('hospOtherInput')?.value.trim() || '',
    notes:        document.getElementById('notesInput').value.trim(),
  };

  const existing = JSON.parse(localStorage.getItem('cases') || '[]');
  existing.unshift(caseData);
  localStorage.setItem('cases', JSON.stringify(existing));

  window.location.href = 'add-case.html';
}

document.getElementById('saveBtn').addEventListener('click', saveCase);
document.getElementById('saveBtnBottom').addEventListener('click', saveCase);
