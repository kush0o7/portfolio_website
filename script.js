// Handle hamburger menu toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });

  // Close nav when clicking outside
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
    }
  });
}

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    e.preventDefault();
    const offset = 70; // navbar height
    const elementPosition = targetElement.offsetTop - offset;

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  });
});

// IntersectionObserver for reveal animations
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observerOptions = {
    threshold: 0.18,
    rootMargin: "0px 0px -80px 0px",
  };

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      obs.unobserve(entry.target);
    });
  }, observerOptions);

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  // Fallback: show all immediately
  revealElements.forEach((el) => el.classList.add("show"));
}

// Project card flip on click
document.querySelectorAll(".project-card").forEach((card) => {
  const projectBox = card.querySelector(".project-box");
  if (!projectBox) return;

  card.addEventListener("click", () => {
    projectBox.classList.toggle("flipped");
    card.classList.toggle("is-flipped");
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });
});

// Active navigation highlight on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinksAll = document.querySelectorAll(".nav-link");

  let currentSectionId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navLinksAll.forEach((link) => {
    link.classList.remove("active");
    if (currentSectionId && link.getAttribute("href") === `#${currentSectionId}`) {
      link.classList.add("active");
    }
  });
});

// Set current year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Skill bar animator
document.addEventListener("DOMContentLoaded", () => {
  const skillBars = Array.from(document.querySelectorAll(".skill-bar"));

  if (!skillBars.length) return;

  skillBars.forEach((bar) => {
    let inner = bar.querySelector("span");
    if (!inner) {
      inner = document.createElement("span");
      bar.appendChild(inner);
    }
    inner.style.width = "0%";
    if (!bar.getAttribute("data-level")) bar.setAttribute("data-level", "0");
  });

  if ("IntersectionObserver" in window) {
    const barObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const levelRaw = bar.getAttribute("data-level") || bar.dataset.level || "0";
        const level = Math.max(0, Math.min(100, Number(levelRaw) || 0));
        const inner = bar.querySelector("span");
        if (inner) {
          inner.style.width = `${level}%`;
          bar.setAttribute("aria-valuenow", String(level));
        }
        obs.unobserve(bar);
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -80px 0px" });

    skillBars.forEach((bar) => barObs.observe(bar));
  } else {
    skillBars.forEach((bar) => {
      const level = Math.max(0, Math.min(100, Number(bar.getAttribute("data-level")) || 0));
      const inner = bar.querySelector("span");
      if (inner) inner.style.width = `${level}%`;
      bar.setAttribute("aria-valuenow", String(level));
    });
  }
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// 3D tilt for cards
if (canHover && !prefersReducedMotion) {
  document.querySelectorAll(".tilt-card[data-tilt]").forEach((el) => {
    const maxTilt = Number(el.dataset.tilt) || 8;
    const perspective = Number(el.dataset.perspective) || 900;
    let rafId = null;

    el.style.setProperty("--perspective", `${perspective}px`);

    const handleMove = (event) => {
      if (el.classList.contains("is-flipped")) return;
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rx = (y * -maxTilt).toFixed(2);
      const ry = (x * maxTilt).toFixed(2);

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.setProperty("--rx", `${rx}deg`);
        el.style.setProperty("--ry", `${ry}deg`);
      });
    };

    el.addEventListener("mouseenter", () => {
      el.classList.add("is-tilting");
    });

    el.addEventListener("mouseleave", () => {
      el.classList.remove("is-tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });

    el.addEventListener("mousemove", handleMove);
  });
}

// Magnetic hover for buttons/links
if (canHover && !prefersReducedMotion) {
  document.querySelectorAll(".magnetic").forEach((el) => {
    const strength = Number(el.dataset.magnet) || 12;

    const handleMove = (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.setProperty("--mag-x", `${(x / rect.width) * strength}px`);
      el.style.setProperty("--mag-y", `${(y / rect.height) * strength}px`);
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", () => {
      el.style.setProperty("--mag-x", "0px");
      el.style.setProperty("--mag-y", "0px");
    });
  });
}

// Interactive particle background
const bgCanvas = document.getElementById("bg-canvas");

if (bgCanvas) {
  const ctx = bgCanvas.getContext("2d");
  let particles = [];
  let width = 0;
  let height = 0;
  let animationId = null;
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };

  const palette = [
    "rgba(34, 211, 238, 0.6)",
    "rgba(245, 158, 11, 0.5)",
    "rgba(129, 140, 248, 0.45)",
  ];

  const resizeCanvas = () => {
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    bgCanvas.width = width * dpr;
    bgCanvas.height = height * dpr;
    bgCanvas.style.width = `${width}px`;
    bgCanvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(120, Math.floor(width / 10));
    particles = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));
  };

  const draw = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          ctx.strokeStyle = "rgba(34, 211, 238, 0.12)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    });

    ctx.globalCompositeOperation = "source-over";
    animationId = requestAnimationFrame(draw);
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.active = true;
  });
  window.addEventListener("mouseleave", () => {
    mouse.active = false;
  });

  if (!prefersReducedMotion) {
    draw();
  } else if (ctx) {
    draw();
    if (animationId) cancelAnimationFrame(animationId);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && animationId) {
      cancelAnimationFrame(animationId);
    } else if (!document.hidden && !prefersReducedMotion) {
      draw();
    }
  });
}

// Project filters
const filterButtons = document.querySelectorAll(".filter-chip");
const projectCards = document.querySelectorAll(".project-card");

const applyFilter = (filter) => {
  projectCards.forEach((card) => {
    const tags = (card.dataset.tags || "").split(" ").filter(Boolean);
    const match = filter === "all" || tags.includes(filter);
    card.classList.toggle("is-hidden", !match);
  });
  filterButtons.forEach((btn) => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
};

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    applyFilter(btn.dataset.filter || "all");
  });
});

// Command palette
const cmdk = document.getElementById("cmdk");
const cmdkOverlay = document.getElementById("cmdk-overlay");
const cmdkInput = document.getElementById("cmdk-input");
const cmdkItems = Array.from(document.querySelectorAll(".cmdk-item"));

const openCmdk = () => {
  if (!cmdk || !cmdkInput) return;
  cmdk.classList.add("open");
  cmdk.setAttribute("aria-hidden", "false");
  cmdkInput.value = "";
  cmdkItems.forEach((item) => (item.style.display = "block"));
  cmdkInput.focus();
};

const closeCmdk = () => {
  if (!cmdk) return;
  cmdk.classList.remove("open");
  cmdk.setAttribute("aria-hidden", "true");
};

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openCmdk();
  }
  if (event.key === "Escape") {
    closeCmdk();
  }
});

cmdkOverlay?.addEventListener("click", closeCmdk);

cmdkInput?.addEventListener("input", (event) => {
  const value = event.target.value.toLowerCase();
  cmdkItems.forEach((item) => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(value) ? "block" : "none";
  });
});

cmdkItems.forEach((item) => {
  item.addEventListener("click", () => {
    const href = item.getAttribute("data-href");
    const external = item.getAttribute("data-external") === "true";
    if (href) {
      if (external) {
        window.open(href, "_blank", "noopener");
      } else {
        const target = document.querySelector(href);
        if (target) {
          const offset = 70;
          const elementPosition = target.offsetTop - offset;
          window.scrollTo({ top: elementPosition, behavior: "smooth" });
        }
      }
    }
    closeCmdk();
  });
});
