(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var nav = document.getElementById("site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = document.querySelectorAll("main section[id]");
  var yearEl = document.getElementById("year");
  var form = document.getElementById("contact-form");
  var formStatus = document.getElementById("form-status");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function setActiveNav() {
    var scrollPos = window.scrollY + (header ? header.offsetHeight : 80) + 40;
    var current = "home";
    sections.forEach(function (sec) {
      var top = sec.offsetTop;
      if (scrollPos >= top) {
        current = sec.id;
      }
    });
    navLinks.forEach(function (link) {
      var id = link.getAttribute("data-section");
      link.classList.toggle("is-active", id === current);
    });
  }

  function closeMobileNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  function openMobileNav() {
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMobileNav();
    });
  });

  window.addEventListener("scroll", setActiveNav, { passive: true });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      closeMobileNav();
    }
  });
  setActiveNav();

  if (form && formStatus) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      formStatus.textContent = "";
      formStatus.classList.remove("is-error", "is-success");

      var name = form.elements.namedItem("name");
      var email = form.elements.namedItem("email");
      var message = form.elements.namedItem("message");

      if (!name || !email || !message) return;

      var nameVal = String(name.value || "").trim();
      var emailVal = String(email.value || "").trim();
      var messageVal = String(message.value || "").trim();

      if (!nameVal || !emailVal || !messageVal) {
        formStatus.textContent = "Please fill in all fields.";
        formStatus.classList.add("is-error");
        return;
      }

      var mailto = "manhcal500@gmail.com";
      var subject = encodeURIComponent("Portfolio inquiry from " + nameVal);
      var body = encodeURIComponent(
        "Name: " + nameVal + "\nEmail: " + emailVal + "\n\n" + messageVal
      );
      window.location.href = "mailto:" + mailto + "?subject=" + subject + "&body=" + body;
      formStatus.textContent =
        "Your email app should open. If it doesn’t, copy your message and email " +
        mailto +
        ".";
      formStatus.classList.add("is-success");
    });
  }
})();
