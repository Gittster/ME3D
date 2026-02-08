// ===== Mobile Navigation =====
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      hamburger.setAttribute('aria-expanded',
        hamburger.classList.contains('active'));
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== Gallery Filter =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const items = galleryItems.length > 0 ? galleryItems : productCards;
      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.3s ease';
            item.style.opacity = '1';
          });
        } else {
          item.style.opacity = '0';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ===== Lightbox =====
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    function getVisibleItems() {
      return Array.from(galleryItems).filter(item => item.style.display !== 'none');
    }

    function openLightbox(index) {
      const visible = getVisibleItems();
      currentIndex = index;
      const item = visible[currentIndex];
      if (!item) return;

      const bg = getComputedStyle(item).background;
      lightboxImage.style.background = bg;
      lightboxImage.textContent = item.querySelector('.gallery-label')?.textContent || '';
      lightboxCaption.textContent = item.dataset.caption || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigate(direction) {
      const visible = getVisibleItems();
      currentIndex = (currentIndex + direction + visible.length) % visible.length;
      openLightbox(currentIndex);
    }

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        const visible = getVisibleItems();
        const visibleIndex = visible.indexOf(item);
        openLightbox(visibleIndex);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigate(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  // ===== Scroll Animations =====
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
  }

  // ===== Form Validation =====
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let valid = true;
      const required = form.querySelectorAll('[required]');

      required.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#e74c3c';
          valid = false;
        }
        if (field.type === 'email' && field.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) {
            field.style.borderColor = '#e74c3c';
            valid = false;
          }
        }
      });

      if (!valid) {
        e.preventDefault();
        const first = form.querySelector('[style*="border-color: rgb(231, 76, 60)"]');
        if (first) first.focus();
      } else {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        const origText = btn.textContent;
        btn.textContent = 'Sent!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = origText;
          btn.disabled = false;
          form.reset();
        }, 2000);
      }
    });
  });

  // ===== Active Nav Link =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
