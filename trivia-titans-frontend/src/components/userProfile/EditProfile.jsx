import React from 'react';
import {useEffect, useState} from 'react';
import '../../themes/EditProfile.css'
//const AWS = require('aws-sdk');

const EditProfile = () => {

    useEffect(() => {
        //https://dev.to/aws-builders/dynamodb-using-aws-sdk-for-javascriptnodejs-43j1
        //PARAMS: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html
        //fetch from dynamoDB
        //...
        //set states
    })

    const [userData, setUserData] = useState({
        firstName:"",
        lastName:"",
        username: "",
        password: "",
        profilePic: "",
        email: "",
        phone: 1
    });

    let currFname = "DUMMY TEXT";
    let currLname = "DUMMY TEXT";
    let currUname = "DUMMY TEXT";
    let currPwd = "DUMMY TEXT";
    let currProfPic = "DUMMY TEXT";
    let currEmail = "DUMMY TEXT";
    let currPhone = 1;


    const onChange = (event) => {
        let stateName = event.target.name;
        let stateVal = event.target.value;
        setUserData(values=>({...values, [stateName]:stateVal}))
    }

    const submit = (event) => {
        //UPDATE DYNAMO DB
        alert(JSON.stringify(userData));
    }


    return(
        <center>
            <div class='form-div'>
                <h3>Edit User Profile</h3>
                <form onSubmit={submit}>
                    <label htmlFor='fname' className='form-lbl'>First name: </label>
                    <input type='text' className='fname' name='fname' onChange={onChange} placeholder={currFname}></input>
                    <br></br><br></br>
                    <label htmlFor='lname' className='form-lbl'>Last name: </label>
                    <input type='text' name='lname' className='lname' onChange={onChange} placeholder={currLname}></input>
                    <br></br><br></br>
                    <label htmlFor='username' className='form-lbl'>Username: </label>
                    <input type='text' name='username' className='username' onChange={onChange} placeholder={currUname}></input>
                    <br></br><br></br>
                    <label htmlFor='password' className='form-lbl'>Password: </label>
                    <input type='password' name='password' className='password' onChange={onChange} placeholder={currPwd}></input>
                    <br></br><br></br>
                    <label htmlFor='profPic' className='form-lbl'>Profile Pic URL: </label>
                    <input type='text' name='profPic' className='profPic' onChange={onChange} placeholder={currProfPic}></input>
                    <br></br><br></br>
                    <label htmlFor='email' className='form-lbl'>Email Address: </label>
                    <input type='text' name='email' className='email' onChange={onChange} placeholder={currEmail}></input>
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