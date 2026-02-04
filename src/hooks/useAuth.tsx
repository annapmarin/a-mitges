import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { saveUser } from "../services/userService";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser?.uid && currentUser?.email) {
        try {
          await saveUser(
            currentUser.uid,
            currentUser.email,
            currentUser.displayName || "Usuario"
          );
        } catch (error) {
          console.error("Error guardant usuari a Firestore:", error);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}