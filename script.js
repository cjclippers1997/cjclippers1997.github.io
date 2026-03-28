/* ============================================
   CJ CLIPPER BARBER SHOP — JavaScript
   Animations, Navigation, Scroll Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const hide = () => setTimeout(() => preloader.classList.add('hidden'), 600);
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
  }

  // --- Nav scroll effect ---
  const nav = document.getElementById('mainNav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile nav toggle ---
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll animations (IntersectionObserver) ---
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animEls = document.querySelectorAll('.anim-on-scroll');

  if (animEls.length && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    animEls.forEach(el => observer.observe(el));
  } else {
    animEls.forEach(el => el.classList.add('visible'));
  }

  // --- Mobile floating CTA (show after scrolling past hero) ---
  const mobileCta = document.getElementById('mobileCta');
  const hero = document.getElementById('hero');
  if (mobileCta && hero) {
    const ctaObserver = new IntersectionObserver(([entry]) => {
      mobileCta.classList.toggle('visible', !entry.isIntersecting);
    }, { threshold: 0.1 });
    ctaObserver.observe(hero);
  }

  // --- Smooth anchor scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Active nav link highlighting on scroll ---
  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    const navLinks = document.querySelectorAll('.nav-link');
    const highlightNav = () => {
      const scrollY = window.scrollY + 100;
      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(link => {
            link.classList.toggle('active',
              link.getAttribute('href') === '#' + id);
          });
        }
      });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });
  }

  // --- Parallax gold orbs on mouse move (desktop only) ---
  if (!reducedMotion && window.innerWidth > 768) {
    const orbs = document.querySelectorAll('.book-orb, .hero-glass-orb');
    if (orbs.length) {
      let rafId = null;
      document.addEventListener('mousemove', (e) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 20;
          const y = (e.clientY / window.innerHeight - 0.5) * 20;
          orbs.forEach((orb, i) => {
            const factor = (i % 2 === 0) ? 1 : -0.6;
            orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
          });
          rafId = null;
        });
      });
    }
  }
});
