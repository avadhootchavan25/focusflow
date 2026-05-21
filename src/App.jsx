import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import Landing from "./pages/Landing"
import Auth from "./pages/Auth"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import FocusRoom from "./pages/FocusRoom"
import StudyGroups from "./pages/StudyGroups"
import Notes from "./pages/Notes"
import AIStudyAssistant from "./pages/AIStudyAssistant"
import Leaderboard from "./pages/Leaderboard"
import ProfilePage from "./pages/ProfilePage"
import RoomChat from "./pages/RoomChat"

import Navbar from "./components/Navbar"

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-10">
        {children}
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Signup />} />

        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/focus" element={<AppLayout><FocusRoom /></AppLayout>} />
        <Route path="/groups" element={<AppLayout><StudyGroups /></AppLayout>} />
        <Route path="/groups/:roomId" element={<AppLayout><RoomChat /></AppLayout>} />
        <Route path="/notes" element={<AppLayout><Notes /></AppLayout>} />
        <Route path="/titi-ai" element={<AppLayout><AIStudyAssistant /></AppLayout>} />
        <Route path="/study-assistant" element={<AppLayout><AIStudyAssistant /></AppLayout>} />
        <Route path="/leaderboard" element={<AppLayout><Leaderboard /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}