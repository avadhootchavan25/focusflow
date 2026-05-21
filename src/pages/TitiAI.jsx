import { useState } from "react"
import { motion } from "framer-motion"

export default function TitiAI() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Yo, I’m Titi 👋 I’m your AI study friend. Ask me doubts, tell me your topic, or paste notes and I’ll help you revise.",
    },
  ])

  const [input, setInput] = useState("")
  const [topic, setTopic] = useState("")
  const [hours, setHours] = useState("")
  const [days, setDays] = useState("")
  const [notesText, setNotesText] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [outputLoading, setOutputLoading] = useState(false)

  const askTiti = async (newMessages) => {
    const res = await fetch("/api/titi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: newMessages }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Titi AI failed")
    }

    return data.reply
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg = { role: "user", text: input.trim() }
    const newMessages = [...messages, userMsg]

    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const reply = await askTiti(newMessages)
      setMessages((prev) => [...prev, { role: "ai", text: reply }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Titi AI error: ${err.message}`,
        },
      ])
    }

    setLoading(false)
  }

  const generatePlan = async () => {
    if (!topic.trim() || outputLoading) return

    setOutputLoading(true)

    const prompt = `Make a practical study plan for this topic: ${topic}.
Days available: ${days || 3}.
Hours per day: ${hours || 2}.
Make it student-friendly with daily tasks, revision, and practice.`

    try {
      const reply = await askTiti([{ role: "user", text: prompt }])
      setSummary(reply)
    } catch (err) {
      setSummary(`Titi AI error: ${err.message}`)
    }

    setOutputLoading(false)
  }

  const summarizeNotes = async () => {
    if (!notesText.trim() || outputLoading) return

    setOutputLoading(true)

    const prompt = `Summarize these notes into clean study notes.
Use headings, key points, and quick revision points:

${notesText}`

    try {
      const reply = await askTiti([{ role: "user", text: prompt }])
      setSummary(reply)
    } catch (err) {
      setSummary(`Titi AI error: ${err.message}`)
    }

    setOutputLoading(false)
  }

  const makeFlashcards = async () => {
    if (!notesText.trim() || outputLoading) return

    setOutputLoading(true)

    const prompt = `Turn these notes into flashcards.
Format exactly like:
Q: question
A: answer

Notes:
${notesText}`

    try {
      const reply = await askTiti([{ role: "user", text: prompt }])
      setSummary(reply)
    } catch (err) {
      setSummary(`Titi AI error: ${err.message}`)
    }

    setOutputLoading(false)
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

PDF reading is not connected yet. For now, copy-paste the PDF text into the notes box and Titi will summarize it.`)
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden glass rounded-[32px] p-8 md:p-12">
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-pink-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative">
          <p className="text-pink-300 font-bold uppercase text-sm">Titi AI</p>
          <h1 className="text-4xl md:text-6xl font-black mt-3">
            Your real AI study friend
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl">
            Chat naturally, ask follow-ups, generate study plans, summarize notes, and make flashcards.
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
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-[28px] p-4 border ${
                    msg.role === "user"
                      ? "bg-blue-500/25 border-blue-400/30"
                      : "bg-white/10 border-white/10"
                  }`}
                >
                  <p className="text-sm text-gray-400 mb-1">
                    {msg.role === "user" ? "You" : "Titi"}
                  </p>
                  <p className="whitespace-pre-wrap text-gray-100">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-[28px] p-4 border bg-white/10 border-white/10">
                  <p className="text-gray-300">Titi is thinking...</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask Titi anything..."
              className="flex-1"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card">
            <p className="text-gray-400">Study Plan Generator</p>

            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic"
              className="w-full mt-4"
            />

            <div className="grid grid-cols-2 gap-3 mt-3">
              <input
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Hours/day"
                type="number"
              />
              <input
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="Days"
                type="number"
              />
            </div>

            <button
              onClick={generatePlan}
              disabled={outputLoading}
              className="btn w-full mt-4 bg-pink-500/20 text-pink-200"
            >
              {outputLoading ? "Generating..." : "Generate Plan"}
            </button>
          </div>

          <div className="card">
            <p className="text-gray-400">Notes / TXT Upload</p>

            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Paste notes here..."
              className="w-full min-h-[180px] mt-4 resize-none rounded-[24px] bg-white/10 border border-white/10 p-4 text-white outline-none"
            />

            <label className="mt-4 flex cursor-pointer items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/10 p-5 text-center hover:bg-white/15">
              <input
                type="file"
                accept=".txt,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="text-gray-300">Upload TXT/PDF</span>
            </label>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={summarizeNotes}
                disabled={outputLoading}
                className="btn bg-white/10 text-white"
              >
                Summarize
              </button>

              <button
                onClick={makeFlashcards}
                disabled={outputLoading}
                className="btn bg-emerald-500/20 text-emerald-200"
              >
                Flashcards
              </button>
            </div>
          </div>
        </aside>
      </section>

      <section className="glass rounded-[32px] p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-pink-300 font-semibold">Output</p>
            <h2 className="text-3xl font-black mt-1">Generated Study Help</h2>
          </div>

          <button
            onClick={() => setSummary("")}
            className="btn bg-red-500/15 text-red-300"
          >
            Clear
          </button>
        </div>

        <div className="mt-6 min-h-[260px] rounded-[28px] bg-white/10 border border-white/10 p-5">
          {outputLoading ? (
            <p className="text-gray-300">Titi is generating...</p>
          ) : summary ? (
            <p className="whitespace-pre-wrap text-gray-100">{summary}</p>
          ) : (
            <p className="text-gray-400">Output appears here.</p>
          )}
        </div>
      </section>
    </div>
  )
}