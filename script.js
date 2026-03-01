document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Elements
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const revealElements = document.querySelectorAll('.reveal');

    // --- Navigation Scroll Effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg', 'bg-dark/95');
            navbar.classList.remove('bg-dark/70', 'py-4');
            navbar.classList.add('py-3');
        } else {
            navbar.classList.remove('shadow-lg', 'bg-dark/95');
            navbar.classList.add('bg-dark/70', 'py-4');
            navbar.classList.remove('py-3');
        }
    });

    // --- Mobile Menu Toggle ---
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            // Open
            mobileMenu.classList.remove('hidden');
            // Small delay to allow display:block to apply before animating opacity/transform
            setTimeout(() => {
                mobileMenu.classList.remove('opacity-0', 'scale-y-0');
                mobileMenu.classList.add('opacity-100', 'scale-y-100');
            }, 10);

            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark text-2xl"></i>';
        } else {
            // Close
            mobileMenu.classList.remove('opacity-100', 'scale-y-100');
            mobileMenu.classList.add('opacity-0', 'scale-y-0');

            // Wait for transition to finish before hiding
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);

            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close mobile menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    // --- Intersection Observer for Scroll Animations ---
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed if you only want it to happen once
                // observer.unobserve(entry.target); 
            } else {
                // Optional: Remove class when out of view to animate again when scrolling back up
                entry.target.classList.remove('active');
            }
        });
    };

    const revealOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
