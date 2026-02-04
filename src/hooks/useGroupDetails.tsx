import { useState, useEffect } from "react";
import { getGroupParticipants, getGroupById } from "../services/groupService";
import { getGroupExpenses } from "../services/expenseService";

export function useGroupDetails(groupId: string | undefined) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState<string>("");

  useEffect(() => {
    if (!groupId) return;
    loadGroupData();
  }, [groupId]);

  const loadGroupData = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      const [participantsData, expensesData, groupData] = await Promise.all([
        getGroupParticipants(groupId),
        getGroupExpenses(groupId),
        getGroupById(groupId)
      ]);

      setParticipants(participantsData);
      setExpenses(expensesData);
      setGroupName(groupData?.name || "");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { participants, expenses, loading, groupName, refetch: loadGroupData };
}