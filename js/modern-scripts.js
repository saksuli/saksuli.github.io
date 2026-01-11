// Modern Portfolio JavaScript - 2024 Update

// ========================================
// Constants and Configuration
// ========================================
const CONFIG = {
  birthYear: 1989,
  careerStartYear: 2014,
  navHeight: 80,
  scrollOffset: 100,
  animationDuration: 300,
  typingSpeed: 100,
  typingDeleteSpeed: 50,
  typingPauseTime: 2000,
  roles: [
    'QA Engineer',
    'Test Automation Specialist',
    'Quality Assurance Expert',
    'Game QA Professional'
  ]
};

// ========================================
// Utility Functions
// ========================================
const utils = {
  scrollToElement: (element, offset = CONFIG.navHeight) => {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  },

  calculateAge: (birthYear) => {
    return new Date().getFullYear() - birthYear;
  },

  calculateCareerYears: (startYear) => {
    return new Date().getFullYear() - startYear;
  },

  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  lerp: (start, end, factor) => {
    return start + (end - start) * factor;
  }
};

// ========================================
// Typing Effect
// ========================================
class TypingEffect {
  constructor(element, words, options = {}) {
    this.element = element;
    this.words = words;
    this.typeSpeed = options.typeSpeed || CONFIG.typingSpeed;
    this.deleteSpeed = options.deleteSpeed || CONFIG.typingDeleteSpeed;
    this.pauseTime = options.pauseTime || CONFIG.typingPauseTime;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.isPaused = false;

    if (this.element) {
      this.init();
    }
  }

  init() {
    this.type();
  }

  type() {
    const currentWord = this.words[this.wordIndex];

    if (this.isDeleting) {
      this.element.textContent = currentWord.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentWord.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      typeSpeed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// ========================================
// Cursor Glow Effect
// ========================================
class CursorGlow {
  constructor() {
    this.cursor = document.getElementById('cursor-glow');
    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.isVisible = false;

    if (this.cursor && window.innerWidth > 768) {
      this.init();
    }
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (!this.isVisible) {
        this.cursor.classList.add('active');
        this.isVisible = true;
      }
    });

    document.addEventListener('mouseleave', () => {
      this.cursor.classList.remove('active');
      this.isVisible = false;
    });

    this.animate();
  }

  animate() {
    this.cursorX = utils.lerp(this.cursorX, this.mouseX, 0.1);
    this.cursorY = utils.lerp(this.cursorY, this.mouseY, 0.1);

    if (this.cursor) {
      this.cursor.style.left = `${this.cursorX}px`;
      this.cursor.style.top = `${this.cursorY}px`;
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ========================================
// Scroll to Top Button
// ========================================
class ScrollToTop {
  constructor() {
    this.button = document.getElementById('scroll-top');
    this.threshold = 300;

    if (this.button) {
      this.init();
    }
  }

  init() {
    window.addEventListener('scroll', utils.throttle(() => {
      this.toggleVisibility();
    }, 100));

    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  toggleVisibility() {
    if (window.scrollY > this.threshold) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }
}

// ========================================
// Navigation Manager
// ========================================
class NavigationManager {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.navToggle = document.querySelector('.nav-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('.section');
    this.isMenuOpen = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateActiveLink();
  }

  bindEvents() {
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNavClick(link);
      });
    });

    window.addEventListener('scroll', utils.throttle(() => {
      this.updateActiveLink();
      this.handleNavScroll();
    }, 16));

    document.addEventListener('click', (e) => {
      if (!this.nav.contains(e.target) && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    window.addEventListener('resize', utils.debounce(() => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    }, 250));

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.navMenu.classList.toggle('active', this.isMenuOpen);
    this.navToggle.classList.toggle('active', this.isMenuOpen);
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  handleNavClick(link) {
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      utils.scrollToElement(targetElement);
      this.closeMobileMenu();
    }
  }

  updateActiveLink() {
    let current = '';

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const scrollPosition = window.scrollY + CONFIG.scrollOffset;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  handleNavScroll() {
    if (window.scrollY > 50) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  }
}

// ========================================
// Content Manager
// ========================================
class ContentManager {
  constructor() {
    this.init();
  }

  init() {
    this.updateDynamicContent();
    this.setupLazyLoading();
  }

  updateDynamicContent() {
    const ageElement = document.getElementById('current-age');
    if (ageElement) {
      const age = utils.calculateAge(CONFIG.birthYear);
      this.animateNumber(ageElement, age);
    }

    const careerElement = document.getElementById('career-years');
    if (careerElement) {
      const careerYears = utils.calculateCareerYears(CONFIG.careerStartYear);
      this.animateNumber(careerElement, careerYears, '+');
    }
  }

  animateNumber(element, target, suffix = '') {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease out cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (target - startValue) * easeProgress);

      element.textContent = currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    // Start animation when element is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(animate);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(element);
  }

  setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ========================================
// Animation Manager
// ========================================
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupParallaxEffect();
  }

  setupScrollAnimations() {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const animateElements = document.querySelectorAll(
      '.timeline-item, .project-card, .skill-category, .document-card, .video-card, .photo-card'
    );

    animateElements.forEach(el => {
      animationObserver.observe(el);
    });
  }

  setupParallaxEffect() {
    const hero = document.getElementById('about');
    if (!hero) return;

    window.addEventListener('scroll', utils.throttle(() => {
      const scrolled = window.scrollY;
      const heroHeight = hero.offsetHeight;

      if (scrolled < heroHeight) {
        const parallaxElements = hero.querySelectorAll('.about-image');
        parallaxElements.forEach(el => {
          el.style.transform = `translateY(${scrolled * 0.1}px)`;
        });
      }
    }, 16));
  }
}

// ========================================
// Performance Monitor (Development Only)
// ========================================
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      this.trackPageLoad();
      this.trackCoreWebVitals();
    }
  }

  trackPageLoad() {
    window.addEventListener('load', () => {
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
      }
    });
  }

  trackCoreWebVitals() {
    if ('PerformanceObserver' in window) {
      // LCP
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime.toFixed(2), 'ms');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }

      // FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            console.log('FID:', (entry.processingStart - entry.startTime).toFixed(2), 'ms');
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // FID not supported
      }

      // CLS
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        window.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') {
            console.log('CLS:', clsValue.toFixed(4));
          }
        });
      } catch (e) {
        // CLS not supported
      }
    }
  }
}

// ========================================
// Error Handler
// ========================================
class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
    });
  }
}

// ========================================
// Smooth Reveal on Scroll
// ========================================
class SmoothReveal {
  constructor() {
    this.init();
  }

  init() {
    // Add initial loading class to body
    document.body.classList.add('loaded');

    // Reveal sections on scroll
    const sections = document.querySelectorAll('.section');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1
    });

    sections.forEach(section => {
      revealObserver.observe(section);
    });
  }
}

// ========================================
// Application Initialization
// ========================================
class PortfolioApp {
  constructor() {
    this.navigationManager = null;
    this.contentManager = null;
    this.animationManager = null;
    this.performanceMonitor = null;
    this.errorHandler = null;
    this.typingEffect = null;
    this.cursorGlow = null;
    this.scrollToTop = null;
    this.smoothReveal = null;

    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeApp());
    } else {
      this.initializeApp();
    }
  }

  initializeApp() {
    try {
      // Initialize error handling first
      this.errorHandler = new ErrorHandler();

      // Initialize core managers
      this.navigationManager = new NavigationManager();
      this.contentManager = new ContentManager();
      this.animationManager = new AnimationManager();
      this.smoothReveal = new SmoothReveal();

      // Initialize typing effect
      const typingElement = document.getElementById('typing-text');
      if (typingElement) {
        this.typingEffect = new TypingEffect(typingElement, CONFIG.roles);
      }

      // Initialize cursor glow (desktop only)
      this.cursorGlow = new CursorGlow();

      // Initialize scroll to top
      this.scrollToTop = new ScrollToTop();

      // Initialize performance monitoring
      this.performanceMonitor = new PerformanceMonitor();

      console.log('Portfolio application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize application:', error);
    }
  }
}

// ========================================
// Initialize Application
// ========================================
const app = new PortfolioApp();

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioApp, utils };
}
