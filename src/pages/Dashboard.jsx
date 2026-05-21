import { useEffect, useState } from "react"
import { auth } from "../firebase"
import { motion } from "framer-motion"
import {
  Flame,
  Trophy,
  Timer,
  BookOpen,
  Sparkles,
  Users,
  ArrowRight,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()
  const user = auth.currentUser

  const [username, setUsername] = useState("Student")
  const [avatar, setAvatar] = useState("🧠")

  useEffect(() => {
    const savedName =
      localStorage.getItem("focusflow_username") ||
      user?.displayName ||
      user?.email?.split("@")[0] ||
      "Student"

    const savedAvatar = localStorage.getItem("focusflow_avatar") || "🧠"

    setUsername(savedName)
    setAvatar(savedAvatar)
  }, [user])

  const stats = [
    {
      label: "Total XP",
      value: Number(localStorage.getItem("focusflow_xp")) || 0,
      icon: Trophy,
      color: "text-blue-300",
    },
    {
      label: "Current Streak",
      value: `${Number(localStorage.getItem("focusflow_streak")) || 0} days`,
      icon: Flame,
      color: "text-orange-300",
    },
    {
      label: "Focus Sessions",
      value: Number(localStorage.getItem("focusflow_sessions")) || 0,
      icon: Timer,
      color: "text-emerald-300",
    },
    {
      label: "Focus Minutes",
      value: `${Number(localStorage.getItem("focusflow_focus_minutes")) || 0} min`,
      icon: BookOpen,
      color: "text-pink-300",
    },
  ]

  const actions = [
    {
      title: "Start Focus Session",
      desc: "Use timer, gain XP, and build your streak.",
      icon: Timer,
      path: "/focus",
      color: "from-blue-500/25 to-cyan-500/10",
    },
    {
      title: "Study Assistant",
      desc: "Generate plans, summarize PDFs, and make flashcards.",
      icon: Sparkles,
      path: "/titi-ai",
      color: "from-emerald-500/25 to-blue-500/10",
    },
    {
      title: "Study Groups",
      desc: "Join rooms, collaborate, and study with friends.",
      icon: Users,
      path: "/groups",
      color: "from-purple-500/25 to-pink-500/10",
    },
  ]

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden glass rounded-[32px] p-8 md:p-12">
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="text-blue-300 font-bold uppercase text-sm">
              Dashboard
            </p>

            <h1 className="text-4xl md:text-6xl font-black mt-3">
              Welcome back, {username}
            </h1>

            <p className="text-gray-300 mt-4 max-w-2xl">
              Track your focus, continue your study flow, and keep building progress.
            </p>
          </div>

          <motion.button
            onClick={() => navigate("/profile")}
            whileHover={{ scale: 1.04 }}
            className="h-32 w-32 rounded-[36px] bg-white/10 border border-white/10 flex items-center justify-center text-6xl shadow-2xl"
          >
            {avatar}
          </motion.button>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <Icon size={20} className={stat.color} />
              </div>

              <h2 className={`text-3xl font-black mt-3 ${stat.color}`}>
                {stat.value}
              </h2>
            </motion.div>
          )
        })}
      </section>

      <section className="grid lg:grid-cols-3 gap-5">
        {actions.map((action, index) => {
          const Icon = action.icon

          return (
            <motion.button
              key={action.title}
              onClick={() => navigate(action.path)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`text-left rounded-[32px] border border-white/10 bg-gradient-to-br ${action.color} p-6 hover:border-white/20`}
            >
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <Icon className="text-white" />
              </div>

              <h3 className="text-2xl font-black mt-5">{action.title}</h3>
              <p className="text-gray-300 mt-2">{action.desc}</p>

              <div className="mt-5 flex items-center gap-2 text-sm text-white">
                Open <ArrowRight size={16} />
              </div>
            </motion.button>
          )
        })}
      </section>

      <section className="glass rounded-[32px] p-6 md:p-8">
        <p className="text-purple-300 font-semibold">Today</p>
        <h2 className="text-3xl font-black mt-1">Recommended Flow</h2>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="rounded-[28px] bg-white/10 border border-white/10 p-5">
            <p className="font-bold">1. Start timer</p>
            <p className="text-gray-400 mt-2">
              Do one focused study session first.
            </p>
          </div>

          <div className="rounded-[28px] bg-white/10 border border-white/10 p-5">
            <p className="font-bold">2. Summarize notes</p>
            <p className="text-gray-400 mt-2">
              Upload notes/PDF and create revision material.
            </p>
          </div>

          <div className="rounded-[28px] bg-white/10 border border-white/10 p-5">
            <p className="font-bold">3. Review flashcards</p>
            <p className="text-gray-400 mt-2">
              Use active recall to lock concepts in.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}