import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= ELEMENTS ================= */

const saveBtn = document.getElementById("saveBtn");
const cancelEditBtn = document.getElementById("cancelEdit");
const postList = document.getElementById("postList");
const categorySelect = document.getElementById("category");
const bulkBtn = document.getElementById("bulkBtn");
const filterStatus = document.getElementById("filterStatus");

let editingId = null;

/* ================= INIT ================= */

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

  if (!title || !content) {
    alert("Title and content required");
    return;
  }

  try {

    if (editingId) {

      await updateDoc(doc(db, "posts", editingId), {
        title,
        meta,
        content,
        image,
        status,
        category
      });

      editingId = null;
      cancelEditBtn.style.display = "none";

    } else {

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      await addDoc(collection(db, "posts"), {
        title,
        meta,
        content,
        image,
        status,
        category,
        slug,
        date: new Date().toISOString()
      });

    }

    clearForm();
    loadPosts();

  } catch (err) {
    alert("Error saving post");
  }

});

/* ================= LOAD POSTS ================= */

async function loadPosts() {

  const q = query(
    collection(db, "posts"),
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(q);

  let total = 0,
      published = 0,
      draft = 0;

  postList.innerHTML = "";

  snapshot.forEach(d => {

    const p = d.data();
    total++;

    if (p.status === "published") published++;
    if (p.status === "draft") draft++;

    if (filterStatus.value !== "all" &&
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

window.editPost = async function (id) {

  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return;

  const p = docSnap.data();

  document.getElementById("title").value = p.title || "";
  document.getElementById("meta").value = p.meta || "";
  document.getElementById("content").value = p.content || "";
  document.getElementById("image").value = p.image || "";
  document.getElementById("status").value = p.status || "draft";
  categorySelect.value = p.category || "";

  editingId = id;
  cancelEditBtn.style.display = "inline-block";
};

/* ================= DELETE ================= */

window.deletePost = async function (id) {

  if (!confirm("Delete this post?")) return;

  await deleteDoc(doc(db, "posts", id));
  loadPosts();
};

/* ================= CANCEL EDIT ================= */

cancelEditBtn.addEventListener("click", () => {
  editingId = null;
  clearForm();
  cancelEditBtn.style.display = "none";
});

/* ================= CLEAR FORM ================= */

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("meta").value = "";
  document.getElementById("content").value = "";
  document.getElementById("image").value = "";
}

/* ================= LOAD CATEGORIES ================= */

async function loadCategories() {

  const snap = await getDocs(collection(db, "categories"));
  categorySelect.innerHTML = "";

  snap.forEach(d => {
    categorySelect.innerHTML += `
      <option value="${d.data().name}">
        ${d.data().name}
      </option>
    `;
  });
}

/* ================= BULK GENERATOR ================= */

bulkBtn.addEventListener("click", async () => {

  const raw = document.getElementById("bulkTopics").value.trim();

  if (!raw) {
    alert("Enter topics first");
    return;
  }

  const topics = raw.split(",").map(t => t.trim());

  bulkBtn.disabled = true;
  bulkBtn.innerText = "Generating...";

  try {

    for (const topic of topics) {

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });

      if (!res.ok) continue;

      const data = await res.json();
      if (!data.content) continue;

      const slug = topic
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      await addDoc(collection(db, "posts"), {
        title: topic,
        meta: topic,
        content: data.content,
        status: "published",
        category: "AI",
        slug,
        date: new Date().toISOString()
      });
    }

    alert("Bulk publishing done");

  } catch (err) {
    alert("Bulk failed");
  }

  bulkBtn.disabled = false;
  bulkBtn.innerText = "Generate & Publish";

  loadPosts();
});
