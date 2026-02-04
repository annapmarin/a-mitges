import { useState } from "react"
import type { Participant } from "../hooks/useCreateGroup"

interface addParticipantFormProps {
  onAdd: (participant: Participant) => void;
}

export function AddParticipantForm({ onAdd }: addParticipantFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isRegistered, setIsRegistered] = useState(false)

  const handleAdd = () => {
    if (!name.trim()) return

    const newParticipant: Participant = {
      id: Date.now().toString(),
      type: isRegistered ? "registrat" : "convidat",
      name: name.trim(),
      ...(isRegistered && { email: email.trim() })
    }

    onAdd(newParticipant)
    setName("")
    setEmail("")
    setIsRegistered(false)
  }

  return (
    <div className="add-participant-section">
      <h2>Afegir participants</h2>
      
      <input
        type="text"
        placeholder="Nom del participant"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={isRegistered}
          onChange={(e) => setIsRegistered(e.target.checked)}
        />
        Usuari registrat
      </label>

      {isRegistered && (
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}

      <button onClick={handleAdd}>+ Afegir</button>
    </div>
  )
}