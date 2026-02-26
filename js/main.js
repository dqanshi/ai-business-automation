import { db } from "./firebase.js";
import { collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("posts");

const snapshot = await getDocs(collection(db,"posts"));

snapshot.forEach(doc=>{
  const post = doc.data();

  if(post.status==="published"){
    container.innerHTML += `
      <div class="card">
        <img src="${post.image}">
        <h2>
          <a href="post.html?slug=${post.slug}">
            ${post.title}
          </a>
        </h2>
        <p>${post.meta}</p>
        <span class="category">${post.category}</span>
      </div>
    `;
  }
});

window.toggleDark = function(){
  document.body.classList.toggle("dark");
}
