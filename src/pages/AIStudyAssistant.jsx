import { useState } from "react"
import { motion } from "framer-motion"
import * as pdfjsLib from "pdfjs-dist"
import pdfWorker from "pdfjs-dist/build/pdf.worker?url"
import { FileText, Sparkles, Upload, BookOpen, Copy } from "lucide-react"
import toast from "react-hot-toast"

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export default function AIStudyAssistant() {
  const [topic, setTopic] = useState("")
  const [hours, setHours] = useState("")
  const [days, setDays] = useState("")
  const [notesText, setNotesText] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState("")

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

  const getUsefulSentences = () => {
    const clean = notesText.replace(/\s+/g, " ").trim()

    return clean
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => {
        const lower = s.toLowerCase()
        return (
          s.length > 35 &&
          s.length < 450 &&
          !badWords.some((word) => lower.includes(word))
        )
      })
  }

  const generatePlan = () => {
    if (!topic.trim()) {
      toast.error("Enter a topic first")
      return
    }

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

    setOutput(plan)
  }

  const summarizeText = () => {
    if (!notesText.trim()) {
      toast.error("Upload PDF or paste notes first")
      return
    }

    const sentences = getUsefulSentences()

    if (!sentences.length) {
      setOutput("No useful study content found in the uploaded notes/PDF.")
      return
    }

    const selected = sentences.slice(0, 12)

    setOutput(`PDF/Notes Summary

${selected.slice(0, 5).join(" ")}

Key Points From Uploaded Content:
${selected.map((s) => `- ${s}`).join("\n")}

Important Revision Lines:
${sentences.slice(12, 20).map((s) => `- ${s}`).join("\n") || "- Revise the key points above."}`)
  }

  const makeFlashcards = () => {
    if (!notesText.trim()) {
      toast.error("Upload PDF or paste notes first")
      return
    }

    const sentences = getUsefulSentences()

    if (!sentences.length) {
      setOutput("No useful study content found for flashcards.")
      return
    }

    const cards = sentences.slice(0, 12).map((s, i) => {
      const words = s.split(" ").filter(Boolean)
      const answer = s.length > 260 ? s.slice(0, 260) + "..." : s

      let question = `What is explained in this part of the uploaded notes?`

      if (words.length > 8) {
        question = `What does the uploaded PDF say about "${words.slice(0, 5).join(" ")}..."?`
      }

      return `Q${i + 1}: ${question}
A${i + 1}: ${answer}`
    })

    setOutput(`Flashcards From Uploaded PDF/Notes\n\n${cards.join("\n\n")}`)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    setFileName(file.name)
    setOutput("Reading uploaded file...")

    try {
      if (file.type === "text/plain") {
        const text = await file.text()
        setNotesText(text)
        setOutput(`Uploaded ${file.name}. Now click Summarize or Flashcards.`)
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

        if (!text.trim()) {
          setOutput("PDF uploaded, but no readable text was found. It may be scanned/image-based.")
        } else {
          setOutput(
            `Uploaded ${file.name}. Extracted text from ${pdf.numPages} page(s). Now click Summarize or Flashcards.`
          )
        }
      } else {
        setOutput("Only PDF and TXT files are supported right now.")
      }
    } catch (err) {
      setOutput(`Could not read file: ${err.message}`)
    }

    setLoading(false)
  }

  const copyOutput = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    toast.success("Copied")
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
            PDF-based revision.
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl">
            Upload a PDF or paste notes. Summaries and flashcards are created only from your uploaded content.
          </p>
        </div>
      </section>

      <section className="grid xl:grid-cols-[420px_1fr] gap-6">
        <aside className="space-y-5">
          <motion.div className="card">
            <Sparkles className="text-emerald-300" />
            <p className="text-gray-400 mt-4">Study Plan Generator</p>

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

          <motion.div className="card">
            <Upload className="text-blue-300" />
            <p className="text-gray-400 mt-4">Upload PDF / Notes</p>

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
              placeholder="Extracted PDF text / pasted notes will appear here..."
              className="w-full min-h-[220px] mt-4 resize-none rounded-[24px] bg-white/10 border border-white/10 p-4 text-white outline-none"
            />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={summarizeText}
                disabled={loading}
                className="btn bg-white/10 text-white"
              >
                <FileText size={18} /> Summarize
              </button>

              <button
                onClick={makeFlashcards}
                disabled={loading}
                className="btn bg-blue-500/20 text-blue-200"
              >
                <BookOpen size={18} /> Flashcards
              </button>
            </div>
          </motion.div>
        </aside>

        <section className="glass rounded-[32px] p-6 md:p-8 min-h-[720px]">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-emerald-300 font-semibold">Output</p>
              <h2 className="text-3xl font-black mt-1">
                Generated From Uploaded Content
              </h2>
            </div>

            <button
              onClick={copyOutput}
              className="btn bg-white/10 text-white"
            >
              <Copy size={18} /> Copy
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
                <p>Upload a PDF or paste notes to generate output.</p>
                <p>No random content will be generated here.</p>
              </div>
            )}
          </div>
        </section>
      </section>
    </div>
  )
}