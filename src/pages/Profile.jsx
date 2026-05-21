import { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export default function Profile() {
  const [userData, setUserData] = useState(null)
  const [username, setUsername] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser
      if (!user) return

      const ref = doc(db, "users", user.uid)
      const snap = await getDoc(ref)

      if (snap.exists()) {
        setUserData(snap.data())
        setUsername(snap.data().username || "")
      }
    }

    load()
  }, [])

  const saveProfile = async () => {
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
          <p className="text-purple-300 font-bold uppercase text-sm">Profile</p>
          <h1 className="text-4xl md:text-6xl font-black mt-3">
            {userData?.username || "Your Profile"}
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl">
            Manage your identity and track your study progress.
          </p>
        </div>
      </section>

      <section className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="glass rounded-[32px] p-6 md:p-8">
          <h2 className="text-3xl font-black">Account Settings</h2>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-gray-400 mb-2">Username</p>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>

            <div>
              <p className="text-gray-400 mb-2">Email</p>
              <input value={auth.currentUser?.email || ""} disabled />
            </div>

            <button
              onClick={saveProfile}
              className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card">
            <p className="text-gray-400">Level</p>
            <h2 className="text-5xl font-black mt-3">{userData?.level || 1}</h2>
          </div>

          <div className="card">
            <p className="text-gray-400">XP</p>
            <h2 className="text-5xl font-black mt-3">{userData?.xp || 0}</h2>
          </div>

          <div className="card">
            <p className="text-gray-400">Total Focus</p>
            <h2 className="text-5xl font-black mt-3">
              {userData?.totalFocusMinutes || 0}m
            </h2>
          </div>
        </aside>
      </section>
    </div>
  )
}