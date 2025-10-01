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
    initializeElements();
    initializePageAnimations();
    initializeNavigation();
    initializeScrollHandling();
    initializeKeyboardNavigation();
    initializeFormHandling();
    initializeOpenInvitationButton();
    
    // Set initial active section
    showSection(0);
    updateNavigationSlider(0);
    
    // Initialize navigation visibility
    setTimeout(() => {
        updateNavigationVisibility();
    }, 100);
});

// Initialize Open Invitation Button
function initializeOpenInvitationButton() {
    const openBtn = document.getElementById('openInvitationBtn');
    const bottomNav = document.getElementById('bottomNav');
    const navIndicator = document.getElementById('navIndicator');
    
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            // Mark invitation as opened
            invitationOpened = true;
            
            // Hide the button immediately with fade out animation
            openBtn.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            openBtn.style.opacity = '0';
            openBtn.style.transform = 'scale(0.8)';
            
            // Show navigation and navigate to next section
            setTimeout(() => {
                // Completely hide the button
                openBtn.style.display = 'none';
                
                // Show navigation elements
                if (bottomNav) {
                    bottomNav.style.display = 'block';
                }
                if (navIndicator) {
                    navIndicator.style.display = 'block';
                }
                
                // Navigate to greeting section
                scrollToSection(1);
            }, 300);
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

// Initialize page-like animations
function initializePageAnimations() {
    // Hide all sections initially except the first one
    sectionElements.forEach((section, index) => {
        if (index === 0) {
            section.classList.add('section-visible');
            const blurContainer = section.querySelector('.blur-container');
            if (blurContainer) {
                setTimeout(() => {
                    blurContainer.classList.add('container-visible');
                }, 300);
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
    
    // Quick entrance animation
    setTimeout(() => {
        targetSectionEl.classList.add('section-visible');
        
        const targetBlur = targetSectionEl.querySelector('.blur-container');
        if (targetBlur) {
            targetBlur.classList.add('container-visible');
        }
        
        currentSection = index;
        
        // Update navigation state
        updateActiveNavigation(index);
        
        // Update navigation visibility when section changes
        updateNavigationVisibility();
    }, 50);
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
    
    // Handle wheel events for page transitions
    mobileContainer.addEventListener('wheel', (e) => {
        // Only handle wheel events if not on interactive elements
        if (!e.target.closest('form, input, select, button, textarea, a')) {
            e.preventDefault();
            
            if (e.deltaY > 0) {
                // Scroll down - next section
                const nextSection = Math.min(currentSection + 1, sections.length - 1);
                if (nextSection !== currentSection) {
                    showSection(nextSection);
                    updateNavigationSlider(nextSection);
                }
            } else {
                // Scroll up - previous section
                const prevSection = Math.max(currentSection - 1, 0);
                if (prevSection !== currentSection) {
                    showSection(prevSection);
                    updateNavigationSlider(prevSection);
                }
            }
        }
    }, { passive: false });
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
                    updateNavigationSlider(nextSection);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                const prevSection = Math.max(currentSection - 1, 0);
                if (prevSection !== currentSection) {
                    showSection(prevSection);
                    updateNavigationSlider(prevSection);
                }
                break;
            case 'Home':
                e.preventDefault();
                showSection(0);
                updateNavigationSlider(0);
                break;
            case 'End':
                e.preventDefault();
                showSection(sections.length - 1);
                updateNavigationSlider(sections.length - 1);
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
    showSection(index);
    updateNavigationSlider(index);
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
        updateNavigationSlider(newSection);
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

// Enhanced wheel event handling for section transitions
// Add touch support for mobile devices
let touchStartY = 0;
let touchEndY = 0;

// Only apply touch events to the mobile container, not to content within sections
mobileContainer.addEventListener('touchstart', (e) => {
    // Only handle touch if it's not on interactive elements
    if (!e.target.closest('form, input, select, button, textarea, a')) {
        touchStartY = e.changedTouches[0].screenY;
    }
}, { passive: true });

mobileContainer.addEventListener('touchend', (e) => {
    // Only handle touch if it's not on interactive elements
    if (!e.target.closest('form, input, select, button, textarea, a')) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }
}, { passive: true });

function handleSwipe() {
    // Prevent swipe if already transitioning
    if (isScrolling) return;
    
    const swipeThreshold = 50;
    const swipeDistance = touchStartY - touchEndY;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0 && currentSection < sections.length - 1) {
            // Swipe up - go to next section
            showSection(currentSection + 1);
            updateNavigationSlider(currentSection + 1);
        } else if (swipeDistance < 0 && currentSection > 0) {
            // Swipe down - go to previous section
            showSection(currentSection - 1);
            updateNavigationSlider(currentSection - 1);
        }
    }
}

// Export functions for global access if needed
window.scrollToSection = scrollToSection;
window.updateNavigationSlider = updateNavigationSlider;