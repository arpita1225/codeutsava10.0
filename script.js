document.addEventListener("DOMContentLoaded", () => {
  const enterBtn = document.getElementById("enter-btn");
  const audioBtn = document.getElementById("audio-btn");
  const heroAudio = document.getElementById("heroAudio");
  const gifBgContainer = document.getElementById("gif-bg-container");
  const heroGif = document.getElementById("hero-gif");
  const introScreen = document.getElementById("intro-screen");
  const homePage = document.getElementById("home-page");
  const timelineWrapper = document.querySelector(".timeline-wrapper");
  const boat = document.getElementById("timeline-boat");
  const stoppages = document.querySelectorAll(".stoppage-item");
  const faqItems = document.querySelectorAll(".faq-item");
  const backToTopBtn = document.getElementById("back-to-top-btn");
  //JavaScript click handler to remove intro screen element and reveal main content
  // Handle Enter Button Click
  enterBtn.addEventListener("click", () => {
    // 1. Set GIF source to play GIF
    if (heroGif.dataset.src) {
      heroGif.src = heroGif.dataset.src;
      gifBgContainer.classList.remove("gif-hidden");
    }

    // 2. Play Audio
    heroAudio.play().catch((err) => {
      console.log("Audio autoplay restricted by browser:", err);
      audioBtn.textContent = "Play";
    });

    // 3. Fade out and remove Intro Screen overlay so home page elements become visible
    introScreen.classList.add("fade-out");
    setTimeout(() => {
      introScreen.style.display = "none";
      homePage.classList.remove("hidden");
    }, 600);
  });

  // Handle Audio Play/Pause Button Logic
  audioBtn.addEventListener("click", () => {
    if (heroAudio.paused) {
      heroAudio.play();
      audioBtn.textContent = "Pause";
    } else {
      heroAudio.pause();
      audioBtn.textContent = "Play";
    }
  });

// =========================================================
// CANVAS CURSOR EFFECT (CLOUD & WAVE DUAL PARTICLES)
// =========================================================

const canvas = document.getElementById("fluidCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let lastMouseX = 0;
let lastMouseY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Dual Particle Class (Cloud Puffs for Top Sky, Water Waves for Bottom Ocean)
class CursorParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // Check if pointer is in the upper half (sky) or lower half (ocean)
    this.isSky = y < window.innerHeight / 2;

    if (this.isSky) {
      // SKY PARTICLE: Soft cloud puff that expands and floats upward
      this.size = Math.random() * 6 + 4;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = -Math.random() * 1.2 - 0.3; // Gentle upward float
      this.alpha = 0.75;
      this.growth = 0.12; // Expands like a soft cloud puff
      this.color = "255, 255, 255"; // Pure white
      this.glow = "#ffffff";
    } else {
      // OCEAN PARTICLE: Cyan wave droplet that splashes horizontally
      this.size = Math.random() * 4 + 2;
      this.speedX = (Math.random() - 0.5) * 3.5;
      this.speedY = (Math.random() - 0.5) * 1.5;
      this.alpha = 0.9;
      this.growth = 0;
      this.color = "0, 212, 255"; // Vibrant cyan/aquamarine
      this.glow = "#90e0ef";
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.size += this.growth;
    // Fade particle over time
    this.alpha -= this.isSky ? 0.015 : 0.025;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.shadowBlur = this.isSky ? 12 : 8;
    ctx.shadowColor = this.glow;
    ctx.fill();
    ctx.restore();
  }
}

// Function to generate particles at current cursor coordinates
function addParticles(x, y) {
  for (let i = 0; i < 2; i++) {
    particles.push(new CursorParticle(x, y));
  }
}

// Listen for Mouse Movement
window.addEventListener("mousemove", (e) => {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  addParticles(lastMouseX, lastMouseY);
});

// Listen for Window Scrolling so particles continue spawning while scrolling
window.addEventListener("scroll", () => {
  if (lastMouseX !== 0 || lastMouseY !== 0) {
    addParticles(lastMouseX, lastMouseY);
  }
});

// Animation Loop (Fixed: Uses array filter instead of splice inside iteration)
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw active particles
  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  // Safely remove faded particles without breaking loop indices
  particles = particles.filter((p) => p.alpha > 0);

  requestAnimationFrame(animate);
}

animate();
  if (timelineWrapper && boat && stoppages.length > 0) {
    window.addEventListener("scroll", () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      // Find which stoppage is currently closest to the center of the screen
      stoppages.forEach((stoppage, index) => {
        const rect = stoppage.getBoundingClientRect();
        const stoppageCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - stoppageCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      // Get target stoppage and snap boat to its center offset position
      const targetStoppage = stoppages[closestIndex];
      const targetTop =
        targetStoppage.offsetTop + targetStoppage.offsetHeight / 2;

      // Update boat position to jump to the selected stoppage
      boat.style.top = `${targetTop}px`;

      // Highlight the current active stoppage box
      stoppages.forEach((stoppage, index) => {
        if (index === closestIndex) {
          stoppage.classList.add("active");
        } else {
          stoppage.classList.remove("active");
        }
      });
    });
  }

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");

    questionBtn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // 1. Close ALL accordion items and reset their icons to "+"
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
        const icon = otherItem.querySelector(".faq-icon");
        if (icon) icon.textContent = "+";
      });

      // 2. If the clicked item was NOT active before, open it and change icon to "-"
      if (!isActive) {
        item.classList.add("active");
        const icon = item.querySelector(".faq-icon");
        if (icon) icon.textContent = "-";
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});
