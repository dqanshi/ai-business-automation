import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyALKmGWn6Ggsf-5tv21s7ajpTa_aoC7i64",
  authDomain: "ai-business-automation-a9cb3.firebaseapp.com",
  projectId: "ai-business-automation-a9cb3",
  storageBucket: "ai-business-automation-a9cb3.firebasestorage.app",
  messagingSenderId: "770335617502",
  appId: "1:770335617502:web:871520da4f0bbd9fa1ed4f",
  measurementId: "G-L1BLXJYLSZ"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
