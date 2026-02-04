import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { db } from "../config/firebase"

export interface Expense {
  id?: string
  groupId: string
  description: string
  amount: number
  paidBy: string
  splitBetween: string[]
  createdAt: any
}

export const createExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
  try {
    const expenseRef = await addDoc(collection(db, "despeses"), {
      ...expense,
      createdAt: serverTimestamp()
    });
    return expenseRef.id;
  } catch (error) {
    console.error("Error creant la despesa:", error);
    throw error;
  }
};

export const getGroupExpenses = async (groupId: string) => {
  try {
    const expensesQuery = query(collection(db, "despeses"), where("groupId", "==", groupId))
    const querySnapshot = await getDocs(expensesQuery);
    const expenses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expense[];

    return expenses
  } catch (error) {
    console.error("Error obtenint les despeses del grup:", error);
    throw error;
  }
}