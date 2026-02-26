import { db } from "./firebase.js";
import { collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("posts");

async function loadPosts(){

  const snapshot = await getDocs(collection(db,"posts"));

  snapshot.forEach(doc=>{
    const post = doc.data();

    if(post.status === "published"){

      container.innerHTML += `
        <div class="card">
          <img src="${post.image || 'https://via.placeholder.com/800x400'}">
          <h3>
            <a href="post.html?slug=${post.slug}">
              ${post.title}
            </a>
          </h3>
          <p>${post.meta || ""}</p>
        </div>
      `;
    }
  });
}

loadPosts();
