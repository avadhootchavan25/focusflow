import Navbar from "./Navbar"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"

export default function Layout({ children }) {

  const location = useLocation()

  return (
    <div className="min-h-screen bg-transparent text-white">

      <Navbar />

      <AnimatePresence mode="wait">

        <motion.main
          key={location.pathname}
          className="p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.main>

      </AnimatePresence>

    </div>
  )
}