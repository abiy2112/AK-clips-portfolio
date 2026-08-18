import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAn3tduL0lFidTeT7nIUi7T9AiOo5u89pU",
  authDomain: "akclipps-e70a0.firebaseapp.com",
  projectId: "akclipps-e70a0",
  storageBucket: "akclipps-e70a0.firebasestorage.app",
  messagingSenderId: "398771838717",
  appId: "1:398771838717:web:a32636df9c49fa25ad6894",
  measurementId: "G-DRT1QQWF05",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
