// Firebase configuration for JanSamadhan AI
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAee67lkzYG3HwHNJxv_6umMemzVfsUkjI",
  authDomain: "jansamadhan-ai.firebaseapp.com",
  databaseURL: "https://jansamadhan-ai-default-rtdb.firebaseio.com",
  projectId: "jansamadhan-ai",
  storageBucket: "jansamadhan-ai.firebasestorage.app",
  messagingSenderId: "140139536724",
  appId: "1:140139536724:web:31f4bf3fe918cd10af28c1",
  measurementId: "G-M4T0P073EL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
