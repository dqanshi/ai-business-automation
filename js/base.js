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

/* Shrink navbar on scroll */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if(window.scrollY > 50){
    navbar.classList.add("shrink");
  }else{
    navbar.classList.remove("shrink");
  }
});

/* Search expand */

const searchWrapper = document.getElementById("searchWrapper");

if(searchWrapper){
  searchWrapper.addEventListener("click", () => {
    searchWrapper.classList.toggle("active");
  });
}
