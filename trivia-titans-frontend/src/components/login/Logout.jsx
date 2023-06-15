import { getAuth, signOut } from "firebase/auth";

import firebase from "../common/firebase";
const Logout=() => {
        const auth = getAuth();
        signOut(auth).then(() => {
                console.log("USER LOGOUT!!!")
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
}
export default Logout;