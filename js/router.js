import { db } from "./firebase.js";
import { doc, getDoc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id) {

  const docRef = doc(db, "posts", id);
  const snap = await getDoc(docRef);

  if (snap.exists()) {

    const post = snap.data();

    document.getElementById("title").innerText = post.title;
    document.getElementById("content").innerHTML = post.content;

    // Structured data for SEO
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "datePublished": post.date
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

  } else {
    document.getElementById("title").innerText = "Post not found";
  }

}
