import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs,
  deleteDoc, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const saveBtn = document.getElementById("saveBtn");
const cancelEditBtn = document.getElementById("cancelEdit");
const postList = document.getElementById("postList");
const categorySelect = document.getElementById("category");
const bulkBtn = document.getElementById("bulkBtn");
const filterStatus = document.getElementById("filterStatus");

let editingId = null;

loadCategories();
loadPosts();

/* ================= SAVE OR UPDATE ================= */
saveBtn.addEventListener("click", async () => {

  const title = document.getElementById("title").value.trim();
  const meta = document.getElementById("meta").value.trim();
  const content = document.getElementById("content").value.trim();
  const image = document.getElementById("image").value.trim();
  const status = document.getElementById("status").value;
  const category = categorySelect.value;

  if(!title || !content){
    alert("Title and content required");
    return;
  }

  const slug = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") +
    "-" + Date.now(); // duplicate protection

  if(editingId){
    await updateDoc(doc(db,"posts",editingId),{
      title, meta, content, image,
      status, category
    });
    editingId = null;
    cancelEditBtn.style.display = "none";
  } else {
    await addDoc(collection(db,"posts"),{
      title, meta, content, image,
      status, category, slug,
      date: new Date().toISOString()
    });
  }

  clearForm();
  loadPosts();
});

/* ================= LOAD POSTS ================= */
async function loadPosts(){
  const snapshot = await getDocs(collection(db,"posts"));

  let total=0, published=0, draft=0;

  postList.innerHTML = "";

  snapshot.forEach(d => {
    const p = d.data();
    total++;

    if(p.status==="published") published++;
    if(p.status==="draft") draft++;

    if(filterStatus.value !== "all" &&
       p.status !== filterStatus.value) return;

    postList.innerHTML += `
      <div class="admin-card">
        <strong>${p.title}</strong>
        <small>${p.status}</small>
        <div>
          <button onclick="editPost('${d.id}')">Edit</button>
          <button onclick="deletePost('${d.id}')">Delete</button>
        </div>
      </div>
    `;
  });

  document.getElementById("totalCount").innerText = total;
  document.getElementById("publishedCount").innerText = published;
  document.getElementById("draftCount").innerText = draft;
}

filterStatus.addEventListener("change", loadPosts);

/* ================= EDIT ================= */
window.editPost = async function(id){
  const snapshot = await getDocs(collection(db,"posts"));
  snapshot.forEach(d=>{
    if(d.id===id){
      const p=d.data();
      document.getElementById("title").value=p.title;
      document.getElementById("meta").value=p.meta;
      document.getElementById("content").value=p.content;
      document.getElementById("image").value=p.image;
      document.getElementById("status").value=p.status;
      categorySelect.value=p.category;
      editingId=id;
      cancelEditBtn.style.display="inline-block";
    }
  });
};

cancelEditBtn.addEventListener("click",()=>{
  editingId=null;
  clearForm();
  cancelEditBtn.style.display="none";
});

/* ================= DELETE ================= */
window.deletePost = async function(id){
  if(confirm("Delete this post?")){
    await deleteDoc(doc(db,"posts",id));
    loadPosts();
  }
};

/* ================= CLEAR ================= */
function clearForm(){
  document.getElementById("title").value="";
  document.getElementById("meta").value="";
  document.getElementById("content").value="";
  document.getElementById("image").value="";
}

/* ================= LOAD CATEGORIES ================= */
async function loadCategories(){
  const snap = await getDocs(collection(db,"categories"));
  snap.forEach(d=>{
    categorySelect.innerHTML +=
      `<option value="${d.data().name}">
         ${d.data().name}
       </option>`;
  });
}

/* ================= BULK ================= */
bulkBtn.addEventListener("click", async ()=>{

  const topics =
    document.getElementById("bulkTopics").value
    .split(",").map(t=>t.trim());

  for(const topic of topics){

    const res = await fetch("/api/generate",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({topic})
    });

    const data = await res.json();

    if(!data.content) continue;

    await addDoc(collection(db,"posts"),{
      title:topic,
      meta:topic,
      content:data.content,
      status:"published",
      category:"AI",
      slug:topic.toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+Date.now(),
      date:new Date().toISOString()
    });
  }

  alert("Bulk publishing done");
  loadPosts();
});
