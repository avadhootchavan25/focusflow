import { doc, setDoc } from "firebase/firestore"
import { db, auth } from "../firebase"

export const setOnline = async () => {
  const uid = auth.currentUser?.uid
  if (!uid) return

  await setDoc(doc(db, "status", uid), {
    state: "online",
    lastSeen: Date.now()
  })
}