import React, { useState } from 'react';
import { Grid, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Checkbox, TextField, Button, Card, Typography } from '@mui/material';
import axios from 'axios';

const CreateTriviaGame = () => {
    const [gameName, setGameName] = useState('');
    const [gameCategories, setGameCategories] = useState([]);
    const [difficultyLevel, setDifficultyLevel] = useState('');
    const [timeLimit, setTimeLimit] = useState('');

    const handleGameNameChange = (event) => {
        setGameName(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setGameCategories(event.target.value);
    };

    const handleDifficultyChange = (event) => {
        setDifficultyLevel(event.target.value);
    };

    const handleTimeLimitChange = (event) => {
        setTimeLimit(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Create an object with the form data
        const formData = {
            gameName,
            gameCategories,
            difficultyLevel,
            timeLimit,
        };

        axios.post('API_ENDPOINT_FROM_ENV', formData)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
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
                                    value={gameName}
                                    onChange={handleGameNameChange}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ margin: 2 }}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Game Category</FormLabel>
                                    <RadioGroup row value={gameCategories} onChange={handleCategoryChange}>
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
                                    <FormLabel component="legend">Difficulty Level</FormLabel>
                                    <RadioGroup row value={difficultyLevel} onChange={handleDifficultyChange}>
                                        <FormControlLabel value="Easy" control={<Radio />} label="Easy" />
                                        <FormControlLabel value="Medium" control={<Radio />} label="Medium" />
                                        <FormControlLabel value="Hard" control={<Radio />} label="Hard" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sx={{ margin: 2 }}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Time Limit Per Question</FormLabel>
                                    <RadioGroup row value={timeLimit} onChange={handleTimeLimitChange}>
                                        <FormControlLabel value="10" control={<Radio />} label="10 Seconds" />
                                        <FormControlLabel value="30" control={<Radio />} label="30 Seconds" />
                                        <FormControlLabel value="60" control={<Radio />} label="60 Seconds" />
                                    </RadioGroup>
                                </FormControl>
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
        </Grid>
    );
};

export default CreateTriviaGame;