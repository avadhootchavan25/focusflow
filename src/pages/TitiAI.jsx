import { useState } from "react"
import { motion } from "framer-motion"

export default function TitiAI() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Yo, I’m Titi 👋 I can help you plan your study day, explain topics, turn notes into summaries, and make revision points.",
    },
  ])

  const [input, setInput] = useState("")
  const [topic, setTopic] = useState("")
  const [hours, setHours] = useState("")
  const [days, setDays] = useState("")
  const [notesText, setNotesText] = useState("")
  const [summary, setSummary] = useState("")

  const smartReply = (text) => {
    const msg = text.toLowerCase().trim()

    if (["hi", "hello", "hey", "yo", "sup"].includes(msg)) {
      return "Heyy 👋 I’m here. What are we studying today?"
    }

    if (msg.includes("photosynthesis")) {
      return "Photosynthesis is how plants make food using sunlight, carbon dioxide, and water. The main product is glucose, and oxygen is released as a by-product. Want me to make flashcards from it?"
    }

    if (msg.includes("study plan") || msg.includes("plan")) {
      return "Sure. Tell me the subject/topic, how many days you have, and how many hours per day. I’ll make a clean plan."
    }

    if (msg.includes("summarize") || msg.includes("summary")) {
      return "Paste your notes in the notes box on the right and click Summarize Notes. I’ll make it cleaner."
    }

    return `I got you. For "${text}", I can help in 3 ways:\n\n1. Explain it simply\n2. Make a study plan\n3. Turn notes into summary or flashcards\n\nTell me what you want me to do.`
  }

  const sendMessage = () => {
    if (!input.trim()) return

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "ai", text: smartReply(input) },
    ])

    setInput("")
  }

  const generatePlan = () => {
    if (!topic.trim()) return

    const h = Number(hours) || 2
    const d = Number(days) || 3

    setSummary(`Study Plan for ${topic}

Duration: ${d} days
Daily Study Time: ${h} hours

Day 1:
- Understand the basics
- Make short notes
- Learn definitions and key points

Day 2:
- Revise difficult parts
- Practice questions
- Create flashcards

Day 3:
- Active recall
- Solve questions
- Revise mistakes

Daily Routine:
- ${h} hour study block
- Use focus timer
- End with 10 minutes revision`)
  }

  const summarizeNotes = () => {
    if (!notesText.trim()) return

    const sentences = notesText
      .split(/[.!?]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20)

    const points = sentences.slice(0, 8).map((s) => `- ${s}`).join("\n")

    setSummary(`Clean Summary

Main Idea:
${sentences[0] || "This topic explains important study concepts."}

Key Points:
${points}

Quick Revision:
Read the key points once, then close the notes and try to recall them without looking.`)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = () => setNotesText(reader.result)
      reader.readAsText(file)
      return
    }

    setSummary(`PDF uploaded: ${file.name}

PDF text extraction needs backend AI/PDF parser. For now, copy-paste the PDF text into the notes box and click Summarize Notes.`)
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden glass rounded-[32px] p-8 md:p-12">
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-pink-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative">
          <p className="text-pink-300 font-bold uppercase text-sm">Titi AI</p>
          <h1 className="text-4xl md:text-6xl font-black mt-3">
            Your study friend
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl">
            Chat, plan your study day, summarize notes, and revise faster.
          </p>
        </div>
      </section>

      <section className="grid xl:grid-cols-[1fr_420px] gap-6">
        <div className="glass rounded-[32px] p-5 md:p-6 min-h-[650px] flex flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] rounded-[28px] p-4 border ${
                  msg.role === "user"
                    ? "bg-blue-500/25 border-blue-400/30"
                    : "bg-white/10 border-white/10"
                }`}>
                  <p className="text-sm text-gray-400 mb-1">
                    {msg.role === "user" ? "You" : "Titi"}
                  </p>
                  <p className="whitespace-pre-wrap text-gray-100">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask Titi anything..."
              className="flex-1"
            />
            <button onClick={sendMessage} className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              Send
            </button>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card">
            <p className="text-gray-400">Study Plan Generator</p>

            <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" className="w-full mt-4" />

            <div className="grid grid-cols-2 gap-3 mt-3">
              <input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Hours/day" type="number" />
              <input value={days} onChange={(e) => setDays(e.target.value)} placeholder="Days" type="number" />
            </div>

            <button onClick={generatePlan} className="btn w-full mt-4 bg-pink-500/20 text-pink-200">
              Generate Plan
            </button>
          </div>

          <div className="card">
            <p className="text-gray-400">Notes Summarizer</p>

            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Paste notes here..."
              className="w-full min-h-[180px] mt-4 resize-none rounded-[24px] bg-white/10 border border-white/10 p-4 text-white outline-none"
            />

            <label className="mt-4 flex cursor-pointer items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/10 p-5 text-center hover:bg-white/15">
              <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} className="hidden" />
              <span className="text-gray-300">Upload TXT/PDF</span>
            </label>

            <button onClick={summarizeNotes} className="btn w-full mt-4 bg-white/10 text-white">
              Summarize Notes
            </button>
          </div>
        </aside>
      </section>

      <section className="glass rounded-[32px] p-6 md:p-8">
        <p className="text-pink-300 font-semibold">Output</p>
        <h2 className="text-3xl font-black mt-1">Generated Study Help</h2>

        <div className="mt-6 min-h-[260px] rounded-[28px] bg-white/10 border border-white/10 p-5">
          {summary ? (
            <p className="whitespace-pre-wrap text-gray-100">{summary}</p>
          ) : (
            <p className="text-gray-400">Output appears here.</p>
          )}
        </div>
      </section>
    </div>
  )
}