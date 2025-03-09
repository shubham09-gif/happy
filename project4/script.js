document.addEventListener('DOMContentLoaded', function() {
    // Configuration options
    const config = {
        typeSpeed: 30,
        fadeInDelay: 500,
        pulseDelay: 1000,
        letterContent: "baad m likha jayega",
        cursorChar: '|',
        particleCount: 100,
        confettiSpread: 70
    };
    
    // Cache DOM elements
    const elements = {
        container: document.querySelector('.container'),
        surpriseButton: document.getElementById('surprise-button'),
        modalOverlay: document.getElementById('modal-overlay'),
        modalClose: document.getElementById('modal-close'),
        clickSound: document.getElementById('click-sound'),
        musicToggle: document.getElementById('music-toggle'),
        musicIcon: document.getElementById('music-icon'),
        backgroundMusic: document.getElementById('background-music')
    };
    
    // State management
    let state = {
        isMusicPlaying: false,
        floatingElementsCreated: 0,
        maxFloatingElements: 15 // Limit for performance
    };
    
    // Initialize animations and effects
    function initialize() {
        initFadeIn();
        initTypewriter();
        initFloatingElements();
        initEventListeners();
    }
    
    // Fade in animation with improved timing
    function initFadeIn() {
        setTimeout(() => {
            if (elements.container) {
                elements.container.style.opacity = 1;
                elements.container.classList.add('animate__animated', 'animate__fadeIn');
            }
        }, config.fadeInDelay);
    }
    
    // Enhanced typewriter effect
    function initTypewriter() {
        if (!window.Typed || !document.getElementById('typed-text')) {
            console.error('Typed.js not loaded or typed-text element missing');
            return;
        }
        
        new Typed('#typed-text', {
            strings: [config.letterContent],
            typeSpeed: config.typeSpeed,
            showCursor: true,
            cursorChar: config.cursorChar,
            onComplete: function() {
                setTimeout(() => {
                    if (elements.surpriseButton) {
                        elements.surpriseButton.classList.add('animate__animated', 'animate__pulse', 'animate__infinite');
                        elements.surpriseButton.setAttribute('aria-label', 'Click for a surprise!');
                    }
                }, config.pulseDelay);
            }
        });
    }
    
    // Generate floating elements with improved variety
    function initFloatingElements() {
        const floatingElements = [
            { type: 'heart', color: '#ff6b8a', size: '20px' },
            { type: 'heart', color: '#f48fb1', size: '30px' },
            { type: 'star', color: '#ffd54f', size: '25px' },
            { type: 'star', color: '#ffecb3', size: '15px' },
            { type: 'teddy', emoji: '🧸', size: '30px' },
            { type: 'sparkle', emoji: '✨', size: '25px' },
            { type: 'sparkle', emoji: '✨', size: '20px' },
            { type: 'heart', color: '#ff6b8a', size: '25px' },
            { type: 'star', color: '#ffd54f', size: '20px' },
            { type: 'teddy', emoji: '🧸', size: '25px' },
            { type: 'flower', emoji: '🌸', size: '22px' },
            { type: 'balloon', emoji: '🎈', size: '28px' },
            { type: 'gift', emoji: '🎁', size: '26px' },
            { type: 'confetti', emoji: '🎊', size: '24px' },
            { type: 'cake', emoji: '🍰', size: '27px' }
        ];
        
        // Create initial floating elements
        floatingElements.forEach((element, index) => {
            if (index < state.maxFloatingElements) {
                createFloatingElement(element);
                state.floatingElementsCreated++;
            }
        });
        
        // Periodically add new elements
        setInterval(() => {
            if (state.floatingElementsCreated < state.maxFloatingElements) {
                const randomElement = floatingElements[Math.floor(Math.random() * floatingElements.length)];
                createFloatingElement(randomElement);
                state.floatingElementsCreated++;
            }
        }, 3000);
    }
    
    // Set up all event listeners
    function initEventListeners() {
        // Throttled cursor effect for performance
        let lastCursorTime = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastCursorTime > 50) { // Throttle to every 50ms
                createCursorEffect(e);
                lastCursorTime = now;
            }
        });
        
        // Surprise button functionality
        if (elements.surpriseButton && elements.modalOverlay) {
            elements.surpriseButton.addEventListener('click', handleSurpriseClick);
        }
        
        if (elements.modalClose && elements.modalOverlay) {
            elements.modalClose.addEventListener('click', () => {
                elements.modalOverlay.classList.remove('active');
            });
            
            // Allow clicking outside modal to close
            elements.modalOverlay.addEventListener('click', (e) => {
                if (e.target === elements.modalOverlay) {
                    elements.modalOverlay.classList.remove('active');
                }
            });
            
            // Add keyboard accessibility
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && elements.modalOverlay.classList.contains('active')) {
                    elements.modalOverlay.classList.remove('active');
                }
            });
        }
        
        // Music controls with better error handling
        if (elements.musicToggle && elements.musicIcon && elements.backgroundMusic) {
            elements.musicToggle.addEventListener('click', toggleMusic);
        }
        
        // Window resize handler for responsive behavior
        window.addEventListener('resize', debounce(() => {
            adjustFloatingElementPositions();
        }, 250));
    }
    
    // Handle surprise button click with enhanced effects
    function handleSurpriseClick() {
        // Play sound with fallback
        if (elements.clickSound) {
            elements.clickSound.volume = 0.5; // Lower volume for better UX
            const playPromise = elements.clickSound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('Audio play failed:', error);
                });
            }
        }
        
        // Show modal with animation
        if (elements.modalOverlay) {
            elements.modalOverlay.classList.add('active');
            elements.modalOverlay.classList.add('animate__animated', 'animate__fadeIn');
        }
        
        // Trigger confetti with improved parameters
        if (window.confetti) {
            const confettiSettings = {
                particleCount: config.particleCount,
                spread: config.confettiSpread,
                origin: { y: 0.6 },
                colors: ['#ff6b8a', '#f48fb1', '#ffd54f', '#ffecb3', '#a5d6a7', '#81c784'],
                scalar: 1.2
            };
            
            confetti(confettiSettings);
            
            // Add second burst for more fun
            setTimeout(() => {
                confettiSettings.origin.y = 0.7;
                confettiSettings.particleCount = 60;
                confetti(confettiSettings);
            }, 300);
        }
    }
    
    // Toggle background music with improved UX
    function toggleMusic() {
        if (state.isMusicPlaying) {
            elements.backgroundMusic.pause();
            elements.musicIcon.classList.remove('fa-volume-up');
            elements.musicIcon.classList.add('fa-volume-mute');
            elements.musicToggle.setAttribute('aria-label', 'Play music');
        } else {
            const playPromise = elements.backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        elements.musicIcon.classList.remove('fa-volume-mute');
                        elements.musicIcon.classList.add('fa-volume-up');
                        elements.musicToggle.setAttribute('aria-label', 'Pause music');
                    })
                    .catch(error => {
                        console.warn('Audio autoplay was prevented:', error);
                        // Show a UI hint about interacting first
                        showMusicPlayHint();
                    });
            }
        }
        state.isMusicPlaying = !state.isMusicPlaying;
    }
    
    // Show hint for music autoplay restrictions
    function showMusicPlayHint() {
        const hint = document.createElement('div');
        hint.className = 'music-hint animate__animated animate__fadeIn';
        hint.textContent = 'Click anywhere to enable music';
        document.body.appendChild(hint);
        
        // Remove hint after user interaction
        const removeHint = () => {
            hint.classList.add('animate__fadeOut');
            setTimeout(() => hint.remove(), 500);
            document.removeEventListener('click', removeHint);
        };
        
        document.addEventListener('click', removeHint);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(hint)) {
                removeHint();
            }
        }, 5000);
    }
    
    // Create floating element with improved animation
    function createFloatingElement(element) {
        const floatingElement = document.createElement('div');
        floatingElement.classList.add('floating-element');
        
        if (element.emoji) {
            floatingElement.textContent = element.emoji;
            floatingElement.style.fontSize = element.size;
        } else if (element.type === 'heart') {
            floatingElement.innerHTML = '<i class="fas fa-heart"></i>';
            floatingElement.style.color = element.color;
            floatingElement.style.fontSize = element.size;
        } else if (element.type === 'star') {
            floatingElement.innerHTML = '<i class="fas fa-star"></i>';
            floatingElement.style.color = element.color;
            floatingElement.style.fontSize = element.size;
        }
        
        // Improved random positioning within viewport
        const padding = 50; // Keep elements away from edges
        const randomX = padding + Math.random() * (window.innerWidth - (padding * 2));
        const randomY = padding + Math.random() * (window.innerHeight - (padding * 2));
        floatingElement.style.left = `${randomX}px`;
        floatingElement.style.top = `${randomY}px`;
        
        // More varied and natural animation
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 8;
        floatingElement.style.animationDuration = `${duration}s`;
        floatingElement.style.animationDelay = `${delay}s`;
        floatingElement.style.animationTimingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
        
        // Add removal after animation completes to manage DOM size
        floatingElement.addEventListener('animationend', () => {
            floatingElement.remove();
            state.floatingElementsCreated--;
        });
        
        document.body.appendChild(floatingElement);
        
        // Add subtle entrance animation
        setTimeout(() => {
            floatingElement.classList.add('animate__animated', 'animate__fadeIn');
        }, 10);
    }
    
    // Enhanced cursor effect with trails
    function createCursorEffect(e) {
        const cursorEffect = document.createElement('div');
        cursorEffect.classList.add('cursor-effect');
        
        // Position at cursor
        cursorEffect.style.left = `${e.pageX}px`;
        cursorEffect.style.top = `${e.pageY}px`;
        
        // Randomize appearance for variety
        const hue = Math.floor(Math.random() * 360);
        cursorEffect.style.backgroundColor = `hsla(${hue}, 100%, 75%, 0.7)`;
        
        document.body.appendChild(cursorEffect);
        
        // Smooth animation sequence
        requestAnimationFrame(() => {
            cursorEffect.style.opacity = 1;
            cursorEffect.style.transform = `translate(-50%, -50%) scale(${Math.random() * 0.7 + 0.3})`;
            
            setTimeout(() => {
                cursorEffect.style.opacity = 0;
                setTimeout(() => {
                    cursorEffect.remove();
                }, 500);
            }, 300);
        });
    }
    
    // Adjust floating elements on window resize
    function adjustFloatingElementPositions() {
        const floatingElements = document.querySelectorAll('.floating-element');
        const padding = 50;
        
        floatingElements.forEach(element => {
            // Check if element is outside viewport and reposition if needed
            const rect = element.getBoundingClientRect();
            
            if (rect.right > window.innerWidth || rect.left < 0 || 
                rect.bottom > window.innerHeight || rect.top < 0) {
                
                const randomX = padding + Math.random() * (window.innerWidth - (padding * 2));
                const randomY = padding + Math.random() * (window.innerHeight - (padding * 2));
                
                element.style.left = `${randomX}px`;
                element.style.top = `${randomY}px`;
            }
        });
    }
    
    // Utility: Debounce function for performance
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
    
    // Run initialization
    initialize();
});