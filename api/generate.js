export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "No topic provided" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a full SEO optimized blog article about: ${topic}.
                  
Include:
- SEO friendly headings
- Introduction
- Detailed explanation
- Conclusion
- Use HTML formatting (h2, h3, p, ul)`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini response:", data);

    if (!data.candidates) {
      return res.status(500).json({ error: "AI did not return content", details: data });
    }

    const content = data.candidates[0].content.parts[0].text;

    res.status(200).json({ content });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
                  }
