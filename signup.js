const emailForm = document.getElementById('emailForm');
const detailsForm = document.getElementById('detailsForm');
const screenMethod = document.getElementById('screen-method');
const screenDetails = document.getElementById('screen-details');
const screenVerify = document.getElementById('screen-verify');
const emailInput = document.getElementById('emailInput');
const confirmedEmail = document.getElementById('confirmedEmail');
const verifyEmail = document.getElementById('verifyEmail');
const backToEmail = document.getElementById('backToEmail');
const togglePw = document.getElementById('togglePw');
const passwordInput = document.getElementById('passwordInput');
const continueBtn = document.getElementById('continueBtn');

// Enable continue only when email is typed
emailInput.addEventListener('input', () => {
  continueBtn.disabled = !emailInput.value.trim();
});
continueBtn.disabled = true;

emailForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = emailInput.value.trim();
  if (!email) return;
  confirmedEmail.value = email;
  screenMethod.classList.add('hidden');
  screenDetails.classList.remove('hidden');
  window.scrollTo(0, 0);
});

backToEmail.addEventListener('click', e => {
  e.preventDefault();
  screenDetails.classList.add('hidden');
  screenMethod.classList.remove('hidden');
  window.scrollTo(0, 0);
});

detailsForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = confirmedEmail.value;
  verifyEmail.textContent = email;
  screenDetails.classList.add('hidden');
  screenVerify.classList.remove('hidden');
  window.scrollTo(0, 0);
});

togglePw.addEventListener('click', () => {
  const isText = passwordInput.type === 'text';
  passwordInput.type = isText ? 'password' : 'text';
  togglePw.setAttribute('aria-label', isText ? 'Show password' : 'Hide password');
});

document.getElementById('resendLink').addEventListener('click', e => {
  e.preventDefault();
  e.target.textContent = 'Sent!';
  setTimeout(() => e.target.textContent = 'Resend email', 3000);
});
