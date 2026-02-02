
import { useState } from "react"
import { signOut } from "firebase/auth"
import { auth } from "../config/firebase"
import { useNavigate } from "react-router-dom";
import '../styles/navbar.css';

export function Navbar({ user }: { user: any }) {
  const [showNav, setShowNav] = useState(false);
  const navigate = useNavigate();

  const firstName = 
    user?.displayName?.split?.(" ")[0] ?? "Usuari";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error durant la desconnexió:", error);
    }
  }

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="/logo.svg" alt="A mitges Logo" className="logo" />
        <span>A mitges</span>
      </div>
      <div className="user-menu">
        <button 
          className="user-button"
          onClick={() => setShowNav(!showNav)}
        >
          <img src={user.photoURL} alt={user.displayName} />
          <span>{firstName}</span>
        </button>
        
        {showNav && (
          <div className="dropdown-menu">
            <button onClick={handleLogout}>
              Tancar sessió
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}