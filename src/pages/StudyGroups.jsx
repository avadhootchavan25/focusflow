import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Users, Plus, BookOpen, MessageCircle, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { auth, db } from "../firebase"
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore"

export default function StudyGroups() {
  const navigate = useNavigate()

  const [username, setUsername] = useState("Student")
  const [avatar, setAvatar] = useState("🧠")
  const [roomName, setRoomName] = useState("")
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUsername(
      localStorage.getItem("focusflow_username") ||
        auth.currentUser?.displayName ||
        auth.currentUser?.email?.split("@")[0] ||
        "Student"
    )
    setAvatar(localStorage.getItem("focusflow_avatar") || "🧠")

    const q = query(collection(db, "rooms"), orderBy("createdAt", "desc"))

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))

        setRooms(data)
        setLoading(false)
      },
      (err) => {
        console.log(err)
        toast.error("Could not load groups")
        setLoading(false)
      }
    )

    return () => unsub()
  }, [])

  const createRoom = async () => {
    if (!roomName.trim()) {
      toast.error("Enter room name")
      return
    }

    if (!auth.currentUser) {
      toast.error("Login first")
      return
    }

    try {
      await addDoc(collection(db, "rooms"), {
        name: roomName.trim(),
        topic: "New study room",
        members: 1,
        createdBy: auth.currentUser.uid,
        createdByName: username,
        createdByAvatar: avatar,
        createdAt: serverTimestamp(),
      })

      setRoomName("")
      toast.success("Room created")
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden glass rounded-[32px] p-8 md:p-12">
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="text-purple-300 font-bold uppercase text-sm">
              Study Groups
            </p>
            <h1 className="text-4xl md:text-6xl font-black mt-3">
              Study with your crew.
            </h1>
            <p className="text-gray-300 mt-4 max-w-2xl">
              Create rooms, join study sessions, and revise together across all devices.
            </p>
          </div>

          <div className="glass rounded-[28px] p-5 flex items-center gap-4">
            <div className="h-16 w-16 rounded-3xl bg-white/10 flex items-center justify-center text-4xl">
              {avatar}
            </div>
            <div>
              <p className="text-gray-400 text-sm">Logged in as</p>
              <p className="font-black text-xl">{username}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-[380px_1fr] gap-6">
        <div className="card">
          <Plus className="text-blue-300" />
          <h2 className="text-2xl font-black mt-4">Create Group</h2>
          <p className="text-gray-400 mt-2">
            Make a room for your subject or revision session.
          </p>

          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Room name e.g. Physics Doubts"
            className="w-full mt-5"
          />

          <button
            onClick={createRoom}
            className="btn w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          >
            Create Room
          </button>
        </div>

        <div className="glass rounded-[32px] p-6 md:p-8">
          <div>
            <p className="text-blue-300 font-semibold">Available Rooms</p>
            <h2 className="text-3xl font-black mt-1">Join a study room</h2>
          </div>

          {loading ? (
            <div className="mt-10 text-center text-gray-300">
              <Loader2 className="mx-auto animate-spin text-blue-300" size={36} />
              <p className="mt-3">Loading groups...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="mt-10 rounded-[28px] bg-white/10 border border-white/10 p-8 text-center text-gray-300">
              No groups yet. Create the first one.
            </div>
          ) : (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-[30px] bg-white/10 border border-white/10 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                      <Users className="text-purple-300" />
                    </div>

                    <div className="flex -space-x-2">
                      <div className="h-9 w-9 rounded-full bg-white/20 border border-white/20 flex items-center justify-center">
                        {room.createdByAvatar || "🧠"}
                      </div>
                      <div className="h-9 w-9 rounded-full bg-white/20 border border-white/20 flex items-center justify-center">
                        📚
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mt-5">{room.name}</h3>
                  <p className="text-gray-400 mt-2">{room.topic}</p>

                  <p className="text-sm text-gray-400 mt-3">
                    Created by {room.createdByName || "Student"}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-sm text-gray-300 flex items-center gap-2">
                      <BookOpen size={16} /> {room.members || 1} members
                    </p>

                    <button
                      onClick={() => navigate(`/groups/${room.id}`)}
                      className="btn bg-white/10 text-white"
                    >
                      <MessageCircle size={16} /> Join
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}