import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createExpense } from "../services/expenseService";

export function useCreateExpense(groupId: string | undefined) {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleParticipant = (participantId: string) => {
    if (splitBetween.includes(participantId)) {
      setSplitBetween(splitBetween.filter(id => id !== participantId));
    } else {
      setSplitBetween([...splitBetween, participantId]);
    }
  };

  const initializeDefaults = (participants: any[], currentUserId: string) => {
    const currentUserParticipant = participants.find(p => p.userId === currentUserId);
    
    if (currentUserParticipant) {
      setPaidBy(currentUserParticipant.id);
    }

    setSplitBetween(participants.map(p => p.id));
  };

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