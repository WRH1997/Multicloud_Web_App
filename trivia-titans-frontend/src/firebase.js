import {initializeApp} from "firebase/app";
const firebaseConfig = {

    apiKey: "AIzaSyDSm_s83bfskVFpBF1HPAV1HAiInm4mTh0",

    authDomain: "sdp10-trivia-titans.firebaseapp.com",

    projectId: "sdp10-trivia-titans",

    storageBucket: "sdp10-trivia-titans.appspot.com",

    messagingSenderId: "965116952807",

    appId: "1:965116952807:web:a9c04161bd88ade67a2242",

    measurementId: "G-M356JBR04T"

};
const firebaseClient = initializeApp(firebaseConfig);
export default firebaseClient;