import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGroup, addRegisteredParticipant, addGuestParticipant } from "../services/groupService";

export interface Participant {
  id: string;
  type: "registrat" | "convidat";
  name: string;
  email?: string;
}

export function useCreateGroup(userId: string | undefined) {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);

  const addParticipant = (participant: Participant) => {
    setParticipants([...participants, participant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const createGroupWithParticipants = async (userDisplayName: string, userEmail: string) => {
    if (!groupName.trim() || !userId || participants.length < 2) return;

    try {
      setLoading(true);
      
      // Crear el grup
      const groupId = await createGroup(groupName, userId);

      // Afegir el creador com a participant registrat
      await addRegisteredParticipant(groupId, userId, userDisplayName, userEmail);

      // Afegir participants
      for (const participant of participants) {
        if (participant.type === "registrat" && participant.email) {
          await addRegisteredParticipant(groupId, participant.id, participant.name, participant.email);
        } else {
          await addGuestParticipant(groupId, participant.name);
        }
      }

      navigate("/projectes");
    } catch (error) {
      console.error("Error en la creació del grup:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    groupName,
    setGroupName,
    participants,
    addParticipant,
    removeParticipant,
    createGroupWithParticipants,
    loading
  };
}