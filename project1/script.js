// Hide loading screen after content loads
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-overlay').style.opacity = 0;
        setTimeout(() => {
            document.getElementById('loading-overlay').style.display = 'none';
        }, 800);
    }, 1500);
});

// Play birthday song
const audio = document.getElementById('birthday-song');
const playPauseBtn = document.getElementById('play-pause');
const volumeControl = document.getElementById('volume');
let isPlaying = false;

// Set initial volume
audio.volume = volumeControl.value;

// Play audio when page loads but wait a bit
window.addEventListener('load', () => {
    setTimeout(() => {
        audio.play()
            .then(() => {
                isPlaying = true;
                playPauseBtn.innerHTML = '<i class="play-icon">⏸️</i>';
            })
            .catch(error => {
                console.log("Audio play failed due to autoplay restrictions:", error);
            });
    }, 2000);
});

// Play/Pause button
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="play-icon">▶️</i>';
    } else {
        audio.play();
        playPauseBtn.innerHTML = '<i class="play-icon">⏸️</i>';
    }
    isPlaying = !isPlaying;
});

// Volume control
volumeControl.addEventListener('input', () => {
    audio.volume = volumeControl.value;
});

// Function to go to next page
function goToNextPage() {
    // Add a bounce effect before navigating
    gsap.to('.next-button', {
        scale: 1.2,
        yoyo: true,
        repeat: 1,
        duration: 0.3,
        onComplete: () => {
            // Create a "loading next page" effect
            document.getElementById('loading-overlay').style.display = 'flex';
            document.getElementById('loading-overlay').style.opacity = 1;
            
            setTimeout(() => {
                // Change this URL to your next page
                window.location.href = "memorylane.html";
            }, 1000);
        }
    });
}

// Function to show cake message
function showCakeMessage() {
    if (!document.getElementById('cake-message')) {
        const message = document.createElement('div');
        message.id = 'cake-message';
        message.style.position = 'fixed';
        message.style.bottom = '80px';
        message.style.left = '20px';
        message.style.background = 'rgba(255, 255, 255, 0.9)';
        message.style.padding = '15px';
        message.style.borderRadius = '10px';
        message.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        message.style.maxWidth = '250px';
        message.style.zIndex = '100';
        message.style.transform = 'scale(0)';
        message.innerHTML = "Your birthday cake is waiting! 🎂<br>Make a wish before you blow out the candles!";
        
        document.body.appendChild(message);
        
        gsap.to(message, {
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.5)"
        });
        
        setTimeout(() => {
            gsap.to(message, {
                scale: 0,
                duration: 0.5,
                ease: "back.in(1.5)",
                onComplete: () => {
                    document.body.removeChild(message);
                }
            });
        }, 5000);
    }
}

// Create confetti, balloons, hearts, and stars
function createFloatingElements() {
    const colors = ['#FF1493', '#8A2BE2', '#FFD700', '#FF4500', '#00BFFF', '#32CD32'];
    const elements = ['confetti', 'balloon', 'heart', 'star'];
    const confettiShapes = ['▲', '■', '●', '★', '♥', '♦', '✦', '✧'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const element = document.createElement('div');
            
            // Randomly pick an element type
            const elementType = elements[Math.floor(Math.random() * elements.length)];
            element.className = elementType;
            
            // Set random position
            element.style.left = Math.random() * 100 + 'vw';
            element.style.top = -30 + 'px';
            
            // Set random color
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Different styling based on element type
            if (elementType === 'confetti') {
                const shape = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
                element.innerHTML = shape;
                element.style.color = color;
                element.style.fontSize = (Math.random() * 20 + 10) + 'px';
                element.style.transform = `rotate(${Math.random() * 360}deg)`;
            } else if (elementType === 'balloon') {
                element.innerHTML = '🎈';
                element.style.fontSize = (Math.random() * 30 + 20) + 'px';
                element.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
            } else if (elementType === 'heart') {
                element.innerHTML = '❤️';
                element.style.fontSize = (Math.random() * 20 + 10) + 'px';
                element.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
            } else if (elementType === 'star') {
                element.innerHTML = '✨';
                element.style.fontSize = (Math.random() * 15 + 10) + 'px';
            }
            
            // Add to body
            document.body.appendChild(element);
            
            // Animate with GSAP
            gsap.to(element, {
                y: window.innerHeight + 100,
                x: '+=' + (Math.random() * 200 - 100),
                rotation: Math.random() * 360,
                duration: Math.random() * 10 + 5,
                ease: "power1.out",
                onComplete: () => {
                    if (document.body.contains(element)) {
                        document.body.removeChild(element);
                    }
                }
            });
            
            // Add some sparkle animation
            if (Math.random() > 0.7) {
                gsap.to(element, {
                    opacity: 0.5,
                    yoyo: true,
                    repeat: -1,
                    duration: 0.5,
                    ease: "sine.inOut"
                });
            }
            
        }, i * 200); // Staggered start times
    }
}

// Create gift icons
function createGiftIcons() {
    const gifts = ['🎁', '🎀', '✨', '🎊'];
    
    for (let i = 0; i < 10; i++) {
        const gift = document.createElement('div');
        gift.className = 'gift-icon';
        gift.innerHTML = gifts[Math.floor(Math.random() * gifts.length)];
        gift.style.left = (Math.random() * 90 + 5) + 'vw';
        gift.style.top = (Math.random() * 80 + 10) + 'vh';
        gift.style.animationDelay = (Math.random() * 3) + 's';
        
        document.body.appendChild(gift);
        
        gsap.to(gift, {
            opacity: 1,
            duration: 1,
            delay: Math.random() * 2
        });
    }
}

// Create background bubbles
function createBubbles() {
    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const size = Math.random() * 150 + 50;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        
        bubble.style.left = (Math.random() * 100) + 'vw';
        bubble.style.top = (Math.random() * 100) + 'vh';
        
        document.body.appendChild(bubble);
        
        gsap.to(bubble, {
            x: (Math.random() * 100 - 50),
            y: (Math.random() * 100 - 50),
            duration: Math.random() * 20 + 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}

// Start floating elements on load
window.addEventListener('load', () => {
    createFloatingElements();
    createGiftIcons();
    createBubbles();
});

// Create new elements periodically
setInterval(createFloatingElements, 5000);

// Add a subtle sparkle effect to the heading
gsap.to('h1', {
    textShadow: "0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 20, 147, 0.6)",
    repeat: -1,
    yoyo: true,
    duration: 2
});

// Mouse trail effect
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.9) {
        const trail = document.createElement('div');
        trail.className = 'star';
        trail.innerHTML = '✨';
        trail.style.position = 'absolute';
        trail.style.left = e.pageX + 'px';
        trail.style.top = e.pageY + 'px';
        trail.style.fontSize = '15px';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '1000';
        
        document.body.appendChild(trail);
        
        gsap.to(trail, {
            y: '-=50',
            opacity: 0,
            duration: 1,
            onComplete: () => {
                if (document.body.contains(trail)) {
                    document.body.removeChild(trail);
                }
            }
        });
    }
});

// Responsive adjustments
function handleResize() {
    const container = document.querySelector('.container');
    if (window.innerWidth < 768) {
        document.querySelector('.typewriter-text').style.whiteSpace = 'normal';
    } else {
        document.querySelector('.typewriter-text').style.whiteSpace = 'nowrap';
    }
}

window.addEventListener('resize', handleResize);
handleResize();