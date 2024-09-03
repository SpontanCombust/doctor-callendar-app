import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
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


export const db = getFirestore(app);

// if we're testing the app locally, use the firebase testing suite
if (window.location.hostname === 'localhost') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

export const auth = getAuth(app);
