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

// Parallax for background shapes
const fxLayer = document.querySelector(".fx-layer");
const depthNodes = Array.from(document.querySelectorAll("[data-depth]"));

if (fxLayer && depthNodes.length && !prefersReducedMotion) {
  depthNodes.forEach((el) => {
    const depth = Number(el.dataset.depth) || 0;
    el.style.setProperty("--depth", depth);
  });

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let latestScroll = window.scrollY;
  let ticking = false;

  const updateParallax = () => {
    const offsetX = (mouseX - window.innerWidth / 2) * 0.02;
    const offsetY = (mouseY - window.innerHeight / 2) * 0.02;
    fxLayer.style.setProperty("--px", `${offsetX}px`);
    fxLayer.style.setProperty("--py", `${offsetY}px`);
    fxLayer.style.setProperty("--scroll", `${latestScroll * -0.02}px`);
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    requestTick();
  });

  window.addEventListener("scroll", () => {
    latestScroll = window.scrollY;
    requestTick();
  });
}
