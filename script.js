/* ══════════════════════════════════════════════════
   SOUMYAJIT SHAW – ULTRA PREMIUM PORTFOLIO JS
   ══════════════════════════════════════════════════ */

'use strict';

/* ── EMAILJS INIT (replace with your public key) ── */
emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');

/* ══════════ 1. PRELOADER ══════════ */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    // Kick off entrance animations after load
    initAOS();
    animateHeroStats();
  }, 2000);
});
document.body.style.overflow = 'hidden';

/* ══════════ 2. CUSTOM CURSOR ══════════ */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const trailContainer = document.getElementById('cursor-trail-container');
const mouseGlow  = document.getElementById('mouse-glow');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
const TRAIL_COUNT = 8;
const trails = [];

// Create trail dots
for (let i = 0; i < TRAIL_COUNT; i++) {
  const t = document.createElement('div');
  t.classList.add('cursor-trail');
  t.style.opacity = (1 - i / TRAIL_COUNT) * 0.5;
  t.style.width = t.style.height = `${6 - i * 0.4}px`;
  trailContainer.appendChild(t);
  trails.push({ el: t, x: 0, y: 0 });
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';

  mouseGlow.style.left = mouseX + 'px';
  mouseGlow.style.top  = mouseY + 'px';
});

// Smooth cursor ring + trailing effect
(function animateCursor() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  // Update trails
  let prevX = mouseX, prevY = mouseY;
  trails.forEach((trail, i) => {
    trail.x += (prevX - trail.x) * (0.18 - i * 0.012);
    trail.y += (prevY - trail.y) * (0.18 - i * 0.012);
    trail.el.style.left = trail.x + 'px';
    trail.el.style.top  = trail.y + 'px';
    prevX = trail.x;
    prevY = trail.y;
  });

  requestAnimationFrame(animateCursor);
})();

// Cursor hover states
document.querySelectorAll('a, button, .tilt-card, .skill-card, .filter-btn, .tech-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});

/* ══════════ 3. SCROLL PROGRESS BAR ══════════ */
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}, { passive: true });

/* ══════════ 4. NAVBAR ══════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
  toggleBackToTop();
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Active nav link based on scroll
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
    }
  });
}

/* ══════════ 5. THEME TOGGLE ══════════ */
const themeToggle = document.getElementById('theme-toggle');
const html        = document.documentElement;

// Persist theme
const savedTheme = localStorage.getItem('ss-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('ss-theme', next);
});

/* ══════════ 6. PARTICLE CANVAS ══════════ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.r    = Math.random() * 1.8 + 0.4;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = (Math.random() - 0.5) * 0.4;
      this.life = Math.random();
      this.maxLife = Math.random() * 0.5 + 0.3;
      const colors = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(168,85,247,', 'rgba(217,70,239,'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life += 0.004;
      if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
        this.reset();
      }
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + alpha + ')';
      ctx.fill();
    }
  }

  // Connection lines between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // Create particles
  const COUNT = Math.min(120, Math.floor(W * H / 12000));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ══════════ 7. TYPING ANIMATION ══════════ */
(function initTyping() {
  const el     = document.getElementById('typed-text');
  const words  = ['Java Developer', 'Frontend Developer', 'Android Developer', 'Problem Solver', 'Future Software Engineer'];
  let wi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DEL = 45, PAUSE = 1600;

  function type() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);

    if (!deleting && ci > word.length) {
      deleting = true;
      setTimeout(type, PAUSE);
      return;
    }
    if (deleting && ci < 0) {
      deleting = false;
      ci = 0;
      wi = (wi + 1) % words.length;
    }
    setTimeout(type, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(type, 800);
})();

/* ══════════ 8. AOS – SCROLL REVEAL ══════════ */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || 0);
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
          // Trigger skill bars when skills section visible
          if (entry.target.closest('.skills-section')) {
            animateSkillBars();
          }
          // Trigger counters
          entry.target.querySelectorAll('[data-count]').forEach(el => animateCounter(el));
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));

  // Also observe stat cards for counters
  document.querySelectorAll('.stat-card').forEach(card => {
    const observer2 = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        card.querySelectorAll('[data-count]').forEach(el => animateCounter(el));
        observer2.unobserve(card);
      }
    }, { threshold: 0.3 });
    observer2.observe(card);
  });
}

/* ══════════ 9. COUNTER ANIMATION ══════════ */
function animateCounter(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const target = parseInt(el.dataset.count);
  const duration = 2000;
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + (target >= 100 ? '+' : '');
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ══════════ 10. HERO STATS COUNTER ══════════ */
function animateHeroStats() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => animateCounter(el));
}

/* ══════════ 11. SKILL BARS ══════════ */
let skillBarsAnimated = false;
function animateSkillBars() {
  if (skillBarsAnimated) return;
  skillBarsAnimated = true;
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const width = bar.dataset.width;
    requestAnimationFrame(() => { bar.style.width = width + '%'; });
  });
}

// Trigger skill bars when skills section scrolls into view
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const skillObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateSkillBars();
      skillObs.unobserve(skillsSection);
    }
  }, { threshold: 0.2 });
  skillObs.observe(skillsSection);
}

/* ══════════ 12. 3D TILT CARDS ══════════ */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(800px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateZ(8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
  });
});

/* ══════════ 13. MAGNETIC BUTTONS ══════════ */
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const dx   = e.clientX - (rect.left + rect.width / 2);
    const dy   = e.clientY - (rect.top  + rect.height / 2);
    btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ══════════ 14. RIPPLE EFFECT ══════════ */
document.querySelectorAll('.btn, .proj-btn, .filter-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.style.width  = ripple.style.height = size + 'px';
    ripple.style.left   = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ══════════ 15. PROJECT FILTER ══════════ */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      if (match) {
        card.classList.remove('hidden');
        card.style.opacity = '1';
        card.style.transform = '';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => card.classList.add('hidden'), 300);
      }
    });
  });
});

/* ══════════ 16. TESTIMONIALS SLIDER ══════════ */
(function initTestimonials() {
  const track = document.getElementById('testimonial-track');
  const dots  = document.querySelectorAll('.testi-dot');
  const total = document.querySelectorAll('.testimonial-card').length;
  let current = 0;
  let autoTimer;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.getElementById('prev-testi').addEventListener('click', () => { clearInterval(autoTimer); goTo(current - 1); startAuto(); });
  document.getElementById('next-testi').addEventListener('click', () => { clearInterval(autoTimer); goTo(current + 1); startAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(autoTimer); goTo(i); startAuto(); }));

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 4500); }
  startAuto();
})();

/* ══════════ 17. CONTACT FORM ══════════ */
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  // Real-time validation helpers
  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }
  function clearError(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  }

  function validateName() {
    const val = document.getElementById('contact-name').value.trim();
    if (!val) { showError('name-error', 'Name is required.'); return false; }
    if (val.length < 2) { showError('name-error', 'Name must be at least 2 characters.'); return false; }
    clearError('name-error'); return true;
  }
  function validateEmail() {
    const val = document.getElementById('contact-email').value.trim();
    const re  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) { showError('email-error', 'Email is required.'); return false; }
    if (!re.test(val)) { showError('email-error', 'Enter a valid email address.'); return false; }
    clearError('email-error'); return true;
  }
  function validateSubject() {
    const val = document.getElementById('contact-subject').value.trim();
    if (!val) { showError('subject-error', 'Subject is required.'); return false; }
    if (val.length < 3) { showError('subject-error', 'Subject must be at least 3 characters.'); return false; }
    clearError('subject-error'); return true;
  }
  function validateMessage() {
    const val = document.getElementById('contact-message').value.trim();
    if (!val) { showError('message-error', 'Message is required.'); return false; }
    if (val.length < 10) { showError('message-error', 'Message must be at least 10 characters.'); return false; }
    clearError('message-error'); return true;
  }

  // Live validation
  document.getElementById('contact-name').addEventListener('blur', validateName);
  document.getElementById('contact-email').addEventListener('blur', validateEmail);
  document.getElementById('contact-subject').addEventListener('blur', validateSubject);
  document.getElementById('contact-message').addEventListener('blur', validateMessage);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Honeypot check
    if (document.getElementById('honeypot').value) return;

    const valid = validateName() & validateEmail() & validateSubject() & validateMessage();
    if (!valid) return;

    // Loading state
    submitBtn.disabled = true;
    btnText.style.display    = 'none';
    btnLoading.style.display = 'flex';

    // EmailJS send
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form)
      .then(() => {
        showToast('success', '🎉 Message Sent!', "Thanks! I'll get back to you soon.");
        form.reset();
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        showToast('error', '❌ Send Failed', 'Something went wrong. Please try again or email directly.');
      })
      .finally(() => {
        submitBtn.disabled = false;
        btnText.style.display    = 'flex';
        btnLoading.style.display = 'none';
      });
  });
})();

/* ══════════ 18. TOAST NOTIFICATION ══════════ */
function showToast(type, title, msg) {
  const toast  = document.getElementById('toast');
  const icon   = toast.querySelector('.toast-icon');
  const tTitle = document.getElementById('toast-title');
  const tMsg   = document.getElementById('toast-msg');

  icon.className = `toast-icon ${type}`;
  icon.innerHTML = type === 'success'
    ? '<i class="fas fa-check-circle"></i>'
    : '<i class="fas fa-times-circle"></i>';
  tTitle.textContent = title;
  tMsg.textContent   = msg;

  toast.classList.add('show');
  setTimeout(() => closeToast(), 5000);
}

function closeToast() {
  document.getElementById('toast').classList.remove('show');
}
window.closeToast = closeToast;

/* ══════════ 19. PROJECT MODAL ══════════ */
const modal       = document.getElementById('project-modal');
const modalClose  = document.getElementById('modal-close');
const modalContent= document.getElementById('modal-content');

const projectData = {
  expense: {
    title: 'Expense Tracker App',
    icon: 'fas fa-wallet',
    color: '#34d399',
    desc: 'A comprehensive Android application for tracking daily expenses with budget management and visual analytics. Users can add, categorize, and visualize expenses with beautiful charts.',
    tech: ['Java', 'Android SDK', 'SQLite', 'MPAndroidChart', 'XML'],
    features: ['Budget Management', 'Visual Charts', 'Category Tracking', 'Monthly Reports', 'Export Data', 'Dark Mode'],
  },
  udhar: {
    title: 'Udhar Management System',
    icon: 'fas fa-hand-holding-usd',
    color: '#818cf8',
    desc: 'A full-featured credit/debit management system for tracking money lent and borrowed. Supports real-time balance calculations, smart reminders, and transaction history.',
    tech: ['Java', 'Android SDK', 'SQLite', 'Firebase', 'XML'],
    features: ['Real-time Sync', 'Transaction History', 'Smart Reminders', 'Balance Tracking', 'Contact Integration', 'PDF Statements'],
  },
  calc: {
    title: 'Calculator App',
    icon: 'fas fa-calculator',
    color: '#fbbf24',
    desc: 'A sleek, feature-rich calculator with standard and scientific modes. Includes history tracking, memory functions, and an elegant modern Material Design UI.',
    tech: ['Java', 'Android SDK', 'XML', 'Material Design'],
    features: ['Scientific Mode', 'History Log', 'Memory Functions', 'Haptic Feedback', 'Copy/Paste', 'Dark Theme'],
  },
  todo: {
    title: 'To-Do List App',
    icon: 'fas fa-tasks',
    color: '#f87171',
    desc: 'A productivity powerhouse with task categories, priority levels, due dates, reminders, and a beautiful gesture-based interface for managing daily tasks.',
    tech: ['JavaScript', 'HTML5', 'CSS3', 'LocalStorage', 'Service Workers'],
    features: ['Priority Levels', 'Due Dates', 'Drag & Drop', 'Categories', 'Search & Filter', 'PWA Support'],
  },
  portfolio: {
    title: 'Portfolio Website',
    icon: 'fas fa-user-tie',
    color: '#22d3ee',
    desc: 'This ultra-premium personal portfolio website featuring glassmorphism UI, 3D hover effects, particle animations, magnetic buttons, and cinematic scroll interactions.',
    tech: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Canvas API', 'EmailJS'],
    features: ['3D Tilt Effects', 'Particle Canvas', 'Custom Cursor', 'Dark/Light Mode', 'EmailJS Contact', 'Fully Responsive'],
  },
  'contact-project': {
    title: 'Request Source Code',
    icon: 'fas fa-code',
    color: '#a855f7',
    desc: "Interested in the source code for one of my projects? I'd be happy to share it! Fill out the contact form with the project name and your purpose, and I'll get back to you.",
    tech: [],
    features: [],
  },
};

function openModal(key) {
  const data = projectData[key];
  if (!data) return;

  modalContent.innerHTML = `
    <div style="text-align:center; margin-bottom:24px;">
      <div style="font-size:56px; color:${data.color}; margin-bottom:12px;"><i class="${data.icon}"></i></div>
      <h2 style="font-size:24px; font-weight:800; margin-bottom:8px;">${data.title}</h2>
      <p style="color:var(--text-secondary); line-height:1.7;">${data.desc}</p>
    </div>
    ${data.tech.length ? `
    <div style="margin-bottom:20px;">
      <h4 style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); margin-bottom:10px;">Tech Stack</h4>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>
    </div>` : ''}
    ${data.features.length ? `
    <div style="margin-bottom:24px;">
      <h4 style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); margin-bottom:10px;">Key Features</h4>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        ${data.features.map(f => `
          <div style="display:flex; align-items:center; gap:8px; font-size:13px; color:var(--text-secondary);">
            <i class="fas fa-check-circle" style="color:#4ade80; font-size:12px;"></i> ${f}
          </div>`).join('')}
      </div>
    </div>` : ''}
    <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:24px;">
      ${key !== 'contact-project' ? `
      <a href="#" class="btn btn-primary" style="font-size:14px; padding:10px 22px;">
        <i class="fab fa-github"></i> GitHub
      </a>
      <a href="#" class="btn btn-secondary" style="font-size:14px; padding:10px 22px;">
        <i class="fas fa-external-link-alt"></i> Live Demo
      </a>` : ''}
      <a href="#contact" class="btn btn-outline" style="font-size:14px; padding:10px 22px;" onclick="closeModal()">
        <i class="fas fa-envelope"></i> Contact Me
      </a>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
window.openModal = openModal;

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = 'auto';
}
window.closeModal = closeModal;

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* ══════════ 20. BACK TO TOP ══════════ */
const backToTop = document.getElementById('back-to-top');
function toggleBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ══════════ 21. SMOOTH SCROLL for ANCHOR LINKS ══════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ══════════ 22. PARALLAX HERO BLOBS ══════════ */
document.addEventListener('mousemove', (e) => {
  const dx = (e.clientX / window.innerWidth  - 0.5) * 30;
  const dy = (e.clientY / window.innerHeight - 0.5) * 30;
  const blob1 = document.querySelector('.blob-1');
  const blob2 = document.querySelector('.blob-2');
  const blob3 = document.querySelector('.blob-3');
  if (blob1) blob1.style.transform = `translate(${dx * 0.5}px, ${dy * 0.5}px)`;
  if (blob2) blob2.style.transform = `translate(${-dx * 0.4}px, ${-dy * 0.4}px)`;
  if (blob3) blob3.style.transform = `translate(${dx * 0.3}px, ${-dy * 0.3}px)`;
});

/* ══════════ 23. SPOTLIGHT EFFECT on CARDS ══════════ */
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(124,58,237,0.07) 0%, var(--glass) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ══════════ 24. HERO GRID PARALLAX on SCROLL ══════════ */
window.addEventListener('scroll', () => {
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid) {
    heroGrid.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
}, { passive: true });

/* ══════════ 25. RESUME DOWNLOAD ══════════ */
document.getElementById('resume-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  showToast('success', '📄 Resume', 'Resume download will be available soon!');
});

/* ══════════ 26. NAV LINK ANIMATED UNDERLINE ══════════ */
// Already handled via CSS, but add JS-driven indicator if needed

/* ══════════ 27. FLOATING ICONS MOUSE INTERACTION ══════════ */
document.addEventListener('mousemove', (e) => {
  const icons = document.querySelectorAll('.floating-icon');
  icons.forEach((icon, i) => {
    const speed = 0.015 + i * 0.003;
    const dx = (e.clientX / window.innerWidth  - 0.5) * 20 * speed * 20;
    const dy = (e.clientY / window.innerHeight - 0.5) * 20 * speed * 20;
    icon.style.transform = `translate(${dx}px, ${dy}px)`;
  });
});

/* ══════════ 28. TIMELINE ANIMATED PROGRESS ══════════ */
const timelineLine = document.querySelector('.timeline-line');
if (timelineLine) {
  const tlObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      timelineLine.style.animation = 'none';
      timelineLine.style.background = 'linear-gradient(to bottom, transparent, var(--primary) 20%, var(--accent) 80%, transparent)';
      tlObs.unobserve(timelineLine);
    }
  }, { threshold: 0.1 });
  tlObs.observe(timelineLine);
}

/* ══════════ 29. INPUT FOCUS ANIMATIONS ══════════ */
document.querySelectorAll('.input-wrap input, .input-wrap textarea').forEach(input => {
  // Glow on focus
  input.addEventListener('focus', () => {
    input.parentElement.querySelector('.input-icon')?.classList.add('active');
  });
  input.addEventListener('blur', () => {
    input.parentElement.querySelector('.input-icon')?.classList.remove('active');
  });
});

/* ══════════ 30. SECTION ENTRANCE WITH STAGGER ══════════ */
function staggerChildren(parent, delay = 80) {
  const children = parent.querySelectorAll('[data-aos]');
  children.forEach((child, i) => {
    if (!child.dataset.aosDelay) {
      child.dataset.aosDelay = i * delay;
    }
  });
}

document.querySelectorAll('.skills-grid, .projects-grid, .services-grid, .achievements-grid').forEach(grid => {
  staggerChildren(grid);
});

/* ══════════ 31. KEYBOARD ACCESSIBILITY ══════════ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    cursorDot.style.display  = 'none';
    cursorRing.style.display = 'none';
  }
});

/* ══════════ 32. ANIMATED GRADIENT BACKGROUND SHIFT ══════════ */
let hue = 250;
setInterval(() => {
  hue = (hue + 0.1) % 360;
  document.documentElement.style.setProperty('--primary', `hsl(${hue},72%,50%)`);
}, 100);
// Limit hue shift to purple-cyan range
let hueDir = 1;
setInterval(() => {
  hue += hueDir * 0.2;
  if (hue > 280 || hue < 220) hueDir *= -1;
  document.documentElement.style.setProperty('--primary', `hsl(${hue},72%,50%)`);
  document.documentElement.style.setProperty('--primary-light', `hsl(${hue + 15},80%,65%)`);
}, 50);

/* ══════════ 33. ACHIEVEMENT CARDS – GLOW PULSE ══════════ */
const achCards = document.querySelectorAll('.achievement-card');
achCards.forEach((card, i) => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = `0 20px 60px rgba(124,58,237,0.2), 0 0 30px rgba(124,58,237,0.1)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

/* ══════════ 34. SERVICE CARD ICONS FLOAT ══════════ */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const icon = card.querySelector('.service-icon');
    if (icon) icon.style.transform = 'translateY(-6px) scale(1.05)';
  });
  card.addEventListener('mouseleave', () => {
    const icon = card.querySelector('.service-icon');
    if (icon) icon.style.transform = '';
  });
});

/* ══════════ 35. SCROLL-TRIGGERED COUNTER STATS ══════════ */
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.stats-section [data-count]').forEach(el => animateCounter(el));
      statsObs.unobserve(statsSection);
    }
  }, { threshold: 0.4 });
  statsObs.observe(statsSection);
}

/* ══════════ 36. PERFORMANCE: Lazy Load Images ══════════ */
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
        imgObserver.unobserve(img);
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

/* ══════════ 37. FOOTER – CURRENT YEAR ══════════ */
const yearEl = document.querySelector('.footer-bottom p');
if (yearEl) {
  yearEl.innerHTML = yearEl.innerHTML.replace('2025', new Date().getFullYear());
}

/* ══════════ 38. SECTION TAG GLOW ON VIEW ══════════ */
document.querySelectorAll('.section-tag').forEach(tag => {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      tag.style.animation = 'tagGlow 2s ease infinite alternate';
      obs.unobserve(tag);
    }
  }, { threshold: 0.8 });
  obs.observe(tag);
});

/* ══════════ 39. NAV TRANSPARENT on HERO, SOLID on SCROLL ══════════ */
// Already handled via .scrolled class above

/* ══════════ 40. HERO TEXT SHIMMER EFFECT ══════════ */
const heroName = document.querySelector('.hero-name .name-line.gradient-text');
if (heroName) {
  heroName.style.backgroundSize = '200% auto';
  let shimmerPos = 0;
  setInterval(() => {
    shimmerPos = (shimmerPos + 0.5) % 200;
    heroName.style.backgroundPosition = `${shimmerPos}% center`;
  }, 20);
}

/* ══════════ 41. MOBILE NAV SWIPE CLOSE ══════════ */
let touchStartX = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
document.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (dx > 60 && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  }
}, { passive: true });

/* ══════════ 42. ABOUT ORBIT ANIMATION PAUSE ON HOVER ══════════ */
const orbit = document.querySelector('.about-orbit');
if (orbit) {
  orbit.addEventListener('mouseenter', () => { orbit.style.animationPlayState = 'paused'; });
  orbit.addEventListener('mouseleave', () => { orbit.style.animationPlayState = 'running'; });
}

/* ══════════ 43. PAGE VISIBLE – RESTART ANIMATIONS ══════════ */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    document.querySelectorAll('.blob').forEach(b => {
      b.style.animation = 'none';
      requestAnimationFrame(() => { b.style.animation = ''; });
    });
  }
});

/* ══════════ 44. INIT EVERYTHING ON DOM READY ══════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Initial active nav
  updateActiveNav();

  // Animate elements already in viewport
  setTimeout(() => {
    document.querySelectorAll('[data-aos]').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('aos-animate');
      }
    });
  }, 2100);
});

console.log('%c Soumyajit Shaw Portfolio ', 'background: linear-gradient(135deg,#7c3aed,#06b6d4); color:#fff; font-size:16px; font-weight:800; padding:10px 20px; border-radius:8px;');
console.log('%c Built with ❤️ using HTML5 + CSS3 + Vanilla JS ', 'color:#a855f7; font-size:13px;');
