import React from 'react';
import '../../themes/EditProfile.css';
import {AuthContext} from "../common/AuthContext";
import {getAuth} from "firebase/auth";
import {createUserWithEmailAndPassword,updateProfile, updateCurrentUser, updateEmail, updatePassword, updatePhoneNumber} from "firebase/auth";
import firebaseClient from '../common/firebase';
import {useNavigate} from 'react-router-dom';


const AWS = require("aws-sdk");
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:79432309-bc2e-447e-86b7-84c5b115e0e0',
});
const dynamoClient = new AWS.DynamoDB.DocumentClient({});
const app = firebaseClient;
const auth = getAuth();


class EditProfile extends React.Component{

    static contextType = AuthContext;

    state = {
        currentUser: {
            "uid": 1,
            "email": "",
            "displayName": "",
            "password": "",
            "photoURL": ""
        }
    }

    OnChange = (event) => {
        event.preventDefault();
        let stateName = event.target.name;
        let stateVal = event.target.value;
        this.setState({currentUser: {...this.state.currentUser, [stateName]:stateVal}});
    }


    FetchCurrentUserData = async(userId) => {
        this.setState({
            currentUser: {
                "uid": auth.currentUser.uid,
                "email": auth.currentUser.email,
                "displayName": auth.currentUser.displayName,
                "password": "**********",
                "photoURL": auth.currentUser.photoURL
            }
        })
    }


    componentDidUpdate(){
        if(this.context.uid!==this.state.currentUser.uid){
            this.FetchCurrentUserData(this.context);
        }
    }

    
    Submit = async (event) =>{
        event.preventDefault();
        console.log(this.state.currentUser);
        let currUser = auth.currentUser;
        let currEmail = auth.currentUser.email;
        try{
            await updateEmail(currUser, this.state.currentUser.email);
            await updatePassword(currUser, this.state.currentUser.password);
            await updateProfile(currUser, {
                displayName: this.state.currentUser.displayName,
                photoURL: this.state.currentUser.photoURL
            })

            let rdParams = {
                TableName: 'userLoginInfo',
                Key: {'userEmail': currEmail}
            };
            let data = await dynamoClient.get(rdParams).promise();
            let item = data.Item;
            console.log(item);
            let insertParams = {
                TableName: "userLoginInfo",
                Item:{
                    userEmail: this.state.currentUser.email,
                    displayName: this.state.currentUser.displayName,
                    secretAnswer1:  item.secretAnswer1,
                    secretAnswer2:  item.secretAnswer2,
                    secretAnswer3:  item.secretAnswer3,
                    secretQuestion1: item.secretQuestion1,
                    secretQuestion2: item.secretQuestion2,
                    secretQuestion3: item.secretQuestion3
                }
            }
            await dynamoClient.put(insertParams).promise();
            await dynamoClient.delete(rdParams).promise();
            alert('Profile Updated Successfully!\nRedirecting to login...');
            let temp = window.location.href;
            let temp2 = temp.toLowerCase().split("/editprofile")[0];
            let redirect = temp2 + "/login";
            window.location.href = redirect;
        }
        catch(e){
            console.log(e);
        }
    }


    render(){
        return(
            <center>
                <div className='form-div'>
                    <h3>Edit User Profile</h3>
                    <form onSubmit={this.Submit}>
                        <label htmlFor='displayName' className='form-lbl'>Display Name: </label>
                        <input type='text' name='displayName' className='displayName' onChange={this.OnChange} placeholder={this.state.currentUser.displayName}></input>
                        <br></br><br></br>
                        <label htmlFor='email' className='form-lbl'>Email: </label>
                        <input type='text' name='email' className='email' onChange={this.OnChange} placeholder={this.state.currentUser.email}></input>
                        <br></br><br></br>
                        <label htmlFor='password' className='form-lbl'>Password: </label>
                        <input type='password' name='password' className='password' onChange={this.OnChange} placeholder={this.state.currentUser.password}></input>
                        <br></br><br></br>
                        <label htmlFor='photoURL' className='form-lbl'>Profile Pic URL: </label>
                        <input type='text' name='photoURL' className='photoURL' onChange={this.OnChange} placeholder={this.state.currentUser.photoURL}></input>
                        <br></br><br></br>
                        <button type='submit' className='submit'>Submit</button>
                    </form>
                </div>
            </center>
        );
    }
}

export default EditProfile;
