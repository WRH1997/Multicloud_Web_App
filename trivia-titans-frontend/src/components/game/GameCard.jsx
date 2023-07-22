import React from 'react';
import { useNavigate } from "react-router";
import { Button, Card, CardActions, CardContent, CssBaseline, Grid, ThemeProvider, Typography } from '@mui/material';
import { appTheme } from '../../themes/theme';

const GameCard = ({ triviaGame }) => {

    const navigate = useNavigate();

    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ minWidth: 275, minHeight: 175, justifyContent: 'center', margin: 4 }}>

                    <CardContent sx={{ justifyContent: 'center' }}>

                        <Typography variant="h6" component="h2" noWrap>
                            {triviaGame.GameName}
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            <b>Description:</b> {triviaGame.Description}
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            <b>Category:</b> {triviaGame.GameCategory}
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            <b>Difficulty:</b> {triviaGame.GameDifficulty}
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            <b> Quiz Time:</b> {triviaGame.QuizTime} minutes
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            <b> StartDate:</b> {triviaGame.StartDate}
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            <b> EndDate:</b> {triviaGame.EndDate}
                        </Typography>

                    </CardContent>

                    <CardActions sx={{ justifyContent: 'right' }}>
                        <Button color="secondary" variant="outlined" size="small" onClick={() => navigate("/IndividualGame")}>PLAY INDIVIDUALLY</Button>
                        <Button variant="contained" size="small" onClick={() => navigate("/TeamGameLobby")}>PLAY WITH TEAM</Button>
                    </CardActions>

                </Card>
            </Grid>
        </ThemeProvider >
    );
};

export default GameCard;
