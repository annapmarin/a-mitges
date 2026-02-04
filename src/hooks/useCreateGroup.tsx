import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGroup, addRegisteredParticipant, addGuestParticipant } from "../services/groupService";

export interface Participant {
  id: string;
  type: "registrat" | "convidat";
  name: string;
  email?: string;
}

/**
 * Hook personalitzat per gestionar la creació d'un nou grup i els seus participants.
 * Proporciona l'estat i les funcions necessàries per a manejar el formulari de creació de grup.
 * @param userId 
 * @returns Object amb l'estat i les funcions per a crear un grup
 */
export function useCreateGroup(userId: string | undefined) {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);

  const addParticipant = (participant: Participant) => {
    setParticipants((prev) => {
      if (prev.some(p => p.id === participant.id)) return prev
      return [...prev, participant]
    });
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const createGroupWithParticipants = async (userDisplayName: string, userEmail: string) => {
    if (!groupName.trim() || !userId || participants.length < 1) return;

    try {
      setLoading(true);
      
      // Crear el grup
      const groupId = await createGroup(groupName, userId);

      // Afegir el creador com a participant registrat
      await addRegisteredParticipant(groupId, userId, userDisplayName, userEmail);

      // Afegir participants
      for (const participant of participants) {
        if (participant.id === userId) continue;

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