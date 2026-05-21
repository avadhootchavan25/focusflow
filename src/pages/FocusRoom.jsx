import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { addXP } from "../utils/xp"

export default function FocusRoom() {
  const presets = [
    { label: "25 min", value: 25 * 60, xp: 25 },
    { label: "45 min", value: 45 * 60, xp: 45 },
    { label: "60 min", value: 60 * 60, xp: 60 },
  ]

  const [selected, setSelected] = useState(presets[0])
  const [seconds, setSeconds] = useState(presets[0].value)
  const [running, setRunning] = useState(false)
  const [earnedXP, setEarnedXP] = useState(0)
  const [sessions, setSessions] = useState(0)

  useEffect(() => {
    if (!running) return

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setRunning(false)
          addXP(selected.xp)
          setEarnedXP((x) => x + selected.xp)
          setSessions((s) => s + 1)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [running, selected])

  const progress = useMemo(() => {
    return Math.max(0, Math.min(100, ((selected.value - seconds) / selected.value) * 100))
  }, [seconds, selected])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  const choosePreset = (preset) => {
    setSelected(preset)
    setSeconds(preset.value)
    setRunning(false)
  }

  const resetTimer = () => {
    setRunning(false)
    setSeconds(selected.value)
  }

  return (
    <div className="relative min-h-[calc(100vh-120px)] overflow-hidden rounded-[32px] p-6 md:p-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-emerald-500/10" />
      <div className="absolute -top-32 left-10 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl" />

      <div className="relative z-10 grid xl:grid-cols-[1fr_360px] gap-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[32px] p-8 md:p-12 min-h-[620px] flex flex-col items-center justify-center text-center"
        >
          <p className="text-blue-300 font-bold tracking-wide uppercase text-sm">
            Premium Focus Mode
          </p>

          <h1 className="text-4xl md:text-6xl font-black mt-3">
            Lock in your session
          </h1>

          <p className="text-gray-300 mt-4 max-w-xl">
            Pick a session, start the timer, and earn XP when you complete focused study.
          </p>

          <div className="flex gap-3 mt-8 flex-wrap justify-center">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => choosePreset(preset)}
                className={`btn px-6 py-3 ${
                  selected.label === preset.label
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <motion.div
            animate={running ? { scale: [1, 1.03, 1] } : { scale: 1 }}
            transition={{ repeat: running ? Infinity : 0, duration: 2 }}
            className="relative mt-10 h-[320px] w-[320px] md:h-[380px] md:w-[380px] rounded-full p-3"
            style={{
              background: `conic-gradient(#60a5fa ${progress}%, rgba(255,255,255,0.10) ${progress}%)`,
            }}
          >
            <div className="h-full w-full rounded-full bg-[#070711]/90 border border-white/10 flex items-center justify-center shadow-2xl">
              <div>
                <p className="text-gray-400 text-sm">Focus Timer</p>
                <h2 className="text-6xl md:text-7xl font-black mt-3 tracking-tight">
                  {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                </h2>
                <p className="text-blue-300 mt-4 font-semibold">
                  {Math.round(progress)}% complete
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex gap-4 mt-10 flex-wrap justify-center">
            <button
              onClick={() => setRunning(!running)}
              className="btn px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              {running ? "Pause Session" : "Start Session"}
            </button>

            <button
              onClick={resetTimer}
              className="btn px-8 py-4 bg-white/10 text-white"
            >
              Reset
            </button>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          <div className="card">
            <p className="text-gray-400">Session Reward</p>
            <h3 className="text-5xl font-black mt-3">+{selected.xp}</h3>
            <p className="text-blue-300 mt-2">XP on completion</p>
          </div>

          <div className="card">
            <p className="text-gray-400">XP Earned</p>
            <h3 className="text-5xl font-black mt-3">{earnedXP}</h3>
          </div>

          <div className="card">
            <p className="text-gray-400">Sessions Done</p>
            <h3 className="text-5xl font-black mt-3">{sessions}</h3>
          </div>

          <div className="card">
            <p className="text-gray-400">Focus Rule</p>
            <p className="text-xl font-bold mt-3">
              One tab. One task. No switching.
            </p>
          </div>
        </motion.aside>
      </div>
    </div>
  )
}