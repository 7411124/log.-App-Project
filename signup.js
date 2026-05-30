if (window.__LOG_INIT__) { throw new Error('already loaded'); }
window.__LOG_INIT__ = true;

// ── Trust & Hospital Data ─────────────────────────────────────
const TRUSTS = [
  { name: 'Greater Glasgow and Clyde', hospitals: ['Glasgow Royal Infirmary','Queen Elizabeth University Hospital','Western General Hospital (Glasgow)','Royal Hospital for Children (Glasgow)','Stobhill Hospital','Victoria Infirmary','Vale of Leven Hospital','Inverclyde Royal Hospital','Royal Alexandra Hospital'] },
  { name: 'NHS Lothian', hospitals: ['Royal Infirmary of Edinburgh','Western General Hospital (Edinburgh)','St John\'s Hospital Livingston','Royal Hospital for Children & Young People'] },
  { name: 'NHS Tayside', hospitals: ['Ninewells Hospital','Perth Royal Infirmary','Stracathro Hospital'] },
  { name: 'NHS Grampian', hospitals: ['Aberdeen Royal Infirmary','Dr Gray\'s Hospital Elgin','Royal Aberdeen Children\'s Hospital'] },
  { name: 'NHS Ayrshire and Arran', hospitals: ['University Hospital Ayr','University Hospital Crosshouse'] },
  { name: 'NHS Lanarkshire', hospitals: ['University Hospital Hairmyres','University Hospital Monklands','University Hospital Wishaw'] },
  { name: 'NHS Forth Valley', hospitals: ['Forth Valley Royal Hospital'] },
  { name: 'NHS Highland', hospitals: ['Raigmore Hospital','Belford Hospital','Caithness General Hospital'] },
  { name: 'NHS Borders', hospitals: ['Borders General Hospital'] },
  { name: 'NHS Dumfries and Galloway', hospitals: ['Dumfries and Galloway Royal Infirmary'] },
  { name: 'NHS Fife', hospitals: ['Victoria Hospital Kirkcaldy','Queen Margaret Hospital Dunfermline'] },
  { name: 'Cardiff and Vale University Health Board', hospitals: ['University Hospital of Wales','University Hospital Llandough','Barry Hospital'] },
  { name: 'Aneurin Bevan University Health Board', hospitals: ['Royal Gwent Hospital','Nevill Hall Hospital','Ysbyty Ystrad Fawr'] },
  { name: 'Swansea Bay University Health Board', hospitals: ['Morriston Hospital','Singleton Hospital','Neath Port Talbot Hospital'] },
  { name: 'Betsi Cadwaladr University Health Board', hospitals: ['Ysbyty Gwynedd','Glan Clwyd Hospital','Wrexham Maelor Hospital'] },
  { name: 'Belfast Health and Social Care Trust', hospitals: ['Royal Victoria Hospital Belfast','Belfast City Hospital','Mater Hospital Belfast','Musgrave Park Hospital'] },
  { name: 'Southern Health and Social Care Trust', hospitals: ['Craigavon Area Hospital','Daisy Hill Hospital','South Tyrone Hospital'] },
  { name: 'Western Health and Social Care Trust', hospitals: ['Altnagelvin Area Hospital','South West Acute Hospital'] },
  { name: 'Northern Health and Social Care Trust', hospitals: ['Antrim Area Hospital','Causeway Hospital','Mid Ulster Hospital'] },
  { name: 'South Eastern Health and Social Care Trust', hospitals: ['Ulster Hospital','Lagan Valley Hospital','Downe Hospital'] },
  { name: 'Barts Health NHS Trust', hospitals: ['Royal London Hospital','St Bartholomew\'s Hospital','Whipps Cross University Hospital','Newham University Hospital'] },
  { name: 'Guy\'s and St Thomas\' NHS Foundation Trust', hospitals: ['Guy\'s Hospital','St Thomas\' Hospital','Evelina London Children\'s Hospital'] },
  { name: 'King\'s College Hospital NHS Foundation Trust', hospitals: ['King\'s College Hospital','Princess Royal University Hospital','Orpington Hospital'] },
  { name: 'Imperial College Healthcare NHS Trust', hospitals: ['Charing Cross Hospital','Hammersmith Hospital','St Mary\'s Hospital','Western Eye Hospital'] },
  { name: 'University College London Hospitals NHS Foundation Trust', hospitals: ['University College Hospital','National Hospital for Neurology and Neurosurgery','Royal National Throat Nose and Ear Hospital'] },
  { name: 'Leeds Teaching Hospitals NHS Trust', hospitals: ['Leeds General Infirmary','St James\'s University Hospital','Wharfedale Hospital','Seacroft Hospital'] },
  { name: 'Manchester University NHS Foundation Trust', hospitals: ['Manchester Royal Infirmary','Royal Manchester Children\'s Hospital','Wythenshawe Hospital','North Manchester General Hospital'] },
  { name: 'Newcastle Upon Tyne Hospitals NHS Foundation Trust', hospitals: ['Royal Victoria Infirmary','Freeman Hospital','Great North Children\'s Hospital'] },
  { name: 'Sheffield Teaching Hospitals NHS Foundation Trust', hospitals: ['Royal Hallamshire Hospital','Northern General Hospital','Weston Park Cancer Centre'] },
  { name: 'Oxford University Hospitals NHS Foundation Trust', hospitals: ['John Radcliffe Hospital','Churchill Hospital','Nuffield Orthopaedic Centre','Horton General Hospital'] },
  { name: 'Cambridge University Hospitals NHS Foundation Trust', hospitals: ['Addenbrooke\'s Hospital','Rosie Hospital'] },
  { name: 'University Hospitals Birmingham NHS Foundation Trust', hospitals: ['Queen Elizabeth Hospital Birmingham','Heartlands Hospital','Good Hope Hospital','Solihull Hospital'] },
  { name: 'University Hospitals of Leicester NHS Trust', hospitals: ['Leicester Royal Infirmary','Glenfield Hospital','Leicester General Hospital'] },
  { name: 'Nottingham University Hospitals NHS Trust', hospitals: ['Queen\'s Medical Centre','Nottingham City Hospital'] },
  { name: 'Liverpool University Hospitals NHS Foundation Trust', hospitals: ['Royal Liverpool University Hospital','Aintree University Hospital','Broadgreen Hospital'] },
];

// ── Sub-specialty Data ────────────────────────────────────────
const SUBSPECIALTIES = {
  'General Surgery':           ['Colorectal','Upper GI','Hepatobiliary','Breast','Endocrine','Hernia','Emergency General Surgery'],
  'Colorectal Surgery':        ['Colorectal Cancer','Inflammatory Bowel Disease','Pelvic Floor & Proctology','Laparoscopic Colorectal','Robotic Colorectal','Stoma Surgery'],
  'Upper GI Surgery':          ['Oesophagogastric','Bariatric & Metabolic','Hernia','Laparoscopic Upper GI','Robotic Upper GI'],
  'Hepatobiliary Surgery':     ['Liver Surgery','Pancreatic Surgery','Biliary Surgery','Transplant Surgery','Laparoscopic HPB'],
  'Vascular Surgery':          ['Aortic Surgery','Peripheral Arterial Disease','Venous Surgery','Endovascular Surgery','Carotid Surgery','Diabetic Foot'],
  'Trauma & Orthopaedics':     ['Hip & Knee Arthroplasty','Foot & Ankle','Hand & Wrist','Shoulder & Elbow','Spine Surgery','Trauma','Paediatric Orthopaedics','Sports Medicine & Arthroscopy','Tumour Surgery'],
  'Urology':                   ['Urological Oncology','Andrology','Female & Reconstructive Urology','Endourology & Stone Disease','Robotic Urology','Transplant Urology','Paediatric Urology'],
  'Cardiothoracic Surgery':    ['Adult Cardiac Surgery','Thoracic Surgery','Congenital Cardiac Surgery','Transplant & Mechanical Assist','Minimally Invasive Cardiac'],
  'Neurosurgery':              ['Cranial Tumour Surgery','Spinal Surgery','Vascular Neurosurgery','Peripheral Nerve Surgery','Functional Neurosurgery','Paediatric Neurosurgery','Trauma Neurosurgery'],
  'ENT':                       ['Head & Neck Oncology','Rhinology & Skull Base','Otology & Neurotology','Laryngology & Voice','Paediatric ENT','Facial Plastics'],
  'Maxillofacial Surgery':     ['Head & Neck Oncology','Oral & Maxillofacial Surgery','Craniofacial Surgery','Orthognathic Surgery','Facial Trauma','Cleft Surgery'],
  'Plastics & Reconstructive': ['Hand Surgery','Microsurgery & Free Flaps','Head & Neck Reconstruction','Burns Surgery','Breast Reconstruction','Aesthetic Surgery','Lower Limb Reconstruction'],
  'Paediatric Surgery':        ['Neonatal Surgery','General Paediatric Surgery','Paediatric Urology','Paediatric Oncology','Paediatric Thoracic','Paediatric GI'],
};

// ── Common operations by sub-specialty ───────────────────────
const OPERATIONS = {
  'Hip & Knee Arthroplasty':      ['Total Hip Replacement','Total Knee Replacement','Revision Hip Replacement','Revision Knee Replacement','Unicompartmental Knee Replacement','Hip Hemiarthroplasty','Dynamic Hip Screw','Cemented THR','Cementless THR'],
  'Foot & Ankle':                 ['1st MTPJ Fusion','Cheilectomy','Hallux Valgus Correction (Scarf/Chevron)','Total Ankle Replacement','Ankle Arthrodesis','Subtalar Fusion','Triple Arthrodesis','Calcaneal Osteotomy','Achilles Tendon Repair','Peroneal Tendon Surgery','Morton\'s Neuroma Excision','Plantar Fascia Release','Lesser Toe Correction','Midfoot Fusion','Tibiotalar Fusion'],
  'Hand & Wrist':                 ['Carpal Tunnel Decompression','Dupuytren\'s Fasciectomy','Trigger Finger Release','Tendon Repair','Distal Radius ORIF','Ganglion Excision','Scaphoid Fixation','Wrist Arthroscopy'],
  'Shoulder & Elbow':             ['Total Shoulder Replacement','Rotator Cuff Repair','Shoulder Stabilisation','Shoulder Arthroscopy','Elbow Replacement','Tennis Elbow Release','Biceps Tenodesis'],
  'Spine Surgery':                ['Lumbar Discectomy','Lumbar Decompression','Spinal Fusion','Cervical Discectomy & Fusion','Vertebroplasty','Kyphoplasty','Microdiscectomy'],
  'Trauma':                       ['Femoral Nail','Tibial Nail','Dynamic Hip Screw','ORIF Distal Radius','ORIF Ankle','ORIF Femur','Hemiarthroplasty','Calcaneal ORIF','Pelvis & Acetabulum ORIF'],
  'Paediatric Orthopaedics':      ['DDH Open Reduction','Femoral Osteotomy','Pelvic Osteotomy','SUFE Fixation','Clubfoot Release','Scoliosis Correction','EDF Casting'],
  'Sports Medicine & Arthroscopy':['ACL Reconstruction','Knee Arthroscopy & Meniscectomy','Meniscal Repair','MPFL Reconstruction','Hip Arthroscopy','Shoulder Stabilisation Arthroscopy'],
  'Tumour Surgery':               ['Wide Local Excision','Limb Salvage Procedure','Endoprosthetic Replacement','Curettage & Grafting','Biopsy'],
  'Colorectal':                   ['Right Hemicolectomy','Left Hemicolectomy','Anterior Resection','Hartmann\'s Procedure','Abdominoperineal Resection','Loop Ileostomy','Loop Colostomy','Laparoscopic Appendicectomy','Sigmoid Colectomy'],
  'Colorectal Cancer':            ['Right Hemicolectomy','Left Hemicolectomy','Anterior Resection','Hartmann\'s Procedure','Abdominoperineal Resection','Total Mesorectal Excision','TEMS','Transanal TME'],
  'Inflammatory Bowel Disease':   ['Subtotal Colectomy','Ileostomy Formation','Ileal Pouch-Anal Anastomosis','Proctectomy','Strictureplasty'],
  'Pelvic Floor & Proctology':    ['Haemorrhoidectomy','TEMS','EUA & Fistula Surgery','Lateral Internal Sphincterotomy','Sacral Nerve Stimulation'],
  'Upper GI':                     ['Laparoscopic Cholecystectomy','Open Cholecystectomy','Appendicectomy','Inguinal Hernia Repair','Incisional Hernia Repair','Nissen Fundoplication','Oesophagectomy','Gastrectomy'],
  'Oesophagogastric':             ['Ivor Lewis Oesophagectomy','McKeown Oesophagectomy','Total Gastrectomy','Subtotal Gastrectomy','Laparoscopic Nissen Fundoplication','Heller Myotomy'],
  'Bariatric & Metabolic':        ['Laparoscopic Sleeve Gastrectomy','Roux-en-Y Gastric Bypass','Adjustable Gastric Band','One Anastomosis Gastric Bypass','Revisional Bariatric Surgery'],
  'Hernia':                       ['Laparoscopic TEP Inguinal Hernia Repair','Laparoscopic TAPP Inguinal Hernia Repair','Open Inguinal Hernia Repair','Laparoscopic Ventral Hernia Repair','Open Incisional Hernia Repair','Umbilical Hernia Repair','Femoral Hernia Repair'],
  'Liver Surgery':                ['Right Hepatectomy','Left Hepatectomy','Segmental Hepatectomy','Liver Biopsy','RFA Liver Lesion','ERCP','PTBD'],
  'Pancreatic Surgery':           ['Whipple\'s Procedure (PPPD)','Distal Pancreatectomy','Total Pancreatectomy','Pancreatic Cyst Drainage','Necrosectomy'],
  'Biliary Surgery':              ['Laparoscopic Cholecystectomy','Open Cholecystectomy','Choledochotomy','Biliary Bypass','Bile Duct Repair','ERCP & Stenting'],
  'Aortic Surgery':               ['EVAR','Open AAA Repair','TEVAR','Aorto-bifemoral Bypass','Aorto-iliac Endarterectomy'],
  'Peripheral Arterial Disease':  ['Femoro-popliteal Bypass','Femoro-distal Bypass','Angioplasty & Stenting','Endarterectomy','Embolectomy','Amputation'],
  'Venous Surgery':               ['Long Saphenous Vein Stripping','EVLA','Phlebectomy','Foam Sclerotherapy','Varicose Vein Surgery','Perforator Surgery'],
  'Hand Surgery':                 ['Carpal Tunnel Decompression','Dupuytren\'s Fasciectomy','Trigger Finger Release','Tendon Repair','Replantation','Syndactyly Release','MCPJ Arthroplasty'],
  'Microsurgery & Free Flaps':    ['Free TRAM Flap','DIEP Flap','ALT Flap','Radial Forearm Flap','Fibula Free Flap','Latissimus Dorsi Free Flap','Replantation'],
  'Head & Neck Reconstruction':   ['Neck Dissection','Mandibular Reconstruction','Fibula Free Flap','Pectoralis Major Flap','Deltopectoral Flap','Skin Graft'],
  'Burns Surgery':                ['Split Skin Graft','Full Thickness Skin Graft','Escharotomy','Debridement','Tissue Expansion','Scar Revision'],
  'Breast Reconstruction':        ['Implant-based Reconstruction','LD Flap Reconstruction','DIEP Flap','TRAM Flap','Nipple Reconstruction','Contralateral Symmetrisation'],
  'Head & Neck Oncology':         ['Total Laryngectomy','Partial Laryngectomy','Parotidectomy','Neck Dissection','Thyroidectomy','Mandibulectomy','Maxillectomy'],
  'Rhinology & Skull Base':       ['FESS','Septoplasty','Turbinate Reduction','Endoscopic Skull Base Surgery','CSF Leak Repair','Dacryocystorhinostomy'],
  'Otology & Neurotology':        ['Myringoplasty','Tympanoplasty','Mastoidectomy','Stapedectomy','Cochlear Implant','Acoustic Neuroma Surgery','Grommet Insertion'],
  'Urological Oncology':          ['Radical Prostatectomy','Radical Nephrectomy','Partial Nephrectomy','Radical Cystectomy','TURBT','TURP','Retroperitoneal Lymph Node Dissection'],
  'Endourology & Stone Disease':  ['Ureteroscopy & Laser Lithotripsy','PCNL','ESWL','JJ Stent Insertion','Flexible Cystoscopy','Rigid Cystoscopy'],
  'Adult Cardiac Surgery':        ['CABG','Aortic Valve Replacement','Mitral Valve Repair','Mitral Valve Replacement','TAVI','Aortic Root Replacement'],
  'Thoracic Surgery':             ['VATS Lobectomy','Open Lobectomy','Pneumonectomy','VATS Pleurodesis','Mediastinoscopy','Empyema Drainage','Pleural Biopsy'],
  'Cranial Tumour Surgery':       ['Craniotomy & Tumour Resection','Stereotactic Biopsy','Awake Craniotomy','VP Shunt Insertion','Endoscopic Third Ventriculostomy'],
  'Spinal Surgery':               ['Lumbar Microdiscectomy','Posterior Lumbar Decompression','PLIF','TLIF','ACDF','Cervical Corpectomy','Spinal Cord Tumour Resection'],
  'Neonatal Surgery':             ['Oesophageal Atresia Repair','Duodenal Atresia Repair','Intestinal Atresia Repair','Hirschsprung\'s Pull-through','Gastroschisis Repair','Exomphalos Repair'],
  'General Paediatric Surgery':   ['Laparoscopic Appendicectomy','Inguinal Hernia Repair','Orchidopexy','Pyloromyotomy','Fundoplication','Bowel Resection'],
};

// ── Consultant fillers by specialty ──────────────────────────
const CONSULTANTS = {
  'Trauma & Orthopaedics':     ['Mr A. Ahmed','Mr B. Browne','Mr C. Campbell','Mr D. Davidson','Mr E. Edwards','Ms F. Fraser','Mr G. Gibson','Mr H. Hamilton','Mr I. Ingram','Ms J. Johnston'],
  'General Surgery':           ['Mr A. Anderson','Mr B. Bell','Ms C. Clark','Mr D. Douglas','Mr E. Evans','Ms F. Ferguson','Mr G. Gray','Mr H. Hughes','Ms I. Irving','Mr J. Jackson'],
  'Colorectal Surgery':        ['Mr A. Adams','Ms B. Baker','Mr C. Collins','Mr D. Davies','Ms E. Ellis','Mr F. Fisher','Mr G. Grant','Ms H. Harris','Mr I. Hill','Mr J. Jones'],
  'Upper GI Surgery':          ['Mr A. Allen','Ms B. Barnes','Mr C. Brown','Mr D. Butler','Ms E. Carter','Mr F. Clarke','Mr G. Cooper','Ms H. Cox','Mr I. Dean','Mr J. Dixon'],
  'Hepatobiliary Surgery':     ['Mr A. Atkinson','Ms B. Bailey','Mr C. Barker','Mr D. Barlow','Ms E. Bernard','Mr F. Berry','Mr G. Bishop','Ms H. Black','Mr I. Blake','Mr J. Bond'],
  'Vascular Surgery':          ['Mr A. Booth','Ms B. Boyd','Mr C. Bradley','Mr D. Brennan','Ms E. Brooks','Mr F. Bryant','Mr G. Burke','Ms H. Burns','Mr I. Burton','Mr J. Butler'],
  'Plastics & Reconstructive': ['Mr A. Cameron','Ms B. Carr','Mr C. Carroll','Mr D. Carter','Ms E. Chapman','Mr F. Christie','Mr G. Clarke','Ms H. Coleman','Mr I. Collins','Mr J. Cook'],
  'Cardiothoracic Surgery':    ['Mr A. Cooper','Ms B. Cox','Mr C. Craig','Mr D. Crawford','Ms E. Cross','Mr F. Curtis','Mr G. Dale','Ms H. Daly','Mr I. Davis','Mr J. Dean'],
  'Neurosurgery':              ['Mr A. Dixon','Ms B. Doyle','Mr C. Duncan','Mr D. Dunn','Ms E. Dyer','Mr F. Elliot','Mr G. Ellis','Ms H. Evans','Mr I. Farmer','Mr J. Field'],
  'ENT':                       ['Mr A. Fisher','Ms B. Fleming','Mr C. Fletcher','Mr D. Forbes','Ms E. Ford','Mr F. Foster','Mr G. Fox','Ms H. Freeman','Mr I. Gallagher','Mr J. Gardner'],
  'Urology':                   ['Mr A. Gibson','Ms B. Gilbert','Mr C. Gordon','Mr D. Graham','Ms E. Grant','Mr F. Gray','Mr G. Green','Ms H. Griffin','Mr I. Hall','Mr J. Hamilton'],
  'Maxillofacial Surgery':     ['Mr A. Hardy','Ms B. Harper','Mr C. Harris','Mr D. Harrison','Ms E. Hart','Mr F. Harvey','Mr G. Hawkins','Ms H. Hayes','Mr I. Hill','Mr J. Hobbs'],
  'Paediatric Surgery':        ['Mr A. Holden','Ms B. Holland','Mr C. Holmes','Mr D. Hopkins','Ms E. Howell','Mr F. Hudson','Mr G. Hughes','Ms H. Hunt','Mr I. Hunter','Mr J. Ingram'],
};

// ── State ─────────────────────────────────────────────────────
let selectedTrust = null;
let selectedHospitals = [];
let selectedSubspecs = [];
let selectedConsultants = [];
let selectedOperations = [];

// ── Screens ───────────────────────────────────────────────────
const screens = {
  method:   document.getElementById('screen-method'),
  details:  document.getElementById('screen-details'),
  prefs:    document.getElementById('screen-prefs'),
  prefs2:   document.getElementById('screen-prefs2'),
  verify:   document.getElementById('screen-verify'),
};

function showScreen(key) {
  Object.values(screens).forEach(s => s && s.classList.add('hidden'));
  if (screens[key]) screens[key].classList.remove('hidden');
  window.scrollTo(0, 0);
}

// ── Step 1: Email ─────────────────────────────────────────────
const emailInput  = document.getElementById('emailInput');
const continueBtn = document.getElementById('continueBtn');
const confirmedEmail = document.getElementById('confirmedEmail');

emailInput.addEventListener('input', () => {
  continueBtn.disabled = !emailInput.value.trim();
});
continueBtn.disabled = true;

document.getElementById('emailForm').addEventListener('submit', e => {
  e.preventDefault();
  if (!emailInput.value.trim()) return;
  confirmedEmail.value = emailInput.value.trim();
  showScreen('details');
});

// ── Step 2: Account details ───────────────────────────────────
document.getElementById('backToEmail').addEventListener('click', e => {
  e.preventDefault();
  showScreen('method');
});

document.getElementById('detailsForm').addEventListener('submit', e => {
  e.preventDefault();
  const specialtyEl = document.querySelector('#detailsForm select');
  const specialty = specialtyEl ? specialtyEl.value : '';
  sessionStorage.setItem('log_specialty', specialty);
  buildSubspecGrid(specialty);
  showScreen('prefs');
});

document.getElementById('togglePw').addEventListener('click', () => {
  const pw = document.getElementById('passwordInput');
  pw.type = pw.type === 'text' ? 'password' : 'text';
});

// ── Step 3: Preferences 1 ─────────────────────────────────────
document.getElementById('backToDetails').addEventListener('click', e => {
  e.preventDefault();
  showScreen('details');
});

// Trust autocomplete
const trustInput = document.getElementById('trustInput');
const trustList  = document.getElementById('trustList');

trustInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const first = trustList.querySelector('li');
    if (first) first.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  }
});

trustInput.addEventListener('input', () => {
  const q = trustInput.value.trim().toLowerCase();
  trustList.innerHTML = '';
  selectedTrust = null;

  if (q.length < 2) { trustList.classList.add('hidden'); return; }

  const matches = TRUSTS.filter(t => t.name.toLowerCase().includes(q));
  if (!matches.length) { trustList.classList.add('hidden'); return; }

  matches.forEach(trust => {
    const li = document.createElement('li');
    const idx = trust.name.toLowerCase().indexOf(q);
    li.innerHTML = trust.name.slice(0, idx)
      + '<strong>' + trust.name.slice(idx, idx + q.length) + '</strong>'
      + trust.name.slice(idx + q.length);
    li.addEventListener('mousedown', e => {
      e.preventDefault();
      selectTrust(trust);
    });
    trustList.appendChild(li);
  });
  trustList.classList.remove('hidden');
});

trustInput.addEventListener('blur', () => {
  setTimeout(() => trustList.classList.add('hidden'), 150);
});

function selectTrust(trust) {
  selectedTrust = trust;
  selectedHospitals = [];
  trustInput.value = trust.name;
  trustList.classList.add('hidden');
  openHospitalModal(trust);
}

// Hospital modal
function openHospitalModal(trust) {
  document.getElementById('modalTrustName').textContent = trust.name;
  const grid = document.getElementById('hospitalsGrid');
  grid.innerHTML = '';
  trust.hospitals.forEach(h => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab-btn';
    btn.textContent = h;
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      if (btn.classList.contains('selected')) {
        if (!selectedHospitals.includes(h)) selectedHospitals.push(h);
      } else {
        selectedHospitals = selectedHospitals.filter(x => x !== h);
      }
    });
    grid.appendChild(btn);
  });
  document.getElementById('hospitalModal').classList.remove('hidden');
}

document.getElementById('hospitalDone').addEventListener('click', () => {
  document.getElementById('hospitalModal').classList.add('hidden');
  const hint = document.getElementById('trustHint');
  hint.textContent = selectedHospitals.length
    ? selectedHospitals.length + ' hospital' + (selectedHospitals.length > 1 ? 's' : '') + ' selected'
    : trust ? trust.hospitals.length + ' hospitals available — none selected' : '';
});

// Sub-specialty tabs
function buildSubspecGrid(specialty) {
  const grid = document.getElementById('subspecGrid');
  const hint = document.getElementById('subspecHint');
  grid.innerHTML = '';
  selectedSubspecs = [];
  const subs = SUBSPECIALTIES[specialty] || [];

  if (!subs.length) {
    hint.textContent = 'No sub-specialties found — you can add them in Settings later.';
    return;
  }

  hint.textContent = 'Select all that apply to your current rotation.';
  subs.forEach(s => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab-btn';
    btn.textContent = s;
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      if (btn.classList.contains('selected')) {
        if (!selectedSubspecs.includes(s)) selectedSubspecs.push(s);
      } else {
        selectedSubspecs = selectedSubspecs.filter(x => x !== s);
      }
    });
    grid.appendChild(btn);
  });
}

buildSubspecGrid(sessionStorage.getItem('log_specialty') || '');

// Block Enter from submitting prefs form
document.getElementById('prefsForm').addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.type !== 'submit') e.preventDefault();
});

document.getElementById('prefsForm').addEventListener('submit', e => {
  e.preventDefault();
  buildPrefs2();
  showScreen('prefs2');
});

document.getElementById('skipPrefs').addEventListener('click', () => {
  buildPrefs2();
  showScreen('prefs2');
});

// ── Step 4: Preferences 2 ─────────────────────────────────────
document.getElementById('backToPrefs1').addEventListener('click', e => {
  e.preventDefault();
  showScreen('prefs');
});

function buildPrefs2() {
  const specialty = sessionStorage.getItem('log_specialty') || '';

  // Read selected sub-specialties directly from the DOM (most reliable)
  const chosenSubs = Array.from(document.querySelectorAll('#subspecGrid .tab-btn.selected')).map(b => b.textContent);

  // Consultants
  const consultantGrid = document.getElementById('consultantsGrid');
  const consultantHint = document.getElementById('consultantHint');
  consultantGrid.innerHTML = '';
  selectedConsultants = [];
  const consultants = CONSULTANTS[specialty] || CONSULTANTS['General Surgery'];
  consultantHint.textContent = 'Tap to select your regular supervisors.';
  consultants.forEach(c => {
    const btn = makeTabBtn(c, () => toggleItem(c, selectedConsultants));
    consultantGrid.appendChild(btn);
  });
  // + button for consultants
  consultantGrid.appendChild(makePlusBtn('consultant'));

  // Operations — pull only from selected sub-specialties
  const operationsGrid = document.getElementById('operationsGrid');
  const operationsHint = document.getElementById('operationsHint');
  operationsGrid.innerHTML = '';
  selectedOperations = [];

  const sources = chosenSubs.length > 0 ? chosenSubs : [specialty];
  const ops = [...new Set(sources.flatMap(s => OPERATIONS[s] || []))];

  if (ops.length) {
    operationsHint.textContent = 'Tap to add operations you do regularly.';
    ops.forEach(op => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab-btn';
      btn.textContent = op;
      btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
        if (btn.classList.contains('selected')) {
          if (!selectedOperations.includes(op)) selectedOperations.push(op);
        } else {
          selectedOperations = selectedOperations.filter(x => x !== op);
        }
      });
      operationsGrid.appendChild(btn);
    });
    // + button for operations
    operationsGrid.appendChild(makePlusBtn('operation'));
  } else {
    operationsHint.textContent = 'No operations found — tap + to add manually.';
    operationsGrid.appendChild(makePlusBtn('operation'));
  }
}

// ── Helper: make a tab button ─────────────────────────────────
function makeTabBtn(label, onToggle) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'tab-btn';
  btn.textContent = label;
  btn.addEventListener('click', () => {
    btn.classList.toggle('selected');
    if (onToggle) onToggle(btn.classList.contains('selected'));
  });
  return btn;
}

function toggleItem(item, arr) {
  const idx = arr.indexOf(item);
  if (idx === -1) arr.push(item); else arr.splice(idx, 1);
}

// ── Helper: + button that opens search modal ──────────────────
function makePlusBtn(type) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'plus-btn';
  btn.innerHTML = '+';
  btn.setAttribute('data-type', type);
  btn.addEventListener('click', () => openSearchModal(type));
  return btn;
}

// ── Search modal ──────────────────────────────────────────────
function openSearchModal(type) {
  const specialty = sessionStorage.getItem('log_specialty') || '';
  const chosenSubs = Array.from(document.querySelectorAll('#subspecGrid .tab-btn.selected')).map(b => b.textContent);

  let allItems = [];
  if (type === 'consultant') {
    // All consultants across all specialties
    allItems = [...new Set(Object.values(CONSULTANTS).flat())].sort();
  } else {
    // All operations across all sub-specialties for this specialty
    const allSubs = SUBSPECIALTIES[specialty] || [];
    allItems = [...new Set(allSubs.flatMap(s => OPERATIONS[s] || []))].sort();
  }

  const modal = document.getElementById('searchModal');
  const input = document.getElementById('searchModalInput');
  const list  = document.getElementById('searchModalList');
  const title = document.getElementById('searchModalTitle');

  title.textContent = type === 'consultant' ? 'Add a consultant' : 'Add an operation';
  input.value = '';
  modal.setAttribute('data-type', type);

  function renderList(q) {
    list.innerHTML = '';
    const matches = q.length > 0
      ? allItems.filter(i => i.toLowerCase().includes(q.toLowerCase()))
      : allItems;
    matches.slice(0, 30).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      li.addEventListener('click', () => {
        addItemFromSearch(item, type);
        modal.classList.add('hidden');
      });
      list.appendChild(li);
    });
  }

  renderList('');
  input.addEventListener('input', () => renderList(input.value));
  modal.classList.remove('hidden');
  setTimeout(() => input.focus(), 100);
}

function addItemFromSearch(item, type) {
  const gridId = type === 'consultant' ? 'consultantsGrid' : 'operationsGrid';
  const arr    = type === 'consultant' ? selectedConsultants : selectedOperations;
  const grid   = document.getElementById(gridId);

  // Don't add duplicates
  if ([...grid.querySelectorAll('.tab-btn')].some(b => b.textContent === item)) return;

  // Insert before the + button
  const plusBtn = grid.querySelector('.plus-btn');
  const btn = makeTabBtn(item, () => toggleItem(item, arr));
  btn.classList.add('selected');
  arr.push(item);
  grid.insertBefore(btn, plusBtn);
}

document.getElementById('searchModalClose').addEventListener('click', () => {
  document.getElementById('searchModal').classList.add('hidden');
});

document.getElementById('searchModal').addEventListener('click', e => {
  if (e.target === document.getElementById('searchModal')) {
    document.getElementById('searchModal').classList.add('hidden');
  }
});

document.getElementById('prefs2Form').addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.type !== 'submit') e.preventDefault();
});

document.getElementById('prefs2Form').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('verifyEmail').textContent = emailInput.value.trim();
  showScreen('verify');
});

document.getElementById('skipPrefs2').addEventListener('click', () => {
  document.getElementById('verifyEmail').textContent = emailInput.value.trim();
  showScreen('verify');
});

// ── Step 5: Resend email ──────────────────────────────────────
document.getElementById('resendLink').addEventListener('click', e => {
  e.preventDefault();
  e.target.textContent = 'Sent!';
  setTimeout(() => e.target.textContent = 'Resend email', 3000);
});
