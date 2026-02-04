import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, deleteDoc } from "firebase/firestore"
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

// Crear una nova despesa
export const createExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
  try {
    const expenseRef = await addDoc(collection(db, "despeses"), {
      ...expense,
      createdAt: serverTimestamp()
    })
    return expenseRef.id
  } catch (error) {
    console.error("Error creant la despesa:", error)
    throw error
  }
}

// Obtenir les despeses d'un grup
export const getGroupExpenses = async (groupId: string) => {
  try {
    const expensesQuery = query(collection(db, "despeses"), where("groupId", "==", groupId))
    const querySnapshot = await getDocs(expensesQuery)
    const expenses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expense[]

    return expenses
  } catch (error) {
    console.error("Error obtenint les despeses del grup:", error)
    throw error
  }
}

// Eliminar una despesa
export const deleteExpense = async (expenseId: string) => {
  try {
    await deleteDoc(doc(db, "despeses", expenseId))
  } catch (error) {
    console.error("Error eliminant despesa:", error)
    throw error
  }
}