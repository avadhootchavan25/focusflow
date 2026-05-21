import Navbar from "../components/Navbar"
import { Flame, Brain, Trophy, Timer } from "lucide-react"

export default function Dashboard() {
  return (

    <div className="min-h-screen bg-[#050816] text-white p-8 relative overflow-hidden">

      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />

      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      <div className="relative z-10">

        <Navbar />

        <h1 className="text-5xl font-black mb-10">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="glass rounded-3xl p-6">

            <Timer size={40} className="text-blue-400 mb-4" />

            <h2 className="text-4xl font-black">
              6.2h
            </h2>

            <p className="text-gray-400 mt-2">
              Today's Study Time
            </p>

          </div>

          <div className="glass rounded-3xl p-6">

            <Flame size={40} className="text-orange-400 mb-4" />

            <h2 className="text-4xl font-black">
              12
            </h2>

            <p className="text-gray-400 mt-2">
              Day Streak
            </p>

          </div>

          <div className="glass rounded-3xl p-6">

            <Brain size={40} className="text-purple-400 mb-4" />

            <h2 className="text-4xl font-black">
              89%
            </h2>

            <p className="text-gray-400 mt-2">
              Focus Score
            </p>

          </div>

          <div className="glass rounded-3xl p-6">

            <Trophy size={40} className="text-yellow-400 mb-4" />

            <h2 className="text-4xl font-black">
              #4
            </h2>

            <p className="text-gray-400 mt-2">
              Leaderboard Rank
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}