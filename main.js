const canvas = document.getElementById('sequence-canvas');
const context = canvas.getContext('2d', { alpha: false }); // alpha: false optimizes rendering if no transparency

const frameCount = 416;

// Function to get the path of the image based on its index
const currentFrame = index => (
  `./public/images/${index.toString().padStart(4, '0')}.jpg`
);

const images = [];

// Preload images to ensure smooth playback
const preloadImages = () => {
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images[i] = img;
  }
};

preloadImages();

// Setup the initial canvas dimensions and draw the first frame
const firstImage = images[1];

const setupCanvas = () => {
    canvas.width = firstImage.width || 1920; // Fallback to 1920x1080 if not loaded yet
    canvas.height = firstImage.height || 1080;
    if (firstImage.complete) {
        context.drawImage(firstImage, 0, 0);
    }
}

firstImage.onload = setupCanvas;
// In case the image is already cached and onload doesn't fire
if (firstImage.complete) {
    setupCanvas();
}

let currentFrameIndex = 1;
let targetFrameIndex = 1;

// Render function
const updateImage = (index) => {
    if (images[index] && images[index].complete) {
        context.drawImage(images[index], 0, 0);
    }
}

// Track scroll position
window.addEventListener('scroll', () => {  
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  
  // Calculate which frame we should be on based on scroll percentage
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );
  
  targetFrameIndex = frameIndex + 1;
});

// Animation loop using requestAnimationFrame for smooth interpolation
function loop() {
    // Interpolate towards the target frame
    const diff = targetFrameIndex - currentFrameIndex;
    
    if (Math.abs(diff) > 0.05) {
        // Easing factor (lower = smoother but slower to catch up)
        currentFrameIndex += diff * 0.1;
    } else {
        currentFrameIndex = targetFrameIndex;
    }
    
    updateImage(Math.round(currentFrameIndex));
    requestAnimationFrame(loop);
}

// Start the loop
requestAnimationFrame(loop);

// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active-menu');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active-menu');
        });
    });
}
