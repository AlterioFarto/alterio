/* ============================================
   Farhan Hasan - Portfolio Scripts
   Modern UI Interactions | Animations | UX
   ============================================ */

(function () {
  'use strict';

  /* ==========================================
     DOM CACHE
     ========================================== */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];
  const doc = document;
  const body = doc.body;

  /* ==========================================
     LOADING SCREEN
     ========================================== */
  const loader = $('#loader');
  if (loader) {
    doc.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => loader.classList.add('hidden'), 300);
    });
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 100);
    });
  }

  /* ==========================================
     SCROLL PROGRESS BAR
     ========================================== */
  const progressBar = $('#scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = doc.documentElement.scrollTop || body.scrollTop;
      const scrollHeight = doc.documentElement.scrollHeight - doc.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
      progressBar.setAttribute('aria-valuenow', Math.round(progress));
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ==========================================
     CUSTOM CURSOR (Desktop only)
     ========================================== */
  const cursorDot = $('#cursor-dot');
  const cursorRing = $('#cursor-ring');

  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (cursorDot && cursorRing && !isTouchDevice()) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX, dotY = mouseY;
    let ringX = mouseX, ringY = mouseY;
    let cursorActive = false;

    // Initialize cursor position at center
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';

    const activateCursor = () => {
      if (cursorActive) return;
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '0.4';
      body.classList.add('cursor-active');
      cursorActive = true;
    };

    const deactivateCursor = () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      body.classList.remove('cursor-active');
      cursorActive = false;
    };

    // Show instantly on first touch so it's never missing
    activateCursor();

    doc.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorActive) activateCursor();
    });

    doc.addEventListener('mouseleave', deactivateCursor);
    doc.addEventListener('mouseenter', () => { if (!cursorActive) activateCursor(); });

    // Smooth cursor follow
    const animateCursor = () => {
      dotX += (mouseX - dotX) * 0.2;
      dotY += (mouseY - dotY) * 0.2;
      ringX += (mouseX - ringX) * 0.08;
      ringY += (mouseY - ringY) * 0.08;

      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';

      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover ring expansion
    doc.addEventListener('mouseover', (e) => {
      const t = e.target;
      const isInteractive = t.matches('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
        || t.closest('a, button, .service-card, .skill-badge, .project-card, .contact-info-card');
      cursorRing.classList.toggle('active', !!isInteractive);
    });
  } else {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  }

  /* ==========================================
     NAVIGATION
     ========================================== */
  const navbar = $('.navbar');
  const navLinks = $('#nav-links');
  const mobileBtn = $('#mobile-menu-btn');

  // Scroll effect: transparent -> solid
  const handleNavScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile menu toggle
  if (mobileBtn && navLinks) {
    // Create overlay
    const overlay = doc.createElement('div');
    overlay.className = 'nav-overlay';
    body.appendChild(overlay);

    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', isOpen);
      mobileBtn.classList.toggle('active', isOpen);
      overlay.classList.toggle('active', isOpen);
      mobileBtn.setAttribute('aria-expanded', isOpen);
      body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileBtn.addEventListener('click', () => toggleMenu());

    // Close on overlay click
    overlay.addEventListener('click', () => toggleMenu(false));

    // Close on escape
    doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMenu(false);
    });

    // Close on nav link click
    $$('#nav-links .nav-link').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Handle resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) toggleMenu(false);
    });
  }

  /* ==========================================
     ACTIVE SECTION HIGHLIGHTING
     ========================================== */
  const allNavLinks = $$('.nav-link');
  const sections = $$('.section[id]');

  const updateActiveSection = () => {
    let current = '';
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  };

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();

  /* ==========================================
     SMOOTH ANCHOR SCROLLING
     ========================================== */
  doc.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = doc.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(doc.documentElement).scrollPaddingTop) || 72;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  });

  /* ==========================================
     SCROLL REVEAL (Intersection Observer)
     ========================================== */
  const revealElements = $$('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ==========================================
     ANIMATED COUNTERS
     ========================================== */
  const statNumbers = $$('.stat-number');

  if (statNumbers.length && 'IntersectionObserver' in window) {
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            animateCounters();
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsSection = $('#stats');
    if (statsSection) counterObserver.observe(statsSection);

    function animateCounters() {
      statNumbers.forEach(counter => {
        const target = parseInt(counter.dataset.target) || 0;
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out quad
          const eased = 1 - (1 - progress) * (1 - progress);
          const current = Math.floor(eased * target);

          counter.textContent = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString();
          }
        };

        requestAnimationFrame(updateCounter);
      });
    }
  }

  /* ==========================================
     SKILL BADGE ANIMATION
     ========================================== */
  const skillBadges = $$('.skill-badge');

  if (skillBadges.length && 'IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    skillBadges.forEach(badge => skillObserver.observe(badge));
  }

  /* ==========================================
     TYPING EFFECT (Hero)
     ========================================== */
  const typedEl = $('#typed-text');
  if (typedEl) {
    const words = ['Web Designer', 'Web Developer', 'UI/UX Enthusiast', 'Problem Solver'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeTimeout;

    const typeEffect = () => {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typedEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeTimeout = setTimeout(typeEffect, 2000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeTimeout = setTimeout(typeEffect, 500);
      } else {
        typeTimeout = setTimeout(typeEffect, isDeleting ? 40 : 80);
      }
    };

    typeEffect();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (typeTimeout) clearTimeout(typeTimeout);
    });
  }

  /* ==========================================
     CONTACT FORM
     ========================================== */
  const contactForm = $('#contact-form');
  if (contactForm) {
    const nameInput = $('#name');
    const emailInput = $('#email');
    const messageInput = $('#message');

    const showError = (input, message) => {
      const errorEl = input.parentElement.querySelector('.form-error');
      input.classList.add('error');
      if (errorEl) errorEl.textContent = message;
    };

    const clearError = (input) => {
      const errorEl = input.parentElement.querySelector('.form-error');
      input.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
    };

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Real-time validation on blur
    nameInput.addEventListener('blur', () => {
      if (!nameInput.value.trim()) showError(nameInput, 'Name is required');
      else clearError(nameInput);
    });

    emailInput.addEventListener('blur', () => {
      if (!emailInput.value.trim()) showError(emailInput, 'Email is required');
      else if (!validateEmail(emailInput.value)) showError(emailInput, 'Please enter a valid email');
      else clearError(emailInput);
    });

    messageInput.addEventListener('blur', () => {
      if (!messageInput.value.trim()) showError(messageInput, 'Message is required');
      else clearError(messageInput);
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;

      if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required');
        valid = false;
      } else {
        clearError(nameInput);
      }

      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required');
        valid = false;
      } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email');
        valid = false;
      } else {
        clearError(emailInput);
      }

      if (!messageInput.value.trim()) {
        showError(messageInput, 'Message is required');
        valid = false;
      } else {
        clearError(messageInput);
      }

      if (!valid) return;

      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner"><circle cx="12" cy="12" r="10" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Sending...';

      // Simulate send (replace with actual form action)
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Show success state
        contactForm.reset();
        const successMsg = doc.createElement('div');
        successMsg.className = 'form-success';
        successMsg.style.cssText = 'padding: 12px 16px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 8px; color: #22c55e; font-weight: 500; margin-top: 16px; text-align: center;';
        successMsg.textContent = 'Message sent successfully! I\'ll get back to you soon.';

        const existing = contactForm.querySelector('.form-success');
        if (existing) existing.remove();

        contactForm.appendChild(successMsg);

        setTimeout(() => {
          if (successMsg.parentNode) successMsg.remove();
        }, 5000);
      }, 1500);
    });
  }

  /* ==========================================
     FOOTER YEAR
     ========================================== */
  const footerYear = $('#footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /* ==========================================
     PARALLAX HERO (subtle mouse effect)
     ========================================== */
  const heroImageWrapper = $('.hero-image-wrapper');
  if (heroImageWrapper && !isTouchDevice()) {
    doc.addEventListener('mousemove', (e) => {
      const rect = heroImageWrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;

      heroImageWrapper.style.transform =
        `perspective(600px) rotateY(${deltaX * 8}deg) rotateX(${-deltaY * 8}deg)`;
    });

    doc.addEventListener('mouseleave', () => {
      heroImageWrapper.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
    });
  }

})();
