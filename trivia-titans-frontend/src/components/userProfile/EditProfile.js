import React from 'react';
import {useEffect, useState, useMemo} from 'react';
import '../../themes/EditProfile.css';
const AWS = require("aws-sdk");

//CHANGE THIS TO CORRECT AWS CREDS FILE + ADD IT TO GITIGNORE
// @ts-ignore
const jsonData = require("./wl392785_secrets.json");

const EditProfile = () => {

    const [userData, setUserData] = useState({
        uid: 1,
        email: "",
        displayName: "",
        phoneNumber: "",
        photoURL: "",
        password: ""
    });


    let accessKey = jsonData['AKI'];
    let secretKey = jsonData['SAK'];
    console.log(accessKey+" "+secretKey);

    AWS.config.update({
        credentials: new AWS.Credentials(accessKey, secretKey),
        region: 'us-east-2'
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
            <div className='form-div' class='form-div'>
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