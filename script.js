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
