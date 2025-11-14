import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8to19P4MHWZ3Tu08FMJzI0n5PoKUsa1g",
  authDomain: "fintrack-4c319.firebaseapp.com",
  projectId: "fintrack-4c319",
  storageBucket: "fintrack-4c319.firebasestorage.app",
  messagingSenderId: "618666620129",
  appId: "1:618666620129:web:2586b93424922a91a773a0",
  measurementId: "G-2JMR4VC54V"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();