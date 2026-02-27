import { db } from "./firebase.js";
import { collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

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

if(currentPost){

  document.getElementById("postTitle").innerText = currentPost.title;
  document.getElementById("postAuthor").innerText = currentPost.author || "AutomateScale";
  document.getElementById("postDate").innerText = new Date(currentPost.date).toDateString();
  document.getElementById("postContent").innerHTML = currentPost.content;
  document.getElementById("postImage").src = currentPost.image || "";

  document.title = currentPost.title + " | AutomateScale";

  document.getElementById("metaDesc")
    .setAttribute("content", currentPost.meta || "");

  // Related posts
  const relatedContainer = document.getElementById("relatedPosts");

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
