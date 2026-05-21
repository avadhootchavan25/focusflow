import { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"
import { getUserXP } from "../utils/xp"
import { getUserStreak } from "../utils/streak"
import { motion } from "framer-motion"

export default function Dashboard() {
  const [xpData, setXpData] = useState({
    xp: 0,
    level: 1,
    sessions: 0,
    dailyFocusMinutes: 0,
    totalFocusMinutes: 0,
  })

  const [username, setUsername] = useState("Student")
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const load = async () => {
      const data = await getUserXP()
      if (data) setXpData(data)

      const streakData = await getUserStreak()
      setStreak(streakData.streak || 0)

      const user = auth.currentUser
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid))
        if (snap.exists()) {
          setUsername(snap.data().username || user.email?.split("@")[0] || "Student")
        }
      }
    }

    load()
  }, [])

  const progress = Math.min((xpData.xp / (xpData.level * 100)) * 100, 100)
  const dailyGoal = 120
  const dailyProgress = Math.min((xpData.dailyFocusMinutes / dailyGoal) * 100, 100)

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden glass rounded-[32px] p-8 md:p-12">
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative">
          <p className="text-blue-300 font-bold uppercase text-sm">Dashboard</p>
          <h1 className="text-4xl md:text-6xl font-black mt-3">
            Welcome back, {username}
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl">
            Track today’s focus, XP, streaks, and progress.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-4 gap-5">
        <motion.div className="card" whileHover={{ scale: 1.02 }}>
          <p className="text-gray-400">Current Level</p>
          <h2 className="text-6xl font-black mt-3">{xpData.level}</h2>
          <p className="text-blue-300 mt-2">Keep studying to level up.</p>
        </motion.div>

        <motion.div className="card" whileHover={{ scale: 1.02 }}>
          <p className="text-gray-400">Daily Streak</p>
          <h2 className="text-6xl font-black mt-3">🔥 {streak}</h2>
          <p className="text-orange-300 mt-2">Days in a row</p>
        </motion.div>

        <motion.div className="card" whileHover={{ scale: 1.02 }}>
          <p className="text-gray-400">Sessions</p>
          <h2 className="text-6xl font-black mt-3">{xpData.sessions || 0}</h2>
          <p className="text-green-300 mt-2">Completed sessions</p>
        </motion.div>

        <motion.div className="card" whileHover={{ scale: 1.02 }}>
          <p className="text-gray-400">Today</p>
          <h2 className="text-6xl font-black mt-3">{xpData.dailyFocusMinutes || 0}</h2>
          <p className="text-purple-300 mt-2">Minutes focused</p>
        </motion.div>
      </section>

      <section className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <p className="text-gray-400">XP Progress</p>
          <div className="mt-6 h-5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-400 mt-3">
            {xpData.xp} / {xpData.level * 100} XP
          </p>
        </div>

        <div className="card">
          <p className="text-gray-400">Daily Focus Goal</p>
          <div className="mt-6 h-5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
              style={{ width: `${dailyProgress}%` }}
            />
          </div>
          <p className="text-gray-400 mt-3">
            {xpData.dailyFocusMinutes || 0} / {dailyGoal} minutes today
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-5">
        <a href="/focus" className="card hover:scale-[1.02] transition block">
          <h3 className="text-2xl font-black">Focus Room</h3>
          <p className="text-gray-400 mt-2">Start a deep work session.</p>
        </a>

        <a href="/groups" className="card hover:scale-[1.02] transition block">
          <h3 className="text-2xl font-black">Study Groups</h3>
          <p className="text-gray-400 mt-2">Join rooms and chat live.</p>
        </a>

        <a href="/leaderboard" className="card hover:scale-[1.02] transition block">
          <h3 className="text-2xl font-black">Leaderboard</h3>
          <p className="text-gray-400 mt-2">See your rank.</p>
        </a>
      </section>
    </div>
  )
}