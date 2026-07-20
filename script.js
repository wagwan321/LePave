/* Le Pavé Residences — interactions v2 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ========================================================
     Preloader → reveal hero
     ======================================================== */
  document.body.classList.add("loading");
  var revealed = false;
  function revealSite() {
    if (revealed) return;
    revealed = true;
    document.body.classList.remove("loading");
    document.body.classList.add("ready");
    var pre = document.getElementById("preloader");
    if (pre) pre.classList.add("done");
  }
  window.addEventListener("load", function () {
    window.setTimeout(revealSite, reduceMotion ? 0 : 1250);
  });
  // hard fallback so the page can never stay behind the loader
  window.setTimeout(revealSite, 4000);

  /* ========================================================
     Nav — solid on scroll + scroll progress
     ======================================================== */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("scrollProgress");
  function onScroll() {
    var y = window.scrollY;
    if (y > 40) nav.classList.add("scrolled"); else nav.classList.remove("scrolled");
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ========================================================
     Mobile menu
     ======================================================== */
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

  /* ========================================================
     Hero background parallax (background-position, no gaps)
     ======================================================== */
  var heroBg = document.querySelector(".hero__bg[data-parallax]");
  if (heroBg && !reduceMotion) {
    var factor = parseFloat(heroBg.getAttribute("data-parallax")) || 0.15;
    var ticking = false;
    function parallax() {
      var offset = window.scrollY * factor;
      heroBg.style.backgroundPosition = "center calc(50% + " + offset + "px)";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
  }

  /* ========================================================
     Scroll reveal (fade + rise)
     ======================================================== */
  var reveals = document.querySelectorAll(".reveal, .reveal-wipe");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 6) * 0.06 + "s";
      io.observe(el);
    });
    // safety net: never let content stay hidden
    window.setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add("in"); });
    }, 3500);
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ========================================================
     Count-up for stat numbers
     ======================================================== */
  var counters = document.querySelectorAll("[data-count]");
  function runCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var start = null, dur = 1500;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCount(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  }

  /* ========================================================
     Custom cursor (desktop, motion-friendly)
     ======================================================== */
  if (canHover && !reduceMotion) {
    var cur = document.getElementById("cursor");
    var dot = document.getElementById("cursorDot");
    if (cur && dot) {
      var mx = window.innerWidth / 2, my = window.innerHeight / 2;
      var cx = mx, cy = my;
      window.addEventListener("mousemove", function (e) {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + "px"; dot.style.top = my + "px";
      });
      (function loop() {
        cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
        // position via left/top so the .grow class can own `transform: scale`
        cur.style.left = cx + "px"; cur.style.top = cy + "px";
        window.requestAnimationFrame(loop);
      })();
      var interactive = "a, button, [data-magnetic], .room, [role='button'], input, select, textarea, label";
      document.querySelectorAll(interactive).forEach(function (el) {
        el.addEventListener("mouseenter", function () { cur.classList.add("grow"); });
        el.addEventListener("mouseleave", function () { cur.classList.remove("grow"); });
      });
      document.addEventListener("mouseleave", function () { cur.style.opacity = "0"; dot.style.opacity = "0"; });
      document.addEventListener("mouseenter", function () { cur.style.opacity = "1"; dot.style.opacity = "1"; });
    }
  }

  /* ========================================================
     Magnetic buttons
     ======================================================== */
  if (canHover && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      var strength = 0.35;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * strength;
        var y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = "translate(" + x + "px," + y + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ========================================================
     Booking form — emails the reservation to the hotel
     -------------------------------------------------------
     RECOMMENDED: create a free form at https://formspree.io
     (sign up with the hotel's reservations inbox), then paste
     your endpoint below. Until set, it opens the guest's mail app.
     ======================================================== */
  var FORMSPREE_ENDPOINT = "";
  var RESERVATIONS_EMAIL = "info@lepaveresidences.com";

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
      submitBtn.textContent = "Sending…"; submitBtn.disabled = true;
      fetch(FORMSPREE_ENDPOINT, { method: "POST", headers: { "Accept": "application/json" }, body: new FormData(form) })
        .then(function (res) { if (res.ok) { showSuccess(); form.reset(); submitBtn.disabled = true; } else { throw new Error("send failed"); } })
        .catch(function () { window.location.href = buildMailto(data); showSuccess(); });
    } else {
      window.location.href = buildMailto(data);
      showSuccess();
    }
  });

  /* ========================================================
     Accommodation — hover quick-peek + click-to-open modal
     -------------------------------------------------------
     NOTE: bed counts and sizes are PLACEHOLDERS — replace with
     Le Pavé's real figures when available.
     ======================================================== */
  var ROOMS = {
    "deluxe-king": {
      title: "Deluxe King", view: "Urban View", img: "images/room-6.jpg",
      desc: "An elegant king retreat with warm contemporary finishes, a private terrace and a serene urban outlook — refined comfort for the solo traveller or couple.",
      specs: { Beds: "1 King", Guests: "2", Size: "35 m²", View: "Urban" },
      amenities: ["Private terrace", "Kitchenette", "Smart TV", "Rain shower", "Free Wi-Fi", "Daily housekeeping"]
    },
    "deluxe-twin": {
      title: "Deluxe Twin", view: "Mountain View", img: "images/room-7.jpg",
      desc: "Twin comfort with refined detailing and a terrace framing the mountains — ideal for friends or colleagues travelling together.",
      specs: { Beds: "2 Twin", Guests: "2", Size: "35 m²", View: "Mountain" },
      amenities: ["Private terrace", "Kitchenette", "Smart TV", "Rain shower", "Free Wi-Fi", "Daily housekeeping"]
    },
    "one-bedroom": {
      title: "One-Bedroom Studio", view: "Sea View", img: "images/room-2.jpg",
      desc: "A spacious open-plan residence with a full kitchen and sweeping seaside views from a generous private terrace.",
      specs: { Beds: "1 King", Guests: "2", Size: "50 m²", View: "Sea" },
      amenities: ["Full kitchen", "Living area", "Private terrace", "Smart TV", "Free Wi-Fi", "Washing machine"]
    },
    "two-bedroom": {
      title: "Two-Bedroom Studio", view: "Sea View", img: "images/room-2.jpg",
      desc: "Room to breathe — two bedrooms, a light-filled lounge and a full kitchen, all opening onto a terrace above the coastline.",
      specs: { Beds: "1 King · 2 Twin", Guests: "4", Size: "80 m²", View: "Sea" },
      amenities: ["Full kitchen", "2 bathrooms", "Living & dining", "Private terrace", "Free Wi-Fi", "Washing machine"]
    },
    "family-suite": {
      title: "Family Suite", view: "Sea View", img: "images/room-6.jpg",
      desc: "Our most generous residence, designed for memorable family stays — expansive living and dining, a full kitchen and a wraparound terrace.",
      specs: { Beds: "2 King · Sofa", Guests: "5", Size: "110 m²", View: "Sea" },
      amenities: ["Full kitchen", "2 bathrooms", "Living & dining", "Wraparound terrace", "Free Wi-Fi", "Washing machine"]
    },
    "panoramic-suite": {
      title: "Panoramic Suite", view: "Sea View", img: "images/room-7.jpg",
      desc: "Wraparound terraces frame the coastline from sunrise to sunset in this signature suite — the finest outlook Le Pavé offers.",
      specs: { Beds: "1 King", Guests: "3", Size: "70 m²", View: "Sea" },
      amenities: ["Panoramic terrace", "Kitchenette", "Lounge area", "Smart TV", "Free Wi-Fi", "Daily housekeeping"]
    }
  };

  var modal = document.getElementById("roomModal");
  var mImg = document.getElementById("modalImg");
  var mView = document.getElementById("modalView");
  var mTitle = document.getElementById("modalTitle");
  var mDesc = document.getElementById("modalDesc");
  var mSpecs = document.getElementById("modalSpecs");
  var mAmen = document.getElementById("modalAmenities");
  var lastFocused = null;

  function openModal(key) {
    var r = ROOMS[key];
    if (!r) return;
    mImg.style.backgroundImage = "url('" + r.img + "')";
    mView.textContent = r.view;
    mTitle.textContent = r.title;
    mDesc.textContent = r.desc;
    mSpecs.innerHTML = Object.keys(r.specs).map(function (k) {
      return '<div class="spec"><span class="spec__k">' + k + '</span><span class="spec__v">' + r.specs[k] + '</span></div>';
    }).join("");
    mAmen.innerHTML = r.amenities.map(function (a) { return "<li>" + a + "</li>"; }).join("");
    lastFocused = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal__close").focus();
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".room[data-room]").forEach(function (card) {
    var key = card.getAttribute("data-room");
    var r = ROOMS[key];
    if (r) {
      var ph = card.querySelector(".ph");
      var quick = document.createElement("div");
      quick.className = "room__quick";
      quick.innerHTML =
        '<div class="room__quick-specs">' +
          '<span>' + r.specs.Beds + '</span>' +
          '<span>' + r.specs.Guests + ' Guests</span>' +
          '<span>' + r.specs.Size + '</span>' +
        '</div>' +
        '<span class="room__quick-cta">View Details +</span>';
      ph.appendChild(quick);
    }
    card.addEventListener("click", function () { openModal(key); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(key); }
    });
  });

  modal.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });

  /* ---- Footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
