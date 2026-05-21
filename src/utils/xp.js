import { db, auth } from "../firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export async function getUserXP() {
  const user = auth.currentUser
  if (!user) return null

  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    const data = {
      uid: user.uid,
      email: user.email,
      username: user.email?.split("@")[0] || "Student",
      xp: 0,
      level: 1,
      sessions: 0,
      dailyFocusMinutes: 0,
      totalFocusMinutes: 0,
      lastFocusDate: null,
    }

    await setDoc(ref, data, { merge: true })
    return data
  }

  const data = snap.data()

  return {
    xp: data.xp || 0,
    level: data.level || 1,
    sessions: data.sessions || 0,
    dailyFocusMinutes: data.dailyFocusMinutes || 0,
    totalFocusMinutes: data.totalFocusMinutes || 0,
    lastFocusDate: data.lastFocusDate || null,
  }
}

export async function addXP(amount) {
  const user = auth.currentUser
  if (!user) return

  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)

  let data = {
    uid: user.uid,
    email: user.email,
    username: user.email?.split("@")[0] || "Student",
    xp: 0,
    level: 1,
    sessions: 0,
  }

  if (snap.exists()) data = { ...data, ...snap.data() }

  let xp = data.xp || 0
  let level = data.level || 1

  xp += amount

  while (xp >= level * 100) {
    xp -= level * 100
    level += 1
  }

  await setDoc(ref, { ...data, xp, level, updatedAt: new Date() }, { merge: true })
}

export async function completeFocusSession(minutes) {
  const user = auth.currentUser
  if (!user) return

  const today = new Date().toISOString().split("T")[0]
  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)

  let data = {
    sessions: 0,
    dailyFocusMinutes: 0,
    totalFocusMinutes: 0,
    lastFocusDate: null,
  }

  if (snap.exists()) data = { ...data, ...snap.data() }

  const sameDay = data.lastFocusDate === today

  await setDoc(
    ref,
    {
      sessions: (data.sessions || 0) + 1,
      dailyFocusMinutes: sameDay
        ? (data.dailyFocusMinutes || 0) + minutes
        : minutes,
      totalFocusMinutes: (data.totalFocusMinutes || 0) + minutes,
      lastFocusDate: today,
      updatedAt: new Date(),
    },
    { merge: true }
  )
}

export async function addSession() {
  const user = auth.currentUser
  if (!user) return

  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)

  let sessions = 0
  if (snap.exists()) sessions = snap.data().sessions || 0

  await setDoc(ref, { sessions: sessions + 1, updatedAt: new Date() }, { merge: true })
}