/**
 * ==========================================================================
 * PORTFOLIO ANIMATIONS JAVASCRIPT (DAY 2 THROUGH DAY 7)
 * ==========================================================================
 * Includes:
 * 1. Vanilla JavaScript Typewriter Effect
 *    Cycles smoothly through:
 *    - "E-commerce Expert"
 *    - "Digital Marketer"
 *    - "Shopify Specialist"
 *    - "Full-Stack Developer"
 * 2. Reusable IntersectionObserver scroll reveals
 * 3. Optional pointer tilt for service cards
 * 4. Vanilla JavaScript testimonial slider
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. VANILLA JS TYPEWRITER EFFECT
  // ------------------------------------------------------------------------
  const typingElement = document.getElementById('typingText');

  if (typingElement) {
    // Exact phrases requested for the hero cycling effect
    const phrases = [
      'E-commerce Expert',
      'Digital Marketer',
      'Shopify Specialist',
      'Full-Stack Developer'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimer = null;

    // Timing configurations (in milliseconds)
    const TYPE_SPEED = 90;       // Speed when typing characters
    const DELETE_SPEED = 45;     // Speed when backspacing
    const PAUSE_END = 1800;      // Pause when full phrase is completed
    const PAUSE_START = 400;     // Pause before typing next phrase

    const typeCycle = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        // Remove one character
        charIndex--;
        typingElement.textContent = currentPhrase.substring(0, charIndex);
      } else {
        // Add one character
        charIndex++;
        typingElement.textContent = currentPhrase.substring(0, charIndex);
      }

      // Default timeout for next step
      let timeoutDelay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

      // When the phrase is completely typed out
      if (!isDeleting && charIndex === currentPhrase.length) {
        timeoutDelay = PAUSE_END;
        isDeleting = true;
      }
      // When the phrase has been completely erased
      else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timeoutDelay = PAUSE_START;
      }

      typingTimer = setTimeout(typeCycle, timeoutDelay);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      typingElement.textContent = phrases[0];
    } else {
      // Start after a brief initial delay matching the hero entrance.
      setTimeout(typeCycle, 600);

      // Pause the timer while hidden to prevent background work and drift.
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          clearTimeout(typingTimer);
        } else {
          typeCycle();
        }
      });
    }
  }

  // ------------------------------------------------------------------------
  // DAY 5: TESTIMONIAL SLIDER
  // ------------------------------------------------------------------------
  const initializeTestimonialSlider = () => {
      'use strict';

      const slider = document.getElementById('testimonialSlider');
      if (!slider) return;

      const track = slider.querySelector('.testimonial-track');
      const slides = Array.from(slider.querySelectorAll('.testimonial-card'));
      const dots = Array.from(slider.querySelectorAll('.testimonial-dot'));
      const previousButton = slider.querySelector('[data-testimonial-direction="previous"]');
      const nextButton = slider.querySelector('[data-testimonial-direction="next"]');
      if (!track || slides.length === 0) return;

      let activeIndex = 0;
      let autoplayTimer = null;
      let touchStartX = null;

      const showSlide = (index) => {
        activeIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${activeIndex * 100}%)`;

        slides.forEach((slide, slideIndex) => {
          const isActive = slideIndex === activeIndex;
          slide.classList.toggle('is-active', isActive);
          slide.setAttribute('aria-hidden', String(!isActive));
          if (isActive) {
            slide.removeAttribute('inert');
          } else {
            slide.setAttribute('inert', '');
          }
        });

        dots.forEach((dot, dotIndex) => {
          const isActive = dotIndex === activeIndex;
          dot.classList.toggle('is-active', isActive);
          if (isActive) {
            dot.setAttribute('aria-current', 'true');
          } else {
            dot.removeAttribute('aria-current');
          }
        });
      };

      const stopAutoplay = () => {
        if (autoplayTimer !== null) {
          window.clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      };

      const startAutoplay = () => {
        stopAutoplay();
        if (document.hidden || slider.matches(':hover') || slider.contains(document.activeElement)) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        autoplayTimer = window.setInterval(() => {
          showSlide(activeIndex + 1);
        }, 5000);
      };

      if (previousButton) {
        previousButton.addEventListener('click', () => {
          showSlide(activeIndex - 1);
          startAutoplay();
        });
      }

      if (nextButton) {
        nextButton.addEventListener('click', () => {
          showSlide(activeIndex + 1);
          startAutoplay();
        });
      }

      dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          showSlide(Number(dot.dataset.testimonialIndex));
          startAutoplay();
        });
      });

      // Pause automatic changes while the slider is hovered or keyboard-focused.
      slider.addEventListener('mouseenter', stopAutoplay);
      slider.addEventListener('mouseleave', startAutoplay);
      slider.addEventListener('focusin', stopAutoplay);
      slider.addEventListener('focusout', (event) => {
        if (!slider.contains(event.relatedTarget)) startAutoplay();
      });

      slider.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          showSlide(activeIndex - 1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          showSlide(activeIndex + 1);
        }
      });

      // Swipe left/right on touchscreens to move between testimonial slides.
      slider.addEventListener('touchstart', (event) => {
        touchStartX = event.touches.length === 1 ? event.touches[0].clientX : null;
      }, { passive: true });

      slider.addEventListener('touchend', (event) => {
        if (touchStartX === null || event.changedTouches.length === 0) return;

        const swipeDistance = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(swipeDistance) >= 48) {
          showSlide(activeIndex + (swipeDistance < 0 ? 1 : -1));
        }
        touchStartX = null;
      }, { passive: true });

      slider.addEventListener('touchcancel', () => {
        touchStartX = null;
      }, { passive: true });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      });

      showSlide(0);
      startAutoplay();
  };
  initializeTestimonialSlider();

  // ------------------------------------------------------------------------
  // 2. REUSABLE ONCE-ONLY SCROLL REVEALS
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const delay = Number(entry.target.dataset.delay);
        if (Number.isFinite(delay) && delay > 0) {
          entry.target.style.setProperty('--reveal-delay', `${delay}ms`);
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    // Keep content visible in browsers without IntersectionObserver support.
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  // Add a light pointer tilt only on devices with a precise hover pointer.
  const canTiltServiceCards = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canTiltServiceCards) {
    document.querySelectorAll('.service-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

        card.style.setProperty('--service-tilt-x', `${-offsetY * 5}deg`);
        card.style.setProperty('--service-tilt-y', `${offsetX * 5}deg`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--service-tilt-x');
        card.style.removeProperty('--service-tilt-y');
      });
    });
  }
});
