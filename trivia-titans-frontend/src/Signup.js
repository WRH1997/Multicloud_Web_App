import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebaseClient from "./firebase";

export class Signup {
    function
    signupEmailPassword(email, password) {
        const auth = getAuth();
        let user = null;
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
        return user;
    }
}
