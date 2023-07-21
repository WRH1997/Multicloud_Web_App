import React, { useState, useEffect } from "react";
import { Route, Routes, useParams } from 'react-router-dom';
import { useNavigate } from "react-router";
import invokeLambdaFunction from "../../common/InvokeLambda";
import { ClassNames } from "@emotion/react";

export default function IndividualGame(){

    const nav = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(()=>{
        console.log(questions);
    },[questions]);

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
                //nav('/browsetriviagames');
            }
            else{
                let qData = data[0].Questions;
                let questionIds = [];
                for(var i in qData){
                    for(let x=0; x<qData[i].length; x++){
                        for(var y in qData[i][x]){
                            questionIds.push(qData[i][x][y]);
                        }
                    }
                }
                getQs(questionIds);
            }
        }
        catch(e){
            console.log("Error: " + e);
        }
    }


    const getQs = async (questionIds) => {
        let questionList = [];
        try{
            for(let x=0; x<questionIds.length; x++){
                const jsonPayload = {
                    tableName: "triviaquestion",
                    operation: "SCAN_WITH_FILTER_EXPR",
                    filterExpression: "id = :questionId",
                    expressionAttributeValues: {
                        ":questionId": {
                            "S": questionIds[x]
                        }
                    }
                };
                const data = await invokeLambdaFunction("ScanWithFilterExpr_DynamoDBClient", jsonPayload);

                let qText = data[0]["text"];
                let qOptions_raw = data[0]["options"]["L"];
                let qOptions = [];
                for(var z=0; z<qOptions_raw.length; z++){
                    for(var y in qOptions_raw[z]){
                        qOptions.push([qOptions_raw[z][y]["text"]["S"],qOptions_raw[z][y]["verdict"]["S"]])
                    }
                }
                let thisQ = {};
                thisQ["text"] = qText;
                thisQ["options"] = qOptions;
                questionList.push(thisQ);
            }
            if(!loaded){
                setQuestions([...questionList]);
                setLoaded(true);
            }
        }
        catch(e){
            console.log("Error: " + e);
        }
    }



    //Endpoints/params integrated in place of below temp code
    const submitQuiz = () => {
        let res = [];
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
        let finalizedRes = {"totalQ":totalQs, "correctQ": correctQ, "Grade": (correctQ/totalQs), "Results": res};
        alert(JSON.stringify(finalizedRes));
    }

    //Swap hard-coded game ID with ID from data passed through props once integrated
    getGame("3b726d4f-4f9f-4b38-beb0-aa5df45dbce2");



    return(
        <div>
            <div>
            {Object.keys(questions).map((key, i) => (
                <div>
                    Question: {questions[key]["text"]["S"]}
                    <br></br>
                    {questions[key]["options"].map((option) => (
                        <div>
                        {option[0]}: <input type='radio' className={option[0]} value={option[1]} name={key}></input>
                        </div>
                    ))}
                    <br></br>
                    <hr></hr>
                </div>
            ))}
            </div>
            <input type='submit' id='submitQuiz' className='submitQuiz' onClick={submitQuiz} value="Submit"></input>
        </div>
    )
}