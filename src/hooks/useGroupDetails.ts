import { useState, useEffect } from "react";
import { getGroupParticipants } from "../services/groupService";
import { getGroupExpenses } from "../services/expenseService";

export function useGroupDetails(groupId: string | undefined) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;
    loadGroupData();
  }, [groupId]);

  const loadGroupData = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      const [participantsData, expensesData] = await Promise.all([
        getGroupParticipants(groupId),
        getGroupExpenses(groupId)
      ]);

      setParticipants(participantsData);
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { participants, expenses, loading, refetch: loadGroupData };
}