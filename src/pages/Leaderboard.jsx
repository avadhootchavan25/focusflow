import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Flame, Star, Crown, Loader2 } from "lucide-react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "../firebase"

export default function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("xp", "desc"), limit(20))
        const snap = await getDocs(q)

        const data = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))

        setUsers(data)
      } catch (err) {
        console.log(err)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [])

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden glass rounded-[32px] p-8 md:p-12">
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-yellow-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative">
          <p className="text-yellow-300 font-bold uppercase text-sm">
            Leaderboard
          </p>
          <h1 className="text-4xl md:text-6xl font-black mt-3">
            Global rankings.
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl">
            Compete with real FocusFlow users based on XP earned from focus sessions.
          </p>
        </div>
      </section>

      {loading ? (
        <section className="glass rounded-[32px] p-10 text-center">
          <Loader2 className="mx-auto animate-spin text-blue-300" size={42} />
          <p className="text-gray-300 mt-4">Loading leaderboard...</p>
        </section>
      ) : users.length === 0 ? (
        <section className="glass rounded-[32px] p-10 text-center">
          <Trophy className="mx-auto text-yellow-300" size={46} />
          <h2 className="text-3xl font-black mt-4">No leaderboard data yet</h2>
          <p className="text-gray-400 mt-2">
            Complete a focus session to appear here.
          </p>
        </section>
      ) : (
        <>
          <section className="grid md:grid-cols-3 gap-5 items-end">
            {users.slice(0, 3).map((user, index) => {
              const rank = index + 1

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={`glass rounded-[32px] p-6 text-center ${
                    rank === 1
                      ? "md:order-2 border-yellow-300/30 md:min-h-[310px]"
                      : rank === 2
                      ? "md:order-1 md:min-h-[260px]"
                      : "md:order-3 md:min-h-[230px]"
                  }`}
                >
                  <div className="mx-auto h-16 w-16 rounded-3xl bg-white/10 border border-white/10 flex items-center justify-center">
                    <Crown className="text-yellow-300" />
                  </div>

                  <div className="mt-5 text-6xl">{user.avatar || "🧠"}</div>

                  <h2 className="text-2xl font-black mt-4">
                    {user.username || "Student"}
                  </h2>
                  <p className="text-gray-400">Rank #{rank}</p>

                  <div className="mt-5 rounded-[24px] bg-white/10 border border-white/10 p-4">
                    <p className="text-3xl font-black text-yellow-300">
                      {user.xp || 0}
                    </p>
                    <p className="text-gray-400 text-sm">XP</p>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-orange-300">
                    <Flame size={18} />
                    <span>{user.streak || 0} day streak</span>
                  </div>
                </motion.div>
              )
            })}
          </section>

          <section className="glass rounded-[32px] p-6 md:p-8">
            <p className="text-blue-300 font-semibold">Rankings</p>
            <h2 className="text-3xl font-black mt-1">Top FocusFlow Users</h2>

            <div className="mt-6 space-y-3">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="rounded-[28px] bg-white/10 border border-white/10 p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center font-black">
                      #{index + 1}
                    </div>

                    <div className="text-3xl">{user.avatar || "🧠"}</div>

                    <div>
                      <p className="font-black">
                        {user.username || "Student"}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center gap-1">
                        <Flame size={14} /> {user.streak || 0} day streak
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black">{user.xp || 0}</p>
                    <p className="text-gray-400 text-sm">XP</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="grid md:grid-cols-3 gap-4">
        <InfoCard title="Earn XP" text="Complete focus sessions to increase your score." />
        <InfoCard title="Keep streaks" text="Study daily to build consistency." />
        <InfoCard title="Compete" text="Leaderboard uses real users from Firebase." />
      </section>
    </div>
  )
}

function InfoCard({ title, text }) {
  return (
    <div className="card">
      <Star className="text-yellow-300" />
      <h3 className="text-xl font-black mt-4">{title}</h3>
      <p className="text-gray-400 mt-2">{text}</p>
    </div>
  )
}