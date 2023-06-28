import React from 'react';
import { Button, Card, CardActions, CardContent, CssBaseline, Grid, ThemeProvider, Typography } from '@mui/material';
import { appTheme } from '../../themes/theme';

const GameCard = ({ triviaGame, onGameClick }) => {

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
                            Category: {triviaGame.GameCategory}
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            Difficulty: {triviaGame.GameDifficulty}
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            StartDate: {triviaGame.StartDate}
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            EndDate: {triviaGame.EndDate}
                        </Typography>

                    </CardContent>

                    <CardActions sx={{ justifyContent: 'right' }}>
                        <Button color="secondary" variant="outlined" size="small">PLAY</Button>
                        <Button  variant="contained" size="small">VIEW DETAILS</Button>
                    </CardActions>

                </Card>
            </Grid>
        </ThemeProvider >
    );
};

export default GameCard;
