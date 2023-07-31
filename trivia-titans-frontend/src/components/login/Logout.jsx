import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router";

const Logout=() => {
    
        const navigate = useNavigate();
        const auth = getAuth();
        signOut(auth).then(() => {
                console.log("USER LOGOUT!!!")
                navigate("/");
                window.location.reload()
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
}
export default Logout;