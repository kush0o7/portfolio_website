function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
  
    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !icon.contains(e.target)) {
        menu.classList.remove("open");
        icon.classList.remove("open");
      }
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetElement = document.querySelector(this.getAttribute("href"));
      const offset = 70; // Adjust for navbar height
      const elementPosition = targetElement.offsetTop - offset;
  
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    });
  });
  
  // Scroll Animation
  const faders = document.querySelectorAll(".fade-in");
  const appearOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px",
  };
  
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  
  faders.forEach((fader) => {
    appearOnScroll.observe(fader);
  });
  
  // Active Navigation Link Highlight
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");
    let currentSection = "";
  
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 80;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id");
      }
    });
  
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });
  // JavaScript for scroll-based animation
// JavaScript for scroll-based animation
const experienceItems = document.querySelectorAll('.experience-item');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  },
  { threshold: 0.1 } // Trigger when 10% of the element is visible
);

experienceItems.forEach((item) => observer.observe(item));

  
  // Close mobile menu on link click
  document.querySelectorAll(".menu-links a").forEach((link) => {
    link.addEventListener("click", () => {
      const menu = document.querySelector(".menu-links");
      const icon = document.querySelector(".hamburger-icon");
      menu.classList.remove("open");
      icon.classList.remove("open");
    });
  });
  