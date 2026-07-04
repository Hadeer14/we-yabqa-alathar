import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOtYmS6m10kjRRhxjd19bbwaeYGVNBaFg",
  authDomain: "webqa-alathar.firebaseapp.com",
  projectId: "webqa-alathar",
  storageBucket: "webqa-alathar.firebasestorage.app",
  messagingSenderId: "456435070024",
  appId: "1:456435070024:web:cade68383a9c981a6c947d",
  measurementId: "G-MC9KYZCL3F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);