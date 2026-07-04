/* Le Pavé Residences — interactions */
(function () {
  "use strict";

  /* ---- Nav: solid background on scroll ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el, i) {
      // subtle stagger for grouped items
      el.style.transitionDelay = (i % 6) * 0.06 + "s";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* =========================================================
     Booking form — emails the reservation to the hotel.
     -------------------------------------------------------
     RECOMMENDED: create a free form at https://formspree.io
     (sign up with the hotel's reservations inbox), then paste
     your endpoint below, e.g.
       FORMSPREE_ENDPOINT = "https://formspree.io/f/abcxyz";
     Until that is set, the form falls back to opening the
     guest's email app addressed to RESERVATIONS_EMAIL.
     ========================================================= */
  var FORMSPREE_ENDPOINT = "";                      // <-- paste Formspree endpoint here
  var RESERVATIONS_EMAIL = "info@lepaveresidences.com"; // <-- confirm the hotel's inbox

  var form = document.getElementById("bookingForm");
  var note = document.getElementById("formNote");
  var submitBtn = form.querySelector('button[type="submit"]');

  function showSuccess() {
    note.hidden = false;
    submitBtn.textContent = "Reservation Requested";
    submitBtn.disabled = true;
  }

  function buildMailto(data) {
    var subject = "Reservation Request — " + (data.name || "Guest");
    var lines = [
      "New reservation request from the Le Pavé website:", "",
      "Name: " + (data.name || ""),
      "Email: " + (data.email || ""),
      "Phone: " + (data.phone || ""),
      "Check-in: " + (data.checkin || ""),
      "Check-out: " + (data.checkout || ""),
      "Residence: " + (data.room || ""),
      "", "Message:", (data.message || "—")
    ];
    return "mailto:" + RESERVATIONS_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var data = Object.fromEntries(new FormData(form).entries());

    if (FORMSPREE_ENDPOINT) {
      submitBtn.textContent = "Sending…";
      submitBtn.disabled = true;
      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      }).then(function (res) {
        if (res.ok) { showSuccess(); form.reset(); submitBtn.disabled = true; }
        else { throw new Error("send failed"); }
      }).catch(function () {
        // fall back to the guest's mail client
        window.location.href = buildMailto(data);
        showSuccess();
      });
    } else {
      // No backend configured yet — hand off to the guest's email app
      window.location.href = buildMailto(data);
      showSuccess();
    }
  });

  /* ---- Footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
