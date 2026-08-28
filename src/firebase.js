import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5TqM7umJYbrM3yjM6fs40fDx4yKG34qE",
  authDomain: "jansamadhan-5f6a7.firebaseapp.com",
  projectId: "jansamadhan-5f6a7",
  storageBucket: "jansamadhan-5f6a7.firebasestorage.app",
  messagingSenderId: "724579637840",
  appId: "1:724579637840:web:77efc54e4bd2b62c398f55",
  measurementId: "G-0XG7645YZ8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
