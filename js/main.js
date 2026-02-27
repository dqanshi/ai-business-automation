import { db } from "./firebase.js";
import { collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const postsDiv = document.getElementById("posts");
const searchInput = document.getElementById("searchInput");
const darkToggle = document.getElementById("darkToggle");

let allPosts = [];

loadPosts();

/* ===== LOAD POSTS ===== */

async function loadPosts(){
  const snapshot = await getDocs(collection(db,"posts"));

  snapshot.forEach(doc=>{
    const post = doc.data();
    if(post.status === "published"){
      allPosts.push(post);
    }
  });

  renderPosts(allPosts);
  loadSidebar();
}

/* ===== RENDER POSTS ===== */

function renderPosts(posts){
  postsDiv.innerHTML = "";

  posts.forEach(post=>{
    postsDiv.innerHTML += `
      <div class="post-card">
        <h2>
          <a href="post.html?slug=${post.slug}">
            ${post.title}
          </a>
        </h2>
        <p>${post.meta}</p>
      </div>
    `;
  });
}

/* ===== SEARCH ===== */

searchInput.addEventListener("input", ()=>{
  const value = searchInput.value.toLowerCase();

  const filtered = allPosts.filter(p =>
    p.title.toLowerCase().includes(value)
  );

  renderPosts(filtered);
});

/* ===== SIDEBAR ===== */

function loadSidebar(){
  const latest = document.getElementById("latest");

  allPosts.slice(0,5).forEach(p=>{
    latest.innerHTML += `
      <p>
        <a href="post.html?slug=${p.slug}">
          ${p.title}
        </a>
      </p>
    `;
  });
}

/* ===== DARK MODE ===== */

darkToggle.addEventListener("click", ()=>{
  document.body.classList.toggle("dark");
});
