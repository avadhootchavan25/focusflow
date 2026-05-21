import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { auth, db } from "../firebase"
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"

export default function Notes() {
  const [notes, setNotes] = useState("")
  const [title, setTitle] = useState("")
  const [flashcards, setFlashcards] = useState([])
  const [sets, setSets] = useState([])
  const [activeSet, setActiveSet] = useState(null)
  const [saving, setSaving] = useState(false)

  const user = auth.currentUser

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, "users", user.uid, "flashcardSets"),
      orderBy("createdAt", "desc")
    )

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setSets(data)

      if (!activeSet && data.length > 0) {
        setActiveSet(data[0])
      }
    })

    return () => unsub()
  }, [user])

  const generateTitle = (text) => {
    const firstWords = text.trim().split(/\s+/).slice(0, 4).join(" ")
    return firstWords || "Untitled Notes"
  }

  const generateFlashcards = () => {
    if (!notes.trim()) return

    const sentences = notes
      .split(/[.!?]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 25)

    const cards = sentences.slice(0, 10).map((sentence, index) => {
      const words = sentence.split(" ")
      const keyword = words.slice(0, 5).join(" ")

      return {
        id: index + 1,
        question: `Explain: ${keyword}`,
        answer: sentence,
      }
    })

    setFlashcards(cards)

    if (!title.trim()) {
      setTitle(generateTitle(notes))
    }
  }

  const saveSet = async () => {
    if (!user || flashcards.length === 0) return

    setSaving(true)

    await addDoc(collection(db, "users", user.uid, "flashcardSets"), {
      title: title.trim() || generateTitle(notes),
      notes,
      cards: flashcards,
      cardCount: flashcards.length,
      createdAt: serverTimestamp(),
    })

    setSaving(false)
    setNotes("")
    setTitle("")
    setFlashcards([])
  }

  const deleteSet = async (id) => {
    if (!user) return

    await deleteDoc(doc(db, "users", user.uid, "flashcardSets", id))

    if (activeSet?.id === id) {
      setActiveSet(null)
    }
  }

  const clearDraft = () => {
    setNotes("")
    setTitle("")
    setFlashcards([])
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden glass rounded-[32px] p-8 md:p-12">
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative">
          <p className="text-emerald-300 font-bold uppercase text-sm">
            Smart Study Tools
          </p>
          <h1 className="text-4xl md:text-6xl font-black mt-3">
            Notes History
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl">
            Generate flashcards and save them as history sets like ChatGPT chats.
          </p>
        </div>
      </section>

      <section className="grid xl:grid-cols-[330px_1fr] gap-6">
        <aside className="glass rounded-[32px] p-4 h-fit xl:sticky xl:top-28">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">History</p>
              <h2 className="text-2xl font-black">Saved Sets</h2>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
              {sets.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {sets.map((set) => (
              <button
                key={set.id}
                onClick={() => setActiveSet(set)}
                className={`w-full text-left rounded-3xl p-4 border transition ${
                  activeSet?.id === set.id
                    ? "bg-blue-500/20 border-blue-400/40"
                    : "bg-white/7 border-white/10 hover:bg-white/10"
                }`}
              >
                <h3 className="font-black line-clamp-1">{set.title}</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {set.cardCount || set.cards?.length || 0} cards
                </p>
              </button>
            ))}

            {sets.length === 0 && (
              <div className="rounded-3xl bg-white/7 border border-white/10 p-5 text-center">
                <p className="font-bold">No history yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Save your first flashcard set.
                </p>
              </div>
            )}
          </div>
        </aside>

        <main className="space-y-6">
          <section className="glass rounded-[32px] p-6 md:p-8">
            <div className="grid lg:grid-cols-[1fr_280px] gap-5">
              <div>
                <p className="text-gray-400 mb-3">Set title</p>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Example: Photosynthesis Revision"
                />

                <p className="text-gray-400 mt-5 mb-3">Paste your notes</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paste your chapter notes here..."
                  className="w-full min-h-[360px] resize-none rounded-[28px] bg-white/10 border border-white/10 p-5 text-white outline-none focus:border-blue-400"
                />
              </div>

              <div className="space-y-5">
                <div className="card">
                  <p className="text-gray-400">Draft Cards</p>
                  <h2 className="text-6xl font-black mt-3">{flashcards.length}</h2>
                  <p className="text-emerald-300 mt-2">Ready to save</p>
                </div>

                <button
                  onClick={generateFlashcards}
                  className="btn w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                >
                  Generate
                </button>

                <button
                  onClick={saveSet}
                  disabled={saving || flashcards.length === 0}
                  className="btn w-full bg-emerald-500/20 text-emerald-200"
                >
                  {saving ? "Saving..." : "Save to History"}
                </button>

                <button
                  onClick={clearDraft}
                  className="btn w-full bg-white/10 text-white"
                >
                  Clear Draft
                </button>
              </div>
            </div>
          </section>

          {flashcards.length > 0 && (
            <section>
              <h2 className="text-3xl font-black mb-5">Draft Flashcards</h2>

              <div className="grid md:grid-cols-2 gap-5">
                {flashcards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="card"
                  >
                    <p className="text-blue-300 font-semibold">Question</p>
                    <h3 className="text-2xl font-black mt-2">
                      {card.question}
                    </h3>

                    <div className="mt-5 rounded-2xl bg-white/10 border border-white/10 p-4">
                      <p className="text-gray-400 text-sm">Answer</p>
                      <p className="mt-2 text-gray-100">{card.answer}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          <section className="glass rounded-[32px] p-6 md:p-8">
            {!activeSet ? (
              <div className="text-center py-16">
                <h2 className="text-3xl font-black">No set selected</h2>
                <p className="text-gray-400 mt-2">
                  Select a saved set from history.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <p className="text-emerald-300 font-semibold">
                      Saved Flashcard Set
                    </p>
                    <h2 className="text-3xl md:text-4xl font-black mt-1">
                      {activeSet.title}
                    </h2>
                    <p className="text-gray-400 mt-2">
                      {activeSet.cardCount || activeSet.cards?.length || 0} cards
                    </p>
                  </div>

                  <button
                    onClick={() => deleteSet(activeSet.id)}
                    className="btn bg-red-500/15 text-red-300"
                  >
                    Delete Set
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {(activeSet.cards || []).map((card, index) => (
                    <div key={index} className="card">
                      <p className="text-blue-300 font-semibold">Question</p>
                      <h3 className="text-2xl font-black mt-2">
                        {card.question}
                      </h3>

                      <div className="mt-5 rounded-2xl bg-white/10 border border-white/10 p-4">
                        <p className="text-gray-400 text-sm">Answer</p>
                        <p className="mt-2 text-gray-100">{card.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </main>
      </section>
    </div>
  )
}