import { useEffect, useState } from "react"
import { signOut, updateProfile } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

export default function ProfilePage() {
  const navigate = useNavigate()
  const user = auth.currentUser

  const [username, setUsername] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState("🧠")
  const [saving, setSaving] = useState(false)

  const avatars = ["🧠", "🔥", "🚀", "📚", "🎧", "⚡", "🌙", "🏆"]

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || user.email?.split("@")[0] || "Student")
      setSelectedAvatar(localStorage.getItem("focusflow_avatar") || "🧠")
    }
  }, [user])

  const stats = {
    xp: Number(localStorage.getItem("focusflow_xp")) || 0,
    streak: Number(localStorage.getItem("focusflow_streak")) || 0,
    sessions: Number(localStorage.getItem("focusflow_sessions")) || 0,
    focus: Number(localStorage.getItem("focusflow_focus_minutes")) || 0,
  }

  const saveProfile = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty")
      return
    }

    try {
      setSaving(true)

      if (user) {
        await updateProfile(user, {
          displayName: username.trim(),
        })
      }

      localStorage.setItem("focusflow_username", username.trim())
      localStorage.setItem("focusflow_avatar", selectedAvatar)

      toast.success("Profile updated")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const logout = async () => {
    await signOut(auth)
    toast.success("Logged out")
    navigate("/")
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden glass rounded-[32px] p-8 md:p-12">
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="text-purple-300 font-bold uppercase text-sm">
              Profile
            </p>
            <h1 className="text-4xl md:text-6xl font-black mt-3">
              Your study identity
            </h1>
            <p className="text-gray-300 mt-4 max-w-2xl">
              Customize your profile, track your progress, and keep your FocusFlow stats clean.
            </p>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-32 w-32 rounded-[36px] bg-white/10 border border-white/10 flex items-center justify-center text-6xl shadow-2xl"
          >
            {selectedAvatar}
          </motion.div>
        </div>
      </section>

      <section className="grid lg:grid-cols-[420px_1fr] gap-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[32px] p-6"
        >
          <h2 className="text-2xl font-black">Edit Profile</h2>
          <p className="text-gray-400 mt-2">
            This username will show instead of your email.
          </p>

          <div className="mt-6">
            <label className="text-sm text-gray-400">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-2"
              placeholder="Enter username"
            />
          </div>

          <div className="mt-6">
            <label className="text-sm text-gray-400">Choose Avatar</label>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`h-16 rounded-3xl text-3xl border ${
                    selectedAvatar === avatar
                      ? "bg-purple-500/25 border-purple-300/50"
                      : "bg-white/10 border-white/10"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="btn w-full mt-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          <button
            onClick={logout}
            className="btn w-full mt-3 bg-red-500/15 text-red-300"
          >
            Logout
          </button>
        </motion.div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <StatCard label="Total XP" value={stats.xp} color="text-blue-300" />
            <StatCard label="Streak" value={`${stats.streak} days`} color="text-orange-300" />
            <StatCard label="Sessions" value={stats.sessions} color="text-emerald-300" />
            <StatCard label="Focus Time" value={`${stats.focus} min`} color="text-pink-300" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass rounded-[32px] p-6 md:p-8"
          >
            <p className="text-blue-300 font-semibold">Account</p>
            <h2 className="text-3xl font-black mt-1">Profile Details</h2>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <InfoCard label="Username" value={username || "Student"} />
              <InfoCard label="Email" value={user?.email || "Not available"} />
              <InfoCard label="Avatar" value={selectedAvatar} />
              <InfoCard label="Account Status" value="Active" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-[32px] p-6 md:p-8"
          >
            <p className="text-emerald-300 font-semibold">Progress</p>
            <h2 className="text-3xl font-black mt-1">Study Summary</h2>

            <div className="mt-6 rounded-[28px] bg-white/10 border border-white/10 p-5">
              <p className="text-gray-300 leading-relaxed">
                Keep completing focus sessions to increase XP, maintain streaks,
                and climb the leaderboard. Your profile updates automatically as your study activity grows.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <p className="text-gray-400 text-sm">{label}</p>
      <h3 className={`text-3xl font-black mt-2 ${color}`}>{value}</h3>
    </motion.div>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-[28px] bg-white/10 border border-white/10 p-5">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white font-bold mt-2 break-all">{value}</p>
    </div>
  )
}