(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const navbar = document.querySelector(".navbar");
if (navbar && navbar.classList.contains("has-hero")) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}
const taglines = [
  "Your Home, Anywhere in the World",
  "Explore. Discover. Wander.",
  "Find Your Perfect Escape",
  "Adventure Awaits Everywhere",
];

const typedText = document.getElementById("typed-text");

if (typedText) {
  let taglineIndex = 0;
  let charIndex = 0;

  function type() {
    const current = taglines[taglineIndex];

    // Type next character
    typedText.textContent = current.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === current.length) {
      // Finished typing — pause then wipe and move to next
      setTimeout(() => {
        typedText.textContent = "";
        charIndex = 0;
        taglineIndex = (taglineIndex + 1) % taglines.length;
        type();
      }, 1500);
      return;
    }

    setTimeout(type, 100); // typing speed
  }

  type();
}
