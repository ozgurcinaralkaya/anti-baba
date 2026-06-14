document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3D Tilt effect for the hero card
    const tiltCard = document.getElementById('tilt-card');
    
    if (tiltCard) {
        document.addEventListener('mousemove', (e) => {
            // Calculate mouse position relative to the center of the screen
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            
            // Apply transform to card
            tiltCard.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        // Reset transform when mouse leaves the window
        document.addEventListener('mouseleave', () => {
            tiltCard.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
            tiltCard.style.transition = 'transform 0.5s ease';
        });

        // Remove transition during movement for snappy response
        document.addEventListener('mouseenter', () => {
            tiltCard.style.transition = 'none';
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    let isMobileMenuOpen = false;
    
    // Navbar Fade from Bottom to Top on Scroll
    const updateMask = () => {
        if (!navbar) return;
        
        if (isMobileMenuOpen) {
            navbar.style.webkitMaskImage = 'none';
            navbar.style.maskImage = 'none';
            navbar.style.pointerEvents = 'auto';
            return;
        }
        
        let scrollY = window.scrollY;
        let progress = scrollY / 300; // 0 to 1
        
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;
        
        let p = -20 + (progress * 120);
        
        navbar.style.webkitMaskImage = `linear-gradient(to top, transparent ${p}%, black ${p + 20}%)`;
        navbar.style.maskImage = `linear-gradient(to top, transparent ${p}%, black ${p + 20}%)`;
        
        if (progress >= 1) {
            navbar.style.pointerEvents = 'none';
        } else {
            navbar.style.pointerEvents = 'auto';
        }
    };

    if (navbar) {
        window.addEventListener('scroll', updateMask);
        updateMask(); // initialize
    }

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.classList.toggle('active');
            isMobileMenuOpen = navLinks.classList.contains('active');
            updateMask();
        });
    }

    // Optional: Add simple intersection observer for fade-in animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.project-card, .about-container, .stat-box');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        // Modulo 3 is used to stagger features, but projects will also stagger nicely
        element.style.transition = `all 0.6s ease ${(index % 3) * 0.1}s`;
        observer.observe(element);
    });

    // Global Dropdown Logic (Fixed for mask-image clipping)
    const contactBtn = document.getElementById('contact-btn');
    const globalDropdown = document.getElementById('global-contact-dropdown');
    let dropdownTimeout;

    if (contactBtn && globalDropdown) {
        // We use mouseenter/mouseleave because CSS hover is broken by moving the DOM element
        const showDropdown = () => {
            clearTimeout(dropdownTimeout);
            const rect = contactBtn.getBoundingClientRect();
            // Position exactly below the button
            globalDropdown.style.display = 'block';
            globalDropdown.style.top = (rect.bottom + window.scrollY + 10) + 'px';
            
            // Adjust for mobile vs desktop
            if (window.innerWidth <= 768) {
                globalDropdown.style.left = '50%';
                globalDropdown.style.transform = 'translateX(-50%)';
                globalDropdown.style.width = '90%';
            } else {
                globalDropdown.style.left = (rect.right - 250) + 'px'; 
                globalDropdown.style.right = 'auto'; // Reset right just in case
                globalDropdown.style.transform = 'none';
                globalDropdown.style.width = '250px';
            }
        };

        const hideDropdown = () => {
            dropdownTimeout = setTimeout(() => {
                globalDropdown.style.display = 'none';
            }, 300);
        };

        contactBtn.addEventListener('mouseenter', showDropdown);
        contactBtn.addEventListener('mouseleave', hideDropdown);
        globalDropdown.addEventListener('mouseenter', showDropdown);
        globalDropdown.addEventListener('mouseleave', hideDropdown);

        // Also close dropdown on scroll to avoid floating issues
        window.addEventListener('scroll', () => {
            globalDropdown.style.display = 'none';
            
            // Auto close mobile menu on scroll
            if (isMobileMenuOpen && window.scrollY > 50) {
                navLinks.classList.remove('active');
                isMobileMenuOpen = false;
                updateMask();
            }
        });
    }

    // Hero Slider Logic
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.getElementById('next-slide');
    const prevBtn = document.getElementById('prev-slide');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const goToSlide = (index) => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        const nextSlide = () => goToSlide(currentSlide + 1);
        const prevSlide = () => goToSlide(currentSlide - 1);

        const startSlider = () => {
            slideInterval = setInterval(nextSlide, 5000);
        };

        const resetSlider = () => {
            clearInterval(slideInterval);
            startSlider();
        };

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetSlider();
            });
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetSlider();
            });
        }

        startSlider();
    }

    // Gallery Modal Logic
    const projectItems = document.querySelectorAll('.project-item');
    const galleryModal = document.getElementById('gallery-modal');
    const galleryStack = document.querySelector('.gallery-stack-container');
    const closeBtn = document.querySelector('.gallery-close-btn');

    if (galleryModal) {
        let isGalleryActive = false;
        let previousScrollY = 0;
        
        projectItems.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                const title = item.querySelector('h3').innerText;
                const imgSrc = item.querySelector('img').src;
                
                previousScrollY = window.scrollY; // Store the current scroll position
                
                galleryStack.innerHTML = '';
                const dummyImages = ['dummy1.png', 'dummy2.png', 'dummy3.png', 'dummy4.png'];
                const currentLang = localStorage.getItem('lang') || 'tr';
                const imageLabel = currentLang === 'tr' ? 'Görsel' : 'Image';
                
                for (let i = 0; i < 4; i++) {
                    const zIndex = 10 - i;
                    const displaySrc = i === 0 ? imgSrc : dummyImages[i];
                    
                    const slide = document.createElement('div');
                    slide.className = 'gallery-slide';
                    slide.style.zIndex = zIndex;
                    slide.innerHTML = `
                        <img src="${displaySrc}" alt="Gallery Image">
                        <div class="gallery-caption">
                            <h3>${title} - ${imageLabel} ${i+1}</h3>
                        </div>
                    `;
                    galleryStack.appendChild(slide);
                }
                
                isGalleryActive = true;
                document.body.classList.add('modal-open');
                galleryModal.classList.add('active');
                
                // Add to browser history so back button works for the modal
                history.pushState({ galleryOpen: true }, '', '#gallery');
                
                // Force body scroll to act as the gallery scroll
                document.body.style.height = `${4 * 100}vh`;
                window.scrollTo(0, 0);
                updateGalleryScroll();
            });
        });
        
        const closeGallery = () => {
            if (!isGalleryActive) return;
            isGalleryActive = false;
            document.body.classList.remove('modal-open');
            galleryModal.classList.remove('active');
            document.body.style.height = 'auto';
            window.scrollTo(0, previousScrollY); // Restore previous scroll position
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeGallery();
                // Clean up the URL hash if it was added
                if (window.location.hash === '#gallery') {
                    history.replaceState(null, '', window.location.pathname);
                }
            });
        }
        
        // Listen for browser Back button
        window.addEventListener('popstate', () => {
            if (isGalleryActive) {
                closeGallery();
            }
        });
        
        const updateGalleryScroll = () => {
            if (!isGalleryActive) return;
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const slides = galleryModal.querySelectorAll('.gallery-slide');
            
            slides.forEach((sec, index) => {
                let currentActiveIndex = Math.floor(scrollY / windowHeight);
                if (currentActiveIndex >= slides.length - 1) {
                    currentActiveIndex = slides.length - 1;
                }

                if (index === currentActiveIndex || index === currentActiveIndex + 1) {
                    sec.style.visibility = 'visible';
                } else {
                    sec.style.visibility = 'hidden';
                }

                if (index === slides.length - 1) {
                    sec.style.maskImage = 'none';
                    sec.style.webkitMaskImage = 'none';
                    return;
                }
                
                const sectionStart = index * windowHeight;
                const sectionEnd = (index + 1) * windowHeight;
                
                let progress = 0;
                if (scrollY >= sectionStart && scrollY <= sectionEnd) {
                    progress = (scrollY - sectionStart) / windowHeight;
                } else if (scrollY > sectionEnd) {
                    progress = 1;
                }
                
                const p = -20 + (progress * 120);
                sec.style.webkitMaskImage = `linear-gradient(to top, transparent ${p}%, black ${p + 20}%)`;
                sec.style.maskImage = `linear-gradient(to top, transparent ${p}%, black ${p + 20}%)`;
                
                if (progress >= 1) {
                    sec.style.pointerEvents = 'none';
                } else {
                    sec.style.pointerEvents = 'auto';
                }
            });
        };
        
        window.addEventListener('scroll', updateGalleryScroll);
    }
});
