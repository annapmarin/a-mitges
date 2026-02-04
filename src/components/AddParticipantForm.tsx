import { useState } from "react"
import type { Participant } from "../hooks/useCreateGroup"
import { findUserByEmail } from "../services/userService"

interface addParticipantFormProps {
  onAdd: (participant: Participant) => void;
}

export function AddParticipantForm({ onAdd }: addParticipantFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isRegistered, setIsRegistered] = useState(false)
  const [searching, setSearching] = useState(false)
  const [foundUserId, setFoundUserId] = useState<string | null>(null)

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value
    setEmail(emailValue)

    // Buscar usuario si el email es válido
    if (emailValue.includes("@") && emailValue.includes(".")) {
      setSearching(true)
      try {
        const user = await findUserByEmail(emailValue)
        
        if (user) {
          // Usuario encontrado - prellenar datos y marcar como registrado
          setName((user as { displayName?: string }).displayName ?? "")
          setIsRegistered(true)
          setFoundUserId(user.id)
        } else {
          // Usuario no encontrado - desmarcar registrado
          setIsRegistered(false)
          setFoundUserId(null)
        }
      } catch (error) {
        console.error("Error buscant usuari:", error)
        setIsRegistered(false)
        setFoundUserId(null)
      } finally {
        setSearching(false)
      }
    } else {
      setIsRegistered(false)
      setFoundUserId(null)
    }
  }

  const handleAdd = () => {
    if (!name.trim()) return

    const newParticipant: Participant = {
      id: isRegistered && foundUserId ? foundUserId : Date.now().toString(),
      type: isRegistered ? "registrat" : "convidat",
      name: name.trim(),
      ...(isRegistered && { email: email.trim() })
    }

    onAdd(newParticipant)
    setName("")
    setEmail("")
    setIsRegistered(false)
    setFoundUserId(null)
  }

  return (
    <div className="add-participant-section">
      <h2>Afegir participants</h2>
      
      <input
        type="email"
        placeholder="Email (opcional)"
        value={email}
        onChange={handleEmailChange}
      />
      
      {searching && <p className="searching-text">Buscant usuari...</p>}
      
      {isRegistered && <p className="registered-text">✓ Usuari registrat trobat</p>}

      <input
        type="text"
        placeholder="Nom del participant"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={searching}
      />

      <button onClick={handleAdd} disabled={searching}>+ Afegir</button>
    </div>
  )
}