// Particle Canvas Setup
const canvas = document.getElementById("mouse-net");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const particles = [];
const numParticles = 220;

const mouse = {
  x: null,
  y: null,
  radius: 140
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.size = 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#5aaaff";
    ctx.fill();
  }
}

function initParticles() {
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  const overlay = document.querySelector('.overlay');
  const overlayRect = overlay.getBoundingClientRect();

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150 && isNearMouse(particles[i], mouse)) {
        // Only show lines when mouse is in hero section
        if (mouse.y >= overlayRect.top && mouse.y <= overlayRect.bottom) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(90, 168, 255, " + (1 - distance / 150) + ")";
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }
}

function isNearMouse(particle, mouse) {
  const dx = particle.x - mouse.x;
  const dy = particle.y - mouse.y;
  return dx * dx + dy * dy < mouse.radius * mouse.radius;
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animate);
}

initParticles();
animate();

// Load About Section
document.addEventListener("DOMContentLoaded", () => {
  fetch("about.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("about").innerHTML = data;
    });
});