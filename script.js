// Global variables
let currentSection = 0;
const sections = ['opening', 'greeting', 'quotes', 'mempelai', 'akad', 'resepsi', 'map', 'rsvp', 'gift', 'penutup'];
let isScrolling = false;
let invitationOpened = false; // Flag to track if invitation has been opened

// DOM elements
let navButtons;
let navDots;
let mobileContainer;
let sectionElements;
let blurContainers;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize invitation lock first
    initializeInvitationLock();
    
    initializeElements();
    initializePageAnimations();
    initializeNavigation();
    initializeScrollHandling();
    initializeKeyboardNavigation();
    initializeFormHandling();
    initializeOpenInvitationButton();
    
    // Set initial active section
    showSection(0);
    updateActiveNavigation(0);
    
    // Initialize navigation visibility
    setTimeout(() => {
        updateNavigationVisibility();
    }, 100);
});

// Initialize Invitation Lock
function initializeInvitationLock() {
    // Add lock class to body to disable interactions
    document.body.classList.add('invitation-locked');
    
    // Disable scroll and touch events
    document.addEventListener('wheel', preventDefaultEvent, { passive: false });
    document.addEventListener('touchmove', preventDefaultEvent, { passive: false });
    document.addEventListener('keydown', preventKeyboardNavigation, { passive: false });
}

// Prevent default events when invitation is locked
function preventDefaultEvent(e) {
    if (document.body.classList.contains('invitation-locked')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}

// Prevent keyboard navigation when invitation is locked
function preventKeyboardNavigation(e) {
    if (document.body.classList.contains('invitation-locked')) {
        // Prevent arrow keys, space, page up/down, home, end
        const preventedKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
        if (preventedKeys.includes(e.keyCode)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
}

// Initialize Open Invitation Button
function initializeOpenInvitationButton() {
    const openBtn = document.getElementById('openInvitationBtn');
    const openingSection = document.getElementById('opening');
    const bottomNav = document.getElementById('bottomNav');
    const navIndicator = document.getElementById('navIndicator');
    
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            // Mark invitation as opened
            invitationOpened = true;
            
            // Remove lock class from body to enable interactions
            document.body.classList.remove('invitation-locked');
            
            // Remove event listeners
            document.removeEventListener('wheel', preventDefaultEvent);
            document.removeEventListener('touchmove', preventDefaultEvent);
            document.removeEventListener('keydown', preventKeyboardNavigation);
            
            // Hide the opening section with animation
            if (openingSection) {
                openingSection.classList.add('hidden');
                openingSection.classList.remove('invitation-locked-section');
                
                // Remove section from view after animation
                setTimeout(() => {
                    openingSection.style.display = 'none';
                }, 500);
            }
            
            // Show navigation and navigate to next section
            setTimeout(() => {
                if (bottomNav) {
                    bottomNav.style.display = 'flex';
                    bottomNav.style.opacity = '0';
                    bottomNav.style.transition = 'opacity 0.3s ease-in';
                    setTimeout(() => {
                        bottomNav.style.opacity = '1';
                    }, 100);
                }
                
                if (navIndicator) {
                    navIndicator.style.display = 'flex';
                    navIndicator.style.opacity = '0';
                    navIndicator.style.transition = 'opacity 0.3s ease-in';
                    setTimeout(() => {
                        navIndicator.style.opacity = '1';
                    }, 100);
                }
                
                // Navigate to greeting section
                scrollToSection(1);
            }, 600);
        });
    }
}

// Initialize DOM elements
function initializeElements() {
    navButtons = document.querySelectorAll('.nav-btn');
    navDots = document.querySelectorAll('.nav-dot');
    mobileContainer = document.querySelector('.mobile-container');
    sectionElements = document.querySelectorAll('.section-snap');
    blurContainers = document.querySelectorAll('.blur-container');
}

// Initialize page-like animations - no blur container animations
function initializePageAnimations() {
    // Hide all sections initially except the first one
    sectionElements.forEach((section, index) => {
        if (index === 0) {
            section.classList.add('section-visible');
            const blurContainer = section.querySelector('.blur-container');
            if (blurContainer) {
                // No animation delay - show immediately
                blurContainer.classList.add('container-visible');
            }
        } else {
            section.style.display = 'none';
        }
    });
}

// Show specific section with instant transition
function showSection(index) {
    if (index === currentSection) return;
    
    const currentSectionEl = sectionElements[currentSection];
    const targetSectionEl = sectionElements[index];
    
    // Hide current section instantly
    if (currentSectionEl) {
        currentSectionEl.style.display = 'none';
        currentSectionEl.classList.remove('section-visible', 'section-active');
        currentSectionEl.classList.add('section-hidden');
        
        const currentBlur = currentSectionEl.querySelector('.blur-container');
        if (currentBlur) {
            currentBlur.classList.remove('container-visible', 'container-animate');
        }
    }
    
    // Show target section with entrance animation
    targetSectionEl.style.display = 'flex';
    targetSectionEl.classList.remove('section-hidden');
    targetSectionEl.classList.add('section-active');
    
    // Hide "Buka Undangan" button if returning to opening section after it was clicked
    if (index === 0 && invitationOpened) {
        const openBtn = document.getElementById('openInvitationBtn');
        if (openBtn) {
            openBtn.style.display = 'none';
        }
    }
    
    // Instant display - no animation delays
    targetSectionEl.classList.add('section-visible');
    
    const targetBlur = targetSectionEl.querySelector('.blur-container');
    if (targetBlur) {
        // Show blur container immediately without animation
        targetBlur.classList.add('container-visible');
    }
    
    currentSection = index;
    
    // Update navigation state
    updateActiveNavigation(index);
    
    // Update navigation visibility when section changes
    updateNavigationVisibility();
}

// Initialize navigation functionality
function initializeNavigation() {
    // Add click handlers to navigation buttons
    navButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            showSection(index);
            updateActiveNavigation(index);
        });
    });
    
    // Add click handlers to navigation dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            scrollToSection(index);
        });
    });
    
    // Add scroll listener to navigation container for visual feedback
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
        navContainer.addEventListener('scroll', debounce(() => {
            updateNavigationVisibility();
        }, 100));
    }
}

// Update navigation button visibility based on scroll position
function updateNavigationVisibility() {
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;
    
    const containerRect = navContainer.getBoundingClientRect();
    const containerLeft = containerRect.left;
    const containerRight = containerRect.right;
    
    navButtons.forEach((btn, index) => {
        const btnRect = btn.getBoundingClientRect();
        const btnCenter = btnRect.left + (btnRect.width / 2);
        
        // Check if button center is within visible area
        const isVisible = btnCenter >= containerLeft && btnCenter <= containerRight;
        
        // Add subtle opacity effect for buttons at edges
        if (isVisible) {
            btn.style.opacity = '1';
            btn.style.transform = btn.classList.contains('active') ? 'translateY(-4px)' : 'translateY(0)';
        } else {
            btn.style.opacity = '0.6';
        }
    });
}

// Initialize scroll handling for page-like transitions
function initializeScrollHandling() {
    // Disable traditional scrolling
    mobileContainer.style.overflow = 'hidden';
    
    // Simple debounce for scroll events
    let scrollTimeout = null;
    let isHandlingScroll = false;
    
    function handleScrollNavigation(direction) {
        if (isHandlingScroll || isScrolling || !invitationOpened) return;
        
        isHandlingScroll = true;
        
        // Clear any existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Set timeout to reset the flag
        scrollTimeout = setTimeout(() => {
            isHandlingScroll = false;
            scrollTimeout = null;
        }, 500);
        
        if (direction > 0) {
            // Scroll down - next section
            if (currentSection < sections.length - 1) {
                showSection(currentSection + 1);
                updateActiveNavigation(currentSection + 1);
            }
        } else if (direction < 0) {
            // Scroll up - previous section
            if (currentSection > 0) {
                showSection(currentSection - 1);
                updateActiveNavigation(currentSection - 1);
            }
        }
    }
    
    // Wheel event handler for desktop
    function wheelHandler(e) {
        // Check if target is an interactive element
        if (e.target.closest('form, input, select, button, textarea, a, [contenteditable]')) {
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        // Determine scroll direction
        const delta = e.deltaY || e.detail || e.wheelDelta;
        handleScrollNavigation(delta);
    }
    
    // Add wheel event listeners
    document.addEventListener('wheel', wheelHandler, { passive: false });
    document.addEventListener('DOMMouseScroll', wheelHandler, { passive: false });
    
    // For older browsers
    document.addEventListener('mousewheel', wheelHandler, { passive: false });
}

// Initialize keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                const nextSection = Math.min(currentSection + 1, sections.length - 1);
                if (nextSection !== currentSection) {
                    showSection(nextSection);
                    updateActiveNavigation(nextSection);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                const prevSection = Math.max(currentSection - 1, 0);
                if (prevSection !== currentSection) {
                    showSection(prevSection);
                    updateActiveNavigation(prevSection);
                }
                break;
            case 'Home':
                e.preventDefault();
                showSection(0);
                updateActiveNavigation(0);
                break;
            case 'End':
                e.preventDefault();
                showSection(sections.length - 1);
                updateActiveNavigation(sections.length - 1);
                break;
        }
    });
}

// Initialize form handling
function initializeFormHandling() {
    // RSVP Form
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', handleRSVPSubmit);
    }
    
    // Message Form
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', handleMessageSubmit);
    }
}

// Legacy function - kept for compatibility
function scrollToSection(index) {
    if (!invitationOpened) return;
    showSection(index);
    updateActiveNavigation(index);
}

// Debounce function for performance optimization
function debounce(func, wait) {
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

// Update current section based on scroll position
function updateCurrentSection() {
    const scrollTop = mobileContainer.scrollTop;
    const sectionHeight = window.innerHeight;
    const newSection = Math.round(scrollTop / sectionHeight);
    
    if (newSection !== currentSection && newSection >= 0 && newSection < sections.length) {
        updateActiveSection(newSection);
        updateActiveNavigation(newSection);
    }
}

// Update active section
function updateActiveSection(index) {
    currentSection = index;
    
    // Update navigation buttons
    navButtons.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    // Update navigation dots
    navDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Update active navigation state
function updateActiveNavigation(index) {
    if (!navButtons[index]) return;
    
    // Remove active class from all buttons
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to current button
    navButtons[index].classList.add('active');
    
    // Auto-scroll navigation container to show active item
    scrollNavigationToActiveItem(index);
}

// Auto-scroll navigation container to show active item
function scrollNavigationToActiveItem(index) {
    if (!navButtons[index]) return;
    
    const targetButton = navButtons[index];
    const navContainer = targetButton.parentElement;
    const buttonRect = targetButton.getBoundingClientRect();
    const containerRect = navContainer.getBoundingClientRect();
    
    // Calculate if button is visible in container
    const buttonLeft = buttonRect.left - containerRect.left;
    const buttonRight = buttonLeft + buttonRect.width;
    const containerWidth = containerRect.width;
    
    // Calculate scroll position to center the active button
    const buttonCenter = buttonLeft + (buttonRect.width / 2);
    const containerCenter = containerWidth / 2;
    const scrollOffset = buttonCenter - containerCenter;
    
    // Smooth scroll to position
    navContainer.scrollTo({
        left: navContainer.scrollLeft + scrollOffset,
        behavior: 'smooth'
    });
}

// Handle RSVP form submission
function handleRSVPSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Mengirim...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        alert('Terima kasih! Konfirmasi kehadiran Anda telah diterima.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        e.target.reset();
    }, 2000);
}

// Handle message form submission
function handleMessageSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Mengirim...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        alert('Terima kasih! Pesan Anda telah terkirim.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        e.target.reset();
    }, 2000);
}

// Utility functions
function debounce(func, wait) {
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

// Enhanced scroll handling with debounce
const debouncedUpdateSection = debounce(updateCurrentSection, 150);

// Add smooth animations to elements when they come into view
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section-snap').forEach(section => {
        observer.observe(section);
    });
}

// Initialize scroll animations when DOM is ready
document.addEventListener('DOMContentLoaded', addScrollAnimations);

// Handle window resize
window.addEventListener('resize', debounce(() => {
    updateNavigationSlider(currentSection);
}, 250));

// Enhanced touch support for mobile devices
let touchStartY = 0;
let touchEndY = 0;
let touchStartX = 0;
let touchEndX = 0;
let touchStartTime = 0;
let touchTimeout;

function initializeTouchHandling() {
    let isTouchHandling = false;
    
    // Touch start handler
    function touchStartHandler(e) {
        // Skip if target is an interactive element
        if (e.target.closest('form, input, select, button, textarea, a, [contenteditable]')) {
            return;
        }
        
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
        isTouchHandling = false;
    }
    
    // Touch end handler
    function touchEndHandler(e) {
        // Skip if target is an interactive element
        if (e.target.closest('form, input, select, button, textarea, a, [contenteditable]')) {
            return;
        }
        
        if (isTouchHandling || isScrolling || !invitationOpened) return;
        
        touchEndY = e.changedTouches[0].clientY;
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }
    
    // Touch move handler to prevent default scrolling
    function touchMoveHandler(e) {
        // Skip if target is an interactive element
        if (e.target.closest('form, input, select, button, textarea, a, [contenteditable]')) {
            return;
        }
        
        // Prevent default scrolling behavior
        e.preventDefault();
    }
    
    // Add touch events
    document.addEventListener('touchstart', touchStartHandler, { passive: true });
    document.addEventListener('touchend', touchEndHandler, { passive: true });
    document.addEventListener('touchmove', touchMoveHandler, { passive: false });
}

function handleSwipe() {
    // Prevent multiple swipe handling
    if (isScrolling || touchTimeout || !invitationOpened) return;
    
    // Set debounce timeout
    touchTimeout = setTimeout(() => {
        touchTimeout = null;
    }, 400);
    
    const swipeThreshold = 50; // Minimum distance for swipe
    const maxSwipeTime = 800; // Maximum time for valid swipe
    
    const swipeDistanceY = touchStartY - touchEndY;
    const swipeDistanceX = Math.abs(touchStartX - touchEndX);
    const swipeTime = Date.now() - touchStartTime;
    
    // Check if it's a valid vertical swipe
    if (Math.abs(swipeDistanceY) > swipeThreshold && 
        swipeDistanceX < Math.abs(swipeDistanceY) * 0.5 && 
        swipeTime < maxSwipeTime) {
        
        if (swipeDistanceY > 0) {
            // Swipe up - go to next section
            if (currentSection < sections.length - 1) {
                showSection(currentSection + 1);
                updateActiveNavigation(currentSection + 1);
            }
        } else {
            // Swipe down - go to previous section
            if (currentSection > 0) {
                showSection(currentSection - 1);
                updateActiveNavigation(currentSection - 1);
            }
        }
    }
}

// Initialize touch handling
initializeTouchHandling();

// Initialize AOS (Animate On Scroll) with optimal settings
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800, // Animation duration in milliseconds
        easing: 'ease-in-out', // Easing function
        once: true, // Animation happens only once
        mirror: false, // Elements don't animate out while scrolling past them
        offset: 100, // Offset (in px) from the original trigger point
        delay: 0, // Delay animation (in ms)
        anchorPlacement: 'top-bottom', // Defines which position of the element regarding to window should trigger the animation
        disable: false, // Disable AOS on specific conditions
        startEvent: 'DOMContentLoaded', // Name of the event dispatched on the document
        animatedClassName: 'aos-animate', // Class applied on animation
        initClassName: 'aos-init', // Class applied after initialization
        useClassNames: false, // If true, will add content of `data-aos` as classes on scroll
        disableMutationObserver: false, // Disables automatic mutations' detections
        debounceDelay: 50, // The delay on debounce used while resizing window
        throttleDelay: 99, // The delay on throttle used while scrolling the page
    });
    
    // Refresh AOS when sections change to ensure animations work properly
    const originalShowSection = window.showSection;
    if (originalShowSection) {
        window.showSection = function(index) {
            originalShowSection(index);
            // Small delay to ensure DOM is updated before refreshing AOS
            setTimeout(() => {
                AOS.refresh();
            }, 100);
        };
    }
});

// Export functions for global access if needed
window.scrollToSection = scrollToSection;
window.updateActiveNavigation = updateActiveNavigation;