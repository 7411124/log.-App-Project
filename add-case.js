// add-case.js

// ─── Info popup ───────────────────────────────────────────────────────────────
const infoPopup = document.getElementById('infoPopup');
document.getElementById('infoBtn').addEventListener('click', () => infoPopup.classList.remove('hidden'));
document.getElementById('infoClose').addEventListener('click', () => infoPopup.classList.add('hidden'));
infoPopup.addEventListener('click', e => { if (e.target === infoPopup) infoPopup.classList.add('hidden'); });

const voiceBtn       = document.getElementById('voiceBtn');
const cameraBtn      = document.getElementById('cameraBtn');
const manualBtn      = document.getElementById('manualBtn');

const voiceOverlay   = document.getElementById('voiceOverlay');
const stopVoiceBtn   = document.getElementById('stopVoiceBtn');
const cancelVoiceBtn = document.getElementById('cancelVoiceBtn');
const voiceStatus    = document.getElementById('voiceStatus');
const transcriptBox  = document.getElementById('transcriptBox');
const transcriptText = document.getElementById('transcriptText');
const pulseDot       = document.getElementById('pulseDot');

const cameraOverlay  = document.getElementById('cameraOverlay');
const openCameraBtn  = document.getElementById('openCameraBtn');
const cancelCameraBtn= document.getElementById('cancelCameraBtn');
const cameraInput    = document.getElementById('cameraInput');

// ─── Voice ──────────────────────────────────────────────────────────────────

let recognition = null;
let finalTranscript = '';

voiceBtn.addEventListener('click', openVoiceOverlay);

function openVoiceOverlay() {
  finalTranscript = '';
  transcriptText.textContent = '';
  transcriptBox.classList.add('hidden');
  pulseDot.classList.remove('stopped');
  voiceStatus.textContent = 'Listening…';
  stopVoiceBtn.textContent = 'Stop';
  voiceOverlay.classList.remove('hidden');
  startRecognition();
}

function startRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceStatus.textContent = 'Voice not supported on this browser';
    pulseDot.classList.add('stopped');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'en-GB';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    voiceStatus.textContent = 'Listening…';
  };

  recognition.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) {
        finalTranscript += t + ' ';
      } else {
        interim += t;
      }
    }
    const display = (finalTranscript + interim).trim();
    if (display) {
      transcriptBox.classList.remove('hidden');
      transcriptText.textContent = display;
    }
  };

  recognition.onerror = (e) => {
    if (e.error === 'no-speech') return;
    voiceStatus.textContent = 'Microphone error — tap Stop';
    pulseDot.classList.add('stopped');
  };

  recognition.onend = () => {
    // auto-restart unless we stopped it
    if (voiceOverlay.dataset.stopping !== 'true') {
      try { recognition.start(); } catch(_) {}
    }
  };

  recognition.start();
}

stopVoiceBtn.addEventListener('click', () => {
  if (stopVoiceBtn.textContent === 'Use this') {
    // proceed to manual form pre-populated
    closeVoiceOverlay();
    goToManualWithTranscript(finalTranscript.trim());
    return;
  }

  voiceOverlay.dataset.stopping = 'true';
  if (recognition) recognition.stop();
  pulseDot.classList.add('stopped');
  voiceStatus.textContent = 'Done';
  stopVoiceBtn.textContent = 'Use this';
});

cancelVoiceBtn.addEventListener('click', closeVoiceOverlay);

function closeVoiceOverlay() {
  voiceOverlay.dataset.stopping = 'true';
  if (recognition) { try { recognition.stop(); } catch(_) {} }
  recognition = null;
  voiceOverlay.classList.add('hidden');
  voiceOverlay.dataset.stopping = '';
}

// ─── Camera ─────────────────────────────────────────────────────────────────

cameraBtn.addEventListener('click', () => {
  cameraOverlay.classList.remove('hidden');
});

cancelCameraBtn.addEventListener('click', () => {
  cameraOverlay.classList.add('hidden');
});

openCameraBtn.addEventListener('click', () => {
  cameraInput.click();
});

cameraInput.addEventListener('change', () => {
  const file = cameraInput.files[0];
  if (!file) return;
  cameraOverlay.classList.add('hidden');

  // In production: upload to server for OCR, then delete.
  // Here: show a placeholder "processing" state and go to manual.
  alert('📷 Image captured. In production, we'd extract your case data and delete the image immediately.\n\nFor now, we'll open the manual form — pre-fill coming soon.');

  // Clear the file input for GDPR (no local copy retained)
  cameraInput.value = '';

  window.location.href = 'manual-case.html';
});

// ─── Manual ─────────────────────────────────────────────────────────────────

manualBtn.addEventListener('click', () => {
  window.location.href = 'manual-case.html';
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function goToManualWithTranscript(text) {
  // Pass transcript via sessionStorage for pre-fill
  sessionStorage.setItem('voiceTranscript', text);
  window.location.href = 'manual-case.html';
}
