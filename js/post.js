import { db } from "./firebase.js";
import { collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadPost() {

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    console.error("No slug found in URL");
    return;
  }

  const snapshot = await getDocs(collection(db,"posts"));

  let currentPost = null;

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.slug === slug) {
      currentPost = data;
    }
  });

  if (!currentPost) {
    console.error("Post not found");
    return;
  }

  // Update DOM
  document.getElementById("postTitle").textContent = currentPost.title;
  document.getElementById("postDate").textContent =
    new Date(currentPost.date).toDateString();

  document.getElementById("postContent").innerHTML =
    currentPost.content;

  document.title = currentPost.title + " | AutomateScale";
}

loadPost();
