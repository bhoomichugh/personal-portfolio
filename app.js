/**
 * BHOOMI CHUGH — EDITORIAL PERSONAL BRAND ENGINE
 * Features: Soft Sand & Olive Night Theme Toggle, Ambient Dust Canvas, 
 * Project Case Studies (4 Selected Builds without repo buttons), Sound FX, Direct Links
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. THEME SWITCHER (SOFT SAND ⇄ DEEP OLIVE NIGHT)
  // =========================================================================
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');

  const savedTheme = localStorage.getItem('bc_portfolio_theme') || 'sand';
  applyTheme(savedTheme);

  themeBtn?.addEventListener('click', () => {
    playTone(520, 'sine', 0.05, 0.08);
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'sand';
    const nextTheme = currentTheme === 'sand' ? 'olive-night' : 'sand';
    applyTheme(nextTheme);
    localStorage.setItem('bc_portfolio_theme', nextTheme);
    showToast(`Switched to ${nextTheme === 'sand' ? 'Soft Sand' : 'Olive Night'} Theme`);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'olive-night') {
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeLabel) themeLabel.textContent = 'Theme: Night';
    } else {
      if (themeIcon) themeIcon.textContent = '🌿';
      if (themeLabel) themeLabel.textContent = 'Theme: Sand';
    }
  }

  // =========================================================================
  // 2. TACTILE AUDIO FEEDBACK (Procedural Web Audio API)
  // =========================================================================
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.08) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback
    }
  }

  function playSoftChime() {
    playTone(587.33, 'triangle', 0.08, 0.06); // D5
  }

  function playSuccessChord() {
    if (!soundEnabled) return;
    setTimeout(() => playTone(440, 'triangle', 0.22, 0.08), 0);    // A4
    setTimeout(() => playTone(554.37, 'triangle', 0.22, 0.08), 80); // C#5
    setTimeout(() => playTone(659.25, 'triangle', 0.32, 0.1), 160); // E5
  }

  const soundBtn = document.getElementById('sound-toggle');
  soundBtn?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    const ctrlText = soundBtn.querySelector('.ctrl-text');
    const ctrlIcon = soundBtn.querySelector('.ctrl-icon');
    if (soundEnabled) {
      ctrlIcon.textContent = '🔊';
      ctrlText.textContent = 'SFX: ON';
      playSoftChime();
      showToast('🔊 Audio feedback turned on');
    } else {
      ctrlIcon.textContent = '🔇';
      ctrlText.textContent = 'SFX: OFF';
      showToast('🔇 Audio feedback muted');
    }
  });

  // =========================================================================
  // 3. AMBIENT DUST / STARFIELD CANVAS (Dusty Rose & Olive Particles)
  // =========================================================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.alpha = Math.random() * 0.45 + 0.15;
        this.color = Math.random() > 0.5 ? '186, 118, 124' : '107, 127, 77';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }
      draw() {
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 35; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }



  // =========================================================================
  // 4. PROJECT CASE STUDY MODALS (CLEAN & WITHOUT REPO BUTTONS)
  // =========================================================================
  const projectDetails = {
    laundry: {
      title: "Smart Laundry Management System",
      tagline: "End-to-End Campus Service Lifecycle Platform",
      badge: "Enterprise Java & Spring Boot",
      content: `
        <div style="background: var(--bg-subtle); padding: 18px; border-radius: 8px; border: 1px solid var(--border-hairline); margin-bottom: 20px;">
          <h4 style="color: var(--olive-primary); margin-bottom: 8px; font-size: 0.95rem;">System Architecture:</h4>
          <p style="color: var(--text-secondary); font-family: monospace; font-size: 0.85rem; line-height: 1.6;">
            [Drop-off & Bag Tagging] ➔ [Weight & Garment Classification] ➔ [Washing/Ironing Queue]<br>
            ➔ [Status Updates via Webhook] ➔ [Automated Invoicing & Pickup Notification]
          </p>
        </div>

        <h4 style="color: var(--text-primary); margin-bottom: 8px; font-size: 1rem;">The Problem Solved:</h4>
        <p style="color: var(--text-secondary); margin-bottom: 16px; line-height: 1.65;">
          High-volume residential dormitories face chronic operational chaos: misplaced garments, unrecorded weight disputes, and erratic collection windows. This platform replaces pen-and-paper tracking with an automated lifecycle tracker, role-based operator consoles, and automated student pickup notifications.
        </p>

        <h4 style="color: var(--text-primary); margin-bottom: 8px; font-size: 1rem;">Key Engineering Details:</h4>
        <ul style="padding-left: 20px; color: var(--text-secondary); line-height: 1.65;">
          <li>Robust REST API engineered with Spring Boot, Spring Security, and stateless JWT token authentication.</li>
          <li>Relational schema in MySQL with indexed foreign keys linking student accounts, order lines, and payment statuses.</li>
          <li>Clean responsive React interface featuring real-time state transitions (Received, In-Progress, Ready, Delivered).</li>
        </ul>
      `
    },
    booking: {
      title: "Real-Time Ticket Booking Platform",
      tagline: "Concurrency-Resilient Seat Reservation Engine",
      badge: "High-Concurrency Web Systems",
      content: `
        <div style="background: var(--bg-subtle); padding: 18px; border-radius: 8px; border: 1px solid var(--border-hairline); margin-bottom: 20px;">
          <h4 style="color: var(--rose-primary); margin-bottom: 8px; font-size: 0.95rem;">Concurrency Flow:</h4>
          <p style="color: var(--text-secondary); font-family: monospace; font-size: 0.85rem; line-height: 1.6;">
            Seat Click ➔ Optimistic Lock / 5-Min Hold Window ➔ WebSocket Broadcast to other users<br>
            ➔ Payment Confirmation ➔ Permanent DB Write & Ticket QR Generation
          </p>
        </div>

        <h4 style="color: var(--text-primary); margin-bottom: 8px; font-size: 1rem;">The Problem Solved:</h4>
        <p style="color: var(--text-secondary); margin-bottom: 16px; line-height: 1.65;">
          When popular events release tickets, simultaneous user checkouts inevitably trigger database race conditions and double bookings. This system enforces optimistic concurrency locking and ephemeral socket sync so that when one user clicks a seat, it grays out across all connected clients in real time.
        </p>

        <h4 style="color: var(--text-primary); margin-bottom: 8px; font-size: 1rem;">Key Engineering Details:</h4>
        <ul style="padding-left: 20px; color: var(--text-secondary); line-height: 1.65;">
          <li>Node.js / Express backend with bi-directional WebSocket channels for live seat map synchronization.</li>
          <li>Atomic database operations preventing conflicting simultaneous write transactions under high load.</li>
          <li>Interactive visual seat layout with category-based tiered pricing and responsive scaling.</li>
        </ul>
      `
    },
    crm: {
      title: "Astrologer CRM & Client Portal",
      tagline: "Consultation Management & Client History Portal",
      badge: "Product & SaaS Dashboard",
      content: `
        <h4 style="color: var(--text-primary); margin-bottom: 8px; font-size: 1rem;">The Problem Solved:</h4>
        <p style="color: var(--text-secondary); margin-bottom: 16px; line-height: 1.65;">
          Independent wellness consultants and astrologers lose hours trying to trace past consultations across WhatsApp threads, paper notebooks, and bank receipts. This CRM provides a unified workstation that centralizes appointment scheduling, client natal chart profiles, consultation recordings, and revenue metrics.
        </p>

        <h4 style="color: var(--text-primary); margin-bottom: 8px; font-size: 1rem;">Key Engineering Details:</h4>
        <ul style="padding-left: 20px; color: var(--text-secondary); line-height: 1.65;">
          <li>Interactive analytics dashboard visualizing monthly consultation hours, earnings, and client retention rates.</li>
          <li>Integrated calendar scheduling with automated conflict detection and time-zone conversions.</li>
          <li>Client history log allowing quick retrieval of past consultations and personalized recommendations.</li>
        </ul>
      `
    },
    wheelchair: {
      title: "IoT-Powered Smart Assistive Wheelchair",
      tagline: "Embedded Sensors & Accessibility Mobility System",
      badge: "Hardware & IoT Systems",
      content: `
        <div style="background: var(--bg-subtle); padding: 18px; border-radius: 8px; border: 1px solid var(--border-hairline); margin-bottom: 20px;">
          <h4 style="color: var(--olive-primary); margin-bottom: 8px; font-size: 0.95rem;">Hardware Architecture:</h4>
          <p style="color: var(--text-secondary); font-family: monospace; font-size: 0.85rem; line-height: 1.6;">
            [Microcontroller (Arduino/ESP32)] ➔ [Ultrasonic Collision Sensors (HC-SR04)]<br>
            ➔ [L298N Dual H-Bridge Motor Driver] ➔ [Cloud MQTT Alert Telemetry]
          </p>
        </div>

        <h4 style="color: var(--text-primary); margin-bottom: 8px; font-size: 1rem;">The Problem Solved:</h4>
        <p style="color: var(--text-secondary); margin-bottom: 16px; line-height: 1.65;">
          Traditional manual joysticks can be inaccessible for users with severe hand tremors or motor restrictions. This assistive prototype incorporates ultrasonic collision avoidance with automated braking, head-gesture accelerometer guidance, and cloud-linked emergency SOS notifications.
        </p>

        <h4 style="color: var(--text-primary); margin-bottom: 8px; font-size: 1rem;">Key Engineering Details:</h4>
        <ul style="padding-left: 20px; color: var(--text-secondary); line-height: 1.65;">
          <li>Real-time sensor interrupt routine executing collision avoidance checks every 50ms.</li>
          <li>Pulse-Width Modulation (PWM) speed curves for smooth acceleration and safe passenger deceleration.</li>
          <li>Low-latency IoT telemetry streaming status indicators to a mobile supervisor app.</li>
        </ul>
      `
    }
  };

  const projectModal = document.getElementById('project-modal');
  const pmTitle = document.getElementById('pm-title');
  const pmTagline = document.getElementById('pm-tagline');
  const pmBody = document.getElementById('pm-body');
  const btnClosePm = document.getElementById('btn-close-project-modal');

  window.openProjectModal = function(key) {
    const data = projectDetails[key];
    if (!data) return;

    playSoftChime();
    pmTitle.textContent = data.title;
    pmTagline.textContent = data.tagline;
    pmBody.innerHTML = data.content;
    projectModal.classList.remove('hidden');
  };

  btnClosePm?.addEventListener('click', () => {
    projectModal.classList.add('hidden');
  });

  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) projectModal.classList.add('hidden');
  });

  // ESC shortcut to dismiss modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      projectModal?.classList.add('hidden');
    }
  });

  // =========================================================================
  // 5. COPY EMAIL TO CLIPBOARD
  // =========================================================================
  const btnCopyEmail = document.getElementById('btn-copy-email');
  btnCopyEmail?.addEventListener('click', () => {
    playTone(520, 'sine', 0.05, 0.08);
    const email = "bhoomichugh30@gmail.com";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      showToast('📋 Copied email: bhoomichugh30@gmail.com');
    } else {
      showToast('Email: bhoomichugh30@gmail.com');
    }
  });

  // =========================================================================
  // 6. CONTACT MESSAGE COMPOSER
  // =========================================================================
  window.handleSendMessage = function() {
    const name = document.getElementById('sender-name')?.value.trim();
    const topic = document.getElementById('sender-topic')?.value;
    const msg = document.getElementById('sender-msg')?.value.trim();

    if (!name || !msg) return;

    playSuccessChord();
    triggerCelebration();

    const subject = encodeURIComponent(`[Portfolio Contact] ${topic} from ${name}`);
    const body = encodeURIComponent(`Hi Bhoomi,\n\n${msg}\n\nBest regards,\n${name}`);
    const mailto = `mailto:bhoomichugh30@gmail.com?subject=${subject}&body=${body}`;

    showToast(`🎉 Thank you, ${name}! Opening email client...`);
    
    setTimeout(() => {
      window.location.href = mailto;
    }, 800);
  };

  function triggerCelebration() {
    const count = 45;
    const colors = ['#ba767c', '#526338', '#ede5d7', '#a15f65', '#899c68'];

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.style.position = 'fixed';
      el.style.zIndex = '999';
      el.style.width = `${Math.random() * 8 + 5}px`;
      el.style.height = `${Math.random() * 8 + 5}px`;
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.left = `${window.innerWidth / 2}px`;
      el.style.top = `${window.innerHeight / 2}px`;
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      el.style.pointerEvents = 'none';

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      let vx = Math.cos(angle) * speed;
      let vy = Math.sin(angle) * speed - 3;
      let opacity = 1;

      document.body.appendChild(el);

      let px = window.innerWidth / 2;
      let py = window.innerHeight / 2;

      const timer = setInterval(() => {
        px += vx;
        py += vy;
        vy += 0.35;
        opacity -= 0.02;

        el.style.left = `${px}px`;
        el.style.top = `${py}px`;
        el.style.opacity = opacity;

        if (opacity <= 0) {
          clearInterval(timer);
          el.remove();
        }
      }, 16);
    }
  }

  // =========================================================================
  // 7. ACTIVE NAVIGATION HIGHLIGHTING ON SCROLL
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // =========================================================================
  // 8. TOAST MESSAGES
  // =========================================================================
  function showToast(text) {
    const shelf = document.getElementById('toast-shelf');
    if (!shelf) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = text;
    shelf.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // Greeting
  setTimeout(() => {
    showToast('🌿 Welcome to Bhoomi Chugh’s portfolio');
  }, 700);
});
