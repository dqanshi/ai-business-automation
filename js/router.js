import { db } from "./firebase.js";
import { doc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ---------------- DARK MODE ---------------- */

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

const toggleBtn = document.getElementById("darkToggle");

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
}

/* ---------------- LOAD POST ---------------- */

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id) {
  const docRef = doc(db, "posts", id);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    const post = snap.data();

    document.title = post.title + " | AutomateScale";

    document.getElementById("postTitle").innerText = post.title;
    document.getElementById("postContent").innerHTML = post.content;

  } else {
    document.getElementById("postContent").innerHTML = 
      "<p>Post not found.</p>";
  }
}
