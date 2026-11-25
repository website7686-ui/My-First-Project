/**
 * ==========================================================================
 * PORTFOLIO MAIN JAVASCRIPT (DAY 2 THROUGH DAY 7)
 * ==========================================================================
 * Includes:
 * 1. Preloader dismissal on window load & DOM removal
 * 2. Navbar transparency toggle after scrolling 50px
 * 3. IntersectionObserver active link highlighting
 * 4. Mobile slide-in menu toggle & outside-click/escape close
 * 5. Smooth scrolling with header offset compensation
 * 6. Contact form validation and Formspree submission
 * 7. About counters and skill progress animations
 * 8. Project category filters
 * 9. Timeline progress and contact form validation
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. PRELOADER HANDLER
// --------------------------------------------------------------------------
const initPreloader = () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const dismissPreloader = () => {
    if (preloader.classList.contains('fade-out')) return;
    preloader.classList.add('fade-out');

    // Remove completely from the DOM after the CSS fade transition finishes
    setTimeout(() => {
      if (preloader.parentNode) {
        preloader.remove();
      }
    }, 650);
  };

  // Dismiss only after all assets, styles, and fonts finish loading.
  if (document.readyState === 'complete') {
    dismissPreloader();
  } else {
    window.addEventListener('load', dismissPreloader, { once: true });
  }
};

initPreloader();

// --------------------------------------------------------------------------
// MAIN DOM INITIALIZATION
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Element Selectors ---
  const header = document.querySelector('.header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  // ------------------------------------------------------------------------
  // 2. NAVBAR SCROLL EFFECT (TRANSPARENT -> BLURRED DARK BACKGROUND)
  // ------------------------------------------------------------------------
  const handleNavbarScroll = () => {
    if (!header) return;
    // Add blurred dark background and shadow after scrolling 50px
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  // Run immediately on page load in case page is refreshed midway
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ------------------------------------------------------------------------
  // 3. INTERSECTION OBSERVER FOR ACTIVE NAVBAR LINK HIGHLIGHTING
  // ------------------------------------------------------------------------
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      // Target area in the middle-top portion of viewport
      rootMargin: '-25% 0px -65% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ------------------------------------------------------------------------
  // 4. MOBILE SLIDE-IN MENU & HAMBURGER TOGGLE
  // ------------------------------------------------------------------------
  const openMobileMenu = () => {
    if (!navToggle || !navMenu) return;
    navToggle.classList.add('is-active');
    navMenu.classList.add('is-active');
    if (navOverlay) navOverlay.classList.add('is-active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeMobileMenu = () => {
    if (!navToggle || !navMenu) return;
    const shouldRestoreFocus = navMenu.contains(document.activeElement);
    navToggle.classList.remove('is-active');
    navMenu.classList.remove('is-active');
    if (navOverlay) navOverlay.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (shouldRestoreFocus) navToggle.focus();
  };

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navToggle.classList.contains('is-active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Close when overlay is clicked
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close when pressing the Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('is-active')) {
      closeMobileMenu();
    }
  });

  // Close when any navigation link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // ------------------------------------------------------------------------
  // 5. SMOOTH SCROLLING FOR ALL NAV LINKS & IN-PAGE ANCHORS
  // ------------------------------------------------------------------------
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Calculate header height dynamically
        const headerEl = document.querySelector('.header');
        const headerHeight = headerEl ? headerEl.offsetHeight : 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

});

// --------------------------------------------------------------------------
// DAY 3: ABOUT COUNTERS AND SKILL PROGRESS
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animateInteger = (target, onUpdate, duration = 1400) => {
    if (reducedMotion) {
      onUpdate(target);
      return;
    }

    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      onUpdate(Math.round(target * easedProgress));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  // Start all About counters once when the About section first enters view.
  const aboutSection = document.getElementById('about');
  const counters = document.querySelectorAll('#about [data-counter]');
  const startCounters = () => {
    counters.forEach((counter) => {
      const target = Number(counter.dataset.target);
      if (!Number.isFinite(target) || target < 0) return;

      animateInteger(target, (value) => {
        counter.textContent = value.toLocaleString('en-US');
      }, 1700);
    });
  };

  if (counters.length > 0) {
    if ('IntersectionObserver' in window && aboutSection) {
      const counterObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startCounters();
          counterObserver.disconnect();
        }
      }, { threshold: 0 });
      counterObserver.observe(aboutSection);
    } else {
      startCounters();
    }
  }

  // Animate each skill row only once as it becomes visible.
  const skillItems = document.querySelectorAll('#skills .skill-progress-item');
  const startSkillProgress = (item) => {
    if (item.dataset.animated === 'true') return;

    const target = Number(item.dataset.progress);
    if (!Number.isFinite(target) || target < 0 || target > 100) return;

    const valueElement = item.querySelector('.skill-progress-value');
    const progressTrack = item.querySelector('.skill-progress-track');
    const progressBar = item.querySelector('.skill-progress-bar');
    if (!valueElement || !progressTrack || !progressBar) return;

    item.dataset.animated = 'true';
    progressBar.style.width = `${target}%`;
    progressBar.classList.add('is-filled');
    animateInteger(target, (value) => {
      valueElement.textContent = String(value);
      progressTrack.setAttribute('aria-valuenow', String(value));
    });
  };

  if (skillItems.length > 0) {
    if ('IntersectionObserver' in window) {
      const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startSkillProgress(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      skillItems.forEach((item) => skillObserver.observe(item));
    } else {
      skillItems.forEach(startSkillProgress);
    }
  }
});

// --------------------------------------------------------------------------
// DAY 4: PROJECT CATEGORY FILTERS
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');
  if (filterButtons.length === 0 || projectCards.length === 0) return;

  const pendingHides = new WeakMap();
  const transitionDuration = 320;
  let filterRun = 0;

  const applyProjectFilter = (category) => {
    filterRun += 1;
    const currentRun = filterRun;

    projectCards.forEach((card) => {
      const pendingHide = pendingHides.get(card);
      if (pendingHide) {
        window.clearTimeout(pendingHide);
        pendingHides.delete(card);
      }

      const shouldShow = category === 'all' || card.dataset.category === category;
      if (shouldShow) {
        card.setAttribute('aria-hidden', 'false');
        card.removeAttribute('inert');

        if (card.hidden) {
          card.hidden = false;
          card.classList.add('is-filtered-out');
          requestAnimationFrame(() => {
            if (currentRun === filterRun) {
              card.classList.remove('is-filtered-out');
            }
          });
        } else {
          card.classList.remove('is-filtered-out');
        }
        return;
      }

      card.setAttribute('aria-hidden', 'true');
      card.setAttribute('inert', '');
      card.classList.add('is-filtered-out');

      const hideTimer = window.setTimeout(() => {
        if (card.classList.contains('is-filtered-out')) {
          card.hidden = true;
        }
      }, transitionDuration);
      pendingHides.set(card, hideTimer);
    });

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === category;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyProjectFilter(button.dataset.filter);
    });
  });

  // Keep placeholder demo and repository links from jumping to the page top.
  document.querySelectorAll('.project-links a[href="#"]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });
});

// --------------------------------------------------------------------------
// DAY 5 & 7: TIMELINE PROGRESS, CONTACT VALIDATION, AND FORMSPREE
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Fill the timeline line proportionally as it moves through the viewport.
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    let progressFrame = null;
    const updateTimelineProgress = () => {
      if (progressFrame !== null) return;

      progressFrame = requestAnimationFrame(() => {
        progressFrame = null;
        const bounds = timeline.getBoundingClientRect();
        const scrollRange = window.innerHeight + bounds.height;
        const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / scrollRange));
        timeline.style.setProperty('--timeline-progress', `${progress * 100}%`);
      });
    };

    updateTimelineProgress();
    window.addEventListener('scroll', updateTimelineProgress, { passive: true });
    window.addEventListener('resize', updateTimelineProgress);
  }

  const form = document.getElementById('contactForm');
  if (!form) return;

  const MIN_MESSAGE_LENGTH = 20;
  const fields = Array.from(form.querySelectorAll('input[required], textarea[required]'));
  const submitButton = form.querySelector('.contact-submit');
  const submitLabel = form.querySelector('.submit-label');
  const submitIcon = form.querySelector('.submit-icon');
  const status = form.querySelector('#formStatus');
  let isSubmitting = false;
  let isSuccess = false;

  const setStatus = (message, type = '') => {
    status.textContent = message;
    status.hidden = !message;
    status.classList.toggle('is-success', type === 'success');
    status.classList.toggle('is-error', type === 'error');
  };

  const validateField = (field) => {
    const value = field.value.trim();
    let error = '';

    if (!value) {
      error = 'This field is required.';
    } else if (field.type === 'email' && field.validity.typeMismatch) {
      error = 'Enter a valid email address.';
    } else if (field.name === 'message' && value.length < MIN_MESSAGE_LENGTH) {
      error = `Please enter at least ${MIN_MESSAGE_LENGTH} characters.`;
    }

    const errorElement = document.getElementById(`${field.id}Error`);
    field.setAttribute('aria-invalid', String(Boolean(error)));
    field.classList.toggle('is-invalid', Boolean(error));
    if (errorElement) errorElement.textContent = error;
    return error === '';
  };

  const clearSuccessState = () => {
    if (!isSuccess) return;

    isSuccess = false;
    submitButton.disabled = false;
    submitButton.classList.remove('is-success');
    submitLabel.textContent = 'Send Message';
    submitIcon.classList.remove('fa-solid', 'fa-check');
    submitIcon.classList.add('fa-regular', 'fa-paper-plane');
    setStatus('');
  };

  fields.forEach((field) => {
    field.addEventListener('blur', () => {
      field.dataset.touched = 'true';
      validateField(field);
    });

    field.addEventListener('input', () => {
      clearSuccessState();
      if (field.dataset.touched === 'true' || field.value.length > 0) {
        field.dataset.touched = 'true';
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const firstInvalidField = fields.find((field) => {
      field.dataset.touched = 'true';
      return !validateField(field);
    });

    if (firstInvalidField) {
      firstInvalidField.focus();
      return;
    }

    const endpoint = form.getAttribute('action') || '';
    if (endpoint.includes('YOUR_FORM_ID')) {
      setStatus('Formspree is not configured yet. Replace YOUR_FORM_ID to enable message delivery.', 'error');
      return;
    }

    const formData = new FormData(form);
    isSubmitting = true;
    setStatus('');
    submitButton.disabled = true;
    submitButton.classList.add('is-loading');
    submitLabel.textContent = 'Sending...';
    fields.forEach((field) => {
      field.disabled = true;
    });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        setStatus(`Message could not be sent (HTTP ${response.status}). Please try again.`, 'error');
        return;
      }

      fields.forEach((field) => {
        field.dataset.touched = 'false';
        field.setAttribute('aria-invalid', 'false');
        field.classList.remove('is-invalid');
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) errorElement.textContent = '';
      });
      form.reset();

      isSuccess = true;
      submitButton.classList.add('is-success');
      submitLabel.textContent = 'Message Sent!';
      submitIcon.classList.remove('fa-regular', 'fa-paper-plane');
      submitIcon.classList.add('fa-solid', 'fa-check');
      setStatus('Thanks! Your message has been sent.', 'success');
    } catch (error) {
      console.error('Formspree contact submission failed.', error);
      setStatus('We could not connect to the message service. Please try again.', 'error');
    } finally {
      isSubmitting = false;
      submitButton.classList.remove('is-loading');
      fields.forEach((field) => {
        field.disabled = false;
      });

      if (!isSuccess) {
        submitButton.disabled = false;
        submitLabel.textContent = 'Send Message';
      }
    }
  });
});
