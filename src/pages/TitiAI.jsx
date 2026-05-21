import { useState } from "react"
import { motion } from "framer-motion"
import * as pdfjsLib from "pdfjs-dist"
import pdfWorker from "pdfjs-dist/build/pdf.worker?url"

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export default function TitiAI() {
  const [topic, setTopic] = useState("")
  const [hours, setHours] = useState("")
  const [days, setDays] = useState("")
  const [notesText, setNotesText] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState("")

  const generatePlan = () => {
    if (!topic.trim()) return

    const d = Number(days) || 3
    const h = Number(hours) || 2

    let plan = `Study Plan for ${topic}\n\n`
    plan += `Duration: ${d} day(s)\nDaily Study Time: ${h} hour(s)\n\n`

    for (let i = 1; i <= d; i++) {
      plan += `Day ${i}:\n`

      if (i === 1) {
        plan += `- Understand the basics of ${topic}\n- Make short notes\n- Learn definitions and key points\n`
      } else if (i === d) {
        plan += `- Revise everything\n- Practice questions\n- Test yourself using active recall\n- Review weak points\n`
      } else {
        plan += `- Revise previous concepts\n- Study the next subtopics\n- Make flashcards\n- Practice examples/questions\n`
      }

      plan += `\n`
    }

    plan += `Daily Routine:\n- Study in 25-30 minute focus blocks\n- Take 5 minute breaks\n- End with 10 minutes quick revision\n`

    setOutput(plan)
  }

  const extractKeywords = (text) => {
    const stopWords = new Set([
      "the", "is", "are", "and", "or", "to", "of", "in", "on", "for", "with",
      "as", "by", "an", "a", "this", "that", "from", "it", "be", "can", "has",
      "have", "was", "were", "which", "their", "they", "into", "also", "using",
      "based", "during", "under", "made", "about", "between", "through"
    ])

    const words = text
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 4 && !stopWords.has(w))

    const freq = {}

    words.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1
    })

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word)
  }

  const summarizeText = () => {
    if (!notesText.trim()) return

    const clean = notesText.replace(/\s+/g, " ").trim()

    const sentences = clean
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 25)

    const keywords = extractKeywords(clean)

    const summary = sentences.slice(0, 7).join(" ")

    setOutput(`Summary

${summary || clean.slice(0, 800)}

Key Points:
${sentences.slice(0, 8).map((s) => `- ${s}`).join("\n")}

Important Keywords:
${keywords.map((k) => `- ${k}`).join("\n")}

Quick Revision:
- Read the summary once.
- Cover the notes and recall the key points.
- Revise keywords and weak areas again.`)
  }

  const makeFlashcards = () => {
    if (!notesText.trim()) return

    const clean = notesText.replace(/\s+/g, " ").trim()

    const badWords = [
      "declaration",
      "certificate",
      "project guide",
      "date:",
      "undersigned",
      "solemnly declare",
      "acknowledgement",
      "table of contents",
      "index",
      "signature",
      "submitted by",
      "submitted to",
      "department",
      "college",
      "university",
    ]

    const sentences = clean
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => {
        const lower = s.toLowerCase()
        return (
          s.length > 50 &&
          s.length < 350 &&
          !badWords.some((word) => lower.includes(word))
        )
      })

    const makeQuestion = (text, index) => {
      const lower = text.toLowerCase()

      if (lower.includes("photosynthesis")) {
        return "What is photosynthesis?"
      }

      if (lower.includes("chlorophyll")) {
        return "What is the role of chlorophyll?"
      }

      if (lower.includes("carbon dioxide") || lower.includes("water")) {
        return "What raw materials are needed in this process?"
      }

      if (lower.includes("oxygen")) {
        return "Why is oxygen important in this topic?"
      }

      if (lower.includes("glucose")) {
        return "What is glucose used for?"
      }

      if (lower.includes("advantage") || lower.includes("benefit")) {
        return "What advantage is mentioned here?"
      }

      if (lower.includes("problem") || lower.includes("issue")) {
        return "What problem is being discussed?"
      }

      if (lower.includes("system")) {
        return "What does this system do?"
      }

      if (lower.includes("process")) {
        return "How does this process work?"
      }

      if (lower.includes("important") || lower.includes("significant")) {
        return "Why is this point important?"
      }

      if (lower.includes("application") || lower.includes("used")) {
        return "Where is this concept applied?"
      }

      if (lower.includes("component") || lower.includes("module")) {
        return "What component or module is explained here?"
      }

      if (lower.includes("result") || lower.includes("conclusion")) {
        return "What result or conclusion is given?"
      }

      const starters = [
        "What is the main concept explained here?",
        "Why is this point useful for revision?",
        "What should you remember from this point?",
        "How would you explain this in simple words?",
        "What key detail is mentioned in this section?",
        "What does this part tell us?",
      ]

      return starters[index % starters.length]
    }

    const usedQuestions = new Set()

    const cards = sentences.slice(0, 12).map((s, i) => {
      let question = makeQuestion(s, i)

      if (usedQuestions.has(question)) {
        question = `What is key point ${i + 1} from the notes?`
      }

      usedQuestions.add(question)

      const answer = s.length > 230 ? s.slice(0, 230) + "..." : s

      return `Q${i + 1}: ${question}
A${i + 1}: ${answer}`
    })

    if (!cards.length) {
      setOutput(
        "Could not find enough useful study content. Try uploading theory/content pages instead of certificate/declaration pages."
      )
      return
    }

    setOutput(`Flashcards\n\n${cards.join("\n\n")}`)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    setFileName(file.name)

    try {
      if (file.type === "text/plain") {
        const text = await file.text()
        setNotesText(text)
        setOutput(`Uploaded ${file.name}. Click Summarize or Flashcards.`)
      } else if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

        let text = ""

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const pageText = content.items.map((item) => item.str).join(" ")
          text += pageText + "\n\n"
        }

        setNotesText(text)
        setOutput(
          `Uploaded ${file.name}. Extracted text from ${pdf.numPages} page(s). Click Summarize or Flashcards.`
        )
      } else {
        setOutput("Only PDF and TXT files are supported right now.")
      }
    } catch (err) {
      setOutput(`Could not read file: ${err.message}`)
    }

    setLoading(false)
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden glass rounded-[32px] p-8 md:p-12">
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative">
          <p className="text-emerald-300 font-bold uppercase text-sm">
            Study Assistant
          </p>
          <h1 className="text-4xl md:text-6xl font-black mt-3">
            Plan, summarize, revise.
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl">
            Generate study plans, upload PDFs, summarize notes, and create flashcards instantly.
          </p>
        </div>
      </section>

      <section className="grid xl:grid-cols-[420px_1fr] gap-6">
        <aside className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <p className="text-gray-400">Study Plan Generator</p>

            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic e.g. Photosynthesis"
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
              className="btn w-full mt-4 bg-emerald-500/20 text-emerald-200"
            >
              Generate Plan
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card"
          >
            <p className="text-gray-400">Upload Notes</p>

            <label className="mt-4 flex cursor-pointer items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/10 p-6 text-center hover:bg-white/15">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="text-gray-300">
                {fileName ? fileName : "Upload PDF or TXT"}
              </span>
            </label>

            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Or paste your notes here..."
              className="w-full min-h-[220px] mt-4 resize-none rounded-[24px] bg-white/10 border border-white/10 p-4 text-white outline-none"
            />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={summarizeText}
                disabled={loading}
                className="btn bg-white/10 text-white"
              >
                Summarize
              </button>

              <button
                onClick={makeFlashcards}
                disabled={loading}
                className="btn bg-blue-500/20 text-blue-200"
              >
                Flashcards
              </button>
            </div>
          </motion.div>
        </aside>

        <section className="glass rounded-[32px] p-6 md:p-8 min-h-[720px]">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-emerald-300 font-semibold">Output</p>
              <h2 className="text-3xl font-black mt-1">
                Generated Study Material
              </h2>
            </div>

            <button
              onClick={() => setOutput("")}
              className="btn bg-red-500/15 text-red-300"
            >
              Clear
            </button>
          </div>

          <div className="mt-6 min-h-[600px] rounded-[28px] bg-white/10 border border-white/10 p-5 overflow-y-auto">
            {loading ? (
              <p className="text-gray-300">Reading file...</p>
            ) : output ? (
              <p className="whitespace-pre-wrap text-gray-100 leading-relaxed">
                {output}
              </p>
            ) : (
              <div className="text-gray-400 space-y-3">
                <p>Upload notes or generate a plan to see output here.</p>
                <p>Supported: PDF, TXT, pasted notes.</p>
              </div>
            )}
          </div>
        </section>
      </section>
    </div>
  )
}