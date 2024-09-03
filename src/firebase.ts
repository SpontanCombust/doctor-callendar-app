import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDtQMc6LO6kNIzrxwzqeJf7w52eCK5Xatg",
  authDomain: "callendar-app-37ce9.firebaseapp.com",
  projectId: "callendar-app-37ce9",
  storageBucket: "callendar-app-37ce9.appspot.com",
  messagingSenderId: "131338458802",
  appId: "1:131338458802:web:d3acbd04b493237afb1bab"
};

const app = initializeApp(firebaseConfig);


export function useFirestore() {
  return getFirestore(app);
}


const auth = getAuth(app);
auth.currentUser?.uid