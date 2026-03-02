import { db } from "./firebase.js";
import { doc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadPost() {

  if (!id) {
    document.getElementById("postContent").innerHTML =
      "<p>No post ID provided.</p>";
    return;
  }

  try {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const post = docSnap.data();

      document.getElementById("postTitle").textContent =
        post.title || "Untitled";

      document.getElementById("postDate").textContent =
        post.date?.toDate
          ? post.date.toDate().toDateString()
          : new Date(post.date).toDateString();

      document.getElementById("postContent").innerHTML =
        post.content || "<p>No content available.</p>";

      document.title = post.title + " | AutomateScale";

    } else {
      document.getElementById("postContent").innerHTML =
        "<p>Post not found.</p>";
    }

  } catch (error) {
    console.error(error);
    document.getElementById("postContent").innerHTML =
      "<p>Error loading post.</p>";
  }
}

loadPost();
