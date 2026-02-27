import { db } from "./firebase.js";
import { collection, getDocs, query, where }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

if (!slug) {
  document.body.innerHTML = "<h2>Post not found</h2>";
  throw new Error("Missing slug");
}

const q = query(collection(db,"posts"),
  where("slug","==",slug));

const snapshot = await getDocs(q);

if (snapshot.empty) {
  document.body.innerHTML = "<h2>Post not found</h2>";
}

snapshot.forEach(async (doc) => {

  const post = doc.data();

  /* ================= TITLE ================= */
  document.title = post.title + " | AutomateScale";

  /* ================= META DESCRIPTION ================= */
  let metaTag = document.querySelector("meta[name='description']");
  if (!metaTag) {
    metaTag = document.createElement("meta");
    metaTag.name = "description";
    document.head.appendChild(metaTag);
  }
  metaTag.setAttribute("content", post.meta || "");

  /* ================= OPEN GRAPH ================= */
  setMetaTag("og:title", post.title);
  setMetaTag("og:description", post.meta);
  setMetaTag("og:image", post.image);
  setMetaTag("og:type", "article");

  /* ================= SCHEMA ================= */
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.meta,
    "image": post.image,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "AutomateScale"
    }
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);

  /* ================= CONTENT ================= */
  document.getElementById("title").innerText = post.title;
  document.getElementById("content").innerHTML = post.content;

  /* ================= FEATURED IMAGE ================= */
  if (post.image) {
    document.getElementById("featuredImage").src = post.image;
  }

  /* ================= RELATED POSTS ================= */
  loadRelated(post.slug);
});

/* ================= HELPER FUNCTION ================= */
function setMetaTag(property, content) {

  if (!content) return;

  let tag = document.querySelector(`meta[property='${property}']`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

/* ================= RELATED POSTS ================= */
async function loadRelated(currentSlug){

  const snap = await getDocs(collection(db,"posts"));

  let html = "<h3>Related Articles</h3>";

  snap.forEach(d=>{
    const p = d.data();

    if(p.slug !== currentSlug && p.status === "published"){
      html += `
        <p>
          <a href="post.html?slug=${p.slug}">
            ${p.title}
          </a>
        </p>
      `;
    }
  });

  document.getElementById("related").innerHTML = html;
}
