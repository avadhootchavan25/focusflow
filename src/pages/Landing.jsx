import { Link } from "react-router-dom"

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden flex items-center justify-center text-white">

      <div className="absolute w-[500px] h-[500px] bg-blue-500/30 blur-[120px] rounded-full top-[-100px] left-[-100px]" />

      <div className="absolute w-[500px] h-[500px] bg-purple-500/30 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      <div className="glass p-12 rounded-3xl text-center relative z-10">

        <h1 className="text-7xl font-black text-blue-400 mb-4">
          FocusFlow
        </h1>

        <Link to="/dashboard">

  <button className="mt-8 bg-blue-500 px-8 py-4 rounded-2xl text-xl font-bold hover:scale-105 transition-all">
    Enter App
  </button>

</Link>

      </div>

    </div>
  )
}