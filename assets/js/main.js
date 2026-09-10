(function () {
  "use strict";

  /* Sticky header shadow */
  var header = document.getElementById("site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    var top = document.getElementById("scroll-top");
    if (top) top.classList.toggle("is-visible", window.scrollY > 500);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var toggle = document.getElementById("nav-toggle");
  var mobile = document.getElementById("nav-mobile");
  var mobileClose = document.getElementById("nav-mobile-close");
  function openMobile() { mobile && mobile.classList.add("is-open"); document.body.style.overflow = "hidden"; }
  function closeMobile() { mobile && mobile.classList.remove("is-open"); document.body.style.overflow = ""; }
  toggle && toggle.addEventListener("click", openMobile);
  mobileClose && mobileClose.addEventListener("click", closeMobile);
  mobile && mobile.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMobile);
  });

  /* Scroll to top */
  var scrollTopBtn = document.getElementById("scroll-top");
  scrollTopBtn && scrollTopBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Contact form (Web3Forms) */
  var form = document.getElementById("contactForm");
  if (form) {
    var statusEl = form.querySelector(".form-status");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      statusEl.textContent = "Sending your message...";
      statusEl.className = "form-status loading";

      var formData = new FormData(form);
      fetch(form.getAttribute("action"), {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (data.success) {
            statusEl.textContent = "Your message has been sent. Thank you!";
            statusEl.className = "form-status success";
            form.reset();
          } else {
            statusEl.textContent = data.message || "Something went wrong. Please try again.";
            statusEl.className = "form-status error";
          }
        })
        .catch(function () {
          statusEl.textContent = "Something went wrong. Please try again.";
          statusEl.className = "form-status error";
        });
    });
  }
})();
