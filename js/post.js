import { db } from "./firebase.js";
import { collection, getDocs, query, where }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

async function loadPost(){

  const q = query(collection(db,"posts"),
    where("slug","==",slug));

  const snapshot = await getDocs(q);

  snapshot.forEach(doc=>{
    const post = doc.data();

    document.title = post.title + " | AutomateScale";

    document.getElementById("title").innerText = post.title;
    document.getElementById("meta").innerText = post.meta;
    document.getElementById("featuredImage").src =
      post.image || "https://via.placeholder.com/1200x600";
    document.getElementById("content").innerHTML = post.content;

    loadRelated(post.category);
  });

  (adsbygoogle = window.adsbygoogle || []).push({});
}

async function loadRelated(category){

  const snapshot = await getDocs(collection(db,"posts"));
  let html = "";

  snapshot.forEach(doc=>{
    const post = doc.data();
    if(post.category === category && post.slug !== slug){
      html += `<div><a href="post.html?slug=${post.slug}">${post.title}</a></div>`;
    }
  });

  document.getElementById("related").innerHTML = html;
}

loadPost();
