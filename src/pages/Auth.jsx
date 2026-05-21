import { useState } from "react"
import { auth, db } from "../firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

export default function Auth() {
  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const cleanEmail = email.trim().toLowerCase()

  const friendlyError = (err) => {
    if (err.code === "auth/invalid-credential") {
      return "Invalid login. If you signed up with Google, use Continue with Google. Otherwise reset your password."
    }

    if (err.code === "auth/email-already-in-use") {
      return "This email already has an account. Try Login or Continue with Google."
    }

    if (err.code === "auth/weak-password") {
      return "Password should be at least 6 characters."
    }

    if (err.code === "auth/invalid-email") {
      return "Enter a valid email address."
    }

    if (err.code === "auth/missing-password") {
      return "Enter your password."
    }

    if (err.code === "auth/popup-closed-by-user") {
      return "Google sign-in was closed before finishing."
    }

    return err.message
  }

  const saveUser = async (user, name) => {
    const ref = doc(db, "users", user.uid)
    const snap = await getDoc(ref)

    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        email: user.email,
        username: name || user.email?.split("@")[0] || "Student",
        xp: 0,
        level: 1,
        sessions: 0,
        streak: 0,
        dailyFocusMinutes: 0,
        totalFocusMinutes: 0,
        createdAt: new Date(),
      })
    }
  }

  const handleEmailAuth = async () => {
    setError("")
    setMessage("")

    if (!cleanEmail) {
      setError("Enter your email.")
      return
    }

    if (!password) {
      setError("Enter your password.")
      return
    }

    try {
      if (mode === "signup") {
        if (!username.trim()) {
          setError("Enter a username.")
          return
        }

        const res = await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        )

        await saveUser(res.user, username.trim())
      } else {
        const res = await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        )

        await saveUser(res.user)
      }

      navigate("/dashboard")
    } catch (err) {
      setError(friendlyError(err))
    }
  }

  const handleGoogle = async () => {
    setError("")
    setMessage("")

    try {
      const provider = new GoogleAuthProvider()
      const res = await signInWithPopup(auth, provider)
      await saveUser(res.user)
      navigate("/dashboard")
    } catch (err) {
      setError(friendlyError(err))
    }
  }

  const resetPassword = async () => {
    setError("")
    setMessage("")

    if (!cleanEmail) {
      setError("Enter your email first, then click Forgot password.")
      return
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail)
      setMessage("Password reset email sent. Check your inbox.")
    } catch (err) {
      setError(friendlyError(err))
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-emerald-500/10" />
      <div className="absolute -top-32 left-10 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl" />

      <div className="relative z-10 grid lg:grid-cols-2 gap-8 max-w-6xl w-full">
        <section className="glass rounded-[36px] p-8 md:p-12 flex flex-col justify-center">
          <p className="text-blue-300 font-bold uppercase text-sm">
            FocusFlow
          </p>
          <h1 className="text-5xl md:text-7xl font-black mt-4 leading-tight">
            Study smarter with focus rooms.
          </h1>
          <p className="text-gray-300 mt-6 text-lg max-w-xl">
            Join groups, earn XP, complete sessions, and build a consistent study habit.
          </p>
        </section>

        <section className="glass rounded-[36px] p-8 md:p-10">
          <p className="text-blue-300 font-semibold">
            {mode === "login" ? "Welcome back" : "Create account"}
          </p>

          <h2 className="text-4xl font-black mt-2">
            {mode === "login" ? "Login" : "Sign up"}
          </h2>

          <div className="mt-8 space-y-4">
            {mode === "signup" && (
              <input
                className="w-full"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}

            <input
              className="w-full"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <input
                className="w-full pr-24"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-300 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {mode === "login" && (
              <button
                onClick={resetPassword}
                className="text-sm text-blue-300 hover:text-white"
              >
                Forgot password?
              </button>
            )}

            {error && (
              <p className="text-red-300 text-sm bg-red-500/10 border border-red-500/20 rounded-2xl p-3">
                {error}
              </p>
            )}

            {message && (
              <p className="text-emerald-300 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3">
                {message}
              </p>
            )}

            <button
              onClick={handleEmailAuth}
              className="btn w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4"
            >
              {mode === "login" ? "Login" : "Create Account"}
            </button>

            <button
              onClick={handleGoogle}
              className="btn w-full bg-white/10 text-white py-4"
            >
              Continue with Google
            </button>

            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login")
                setError("")
                setMessage("")
              }}
              className="w-full text-gray-300 hover:text-white"
            >
              {mode === "login"
                ? "Need an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}