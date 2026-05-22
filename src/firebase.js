import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDYoAABuQjsHOoJlPzV6Nyw2LVQuBRA-2w",
  authDomain: "focusflow-6759c.firebaseapp.com",
  projectId: "focusflow-6759c",
  storageBucket: "focusflow-6759c.firebasestorage.app",
  messagingSenderId: "30067672214",
  appId: "1:30067672214:web:0811d5bbd8b316ecf46eb7",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)