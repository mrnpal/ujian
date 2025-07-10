import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD63Gm7XPlvNuXp4wKOcjA6Fs0laC_0mRU",
  authDomain: "busfa-app.firebaseapp.com",
  projectId: "busfa-app",
  storageBucket: "busfa-app.firebasestorage.app",
  messagingSenderId: "407653069181",
  appId: "1:407653069181:web:ee1df0bbd4a40a66491c14",
  measurementId: "G-LWH97HPHT9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };