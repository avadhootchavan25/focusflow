import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../firebase"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"

export default function Auth() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error("Fill all fields")
      return
    }

    try {
      setLoading(true)

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user
      const username =
        user.displayName || user.email?.split("@")[0] || "Student"

      localStorage.setItem("focusflow_username", username)
      localStorage.setItem("focusflow_avatar", "🧠")

      await setDoc(
        doc(db, "users", user.uid),
        {
          username,
          email: user.email,
          avatar: localStorage.getItem("focusflow_avatar") || "🧠",
          xp: Number(localStorage.getItem("focusflow_xp")) || 0,
          focusMinutes:
            Number(localStorage.getItem("focusflow_focus_minutes")) || 0,
          sessions: Number(localStorage.getItem("focusflow_sessions")) || 0,
          streak: Number(localStorage.getItem("focusflow_streak")) || 0,
          lastLogin: new Date().toISOString(),
        },
        { merge: true }
      )

      toast.success("Logged in")
      navigate("/dashboard")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#07070c] text-white flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.22),transparent_35%)]" />

      <form
        onSubmit={handleLogin}
        className="relative z-10 glass rounded-[36px] p-8 w-full max-w-md"
      >
        <p className="text-blue-300 font-bold uppercase text-sm">FocusFlow</p>
        <h1 className="text-4xl font-black mt-3">Login</h1>
        <p className="text-gray-400 mt-2">Continue your study flow.</p>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full mt-6"
        />

        <div className="relative mt-4">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            className="w-full pr-20"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-300"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          disabled={loading}
          className="btn w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-gray-400 text-sm mt-5 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-300 font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}