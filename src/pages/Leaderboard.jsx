import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, onSnapshot } from "firebase/firestore"
import { motion } from "framer-motion"

export default function Leaderboard() {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      const sorted = data.sort((a, b) => {
        const bScore = (b.level || 1) * 1000 + (b.xp || 0)
        const aScore = (a.level || 1) * 1000 + (a.xp || 0)
        return bScore - aScore
      })

      setPlayers(sorted)
    })

    return () => unsub()
  }, [])

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden glass rounded-[32px] p-8 md:p-12">
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-yellow-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative">
          <p className="text-yellow-300 font-bold uppercase text-sm">
            Competitive Study
          </p>
          <h1 className="text-4xl md:text-6xl font-black mt-3">
            Leaderboard
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl">
            Rank up by earning XP through focus sessions and study rooms.
          </p>
        </div>
      </section>

      <section className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="glass rounded-[32px] p-5 md:p-8">
          <div className="space-y-4">
            {players.length === 0 && (
              <div className="text-center py-16">
                <h2 className="text-3xl font-black">No players yet</h2>
                <p className="text-gray-400 mt-2">Start studying to appear here.</p>
              </div>
            )}

            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center justify-between gap-4 rounded-3xl bg-white/7 border border-white/10 p-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black ${
                      index === 0
                        ? "bg-yellow-500/20 text-yellow-300"
                        : index === 1
                        ? "bg-gray-300/20 text-gray-200"
                        : index === 2
                        ? "bg-orange-500/20 text-orange-300"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    #{index + 1}
                  </div>

                  <div>
                    <h3 className="font-black text-lg">
                      {player.username || player.email?.split("@")[0] || "Student"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Level {player.level || 1}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black">{player.xp || 0}</p>
                  <p className="text-gray-400 text-sm">XP</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card">
            <p className="text-gray-400">Top Student</p>
            <h2 className="text-3xl font-black mt-3">
              {players[0]?.username || "Waiting..."}
            </h2>
            <p className="text-yellow-300 mt-2">
              {players[0]?.xp || 0} XP
            </p>
          </div>

          <div className="card">
            <p className="text-gray-400">Total Players</p>
            <h2 className="text-5xl font-black mt-3">{players.length}</h2>
          </div>

          <div className="card">
            <p className="text-gray-400">How to climb?</p>
            <p className="text-lg font-semibold mt-3">
              Complete focus sessions and send useful study messages.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}