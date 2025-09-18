// script.js
// Interactive page: events, features, and custom form validation
// Wrap in DOMContentLoaded to ensure elements exist
document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------
     Feature: Click Counter
     ------------------------- */
  const clickBtn = document.getElementById('clickBtn');
  const resetBtn = document.getElementById('resetBtn');
  const clickCountEl = document.getElementById('clickCount');
  let clicks = 0;

  clickBtn.addEventListener('click', () => {
    clicks++;
    clickCountEl.textContent = `Clicks: ${clicks}`;
    // Visual feedback
    clickBtn.style.transform = 'scale(0.98)';
    setTimeout(() => clickBtn.style.transform = '', 120);
  });

  resetBtn.addEventListener('click', () => {
    clicks = 0;
    clickCountEl.textContent = 'Clicks: 0';
  });

  /* -------------------------
     Feature: Hover box + Keyboard
     ------------------------- */
  const hoverBox = document.getElementById('hoverBox');
  const keyOutput = document.getElementById('keyOutput');

  hoverBox.addEventListener('mouseover', () => hoverBox.textContent = 'Thanks! You hovered');
  hoverBox.addEventListener('mouseout', () => hoverBox.textContent = 'Hover over me');

  // Keyboard: show last key pressed (keydown event)
  document.addEventListener('keydown', (e) => {
    keyOutput.textContent = e.key;
    // animate hoverBox to show key too (DOM manipulation)
    hoverBox.classList.add('pulse');
    setTimeout(() => hoverBox.classList.remove('pulse'), 300);
  });

  /* -------------------------
     Dropdown menu (menu show/hide)
     ------------------------- */
  const dropBtn = document.getElementById('dropBtn');
  const dropMenu = document.getElementById('dropMenu');

  dropBtn.addEventListener('click', () => {
    dropMenu.classList.toggle('hidden');
  });
  // hide when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropBtn.contains(e.target) && !dropMenu.contains(e.target)) {
      dropMenu.classList.add('hidden');
    }
  });

  /* -------------------------
     Tabs (Flexbox), event delegation
     ------------------------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // remove active
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.add('hidden'));
      // activate clicked tab
      btn.classList.add('active');
      const id = btn.dataset.tab;
      document.getElementById(id).classList.remove('hidden');
    });
  });

  /* -------------------------
     FAQ collapsible
     ------------------------- */
  const faqQs = document.querySelectorAll('.faq-q');
  faqQs.forEach(q => q.addEventListener('click', () => {
    const a = q.nextElementSibling;
    a.classList.toggle('hidden');
  }));

  /* -------------------------
     Dark mode toggle (DOM class toggle)
     ------------------------- */
  const darkToggle = document.getElementById('darkToggle');
  darkToggle.addEventListener('click', () => {
    // toggle a class on documentElement (html) so CSS picks up variables
    document.documentElement.classList.toggle('dark');
  });

  /* -------------------------
     FORM Validation: variables, helper functions
     ------------------------- */
  const signupForm = document.getElementById('signupForm');
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const phone = document.getElementById('phone');

  const errName = document.getElementById('errName');
  const errEmail = document.getElementById('errEmail');
  const errPassword = document.getElementById('errPassword');
  const errConfirm = document.getElementById('errConfirm');
  const errPhone = document.getElementById('errPhone');
  const formMessage = document.getElementById('formMessage');
  const clearBtn = document.getElementById('clearBtn');

  // simple regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const phoneRegex = /^\+?\d{7,15}$/;

  function showError(el, msg) { el.textContent = msg; }
  function clearError(el) { el.textContent = ''; }

  // quick field validators (used for real-time and on submit)
  function validateName() {
    const v = fullName.value.trim();
    if (v.length < 2) { showError(errName, 'Name must be at least 2 characters'); return false; }
    clearError(errName); return true;
  }

  function validateEmail() {
    const v = email.value.trim();
    if (!emailRegex.test(v)) { showError(errEmail, 'Please enter a valid email'); return false; }
    clearError(errEmail); return true;
  }

  function validatePassword() {
    const v = password.value;
    if (!strongPass.test(v)) { showError(errPassword, 'Password too weak (min 8 characters, mix upper/lower/number/symbol)'); return false; }
    clearError(errPassword); return true;
  }

  function validateConfirm() {
    if (confirmPassword.value !== password.value) { showError(errConfirm, "Passwords don't match"); return false; }
    clearError(errConfirm); return true;
  }

  function validatePhone() {
    const v = phone.value.trim();
    if (v === '') { clearError(errPhone); return true; } // optional
    if (!phoneRegex.test(v)) { showError(errPhone, 'Phone must be digits, optional + and 7-15 chars'); return false; }
    clearError(errPhone); return true;
  }

  // real-time validation using input events (event listeners)
  [fullName, email, password, confirmPassword, phone].forEach(inp => {
    inp.addEventListener('input', () => {
      validateName(); validateEmail(); validatePassword(); validateConfirm(); validatePhone();
    });
  });

  // handle form submit
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent page reload

    // validate all
    const okName = validateName();
    const okEmail = validateEmail();
    const okPass = validatePassword();
    const okConfirm = validateConfirm();
    const okPhone = validatePhone();

    if (okName && okEmail && okPass && okConfirm && okPhone) {
      // success: show friendly message and simulate sending
      formMessage.classList.remove('hidden'); formMessage.style.background = '#ecfdf5'; formMessage.style.color = '#065f46';
      formMessage.textContent = `Success! Thanks ${fullName.value.trim()}. Your submission is valid.`;
      // simulate sending: clear form after 1.2s
      setTimeout(() => {
        signupForm.reset();
        // clear errors & message
        [errName, errEmail, errPassword, errConfirm, errPhone].forEach(clearError);
        formMessage.classList.add('hidden');
      }, 1200);
    } else {
      // show error summary
      formMessage.classList.remove('hidden'); formMessage.style.background = '#fff1f2'; formMessage.style.color = '#9f1239';
      formMessage.textContent = 'Please fix the errors above and try again.';
    }
  });

  // clear button
  clearBtn.addEventListener('click', () => {
    signupForm.reset();
    [errName, errEmail, errPassword, errConfirm, errPhone].forEach(clearError);
    formMessage.classList.add('hidden');
  });

  /* -------------------------
     Extra: small animation helper for hoverBox
     ------------------------- */
  // CSS class .pulse not defined; we just toggle it (style in CSS could animate)
  const style = document.createElement('style');
  style.textContent = `.pulse { transform: scale(1.03); transition: transform .12s ease; }`;
  document.head.appendChild(style);

});
