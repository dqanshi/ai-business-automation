export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { topic } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `
Create SEO blog content about: ${topic}

Return ONLY valid JSON in this format:

{
  "title": "",
  "meta": "",
  "content": "",
  "image_prompt": ""
}

Rules:
- Title under 60 characters
- Meta description under 160 characters
- Content minimum 1000 words
- Content must use HTML tags (h2, h3, p, ul)
- Image prompt should describe a professional blog featured image
`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) {
      return res.status(500).json({ error: "AI failed" });
    }

    // Clean markdown code blocks if Gemini adds them
    const cleaned = raw.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleaned);

    res.status(200).json(parsed);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
