/* ==========================================================================
   SOBHA SEAS - Interactive JavaScript Logic
   Full dynamic sliding, functioning buttons, filters, modals, and toasts.
   ========================================================================== */

// Helper Global Toast Trigger
window.showToast = function(title, message) {
    const toast = document.getElementById('toastNotification');
    const tTitle = document.getElementById('toastTitle');
    const tMsg = document.getElementById('toastMessage');

    if (toast && tTitle && tMsg) {
        tTitle.innerText = title;
        tMsg.innerText = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3800);
    }
};

// Global 360 Tour View Switcher
window.switchTourView = function(title, bgImgUrl) {
    const tourModalView = document.getElementById('tourModalView');
    const tourViewTitle = document.getElementById('tourViewTitle');
    const tourModal = document.getElementById('tourModal');

    if (tourModalView && tourViewTitle) {
        tourModalView.style.backgroundImage = `url('${bgImgUrl}')`;
        tourViewTitle.innerText = title;
    }

    if (tourModal && !tourModal.classList.contains('open')) {
        tourModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    showToast('360° Room Loaded', `Now viewing: ${title}`);
};

// Global Lifestyle Amenity Detail Opener
window.openAmenityDetail = function(title, desc, imgUrl) {
    const propModal = document.getElementById('propertyModal');
    const propModalTitle = document.getElementById('propModalTitle');
    const propModalDesc = document.querySelector('.prop-modal-desc');
    const propModalImg = document.getElementById('propModalImg');
    const propModalPrice = document.getElementById('propModalPrice');
    const propModalAddress = document.getElementById('propModalAddress');

    if (propModalTitle) propModalTitle.innerText = title;
    if (propModalDesc) propModalDesc.innerText = desc;
    if (propModalImg) propModalImg.style.backgroundImage = `url('${imgUrl}')`;
    if (propModalPrice) propModalPrice.innerText = 'Exclusive Amenity';
    if (propModalAddress) propModalAddress.innerHTML = '<i class="fa-solid fa-gem"></i> Clubhouse Level 1';

    if (propModal) {
        propModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Navigation Sticky on Scroll & Scroll-To-Top
    // ==========================================================================
    const navbar = document.getElementById('main-nav');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        
        if (navbar && !document.body.classList.contains('inner-page')) {
            if (scrollPos > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        if (scrollTopBtn) {
            if (scrollPos > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // 2. Offcanvas Mobile Drawer
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-nav-item');

    function openDrawer() {
        if (mobileDrawer) mobileDrawer.classList.add('open');
        if (drawerOverlay) drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        if (mobileDrawer) mobileDrawer.classList.remove('open');
        if (drawerOverlay) drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // ==========================================================================
    // 3. Hero Automatic & Interactive Carousel
    // ==========================================================================
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.h-dot');
    const heroSlidePrev = document.getElementById('heroSlidePrev');
    const heroSlideNext = document.getElementById('heroSlideNext');
    let currentHeroSlide = 0;
    let heroAutoTimer = null;

    function goToHeroSlide(index) {
        if (!heroSlides.length) return;
        heroSlides.forEach(slide => slide.classList.remove('active'));
        if (heroDots.length) heroDots.forEach(dot => dot.classList.remove('active'));

        currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
        heroSlides[currentHeroSlide].classList.add('active');
        if (heroDots[currentHeroSlide]) heroDots[currentHeroSlide].classList.add('active');
    }

    function startHeroTimer() {
        if (heroSlides.length <= 1) return;
        clearInterval(heroAutoTimer);
        heroAutoTimer = setInterval(() => {
            goToHeroSlide(currentHeroSlide + 1);
        }, 8000);
    }

    if (heroSlideNext) {
        heroSlideNext.addEventListener('click', () => {
            goToHeroSlide(currentHeroSlide + 1);
            startHeroTimer();
        });
    }

    if (heroSlidePrev) {
        heroSlidePrev.addEventListener('click', () => {
            goToHeroSlide(currentHeroSlide - 1);
            startHeroTimer();
        });
    }

    heroDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-slide'));
            goToHeroSlide(idx);
            startHeroTimer();
        });
    });

    if (heroSlides.length > 1) {
        startHeroTimer();
    }

    // ==========================================================================
    // 4. Hero Search Form & Filter Tabs
    // ==========================================================================
    const searchTabs = document.querySelectorAll('.search-tab');
    searchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            searchTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showToast('Filter Mode Changed', `Switched mode to: ${tab.innerText.toUpperCase()}`);
        });
    });

    const searchPropertiesForm = document.getElementById('searchPropertiesForm');
    if (searchPropertiesForm) {
        searchPropertiesForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const loc = document.getElementById('searchLocationInput').value;
            const type = document.getElementById('searchTypeSelect').value;
            showToast('Searching Residences', `Filtering residences in "${loc}" matching type: ${type}`);

            const propSection = document.getElementById('properties');
            if (propSection) {
                propSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ==========================================================================
    // 5. Featured Properties Sliding Carousel & Category Filtering
    // ==========================================================================
    const propCardsSlider = document.getElementById('propertyCardsContainer');
    const propPrev = document.getElementById('propPrev');
    const propNext = document.getElementById('propNext');
    const propDots = document.querySelectorAll('.p-dot');
    let propSlideIndex = 0;

    function getCardSlideWidth() {
        const firstCard = propCardsSlider ? propCardsSlider.querySelector('.property-card') : null;
        if (!firstCard) return 350;
        return firstCard.offsetWidth + 30; // card width + gap
    }

    function updatePropSlider() {
        if (!propCardsSlider) return;
        const width = getCardSlideWidth();
        propCardsSlider.style.transform = `translateX(-${propSlideIndex * width}px)`;

        propDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === propSlideIndex);
        });
    }

    if (propNext) {
        propNext.addEventListener('click', () => {
            const maxIndex = window.innerWidth <= 768 ? 3 : window.innerWidth <= 1150 ? 2 : 1;
            propSlideIndex = (propSlideIndex + 1) % (maxIndex + 1);
            updatePropSlider();
        });
    }

    if (propPrev) {
        propPrev.addEventListener('click', () => {
            const maxIndex = window.innerWidth <= 768 ? 3 : window.innerWidth <= 1150 ? 2 : 1;
            propSlideIndex = (propSlideIndex - 1 + (maxIndex + 1)) % (maxIndex + 1);
            updatePropSlider();
        });
    }

    propDots.forEach(dot => {
        dot.addEventListener('click', () => {
            propSlideIndex = parseInt(dot.getAttribute('data-index')) || 0;
            updatePropSlider();
        });
    });

    // Category Filter Buttons
    const filterButtons = document.querySelectorAll('.prop-filter-btn');
    const propertyCards = document.querySelectorAll('.property-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            propSlideIndex = 0;
            updatePropSlider();

            propertyCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || category.includes(filterValue)) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });

            showToast('Filter Applied', `Showing: ${btn.innerText}`);
        });
    });

    // Footer Quick Filter links
    document.querySelectorAll('.footer-filter-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = link.getAttribute('data-filter');
            const targetBtn = document.querySelector(`.prop-filter-btn[data-filter="${filter}"]`);
            if (targetBtn) targetBtn.click();
            document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ==========================================================================
    // 6. Testimonials Sliding Carousel
    // ==========================================================================
    const testimonialTrack = document.getElementById('testimonialCardsTrack');
    const tPrev = document.getElementById('tPrev');
    const tNext = document.getElementById('tNext');
    const tDots = document.querySelectorAll('.t-dot');
    let tSlideIndex = 0;

    function getTestiSlideWidth() {
        const firstCard = testimonialTrack ? testimonialTrack.querySelector('.testi-card') : null;
        if (!firstCard) return 350;
        return firstCard.offsetWidth + 30;
    }

    function updateTestiSlider() {
        if (!testimonialTrack) return;
        const width = getTestiSlideWidth();
        testimonialTrack.style.transform = `translateX(-${tSlideIndex * width}px)`;

        tDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === tSlideIndex);
        });
    }

    if (tNext) {
        tNext.addEventListener('click', () => {
            const maxIndex = window.innerWidth <= 768 ? 3 : window.innerWidth <= 1150 ? 2 : 1;
            tSlideIndex = (tSlideIndex + 1) % (maxIndex + 1);
            updateTestiSlider();
        });
    }

    if (tPrev) {
        tPrev.addEventListener('click', () => {
            const maxIndex = window.innerWidth <= 768 ? 3 : window.innerWidth <= 1150 ? 2 : 1;
            tSlideIndex = (tSlideIndex - 1 + (maxIndex + 1)) % (maxIndex + 1);
            updateTestiSlider();
        });
    }

    tDots.forEach(dot => {
        dot.addEventListener('click', () => {
            tSlideIndex = parseInt(dot.getAttribute('data-index')) || 0;
            updateTestiSlider();
        });
    });

    // ==========================================================================
    // 7. Property Quick View Modal Logic
    // ==========================================================================
    const propertyModal = document.getElementById('propertyModal');
    const closePropertyModalBtn = document.getElementById('closePropertyModalBtn');
    const propModalTitle = document.getElementById('propModalTitle');
    const propModalPrice = document.getElementById('propModalPrice');
    const propModalAddress = document.getElementById('propModalAddress');
    const propModalBeds = document.getElementById('propModalBeds');
    const propModalBaths = document.getElementById('propModalBaths');
    const propModalArea = document.getElementById('propModalArea');
    const propModalImg = document.getElementById('propModalImg');

    function openPropertyModal(card) {
        if (!propertyModal) return;
        propModalTitle.innerText = card.getAttribute('data-title') || 'Luxury Villa';
        propModalPrice.innerText = card.getAttribute('data-price') || '₹ 5.8 Cr*';
        propModalAddress.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${card.getAttribute('data-location') || 'Beverly Hills'}`;
        propModalBeds.innerText = card.getAttribute('data-beds') || '4 Beds';
        propModalBaths.innerText = card.getAttribute('data-baths') || '4 Baths';
        propModalArea.innerText = card.getAttribute('data-area') || '3,500 Sq.Ft';
        propModalImg.style.backgroundImage = `url('${card.getAttribute('data-img') || 'assets/the_residences.jpg'}')`;

        propertyModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    // Connect all card action buttons
    document.querySelectorAll('.quick-prop-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.property-card');
            if (card) openPropertyModal(card);
        });
    });

    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const propName = btn.getAttribute('data-prop');
            const matchCard = document.querySelector(`.property-card[data-title="${propName}"]`);
            if (matchCard) openPropertyModal(matchCard);
        });
    });

    if (closePropertyModalBtn) {
        closePropertyModalBtn.addEventListener('click', () => {
            propertyModal.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // ==========================================================================
    // 8. VIP Inquiry Consultation Modal Logic
    // ==========================================================================
    const inquiryModal = document.getElementById('inquiryModal');
    const closeInquiryModalBtn = document.getElementById('closeInquiryModalBtn');
    const inquiryForm = document.getElementById('inquiryForm');

    document.querySelectorAll('.open-inquiry-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (propertyModal && propertyModal.classList.contains('open')) {
                propertyModal.classList.remove('open');
            }
            if (inquiryModal) {
                inquiryModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (closeInquiryModalBtn) {
        closeInquiryModalBtn.addEventListener('click', () => {
            inquiryModal.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('inqName').value;
            const prop = document.getElementById('inqProperty').value;

            inquiryModal.classList.remove('open');
            document.body.style.overflow = '';
            inquiryForm.reset();

            showToast('Consultation Booked', `Thank you ${name}. Our concierge team has reserved your private tour for ${prop}.`);
        });
    }

    // ==========================================================================
    // 9. Interactive Smart Mortgage Calculator
    // ==========================================================================
    const homePriceInput = document.getElementById('homePrice');
    const homePriceVal = document.getElementById('homePriceVal');
    const downPaymentInput = document.getElementById('downPayment');
    const downPaymentVal = document.getElementById('downPaymentVal');
    const loanTenureInput = document.getElementById('loanTenure');
    const interestRateInput = document.getElementById('interestRate');

    const emiDisplay = document.getElementById('emiDisplay');
    const principalVal = document.getElementById('principalVal');
    const interestTotalVal = document.getElementById('interestTotalVal');
    const totalPayableVal = document.getElementById('totalPayableVal');

    function formatINR(number) {
        return '₹ ' + Math.round(number).toLocaleString('en-IN');
    }

    function calculateMortgage() {
        if (!homePriceInput) return;

        const propertyPrice = parseFloat(homePriceInput.value);
        const downPaymentPercent = parseFloat(downPaymentInput.value);
        const downPaymentAmt = (propertyPrice * downPaymentPercent) / 100;
        const loanPrincipal = propertyPrice - downPaymentAmt;

        const tenureYears = parseFloat(loanTenureInput.value);
        const annualRate = parseFloat(interestRateInput.value);
        const monthlyRate = (annualRate / 12) / 100;
        const totalMonths = tenureYears * 12;

        let emi = 0;
        if (monthlyRate > 0) {
            emi = (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        } else {
            emi = loanPrincipal / totalMonths;
        }

        const totalPayable = emi * totalMonths;
        const totalInterest = totalPayable - loanPrincipal;

        homePriceVal.innerText = formatINR(propertyPrice);
        downPaymentVal.innerText = `${formatINR(downPaymentAmt)} (${downPaymentPercent}%)`;
        emiDisplay.innerHTML = `${formatINR(emi)}<small>/mo</small>`;
        principalVal.innerText = formatINR(loanPrincipal);
        interestTotalVal.innerText = formatINR(totalInterest);
        totalPayableVal.innerText = formatINR(totalPayable);
    }

    if (homePriceInput) homePriceInput.addEventListener('input', calculateMortgage);
    if (downPaymentInput) downPaymentInput.addEventListener('input', calculateMortgage);
    if (loanTenureInput) loanTenureInput.addEventListener('change', calculateMortgage);
    if (interestRateInput) interestRateInput.addEventListener('input', calculateMortgage);

    calculateMortgage();

    // ==========================================================================
    // 10. FAQ Accordion Toggle
    // ==========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ==========================================================================
    // 11. Favorite Heart Toggle Button
    // ==========================================================================
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const icon = btn.querySelector('i');
            if (icon.classList.contains('fa-regular')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                icon.style.color = '#e53935';
                showToast('Saved to Wishlist', 'Property added to your private favorites collection.');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                icon.style.color = '';
                showToast('Removed from Wishlist', 'Property removed from your saved list.');
            }
        });
    });

    // ==========================================================================
    // 12. Newsletter Form
    // ==========================================================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail').value;
            newsletterForm.reset();
            showToast('Subscribed!', `A luxury portfolio catalog has been dispatched to: ${email}`);
        });
    }

    // ==========================================================================
    // 13. Number Counters & Scroll Observer
    // ==========================================================================
    const countElements = document.querySelectorAll('[data-target]');
    let hasCounted = false;

    function runCounters() {
        countElements.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.innerText.includes('k') ? 'k+' : counter.innerText.includes('+') ? '+' : '';
            const duration = 1800;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const updateNumber = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.innerText = target.toLocaleString() + suffix;
                    clearInterval(updateNumber);
                } else {
                    counter.innerText = Math.floor(current).toLocaleString() + suffix;
                }
            }, stepTime);
        });
    }

    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                if (!hasCounted && (entry.target.classList.contains('hero-stats-row') || entry.target.classList.contains('stats-counter-strip'))) {
                    runCounters();
                    hasCounted = true;
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Modals Backdrop Click & Escape Key
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
            document.body.style.overflow = '';
        }
    });

    // Story Video Modal triggers
    const watchTourBtn = document.getElementById('watchTourBtn');
    const videoModal = document.getElementById('videoModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (watchTourBtn && videoModal) {
        watchTourBtn.addEventListener('click', () => {
            videoModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }
    if (closeModalBtn && videoModal) {
        closeModalBtn.addEventListener('click', () => {
            videoModal.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    const startTourBtn = document.getElementById('startTourBtn');
    const tourModal = document.getElementById('tourModal');
    const closeTourModalBtn = document.getElementById('closeTourModalBtn');
    if (startTourBtn && tourModal) {
        startTourBtn.addEventListener('click', () => {
            tourModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }
    if (closeTourModalBtn && tourModal) {
        closeTourModalBtn.addEventListener('click', () => {
            tourModal.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // Smooth link navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
