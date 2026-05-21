import { useEffect, useState } from "react"
import { auth } from "../firebase"
import { getUserXP } from "../utils/xp"
import { motion } from "framer-motion"

export default function Dashboard() {
  const [xpData, setXpData] = useState({ xp: 0, level: 1 })

  useEffect(() => {
    const load = async () => {
      const data = await getUserXP()
      if (data) setXpData(data)
    }
    load()
  }, [])

  const progress = Math.min((xpData.xp / (xpData.level * 100)) * 100, 100)

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden glass rounded-[32px] p-8 md:p-12">
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative">
          <p className="text-blue-300 font-bold uppercase text-sm">Dashboard</p>
          <h1 className="text-4xl md:text-6xl font-black mt-3">
            Welcome back, {auth.currentUser?.email?.split("@")[0] || "Student"}
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl">
            Track your progress, start focus sessions, join groups, and level up.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-5">
        <motion.div className="card" whileHover={{ scale: 1.02 }}>
          <p className="text-gray-400">Current Level</p>
          <h2 className="text-6xl font-black mt-3">{xpData.level}</h2>
          <p className="text-blue-300 mt-2">Keep studying to level up.</p>
        </motion.div>

        <motion.div className="card md:col-span-2" whileHover={{ scale: 1.01 }}>
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
        </motion.div>
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

        <div className="card">
          <h3 className="text-2xl font-black">Streak</h3>
          <p className="text-gray-400 mt-2">Daily streak system coming next.</p>
        </div>
      </section>
    </div>
  )
}