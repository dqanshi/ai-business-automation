import { db } from "./js/firebase.js";
import { collection, addDoc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.getElementById("saveBtn").addEventListener("click", async () => {
  try {

    const title = document.getElementById("title").value;
    const meta = document.getElementById("meta").value;
    const content = document.getElementById("content").value;
    const status = document.getElementById("status").value;

    await addDoc(collection(db,"posts"),{
      title,
      meta,
      content,
      status,
      date: new Date().toISOString()
    });

    alert("Saved successfully");

  } catch (error) {
    alert(error.message);
  }
});
