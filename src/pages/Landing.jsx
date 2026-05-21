import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-emerald-500/10" />
      <div className="absolute -top-40 left-20 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="absolute top-40 right-20 h-96 w-96 rounded-full bg-purple-500/25 blur-3xl" />

      <nav className="relative z-10 p-5">
        <div className="glass rounded-[28px] px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black">FocusFlow</h1>
          <button
            onClick={() => navigate("/auth")}
            className="btn bg-white/10"
          >
            Login
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <section className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-blue-300 font-bold uppercase text-sm">
              Study productivity platform
            </p>

            <h2 className="text-5xl md:text-7xl font-black mt-5 leading-tight">
              Focus better. Study together. Level up.
            </h2>

            <p className="text-gray-300 mt-6 text-lg max-w-xl">
              FocusFlow combines focus sessions, study rooms, chat, XP, and streaks into one clean student productivity app.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => navigate("/auth")}
                className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4"
              >
                Get Started
              </button>

              <button
                onClick={() => navigate("/auth")}
                className="btn bg-white/10 px-8 py-4"
              >
                Join Study Room
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-[36px] p-6 md:p-8"
          >
            <div className="card">
              <p className="text-gray-400">Current Level</p>
              <h3 className="text-6xl font-black mt-3">12</h3>
              <div className="mt-6 h-4 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[72%] bg-gradient-to-r from-blue-500 to-purple-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="card">
                <p className="text-gray-400">Focus</p>
                <h3 className="text-3xl font-black mt-2">2.5h</h3>
              </div>

              <div className="card">
                <p className="text-gray-400">Streak</p>
                <h3 className="text-3xl font-black mt-2">8 days</h3>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mt-20">
          <div className="card">
            <h3 className="text-2xl font-black">Focus Timer</h3>
            <p className="text-gray-400 mt-3">Deep work sessions with XP rewards.</p>
          </div>

          <div className="card">
            <h3 className="text-2xl font-black">Study Rooms</h3>
            <p className="text-gray-400 mt-3">Create rooms and chat with classmates.</p>
          </div>

          <div className="card">
            <h3 className="text-2xl font-black">Progress System</h3>
            <p className="text-gray-400 mt-3">Levels, XP, streaks, and leaderboards.</p>
          </div>
        </section>
      </main>
    </div>
  )
}