import { motion } from "framer-motion"
import { Trophy, Medal, Flame, Star, Crown } from "lucide-react"

export default function Leaderboard() {
  const currentUser = localStorage.getItem("focusflow_username") || "You"
  const currentAvatar = localStorage.getItem("focusflow_avatar") || "🧠"
  const currentXP = Number(localStorage.getItem("focusflow_xp")) || 0
  const currentStreak = Number(localStorage.getItem("focusflow_streak")) || 0

  const users = [
    { name: "Aarav", avatar: "🔥", xp: 2450, streak: 14 },
    { name: "Mira", avatar: "🚀", xp: 2210, streak: 11 },
    { name: "Kabir", avatar: "📚", xp: 1980, streak: 9 },
    { name: currentUser, avatar: currentAvatar, xp: currentXP, streak: currentStreak },
    { name: "Riya", avatar: "🎧", xp: 1420, streak: 7 },
    { name: "Dev", avatar: "⚡", xp: 1210, streak: 5 },
    { name: "Isha", avatar: "🌙", xp: 980, streak: 4 },
  ]

  const sortedUsers = users.sort((a, b) => b.xp - a.xp)
  const topThree = sortedUsers.slice(0, 3)
  const rest = sortedUsers.slice(3)

  const rankIcon = (rank) => {
    if (rank === 1) return <Crown className="text-yellow-300" />
    if (rank === 2) return <Medal className="text-gray-300" />
    if (rank === 3) return <Medal className="text-orange-300" />
    return <Trophy className="text-blue-300" />
  }

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
            Compete with focus.
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl">
            Earn XP from focus sessions, maintain streaks, and climb the weekly rankings.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-5 items-end">
        {topThree.map((user, index) => {
          const rank = index + 1
          const height =
            rank === 1 ? "md:min-h-[310px]" : rank === 2 ? "md:min-h-[260px]" : "md:min-h-[230px]"

          return (
            <motion.div
              key={user.name}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`glass rounded-[32px] p-6 text-center ${height} ${
                rank === 1 ? "md:order-2 border-yellow-300/30" : rank === 2 ? "md:order-1" : "md:order-3"
              }`}
            >
              <div className="mx-auto h-16 w-16 rounded-3xl bg-white/10 border border-white/10 flex items-center justify-center">
                {rankIcon(rank)}
              </div>

              <div className="mt-5 text-6xl">{user.avatar}</div>

              <h2 className="text-2xl font-black mt-4">{user.name}</h2>
              <p className="text-gray-400">Rank #{rank}</p>

              <div className="mt-5 rounded-[24px] bg-white/10 border border-white/10 p-4">
                <p className="text-3xl font-black text-yellow-300">{user.xp}</p>
                <p className="text-gray-400 text-sm">XP</p>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-orange-300">
                <Flame size={18} />
                <span>{user.streak} day streak</span>
              </div>
            </motion.div>
          )
        })}
      </section>

      <section className="glass rounded-[32px] p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-blue-300 font-semibold">Rankings</p>
            <h2 className="text-3xl font-black mt-1">Weekly XP Board</h2>
          </div>

          <div className="rounded-full bg-white/10 border border-white/10 px-5 py-3 text-sm text-gray-300">
            Resets every week
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {rest.map((user, index) => {
            const rank = index + 4
            const isYou = user.name === currentUser

            return (
              <motion.div
                key={`${user.name}-${rank}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`rounded-[28px] border p-4 flex items-center justify-between gap-4 ${
                  isYou
                    ? "bg-blue-500/20 border-blue-300/30"
                    : "bg-white/10 border-white/10"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center font-black">
                    #{rank}
                  </div>

                  <div className="text-3xl">{user.avatar}</div>

                  <div>
                    <p className="font-black">
                      {user.name} {isYou && <span className="text-blue-300">(You)</span>}
                    </p>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <Flame size={14} /> {user.streak} day streak
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black">{user.xp}</p>
                  <p className="text-gray-400 text-sm">XP</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <InfoCard icon={Star} title="Earn XP" text="Complete focus sessions to increase your score." />
        <InfoCard icon={Flame} title="Keep streaks" text="Study daily to build consistency." />
        <InfoCard icon={Trophy} title="Climb ranks" text="Your XP decides your weekly rank." />
      </section>
    </div>
  )
}

function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="card">
      <Icon className="text-yellow-300" />
      <h3 className="text-xl font-black mt-4">{title}</h3>
      <p className="text-gray-400 mt-2">{text}</p>
    </div>
  )
}