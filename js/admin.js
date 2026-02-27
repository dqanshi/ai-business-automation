import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs,
  deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const saveBtn = document.getElementById("saveBtn");
const postList = document.getElementById("postList");
const categorySelect = document.getElementById("category");
const bulkBtn = document.getElementById("bulkBtn");

loadCategories();
loadPosts();

/* ================= SINGLE POST SAVE ================= */
saveBtn.addEventListener("click", async () => {

  const title = document.getElementById("title").value;
  const meta = document.getElementById("meta").value;
  const content = document.getElementById("content").value;
  const image = document.getElementById("image").value;
  const status = document.getElementById("status").value;
  const category = categorySelect.value;

  const slug = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  await addDoc(collection(db,"posts"),{
    title, meta, content, image,
    status, category, slug,
    date: new Date().toISOString()
  });

  alert("Post published");
  location.reload();
});

/* ================= LOAD POSTS ================= */
async function loadPosts(){
  const snapshot = await getDocs(collection(db,"posts"));

  postList.innerHTML = "";

  snapshot.forEach(d => {
    const p = d.data();

    postList.innerHTML += `
      <div class="admin-card">
        <strong>${p.title}</strong>
        <button onclick="deletePost('${d.id}')">Delete</button>
      </div>
    `;
  });
}

/* ================= DELETE POST ================= */
window.deletePost = async function(id){
  await deleteDoc(doc(db,"posts",id));
  location.reload();
}

/* ================= LOAD CATEGORIES ================= */
async function loadCategories(){
  const snap = await getDocs(collection(db,"categories"));

  snap.forEach(d=>{
    categorySelect.innerHTML += `
      <option value="${d.data().name}">
        ${d.data().name}
      </option>
    `;
  });
}

/* ================= BULK AI GENERATOR ================= */
async function bulkGenerate(topics){

  for(const topic of topics){

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Write an SEO optimized 800-word blog article about: ${topic}. Use HTML headings and structure properly.`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    const content =
      data.candidates[0].content.parts[0].text;

    const slug = topic.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    await addDoc(collection(db,"posts"),{
      title: topic,
      meta: topic,
      content,
      status: "published",
      category: "AI",
      slug,
      date: new Date().toISOString()
    });
  }

  alert("Bulk publishing completed");
  location.reload();
}

/* ================= CONNECT BULK BUTTON ================= */
if (bulkBtn) {
  bulkBtn.addEventListener("click", () => {

    const topicsText =
      document.getElementById("bulkTopics").value;

    const topics =
      topicsText.split(",").map(t => t.trim());

    bulkGenerate(topics);
  });
}
