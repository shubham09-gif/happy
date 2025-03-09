// Global variables
let candlesBlown = 0;
const totalCandles = 5;
let allCandlesBlown = false;
let audioContext;
let hasInteracted = false;

// Initialize the page when it loads
document.addEventListener('DOMContentLoaded', function() {
    // Add a class to enable page entry animation
    document.body.classList.add('page-enter');
    
    // Add plate element
    addPlate();
    
    // Create elements
    createCandles();
    createBalloons();
    createConfetti();
    createDecorations();
    createFrostingDrips();
    
    // Setup audio context for sound effects
    setupAudio();
    
    // Add event listeners for candle interaction
    document.querySelectorAll('.candle').forEach((candle, index) => {
        // Add custom sway animation with delay per candle
        candle.style.setProperty('--sway-delay', `${index * 0.3}s`);
        
        candle.addEventListener('click', function(e) {
            startAudioContextIfNeeded();
            blowOutCandle.call(this, e);
        });
        
        candle.addEventListener('touchstart', function(e) {
            startAudioContextIfNeeded();
            blowOutCandle.call(this, e);
            e.preventDefault(); // Prevent default touch behavior
        });
        
        // Use a touch-friendly approach
        candle.addEventListener('mouseover', function(e) {
            if (e.buttons === 1) { // Only trigger when mouse is down (dragging over)
                startAudioContextIfNeeded();
                blowOutCandle.call(this, e);
            }
        });
    });
    
    // For better mobile experience with touch
    document.addEventListener('touchmove', function(e) {
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.classList.contains('candle') && !element.classList.contains('blown')) {
            startAudioContextIfNeeded();
            blowOutCandle.call(element, e);
        }
    });
    
    // Optional: Listen for keyboard input 
    document.addEventListener('keypress', function(e) {
        if (e.key === 'b' || e.key === 'B') { // Press 'b' to simulate blowing
            startAudioContextIfNeeded();
            blowRandomCandle();
        } else if (e.key === ' ' || e.key === 'Enter') { // Space or Enter to blow all candles
            startAudioContextIfNeeded();
            blowAllCandles();
        }
    });
    
    // Add event listeners for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            playButtonHoverSound();
        });
        
        btn.addEventListener('click', function() {
            playButtonClickSound();
        });
    });
    
    // Add cake wobble effect on hover
    const cakeContainer = document.querySelector('.cake-container');
    if (cakeContainer) {
        cakeContainer.addEventListener('mouseenter', function() {
            this.style.animation = 'cakeWobble 0.5s ease-in-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    }
    
    // Setup wish message close button
    const closeButton = document.querySelector('.close-wish');
    if (closeButton) {
        closeButton.addEventListener('click', closeWishMessage);
    }
    
    // Create cake layers appearance sequence
    animateCakeAppearance();
});

// Setup audio context for sound effects
function setupAudio() {
    // We'll initialize this on first user interaction to comply with autoplay policies
    audioContext = null;
}

// Start audio context on user interaction to comply with browser policies
function startAudioContextIfNeeded() {
    if (!hasInteracted) {
        hasInteracted = true;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Play candle blow sound
function playBlowSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Play sparkle sound
function playSparkleSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Play firework sound
function playFireworkSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Play button hover sound
function playButtonHoverSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Play button click sound
function playButtonClickSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Add plate under the cake
function addPlate() {
    const cakeContainer = document.querySelector('.cake-container');
    const plate = document.createElement('div');
    plate.className = 'plate';
    cakeContainer.appendChild(plate);
}

// Create frosting drips
function createFrostingDrips() {
    const cake = document.querySelector('.cake');
    const numDrips = 8;
    
    for (let i = 0; i < numDrips; i++) {
        const drip = document.createElement('div');
        drip.className = 'frosting-drip';
        
        // Position drips along the top edge of the cake
        drip.style.left = `${10 + (i * 80 / numDrips)}%`;
        drip.style.top = '-70px';
        
        // Vary the height of each drip
        const height = 10 + Math.random() * 15;
        drip.style.setProperty('--drip-height', `${height}px`);
        
        cake.appendChild(drip);
    }
}

// Animate cake appearance
function animateCakeAppearance() {
    // Add slight delay for each cake layer
    const cakeLayers = [
        document.querySelector('.cake'),
        document.querySelector('.cake:before'),
        document.querySelector('.cake:after'),
        document.querySelector('.frosting')
    ];
    
    // We'll use CSS animations with different delays
    // Since we can't directly animate pseudo-elements with JS,
    // this is handled in the CSS with the cakeEntrance animation
}

// Create candles for the cake with improved appearance
function createCandles() {
    const candleContainer = document.getElementById('candleContainer') || createCandleContainer();
    
    for (let i = 0; i < totalCandles; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        
        // Slightly vary candle height
        const height = 25 + Math.random() * 10;
        candle.style.height = `${height}px`;
        
        const flame = document.createElement('div');
        flame.className = 'flame';
        
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        
        candle.appendChild(flame);
        candle.appendChild(smoke);
        candleContainer.appendChild(candle);
    }
}

// Create candle container if it doesn't exist
function createCandleContainer() {
    const cakeContainer = document.querySelector('.cake-container');
    const candleContainer = document.createElement('div');
    candleContainer.id = 'candleContainer';
    candleContainer.className = 'candle-container';
    cakeContainer.appendChild(candleContainer);
    return candleContainer;
}

// Create floating balloons with improved variety
function createBalloons() {
    const colors = ['#ff66b3', '#66ccff', '#ff9966', '#99ff66', '#cc99ff', '#ffcc00'];
    const numBalloons = 15;
    
    for (let i = 0; i < numBalloons; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // More variety in balloon positions and animations
        balloon.style.left = `${Math.random() * 100}%`;
        
        // Use CSS variables for animation control
        balloon.style.setProperty('--start-x', `${-50 + Math.random() * 100}px`);
        balloon.style.setProperty('--mid-x', `${-100 + Math.random() * 200}px`);
        balloon.style.setProperty('--end-x', `${-150 + Math.random() * 300}px`);
        balloon.style.setProperty('--rotation', `${-10 + Math.random() * 20}deg`);
        balloon.style.setProperty('--end-rotation', `${-20 + Math.random() * 40}deg`);
        balloon.style.setProperty('--float-duration', `${15 + Math.random() * 10}s`);
        
        // Add scale variation
        const scale = 0.7 + Math.random() * 0.6;
        balloon.style.transform = `scale(${scale})`;
        
        balloon.style.animationDelay = `${Math.random() * 15}s`;
        document.body.appendChild(balloon);
    }
}

// Create confetti pieces with improved variety
function createConfetti() {
    const colors = ['#ffcc00', '#ff66b3', '#66ccff', '#ff9966', '#99ff66', '#cc99ff'];
    const numConfetti = 80;
    const shapes = [
        'polygon(50% 0%, 0% 100%, 100% 100%)', // Triangle
        'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', // Diamond
        'circle(50% at 50% 50%)', // Circle
        'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', // Hexagon
        'inset(0% 0% 0% 0%)' // Square
    ];
    
    for (let i = 0; i < numConfetti; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random properties for more variety
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        
        // Use CSS variables for animation control
        const size = 5 + Math.random() * 10;
        confetti.style.setProperty('--size', `${size}px`);
        confetti.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
        confetti.style.setProperty('--shape', shapes[Math.floor(Math.random() * shapes.length)]);
        confetti.style.setProperty('--start-x', `${-100 + Math.random() * 200}px`);
        confetti.style.setProperty('--mid-x-1', `${-100 + Math.random() * 200}px`);
        confetti.style.setProperty('--mid-x-2', `${-100 + Math.random() * 200}px`);
        confetti.style.setProperty('--mid-x-3', `${-100 + Math.random() * 200}px`);
        confetti.style.setProperty('--end-x', `${-100 + Math.random() * 200}px`);
        confetti.style.setProperty('--fall-duration', `${3 + Math.random() * 7}s`);
        
        confetti.style.animationDelay = `${Math.random() * 15}s`;
        document.body.appendChild(confetti);
    }
}

// Create cake decorations with animation
function createDecorations() {
    const cake = document.querySelector('.cake');
    const colors = ['#ff3366', '#ffcc00', '#66ccff', '#ff9966', '#99ff66'];
    const numDecorations = 15;
    
    for (let i = 0; i < numDecorations; i++) {
        const decoration = document.createElement('div');
        decoration.className = 'decoration';
        
        // Generate varied decoration styles
        const size = 8 + Math.random() * 7;
        decoration.style.setProperty('--deco-size', `${size}px`);
        decoration.style.setProperty('--deco-color', colors[Math.floor(Math.random() * colors.length)]);
        decoration.style.setProperty('--pop-delay', `${0.1 + i * 0.1}s`);
        
        decoration.style.top = `${-20 - Math.random() * 50}px`;
        decoration.style.left = `${Math.random() * 100}%`;
        
        // Randomly use square decorations sometimes
        if (Math.random() > 0.7) {
            decoration.style.borderRadius = '2px';
        }
        
        cake.appendChild(decoration);
    }
}

// Blow out a candle when clicked or hovered
function blowOutCandle(e) {
    if (!this.classList.contains('blown')) {
        // Play blow sound
        playBlowSound();
        
        this.classList.add('blown');
        candlesBlown++;
        
        // Add some "force" to the blow using a ripple effect
        createBlowRipple(e);
        
        // Create sparkle effect
        createSparkleEffect(this);
        
        // Check if all candles are blown
        if (candlesBlown === totalCandles && !allCandlesBlown) {
            allCandlesBlown = true;
            setTimeout(showWishMessage, 1000);
        }
    }
}

// Create a visual ripple effect when blowing out candles
function createBlowRipple(e) {
    const ripple = document.createElement('div');
    ripple.className = 'blow-ripple';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.zIndex = '50';
    
    // Position ripple near pointer/touch
    if (e && e.clientX) {
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
    } else {
        // Default position if no event coordinates
        const candles = document.querySelector('.candle-container');
        const rect = candles.getBoundingClientRect();
        ripple.style.left = `${rect.left + rect.width/2}px`;
        ripple.style.top = `${rect.top}px`;
    }
    
    // Animate ripple
    ripple.style.animation = 'ripple 0.6s linear forwards';
    document.body.appendChild(ripple);
    
    // Create ripple animation if not already defined
    if (!document.querySelector('style#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                0% { transform: scale(1); opacity: 1; }
                100% { transform: scale(20); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after animation completes
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Simulate blowing a random candle
function blowRandomCandle() {
    const unblownCandles = Array.from(document.querySelectorAll('.candle:not(.blown)'));
    if (unblownCandles.length > 0) {
        const randomCandle = unblownCandles[Math.floor(Math.random() * unblownCandles.length)];
        blowOutCandle.call(randomCandle);
    }
}

// Blow out all candles at once
function blowAllCandles() {
    const unblownCandles = Array.from(document.querySelectorAll('.candle:not(.blown)'));
    let delay = 0;
    
    unblownCandles.forEach(candle => {
        setTimeout(() => {
            blowOutCandle.call(candle);
        }, delay);
        delay += 200; // Stagger the effect
    });
}

// Create enhanced sparkle effect around the blown candle
function createSparkleEffect(candle) {
    const numSparkles = 15;
    const candleRect = candle.getBoundingClientRect();
    
    // Play sparkle sound
    playSparkleSound();
    
    for (let i = 0; i < numSparkles; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Position sparkles around the candle flame
        const angle = Math.random() * Math.PI * 2;
        const distance = 5 + Math.random() * 15;
        const posX = candleRect.left + candleRect.width/2 + Math.cos(angle) * distance;
        const posY = candleRect.top + Math.sin(angle) * distance;
        
        sparkle.style.left = `${posX}px`;
        sparkle.style.top = `${posY}px`;
        
        // Vary the size and color
        const size = 3 + Math.random() * 3;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        
        // Use gold, yellow, and orange hues for the sparkles
        const hue = 30 + Math.floor(Math.random() * 30);
        sparkle.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
        sparkle.style.boxShadow = `0 0 ${size}px hsl(${hue}, 100%, 60%)`;
        
        sparkle.style.animation = `sparkle ${0.5 + Math.random() * 0.5}s forwards`;
        document.body.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}

// Show the wish message when all candles are blown
function showWishMessage() {
    const wishMessage = document.getElementById('wishMessage') || createWishMessage();
    wishMessage.classList.add('show');
    createFireworks();
}

// Create wish message if it doesn't exist
function createWishMessage() {
    const wishMessage = document.createElement('div');
    wishMessage.id = 'wishMessage';
    wishMessage.className = 'wish-message';
    
    const heading = document.createElement('h2');
    heading.textContent = "Happy Birthday!";
    
    const message = document.createElement('p');
    message.textContent = "May all your wishes come true! This special day is all about you. Enjoy every moment and have a wonderful year ahead!";
    
    const closeButton = document.createElement('button');
    closeButton.className = 'btn close-wish';
    closeButton.textContent = "Thank You!";
    closeButton.addEventListener('click', closeWishMessage);
    
    wishMessage.appendChild(heading);
    wishMessage.appendChild(message);
    wishMessage.appendChild(closeButton);
    
    document.body.appendChild(wishMessage);
    return wishMessage;
}

// Close the wish message
function closeWishMessage() {
    document.getElementById('wishMessage').classList.remove('show');
}

// Create enhanced fireworks effect
function createFireworks() {
    const numFireworks = 15;
    const colors = ['#ff3366', '#ffcc00', '#66ccff', '#ff9966', '#99ff66'];
    const fireworkTypes = ['circular', 'spiral', 'starburst'];
    
    for (let i = 0; i < numFireworks; i++) {
        setTimeout(() => {
            // Play firework sound with slight variation
            setTimeout(() => {
                playFireworkSound();
            }, Math.random() * 100);
            
            const firework = document.createElement('div');
            firework.className = 'firework';
            
            // Position fireworks around the viewport
            firework.style.left = `${10 + Math.random() * 80}%`;
            firework.style.top = `${10 + Math.random() * 60}%`;
            
            // Pick random color and type
            const color = colors[Math.floor(Math.random() * colors.length)];
            firework.style.backgroundColor = color;
            
            const fireworkType = fireworkTypes[Math.floor(Math.random() * fireworkTypes.length)];
            
            switch(fireworkType) {
                case 'circular':
                    firework.style.animation = `firework ${1 + Math.random()}s forwards`;
                    break;
                case 'spiral':
                    firework.style.animation = `fireworkSpiral ${1 + Math.random()}s forwards`;
                    break;
                case 'starburst':
                    // Create multiple particles for starburst
                    createStarburstFirework(firework.style.left, firework.style.top, color);
                    // Don't add the main firework for starburst
                    return;
            }
            
            document.body.appendChild(firework);
            
            // Remove firework after animation
            setTimeout(() => {
                firework.remove();
            }, 2000);
        }, i * 300);
    }
}

// Create a starburst firework with multiple particles
function createStarburstFirework(x, y, color) {
    const numParticles = 12;
    
    // Remove % sign from position
    x = parseFloat(x);
    y = parseFloat(y);
    
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        
        // Set base styles
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.zIndex = '5';
        
        // Calculate angle for this particle (evenly distributed)
        const angle = (i / numParticles) * Math.PI * 2;
        
        // Create keyframe animation dynamically
        const style = document.createElement('style');
        const animationName = `particle${Date.now()}${i}`;
        
        style.textContent = `
            @keyframes ${animationName} {
                0% { 
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                100% { 
                    transform: translate(${Math.cos(angle) * 100}px, ${Math.sin(angle) * 100}px) scale(0);
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
        
        // Apply the animation
        particle.style.animation = `${animationName} 1s forwards ease-out`;
        
        document.body.appendChild(particle);
        
        // Clean up
        setTimeout(() => {
            particle.remove();
            style.remove();
        }, 1500);
    }
}

// Navigation functions with transition effects
function goBack() {
    playButtonClickSound();
    
    // Add page exit animation
    document.body.classList.add('page-exit');
    
    // Wait for animation before navigating
    setTimeout(() => {
        window.location.href = 'memory-lane.html';
    }, 500);
}

function goNext() {
    playButtonClickSound();
    
    // Add page exit animation
    document.body.classList.add('page-exit');
    
    // Wait for animation before navigating
    setTimeout(() => {
        window.location.href = 'letter.html';
    }, 500);
}

// Add page exit animation if not already defined
if (!document.querySelector('style#exit-style')) {
    const style = document.createElement('style');
    style.id = 'exit-style';
    style.textContent = `
        .page-exit {
            animation: fadeOut 0.5s forwards;
        }
        @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
        
        @keyframes cakeWobble {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
            100% { transform: rotate(0deg); }
        }
    `;
    document.head.appendChild(style);
}