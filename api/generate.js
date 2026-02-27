export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "No topic provided" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API key missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Write a detailed SEO optimized blog article about: ${topic}. Include headings and conclusion.`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini Response:", JSON.stringify(data));

    if (!data.candidates || !data.candidates[0]) {
      return res.status(500).json({ error: "AI did not return content", raw: data });
    }

    const content = data.candidates[0].content.parts[0].text;

    res.status(200).json({ content });

  } catch (err) {
    console.error("Server Error
