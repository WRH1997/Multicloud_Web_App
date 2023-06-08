import React from 'react';
import {useEffect, useState, useMemo} from 'react';
import '../../themes/EditProfile.css'
const AWS = require("aws-sdk")

const EditProfile = () => {


    const [userData, setUserData] = useState({
        firstName:"",
        lastName:"",
        username: "",
        password: "",
        profilePic: "",
        email: "",
        phone: 1
    });


    //DUMMY DATA FOR TESTING
    let currFname = "DUMMY TEXT";
    let currLname = "DUMMY TEXT";
    let currUname = "DUMMY TEXT";
    let currPwd = "DUMMY TEXT";
    let currProfPic = "DUMMY TEXT";
    let currEmail = "DUMMY TEXT";
    let currPhone = 1;

    AWS.config.update({
        credentials: new AWS.Credentials('AKIAR2VYCU2GQKVNVKGF', 'aOQlTUbsnXQwFqVscaIE+7gmd3dAaI8tN2HSvwl8'),
        region: 'us-east-1'
    });

    const dynamoClient = new AWS.DynamoDB.DocumentClient({});

    async function getUserInfo(){
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
    //getUserInfo();


    const onChange = async (event) => {
        event.preventDefault();
        let stateName = event.target.name;
        let stateVal = event.target.value;
        await setUserData(values=>({...values, [stateName]:stateVal}));
        //console.log(userData);
    }

    const submit = async (event) => {
        event.preventDefault();
        let updateParams = {
            TableName: "dt1",
            Key: {
                username: "user1",
                email: "ex"
            },
            //NOTE EMAIL AND USERNAME MISSING BECAUSE UNEDITABLE
            UpdateExpression: "set firstName = :firstName, lastName = :lastName, password = :password, profilePic = :profilePic, phone = :phone",
            ExpressionAttributeValues:{
                ":firstName": userData.firstName,
                ":lastName": userData.lastName,
                ":password": userData.password,
                ":profilePic": userData.profilePic,
                ":phone": userData.phone
            }
        }
        alert(updateParams);
        console.log(updateParams);
        await dynamoClient.update(updateParams).promise();
    }


    return(
        <center>
            <div class='form-div'>
                <h3>Edit User Profile</h3>
                <form onSubmit={submit}>
                    <label htmlFor='firstName' className='form-lbl'>First name: </label>
                    <input type='text' name='firstName' className='firstName' onChange={onChange} disbaled={'true'} placeholder={currFname}></input>
                    <br></br><br></br>
                    <label htmlFor='lastName' className='form-lbl'>Last name: </label>
                    <input type='text' name='lastName' className='lastName' onChange={onChange} placeholder={currLname}></input>
                    <br></br><br></br>
                    <label htmlFor='username' className='form-lbl'>Username: </label>
                    <input type='text' name='username' className='username' onChange={onChange} placeholder={currUname}></input>
                    <br></br><br></br>
                    <label htmlFor='password' className='form-lbl'>Password: </label>
                    <input type='password' name='password' className='password' onChange={onChange} placeholder={currPwd}></input>
                    <br></br><br></br>
                    <label htmlFor='profilePic' className='form-lbl'>Profile Pic URL: </label>
                    <input type='text' name='profilePic' className='profilePic' onChange={onChange} placeholder={currProfPic}></input>
                    <br></br><br></br>
                    <label htmlFor='email' className='form-lbl'>Email Address: </label>
                    <input type='text' name='email' className='email' onChange={onChange} disbaled={'true'} placeholder={currEmail}></input>
                    <br></br><br></br>
                    <label htmlFor='phone' className='form-lbl'>Phone Number: </label>
                    <input type='text' name='phone' className='phone' onChange={onChange} placeholder={currPhone}></input>
                    <br></br><br></br>
                    <button type='submit' className='submit'>Submit</button>
                </form>
            </div>
        </center>
    );
}

export default EditProfile;