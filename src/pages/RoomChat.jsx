import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { db, auth } from "../firebase"
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore"
import { addXP } from "../utils/xp"

export default function RoomChat() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [users, setUsers] = useState({})
  const [room, setRoom] = useState(null)

  const uid = auth.currentUser?.uid

  useEffect(() => {
    const loadUsers = async () => {
      const snap = await getDocs(collection(db, "users"))
      const map = {}
      snap.forEach((d) => (map[d.id] = d.data()))
      setUsers(map)
    }
    loadUsers()
  }, [])

  useEffect(() => {
    if (!roomId) return

    const loadRoom = async () => {
      const snap = await getDoc(doc(db, "rooms", roomId))
      if (snap.exists()) setRoom({ id: snap.id, ...snap.data() })
    }

    loadRoom()
  }, [roomId])

  useEffect(() => {
    if (!roomId) return

    const q = query(
      collection(db, "rooms", roomId, "messages"),
      orderBy("createdAt")
    )

    return onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
  }, [roomId])

  const sendMessage = async () => {
    if (!uid || !text.trim()) return

    await addDoc(collection(db, "rooms", roomId, "messages"), {
      text,
      uid,
      createdAt: serverTimestamp(),
    })

    addXP(5)
    setText("")
  }

  return (
    <div className="space-y-6">
      <section className="glass rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-blue-300 font-bold uppercase text-sm">Live Study Room</p>
          <h1 className="text-3xl md:text-5xl font-black mt-2">
            {room?.name || "Room Chat"}
          </h1>
          <p className="text-gray-400 mt-2">
            Chat, study, and earn XP together.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate("/groups")} className="btn bg-white/10">
            All Rooms
          </button>
          <button onClick={() => navigate("/groups")} className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            New Room
          </button>
        </div>
      </section>

      <section className="glass rounded-[32px] overflow-hidden h-[650px] flex flex-col max-w-5xl mx-auto">
        <div className="flex-1 p-5 md:p-8 space-y-4 overflow-y-auto">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <h2 className="text-2xl font-black">No messages yet</h2>
                <p className="text-gray-400 mt-2">Start the conversation.</p>
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const isMe = msg.uid === uid

            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[78%] md:max-w-[62%] rounded-3xl px-5 py-4 ${
                    isMe
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md"
                      : "bg-white/10 border border-white/10 rounded-bl-md"
                  }`}
                >
                  <p className="text-xs text-gray-300 mb-1">
                    {isMe ? "You" : users[msg.uid]?.username || "Student"}
                  </p>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="p-4 md:p-5 border-t border-white/10 flex gap-3 bg-black/20">
          <input
            className="flex-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Write a message..."
          />

          <button onClick={sendMessage} className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6">
            Send
          </button>
        </div>
      </section>
    </div>
  )
}