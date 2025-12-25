document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Sticky Header & Mobile Menu ---
    const nav = document.getElementById('main-nav');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .btn-glass-mobile-cta');

    // Sticky Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Toggle Mobile Menu
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        // Prevent scrolling when menu is open
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close Menu on Link Click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        threshold: 0.3 // Trigger when 30% of section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    // Check if link href matches id
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    /* --- HERO ANIMATIONS --- */
    const heroSection = document.querySelector('.hero-section');
    const heroBgText = document.querySelector('.hero-bg-text');
    const heroImage = document.querySelector('.hero-image-container');
    const heroRoleText = document.querySelector('.hero-role-text');
    const heroIntro = document.querySelector('.hero-intro-box');

    // 1. Mouse Parallax (3D Illusion)
    heroSection.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 900) return; // Disable on mobile

        const x = (window.innerWidth / 2 - e.pageX) / 25; // Division controls speed
        const y = (window.innerHeight / 2 - e.pageY) / 25;

        // Background Text moves OPPOSITE (Left when mouse Right)
        if (heroBgText) heroBgText.style.transform = `translate(${x * 0.5}px, calc(-50% + ${y * 0.5}px))`;

        // Portrait moves WITH mouse (Right when mouse Right) - Closer object
        if (heroImage) heroImage.style.transform = `translate(${-x * 0.8}px, ${-y * 0.8}px)`;

        // Role Text (Behind) moves slightly
        if (heroRoleText) heroRoleText.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;

        // Foreground Intro (Front) moves most
        if (heroIntro) heroIntro.style.transform = `translate(${-x * 1.2}px, ${-y * 1.2}px)`;
    });

    // 2. Magnetic Buttons
    const buttons = document.querySelectorAll('.hero-buttons .btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move button towards mouse (Magnetic)
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0) scale(1)';
        });
    });

    // 3. Scroll Exit Parallax
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 900) return; // Disable on mobile

        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            // "Exit" Effect: Text scrolls up faster, Image stays 'sticky' longer
            if (heroRoleText) heroRoleText.style.transform = `translateY(${scrollY * -0.5}px)`;
            if (heroImage) heroImage.style.transform = `translateY(${scrollY * 0.2}px)`; // Moves down/stays
            if (heroIntro) heroIntro.style.opacity = 1 - (scrollY / 400); // Fade out intro
        }
    });

    // 4. Skills Card 3D Tilt
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Normalize values (-1 to 1)
            const rotateX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    /* --- CRYSTAL CODE 3D PROJECT CAROUSEL --- */
    const projectSwiper = new Swiper('.project-carousel', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        initialSlide: 1, // Start focused on the second card usually
        loop: true,
        speed: 800, // Smooth transition speed

        // 3D Effect Configuration
        coverflowEffect: {
            rotate: 25,      // Rotation of side slides
            stretch: 0,      // Spacing
            depth: 300,      // Depth perspective (Z-axis distance)
            modifier: 1,     // Multiplier
            slideShadows: false, // We use custom CSS shadows/blur instead
        },



        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        // Navigation (Optional if enabled in HTML)
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Accessibility
        a11y: {
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
        },
    });

    console.log("Crystal Code Theme Initialized with 3D Carousel ✨");

    /* --- PROCESS SECTION SWIPER (STORYBOARD) --- */
    const processSwiper = new Swiper('.process-carousel', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto', // Allows side cards to peek
        initialSlide: 0,
        loop: false, // Linear process usually better not looping, but can be true
        speed: 800,

        coverflowEffect: {
            rotate: 0,       // Flat facing but stepped back
            stretch: 0,
            depth: 200,      // Depth for hierarchy
            modifier: 1,
            slideShadows: false, // Custom CSS used
            scale: 0.9,      // Side cards smaller
        },

        pagination: {
            el: '.process-pagination',
            clickable: true,
        },



        // Breakpoints for responsiveness
        breakpoints: {
            320: {
                slidesPerView: 1.1, // Single card on mobile
                coverflowEffect: {
                    depth: 100,
                    scale: 0.95,
                }
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });

    /* --- BACK TO TOP BUTTON --- */
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // --- Contact Form Handling (EmailJS) ---
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Change button text to indicate loading
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span>Sending...</span>';

            // Retrieve the service ID and template ID from your EmailJS dashboard
            const serviceID = 'service_7r1oh9f';
            const templateID = 'template_6csi4fe';

            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    btn.innerHTML = '<span>Sent!</span> <i class="ri-check-line"></i>';
                    alert('Message sent successfully! I will get back to you soon.');
                    contactForm.reset();
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 3000);
                }, (err) => {
                    btn.innerHTML = '<span>Failed</span> <i class="ri-error-warning-line"></i>';
                    // Show specific error to help debug
                    alert('Failed to send! Error: ' + JSON.stringify(err));
                    console.error('EmailJS Error:', err);
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 3000);
                });
        });
    }

});
