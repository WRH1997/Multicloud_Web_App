import React from 'react';
import '../../themes/EditProfile.css';
import {AuthContext} from "../common/AuthContext";
const AWS = require("aws-sdk");
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:79432309-bc2e-447e-86b7-84c5b115e0e0',
});
const dynamoClient = new AWS.DynamoDB.DocumentClient({});


class EditProfile extends React.Component{

    static contextType = AuthContext;

    state = {
        currentUser: {
            "uid": 1,
            "email": "",
            "displayName": "",
            "password": "",
            "phone": "",
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
        console.log(userId);
        await dynamoClient.get({
            TableName: "User",
            Key: {
                uid: userId.uid
            }
        }).promise().then((snapshot) => {
            try{
                this.setState({
                    currentUser: {
                        "uid": snapshot.Item.uid,
                        "email": snapshot.Item.Email,
                        "displayName": snapshot.Item.DisplayName,
                        "password": snapshot.Item.Password,
                        "phone": snapshot.Item.PhoneNumber,
                        "photoURL": snapshot.Item.PhotoURL
                    }
                })
            }
            catch(e){
                alert("Error: Trying to edit profile of user that does not exist in 'User' table.\n\n[uid: "+this.context.uid+"]");
            }
        }).catch(console.error);
    }


    componentDidUpdate(){
        if(this.context.uid!==this.state.currentUser.uid){
            console.log(this.context);
            this.FetchCurrentUserData(this.context);
        }
    }


    Submit = async (event) => {
        event.preventDefault();
        let updateParams = {
            TableName: "User",
            Key: {
                uid: this.state.currentUser.uid
            },
            UpdateExpression: "set DisplayName = :DisplayName, Email = :Email, Password = :Password, PhoneNumber = :PhoneNumber, PhotoURL = :PhotoURL",
            ExpressionAttributeValues:{
                ":DisplayName": this.state.currentUser.displayName,
                ":Email": this.state.currentUser.email,
                ":Password": this.state.currentUser.password,
                ":PhoneNumber":this.state.currentUser.phoneNumber,
                ":PhotoURL": this.state.currentUser.photoURL
            }
        }
        await dynamoClient.update(updateParams).promise();
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
                        <label htmlFor='phone' className='form-lbl'>Password: </label>
                        <input type='text' name='phoneNumber' className='phoneNumber' onChange={this.OnChange} placeholder={this.state.currentUser.phone}></input>
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
