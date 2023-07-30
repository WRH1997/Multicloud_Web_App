import { getAuth, signOut } from "firebase/auth";

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