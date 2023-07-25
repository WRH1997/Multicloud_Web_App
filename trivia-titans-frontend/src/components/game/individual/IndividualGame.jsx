import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import invokeLambdaFunction from "../../common/InvokeLambda";

export default function IndividualGame(){

    const nav = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(()=>{
        //Swap hard-coded game ID with ID from data passed through props once integrated
        getGame("3b726d4f-4f9f-4b38-beb0-aa5df45dbce2");
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
                //nav('/browsetriviagames');
            }
            else{
                let qData = data[0].Questions;
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
        let finalizedRes = {"totalQ":totalQs, "correctQ": correctQ, "Grade": ((correctQ/totalQs)*100), "Results": res};
        alert(JSON.stringify(finalizedRes));
    }

    return(
        <div>
            <div>
            {Object.keys(questions).map((key, i) => (
                <div>
                    Question: {questions[key]["text"]}
                    <br></br>
                    {questions[key]["options"].map((option) => (
                        <div>
                        {option["text"]}: <input type='radio' className={option["text"]} value={option["verdict"]} name={key}></input>
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