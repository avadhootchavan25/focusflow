import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"

export default function Signup() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("Fill all fields")
      return
    }

    try {
      setLoading(true)

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      await updateProfile(userCredential.user, {
        displayName: username.trim(),
      })

      localStorage.setItem("focusflow_username", username.trim())
      localStorage.setItem("focusflow_avatar", "🧠")

      toast.success("Account created")
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
        onSubmit={handleSignup}
        className="relative z-10 glass rounded-[36px] p-8 w-full max-w-md"
      >
        <p className="text-blue-300 font-bold uppercase text-sm">FocusFlow</p>
        <h1 className="text-4xl font-black mt-3">Create account</h1>
        <p className="text-gray-400 mt-2">Start your study flow.</p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full mt-6"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full mt-4"
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
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-gray-400 text-sm mt-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-300 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}