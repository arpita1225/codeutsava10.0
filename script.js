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

  //Cursor Droplet Particle Effect
  const canvas = document.getElementById("fluidCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  class Droplet {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 2;
      this.speedX = (Math.random() - 0.5) * 3;
      this.speedY = (Math.random() - 0.5) * 3;
      this.alpha = 1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.02;
    }
    draw() {
      ctx.save();
      ctx.globalAplha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "#00b4d8";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#90e0ef";
      ctx.fill();
      ctx.restore();
    }
  }
  window.addEventListener("mousemove", (e) => {
    for (let i = 0; i < 2; i++) {
      particles.push(new Droplet(e.clientX, e.clientY));
    }
  });
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, Index) => {
      p.update();
      p.draw();
      if (p.alpha <= 0) particles.splice(index, 1);
    });
    requestAnimationFrame(animate);
  }
  animate();
  
  if (timelineWrapper && boat) {
  window.addEventListener("scroll", () => {
    const rect = timelineWrapper.getBoundingClientRect();
    const wrapperHeight = timelineWrapper.offsetHeight;
    const windowHeight = window.innerHeight;

    // Calculate scroll progress relative to screen center
    const scrollStart = rect.top - windowHeight / 2;
    let progress = -scrollStart / wrapperHeight;

    // Keep progress between 0 (top) and 1 (bottom)
    progress = Math.max(0, Math.min(1, progress));

    // Calculate vertical boat movement along stream
    const boatPosition = progress * wrapperHeight;
    boat.style.top = `${boatPosition}px`;

    // Highlight stoppage box when boat is docked nearby
    stoppages.forEach((stoppage) => {
      const stopTop = stoppage.offsetTop;
      if (Math.abs(boatPosition - stopTop) < 50) {
        stoppage.classList.add("active");
      } else {
        stoppage.classList.remove("active");
      }
    });
  });
}


});
