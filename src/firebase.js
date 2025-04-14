import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzktm5Va0oQxPIE21B0FMj5F_nM_XQeao",
  authDomain: "barmango-ddf27.firebaseapp.com",
  projectId: "barmango-ddf27",
  storageBucket: "barmango-ddf27.appspot.com",
  messagingSenderId: "726452001427",
  appId: "1:726452001427:web:52fb9fc02931966f374b66",
  measurementId: "G-0Q9NE0VY0S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };