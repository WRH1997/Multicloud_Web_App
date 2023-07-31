import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from 'react-router-dom';
import invokeLambdaFunction from "../../common/InvokeLambda";
import { appTheme } from '../../../themes/theme';
import { Button, CssBaseline, FormControlLabel, Grid, Radio, ThemeProvider, Typography } from "@mui/material";
import Countdown from 'react-countdown';


export default function IndividualGame(){

    const { state } = useLocation();
    const triviaGame = state.triviaGame;
    const gameId = triviaGame.GameId;

    const nav = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [quizTime, setquizTime] = useState(1);

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



    //Endpoints/params integrated in place of below temp code
    const submitQuiz = () => {
        /*let res = [];
        let correctQ = 0;
        let totalQs = questions.length;
        for(let x=0; x<totalQs; x++){
            let options = document.getElementsByName(x.toString());
            let qOutcome = {};
            for(let y=0; y<options.length; y++){
                if(options[y].value=="Correct"){
                    qOutcome["correctAnswer"] = options[y].className;
                }
                if(options[y].checked){
                    qOutcome["yourAnswer"] = options[y].className;
                    if(options[y].value=="Correct"){
                        correctQ++;
                        qOutcome["status"] = "Correct"
                    }
                    else{
                        qOutcome["status"] = "Wrong"
                    }
                }
            }
            res.push(qOutcome);
        }
        let finalizedRes = {"totalQ":totalQs, "correctQ": correctQ, "Grade": ((correctQ/totalQs)*100), "Results": res};
        alert(JSON.stringify(finalizedRes));*/
        const results = questions.map((question, index) => {
            const selectedOption = document.querySelector(
                `input[name='${index}']:checked`
            );
            const qOutcome = {
                correctAnswer: question.options.find((option) => option.verdict === "Correct")?.text,
                yourAnswer: question.options[selectedOption?.name].text,
                status: selectedOption?.value === "Correct" ? "Correct" : "Wrong",
            };
            return qOutcome;
        });

        const totalQs = results.length;
        const correctQ = results.filter((result) => result.status === "Correct").length;
        const grade = (correctQ / totalQs) * 100;

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

            </Grid>
        </ThemeProvider >
        </center>
    )
}