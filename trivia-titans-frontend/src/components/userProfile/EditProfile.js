import React from 'react';
import {useState} from 'react';
import '../../themes/EditProfile.css';

const AWS = require("aws-sdk");


const EditProfile = () => {

    const [userData, setUserData] = useState({
        uid: 1,
        email: "",
        displayName: "",
        phoneNumber: "",
        photoURL: "",
        password: ""
    });


    AWS.config.region = 'us-east-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:79432309-bc2e-447e-86b7-84c5b115e0e0',
    });


    const dynamoClient = new AWS.DynamoDB.DocumentClient({});


    //THIS FUNCTION WILL BE UPDATED TO GET THE CURRENT USER'S DATA TO
    //POPULATE THE EDIT FORM'S PLACEHOLDER VALUES 
   /*async function getUserInfo(){
        await dynamoClient.get({
            TableName: "dt1",
            Key: {
                username: "user1",
                email: "ex@ex.com"
            }
        }).promise().then((data) => {
            currFname = data.Item.fname;
            currLname = data.Item.lname;
            currEmail = data.Item.email;
            currPhone = data.Item.phone;
            currProfPic = data.Item.profPic;
            currPwd = data.Item.password;
        }).catch(console.error);
    }
    //getUserInfo();*/


    const onChange = async (event) => {
        event.preventDefault();
        let stateName = event.target.name;
        let stateVal = event.target.value;
        await setUserData(values=>({...values, [stateName]:stateVal}));
    }


    const submit = async (event) => {
        event.preventDefault();
        let updateParams = {
            TableName: "User",
            Key: {
                uid: "1"
            },
            UpdateExpression: "set DisplayName = :DisplayName, Email = :Email, Password = :Password, PhoneNumber = :PhoneNumber, PhotoURL = :PhotoURL",
            ExpressionAttributeValues:{
                ":DisplayName": userData.displayName,
                ":Email": userData.email,
                ":Password": userData.password,
                ":PhoneNumber": userData.phoneNumber,
                ":PhotoURL": userData.photoURL
            }
        }
        await dynamoClient.update(updateParams).promise();
    }


    return(
        <center>
            <div className='form-div'>
                <h3>Edit User Profile</h3>
                <form onSubmit={submit}>
                    <label htmlFor='displayName' className='form-lbl'>Display Name: </label>
                    <input type='text' name='displayName' className='displayName' onChange={onChange}></input>
                    <br></br><br></br>
                    <label htmlFor='email' className='form-lbl'>Email: </label>
                    <input type='text' name='email' className='email' onChange={onChange}></input>
                    <br></br><br></br>
                    <label htmlFor='password' className='form-lbl'>Password: </label>
                    <input type='password' name='password' className='password' onChange={onChange}></input>
                    <br></br><br></br>
                    <label htmlFor='phone' className='form-lbl'>Password: </label>
                    <input type='text' name='phoneNumber' className='phoneNumber' onChange={onChange}></input>
                    <br></br><br></br>
                    <label htmlFor='photoURL' className='form-lbl'>Profile Pic URL: </label>
                    <input type='text' name='photoURL' className='photoURL' onChange={onChange}></input>
                    <br></br><br></br>
                    <button type='submit' className='submit'>Submit</button>
                </form>
            </div>
        </center>
    );
}

export default EditProfile;