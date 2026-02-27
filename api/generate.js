export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { topic } = req.body;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Write a high-quality 800-word SEO blog article about: ${topic}. Use HTML headings and formatting.`
          }]
        }]
      })
    }
  );

  const data = await response.json();

  const content =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  res.status(200).json({ content });
}
