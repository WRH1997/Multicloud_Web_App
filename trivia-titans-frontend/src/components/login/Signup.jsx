import {getAuth} from "firebase/auth";
import React, {useState} from "react";
import {createUserWithEmailAndPassword,updateProfile} from "firebase/auth";
import invokeLambdaFunction from "../common/InvokeLambda";
import { subscribeToGameUpdates } from "../admin/GameUpdateNotifications";
import {createEmailIdentity} from "../common/AuthContext";
import {ToastContainer,toast} from "react-toastify";


// handles form sign up
const
    HandleSignUp = () => {
        const [email,setEmail] = useState('');
        const [password,setPassword]= useState('');
        const [displayName, setDisplayName] = useState('');
        const [formData, setFormData] = useState({
            question1: '',
            answer1: '',
            question2: '',
            answer2: '',
            question3:'',
            answer3:''
        });
        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        };
        const performSignUp = () => {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth,email, password)
                .then(async (userCredential) => {
                    // Sign-up success

                    // adding tuple to DynamoDB.

                    const user = userCredential.user;
                    const jsonPayload = {
                        tableName: "userLoginInfo",
                        operation: "CREATE",
                        item: {
                            userEmail: user.email,
                            displayName:user.displayName,
                            secretQuestion1: formData.question1,
                            secretAnswer1: formData.answer1,
                            secretQuestion2: formData.question2,
                            secretAnswer2: formData.answer2,
                            secretQuestion3: formData.question3,
                            secretAnswer3: formData.answer3,
                            type: "USER"
                        }
                    };

                    // updating display name for user as displayName is not automatically picked up.
                    await updateProfile(user,{
                        displayName: displayName
                    });
                    await invokeLambdaFunction("Create_DynamoDBClient", jsonPayload);
                    toast.success("Sign-up successful!");
                    const userProfileJsonPayload =
                        {
                            tableName: "User",
                            operation: "CREATE",
                            item: {
                                Email: user.email,
                                displayName:user.displayName,
                                uid: user.uid,
                                games_played:0,
                                total_points_earned:0,
                                win:0
                            }
                        };
                    await invokeLambdaFunction("Create_DynamoDBClient", userProfileJsonPayload);
                    // Subscribing user to SNS topic, to get notifications.
                    await subscribeToGameUpdates(user.email);
                    // Verifying user's email identity
                    await createEmailIdentity(user.email);
                })
                .catch((error) => {
                    // Sign-up error
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error("Sign-up error:" + errorMessage);
                    // Handle the error and display an appropriate message to the user
                });

        }
        return (
            <div>
                <ToastContainer />
                <h1>Sign Up</h1>
                <form>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /><br/>
                    <label htmlFor="displayname">Display Name:</label>
                    <input
                        type="text"
                        id="displayname"
                        name="displayname"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    /><br/>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    /><br/>
                    <div>
                        <label>
                            Secret Question 1:
                            <input
                                type="text"
                                name="question1"
                                value={formData.question1}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Answer 1:
                            <input
                                type="password"
                                name="answer1"
                                value={formData.answer1}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Secret Question 2:
                            <input
                                type="text"
                                name="question2"
                                value={formData.question2}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Answer 2:
                            <input
                                type="password"
                                name="answer2"
                                value={formData.answer2}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Secret Question 3:
                            <input
                                type="text"
                                name="question3"
                                value={formData.question3}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Answer 3:
                            <input
                                type="password"
                                name="answer3"
                                value={formData.answer3}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <button type="button" onClick={performSignUp}>Sign Up</button>
                </form>
            </div>
        );
}
export default HandleSignUp;



