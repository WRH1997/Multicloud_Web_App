import React, { useState } from 'react';
import { Grid, Card, Typography, CardContent, ThemeProvider, CssBaseline, Container, CardMedia } from '@mui/material';
import { appTheme } from '../../themes/theme';
import { useNavigate } from 'react-router';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';

const ConfigureTriviaGames = () => {

    const navigate = useNavigate();

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <Container maxWidth="md">

                <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ my: '1rem' }}>
                    <Grid item xs={12}>
                        <Typography variant="h2" color="primary">
                            Configure Trivia Games
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" color="primary">
                            You can browse all trivia games, create new trivia games, update existing games, or delete trivia games from here.
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container justifyContent="center" alignItems="center" spacing={3} sx={{ marginTop: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ height: '100%', cursor: 'pointer' }}
                            onClick={() => handleCardClick('/BrowseTriviaGames')}>
                            <CardMedia
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    pt: 8}}>
                                <ManageSearchIcon sx={{ fontSize: '10rem' }} />
                            </CardMedia>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    Browse All Games
                                </Typography>
                                <Typography color="textSecondary">
                                    Browse all Trivia Titans Games
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ height: '100%', cursor: 'pointer' }}
                            onClick={() => handleCardClick('/CreateTriviaGame')}>
                            <CardMedia
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    pt: 8}}>
                                <AddToPhotosOutlinedIcon sx={{ fontSize: '10rem' }} />
                                </CardMedia>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    Create New Game
                                </Typography>
                                <Typography color="textSecondary">
                                    Create a new Trivia Titans Game
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ height: '100%', cursor: 'pointer' }}
                            onClick={() => handleCardClick('/UpdateTriviaGame')}>
                            <CardMedia
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    pt: 8}}>
                                <SettingsSuggestOutlinedIcon sx={{ fontSize: '10rem' }} />
                                </CardMedia>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    Edit / Delete Game
                                </Typography>
                                <Typography color="textSecondary">
                                    Update or Delete a Trivia Game
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider >
    );
};

export default ConfigureTriviaGames;
