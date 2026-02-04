import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createExpense } from "../services/expenseService";

/**
 * Hook personalitzat per gestionar la creació d'una nova despesa dins d'un grup.
 * Proporciona l'estat i les funcions necessàries per a manejar el formulari de creació de despesa.
 * @param groupId - ID del grup al qual s'afegirà la despesa
 * @returns Object amb l'estat i les funcions per a crear una despesa
 */
export function useCreateExpense(groupId: string | undefined) {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Funció per a alternar la selecció d'un participant a l'hora de dividir la despesa
  const toggleParticipant = (participantId: string) => {
    if (splitBetween.includes(participantId)) {
      setSplitBetween(splitBetween.filter(id => id !== participantId));
    } else {
      setSplitBetween([...splitBetween, participantId]);
    }
  };

  // Funció per a inicialitzar els valors per defecte
  const initializeDefaults = (participants: any[], currentUserId: string) => {
    const currentUserParticipant = participants.find(p => p.userId === currentUserId);

    if (currentUserParticipant) {
      setPaidBy(currentUserParticipant.id);
    }

    setSplitBetween(participants.map(p => p.id));
  };

  // Funció per a manejar la creació de la despesa
  const handleCreateExpense = async () => {
    if (!groupId || !description.trim() || !amount || !paidBy || splitBetween.length === 0) {
      alert("Has d'omplir tots els camps");
      return;
    }

    try {
      setLoading(true);

      await createExpense({
        groupId: groupId,
        description,
        amount: parseFloat(amount),
        paidBy,
        splitBetween
      });

      navigate(`/group/${groupId}`);
    } catch (error) {
      console.error("Error creant la desepesa:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    description,
    setDescription,
    amount,
    setAmount,
    paidBy,
    setPaidBy,
    splitBetween,
    toggleParticipant,
    initializeDefaults,
    handleCreateExpense,
    loading
  };
}