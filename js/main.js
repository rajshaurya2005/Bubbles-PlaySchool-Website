/* =============================================
   MAIN.JS — Bubbles Playschool
   Handles: Navbar, Scroll Effects, Animations, Active Links
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* =============================================
       NAVIGATION - Hamburger Toggle
       ============================================= */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('nav-open');
            document.body.style.overflow = navLinks.classList.contains('nav-open') ? 'hidden' : '';
        });

        // Close menu when a nav link is clicked
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navLinks.classList.remove('nav-open');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('nav-open');
                document.body.style.overflow = '';
            }
        });
    }

    /* =============================================
       NAVIGATION - Scroll Effect
       ============================================= */
    const navbar = document.getElementById('navbar');

    function handleScroll() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run on page load

    /* =============================================
       SCROLL ANIMATIONS - IntersectionObserver
       ============================================= */
    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: make everything visible
        fadeElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* =============================================
       ACTIVE NAV LINK
       ============================================= */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-link');

    allNavLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        const linkPage = href.split('/').pop();

        if (linkPage === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && (linkPage === 'index.html' || href === './index.html' || href === '../index.html')) {
            link.classList.add('active');
        }
    });

});
