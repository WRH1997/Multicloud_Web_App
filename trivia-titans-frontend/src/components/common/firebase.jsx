import { initializeApp } from "firebase/app";

// firebase config for Auth and Chat
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

// firebase config for Team Session state.
const firebaseConfigRishi = {
    apiKey: "AIzaSyAK1-Z1FjCavLpAq-w6cNR6r5qrc582hw8",
    authDomain: "csci-5410-s23-b00902815.firebaseapp.com",
    projectId: "csci-5410-s23-b00902815",
    storageBucket: "csci-5410-s23-b00902815.appspot.com",
    messagingSenderId: "577997555449",
    appId: "1:577997555449:web:4274d3e91be7b89f12c428",
    measurementId: "G-5ZB8RG0DEG"
};

const firebaseClientRishi = initializeApp(firebaseConfigRishi, 'secondary');

export {firebaseClient, firebaseClientRishi};
