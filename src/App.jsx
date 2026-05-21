import { BrowserRouter, Routes, Route } from "react-router-dom"

import Landing from "./pages/Landing"
import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import FocusRoom from "./pages/FocusRoom"
import StudyGroups from "./pages/StudyGroups"
import RoomChat from "./pages/RoomChat"
import Leaderboard from "./pages/Leaderboard"
import Notes from "./pages/Notes"
import ProfilePage from "./pages/ProfilePage"
import TitiAI from "./pages/TitiAI"

import ProtectedRoute from "./components/ProtectedRoute"
import Layout from "./components/Layout"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/focus" element={<ProtectedRoute><Layout><FocusRoom /></Layout></ProtectedRoute>} />
        <Route path="/groups" element={<ProtectedRoute><Layout><StudyGroups /></Layout></ProtectedRoute>} />
        <Route path="/room/:roomId" element={<ProtectedRoute><Layout><RoomChat /></Layout></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Layout><Leaderboard /></Layout></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Layout><Notes /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
        <Route path="/titi-ai" element={<ProtectedRoute><Layout><TitiAI /></Layout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}