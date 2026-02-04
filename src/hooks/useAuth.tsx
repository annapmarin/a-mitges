import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { saveUser } from "../services/userService";

/**
 * Hook personalitzat per gestionar l'autenticació de l'usuari amb Firebase Authentication.
 * S'encarrega de detectar canvis en l'estat d'autenticació i guardar la informació de l'usuari a Firestore.
 * Retorna l'usuari actual i un indicador de càrrega.
 * @returns { user: any, loading: boolean }
 */
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