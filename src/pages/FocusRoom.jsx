import { useEffect, useState } from "react"

export default function FocusRoom() {

  const [time, setTime] = useState(1500)
  const [running, setRunning] = useState(false)

  useEffect(() => {

    let interval

    if (running && time > 0) {

      interval = setInterval(() => {
        setTime((prev) => prev - 1)
      }, 1000)

    }

    return () => clearInterval(interval)

  }, [running, time])

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  return (

    <div className="min-h-screen bg-[#050816] flex items-center justify-center relative overflow-hidden text-white">

      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />

      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      <div className="glass rounded-3xl p-16 text-center relative z-10 w-[500px]">

        <h1 className="text-7xl font-black mb-10">

          {String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}

        </h1>

        <div className="flex justify-center gap-4">

          <button
            onClick={() => setRunning(true)}
            className="bg-blue-500 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all"
          >
            Start
          </button>

          <button
            onClick={() => setRunning(false)}
            className="bg-purple-500 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all"
          >
            Pause
          </button>

          <button
            onClick={() => {
              setRunning(false)
              setTime(1500)
            }}
            className="bg-red-500 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all"
          >
            Reset
          </button>

        </div>

      </div>

    </div>
  )
}