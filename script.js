// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    once: true
});

// Custom cursor implementation
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
    gsap.to(cursorFollower, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.15 });
});

// Scale cursor on hover for interactive elements
document.querySelectorAll('button, a').forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 1.5, duration: 0.2 });
        gsap.to(cursorFollower, { scale: 1.5, duration: 0.2 });
    });

    button.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, duration: 0.2 });
        gsap.to(cursorFollower, { scale: 1, duration: 0.2 });
    });
});

// Loader animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    gsap.to(loader, {
        opacity: 0,
        duration: 1,
        delay: 2,
        onComplete: () => {
            loader.style.display = 'none';
        }
    });
});


// Enhanced noise effect with smooth transitions
const noiseCanvas = document.getElementById('noise-canvas');
const ctx = noiseCanvas.getContext('2d');

// Array of light colors to use in grain
const lightColors = [
    '##ab6038', // Light peach
    '##ab6038', // Light cyan
    '##ab6038', // Light lavender
    '##ab6038', // Light mint green
    '##ab6038'  // Light pastel coral
];

let grainIntensity = 0.25; // Initial subtle grain
let isScrolling = false;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > window.innerWidth) this.vx = -this.vx;
        if (this.y < 0 || this.y > window.innerHeight) this.vy = -this.vy;
    }
}

const canvas = document.getElementById('particle-canvas');
const ctx2 = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 150 };

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];

    const numberOfParticles = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ab6038';
        ctx.fill();

        // Connect particles within range
        particles.forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 111, 0, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
            }
        });

        // Interactive effect with mouse
        if (mouse.x != null) {
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                particle.x += Math.cos(angle) * force * 2;
                particle.y += Math.sin(angle) * force * 2;
            }
        }
    });

    requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('resize', init);
window.addEventListener('load', () => {
    init();
    animate();
});

// Mouse leave effect
window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Smooth scroll implementation
function smoothScroll(target, duration) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    function animation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Cubic easing for smooth motion
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        window.scrollTo(0, startPosition + distance * easeProgress);

        if (progress < 1) {
            requestAnimationFrame(animation);
        } else {
            isScrolling = false;
        }
    }

    requestAnimationFrame(animation);
}

// Glitch text effect for hero section
function createGlitchEffect(element) {
    const text = element.getAttribute('data-text');
    let iteration = 0;

    const glitchInterval = setInterval(() => {
        element.innerText = text
            .split('')
            .map((char, index) => {
                if (index < iteration) {
                    return text[index];
                }
                return String.fromCharCode(65 + Math.floor(Math.random() * 26));
            })
            .join('');

        iteration += 1 / 3;
        if (iteration >= text.length) {
            clearInterval(glitchInterval);
            element.innerText = text;
        }
    }, 30);
}

// Listen for page load and apply the effect each time
window.addEventListener('DOMContentLoaded', () => {
    const element = document.querySelector('[data-text]');
    if (element) {
        createGlitchEffect(element);
    }
});

// Remove navbar functionality

// Add click event to the explore button
document.querySelector('.explore-btn').addEventListener('click', () => {
    // Get the about section element
    const aboutSection = document.querySelector('.about-section');

    // Smooth scroll to about section
    smoothScroll(aboutSection, 1000);
});

// Handle window resize
function resizeCanvas() {
    noiseCanvas.width = window.innerWidth;
    noiseCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

// Dynamic grain intensity based on scroll position
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        const scrollProgress = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        const newIntensity = 0.15 + (scrollProgress * 0.1); // Subtle increase based on scroll
        grainIntensity = newIntensity;
    }
});

// Initialize canvas and noise effect
resizeCanvas();

// Parallax effect for hero section
gsap.to('.hero-content', {
    yPercent: 50,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});
