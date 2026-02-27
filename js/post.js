import { db } from "./firebase.js";
import { doc, getDoc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadPost() {

  if (!id) return;

  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {

    const post = docSnap.data();

    document.getElementById("postTitle").textContent = post.title;
    document.getElementById("postDate").textContent =
      new Date(post.date).toDateString();

    document.getElementById("postContent").innerHTML = post.content;

    document.title = post.title + " | AutomateScale";

  } else {
    document.getElementById("postTitle").textContent = "Post not found";
  }
}

loadPost();
