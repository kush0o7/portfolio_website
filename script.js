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

// === Skill bar animator (robust) ===
document.addEventListener("DOMContentLoaded", () => {
  const skillBars = Array.from(document.querySelectorAll(".skill-bar"));

  if (!skillBars.length) {
    console.log("Skill bars: none found (selector .skill-bar).");
    return;
  }

  // ensure spans exist and start at 0
  skillBars.forEach(bar => {
    let inner = bar.querySelector("span");
    if (!inner) {
      // create one if missing
      inner = document.createElement("span");
      bar.appendChild(inner);
    }
    // remove any inline width that could block animation; start at 0
    inner.style.width = "0%";
    // ensure the bar has a data-level attribute (fallback to 0)
    if (!bar.getAttribute("data-level")) bar.setAttribute("data-level", "0");
  });

  // use IntersectionObserver if available
  if ("IntersectionObserver" in window) {
    const barObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const levelRaw = bar.getAttribute("data-level") || bar.dataset.level || "0";
        // sanitize to number 0-100
        const level = Math.max(0, Math.min(100, Number(levelRaw) || 0));
        const inner = bar.querySelector("span");
        if (inner) {
          // set width to target percent — CSS transition will animate
          inner.style.width = `${level}%`;
          // optional: add aria-valuenow for accessibility
          bar.setAttribute("aria-valuenow", String(level));
        }
        obs.unobserve(bar);
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -80px 0px" });

    skillBars.forEach(b => barObs.observe(b));
  } else {
    // fallback: just set widths immediately
    console.log("IntersectionObserver not available — setting skill widths immediately.");
    skillBars.forEach(bar => {
      const level = Math.max(0, Math.min(100, Number(bar.getAttribute("data-level")) || 0));
      const inner = bar.querySelector("span");
      if (inner) inner.style.width = `${level}%`;
      bar.setAttribute("aria-valuenow", String(level));
    });
  }

  console.log(`Skill bars: initialized (${skillBars.length} bars).`);
});

// small parallax for hero image
(function(){
  const pic = document.querySelector('.section__pic-container img');
  if (!pic) return;
  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1..1
    const dy = (e.clientY - cy) / cy;
    pic.style.transform = `translate3d(${dx*4}px, ${dy*4}px, 0) rotate(${dx*1.2}deg)`;
  });
  window.addEventListener('mouseleave', () => pic.style.transform = '');
})();
