/* ================= THEME SYSTEM ================= */

/* Apply saved theme instantly (prevents white flash) */
(function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }
})();

/* After page loads */
document.addEventListener("DOMContentLoaded", () => {

  /* ===== Dark Mode Toggle ===== */
  const toggle = document.getElementById("darkToggle");

  if (toggle) {
    toggle.addEventListener("click", () => {

      document.documentElement.classList.toggle("dark");

      localStorage.setItem(
        "theme",
        document.documentElement.classList.contains("dark")
          ? "dark"
          : "light"
      );

    });
  }

  /* ===== Navbar Shrink On Scroll ===== */
  const navbar = document.getElementById("navbar");

  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("shrink");
      } else {
        navbar.classList.remove("shrink");
      }
    });
  }

  /* ===== Search Expand ===== */
  const searchWrapper = document.getElementById("searchWrapper");

  if (searchWrapper) {
    searchWrapper.addEventListener("click", () => {
      searchWrapper.classList.toggle("active");
    });
  }

});
