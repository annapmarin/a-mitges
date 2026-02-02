import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebase";
import { Button } from "./Button";

export function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuari autenticat:", result.user);
    } catch (error) {
      console.error("Error durant l'autenticació amb Google:", error);
    }
  }

  return (
    <Button label="Continuar amb Google" onClick={handleGoogleLogin} fullWidth />
  )
}