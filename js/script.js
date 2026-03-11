/* ============================================
   1. HAMBURGER MENU (all pages)
   ============================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}


/* ============================================
   2. NAME MODAL — greet user by name (index.html only)
   ============================================ */
const nameModal   = document.getElementById('nameModal');
const nameInput   = document.getElementById('nameInput');
const nameSubmit  = document.getElementById('nameSubmit');
const userNameEl  = document.getElementById('userName');

if (nameModal) {
  // Check if name is stored in sessionStorage
  const storedName = sessionStorage.getItem('userName');

  if (storedName) {
    nameModal.classList.add('hidden');
    if (userNameEl) userNameEl.textContent = storedName;
  } else {
    // Show modal, let user enter name
    nameModal.classList.remove('hidden');
  }

  function applyName() {
    const name = nameInput ? nameInput.value.trim() : '';
    const displayName = name || 'there';
    sessionStorage.setItem('userName', displayName);
    if (userNameEl) userNameEl.textContent = displayName;
    if (nameModal) nameModal.classList.add('hidden');
  }

  if (nameSubmit) {
    nameSubmit.addEventListener('click', applyName);
  }

  if (nameInput) {
    nameInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') applyName();
    });
  }
}


/* ============================================
   3. CONTACT FORM — validation & display (index.html)
   ============================================ */
const contactForm   = document.getElementById('contactForm');
const resultContent = document.getElementById('resultContent');
const resultEmpty   = document.querySelector('.result-empty');

if (contactForm) {

  // Helper: show or clear an error
  function setError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const err   = document.getElementById(errorId);
    if (!field || !err) return;
    if (message) {
      err.textContent = message;
      field.classList.add('input-error');
    } else {
      err.textContent = '';
      field.classList.remove('input-error');
    }
  }

  // Helper: validate email format
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Helper: validate Indonesian phone (starts 08 or +628, 10–14 digits)
  function isValidPhone(phone) {
    return /^(\+62|62|0)[8][0-9]{8,12}$/.test(phone.replace(/\s|-/g, ''));
  }

  // Clear errors on input change
  ['nama', 'email', 'phone', 'tanggalLahir', 'pesan'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('input-error');
        const errEl = document.getElementById(id + 'Error') ||
                      document.getElementById(id.charAt(0).toUpperCase() + id.slice(1) + 'Error') ||
                      document.getElementById('tanggalError') ||
                      document.getElementById('pesanError');
        // Clear specific error
        const mapping = {
          nama: 'namaError', email: 'emailError',
          phone: 'phoneError', tanggalLahir: 'tanggalError', pesan: 'pesanError'
        };
        const errId = mapping[id];
        if (errId) {
          const errDiv = document.getElementById(errId);
          if (errDiv) errDiv.textContent = '';
        }
      });
    }
  });

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    let valid = true;

    // --- Nama ---
    const nama = document.getElementById('nama').value.trim();
    if (!nama) {
      setError('nama', 'namaError', 'Nama is required.');
      valid = false;
    } else if (nama.length < 2) {
      setError('nama', 'namaError', 'Name must be at least 2 characters.');
      valid = false;
    } else {
      setError('nama', 'namaError', '');
    }

    // --- Email ---
    const email = document.getElementById('email').value.trim();
    if (!email) {
      setError('email', 'emailError', 'Email is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setError('email', 'emailError', 'Please enter a valid email address.');
      valid = false;
    } else {
      setError('email', 'emailError', '');
    }

    // --- Phone ---
    const phone = document.getElementById('phone').value.trim();
    if (!phone) {
      setError('phone', 'phoneError', 'Phone number is required.');
      valid = false;
    } else if (!isValidPhone(phone)) {
      setError('phone', 'phoneError', 'Enter a valid Indonesian phone number (e.g. 08123456789).');
      valid = false;
    } else {
      setError('phone', 'phoneError', '');
    }

    // --- Tanggal Lahir ---
    const tanggal = document.getElementById('tanggalLahir').value;
    if (!tanggal) {
      setError('tanggalLahir', 'tanggalError', 'Date of birth is required.');
      valid = false;
    } else {
      const dob = new Date(tanggal);
      const today = new Date();
      if (dob >= today) {
        setError('tanggalLahir', 'tanggalError', 'Date of birth must be in the past.');
        valid = false;
      } else {
        setError('tanggalLahir', 'tanggalError', '');
      }
    }

    // --- Pesan ---
    const pesan = document.getElementById('pesan').value.trim();
    if (!pesan) {
      setError('pesan', 'pesanError', 'Message is required.');
      valid = false;
    } else if (pesan.length < 10) {
      setError('pesan', 'pesanError', 'Message must be at least 10 characters.');
      valid = false;
    } else {
      setError('pesan', 'pesanError', '');
    }

    // --- Gender ---
    const genderInput = document.querySelector('input[name="gender"]:checked');
    const gender = genderInput ? genderInput.value : 'Laki-Laki';

    if (!valid) return;

    // ---- All valid: display result ----
    const now = new Date();
    document.getElementById('resultTime').textContent =
      'Current time : ' + now.toLocaleString('en-GB', {
        weekday: 'short', year: 'numeric', month: 'short',
        day: '2-digit', hour: '2-digit', minute: '2-digit',
        second: '2-digit', timeZoneName: 'short'
      });

    // Format date nicely
    const [y, m, d] = tanggal.split('-');
    const formattedDate = `${d}/${m}/${y}`;

    document.getElementById('rNama').textContent    = nama;
    document.getElementById('rEmail').textContent   = email;
    document.getElementById('rPhone').textContent   = phone;
    document.getElementById('rTanggal').textContent = formattedDate;
    document.getElementById('rGender').textContent  = gender;
    document.getElementById('rPesan').textContent   = pesan;

    // Show result, hide empty state
    if (resultContent) resultContent.style.display = 'block';
    if (resultEmpty)   resultEmpty.style.display   = 'none';

    // Scroll to result on mobile
    if (window.innerWidth < 900) {
      document.getElementById('resultContent')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}
/* ============================================
   4. SMOOTH SCROLL for anchor links
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ============================================
   5. NAVBAR — sticky shadow on scroll
   ============================================ */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}


/* ============================================
   6. FADE-IN ON SCROLL — lightweight intersection observer
   ============================================ */
const observerTargets = document.querySelectorAll('.hq-card, .port-card, .team-card, .vm-card--vision, .vm-missions, .ah-item, .vm-mission-item');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  observerTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    io.observe(el);
  });
}

