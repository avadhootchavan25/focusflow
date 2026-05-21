import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const app = express()
app.use(cors())
app.use(express.json())

const GEMINI_MODEL = "gemini-1.5-flash-latest"

app.post("/api/titi", async (req, res) => {
  try {
    const { messages } = req.body || {}

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages missing" })
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return res.status(500).json({
        error: "Missing GEMINI_API_KEY in .env.local",
      })
    }

    const conversation = messages
      .map((m) => `${m.role === "user" ? "Student" : "Titi"}: ${m.text}`)
      .join("\n")

    const prompt = `
You are Titi AI, a friendly study buddy inside FocusFlow.

Rules:
- Answer the user's question directly.
- Remember previous messages.
- If user asks "explain more", continue the last topic.
- If user asks a topic name only, explain it.
- Be clear, useful, and student-friendly.
- Do not ask the user to choose 1/2/3 unless they ask for options.
- Help with summaries, notes, flashcards, doubts, and study plans.

Conversation:
${conversation}

Reply as Titi:
`

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
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
      "I couldn't generate a reply."

    res.json({ reply })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => {
  console.log("Titi AI server running on http://localhost:3001")
})