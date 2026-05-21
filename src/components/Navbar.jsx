import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const go = (path) => {
    navigate(path)
    setOpen(false)
  }

  const item = (path) =>
    location.pathname === path
      ? "bg-white/15 text-white"
      : "text-gray-300 hover:bg-white/10 hover:text-white"

  return (
    <nav className="sticky top-0 z-50 px-4 md:px-6 py-4">
      <div className="glass rounded-[28px] px-5 py-3 flex items-center justify-between">
        <button onClick={() => go("/dashboard")} className="text-left">
          <h1 className="text-xl font-black tracking-tight">FocusFlow</h1>
          <p className="text-xs text-gray-400">study smarter together</p>
        </button>

        <div className="hidden md:flex items-center gap-2">
          <button onClick={() => go("/dashboard")} className={`px-4 py-2 rounded-2xl ${item("/dashboard")}`}>Dashboard</button>
          <button onClick={() => go("/focus")} className={`px-4 py-2 rounded-2xl ${item("/focus")}`}>Focus</button>
          <button onClick={() => go("/groups")} className={`px-4 py-2 rounded-2xl ${item("/groups")}`}>Groups</button>
          <button onClick={() => go("/notes")} className={`px-4 py-2 rounded-2xl ${item("/notes")}`}>Notes</button>
          <button onClick={() => go("/titi-ai")} className={`px-4 py-2 rounded-2xl ${item("/titi-ai")}`}>Titi AI</button>
          <button onClick={() => go("/leaderboard")} className={`px-4 py-2 rounded-2xl ${item("/leaderboard")}`}>Leaderboard</button>
          <button onClick={() => go("/profile")} className={`px-4 py-2 rounded-2xl ${item("/profile")}`}>Profile</button>
        </div>

        <div className="relative md:hidden">
          <button onClick={() => setOpen(!open)} className="btn bg-white/10">
            Menu
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-60 glass rounded-3xl p-3 shadow-2xl border border-white/10">
              <button onClick={() => go("/dashboard")} className={`w-full text-left px-4 py-3 rounded-2xl ${item("/dashboard")}`}>Dashboard</button>
              <button onClick={() => go("/focus")} className={`w-full text-left px-4 py-3 rounded-2xl ${item("/focus")}`}>Focus Room</button>
              <button onClick={() => go("/groups")} className={`w-full text-left px-4 py-3 rounded-2xl ${item("/groups")}`}>Study Groups</button>
              <button onClick={() => go("/notes")} className={`w-full text-left px-4 py-3 rounded-2xl ${item("/notes")}`}>Notes</button>
              <button onClick={() => go("/titi-ai")} className={`w-full text-left px-4 py-3 rounded-2xl ${item("/titi-ai")}`}>Titi AI</button>
              <button onClick={() => go("/leaderboard")} className={`w-full text-left px-4 py-3 rounded-2xl ${item("/leaderboard")}`}>Leaderboard</button>
              <button onClick={() => go("/profile")} className={`w-full text-left px-4 py-3 rounded-2xl ${item("/profile")}`}>Profile</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}