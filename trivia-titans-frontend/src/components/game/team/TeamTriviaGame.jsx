import { Button, CssBaseline, FormControlLabel, Grid, Radio, RadioGroup, ThemeProvider, Typography } from "@mui/material";
import Chat from "components/common/ChatBox";
import { useContext, useEffect, useState } from "react";
import Countdown from 'react-countdown';
import { useNavigate } from "react-router";
import { useLocation } from 'react-router-dom';
import { appTheme } from '../../../themes/theme';
import invokeLambdaFunction from "../../common/InvokeLambda";
import { AuthContext } from "components/common/AuthContext";
import { addDoc, collection, doc, getFirestore, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { firebaseClientRishi } from "components/common/firebase";

const db = getFirestore(firebaseClientRishi);

export default function TeamTriviaGame() {

    const navigate = useNavigate();
    const { state } = useLocation();
    const triviaGame = state.triviaGame;
    const gameId = triviaGame.GameId;
    const gameName = triviaGame.GameName;
    const teamName = state.teamName;
    const teamMembers = state.teamMembers;
    const currentUserPermission = state.currentUserPermission;
    const sessionId = state.sessionId;
    const teamSessionDetails = state.teamSessionDetails;
    const currentUser = useContext(AuthContext);
    const currentUserEmail = currentUser.email.toString();

    const [questions, setQuestions] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [quizTime, setQuizTime] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});

    useEffect(() => {
        getGameDetails(gameId);
        if (currentUserPermission === "MEMBER") {
            getGameResults(sessionId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getGameDetails = async (gameId) => {
        try {
            const jsonPayload = {
                tableName: "TriviaGames",
                operation: "SCAN_WITH_FILTER_EXPR",
                filterExpression: "GameId = :gameId",
                expressionAttributeValues: {
                    ":gameId": {
                        "S": gameId
                    }
                }
            };
            const data = await invokeLambdaFunction("ScanWithFilterExpr_DynamoDBClient", jsonPayload);
            if (data.length === 0) {
                alert("Game ID Does not Correspond to an Existing Game!\nRedirecting back to all games...");
                //nav('/browsetriviagames');
            }
            else {
                let qData = data[0].Questions;
                setQuizTime(data[0].QuizTime);
                getQs(qData);
            }
        }
        catch (e) {
            console.log("Error: " + e);
        }
    }

    const getQs = async (questionIds) => {
        try {
            const questionList = [];
            for (const id of questionIds) {
                const questionPayload = {
                    tableName: "triviaquestion",
                    operation: "SCAN_WITH_FILTER_EXPR",
                    filterExpression: "id = :questionId",
                    expressionAttributeValues: {
                        ":questionId": { S: id },
                    },
                };
                const questionData = await invokeLambdaFunction("ScanWithFilterExpr_DynamoDBClient", questionPayload);

                const { text, options } = questionData[0];
                questionList.push({ text, options });
            }

            if (!loaded) {
                setQuestions(questionList);
                setSelectedOptions({});
                setLoaded(true);
            }
        } catch (error) {
            console.log("Error fetching questions:", error);
        }
    };

    const handleOptionChange = (questionIndex, value) => {
        setSelectedOptions((prevState) => ({
            ...prevState,
            [questionIndex]: value,
        }));
    };

    const submitQuiz = async () => {
        if (currentUserPermission === 'ADMIN') {
            const results = questions.map((question, index) => {
                const selectedValue = selectedOptions[index];
                const selectedOption = question.options[selectedValue];
                const isCorrect = (selectedOption?.verdict || "Not answered") === "Correct";

                const qOutcome = {
                    correctAnswer: question.options.find((option) => option.verdict === "Correct")?.text,
                    yourAnswer: selectedOption?.text || "Not answered",
                    status: isCorrect ? "Correct" : "Wrong",
                };
                return qOutcome;
            });

            const totalQs = results.length;
            const correctQ = results.filter((result) => result.status === "Correct").length;
            const grade = (correctQ / totalQs) * 100;

            // Update Firestore data for all documents with matching sessionId
            teamSessionDetails.forEach(async (teamMember) => {
                if (teamMember.SessionId === sessionId) {
                    await updateQuizResults(teamMember.id, totalQs, correctQ, grade, results);
                }
            });

            // TODO: Save Scores and Results to Relevant tables 

            // Show Results to users
            navigate("/TeamGameResults", {
                state: {
                    totalQs: totalQs,
                    correctQ: correctQ,
                    grade: grade,
                    answers: results,
                }
            })
        }
    };

    const getGameResults = (sessionId) => {
        if (currentUserPermission === "MEMBER") {
            const q = query(collection(db, "TeamGameLobbySessions"), where("SessionId", "==", sessionId));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const records = [];
                snapshot.forEach((doc) => {
                    records.push({ ...doc.data(), id: doc.id });
                });

                //check if the current session's status is "SUBMITTED" and navigate to results page
                const currentUserRecord = records.find((record) => record.UserEmail === currentUserEmail);
                if (currentUserRecord && currentUserRecord.SessionStatus === "SUBMITTED") {
                    // Admin has submitted the game, navigate to the results page
                    navigate("/TeamGameResults", {
                        state: {
                            totalQs: records[0].totalQs,
                            correctQ: records[0].correctQ,
                            grade: records[0].grade,
                            answers: records[0].answers
                        }
                    });
                }
            });
            // Return a cleanup function to remove the listener when the component is unmounted
            return () => {
                unsubscribe();
            };
        }
    }

    const updateQuizResults = async (docId, totalQs, correctQ, grade, answers) => {
        await updateDoc(doc(db, "TeamGameLobbySessions", docId), {
            totalQs: totalQs,
            correctQ: correctQ,
            grade: grade,
            answers: answers,
            Timestamp: serverTimestamp(),
            SessionStatus: "SUBMITTED", // Assuming sessionStatus field exists in the Firestore document
        });
    };


    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <Grid container sx={{ margin: 5 }}>

                <Grid item xs={1} md={4}>
                    <Grid item sx={{ margin: 2 }}>
                        {teamMembers && (
                            <Typography variant="h6" gutterBottom>
                                Team Members:
                                {teamMembers.map((team, index) => (
                                    <div key={index}>
                                        <p>Player {index + 1}: {team.playerEmail.S}</p>
                                    </div>
                                ))}
                            </Typography>
                        )}
                    </Grid>

                </Grid>

                <Grid item xs={10} md={4}>
                    <Grid container direction="column" spacing={2}>

                        <Grid item sx={{ margin: 2 }}>
                            <Typography variant="h4" align="center" >
                                Team: {teamName}
                            </Typography>
                            <Typography variant="h4" align="center" >
                                Attempt for: {gameName}
                            </Typography>
                        </Grid>

                        <Grid item sx={{ margin: 2 }}>
                            Time Left:
                            <Countdown date={Date.now() + (quizTime * 60 * 1000)}
                                onComplete={() => submitQuiz()} />
                        </Grid>

                        <Grid item sx={{ margin: 2 }}>
                            {Object.keys(questions).map((key, i) => (
                                <div key={questions[key].id}>
                                    <Typography variant="h6">Question: {questions[key]["text"]}</Typography>
                                    <br />
                                    <RadioGroup name={key} value={selectedOptions[key] || ""} onChange={(e) => handleOptionChange(key, e.target.value)}>
                                        {questions[key]["options"].map((option, index) => (
                                            <div key={option.id}>
                                                <FormControlLabel
                                                    control={<Radio />}
                                                    label={option["text"]}
                                                    value={index}
                                                    className={option["text"]}
                                                />
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    {/* TODO: Request Hint For Question {key} */} 
                                    <br />
                                    <hr />
                                </div>
                            ))}
                        </Grid>

                        {currentUserPermission === 'ADMIN' && (
                            <Grid item xs={12} sx={{ margin: 2 }}>
                                <Button variant="contained" color="primary" onClick={submitQuiz}>
                                    Submit
                                </Button>
                            </Grid>
                        )}

                        {currentUserPermission === 'MEMBER' && (
                            <Grid item xs={12} sx={{ margin: 2 }}>
                                <Button variant="contained" disabled>
                                    Waiting for Admin to Submit
                                </Button>
                            </Grid>
                        )}

                    </Grid>
                </Grid>

                <Grid item xs={1} md={4}>
                    <Grid item sx={{ margin: 2 }}>
                        <Chat />
                    </Grid>
                </Grid>

            </Grid>
        </ThemeProvider >
    );

}