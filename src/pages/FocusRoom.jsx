import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Timer, ShieldAlert } from "lucide-react"
import { auth, db } from "../firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export default function FocusRoom() {
  const [customMinutes, setCustomMinutes] = useState(25)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [distractions, setDistractions] = useState(0)
  const [lockMode, setLockMode] = useState(false)
  const [warning, setWarning] = useState(false)

  const intervalRef = useRef(null)

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const totalSeconds = Math.max(1, Number(customMinutes) || 25) * 60
  const progress = 100 - (secondsLeft / totalSeconds) * 100

  const saveProgress = async (mins) => {
    const completedMins = Number(mins) || Number(customMinutes) || 25

    const oldMinutes = Number(localStorage.getItem("focusflow_focus_minutes")) || 0
    const oldSessions = Number(localStorage.getItem("focusflow_sessions")) || 0
    const oldXP = Number(localStorage.getItem("focusflow_xp")) || 0
    const oldStreak = Number(localStorage.getItem("focusflow_streak")) || 0

    const newMinutes = oldMinutes + completedMins
    const newSessions = oldSessions + 1
    const newXP = oldXP + completedMins * 2
    const newStreak = Math.max(oldStreak, 1)

    localStorage.setItem("focusflow_focus_minutes", String(newMinutes))
    localStorage.setItem("focusflow_sessions", String(newSessions))
    localStorage.setItem("focusflow_xp", String(newXP))
    localStorage.setItem("focusflow_streak", String(newStreak))
    localStorage.setItem("focusflow_last_session", new Date().toISOString())

    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid)
      const snap = await getDoc(userRef)
      const oldData = snap.exists() ? snap.data() : {}

      await setDoc(
        userRef,
        {
          username:
            localStorage.getItem("focusflow_username") ||
            auth.currentUser.displayName ||
            auth.currentUser.email?.split("@")[0] ||
            "Student",
          avatar: localStorage.getItem("focusflow_avatar") || "🧠",
          xp: Number(oldData.xp || 0) + completedMins * 2,
          focusMinutes: Number(oldData.focusMinutes || 0) + completedMins,
          sessions: Number(oldData.sessions || 0) + 1,
          streak: Math.max(Number(oldData.streak || 0), 1),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      )
    }

    window.dispatchEvent(new Event("focusflow-stats-updated"))
  }

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      }
    } catch {}
  }

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } catch {}
  }

  const startTimer = async () => {
    const mins = Math.max(1, Number(customMinutes) || 25)
    setSecondsLeft(mins * 60)
    setRunning(true)
    setPaused(false)
    setLockMode(true)
    setWarning(false)
    await enterFullscreen()
  }

  const pauseTimer = async () => {
    setRunning(false)
    setPaused(true)
    setLockMode(false)
    setWarning(false)
    await exitFullscreen()
  }

  const resumeTimer = async () => {
    setRunning(true)
    setPaused(false)
    setLockMode(true)
    setWarning(false)
    await enterFullscreen()
  }

  const resetTimer = async () => {
    setRunning(false)
    setPaused(false)
    setLockMode(false)
    setWarning(false)
    setDistractions(0)
    setSecondsLeft((Number(customMinutes) || 25) * 60)
    await exitFullscreen()
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)

            const completedMins = Math.max(1, Number(customMinutes) || 25)

            setRunning(false)
            setPaused(false)
            setLockMode(false)
            setWarning(false)

            saveProgress(completedMins)
            exitFullscreen()

            return 0
          }

          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(intervalRef.current)
  }, [running, customMinutes])

  useEffect(() => {
    const handleVisibility = () => {
      if (lockMode && document.hidden) {
        setDistractions((prev) => prev + 1)
        setWarning(true)
        setRunning(false)
        setPaused(true)
      }
    }

    const blockLeave = (e) => {
      if (lockMode) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("beforeunload", blockLeave)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("beforeunload", blockLeave)
    }
  }, [lockMode])

  return (
    <div className="space-y-8">
      {warning && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4">
          <div className="glass rounded-[36px] p-8 max-w-lg text-center">
            <ShieldAlert className="mx-auto text-red-300" size={52} />
            <h2 className="text-4xl font-black mt-4">Focus broken</h2>
            <p className="text-gray-300 mt-3">
              You switched away from FocusFlow. Timer has been paused.
            </p>

            <button
              onClick={resumeTimer}
              className="btn mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              Resume Focus
            </button>
          </div>
        </div>
      )}

      <section className="glass rounded-[32px] p-8 md:p-12">
        <p className="text-blue-300 font-bold uppercase text-sm">Focus Room</p>
        <h1 className="text-4xl md:text-6xl font-black mt-3">
          Lock in your session.
        </h1>
        <p className="text-gray-300 mt-4">
          Start a focus timer. If you leave the tab, the timer pauses and counts it as a distraction.
        </p>
      </section>

      <section className="grid lg:grid-cols-[1fr_360px] gap-6">
        <motion.div className="glass rounded-[36px] p-8 text-center">
          <div className="mx-auto h-72 w-72 rounded-full border border-white/10 bg-white/10 flex items-center justify-center">
            <div>
              <p className="text-gray-400">Time Left</p>
              <h2 className="text-7xl font-black mt-2">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </h2>
              <p className="text-blue-300 mt-3">
                {lockMode ? "Focus Lock Active" : "Ready"}
              </p>
            </div>
          </div>

          <div className="mt-8 h-4 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {!running && !paused && (
              <button onClick={startTimer} className="btn bg-blue-500 text-white">
                <Play size={18} /> Start Focus
              </button>
            )}

            {running && (
              <button
                onClick={pauseTimer}
                className="btn bg-yellow-500/20 text-yellow-200"
              >
                <Pause size={18} /> Pause
              </button>
            )}

            {!running && paused && (
              <button
                onClick={resumeTimer}
                className="btn bg-emerald-500/20 text-emerald-200"
              >
                <Play size={18} /> Resume
              </button>
            )}

            <button onClick={resetTimer} className="btn bg-white/10 text-white">
              <RotateCcw size={18} /> Reset
            </button>
          </div>
        </motion.div>

        <aside className="space-y-5">
          <div className="card">
            <Timer className="text-blue-300" />
            <h3 className="text-2xl font-black mt-4">Custom Timer</h3>

            <input
              type="number"
              min="1"
              value={customMinutes}
              disabled={running}
              onChange={(e) => {
                const value = e.target.value
                setCustomMinutes(value)
                setSecondsLeft((Number(value) || 25) * 60)
              }}
              className="w-full mt-4"
              placeholder="Minutes"
            />
          </div>

          <div className="card">
            <h3 className="text-2xl font-black">Focus Stats</h3>
            <p className="text-gray-400 mt-3">Distractions this session</p>
            <p className="text-5xl font-black text-red-300 mt-2">
              {distractions}
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}