export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "No topic provided" });
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "Missing API key" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Write a 1000+ word SEO optimized blog article about: ${topic}`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      console.error("Gemini raw response:", data);
      return res.status(500).json({ error: "Invalid Gemini response" });
    }

    const content = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ content });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
