export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic required" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Write a complete SEO blog article about "${topic}"

Return in JSON format:

{
  "title": "",
  "meta": "",
  "content": "",
  "image": "",
  "related": ["", "", ""]
}

Content must be 1200+ words and HTML formatted.
`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: "AI returned empty" });
    }

    const parsed = JSON.parse(text);

    return res.status(200).json(parsed);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
}
