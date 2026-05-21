import { db, auth } from "../firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export function getToday() {
  return new Date().toISOString().split("T")[0]
}

export function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split("T")[0]
}

export async function getUserStreak() {
  const user = auth.currentUser
  if (!user) return { streak: 0, lastStudyDate: null }

  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    return { streak: 0, lastStudyDate: null }
  }

  const data = snap.data()

  return {
    streak: data.streak || 0,
    lastStudyDate: data.lastStudyDate || null,
  }
}

export async function updateStreak() {
  const user = auth.currentUser
  if (!user) return

  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)

  const today = getToday()
  const yesterday = getYesterday()

  let data = {
    streak: 0,
    lastStudyDate: null,
  }

  if (snap.exists()) {
    data = {
      ...data,
      ...snap.data(),
    }
  }

  if (data.lastStudyDate === today) return

  let newStreak = 1

  if (data.lastStudyDate === yesterday) {
    newStreak = (data.streak || 0) + 1
  }

  await setDoc(
    ref,
    {
      streak: newStreak,
      lastStudyDate: today,
      updatedAt: new Date(),
    },
    { merge: true }
  )
}