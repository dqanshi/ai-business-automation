import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

if (!slug) {
  document.getElementById("content").innerHTML =
    "<h2>Post not found</h2>";
}

/* ================= LOAD POST ================= */

const q = query(
  collection(db,"posts"),
  where("slug","==",slug)
);

const snapshot = await getDocs(q);

snapshot.forEach(async (docSnap)=>{

  const post = docSnap.data();

  /* ===== BASIC CONTENT ===== */

  document.title = post.title + " | AutomateScale";

  document.querySelector("meta[name='description']")
    .setAttribute("content", post.meta || "");

  document.getElementById("title").innerText = post.title;
  document.getElementById("meta").innerText = post.meta || "";
  document.getElementById("content").innerHTML = post.content || "";

  /* ===== FEATURED IMAGE ===== */

  if(post.image){
    const img = document.getElementById("featuredImage");
    img.src = post.image;
    img.style.display = "block";
  }

  /* ===== OPEN GRAPH SEO ===== */

  addMeta("property","og:title", post.title);
  addMeta("property","og:description", post.meta || "");
  addMeta("property","og:image", post.image || "");

  /* ===== STRUCTURED DATA ===== */

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

  /* ===== LOAD RELATED ===== */

  loadRelated(post.slug);
});


/* ================= RELATED POSTS ================= */

async function loadRelated(currentSlug){

  const snap = await getDocs(collection(db,"posts"));

  let html = "<h3>Related Articles</h3>";

  snap.forEach(d=>{
    const p = d.data();

    if(p.slug !== currentSlug && p.status === "published"){
      html += `
        <div class="related-item">
          <a href="post.html?slug=${p.slug}">
            ${p.title}
          </a>
        </div>
      `;
    }
  });

  document.getElementById("related").innerHTML = html;
}


/* ================= META HELPER ================= */

function addMeta(type, name, content){

  if(!content) return;

  const tag = document.createElement("meta");
  tag.setAttribute(type, name);
  tag.content = content;

  document.head.appendChild(tag);
}
