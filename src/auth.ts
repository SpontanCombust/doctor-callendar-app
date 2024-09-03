import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";


export async function logIn() {
    try {
        await signInWithPopup(auth, new GoogleAuthProvider());
    } catch(err) {
        console.log("Sign-in error: " + err)
    }
}

export async function logOut() {
    try {
        await auth.signOut();
    } catch(err) {
        console.log("Sign-out error: " + err)
    }
}
