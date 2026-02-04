import { useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useCreateGroup } from "../hooks/useCreateGroup"
import { Navbar } from "../components/Navbar"
import { AddParticipantForm } from "../components/AddParticipantForm"
import { ParticipantsList } from "../components/ParticipantsList"
import { Button } from "../components/Button"
import "../styles/create-group-page.css"

export default function CreateGroupPage() {
  const { user } = useAuth()
  const {
    groupName,
    setGroupName,
    participants,
    addParticipant,
    removeParticipant,
    createGroupWithParticipants,
    loading
  } = useCreateGroup(user?.uid)

  useEffect(() => {
    if (user && participants.length === 0) {
      addParticipant({
        id: user.uid,
        type: "registrat",
        name: user.displayName || "Tu",
        email: user.email || ""
      })
    }
  }, [user])

  const handleCreate = () => {
    if (!user) return
    createGroupWithParticipants(user.displayName || "Tu", user.email || "")
  }

  return (
    <>
      {user && <Navbar user={user} />}
      <div className="create-group-page">
        <h1>Crear nou grup</h1>

        <input
          type="text"
          placeholder="Nom del grup"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="group-name-input"
        />

        <AddParticipantForm onAdd={addParticipant} />

        <ParticipantsList 
          participants={participants}
          onRemove={removeParticipant}
          currentUserId={user?.uid}
        />

        <Button
          label={loading ? "Creant..." : "Crear grup"}
          onClick={handleCreate}
          disabled={!groupName.trim() || loading}
          fullWidth
        />
      </div>
    </>
  )
}