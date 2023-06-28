import React, { useEffect, useState } from 'react';
import { Grid, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Button, Card, Typography, Snackbar, ThemeProvider, CssBaseline, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import invokeLambdaFunction from "../../common/InvokeLambda";
import { v4 as uuidv4 } from 'uuid';
import { appTheme } from '../../../themes/theme';

const CreateTriviaGame = () => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const [formData, setFormData] = useState({
        GameName: '',
        GameCategory: '',
        GameDifficulty: '',
        PerQuestionTime: '',
        StartDate: '',
        EndDate: '',
        Questions: []
    });
    const [triviaQuestions, setTriviaQuestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedQuestions, setSelectedQuestions] = useState([]);

    const handleQuestionToggle = (questionId) => {
        if (selectedQuestions.includes(questionId)) {
          setSelectedQuestions((prevSelectedQuestions) =>
            prevSelectedQuestions.filter((id) => id !== questionId)
          );
        } else {
          setSelectedQuestions((prevSelectedQuestions) => [...prevSelectedQuestions, questionId]);
        }
    };

    
    const handleChange = async (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        if(selectedQuestions.length === 0){
            setSnackbarMessage("Please select at least one question for the Trivia Game")
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        const jsonPayload = {
            GameId: uuidv4(),
            GameName: formData.GameName,
            GameCategory: formData.GameCategory,
            GameDifficulty: formData.GameDifficulty,
            PerQuestionTime: formData.PerQuestionTime,
            StartDate: formData.StartDate,
            EndDate: formData.EndDate,
            Questions: selectedQuestions
        };
        
        try {
            const lambdaResponse = await invokeLambdaFunction("CreateTriviaGame", jsonPayload);

            if (lambdaResponse && lambdaResponse.statusCode === 200) {
                setSnackbarMessage(lambdaResponse.message);
                setSnackbarSeverity('success');                
                window.location.reload();
                
            } else {
                setSnackbarMessage(lambdaResponse.message + ": " + lambdaResponse.error);
                setSnackbarSeverity('error');
            }
        } catch (error) {
            setSnackbarMessage("Error! Check Logs!")
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
    };

    useEffect(() => {
        fetchAllTriviaQuestions();
    }, []);

    const fetchAllTriviaQuestions = async () => {
        try {
            const jsonPayload = {
                tableName: "triviaquestion",
                operation: "SIMPLE_SCAN",
            };
            const data = await invokeLambdaFunction("lambdaDynamoDBClient", jsonPayload)
            setTriviaQuestions(data);
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage(
                "Error in fetching Trivia Games: " + error,
            );
            setSnackbarOpen(true);
        }
    };


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    }


    return (
        <ThemeProvider theme={appTheme}>
        <CssBaseline />
            <Grid container sx={{ margin: 5 }}>
                <Grid item xs={1} md={4}></Grid>
                <Grid item xs={10} md={4}>
                    <Card sx={{ padding: 2 }}>
                        <Grid container direction="column" spacing={2}>

                            <Grid item sx={{ margin: 2 }}>
                                <Typography variant="h3" align="center" gutterBottom>
                                    Create Trivia Game
                                </Typography>
                            </Grid>

                            <form onSubmit={handleSubmit}>
                                <Grid item xs={12} sx={{ margin: 2 }}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Game Name"
                                        name="GameName"
                                        value={formData.GameName}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} sx={{ margin: 2 }}>
                                    <TextField
                                        
                                        fullWidth
                                        label="Game Availability Start Date"
                                        name="StartDate"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={formData.StartDate}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ margin: 2 }}>
                                    <TextField
                                        
                                        fullWidth
                                        label="Game Availability End Date"
                                        name="EndDate"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={formData.EndDate}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} sx={{ margin: 2 }}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Game Category</FormLabel>
                                        <RadioGroup row name="GameCategory" value={formData.GameCategory} onChange={handleChange}>
                                            <FormControlLabel value="General" control={<Radio />} label="General" />
                                            <FormControlLabel value="Movies" control={<Radio />} label="Movies" />
                                            <FormControlLabel value="Music" control={<Radio />} label="Music" />
                                            <FormControlLabel value="Books" control={<Radio />} label="Books" />
                                            <FormControlLabel value="Sports" control={<Radio />} label="Sports" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sx={{ margin: 2 }}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Game Difficulty Level</FormLabel>
                                        <RadioGroup row name="GameDifficulty" value={formData.GameDifficulty} onChange={handleChange}>
                                            <FormControlLabel value="Easy" control={<Radio />} label="Easy" />
                                            <FormControlLabel value="Medium" control={<Radio />} label="Medium" />
                                            <FormControlLabel value="Hard" control={<Radio />} label="Hard" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sx={{ margin: 2 }}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Time Limit Per Question</FormLabel>
                                        <RadioGroup row name="PerQuestionTime" value={formData.PerQuestionTime} onChange={handleChange}>
                                            <FormControlLabel value="10" control={<Radio />} label="10 Seconds" />
                                            <FormControlLabel value="30" control={<Radio />} label="30 Seconds" />
                                            <FormControlLabel value="60" control={<Radio />} label="60 Seconds" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                
                                <hr></hr>
                                {selectedQuestions && (
                                    <><Grid item xs={12} sx={{ margin: 2 }}>
                                        <Typography variant="h4" align="center">
                                            Questions Selected: {selectedQuestions.length}
                                        </Typography>
                                    </Grid></>
                                )}    
                                <hr></hr>
                                
                                <Grid item xs={12} sx={{ margin: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Search Questions"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            variant="standard" />
                                    </Grid>
                            
                                
                                <Grid item xs={12} sx={{ margin: 2 }}>
                                    <ListOfFilteredQuestions triviaQuestions={triviaQuestions} searchTerm={searchTerm} handleQuestionToggle={handleQuestionToggle} selectedQuestions={selectedQuestions}/>
                                </Grid>

                                <Grid item xs={12} sx={{ margin: 2 }}>
                                    <Button variant="contained" color="primary" type="submit" fullWidth>
                                        Submit
                                    </Button>
                                </Grid>
                            </form>
                        </Grid>
                    </Card>
                </Grid>
                <Snackbar open={snackbarOpen} autoHideDuration={10000} onClose={handleSnackbarClose}>
                    <MuiAlert elevation={6} variant="filled" // @ts-ignore 
                    severity={snackbarSeverity} onClose={handleSnackbarClose}>
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>
            </Grid>
        </ThemeProvider>
    );
};

const ListOfFilteredQuestions = ({ triviaQuestions, searchTerm, handleQuestionToggle, selectedQuestions }) => {
    let filteredTriviaQuestions = [];
    if (triviaQuestions && triviaQuestions.length > 0) {
      filteredTriviaQuestions = triviaQuestions.filter((triviaQuestion) =>
        triviaQuestion.question_text.toLowerCase().includes(searchTerm.toLowerCase()) || 
        triviaQuestion.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        triviaQuestion.difficulty_level.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return (
      <List sx={{ padding: 0 }}>
        {filteredTriviaQuestions.map((triviaQuestion) => {
          const isSelected = selectedQuestions.includes(triviaQuestion.id);
          return (
            <ListItem key={triviaQuestion.id} sx={{ paddingLeft: 0 }}>
              <ListItemText
                primary={<Typography>{triviaQuestion.question_text}</Typography>}
                secondary={triviaQuestion.category + " | " + triviaQuestion.difficulty_level}
              />
  
              <ListItemSecondaryAction sx={{ marginLeft: 2 }}>
                <Button
                  variant={isSelected ? "outlined" : "contained"}
                  size="small"
                  onClick={() => handleQuestionToggle(triviaQuestion.id)}
                >
                  {isSelected ? "REMOVE" : "ADD"}
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    );
};

export default CreateTriviaGame;