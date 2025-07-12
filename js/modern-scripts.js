// Modern Portfolio JavaScript

// ========================================
// Constants and Configuration
// ========================================
const CONFIG = {
  birthYear: 1989,
  careerStartYear: 2014,
  navHeight: 70,
  scrollOffset: 100,
  animationDuration: 300
};

// ========================================
// Utility Functions
// ========================================
const utils = {
  // Smooth scroll to element
  scrollToElement: (element, offset = CONFIG.navHeight) => {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  },

  // Calculate age from birth year
  calculateAge: (birthYear) => {
    return new Date().getFullYear() - birthYear;
  },

  // Calculate career years
  calculateCareerYears: (startYear) => {
    return new Date().getFullYear() - startYear;
  },

  // Throttle function for performance
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

  // Debounce function for performance
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
  }
};

// ========================================
// Navigation Management
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
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNavClick(link);
      });
    });

    // Handle scroll events
    window.addEventListener('scroll', utils.throttle(() => {
      this.updateActiveLink();
      this.handleNavScroll();
    }, 16));

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.nav.contains(e.target) && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Handle window resize
    window.addEventListener('resize', utils.debounce(() => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    }, 250));
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.navMenu.classList.toggle('active', this.isMenuOpen);
    this.navToggle.classList.toggle('active', this.isMenuOpen);
    
    // Animate hamburger menu
    this.animateHamburger();
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  animateHamburger() {
    const spans = this.navToggle.querySelectorAll('span');
    if (this.isMenuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      spans[0].style.transform = 'rotate(0) translate(0, 0)';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'rotate(0) translate(0, 0)';
    }
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
    const scrollY = window.scrollY;
    
    // Add/remove scrolled class for navigation styling
    if (scrollY > 50) {
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
    // Update age
    const ageElement = document.getElementById('current-age');
    if (ageElement) {
      const age = utils.calculateAge(CONFIG.birthYear);
      ageElement.textContent = age;
    }

    // Update career years
    const careerElement = document.getElementById('career-years');
    if (careerElement) {
      const careerYears = utils.calculateCareerYears(CONFIG.careerStartYear);
      careerElement.textContent = `${careerYears}+`;
    }
  }

  setupLazyLoading() {
    // Intersection Observer for lazy loading images
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observe all images with loading="lazy"
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
    this.setupHoverEffects();
  }

  setupScrollAnimations() {
    // Intersection Observer for scroll animations
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

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.timeline-item, .project-card, .skill-category');
    animateElements.forEach(el => {
      animationObserver.observe(el);
    });
  }

  setupHoverEffects() {
    // Add subtle hover effects to cards
    const cards = document.querySelectorAll('.project-card, .document-card, .video-card, .photo-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }
}

// ========================================
// Performance Monitor
// ========================================
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    this.trackPageLoad();
    this.trackCoreWebVitals();
  }

  trackPageLoad() {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`Page loaded in ${loadTime}ms`);
      
      // Track largest contentful paint
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      }
    });
  }

  trackCoreWebVitals() {
    // Track First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }

    // Track Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            console.log('CLS:', entry.value);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
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
    // Global error handling
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
      this.handleError(e.error);
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      this.handleError(e.reason);
    });
  }

  handleError(error) {
    // Log error for debugging
    console.error('Application error:', error);
    
    // In production, you might want to send this to a logging service
    // this.sendErrorToService(error);
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
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
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
      
      // Initialize performance monitoring in development
      if (process?.env?.NODE_ENV === 'development') {
        this.performanceMonitor = new PerformanceMonitor();
      }
      
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