document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scroll Effect
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 2. Hero Slider Logic
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.control-prev');
    const nextBtn = document.querySelector('.control-next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let index = (currentSlide + 1) % slides.length;
        showSlide(index);
    }

    function prevSlide() {
        let index = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(index);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });

    function startTimer() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    function resetTimer() {
        clearInterval(slideInterval);
        startTimer();
    }

    startTimer();

    // 3. Stats Counter Animation Logic
    function animateSingleStat(num) {
        if (num.classList.contains('counted')) return;
        num.classList.add('counted');

        const target = +num.getAttribute('data-target');
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCount = () => {
            current += increment;
            if (current < target) {
                num.innerText = Math.ceil(current);
                requestAnimationFrame(updateCount);
            } else {
                num.innerText = target;
            }
        };
        updateCount();
    }

    // 4. Reveal on Scroll Animation (Advanced)
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it's a stat card, trigger the counter
                const statNum = entry.target.querySelector('.stat-number');
                if (statNum) {
                    animateSingleStat(statNum);
                }
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Project Spotlight Interaction
    const pCards = document.querySelectorAll('.project-card');
    const spotlightImg = document.getElementById('project-spotlight');
    const spotlightTitle = document.getElementById('spotlight-title');
    const coordTag = document.querySelector('.coord-tag');

    const projectData = {
        'Azure Bay': {
            img: 'assets/hero3.png',
            coords: '45.523° N, 122.676° W',
            title: 'Azure Bay Villas'
        },
        'Emerald Hills': {
            img: 'assets/hero1.png',
            coords: '46.020° N, 7.749° E',
            title: 'Emerald Residences'
        },
        'CBD': {
            img: 'assets/hero2.png',
            coords: '40.712° N, 74.006° W',
            title: 'The Sterling Tower'
        }
    };

    pCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const loc = card.getAttribute('data-location');
            const data = projectData[loc];
            
            if (data) {
                spotlightImg.style.backgroundImage = `url('${data.img}')`;
                spotlightTitle.innerText = data.title;
                coordTag.innerText = data.coords;
                
                // Add subtle zoom effect
                spotlightImg.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            spotlightImg.style.transform = 'scale(1)';
        });
    });

    // 6. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 7. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinksList = document.querySelectorAll('.nav-links a');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // 8. Testimonial Slider
    const tTrack = document.querySelector('.testimonial-slider-track');
    const tCards = document.querySelectorAll('.testimonial-card');
    const tDots = document.querySelectorAll('.t-dot');
    let tIndex = 0;

    function showTestimonial(index) {
        tTrack.style.transform = `translateX(-${index * 100}%)`;
        tCards.forEach(c => c.classList.remove('active'));
        tDots.forEach(d => d.classList.remove('active'));
        
        tCards[index].classList.add('active');
        tDots[index].classList.add('active');
        tIndex = index;
    }

    tDots.forEach((dot, i) => {
        dot.addEventListener('click', () => showTestimonial(i));
    });

    // Auto slide testimonials
    setInterval(() => {
        let next = (tIndex + 1) % tCards.length;
        showTestimonial(next);
    }, 5000);

    // 9. Gallery Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Create Lightbox on the fly
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <img class="lightbox-img" src="" alt="Enlarged view">
    `;
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('.lightbox-img');
    const lbClose = lb.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const bgImg = getComputedStyle(item).backgroundImage;
            const url = bgImg.replace('url("', '').replace('")', '');
            lbImg.src = url;
            lb.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lb.addEventListener('click', (e) => {
        if (e.target !== lbImg) {
            lb.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
