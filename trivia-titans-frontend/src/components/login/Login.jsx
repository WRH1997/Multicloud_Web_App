import { getAuth, signInWithPopup,signInWithEmailAndPassword,sendPasswordResetEmail,GoogleAuthProvider, signOut } from "firebase/auth";
import React, {useState} from "react";
import {Modal, Paper, Box, Typography, Grid, Container, InputAdornment, IconButton} from '@mui/material';import invokeLambda from "../common/InvokeLambda";
import {Button, TextField} from "@mui/material";
import invokeLambdaFunction from "../common/InvokeLambda";
import Logout from "./Logout";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {useLocation, useNavigate} from "react-router-dom";
import { subscribeToGameUpdates } from "../admin/GameUpdateNotifications";
import {createEmailIdentity} from "../common/AuthContext";
import {ToastContainer,toast} from "react-toastify";

const Login = () => {
// constants.
    const [formData, setFormData] = useState({
        question1: '',
        answer1: '',
        question2: '',
        answer2: '',
        question3: '',
        answer3: ''
    });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [secretQuestionNumber, setSecretQuestionNumber] = useState(null);
    const [secretQuestion, setSecretQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [mfaModalIsOpen, setMfaModalIsOpen] = useState(false);
    const selectedQuestion = Math.floor(Math.random() * 2) + 1;
    const navigate = useNavigate();


    const handleLogin = async (e) => {

        e.preventDefault();
        const auth = getAuth();
        // regular sign-in with email and password.
        signInWithEmailAndPassword(auth, email, password)
            .then(async (result) => {
                    const isMFAUser = await checkMfaUser(result.user);
                    setUserEmail(result.user.email);
                    if (!isMFAUser) {
                        openModal();
                    } else {
                        await handleMfaLogin(result.user);
                    }
                }
            ).catch((error) => {
            const email = error.customData.email;
            // Google Auth provider via OAuth
            GoogleAuthProvider.credentialFromError(error);
        });

    }
    const openModal = () => {
        setModalIsOpen(true);
    }

    async function
    gmailUserLogin() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        // Sign in with GMAIL Popup
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const isMFAUser = await checkMfaUser(result.user);
                setUserEmail(result.user.email);
                if (!isMFAUser) {
                    openModal();
                } else {
                    await handleMfaLogin(result.user);
                }
            }).catch((error) => {
// The email of the user's account used.
            const email = error.customData.email;
            GoogleAuthProvider.credentialFromError(error);
        });
    }

    async function checkMfaUser(user) {
        // Check if user has MFA entries in the table, if not , make them enter new entries to the table.
        const jsonPayload = {
            tableName: "userLoginInfo",
            operation: "READ",
            key: {
                userEmail: user.email,
            }
        };
        const lambdaResponse = (await invokeLambda("lambdaDynamoDBClient", jsonPayload));
        return !(lambdaResponse == null);
    }

    async function handleMfaLogin(user) {
        // MFA login handler
        const jsonPayload = {
            tableName: "userLoginInfo",
            operation: "READ",
            key: {
                userEmail: user.email,
            }
        };
        let expectedQuestion = '';
        const question = await invokeLambda("lambdaDynamoDBClient", jsonPayload);
        // Choose the selected question from the DynamoDB table
        switch (selectedQuestion) {
            case 1:
                expectedQuestion = question.secretQuestion1;
                break;
            case 2:
                expectedQuestion = question.secretQuestion2;
                break;
            case 3:
                expectedQuestion = question.secretQuestion3;
                break;
        }
        setSecretQuestion(expectedQuestion);
        setSecretQuestionNumber(selectedQuestion);
        setMfaModalIsOpen(true);
    }

    const handleChange = async (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
        const handleResetPassword = () => {
            const auth = getAuth();
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    // Password reset email sent!
                    toast.success("Password reset email sent to user!");
                })
                .catch((error) => {
                    // An error occurred
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ..
                    toast.error(errorMessage);
                });
        };
    const handleChangeMfaModal = (e) => {
        setAnswer(e.target.value);
    };
    const handleMfaModalSubmit = async (e) => {
        e.preventDefault();
        const jsonPayload = {
            tableName: "userLoginInfo",
            operation: "READ",
            key: {
                userEmail: userEmail,
            }
        };
        const userMfaData = await invokeLambda("lambdaDynamoDBClient", jsonPayload);
        let expectedAnswer = '';
        switch (secretQuestionNumber) {
            // Compare selected question with answers.
            case 1:
                expectedAnswer = userMfaData.secretAnswer1;
                break;
            case 2:
                expectedAnswer = userMfaData.secretAnswer2;
                break;
            case 3:
                expectedAnswer = userMfaData.secretAnswer3;
                break;
        }
        if (answer === expectedAnswer) {
            toast.success("MFA USER LOGIN SUCCESS ");
            navigate(-1);
        } else {
            const auth = getAuth();
            signOut(auth).then(() => {
                toast.success("USER LOGOUT!!!")
                toast.error("MFA USER LOGIN FAILED!! wrong answer ");
                function fun () { window.location.reload() };
                setTimeout(function () {
                    fun();
                }, 2000);
                // Sign-out successful.
            }).catch((error) => {
                // An error happened.
            });
        }
        setMfaModalIsOpen(false);
    };
    const handleModalSubmit = async (e) => {
        e.preventDefault();
        // Store user MFA data for gmail user on first-time login.
        const jsonPayload = {
            tableName: "userLoginInfo",
            operation: "CREATE",
            item: {
                userEmail: userEmail,
                secretQuestion1: formData.question1,
                secretAnswer1: formData.answer1,
                secretQuestion2: formData.question2,
                secretAnswer2: formData.answer2,
                secretQuestion3: formData.question3,
                secretAnswer3: formData.answer3,
                type: "USER"
            }
        }
        const currentUser = getAuth().currentUser;
        // update the player statistics table.
        const userProfileJsonPayload =
            {
                tableName: "User",
                operation: "CREATE",
                item: {
                    Email: currentUser.email,
                    displayName:currentUser.displayName,
                    uid: currentUser.uid,
                    games_played:0,
                    total_points_earned:0,
                    win:0
                }
            };
        await invokeLambdaFunction("Create_DynamoDBClient", userProfileJsonPayload);

        await invokeLambdaFunction("Create_DynamoDBClient", jsonPayload);

        toast.success("MFA Registered for user !", userEmail);
        setModalIsOpen(false);
        // in case of Google user logging in for the first time, subscribe the user to game updates.
        await subscribeToGameUpdates(userEmail);
        // create an SES identity for the user in case of Gmail user logging in for the first time.
        await createEmailIdentity(userEmail);
    };
    return (
        <Container component="main" maxWidth="xs">
            <ToastContainer/>
            <div>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={e => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type='password'
                                id="password"
                                autoComplete="current-password"
                                onChange={e => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                edge="end"
                                            >
                                                {password.showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Login
                    </Button>
                    <Button
                        onClick={handleResetPassword}
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Reset Password
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={gmailUserLogin}
                            >
                                Login with Gmail
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <div>
                <Modal
                    open={modalIsOpen}
                    onClose={() => setModalIsOpen(false)}>
                    <Paper>
                        <Button onClick={() => setModalIsOpen(false)}>Close</Button>
                        <form onSubmit={handleModalSubmit}>
                            <TextField
                                name="question1"
                                label="Secret Question 1"
                                value={formData.question1}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="answer1"
                                label="Answer 1"
                                type="password"
                                value={formData.answer1}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="question2"
                                label="Secret Question 2"
                                value={formData.question2}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="answer2"
                                label="Answer 2"
                                type="password"
                                value={formData.answer2}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="question3"
                                label="Secret Question 3"
                                value={formData.question3}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                name="answer3"
                                label="Answer 3"
                                type="password"
                                value={formData.answer3}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Submit
                            </Button>
                        </form>
                    </Paper>
                </Modal>
            </div>
            <div>
                <Modal
                    open={mfaModalIsOpen}
                    onClose={() => setMfaModalIsOpen(false)}
                >
                    <Paper>
                        <Button onClick={() => setMfaModalIsOpen(false)}>Close</Button>
                        <h2>{secretQuestion}</h2>
                        <form onSubmit={handleMfaModalSubmit}>
                            <TextField
                                name="answer"
                                label="Your Answer"
                                value={answer}
                                onChange={handleChangeMfaModal}
                                fullWidth
                                margin="normal"
                            />
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Submit
                            </Button>
                        </form>
                    </Paper>
                </Modal>
            </div>
        </Container>
);
            };
export default Login
