import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Configurações do Firebase - O usuário pode preencher aqui ou usar variáveis de ambiente
  // Por agora, configuramos a estrutura básica
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "tiktok-hunter.firebaseapp.com",
  projectId: "tiktok-hunter",
  storageBucket: "tiktok-hunter.appspot.com",
  messagingSenderId: "338947230489", // Placeholder, o usuário ajustará se necessário
  appId: "1:338947230489:web:c847d47d47d47d47d47d" // Placeholder
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
