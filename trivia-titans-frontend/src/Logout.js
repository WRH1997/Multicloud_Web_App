import { getAuth, signOut } from "firebase/auth";
import firebaseClient from "./firebase";

export class Logout {
    function

    logoutUser() {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }
}