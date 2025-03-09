// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Memory data - replace placeholder images with your actual images and add your captions
const memories = [
    {
        image: "image/OIP.jpg",
        caption: "baad m likha jayega",
        isGif: false,
        rotationAngle: -2,
        emoji: "🌊"
    },
    {
        image: "pic2.jpg",
        caption: "baad m likha jayega",
        isGif: false,
        rotationAngle: 3,
        emoji: "🌅"
    },
    {
        image: "pic3.jpg",
        caption: "baad m likha jayega",
        isGif: true,
        rotationAngle: -1,
        emoji: "🚗"
    },
    {
        image: "pic4.jpg",
        caption: "baad m likha jayega",
        isGif: false,
        rotationAngle: 2,
        emoji: "🍕"
    },
    {
        image: "pic5.jpg",
        caption: "baad m likha jayega",
        isGif: false,
        rotationAngle: -3,
        emoji: "🏕️"
    },
    {
        image: "pic7.jpg",
        caption: "baad m likha jayega",
        isGif: true,
        rotationAngle: 1,
        emoji: "🎵"
    },
    {
        image: "pic8.jpg",
        caption: "baad m likha jayega",
        isGif: false,
        rotationAngle: -2,
        emoji: "🏰"
    },
    {
        image: "pic9.jpg",
        caption: "baad m likha jayega",
        isGif: false,
        rotationAngle: 2,
        emoji: "🏖️"
    },
    {
        image: "pic6.jpg",
        caption: "baad m likha jayega",
        isGif: false,
        rotationAngle: -1,
        emoji: "💕"
    },
    {
        image: "pic4.jpg",
        caption: "baad m likha jayega",
        isGif: true,
        rotationAngle: 3,
        emoji: "🎂"
    }
];

// Create confetti elements
function createConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#ff6ec4', '#a485ff', '#ff4e91', '#c175ff', '#75c6ff'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        // Random styles
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.width = Math.random() * 15 + 5 + 'px';
        confetti.style.height = Math.random() * 15 + 5 + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Animation
        const duration = Math.random() * 3 + 3;
        const delay = Math.random() * 5;
        
        confetti.style.animation = `floatDown ${duration}s ease-in ${delay}s infinite`;
        confetti.style.opacity = Math.random();
        
        confettiContainer.appendChild(confetti);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    createConfetti();
    
    const galleryElement = document.getElementById('memoryGallery');
    const startSlideshowBtn = document.getElementById('startSlideshow');
    const pauseSlideshowBtn = document.getElementById('pauseSlideshow');
    const backButton = document.getElementById('backButton');
    const nextButton = document.getElementById('nextButton');
    
    let slideshowInterval;
    let currentSlide = 0;

    // Generate memory cards
    memories.forEach((memory, index) => {
        const memoryCard = document.createElement('div');
        memoryCard.className = 'memory-card';
        memoryCard.style.setProperty('--rotate', `${memory.rotationAngle}deg`);
        
        const tapeElement = document.createElement('div');
        tapeElement.className = 'card-tape';
        tapeElement.style.setProperty('--rotate', `${memory.rotationAngle * 2}deg`);
        
        const imgElement = document.createElement('img');
        imgElement.className = 'memory-img';
        imgElement.src = memory.image;
        imgElement.alt = `Memory ${index + 1}`;
        
        const captionElement = document.createElement('div');
        captionElement.className = 'memory-caption';
        captionElement.textContent = memory.caption;
        
        const stickerElement = document.createElement('div');
        stickerElement.className = 'card-sticker';
        stickerElement.innerHTML = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="#ff6ec4" />
            <text x="50" y="65" font-family="Arial" font-size="40" text-anchor="middle" fill="white">${memory.emoji}</text>
        </svg>`;
        
        memoryCard.appendChild(tapeElement);
        memoryCard.appendChild(imgElement);
        memoryCard.appendChild(captionElement);
        memoryCard.appendChild(stickerElement);
        galleryElement.appendChild(memoryCard);
    });

    // Make slideshow controls visible
    document.querySelector('.slideshow-controls').style.opacity = '1';

    // Intersection Observer to animate cards as they enter viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    // Observe all memory cards
    document.querySelectorAll('.memory-card').forEach(card => {
        observer.observe(card);
        
        // Add animation delay for staggered effect
        const index = Array.from(galleryElement.children).indexOf(card);
        card.style.animationDelay = `${0.1 * index}s`;
        
        // Make all cards visible initially
        setTimeout(() => {
            card.classList.add('visible');
        }, 500 + (index * 150));
    });

    // Fixed slideshow functionality
    function startSlideshow() {
        startSlideshowBtn.style.display = 'none';
        pauseSlideshowBtn.style.display = 'flex';
        
        // Clear any existing interval to avoid multiple slideshows
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
        }
        
        slideshowInterval = setInterval(() => {
            // Move to next slide
            currentSlide = (currentSlide + 1) % memories.length;
            
            // Calculate the scroll position of the current slide
            const cards = galleryElement.querySelectorAll('.memory-card');
            if (cards && cards.length > 0 && cards[currentSlide]) {
                const cardRect = cards[currentSlide].getBoundingClientRect();
                const galleryRect = galleryElement.getBoundingClientRect();
                
                // Scroll to center the current card
                galleryElement.scrollTo({
                    left: cards[currentSlide].offsetLeft - (galleryRect.width / 2) + (cardRect.width / 2),
                    behavior: 'smooth'
                });
            }
        }, 2000); // Change slide every 3 seconds
    }

    function pauseSlideshow() {
        pauseSlideshowBtn.style.display = 'none';
        startSlideshowBtn.style.display = 'flex';
        
        // Clear interval to stop slideshow
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
    }

    // Event listeners for slideshow controls
    startSlideshowBtn.addEventListener('click', startSlideshow);
    pauseSlideshowBtn.addEventListener('click', pauseSlideshow);

    // Event listeners for navigation buttons
    backButton.addEventListener('click', function() {
        window.location.href = 'index.html'; // Adjust this to your welcome page URL
    });

    nextButton.addEventListener('click', function() {
        window.location.href = 'cake.html'; // Adjust this to your next surprise page URL
    });

    // Scroll animations with GSAP
    gsap.from('.header', {
        duration: 1,
        y: -50,
        opacity: 0,
        ease: 'back.out(1.7)'
    });

    gsap.from('.navigation-buttons', {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 0.5,
        ease: 'power3.out'
    });

    // Add animation to stickers
    gsap.utils.toArray('.sticker').forEach(sticker => {
        gsap.to(sticker, {
            rotation: 'random(-20, 20)',
            duration: 'random(2, 4)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });

    // Create hover effect for memory cards
    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                boxShadow: '0 15px 35px rgba(255, 105, 180, 0.5)',
                duration: 0.3
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                boxShadow: '0 10px 25px rgba(255, 105, 180, 0.3)',
                duration: 0.3
            });
        });
    });

    // Auto scroll to show the gallery
    setTimeout(() => {
        const galleryContainer = document.querySelector('.gallery-container');
        galleryContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 2000);
});