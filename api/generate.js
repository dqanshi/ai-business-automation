export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { topic } = req.body;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" 
      + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Write a detailed SEO optimized blog article about ${topic}. 
              Include headings, introduction, conclusion.`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!data.candidates) {
      return res.status(500).json({ error: data });
    }

    const content =
      data.candidates[0].content.parts[0].text;

    return res.status(200).json({ content });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
