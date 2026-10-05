/* ==========================================================================
   NALAPAD ACADEMY - INTERACTIVE & ANIMATED LANDING PAGE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. Sticky Header Scroll Effect --- */
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  /* --- 2. Scroll Reveal Animations (IntersectionObserver) --- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Optionally unobserve if one-time animation preferred
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  /* --- 3. Animated Number Counters for Key Stats --- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedStats) {
        animatedStats = true;
        statNumbers.forEach(stat => {
          const targetText = stat.textContent.trim();
          const targetNum = parseInt(targetText.replace(/\D/g, '')) || 0;
          const suffix = targetText.replace(/[0-9]/g, '');
          
          let currentNum = 0;
          const duration = 1600; // ms
          const stepTime = 30;
          const increment = Math.max(1, Math.ceil(targetNum / (duration / stepTime)));

          const timer = setInterval(() => {
            currentNum += increment;
            if (currentNum >= targetNum) {
              stat.textContent = targetNum + suffix;
              clearInterval(timer);
            } else {
              stat.textContent = currentNum + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) statsObserver.observe(statsStrip);

  /* --- 4. Cambridge Pathway Tab Switcher --- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons & contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active to selected
      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      const content = document.getElementById(targetTab);
      if (content) {
        content.classList.add('active');
      }
    });
  });

  /* --- 5. FAQ Accordion Toggle --- */
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* --- 6. Modals (Campus Visit & Thank You Conversion Modal) --- */
  const visitModal = document.getElementById('campusVisitModal');
  const thankYouModal = document.getElementById('thankYouModal');
  const openVisitBtns = document.querySelectorAll('.trigger-visit-modal');
  const openEnquireBtns = document.querySelectorAll('.trigger-enquire-modal');
  const closeModalBtns = document.querySelectorAll('.modal-close-btn');

  // Open Visit Modal
  openVisitBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (visitModal) visitModal.classList.add('active');
    });
  });

  // Open Enquire/Visit Modal
  openEnquireBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const heroForm = document.getElementById('heroEnquiryForm');
      if (window.innerWidth > 992 && heroForm) {
        heroForm.scrollIntoView({ behavior: 'smooth' });
        const firstInput = heroForm.querySelector('input');
        if (firstInput) firstInput.focus();
      } else if (visitModal) {
        visitModal.classList.add('active');
      }
    });
  });

  // Close Modals
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (visitModal) visitModal.classList.remove('active');
      if (thankYouModal) thankYouModal.classList.remove('active');
    });
  });

  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === visitModal) visitModal.classList.remove('active');
    if (e.target === thankYouModal) thankYouModal.classList.remove('active');
  });

  /* --- 7. Form Submissions & Google Ads Conversion Trigger --- */
  const leadForms = document.querySelectorAll('form.admission-lead-form');

  leadForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple Validation Check
      const inputs = form.querySelectorAll('[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#EF4444';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!isValid) return;

      // Disable submit button during processing
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

      // Simulate API submit delay
      setTimeout(() => {
        // Reset form
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Close any active modal first
        if (visitModal) visitModal.classList.remove('active');

        // Trigger Google Ads Conversion Tracking (if gtag available)
        if (typeof gtag === 'function') {
          gtag('event', 'conversion', {
            'send_to': 'AW-714843451/admission_enquiry',
            'event_category': 'Leads',
            'event_label': 'Nalapad Academy Admission Form'
          });
        }

        // Show Thank You Modal
        if (thankYouModal) {
          thankYouModal.classList.add('active');
        }
      }, 850);
    });
  });
});
