import { db } from "./firebase.js";
import {
  collection, getDocs, query, where,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

const q = query(collection(db,"posts"),
  where("slug","==",slug));

const snapshot = await getDocs(q);

snapshot.forEach(doc=>{
  const p = doc.data();

  document.title = p.title + " | AutomateScale";
  document.getElementById("title").innerText = p.title;
  document.getElementById("articleImage").innerHTML =
    `<img src="${p.image}">`;
  document.getElementById("content").innerHTML = p.content;
});

/* COMMENTS */
const commentBtn = document.getElementById("commentBtn");

commentBtn.addEventListener("click", async ()=>{

  const name = document.getElementById("name").value;
  const text = document.getElementById("commentText").value;

  await addDoc(collection(db,"comments"),{
    slug,
    name,
    text,
    date:new Date().toISOString()
  });

  alert("Comment posted");
  location.reload();
});
