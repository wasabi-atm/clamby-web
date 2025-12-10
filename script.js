// --- Typewriter Logic ---
const words = ["WARDROBE", "FASHION STYLIST", "SHOPPING ASSISTANT"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 100;
const deleteSpeed = 50;
const delayBetweenWords = 2000;
const typewriterElement = document.getElementById('typewriter-text');

function type() {
    if (!typewriterElement) return;

    const currentWord = words[wordIndex];

    if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeDelay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
        // Finished typing word, wait before deleting
        typeDelay = delayBetweenWords;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Finished deleting, move to next word
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeDelay = 500;
    }

    setTimeout(type, typeDelay);
}

// --- Infinite Carousel Logic ---
let activeIndex = 3; // Start index
const items = document.querySelectorAll('.c-item');
const itemCount = items.length;

// Auto-play variable
let autoPlayInterval;

function moveCarousel(targetIndex) {
    if (!items.length) return;
    // Logic for clicking:
    // We want to find the SHORTEST path to the target index from the current displayed activeIndex.

    // 1. Determine current conceptual index (0-6)
    // But activeIndex can be large/negative now.
    const currentMod = ((activeIndex % itemCount) + itemCount) % itemCount;

    // 2. Calculate distance in the ring
    let diff = targetIndex - currentMod;

    // 3. Adjust for shortest wrap around
    // If diff is > 3.5, subtract 7 (go left instead of right)
    // If diff is < -3.5, add 7 (go right instead of left)
    if (diff > itemCount / 2) {
        diff -= itemCount;
    } else if (diff < -itemCount / 2) {
        diff += itemCount;
    }

    activeIndex += diff;
    updateCarouselVisuals();
    resetAutoPlay();
}

function updateCarouselVisuals() {
    if (!items.length) return;
    items.forEach((item, index) => {
        // Determine the visual position of this item relative to the active index.
        // We want a result in range [-3, -2, -1, 0, 1, 2, 3] usually.

        // 1. Raw difference
        let offset = (index - activeIndex) % itemCount;

        // 2. Normalize negative modulo results in JS
        // e.g. -1 % 7 is -1 in JS, but we want to treat it relative to the ring center.

        // We want offset to be the "shortest distance" to the center (0).
        // Let's normalize offset to be within -itemCount/2 to +itemCount/2

        // First, make it positive 0..6
        if (offset < 0) offset += itemCount;
        if (offset < 0) offset += itemCount; // Double check for very negative inputs

        // Now offset is 0..6. 
        // 0 is Center.
        // 1, 2, 3 are Right.
        // 4, 5, 6 are Left (-3, -2, -1).

        if (offset > itemCount / 2) {
            offset -= itemCount;
        }

        // Now offset is e.g. -3, -2, -1, 0, 1, 2, 3
        const absOffset = Math.abs(offset);
        const overlay = item.querySelector('.overlay');

        // --- Z-Index ---
        // Reduced max z-index to 40 so it never competes with the navbar (z-[100])
        const zIndex = 40 - absOffset * 10;
        item.style.zIndex = zIndex;

        // --- Visual Styling (same as before but using calculated offset) ---
        let xOffset = 0;
        let scale = 1;
        let width = '16rem';
        let height = '24rem';

        if (offset === 0) {
            // CENTER
            scale = 1.1;
            width = '18rem';
            xOffset = 0;
        } else {
            // SIDES
            const sign = Math.sign(offset);

            let distPx = 0;
            if (absOffset === 1) distPx = 220;
            else if (absOffset === 2) distPx = 350;
            else distPx = 450;

            xOffset = sign * distPx;
            scale = 1 - (0.1 * absOffset);
            width = absOffset === 1 ? '12rem' : '8rem';
        }

        item.style.transform = `translate(calc(-50% + ${xOffset}px), -50%) scale(${scale})`;
        item.style.width = width;
        item.style.height = height;

        // --- Overlay ---
        let overlayOpacity = 0;
        if (absOffset === 0) overlayOpacity = 0;
        else if (absOffset === 1) overlayOpacity = 0.25;
        else if (absOffset === 2) overlayOpacity = 0.50;
        else overlayOpacity = 0.8;

        if (overlay) overlay.style.opacity = overlayOpacity;

        // --- Visibility ---
        if (absOffset > 2 && window.innerWidth < 768) {
            item.style.opacity = 0;
            item.style.pointerEvents = 'none';
        } else {
            item.style.opacity = 1;
            item.style.pointerEvents = 'auto';
        }
    });
}

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        activeIndex++;
        updateCarouselVisuals();
    }, 3000); // Change every 3 seconds
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Start Typewriter
    type();

    // Start Carousel
    updateCarouselVisuals();
    startAutoPlay();
    window.addEventListener('resize', updateCarouselVisuals);
});

// --- Mobile Menu ---
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');


if (btn) {
    const icon = btn.querySelector('i');
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        if (menu.classList.contains('hidden')) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        }
    });
}

// --- Navbar Scroll Effect ---
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-md');
        } else {
            navbar.classList.remove('shadow-md');
        }
    });
}
