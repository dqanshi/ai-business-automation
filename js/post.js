import { db } from "./firebase.js";
import { doc, getDoc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadPost() {

  try {

    if (!id) {
      document.getElementById("postTitle").textContent = "No post ID.";
      return;
    }

    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      document.getElementById("postTitle").textContent = "Post not found";
      return;
    }

    const post = docSnap.data();

    document.getElementById("postTitle").textContent = post.title || "";

    if (post.date && post.date.toDate) {
      document.getElementById("postDate").textContent =
        post.date.toDate().toDateString();
    }

    document.getElementById("postContent").innerHTML =
      post.content || "";

    document.title = (post.title || "Post") + " | AutomateScale";

  } catch (error) {
    console.error("Post load error:", error);
    document.getElementById("postContent").innerHTML =
      "Error loading post.";
  }

}

loadPost();
