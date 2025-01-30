import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvCxGmDgjafYxyloTHYAjdht9rmNTyrMY",
  authDomain: "expense-manage-ab7e3.firebaseapp.com",
  projectId: "expense-manage-ab7e3",
  storageBucket: "expense-manage-ab7e3.firebasestorage.app",
  messagingSenderId: "493669047593",
  appId: "1:493669047593:web:0cb623bb04a0830c496b38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
