// Apply saved theme immediately
(function () {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.documentElement.classList.add("dark");
  }
})();

// Toggle logic
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkToggle");

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    localStorage.setItem(
      "theme",
      document.documentElement.classList.contains("dark")
        ? "dark"
        : "light"
    );
  });
});
