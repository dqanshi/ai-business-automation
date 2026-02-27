import { db } from "./firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ---------------- DARK MODE ---------------- */

const toggleBtn = document.getElementById("darkToggle");

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    // Save mode
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
}

// Load saved mode
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/* ---------------- LOAD POSTS ---------------- */

const postsContainer = document.getElementById("posts");
const trendingContainer = document.getElementById("trending");

async function loadPosts() {
  if (!postsContainer) return;

  const snapshot = await getDocs(collection(db, "posts"));

  let posts = [];

  snapshot.forEach(doc => {
    const data = doc.data();

    if (data.status === "published") {
      posts.push({
        id: doc.id,
        ...data
      });
    }
  });

  // Sort by newest
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // LATEST POSTS
  postsContainer.innerHTML = "";
  posts.forEach(post => {
    postsContainer.innerHTML += `
      <div class="card">
        <h3>
          <a href="post.html?id=${post.id}">
            ${post.title}
          </a>
        </h3>
        <p>${post.meta || ""}</p>
      </div>
    `;
  });

  // TRENDING (first 3)
  if (trendingContainer) {
    trendingContainer.innerHTML = "";

    posts.slice(0, 3).forEach(post => {
      trendingContainer.innerHTML += `
        <p>
          <a href="post.html?id=${post.id}">
            ${post.title}
          </a>
        </p>
      `;
    });
  }
}

loadPosts();
