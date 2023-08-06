import React, { useContext, useEffect, useState } from 'react';
import {AuthContext} from "../common/AuthContext";
import {getAuth} from "firebase/auth";
import {createUserWithEmailAndPassword,updateProfile, updateCurrentUser, updateEmail, updatePassword, updatePhoneNumber} from "firebase/auth";
import {firebaseClient} from '../common/firebase';
import {useNavigate} from 'react-router-dom';
import "../../themes/UserPhoto.css";

export default function UserPhoto(){

    const nav = useNavigate();
    const currentUser = useContext(AuthContext);

    const goToEditProfile = () => {
        nav('/EditProfile');
    }

    if(currentUser){
        console.log(currentUser);
        const photoURL = currentUser.photoURL;
        if(currentUser.photoURL){
            return(
                <img className='userPhoto' src={photoURL} alt='NO PHOTO UPDLOADED' onClick={goToEditProfile}></img>
            )
        }
        else{
            return(
                <img className='userPhoto' src="https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png" alt='NO PHOTO UPDLOADED' onClick={goToEditProfile}></img>
            )
        }
    }


}