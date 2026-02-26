import { db } from "./firebase.js";
import { collection, addDoc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.publish = async function(){

await addDoc(collection(db,"posts"),{
title:title.value,
meta:meta.value,
content:content.value,
status:status.value,
date:new Date().toISOString()
});

alert("Saved");
}
