import { Button, TextField, FormControl, FormLabel, FormGroup, Grid } from '@mui/material';
import { useState } from 'react';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';


const SubmitForm = () => {
  const difficulty_level = ['Hard', 'Medium', 'Easy'];
  const category = ['Sports', 'Movies'];
  const question_result = ['Incorrect','Correct'];

  const [inputs, setInputs] = useState([]);
  const [verdict, setVerdict] = useState([]);
  const [quesText, setQuesText] = useState('');
  const [categVal, setCategVal] = useState(category[0]);
  const [diffVal,  setDiffVal] = useState(difficulty_level[0]);


  const addInput = () => {
    setInputs([...inputs, '']);
    setVerdict([...verdict, question_result[0]]);
  };

  const handleChangeQuesText = (text) => {
    setQuesText(text);
  }

  const handleChangeCategVal = (text) => {
    setCategVal(text);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      tableName: "triviaquestion",
      operation: "CREATE",
      item: {
        id: uuidv4(),
        text: quesText,
        category: categVal,
        difficulty_level: diffVal,
        options: inputs.map((input, index) => ({text: input, verdict: verdict[index]}))
      }
    };

    AWS.config.update({
      accessKeyId: 'AKIA5V5W2TFS6EEFZWMW',
      secretAccessKey: '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',
      region: 'us-east-1'
    });

    const params = {
      FunctionName: 'arn:aws:lambda:us-east-1:940444391781:function:lambdaDynamoDBClient',
      Payload: JSON.stringify(data)
    };
    const lambda = new AWS.Lambda();

    try {
      const response = await lambda.invoke(params).promise();
      console.log(response);
    } catch (error) {
      console.log('Error:', error);
    }
    console.log(data);
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
              </div>
            ))}
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
          <FormGroup>
          <FormLabel component="legend">Category</FormLabel>
            <select onChange={(event) => handleChangeCategVal(event.target.value)}>
              {
                category.map((value, index) => (
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
    </FormControl>
    );
}

export default SubmitForm;
