import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebaseClient from "./firebase";
import {useState} from "react";

export class Signup {
    function

    signupEmailPassword() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const handleSignUp = () => {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Sign-up success
                    const user = userCredential.user;
                    console.log("Sign-up successful!", user);
                    // You can redirect the user to a new page or perform other actions here
                })
                .catch((error) => {
                    // Sign-up error
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Sign-up error:", errorCode, errorMessage);
                    // Handle the error and display an appropriate message to the user
                });
        };

        return (
            <div>
                <h1>Sign Up</h1>
                <form>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /><br/>

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    /><br/>

                    <button type="button" onClick={handleSignUp}>Sign Up</button>
                </form>
            </div>
        );
    }
}




