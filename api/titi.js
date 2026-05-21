export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { messages } = req.body || {}

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages missing" })
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return res.status(500).json({
        error: "Missing GEMINI_API_KEY. Add it in Vercel Environment Variables.",
      })
    }

    const conversation = messages
      .map((m) => `${m.role === "user" ? "Student" : "Titi"}: ${m.text}`)
      .join("\n")

    const prompt = `
You are Titi AI, a friendly study buddy inside FocusFlow.

Personality:
- Friendly, casual, supportive.
- Speak like a helpful study friend.
- Keep answers simple and useful.
- Remember context from the conversation.

Important behavior:
- If user says "hello", greet normally.
- If user says "explain more", continue the previous topic.
- If user says "1", "2", or "3", understand it based on your last options.
- If user asks for flashcards, create Q/A flashcards.
- If user asks for study plan, create a structured plan.
- If user asks about notes, summarize clearly.

Conversation so far:
${conversation}

Reply as Titi:
`

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    )

    const data = await geminiRes.json()

    if (!geminiRes.ok) {
      return res.status(500).json({
        error: data.error?.message || "Gemini request failed",
      })
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I could not generate a reply right now."

    return res.status(200).json({ reply })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}