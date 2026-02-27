// Dark mode toggle system

document.addEventListener("DOMContentLoaded", () => {

  const toggle = document.getElementById("darkToggle");

  // Load saved preference
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");

      localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
      );
    });
  }

});
