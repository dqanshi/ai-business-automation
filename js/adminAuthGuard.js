import { getAuth, onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { app } from "./firebase.js";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {

  if (!user) {
    // Not logged in → go to login page
    window.location.href = "login.html";
  }

});
