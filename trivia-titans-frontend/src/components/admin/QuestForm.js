import { useState, useEffect  } from 'react';
import { Button, List, ListItem, ListItemText, Paper  } from '@mui/material';
import SubmitForm from './SubmitForm';
import AWS from 'aws-sdk';


const getQuestions = async () => {
    
    const data = {
        tableName: "triviaquestion",
        operation: "SIMPLE_SCAN"
      };

      AWS.config.update({
      });


    const params = {
      FunctionName: 'arn:aws:lambda:us-east-1:940444391781:function:lambdaDynamoDBClient',
      Payload: JSON.stringify(data)
    };
    const lambda = new AWS.Lambda();

    try { 
        const response = await lambda.invoke(params).promise();
        return JSON.parse(response.Payload);
      } catch (error) {
        console.log('Error:', error);
      }


    
}

const QuestForm = () => {
    const difficulty_level = ['Hard', 'Medium', 'Easy'];

    const [showForm, setShowForm] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [questionText, setQuestionText] = useState('');
    const [verdictArr, setVerdictArr] = useState([]);
    const [expArr, setExpArr] = useState([]);
    const [inputArr, setInputArr] = useState([]);
    const [questionId, setQuestionId] = useState(0);
    const [diffVal,  setDiffVal] = useState(difficulty_level[0]);


    useEffect(() => {
        const fetchQuestions = async () => {
          try {
            const data = await getQuestions();
            setQuestions(data);
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchQuestions();
      }, []);

    const onHandleClick = () => {
        setShowForm(true);
    }

    const onHandleEdit = (id, text, diffLevel, options) => {
        setQuestionId(id);
        setQuestionText(text);
        setDiffVal(diffLevel);
        console.log('questionId', questionId);
        console.log('questionText', questionText);
        console.log('diffVal', diffVal);
        setShowForm(true);
    }

    const onHandleDelete = async (id, dl) => {
        console.log(id);
        const data = {
            tableName: "triviaquestion",
            operation: "DELETE",
            "key": {
                id: id,
                difficulty_level: dl
            }
          };
    
          AWS.config.update({
          });
    
    
        const params = {
          FunctionName: 'arn:aws:lambda:us-east-1:940444391781:function:Delete_DynamoDBClient',
          Payload: JSON.stringify(data)
        };
        const lambda = new AWS.Lambda();
    
        try { 
            const res = await lambda.invoke(params).promise();
            console.log(res);
            window.location.href = '/';
          } catch (error) {
            console.log('Error:', error);
          }
    }

    return (
        <div style={{ display: 'block', textAlign: 'center', padding: '20px' }}>
            <div>
                {
                    showForm?
                    (
                        <SubmitForm
                            questionId={questionId}
                            questionText={questionText}
                            verdictArr={verdictArr}
                            expArr={expArr}
                            inputArr={inputArr}
                            difficultyLevel={diffVal}
                        />
                    ):null
                }
            </div>
            <br></br>
            <div>
                <Button onClick={onHandleClick}>
                    Create Question
                </Button>
            </div>
            <br></br>
            <div>
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <List>
                        {questions.map((question) => (
                        <ListItem key={question.Id} style={{ display: 'flex', alignItems: 'center' }}>
                            <ListItemText 
                                primary={question.text} 
                                secondary={`Difficulty Level: ${question.difficulty_level}`} 
                                style={{ 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '900px'
                                }}
                            />
                            <div style={{ marginLeft: 'auto' }}>
                                <Button variant="contained" style={{ backgroundColor: 'green', marginRight: '10px' }} onClick={()=>{onHandleEdit(question['id'], question['text'], question['difficulty_level'], question['options'])}}>Edit</Button>
                                <Button variant="contained" style={{ backgroundColor: 'red' }} onClick={()=>{onHandleDelete(question['id'], question['difficulty_level'])}}>Delete</Button>
                            </div>
                        </ListItem>
                        ))}
                    </List>
                </Paper>
            </div>
        </div>

    );

}

export default QuestForm;