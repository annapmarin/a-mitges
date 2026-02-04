import { 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore"
import { db } from "../config/firebase"

export const createGroup = async (groupName: string, creatorId: string) => {
  try {
    const groupRef = await addDoc(collection(db, "grups"), {
      name: groupName,
      creatorId: creatorId,
      createdAt: serverTimestamp()
    })

    console.log("Grup creat amb ID:", groupRef.id)
    return groupRef.id
  } catch (error) {
    console.error("Error creant el grup:", error)
    throw error
  }
}

// Afegir participants registrats amb Google
export const addRegisteredParticipant = async (
  groupId: string,
  userId: string,
  name: string,
  email: string
) => {
  try {
    const participantRef = await addDoc(
      collection(db, "grups", groupId, "participants"),
      {
        type: "registrat",
        userId,
        name,
        email,
        createdAt: serverTimestamp()
      }
    )

    console.log("Participant registrat afegit amb ID:", participantRef.id)
    return participantRef.id

  } catch (error) {
    console.error("Error afegint participant registrat:", error)
    throw error
  }
}

// Afegir participants no registrats (fantasma)
export const addGuestParticipant = async (
  groupId: string,
  name: string
) => {
  try {
    const particpantRef = await addDoc(
      collection(db, "grups", groupId, "participants"),
      {
        type: "guest",
        name,
        createdAt: serverTimestamp()
      }
    )

    console.log("Participant no registrat afegit amb ID:", particpantRef.id)
    return particpantRef.id

  } catch (error) {
    console.error("Error afegint participant no registrat:", error)
    throw error
  }
}

// Obtenir grups d'usuari regiestrat
export const getUserGroups = async (userId: string) => {
  try {
    const q = query(
      collection(db, "grups"),
      where("creatorId", "==", userId)
    )

    const querySnapshot = await getDocs(q)
    const groups = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return groups
  } catch (error) {
    console.error("Error obtenint grups de l'usuari:", error)
    throw error
  }
}

// Obtenir participants d'un grup
export const getGroupParticipants = async (groupId: string) => {
  try {
    const participantsRef = collection(db, "grups", groupId, "participants");
    const querySnapshot = await getDocs(participantsRef);
    
    const participants = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.type === "registered" && data.userId ? data.userId : doc.id,
        docId: doc.id,
        ...data
      };
    });
    
    return participants;
  } catch (error) {
    console.error("Error en obtenir participants:", error);
    throw error;
  }
};

// Eliminar un grup
export const deleteGroup = async (groupId: string) => {
  try {
    // Eliminar tots els participants
    const participantsRef = collection(db, "grups", groupId, "participants");
    const participantsSnapshot = await getDocs(participantsRef);
    const participantDeletes = participantsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(participantDeletes);

    // Eliminar totes les despeses
    const expensesRef = collection(db, "grups", groupId, "expenses");
    const expensesSnapshot = await getDocs(expensesRef);
    const expenseDeletes = expensesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(expenseDeletes);

    // Finalment, eliminar el grup
    await deleteDoc(doc(db, "grups", groupId));
    console.log("Grup eliminat amb ID:", groupId);
  } catch (error) {
    console.error("Error eliminant el grup:", error);
    throw error;
  }
}