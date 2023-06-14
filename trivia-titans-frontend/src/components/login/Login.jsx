import { getAuth, signInWithPopup,signInWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";
import React, {useState} from "react";
import {Modal, Paper, Box, Typography, Grid, Container, InputAdornment, IconButton} from '@mui/material';import invokeLambda from "../common/InvokeLambda";
import {Button, TextField} from "@mui/material";
import invokeLambdaFunction from "../common/InvokeLambda";
import Logout from "./Logout";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
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
    const [secretQuestion, setSecretQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [mfaModalIsOpen, setMfaModalIsOpen] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth,email,password);

            console.log("user signed in successfully");
            // user logged in
        } catch (error) {
            console.error(error);
            // handle error
        }
    };
    const openModal = () => {
        setModalIsOpen(true);
    }
    async function
    gmailUserLogin() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();

        signInWithPopup(auth, provider)
            .then(async (result) => {
               // const credential = GoogleAuthProvider.credentialFromResult(result);
                //const token = credential.accessToken;
                const isMFAUser = await checkMfaUser(result.user);
                setUserEmail(result.user.email);
                console.log(isMFAUser);
            if (!isMFAUser) {
                    openModal();
                }
            else
            {
                await handleMfaLogin(result.user);
            }
            }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);

        });
    }
    async function checkMfaUser(user) {
        const jsonPayload = {
            tableName: "userLoginInfo",
            operation: "READ",
            key: {
                userEmail: user.email,
            }
        };
        const lambdaResponse = (await invokeLambda("lambdaDynamoDBClient", jsonPayload));
        console.log(lambdaResponse);
        return !(lambdaResponse==null);

    }
    async function handleMfaLogin(user)
    {
        const jsonPayload = {
            tableName: "userLoginInfo",
            operation: "READ",
            key: {
                userEmail: user.email,
            }
        };
        const question = await invokeLambda("lambdaDynamoDBClient", jsonPayload).secretQuestion1;
        setSecretQuestion(question);
        setMfaModalIsOpen(true);
    }
    const handleChange = async (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
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
        const expectedAnswer = await invokeLambda("lambdaDynamoDBClient", jsonPayload).secretAnswer1;
        if(answer === expectedAnswer ) {
            console.log ( "MFA USER LOGIN SUCCESS ");
        }
        else
        {
            console.log ( "MFA USER LOGIN FAILED!! wrong answer ");
            Logout();
        }
        setMfaModalIsOpen(false);
    };
    const handleModalSubmit = async (e) => {
        e.preventDefault();
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
        const lambdaResponse = invokeLambdaFunction("lambdaDynamoDBClient",jsonPayload);
        console.log("MFA Registered for user !", userEmail);
        console.log(lambdaResponse);

        setModalIsOpen(false);
    };
    return (
        <Container component="main" maxWidth="xs">
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
