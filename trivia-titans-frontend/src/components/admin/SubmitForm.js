import { Button, TextField, FormControl, FormLabel, FormGroup, Grid } from '@mui/material';
import { useState } from 'react';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


const SubmitForm = () => {
  const difficulty_level = ['Hard', 'Medium', 'Easy'];
  const question_result = ['Incorrect','Correct'];
  const message = '';

  const [inputs, setInputs] = useState([]);
  const [explanation, setExplanation] = useState([]);
  const [verdict, setVerdict] = useState([]);
  const [quesText, setQuesText] = useState('');
  const [diffVal,  setDiffVal] = useState(difficulty_level[0]);
  const [errorMessage, setErrorMessage] = useState("");


  const addInput = () => {
    setInputs([...inputs, '']);
    setVerdict([...verdict, question_result[0]]);
    setExplanation([...explanation, '']);
  };

  const handleChangeQuesText = (text) => {
    setQuesText(text);
  }

  const handleChangeDiffVal = (text) => {
    setDiffVal(text);
  }

  const handleInputChange = (index, val) => {
    const updatedInput = [...inputs];
    updatedInput[index] = val;
    setInputs(updatedInput);
  }

  const handleVerdictChange = (index, val) => {
    const updatedVerdict = [...verdict];
    updatedVerdict[index] = val;
    setVerdict(updatedVerdict);
  }

  const handleExplanationChange = (index, val) => {
    const updatedExplanation = [...explanation];
    updatedExplanation[index] = val;
    setExplanation(updatedExplanation);
  }

  const getTag = async (text) => {
    try {
      const url = 'https://us-central1-csci5410a2-391323.cloudfunctions.net/tagTriviaQuestion'; 
  
      const response = await axios.post(url, { question: text });
  
      if (response.status !== 200) {
        throw new Error('Error calling Cloud Function');
      }
  
      const result = response.data;
      console.log('Cloud Function response:', result);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const checkVerdicts = () => {
    let x = false;
    verdict.forEach((value, index)=>{
      if(value==='Correct'){
        x = true;
        return;
      }
    });
    return x;
  }

  const checkVerdictLength = () => {
    return !(verdict.length===0);
  }

  const checkInputsLength = () => {
    return !(inputs.length===0);
  }

  const checkQuestion = () => {
    return !(quesText.length===0);
  }


  const isValid = () => {
    if(!checkQuestion()){
      return `Question shouldn't be empty.`;
    }

    if(!checkInputsLength()){
      return `Options shouldn't be empty.`;
    }

    if(!checkVerdictLength()){
      return `Options' verdict shouldn't be empty.`;
    }

    console.log('verdict', checkVerdicts());
    if (!checkVerdicts()){
      return `Can't have all Incorrect options.`;
    }
    return '';
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    const msg = isValid();
    setErrorMessage(msg);
    if(msg.length!==0){
      return;
    }

    const result = await getTag(quesText);
    console.log(result[0]);

    const data = {
      tableName: "triviaquestion",
      operation: "CREATE",
      item: {
        id: uuidv4(),
        text: quesText,
        category: result[0],
        difficulty_level: diffVal,
        options: []
      }
    };

    inputs.forEach((input, index) => {
      data.item.options.push({ text: input, verdict: verdict[index], explanation: explanation
      [index] });
    });

    AWS.config.update({
    });
    

    const params = {
      FunctionName: 'arn:aws:lambda:us-east-1:940444391781:function:lambdaDynamoDBClient',
      Payload: JSON.stringify(data)
    };
    const lambda = new AWS.Lambda();

    try { 
      const response = await lambda.invoke(params).promise();
      console.log(response);
      window.location.href = '/';
    } catch (error) {
      console.log('Error:', error);
    }
    console.log(data.item.options);

    
  };

    return (
        <FormControl component="form" onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormLabel component="legend">Create Question</FormLabel>
          <FormGroup>
            <TextField label="Question Text" variant="outlined" 
            onChange={(event) => handleChangeQuesText(event.target.value)} 
            fullWidth />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={addInput}>
            Add Option
          </Button>
        </Grid>
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <div>
            {inputs.map((value, index) => (
              <div key={index} style={{marginBottom: '10px', display: 'flex', alignItems: 'center'}}>
                <input key={index} style={{marginRight: '5px'}} 
                  onChange={(event) => handleInputChange(index,event.target.value)}
                />
                <select onChange={(event) => handleVerdictChange(index, event.target.value)}>
                  {
                    question_result.map((iValue, iIndex)=>(
                      <option key={iIndex}>{iValue}</option>
                    ))
                  }
                </select>
                <input
                  style={{ marginLeft: '5px' }}
                  onChange={(event) => handleExplanationChange(index, event.target.value)}
                  placeholder="Explanation (optional)"
                />
              </div>
            ))}
          </div>
        </Grid>
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <FormGroup>
          <FormLabel component="legend">Difficulty Level</FormLabel>
            <select onChange={(event) => handleChangeDiffVal(event.target.value)}>
              {
                difficulty_level.map((value, index) => (
                  <option value={value} key={index}>{value}</option>
                ))
              }
            </select>
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </Grid>
    </FormControl>
    );
}

export default SubmitForm;
