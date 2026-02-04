import { 
  collection, 
  doc,
  setDoc,
  query,
  where,
  getDocs 
} from "firebase/firestore"
import { db } from "../config/firebase"

export const saveUser = async (userId: string, email: string, displayName: string) => {
  try {
    await setDoc(doc(db, "users", userId), {
      email: email.toLowerCase().trim(),
      displayName,
      createdAt: new Date()
    }, { merge: true })
    
    console.log("Usuari guardat:", email)
  } catch (error) {
    console.error("Error guardant usuari:", error)
    throw error
  }
}

export const findUserByEmail = async (email: string) => {
  try {
    const q = query(
      collection(db, "users"),
      where("email", "==", email.toLowerCase().trim())
    )
    
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return null
    }
    
    const userDoc = querySnapshot.docs[0]
    return {
      id: userDoc.id,
      ...userDoc.data()
    }
  } catch (error) {
    console.error("Error buscant usuari per email:", error)
    throw error
  }
}
