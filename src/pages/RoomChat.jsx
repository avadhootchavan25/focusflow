import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { auth, db } from "../firebase"
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore"
import { Send } from "lucide-react"
import toast from "react-hot-toast"

export default function RoomChat() {
  const { roomId } = useParams()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  const username =
    localStorage.getItem("focusflow_username") ||
    auth.currentUser?.displayName ||
    auth.currentUser?.email?.split("@")[0] ||
    "Student"

  const avatar = localStorage.getItem("focusflow_avatar") || "🧠"

  useEffect(() => {
    const q = query(
      collection(db, "rooms", roomId, "messages"),
      orderBy("createdAt", "asc")
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setMessages(data)
    })

    return () => unsub()
  }, [roomId])

  const sendMessage = async (e) => {
    e.preventDefault()

    if (!message.trim()) return

    try {
      await addDoc(collection(db, "rooms", roomId, "messages"), {
        text: message.trim(),
        username,
        avatar,
        userId: auth.currentUser?.uid || "guest",
        createdAt: serverTimestamp(),
      })

      setMessage("")
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <section className="glass rounded-[32px] p-6 md:p-8">
        <p className="text-purple-300 font-bold uppercase text-sm">
          Study Room
        </p>
        <h1 className="text-4xl font-black mt-2">
          {roomId.replaceAll("-", " ")}
        </h1>
        <p className="text-gray-400 mt-2">
          Live group chat for this study room.
        </p>
      </section>

      <section className="glass rounded-[32px] p-5 min-h-[560px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-center">
              No messages yet. Start the discussion.
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.userId === auth.currentUser?.uid

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
                      {msg.avatar || "🧠"}
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] rounded-[24px] p-4 ${
                      isMe
                        ? "bg-blue-500/30 border border-blue-300/20"
                        : "bg-white/10 border border-white/10"
                    }`}
                  >
                    <p className="text-xs text-gray-400 mb-1">
                      {msg.username || "Student"}
                    </p>
                    <p className="text-white">{msg.text}</p>
                  </div>

                  {isMe && (
                    <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
                      {msg.avatar || avatar}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        <form onSubmit={sendMessage} className="mt-5 flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />

          <button className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Send size={18} /> Send
          </button>
        </form>
      </section>
    </div>
  )
}