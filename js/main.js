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

  /* Contact: mailto/tel often fail on Windows desktop; use Gmail web + copy phone */
  var emailLink = document.querySelector("a.contact-email-link");
  var phoneLink = document.querySelector("a.contact-phone-link");
  var contactFeedback = document.getElementById("contact-feedback");
  var desktopMql = window.matchMedia("(min-width: 768px)");

  var CONTACT_EMAIL = "manhcal500@gmail.com";
  var GMAIL_COMPOSE =
    "https://mail.google.com/mail/?view=cm&fs=1&to=" +
    encodeURIComponent(CONTACT_EMAIL);
  var MAILTO_HREF = "mailto:" + CONTACT_EMAIL;
  var PHONE_COPY_TEXT = "+1 630-340-2278";

  function showContactFeedback(message) {
    if (!contactFeedback) return;
    contactFeedback.textContent = message;
    contactFeedback.hidden = false;
    window.clearTimeout(showContactFeedback._t);
    showContactFeedback._t = window.setTimeout(function () {
      contactFeedback.textContent = "";
      contactFeedback.hidden = true;
    }, 4000);
  }

  function syncEmailForViewport() {
    if (!emailLink) return;
    if (desktopMql.matches) {
      emailLink.href = GMAIL_COMPOSE;
      emailLink.target = "_blank";
      emailLink.rel = "noopener noreferrer";
      emailLink.setAttribute(
        "aria-label",
        "Compose email in Gmail to " + CONTACT_EMAIL
      );
    } else {
      emailLink.href = MAILTO_HREF;
      emailLink.removeAttribute("target");
      emailLink.rel = "noopener noreferrer";
      emailLink.setAttribute(
        "aria-label",
        "Send email to " + CONTACT_EMAIL
      );
    }
  }

  function syncPhoneAriaForViewport() {
    if (!phoneLink) return;
    if (allowNativeTelLink()) {
      phoneLink.setAttribute("aria-label", "Call " + PHONE_COPY_TEXT);
    } else {
      phoneLink.setAttribute(
        "aria-label",
        "Copy phone number " + PHONE_COPY_TEXT + " to clipboard"
      );
    }
  }

  function allowNativeTelLink() {
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return true;
    }
    return (
      window.matchMedia("(pointer: coarse)").matches &&
      window.innerWidth <= 768
    );
  }

  function syncContactDesktop() {
    syncEmailForViewport();
    syncPhoneAriaForViewport();
  }

  if (emailLink || phoneLink) {
    syncContactDesktop();
    desktopMql.addEventListener("change", syncContactDesktop);
    window.addEventListener("resize", syncContactDesktop);
  }

  /**
   * Copy phone number in the same user-gesture tick. Never navigate to tel: from
   * async callbacks — browsers block that as an automatic call.
   */
  function copyPhoneNumberSync() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        var p = navigator.clipboard.writeText(PHONE_COPY_TEXT);
        if (p && typeof p.then === "function") {
          p.then(function () {
            showContactFeedback(
              "Number copied. Paste it into your phone or dialer to call."
            );
          }).catch(function () {
            showContactFeedback(
              "Copy this number: " + PHONE_COPY_TEXT
            );
          });
          return;
        }
      } catch (err) {
        /* fall through */
      }
    }
    var ta = document.createElement("textarea");
    ta.value = PHONE_COPY_TEXT;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) {
        showContactFeedback(
          "Number copied. Paste it into your phone or dialer to call."
        );
      } else {
        showContactFeedback("Copy this number: " + PHONE_COPY_TEXT);
      }
    } catch (err2) {
      document.body.removeChild(ta);
      showContactFeedback("Copy this number: " + PHONE_COPY_TEXT);
    }
  }

  if (phoneLink) {
    phoneLink.addEventListener("click", function (e) {
      /* Native tel: only on phones/tablets; PC blocks async tel: as auto-dial. */
      if (allowNativeTelLink()) {
        return;
      }
      e.preventDefault();
      copyPhoneNumberSync();
    });
  }
})();
