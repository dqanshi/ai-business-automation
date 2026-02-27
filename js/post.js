import { db } from "./firebase.js";
import { collection, getDocs, query, where }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

const q = query(collection(db,"posts"),
  where("slug","==",slug));

const snapshot = await getDocs(q);

snapshot.forEach(doc=>{
  const post = doc.data();

  document.title = post.title + " | AutomateScale";

  document.querySelector("meta[name='description']")
    .setAttribute("content", post.meta || "");

  // OpenGraph
  const ogTitle = document.createElement("meta");
  ogTitle.setAttribute("property","og:title");
  ogTitle.content = post.title;
  document.head.appendChild(ogTitle);

  const ogDesc = document.createElement("meta");
  ogDesc.setAttribute("property","og:description");
  ogDesc.content = post.meta;
  document.head.appendChild(ogDesc);

  const ogImg = document.createElement("meta");
  ogImg.setAttribute("property","og:image");
  ogImg.content = post.image;
  document.head.appendChild(ogImg);

  // Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.meta,
    "image": post.image,
    "datePublished": post.date
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);

  document.getElementById("title").innerText = post.title;
  document.getElementById("content").innerHTML = post.content;
});
