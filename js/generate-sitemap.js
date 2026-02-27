import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs }
from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function generateSitemap() {

  const snapshot = await getDocs(collection(db,"posts"));

  let urls = `
<url>
  <loc>https://automatescale.com/</loc>
</url>`;

  snapshot.forEach(doc=>{
    const post = doc.data();
    if(post.status === "published"){
      urls += `
<url>
  <loc>https://automatescale.com/post.html?slug=${post.slug}</loc>
</url>`;
    }
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync("sitemap.xml", sitemap);
  console.log("Sitemap generated!");
}

generateSitemap();
