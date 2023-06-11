import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {Button} from "@mui/material";
import React, {useState} from "react";
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        try {
            await auth.signInWithEmailAndPassword(email, password);
            console.log("user signed in successfully");
            // user logged in
        } catch (error) {
            console.error(error);
            // handle error
        }
    };
    function
    gmailUserLogin() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
            }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
    }
    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <div>
                <label>Email: </label>
                <input type='text' name='email' onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Password: </label>
                <input type='password' name='password' onChange={e => setPassword(e.target.value)} />
            </div>
            <div>
                <button type='submit'>Login</button>
            </div>
            <div>
            <button
                variant="contained"
                onClick={gmailUserLogin} >
                Login with Gmail
            </button>
            </div>
        </form>
    )
};
export default Login;
