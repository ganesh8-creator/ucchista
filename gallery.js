// --- gallery.js ---

// Configuration
const MAX_IMAGES = 50; // The maximum number of images we expect (as requested)
const IMAGE_BASE_NAME = "ganesh"; // e.g., ganesh1.jpg, ganesh2.jpg
const IMAGE_EXTENSION = "jpg"; // Use .jpg format

// DOM Elements
const carouselSlides = document.getElementById('carouselSlides');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentSlideIndex = 0;
let availableImages = [];

/**
 * 1. Checks for the existence of images (ganesh1.jpg, ganesh2.jpg, etc.)
 * and generates the HTML for the carousel slides.
 */
function initializeCarousel() {
    let imagesLoaded = 0;

    // Clear loading text
    carouselSlides.innerHTML = '';
    
    // Check for images sequentially up to MAX_IMAGES
    for (let i = 1; i <= MAX_IMAGES; i++) {
        const imageUrl = `${IMAGE_BASE_NAME}${i}.${IMAGE_EXTENSION}`;
        
        // Use a temporary Image object to check if the file exists
        const img = new Image();
        img.onload = function() {
            // Success: Image loaded, create the slide element
            const slideHtml = `
                <div class="carousel-item">
                    <img src="${imageUrl}" alt="ఉచ్చిష్ట గణపతి - రూపం ${i}">
                </div>
            `;
            carouselSlides.insertAdjacentHTML('beforeend', slideHtml);
            availableImages.push(i);
            imagesLoaded++;

            // If this is the last image check, enable navigation buttons
            if (i === MAX_IMAGES) {
                updateUI();
            }
        };

        img.onerror = function() {
            // Failure: File does not exist, move to the next index
            // If all checks are done, finalize the UI
            if (i === MAX_IMAGES) {
                updateUI();
            }
        };
        
        // Start loading the image to trigger onload/onerror
        img.src = imageUrl; 
    }
}

/**
 * 2. Updates the visual position of the carousel.
 */
function updateCarouselPosition() {
    const offset = -currentSlideIndex * 100;
    carouselSlides.style.transform = `translateX(${offset}%)`;
    
    // Disable/enable buttons based on index
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === availableImages.length - 1;
}

/**
 * 3. Handles button clicks for navigation.
 */
function moveSlide(direction) {
    const totalSlides = availableImages.length;
    
    if (direction === 'next' && currentSlideIndex < totalSlides - 1) {
        currentSlideIndex++;
    } else if (direction === 'prev' && currentSlideIndex > 0) {
        currentSlideIndex--;
    }
    updateCarouselPosition();
}

/**
 * 4. Initializes event listeners (after images are loaded).
 */
function setupEventListeners() {
    prevBtn.addEventListener('click', () => moveSlide('prev'));
    nextBtn.addEventListener('click', () => moveSlide('next'));

    // --- Touch/Swipe Detection (for mobile) ---
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50; // Minimum pixels to register a swipe

    carouselSlides.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    carouselSlides.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    });

    carouselSlides.addEventListener('touchend', () => {
        const deltaX = touchEndX - touchStartX;

        if (deltaX > minSwipeDistance) {
            moveSlide('prev'); // Swiped right
        } else if (deltaX < -minSwipeDistance) {
            moveSlide('next'); // Swiped left
        }

        // Reset touch coordinates
        touchStartX = 0;
        touchEndX = 0;
    });
}

function updateUI() {
    if (availableImages.length > 0) {
        // Only show buttons if there's more than one image
        prevBtn.style.display = availableImages.length > 1 ? 'block' : 'none';
        nextBtn.style.display = availableImages.length > 1 ? 'block' : 'none';
        updateCarouselPosition();
    } else {
        carouselSlides.innerHTML = `<p style="padding: 50px; color: #FF6B6B;">No images found (Check filenames: ganesh1.jpg, etc.)</p>`;
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }
}


// Start the entire process
document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel();
    setupEventListeners();
});