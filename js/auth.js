import { signInWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "./firebase.js";

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

  loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {

      await signInWithEmailAndPassword(auth, email, password);

      // Success → go to admin
      window.location.href = "admin.html";

    } catch (error) {

      alert("Invalid email or password");
      console.error(error);

    }

  });

}
