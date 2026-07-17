/**
* Web3Forms submission handler for the contact form.
* Free, no-backend form delivery - works on static hosts like Vercel.
* https://web3forms.com/
*/
(function () {
  "use strict";

  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const loadingEl = form.querySelector(".loading");
    const errorEl = form.querySelector(".error-message");
    const sentEl = form.querySelector(".sent-message");

    loadingEl.classList.add("d-block");
    errorEl.classList.remove("d-block");
    sentEl.classList.remove("d-block");

    const formData = new FormData(form);

    fetch(form.getAttribute("action"), {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        loadingEl.classList.remove("d-block");
        if (data.success) {
          sentEl.classList.add("d-block");
          form.reset();
        } else {
          errorEl.innerHTML = data.message || "Something went wrong. Please try again.";
          errorEl.classList.add("d-block");
        }
      })
      .catch(() => {
        loadingEl.classList.remove("d-block");
        errorEl.innerHTML = "Something went wrong. Please try again.";
        errorEl.classList.add("d-block");
      });
  });
})();
