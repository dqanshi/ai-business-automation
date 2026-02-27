import { db } from "./firebase.js";
import { doc, getDoc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadPost() {

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    console.error("No ID found in URL");
    return;
  }

  const docRef = doc(db, "posts", id);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    console.error("Post not found");
    return;
  }

  const post = snap.data();

  document.getElementById("postTitle").textContent = post.title;
  document.getElementById("postDate").textContent =
    new Date(post.date).toDateString();

  document.getElementById("postContent").innerHTML =
    post.content;

  document.title = post.title + " | AutomateScale";
}

loadPost();
