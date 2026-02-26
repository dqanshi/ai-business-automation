import { db } from "./firebase.js";
import { collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("posts");

if (container) {

  try {

    const snapshot = await getDocs(collection(db, "posts"));

    snapshot.forEach(doc => {

      const post = doc.data();

      if (post.status === "published") {

        container.innerHTML += `
          <div class="card">
            <h2>
              <a href="post.html?id=${doc.id}">
                ${post.title}
              </a>
            </h2>
            <p>${post.meta}</p>
          </div>
        `;
      }

    });

  } catch (error) {
    container.innerHTML = "Error loading posts.";
    console.error(error);
  }

}
