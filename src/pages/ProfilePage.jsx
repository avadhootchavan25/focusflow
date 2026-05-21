import { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export default function Profile() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    xp: 0,
    level: 1,
    streak: 0,
    sessions: 0,
    dailyFocusMinutes: 0,
    totalFocusMinutes: 0,
  })

  const [username, setUsername] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser
      if (!user) return

      const snap = await getDoc(doc(db, "users", user.uid))

      if (snap.exists()) {
        const data = snap.data()
        setUserData({
          username: data.username || user.email?.split("@")[0] || "Student",
          email: data.email || user.email,
          xp: data.xp || 0,
          level: data.level || 1,
          streak: data.streak || 0,
          sessions: data.sessions || 0,
          dailyFocusMinutes: data.dailyFocusMinutes || 0,
          totalFocusMinutes: data.totalFocusMinutes || 0,
        })
        setUsername(data.username || "")
      }
    }

    loadProfile()
  }, [])

  const saveUsername = async () => {
    const user = auth.currentUser
    if (!user || !username.trim()) return

    setSaving(true)

    await setDoc(
      doc(db, "users", user.uid),
      {
        username: username.trim(),
        updatedAt: new Date(),
      },
      { merge: true }
    )

    setUserData((prev) => ({
      ...prev,
      username: username.trim(),
    }))

    setSaving(false)
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden glass rounded-[32px] p-8 md:p-12">
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative">
          <p className="text-purple-300 font-bold uppercase text-sm">Your Account</p>
          <h1 className="text-4xl md:text-6xl font-black mt-3">
            {userData.username}
          </h1>
          <p className="text-gray-300 mt-4">{userData.email}</p>
        </div>
      </section>

      <section className="grid md:grid-cols-4 gap-5">
        <div className="card">
          <p className="text-gray-400">Level</p>
          <h2 className="text-6xl font-black mt-3">{userData.level}</h2>
        </div>

        <div className="card">
          <p className="text-gray-400">XP</p>
          <h2 className="text-6xl font-black mt-3">{userData.xp}</h2>
        </div>

        <div className="card">
          <p className="text-gray-400">Streak</p>
          <h2 className="text-6xl font-black mt-3">🔥 {userData.streak}</h2>
        </div>

        <div className="card">
          <p className="text-gray-400">Sessions</p>
          <h2 className="text-6xl font-black mt-3">{userData.sessions}</h2>
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <p className="text-gray-400">Today’s Focus</p>
          <h2 className="text-5xl font-black mt-3">
            {userData.dailyFocusMinutes} min
          </h2>
        </div>

        <div className="card">
          <p className="text-gray-400">Total Focus Time</p>
          <h2 className="text-5xl font-black mt-3">
            {userData.totalFocusMinutes} min
          </h2>
        </div>
      </section>

      <section className="glass rounded-[32px] p-6 md:p-8 max-w-2xl">
        <p className="text-blue-300 font-semibold">Edit Profile</p>
        <h2 className="text-3xl font-black mt-2">Change Username</h2>

        <div className="flex flex-col md:flex-row gap-3 mt-6">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter new username"
          />

          <button
            onClick={saveUsername}
            className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </section>
    </div>
  )
}