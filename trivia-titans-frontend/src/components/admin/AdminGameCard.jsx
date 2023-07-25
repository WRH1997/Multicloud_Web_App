import React from 'react';
import { Button, Card, CardActions, CardContent, CssBaseline, Grid, ThemeProvider, Typography } from '@mui/material';
import { appTheme } from '../../themes/theme';
import { useNavigate } from 'react-router';

const AdminGameCard = ({ triviaGame, onGameClick }) => {

    const navigate = useNavigate()

    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ minWidth: 275, minHeight: 175, justifyContent: 'center', margin: 4 }} onClick={() => onGameClick(triviaGame.GameId)}>

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
                            <b>Quiz Time:</b> {triviaGame.QuizTime} minutes
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            <b>StartDate:</b> {triviaGame.StartDate}
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            <b>EndDate:</b> {triviaGame.EndDate}
                        </Typography>

                    </CardContent>
                    
                </Card>
            </Grid>
        </ThemeProvider >
    );
};

export default AdminGameCard;
