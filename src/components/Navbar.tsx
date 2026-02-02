
import { useState } from "react"
import { signOut } from "firebase/auth"
import { auth } from "../config/firebase"

export function Navbar({ user }: { user: any }) {
  const [showNav, setShowNav] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Usuari desconnectat");
    } catch (error) {
      console.error("Error durant la desconnexió:", error);
    }
  }

  return (
    <nav className="navbar">
      <div className="user-menu">
        <button 
          className="user-button"
          onClick={() => setShowNav(!showNav)}
        >
          <img src={user.photoURL} alt={user.displayName} />
          <span>{user.displayName}</span>
        </button>
        
        {showNav && (
          <div className="dropdown-menu">
            <button onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}