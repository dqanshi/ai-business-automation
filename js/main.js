import { db } from "./firebase.js";
import { collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("posts");

/* ===============================
   LOAD POSTS
================================ */
async function loadPosts() {

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "posts"));

  snapshot.forEach(doc => {
    const post = doc.data();

    if (post.status === "published") {

      const image = post.image
        ? post.image
        : "https://via.placeholder.com/800x400?text=AutomateScale";

      const meta = post.meta ? post.meta : "";

      const slug = post.slug
        ? post.slug
        : doc.id; // fallback if slug missing

      container.innerHTML += `
        <div class="card">
          <img src="${image}" alt="${post.title}">
          
          <h2>
            <a href="post.html?slug=${slug}">
              ${post.title}
            </a>
          </h2>

          <p>${meta}</p>
        </div>
      `;
    }
  });

  // If no posts
  if (container.innerHTML.trim() === "") {
    container.innerHTML = `
      <div class="card">
        <h3>No articles yet.</h3>
      </div>
    `;
  }
}

loadPosts();


/* ===============================
   DARK MODE TOGGLE
================================ */
const toggleBtn = document.getElementById("darkToggle");

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
}

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}
