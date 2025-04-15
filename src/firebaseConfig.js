// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyDzktm5Va0oQxPIE21B0FMj5F_nM_XQeao",
  authDomain: "barmango-ddf27.firebaseapp.com",
  databaseURL: "https://barmango-ddf27-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "barmango-ddf27",
  storageBucket: "barmango-ddf27.firebasestorage.app",
  messagingSenderId: "726452001427",
  appId: "1:726452001427:web:7e1fc24f3e2ece72374b66",
  measurementId: "G-PTE6363ELH"
};

// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
