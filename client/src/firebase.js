// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-bf452.firebaseapp.com",
  projectId: "mern-auth-bf452",
  storageBucket: "mern-auth-bf452.firebasestorage.app",
  messagingSenderId: "493058285678",
  appId: "1:493058285678:web:a0b4e235715d803bcd467f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);