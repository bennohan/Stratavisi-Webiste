/**
 * ==========================================================================
 * Stratavisi Digimart - Main Script
 * Berisi logika:
 * 1. Navigasi Mobile (Hamburger Menu)
 * 2. Update Tahun Copyright Otomatis
 * 3. Animasi Muncul Halus saat Scroll (Scroll Reveal)
 * 4. Slider Interaktif Visi & Misi (Autoplay, Navigasi, Aksesibilitas)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. NAVIGASI MOBILE (HAMBURGER MENU)
  // ==========================================
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isClosed = mobileMenu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', !isClosed);
    });

    // Otomatis tutup menu saat tautan diklik
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================
  // 2. TAHUN COPYRIGHT OTOMATIS
  // ==========================================
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ==========================================
  // 3. ANIMASI SCROLL REVEAL (MUNCUL HALUS)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      revealElements.forEach((el) => revealObserver.observe(el));
    } else {
      // Fallback jika IntersectionObserver tidak didukung
      revealElements.forEach((el) => el.classList.add('in'));
    }
  }

  // ==========================================
  // 4. SLIDER VISI & MISI
  // ==========================================
  const slider = document.getElementById('slider');
  const dotsBox = document.getElementById('dots');
  const playBtn = document.getElementById('playBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (slider && dotsBox && playBtn && prevBtn && nextBtn) {
    const slides = Array.from(slider.children);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const INTERVAL = 5000;

    let timer = null;
    let userPaused = reduceMotion;
    let hovering = false;

    const getCurrentIndex = () => Math.round(slider.scrollLeft / slider.clientWidth);

    const goTo = (index) => {
      const targetIndex = (index + slides.length) % slides.length;
      slider.scrollTo({
        left: targetIndex * slider.clientWidth,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    };

    const stopAutoplay = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const startAutoplay = () => {
      stopAutoplay();
      if (!userPaused && !hovering) {
        timer = setInterval(() => {
          goTo(getCurrentIndex() + 1);
        }, INTERVAL);
      }
    };

    // Buat dot indicator untuk setiap slide
    dotsBox.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'h-3 w-3 rounded-full bg-black/20 transition-colors';
      dot.setAttribute('aria-label', `Ke kartu ${i + 1}`);
      dot.addEventListener('click', () => {
        goTo(i);
        startAutoplay();
      });
      dotsBox.appendChild(dot);
    });

    const dots = Array.from(dotsBox.children);

    const updateDots = () => {
      const activeIdx = getCurrentIndex();
      dots.forEach((dot, idx) => {
        const isActive = idx === activeIdx;
        dot.classList.toggle('bg-brand', isActive);
        dot.classList.toggle('bg-black/20', !isActive);
      });
    };

    // Event listener navigasi tombol
    prevBtn.addEventListener('click', () => {
      goTo(getCurrentIndex() - 1);
      startAutoplay();
    });

    nextBtn.addEventListener('click', () => {
      goTo(getCurrentIndex() + 1);
      startAutoplay();
    });

    playBtn.addEventListener('click', () => {
      userPaused = !userPaused;
      playBtn.textContent = userPaused ? 'Putar' : 'Jeda';
      if (userPaused) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    // Dukungan navigasi keyboard (Panah Kiri / Kanan saat slider aktif)
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goTo(getCurrentIndex() - 1);
        startAutoplay();
      } else if (e.key === 'ArrowRight') {
        goTo(getCurrentIndex() + 1);
        startAutoplay();
      }
    });

    // Kontrol jeda saat hover & fokus
    slider.addEventListener('mouseenter', () => { hovering = true; stopAutoplay(); });
    slider.addEventListener('mouseleave', () => { hovering = false; startAutoplay(); });
    slider.addEventListener('focusin', () => { hovering = true; stopAutoplay(); });
    slider.addEventListener('focusout', () => { hovering = false; startAutoplay(); });

    // Kontrol jeda saat interaksi sentuh di perangkat mobile
    slider.addEventListener('touchstart', stopAutoplay, { passive: true });
    slider.addEventListener('touchend', startAutoplay, { passive: true });

    // Update status dot saat scroll atau resize
    slider.addEventListener('scroll', updateDots, { passive: true });
    window.addEventListener('resize', updateDots);

    // Inisialisasi awal
    playBtn.textContent = userPaused ? 'Putar' : 'Jeda';
    updateDots();
    startAutoplay();
  }
});
