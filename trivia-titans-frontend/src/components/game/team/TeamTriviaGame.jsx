import { Button, CssBaseline, FormControlLabel, Grid, Radio, ThemeProvider, Typography } from "@mui/material";
import Chat from "components/common/ChatBox";
import { useEffect, useState } from "react";
import Countdown from 'react-countdown';
import { useNavigate } from "react-router";
import { useLocation } from 'react-router-dom';
import { appTheme } from '../../../themes/theme';
import invokeLambdaFunction from "../../common/InvokeLambda";

export default function TeamTriviaGame() {

    const navigate = useNavigate();
    const { state } = useLocation();
    const triviaGame = state.triviaGame;
    const gameId = triviaGame.GameId;
    const gameName = triviaGame.GameName;
    const teamName = state.teamName;
    const teamMembers = state.teamMembers;

    const [questions, setQuestions] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [quizTime, setQuizTime] = useState(1);

    useEffect(() => {
        getGameDetails(gameId);
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
                setLoaded(true);
            }
        } catch (error) {
            console.log("Error fetching questions:", error);
        }
    };


    const submitQuiz = () => {
        const results = questions.map((question, index) => {
            const selectedOption = document.querySelector(
                `input[name='${index}']:checked`
            );
            const qOutcome = {
                correctAnswer: question.options.find((option) => option.verdict === "Correct")?.text,
                // @ts-ignore
                yourAnswer: question.options[selectedOption?.name].text,
                // @ts-ignore
                status: selectedOption?.value === "Correct" ? "Correct" : "Wrong",
            };
            return qOutcome;
        });

        const totalQs = results.length;
        const correctQ = results.filter((result) => result.status === "Correct").length;
        const grade = (correctQ / totalQs) * 100;

        navigate("/TeamGameResults", {
            state: {
                totalQs: totalQs,
                correctQ: correctQ,
                grade: grade,
                answers: results,
            }
        })
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
                                <div key={key}>
                                    <Typography variant="h6">Question: {questions[key]["text"]}</Typography>
                                    <br />
                                    {questions[key]["options"].map((option, index) => (
                                        <div key={index}>
                                            <FormControlLabel
                                                control={<Radio />}
                                                label={option["text"]}
                                                value={option["verdict"]}
                                                name={key}
                                                className={option["text"]}
                                            />
                                        </div>
                                    ))}
                                    <br />
                                    <hr />
                                </div>
                            ))}
                        </Grid>

                        <Grid item xs={12} sx={{ margin: 2 }}>
                            <Button variant="contained" color="primary" onClick={submitQuiz}>
                                Submit
                            </Button>
                        </Grid>
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