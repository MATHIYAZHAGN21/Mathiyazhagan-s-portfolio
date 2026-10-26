/* ===================================================================
   MATHIYAZHAGAN S - PORTFOLIO INTERACTIVE JAVASCRIPT
   Features:
   - Dynamic Interactive Particle Canvas
   - Typewriter Effect
   - Projects Filtering & Case Study Deep-Dive Modal
   - Printable ATS-Style Resume Modal & Instant PDF Print
   - Live Skills Search & Highlight
   - Dark / Light Mode Switcher with LocalStorage
   - Smooth Scroll Spy & Scroll-to-Top
   - Copy to Clipboard with Toast Notification
   - Interactive Contact Form
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCanvas();
  initTypewriter();
  initNav();
  initHeroTabs();
  initSkillSearch();
  initProjectFilter();
  initProjectModals();
  initResumeModal();
  initClipboardAndContact();
  initScrollTop();
  initGitHubRepos();
  initAIAssistant();
  initContactForm();
});

/* ===================================================================
   1. THEME SWITCHER (DARK / LIGHT)
   =================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  // Check persisted preference or system preference
  const savedTheme = localStorage.getItem('portfolio-theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeIcon) {
        // Moon icon for switching back to dark
        themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) {
        // Sun icon for switching to light
        themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
      }
    }
  }
}

/* ===================================================================
   2. INTERACTIVE PARTICLES CANVAS
   =================================================================== */
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  let particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 16000), 75);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
    }

    draw() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.fillStyle = isLight ? 'rgba(37, 99, 235, 0.4)' : 'rgba(56, 189, 248, 0.6)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interactive reaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = dx / distance;
          const directionY = dy / distance;
          this.x -= directionX * force * 2;
          this.y -= directionY * force * 2;
        }
      }
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const lineColor = isLight ? '37, 99, 235' : '56, 189, 248';

    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          const opacity = (1 - distance / 110) * 0.22;
          ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }

      // Connect with mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[a].x - mouse.x;
        const dy = particles[a].y - mouse.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < mouse.radius) {
          const opacity = (1 - distToMouse / mouse.radius) * 0.35;
          ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  createParticles();
  animate();
}

/* ===================================================================
   3. DYNAMIC TYPEWRITER EFFECT
   =================================================================== */
function initTypewriter() {
  const typingElement = document.getElementById('typed-text');
  if (!typingElement) return;

  const words = [
    'Full Stack Web Developer',
    'MERN Stack Specialist',
    'Java & Backend Enthusiast',
    'Google Student Ambassador'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ===================================================================
   4. NAVIGATION & SCROLL SPY
   =================================================================== */
function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll navbar shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Spy active state
    let scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });

  // Mobile menu toggle
  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });

    mobileNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }
}

/* ===================================================================
   HERO TABS (PORTRAIT VS CODE CONFIG)
   =================================================================== */
function initHeroTabs() {
  const photoBtn = document.getElementById('hero-tab-photo-btn');
  const codeBtn = document.getElementById('hero-tab-code-btn');
  const photoView = document.getElementById('hero-photo-view');
  const codeView = document.getElementById('hero-code-view');

  if (!photoBtn || !codeBtn || !photoView || !codeView) return;

  photoBtn.addEventListener('click', () => {
    photoBtn.classList.add('active');
    codeBtn.classList.remove('active');
    photoView.style.display = 'flex';
    codeView.style.display = 'none';
  });

  codeBtn.addEventListener('click', () => {
    codeBtn.classList.add('active');
    photoBtn.classList.remove('active');
    photoView.style.display = 'none';
    codeView.style.display = 'block';
  });
}

/* ===================================================================
   5. LIVE SKILL SEARCH & HIGHLIGHT
   =================================================================== */
function initSkillSearch() {
  const searchInput = document.getElementById('skill-search-input');
  if (!searchInput) return;

  const skillPills = document.querySelectorAll('.skill-pill');
  const categoryCards = document.querySelectorAll('.skill-category-card');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
      skillPills.forEach((pill) => pill.classList.remove('highlight'));
      categoryCards.forEach((card) => (card.style.opacity = '1'));
      return;
    }

    categoryCards.forEach((card) => {
      let cardHasMatch = false;
      const pillsInCard = card.querySelectorAll('.skill-pill');

      pillsInCard.forEach((pill) => {
        const text = pill.textContent.toLowerCase();
        if (text.includes(query)) {
          pill.classList.add('highlight');
          cardHasMatch = true;
        } else {
          pill.classList.remove('highlight');
        }
      });

      card.style.opacity = cardHasMatch ? '1' : '0.35';
    });
  });
}

/* ===================================================================
   6. PROJECTS FILTER
   =================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ===================================================================
   7. PROJECT DEEP DIVE MODAL
   =================================================================== */
const projectDetails = {
  compensation: {
    title: 'Compensation Intelligence System',
    badge: 'Full Stack Analytics Platform',
    stack: ['TypeScript', 'React', 'Tailwind CSS', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma ORM', 'JWT'],
    overview: 'An enterprise-grade salary and compensation intelligence platform that enables verified corporate employees to anonymously submit compensation structures, benchmark salaries against industry percentiles, and analyze compensation equity across companies and levels.',
    keyFeatures: [
      'Comprehensive Total Compensation (TC) calculation engine factoring base pay, bonuses, stock grants (RSU/ESOP vesting), and signing bonuses.',
      'Robust validation and data normalization pipelines to eliminate salary reporting anomalies and skew.',
      'REST APIs engineered with Node.js and Prisma ORM for relational queries on PostgreSQL.',
      'Interactive visual dashboard modules showing salary bands, percentile graphs, and level progression benchmarks.',
      'Role-based access control (RBAC) and JWT authentication with token refresh for data privacy and moderation.'
    ],
    architecture: 'Built on a decoupled client-server architecture with React SPA frontend utilizing Tailwind CSS for responsive analytics interfaces. The backend runs on Express with PostgreSQL managed through Prisma ORM for type-safe database queries and automated schema migrations.',
    github: 'https://github.com/MATHIYAZHAGN21/Compensation-intelligence-System'
  },
  skillbridge: {
    title: 'UH SkillBridge – Peer Mentorship Platform',
    badge: 'MERN Stack Community Platform',
    stack: ['React', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'REST API'],
    overview: 'A scalable end-to-end peer mentorship platform designed for universities and coding communities, facilitating 1:1 mentor-mentee matching, real-time scheduling, session lifecycle tracking, and verified reviews.',
    keyFeatures: [
      'Engineered an intelligent Mentor Matching System using a weighted scoring algorithm taking into account technical skill overlaps, domain targets, preferred language, and career goals.',
      'Session Lifecycle Management: Booking slots, status state-machine (Requested, Scheduled, Completed, Cancelled), mentor session notes, and feedback records.',
      'Dynamic running-average rating and review computation that recalculates mentor credibility scores after each session.',
      'Secure role-based authentication separating Mentors, Mentees, and Community Administrators.',
      'Comprehensive Admin Dashboard for platform moderation, report tracking, and user activity surveillance.'
    ],
    architecture: 'Full MERN stack deployment with MongoDB document schemas for flexible session metadata, Express REST endpoints with JWT middleware, and React frontend with reactive state for real-time schedule booking.',
    github: 'https://github.com/MATHIYAZHAGN21/UH-SkillBridge'
  },
  ecommerce: {
    title: 'VP-Ecommerce Platform (with Razorpay)',
    badge: 'Full Stack MERN Platform',
    stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Razorpay API', 'JWT', 'Tailwind CSS'],
    overview: 'A full-featured production e-commerce platform built with the MERN stack featuring secure Razorpay payment integration, product management, real-time cart state, and order tracking workflows.',
    keyFeatures: [
      'Seamless Razorpay Payment Gateway integration with payment verification and digital receipt generation.',
      'End-to-end product CRUD management with category filters, image gallery, and inventory tracking.',
      'Persistent shopping cart and checkout order processing workflows.',
      'Admin moderation dashboard for managing product catalogs, updating order delivery states, and viewing sales metrics.',
      'JWT-authenticated customer accounts with order history and profile management.'
    ],
    architecture: 'Decoupled MERN stack with Express server managing RESTful endpoints and Razorpay webhook events, backed by MongoDB Atlas and a responsive React client.',
    github: 'https://github.com/MATHIYAZHAGN21/VP-E-commerce'
  },
  expensetracker: {
    title: 'Expense Tracker & Finance Manager',
    badge: 'React & Vite Application',
    stack: ['React.js', 'Vite', 'Tailwind CSS', 'LocalStorage API', 'JavaScript (ES6+)'],
    overview: 'A sleek personal finance management tool that allows users to record, categorize, and visually monitor daily income and expenditures with persistent local storage.',
    keyFeatures: [
      'Real-time balance calculation with automatic income vs expense tabulation.',
      'Category-based spending breakdown (Food, Entertainment, Bills, Utilities).',
      'Dynamic transaction history with instant search, filter, and deletion features.',
      'Zero-latency UI updates powered by Vite and modular React state hooks.',
      'Mobile-responsive layout engineered with Tailwind CSS utility classes.'
    ],
    architecture: 'Modern React SPA built with Vite for sub-millisecond hot module replacement, utilizing structured React state and browser LocalStorage serialization.',
    github: 'https://github.com/MATHIYAZHAGN21/Expense-Tracker-'
  },
  productivity: {
    title: 'Personal Productivity Suite',
    badge: 'All-in-One Productivity Dashboard',
    stack: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'LocalStorage API', 'Audio Web API'],
    overview: 'A modular productivity suite unifying daily task management, an interactive Pomodoro focus timer, daily goals tracking, and quick note scratchpads into a single unified interface.',
    keyFeatures: [
      'Customizable Pomodoro timer with work/break interval cycles and audio alerts.',
      'Integrated daily priority checklist with completion tracking and progress bars.',
      'Quick-capture scratchpad with instantaneous local storage synchronization.',
      'Distraction-free dark mode interface tailored for engineering focus.',
      'Keyboard shortcuts for fast task entry and timer controls.'
    ],
    architecture: 'Vanilla JavaScript component architecture utilizing event delegation, DOM manipulation patterns, and localStorage persistence.',
    github: 'https://github.com/MATHIYAZHAGN21/Personal-Productivity-suite'
  },
  prepplatform: {
    title: 'Prep-Platform – Technical Interview Hub',
    badge: 'Computer Science Education Portal',
    stack: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Data Structures', 'Algorithms'],
    overview: 'A dedicated interview preparation resource hub designed for computer science students to revise core topics, practice coding patterns, and prepare for technical interviews.',
    keyFeatures: [
      'Structured learning pathways across Data Structures, Algorithms, OOP, and DBMS.',
      'Interactive topic-wise revision modules with code snippet explanations.',
      'Self-assessment checklist to track topic readiness and confidence levels.',
      'Clean typography and distraction-free dark interface for long study sessions.'
    ],
    architecture: 'Modular client-side web application structured around clean HTML5 semantic sections and reactive vanilla JavaScript UI controllers.',
    github: 'https://github.com/MATHIYAZHAGN21/Perp-Platform'
  },
  fitness: {
    title: 'Fitness & Diet Planner Platform',
    badge: 'Health & Nutrition Web App',
    stack: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Health Algorithms'],
    overview: 'A health and nutrition application that calculates daily caloric targets, macronutrient distributions, and provides personalized diet and workout schedules.',
    keyFeatures: [
      'BMR and TDEE calorie estimation based on user age, weight, height, and activity level.',
      'Targeted macro split calculations for weight loss, maintenance, or muscle gain.',
      'Weekly workout routine template with progressive exercise schedules.',
      'Interactive health assessment form with real-time result calculations.'
    ],
    architecture: 'Engineered with mathematical nutrition formulas wrapped in clean JavaScript functions and dynamic DOM rendering.',
    github: 'https://github.com/MATHIYAZHAGN21/Fitness_Diet_Planner_Project'
  },
  mentorbooking: {
    title: 'Mentor Booking Portal',
    badge: 'Scheduling System',
    stack: ['JavaScript', 'HTML5', 'CSS3', 'DOM State Machine', 'Form Validation'],
    overview: 'A dedicated consultation scheduling system that allows users to discover mentors, browse availability by date and time, and book 1-on-1 mentorship sessions.',
    keyFeatures: [
      'Interactive date and time slot selector with conflict prevention validation.',
      'Mentor profile cards showing expertise, rating, and discussion topics.',
      'Booking request generation with immediate confirmation summary modal.',
      'Form validation preventing past dates and unselected time slots.'
    ],
    architecture: 'Client-side booking workflow utilizing state-machine UI transitions and reactive form validation.',
    github: 'https://github.com/MATHIYAZHAGN21/mentor-booking'
  },
  quiz: {
    title: 'Interactive Quiz Application',
    badge: 'Interactive Web Assessment',
    stack: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Timer Web API'],
    overview: 'A fast-paced interactive quiz web application with multiple-choice questions, live countdown timer, instant feedback, and final score breakdowns.',
    keyFeatures: [
      'Live per-question countdown timer with auto-advance on timeout.',
      'Instant color-coded feedback indicating correct and incorrect choices.',
      'Dynamic score calculation and end-of-quiz performance review.',
      'Smooth CSS micro-interactions and mobile-friendly touch targets.'
    ],
    architecture: 'Object-oriented JavaScript quiz engine handling question array cycling, timer intervals, and state evaluation.',
    github: 'https://github.com/MATHIYAZHAGN21/quiz'
  },
  todolist: {
    title: 'Smart Task & To-Do Manager',
    badge: 'Task Management Utility',
    stack: ['JavaScript', 'HTML5', 'CSS3', 'LocalStorage API'],
    overview: 'A clean and efficient task organizer enabling users to add, edit, filter, and track daily tasks with persistent browser memory.',
    keyFeatures: [
      'Real-time task addition, completion toggling, and item deletion.',
      'Filter views by All, Active, and Completed tasks.',
      'LocalStorage persistence ensuring tasks remain intact across reloads.',
      'Clean modern interface with satisfying completion strike-through effects.'
    ],
    architecture: 'Lightweight client-side script with event listeners and JSON serialization to HTML5 localStorage.',
    github: 'https://github.com/MATHIYAZHAGN21/To-do-list'
  },
  calculator: {
    title: 'Modern Glassmorphic Calculator',
    badge: 'Web Utility Tool',
    stack: ['HTML5', 'CSS3 Glassmorphism', 'JavaScript (ES6+)'],
    overview: 'A beautifully designed web calculator with frosted glass styling, keyboard input listening, and precise arithmetic expression evaluation.',
    keyFeatures: [
      'Chained mathematical operations (+, -, *, /) with decimal support.',
      'Full physical keyboard event listener support (Numbers, Enter, Backspace, Esc).',
      'Display overflow protection and error handling for invalid operations (e.g., divide by zero).',
      'Modern glassmorphism UI with subtle shadows and gradient highlights.'
    ],
    architecture: 'Functional evaluation logic using JavaScript string parsing and mathematical state trackers.',
    github: 'https://github.com/MATHIYAZHAGN21/Modern-Calculator'
  },
  leaveform: {
    title: 'Leave Application & Management Portal',
    badge: 'Workflow Form System',
    stack: ['JavaScript', 'HTML5', 'CSS3', 'Validation Logic'],
    overview: 'A formal leave application system designed for institutional and corporate workflows, featuring date range verification and structured request submission.',
    keyFeatures: [
      'Date range validation ensuring start date precedes end date with automatic day calculation.',
      'Categorized leave types (Medical, Casual, Academic, Emergency).',
      'Input validation for contact numbers, emergency details, and reason text.',
      'Interactive submission modal with summary breakdown and confirmation alert.'
    ],
    architecture: 'Form-driven web module with comprehensive client-side regex and date object validation.',
    github: 'https://github.com/MATHIYAZHAGN21/Leave-Form'
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-project-title');
  const modalBadge = document.getElementById('modal-project-badge');
  const modalStack = document.getElementById('modal-project-stack');
  const modalOverview = document.getElementById('modal-project-overview');
  const modalFeatures = document.getElementById('modal-project-features');
  const modalArch = document.getElementById('modal-project-arch');
  const modalGithub = document.getElementById('modal-project-github');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modalOverlay) return;

  document.querySelectorAll('.open-project-modal').forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const data = projectDetails[projectId];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalBadge.textContent = data.badge;
      modalOverview.textContent = data.overview;
      modalArch.textContent = data.architecture;
      modalGithub.href = data.github;

      // Render stack pills
      modalStack.innerHTML = data.stack
        .map((tech) => `<span class="stack-tag">${tech}</span>`)
        .join('');

      // Render features
      modalFeatures.innerHTML = data.keyFeatures
        .map(
          (feat) => `<li class="project-highlight-item" style="margin-bottom: 0.5rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${feat}</span>
          </li>`
        )
        .join('');

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ===================================================================
   8. PRINTABLE ATS RESUME MODAL & INSTANT PRINT
   =================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const openBtns = document.querySelectorAll('.open-resume-modal');
  const closeBtn = document.getElementById('resume-modal-close-btn');
  const printBtn = document.getElementById('resume-print-btn');

  if (!resumeModal) return;

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeResume() {
    resumeModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeResume);
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ===================================================================
   9. CLIPBOARD COPY, TOASTS & CONTACT FORM
   =================================================================== */
function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--accent-cyan);"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function initClipboardAndContact() {
  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: "${textToCopy}"`);
        }).catch(() => {
          showToast(`Selected: ${textToCopy}`);
        });
      }
    });
  });

  // Contact form submission handler
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      // Construct mailto link
      const mailtoLink = `mailto:smathiyazhaganmathivishnu@gmail.com?subject=${encodeURIComponent(
        `[Portfolio Inquiry] ${subject}`
      )}&body=${encodeURIComponent(
        `Hi Mathiyazhagan,\n\nMy name is ${name} (${email}).\n\n${message}`
      )}`;

      showToast('Opening your email client to send message...');
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 700);

      contactForm.reset();
    });
  }
}

/* ===================================================================
   10. SCROLL TO TOP BUTTON
   =================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
