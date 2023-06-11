import {getAuth} from "firebase/auth";
import {useState} from "react";
import {createUserWithEmailAndPassword} from "firebase/auth";
import invokeLambdaFunction from "../common/InvokeLambda";

const
    HandleSignUp = () => {
        const [email,setEmail] = useState('');
        const [password,setPassword]= useState('');
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
                .then((userCredential) => {
                    // Sign-up success
                    const user = userCredential.user;
                    const jsonPayload = {
                        tableName:"userLoginInfo",
                        operation: "CREATE",
                        item: {
                            userEmail: user.email,
                            secretQuestion1: formData.question1,
                            secretAnswer1: formData.answer1,
                            secretQuestion2: formData.question2,
                            secretAnswer2: formData.answer2,
                            secretQuestion3: formData.question3,
                            secretAnswer3: formData.answer3,
                            type:"USER"
                        }
                    };
                    const lambdaResponse = invokeLambdaFunction("lambdaDynamoDBClient",jsonPayload);
                    console.log("Sign-up successful!", user);
                    // You can redirect the user to a new page or perform other actions here
                })
                .catch((error) => {
                    // Sign-up error
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Sign-up error:", errorCode, errorMessage);
                    // Handle the error and display an appropriate message to the user
                });

        }
        return (
            <div>
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



