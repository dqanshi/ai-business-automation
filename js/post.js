import { db } from "./firebase.js";
import { collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

if (!slug) {
  document.body.innerHTML = "<h2>Post not found.</h2>";
  throw new Error("No slug provided in URL");
}

const snapshot = await getDocs(collection(db,"posts"));

let currentPost = null;
let allPosts = [];

snapshot.forEach(doc=>{
  const data = doc.data();
  allPosts.push(data);

  if(data.slug === slug){
    currentPost = data;
  }
});

if(!currentPost){
  document.body.innerHTML = "<h2>Post not found.</h2>";
  throw new Error("Slug not found in database");
}

/* ===== SET POST ===== */

document.getElementById("postTitle").innerText = currentPost.title;
document.getElementById("postDate").innerText =
  new Date(currentPost.date).toDateString();

document.getElementById("postContent").innerHTML =
  currentPost.content;

document.title = currentPost.title + " | AutomateScale";

/* ===== RELATED POSTS ===== */

const relatedContainer = document.getElementById("relatedPosts");

if (relatedContainer) {
  allPosts
    .filter(p => p.slug !== slug)
    .slice(0,3)
    .forEach(p=>{
      relatedContainer.innerHTML += `
        <a href="post.html?slug=${p.slug}">
          ${p.title}
        </a>
      `;
    });
}
