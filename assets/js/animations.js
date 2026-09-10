(function () {
  "use strict";
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  /* Pinned horizontal-scroll services carousel (desktop only —
     mobile keeps the native touch-scroll carousel from style.css) */
  ScrollTrigger.matchMedia({
    "(min-width: 901px)": function () {
      var carousel = document.querySelector(".tilt-carousel");
      var track = document.querySelector(".tilt-track");
      var section = document.getElementById("services");
      if (!carousel || !track || !section) return;

      carousel.classList.add("is-pinned");
      section.classList.add("services-pinned");

      function distance() {
        return Math.max(0, track.scrollWidth - carousel.clientWidth);
      }

      var tween = gsap.to(track, {
        x: function () { return -distance(); },
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: function () { return "+=" + distance(); },
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true
        }
      });

      requestAnimationFrame(function () { ScrollTrigger.refresh(); });

      return function () {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
        carousel.classList.remove("is-pinned");
        section.classList.remove("services-pinned");
        gsap.set(track, { clearProps: "transform" });
      };
    }
  });

  /* Scroll parallax on decorative elements */
  function parallax(selector, vars, triggerSelector) {
    var el = document.querySelector(selector);
    if (!el) return;
    gsap.to(el, Object.assign({
      ease: "none",
      scrollTrigger: {
        trigger: document.querySelector(triggerSelector) || el,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    }, vars));
  }

  parallax(".hero-bg", { y: 90 }, ".hero");
  parallax(".hero-visual", { y: 50 }, ".hero");
  parallax(".about-visual", { y: -40 }, "#about");
  parallax(".wv-core", { rotate: 18 }, "#why-us");
  parallax(".service-hero-art", { y: -24 }, ".service-layout");
})();
