/* VisaRequest — Main JS */

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const spans = menuBtn.querySelectorAll('span');
      menuBtn.setAttribute('aria-expanded', mobileNav.classList.contains('open'));
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Individual / Business toggle in forms
  document.querySelectorAll('.toggle-type button').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.toggle-type').querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.type;
      const form = btn.closest('form') || document.querySelector('form');
      if (form) {
        const typeInput = form.querySelector('[name="applicant_type"]');
        if (typeInput) typeInput.value = type;
        // Show/hide business fields
        const businessFields = form.querySelectorAll('.business-only');
        businessFields.forEach(f => f.style.display = type === 'business' ? '' : 'none');
      }
    });
  });

  // Form submission handler (connects to Formspree)
  document.querySelectorAll('.visa-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          showSuccess(form);
        } else {
          showError(form);
        }
      } catch {
        showError(form);
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  });

  // Animate numbers on scroll
  const stats = document.querySelectorAll('.stat-num[data-count]');
  if (stats.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(s => observer.observe(s));
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

function showSuccess(form) {
  const msg = document.createElement('div');
  msg.style.cssText = 'background:#d1fae5;border:1px solid #6ee7b7;color:#065f46;padding:20px 24px;border-radius:12px;font-weight:600;text-align:center;margin-top:16px;font-family:Plus Jakarta Sans,sans-serif;';
  msg.textContent = '✅ Thank you! We\'ve received your enquiry and will be in touch within 2 business hours.';
  form.after(msg);
  form.reset();
  msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showError(form) {
  const msg = document.createElement('div');
  msg.style.cssText = 'background:#fee2e2;border:1px solid #fca5a5;color:#991b1b;padding:16px 20px;border-radius:12px;font-size:.9rem;margin-top:12px;';
  msg.textContent = 'Something went wrong. Please email us directly at apply@visarequest.co.za or call us.';
  form.after(msg);
}

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target).toLocaleString() + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
