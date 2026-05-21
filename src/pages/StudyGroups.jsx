import { useEffect, useState } from "react"
import { db, auth } from "../firebase"
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export default function StudyGroups() {
  const [rooms, setRooms] = useState([])
  const [roomName, setRoomName] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "rooms"), (snap) => {
      setRooms(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })

    return () => unsub()
  }, [])

  const createRoom = async () => {
    if (!roomName.trim()) return

    const docRef = await addDoc(collection(db, "rooms"), {
      name: roomName.trim(),
      createdBy: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
    })

    setRoomName("")
    setShowCreate(false)
    navigate(`/room/${docRef.id}`)
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden glass rounded-[32px] p-8 md:p-12">
        <div className="absolute -top-28 right-10 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <p className="text-blue-300 font-bold uppercase text-sm">Study Together</p>
            <h1 className="text-4xl md:text-6xl font-black mt-3">
              Study Groups
            </h1>
            <p className="text-gray-300 mt-4 max-w-2xl">
              Create rooms, join friends, chat live, and build focus together.
            </p>
          </div>

          <button
            onClick={() => setShowCreate(!showCreate)}
            className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white px-7 py-4"
          >
            {showCreate ? "Close" : "Create New Room"}
          </button>
        </div>
      </section>

      {showCreate && (
        <motion.section
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[28px] p-6 md:p-8 max-w-3xl mx-auto"
        >
          <p className="text-blue-300 font-semibold">New Room</p>
          <h2 className="text-3xl font-black mt-2">Create a study space</h2>

          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createRoom()}
              placeholder="Example: Maths grind, Physics revision..."
              className="flex-1"
            />

            <button
              onClick={createRoom}
              className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              Create Room
            </button>
          </div>
        </motion.section>
      )}

      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {rooms.length === 0 && (
          <div className="card md:col-span-2 xl:col-span-3 text-center">
            <h2 className="text-3xl font-black">No rooms yet</h2>
            <p className="text-gray-400 mt-2">Create the first study room.</p>
          </div>
        )}

        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => navigate(`/room/${room.id}`)}
            className="card cursor-pointer hover:scale-[1.02] transition"
          >
            <div className="flex items-center justify-between">
              <p className="text-blue-300 text-sm font-semibold">Live Room</p>
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/15 text-green-300">
                Open
              </span>
            </div>

            <h2 className="text-2xl font-black mt-4">{room.name}</h2>
            <p className="text-gray-400 mt-3">
              Join the room and start studying with others.
            </p>

            <button className="btn bg-white/10 mt-6">Join Room</button>
          </motion.div>
        ))}
      </section>
    </div>
  )
}