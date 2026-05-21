import { Link } from "react-router-dom"

export default function Navbar() {

  return (

    <div className="glass flex justify-between items-center px-8 py-4 rounded-3xl mb-10">

      <h1 className="text-3xl font-black text-blue-400">
        FocusFlow
      </h1>

      <div className="flex gap-4">

        <Link to="/dashboard">

          <button className="hover:text-blue-400 transition-all">
            Dashboard
          </button>

        </Link>

        <Link to="/focus">

          <button className="hover:text-blue-400 transition-all">
            Focus
          </button>

        </Link>

        <Link to="/groups">

          <button className="hover:text-blue-400 transition-all">
            Groups
          </button>

        </Link>

        <Link to="/ai">

          <button className="hover:text-blue-400 transition-all">
            AI Assistant
          </button>

        </Link>

      </div>

    </div>

  )
}