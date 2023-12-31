import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router";
import { useLocation } from 'react-router-dom';
import invokeLambdaFunction from "../../common/InvokeLambda";
import { appTheme } from '../../../themes/theme';
import {AuthContext} from "../../common/AuthContext";
import { Button, CssBaseline, FormControlLabel, Grid, Radio, RadioGroup, ThemeProvider, Typography } from "@mui/material";
import Countdown from 'react-countdown';


export default function IndividualGame(){

    const currentUser = useContext(AuthContext);

    const AWS = require("aws-sdk");
    AWS.config.region = 'us-east-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:79432309-bc2e-447e-86b7-84c5b115e0e0',
    });
    const dynamoClient = new AWS.DynamoDB.DocumentClient({});

    const { state } = useLocation();
    const triviaGame = state.triviaGame;
    const gameId = triviaGame.GameId;

    const nav = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [quizTime, setquizTime] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});

    useEffect(()=>{
        getGame(gameId);
    },[]);

    const getGame = async (gameId) => {
        try{
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
            if(data.length==0){
                alert("Game ID Does not Correspond to an Existing Game!\nRedirecting back to all games...");
                nav('/triviagamelobby');
            }
            else{
                let qData = data[0].Questions;
                setquizTime(data[0].QuizTime);
                getQs(qData);
            }
        }
        catch(e){
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


        const handleOptionChange = (questionIndex, value) => {
            setSelectedOptions((prevState) => ({
                ...prevState,
                [questionIndex]: value,
            }));
        };

    const updateScoreTable = async (grade) => {
        let updateExpr = "";
        if(grade>=70){
            updateExpr = "set games_played = games_played + :inc, total_points_earned = total_points_earned + :grade, win = win + :inc";
        }
        else{
            updateExpr = "set games_played = games_played + :inc, total_points_earned = total_points_earned + :grade";
        }
        const params = {
            TableName: "User",
            Key: {
                "uid": currentUser.uid
            },
            UpdateExpression: updateExpr,
            ExpressionAttributeValues: {
                ":inc": 1,
                ":grade": grade
            }
        };
        await dynamoClient.update(params).promise();
    }


    const submitQuiz = () => {
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

        updateScoreTable(grade);

        nav("/IndividualGameResults", {
            state: {
                totalQs: totalQs,
                correctQ: correctQ,
                grade: grade,
                answers: results,
            }
        })
    }


    return(
        <center>
       <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <Grid container sx={{ margin: 5 }}>


                <Grid item xs={10} md={4}>
                    <Grid container direction="column" spacing={2} alignItems="center" justifyContent="center">

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

            </Grid>
        </ThemeProvider >
        </center>
    )
}