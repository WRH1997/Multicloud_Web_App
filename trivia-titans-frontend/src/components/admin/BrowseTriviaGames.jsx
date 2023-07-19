import React, { useState, useEffect } from "react";
import { CircularProgress, Container, CssBaseline, Grid, Pagination, ThemeProvider, Typography } from '@mui/material';
import { appTheme } from '../../themes/theme';

import { useNavigate } from "react-router";
import invokeLambdaFunction from "../common/InvokeLambda";
import GameCard from './GameCard';

export default function BrowseTriviaGames() {

    const [triviaGames, setTriviaGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [gamesPerPage, setGamesPerPage] = useState(9);

    const navigate = useNavigate();
    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    const totalPages = Math.ceil(triviaGames.length / gamesPerPage);


    useEffect(() => {
        setLoading(true);
        fetchAllTriviaGames();
    }, []);

    const fetchAllTriviaGames = async () => {
        try {
            const jsonPayload = {
                tableName: "TriviaGames",
                operation: "SIMPLE_SCAN",
            };
            const data = await invokeLambdaFunction("SimpleScan_DynamoDBClient", jsonPayload)
            setTriviaGames(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };


    const handleGameClick = (id) => {
        navigate("/GameDetail", { state: { id } });
        console.log(id);
    };

    return (

        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <Container maxWidth="md" sx={{ paddingTop: 4 }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>

                        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ my: '1rem' }}>
                            <Grid item xs={12}>
                                <Typography variant="h2" color="primary">
                                    Browse Trivia Games
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" color="primary">
                                    You can browse all trivia games and view their details from here.
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={4}>
                            {triviaGames.slice(startIndex, endIndex).map((triviaGame) => (
                                <Grid item key={triviaGame} md={4} >
                                    <GameCard triviaGame={triviaGame} onGameClick={handleGameClick} />
                                </Grid>
                            ))}
                        </Grid>
                        
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={(event, value) => setCurrentPage(value)}
                            sx={{ display: 'flex', justifyContent: 'center', margin: 4 }} 
                        /></>
                )}
            </Container>
        </ThemeProvider >
    );
}