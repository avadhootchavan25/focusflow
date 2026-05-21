import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Timer,
  Users,
  Trophy,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

export default function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Timer,
      title: "Focus Timer",
      text: "Start deep work sessions, track minutes, and build consistency.",
    },
    {
      icon: FileText,
      title: "Study Assistant",
      text: "Upload PDFs, summarize notes, and create flashcards instantly.",
    },
    {
      icon: Users,
      title: "Study Groups",
      text: "Create rooms, study with friends, and stay accountable.",
    },
    {
      icon: Trophy,
      title: "Leaderboard",
      text: "Earn XP, keep streaks, and compete with classmates.",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#07070c] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.22),transparent_35%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.16),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />

      <nav className="relative z-10 px-6 py-5">
        <div className="mx-auto max-w-7xl glass rounded-[28px] px-5 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-left">
            <h1 className="text-xl font-black tracking-tight">FocusFlow</h1>
            <p className="text-xs text-gray-400">study smarter together</p>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:block px-5 py-2 rounded-2xl text-gray-300 hover:bg-white/10"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-20">
        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-blue-200"
            >
              <Sparkles size={16} />
              FocusFlow
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-6 text-5xl md:text-7xl font-black leading-tight"
            >
              Study better.
              <br />
              Focus longer.
              <br />
              Win together.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 max-w-2xl text-lg text-gray-300 leading-relaxed"
            >
              FocusFlow helps students plan study sessions, summarize notes,
              create flashcards, join study groups, and compete through XP and leaderboards.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <button
                onClick={() => navigate("/signup")}
                className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg px-7 py-4"
              >
                Start Studying <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="btn bg-white/10 text-white text-lg px-7 py-4"
              >
                Login
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[48px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl" />

            <div className="relative glass rounded-[40px] p-5 shadow-2xl">
              <div className="rounded-[32px] bg-[#0d0d16]/80 border border-white/10 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Today’s Focus</p>
                    <h3 className="text-3xl font-black mt-1">2h 45m</h3>
                  </div>
                  <div className="h-16 w-16 rounded-3xl bg-blue-500/20 flex items-center justify-center">
                    <Timer className="text-blue-300" />
                  </div>
                </div>

                <div className="mt-6 h-3 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[72%] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <MiniStat label="XP" value="1240" />
                  <MiniStat label="Streak" value="8d" />
                  <MiniStat label="Rank" value="#4" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <PreviewCard title="PDF Summary" text="Clean notes from uploaded files." />
                <PreviewCard title="Flashcards" text="Quick Q/A revision cards." />
                <PreviewCard title="Groups" text="Study rooms with friends." />
                <PreviewCard title="Leaderboard" text="Weekly XP ranking." />
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-blue-300 font-bold uppercase text-sm">Features</p>
            <h2 className="text-4xl md:text-5xl font-black mt-3">
              Everything students need in one place.
            </h2>
          </div>

          <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-[32px] p-6"
                >
                  <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Icon className="text-blue-300" />
                  </div>

                  <h3 className="text-xl font-black mt-5">{feature.title}</h3>
                  <p className="text-gray-400 mt-2">{feature.text}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        <section className="mt-24 glass rounded-[40px] p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-emerald-300 font-bold uppercase text-sm">
                Why FocusFlow?
              </p>
              <h2 className="text-4xl md:text-5xl font-black mt-3">
                Built for real student workflow.
              </h2>
              <p className="text-gray-300 mt-5 leading-relaxed">
                Instead of switching between timer apps, notes apps, PDFs,
                and group chats, FocusFlow brings the important study tools together.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Upload notes and generate revision material",
                "Track focus time and progress",
                "Compete using XP and streaks",
                "Study together through groups",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] bg-white/10 border border-white/10 p-4 flex items-center gap-3"
                >
                  <CheckCircle className="text-emerald-300" />
                  <p className="font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-[22px] bg-white/10 border border-white/10 p-4">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-xl font-black mt-1">{value}</p>
    </div>
  )
}

function PreviewCard({ title, text }) {
  return (
    <div className="rounded-[26px] bg-white/10 border border-white/10 p-4">
      <p className="font-black">{title}</p>
      <p className="text-gray-400 text-sm mt-1">{text}</p>
    </div>
  )
}