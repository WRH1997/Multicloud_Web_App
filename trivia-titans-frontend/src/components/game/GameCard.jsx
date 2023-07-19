import React from 'react';
import { Button, Card, CardActions, CardContent, CssBaseline, Grid, ThemeProvider, Typography } from '@mui/material';
import { appTheme } from '../../themes/theme';

const GameCard = ({ triviaGame, onGameClick }) => {

    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ minWidth: 275, minHeight: 175, justifyContent: 'center', margin: 4 }} onClick={() => onGameClick(triviaGame.GameId.S)}>

                    <CardContent sx={{ justifyContent: 'center' }}>

                        <Typography variant="h6" component="h2" noWrap>
                            {triviaGame.GameName.S}
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            Category: {triviaGame.GameCategory.S}
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            Difficulty: {triviaGame.GameDifficulty.S}
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            StartDate: {triviaGame.StartDate.S}
                        </Typography>

                        <Typography variant="subtitle1" component="h2">
                            EndDate: {triviaGame.EndDate.S}
                        </Typography>

                    </CardContent>

                    <CardActions sx={{ justifyContent: 'right' }}>
                        <Button color="secondary" variant="outlined" size="small">PLAY INDIVIDUALLY</Button>
                        <Button variant="contained" size="small">PLAY WITH TEAM</Button>
                    </CardActions>

                </Card>
            </Grid>
        </ThemeProvider >
    );
};

export default GameCard;
