// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mmestate-15129.firebaseapp.com",
  projectId: "mmestate-15129",
  storageBucket: "mmestate-15129.appspot.com",
  messagingSenderId: "231468826795",
  appId: "1:231468826795:web:524f953ba21acc56b0f7ee",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
