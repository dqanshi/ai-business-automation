import { db } from "./firebase.js";
import { collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const postsContainer = document.getElementById("posts");
const featuredContainer = document.getElementById("featuredPost");
const trendingContainer = document.getElementById("trending");

async function loadPosts(){
  const snapshot = await getDocs(collection(db,"posts"));
  let first = true;

  snapshot.forEach(doc=>{
    const post = doc.data();

    if(post.status==="published"){

      if(first){
        featuredContainer.innerHTML = `
          <div class="card">
            <img src="${post.image||''}">
            <h2>
              <a href="post.html?slug=${post.slug}">
                ${post.title}
              </a>
            </h2>
            <p>${post.meta||''}</p>
          </div>
        `;
        first = false;
      }

      postsContainer.innerHTML += `
        <div class="card">
          <img src="${post.image||''}">
          <h3>
            <a href="post.html?slug=${post.slug}">
              ${post.title}
            </a>
          </h3>
        </div>
      `;

      trendingContainer.innerHTML += `
        <p>
          <a href="post.html?slug=${post.slug}">
            ${post.title}
          </a>
        </p>
      `;
    }
  });
}

loadPosts();

/* DARK MODE */
document.getElementById("darkToggle")
.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
});
