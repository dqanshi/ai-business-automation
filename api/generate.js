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
Write a full SEO optimized blog article about: ${topic}

Include:
- H1 title
- Multiple H2 and H3 headings
- Bullet points
- 1000+ words
- Professional tone
`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini response:", JSON.stringify(data));

    const content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      return res.status(500).json({
        error: "AI did not return content",
        fullResponse: data
      });
    }

    res.status(200).json({ content });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}
