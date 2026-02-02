import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDD-PRfYcTYaPQE-1-bUgnCr2MkhpGDMIo",
  authDomain: "a-mitges.firebaseapp.com",
  projectId: "a-mitges",
  storageBucket: "a-mitges.firebasestorage.app",
  messagingSenderId: "485409285414",
  appId: "1:485409285414:web:19b68110b4e8b350c64de7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);