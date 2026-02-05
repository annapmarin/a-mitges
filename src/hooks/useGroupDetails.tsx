import { useState, useEffect } from "react";
import { getGroupParticipants, getGroupById } from "../services/groupService";
import { getGroupExpenses } from "../services/expenseService";

/**
 * Hook personalitzat per gestionar la càrrega de les dades d'un grup específic.
 * Obté els participants, les despeses i el nom del grup a partir de l'ID del grup.
 * @param groupId 
 * @returns Object amb les dades del grup i una funció per recarregar les dades
 */
export function useGroupDetails(groupId: string | undefined) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState<string>("");
  const [group, setGroup] = useState<any | null>(null);

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
      setGroup(groupData || null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { participants, expenses, loading, groupName, group, refetch: loadGroupData };
}