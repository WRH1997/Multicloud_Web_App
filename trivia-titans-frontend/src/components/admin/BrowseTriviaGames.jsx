import React, { useState, useEffect } from "react";
import { CircularProgress, Container, CssBaseline, Grid, MenuItem, Pagination, Select, ThemeProvider, Typography } from '@mui/material';
import { appTheme } from '../../themes/theme';

import { useNavigate } from "react-router";
import invokeLambdaFunction from "../common/InvokeLambda";
import AdminGameCard from './AdminGameCard';

export default function BrowseTriviaGames() {

    const [triviaGames, setTriviaGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');

    const gamesPerPage = 3;

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



    const handleCategoryChange = async (value) => {
        setSelectedCategory(value);
        const jsonPayload = {
            tableName: "TriviaGames",
            operation: "SCAN_WITH_FILTER_EXPR",
            filterExpression: buildFilterExpression(value, selectedDifficulty),
            expressionAttributeValues: buildExpressionAttributeValues(value, selectedDifficulty)
        };
        try {
            setLoading(true);
            const data = await invokeLambdaFunction("ScanWithFilterExpr_DynamoDBClient", jsonPayload);
            setTriviaGames(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleDifficultyChange = async (value) => {
        setSelectedDifficulty(value);
        const jsonPayload = {
            tableName: "TriviaGames",
            operation: "SCAN_WITH_FILTER_EXPR",
            filterExpression: buildFilterExpression(selectedCategory, value),
            expressionAttributeValues: buildExpressionAttributeValues(selectedCategory, value)
        };
        try {
            setLoading(true);
            const data = await invokeLambdaFunction("ScanWithFilterExpr_DynamoDBClient", jsonPayload);
            setTriviaGames(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const buildFilterExpression = (category, difficulty) => {
        if (category === "all" && difficulty === "all"){
            fetchAllTriviaGames();
        }
        let filterExpression = "";
        if (category !== "all") {
            filterExpression += `GameCategory = :category`;
        }
        if (difficulty !== "all") {
            filterExpression += filterExpression ? " AND " : "";
            filterExpression += `GameDifficulty = :difficulty`;
        }
        return filterExpression;
    };

    const buildExpressionAttributeValues = (category, difficulty) => {
        const expressionAttributeValues = {};
        if (category !== "all") {
            expressionAttributeValues[":category"] = {
                S: category
            };
        }
        if (difficulty !== "all") {
            expressionAttributeValues[":difficulty"] = {
                S: difficulty
            };
        }
        if (Object.keys(expressionAttributeValues).length === 0) {
            return null;
        }
        return expressionAttributeValues;
    };

    const handleGameClick = (id) => {
        navigate("/UpdateTriviaGame", { state: { id } });
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

                            <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ my: '1rem' }}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <label>Game Categories</label>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        fullWidth
                                        name="category">
                                        <MenuItem value="all">All Categories</MenuItem>
                                        <MenuItem value="General">General</MenuItem>
                                        <MenuItem value="Movies">Movies</MenuItem>
                                        <MenuItem value="Music">Music</MenuItem>
                                        <MenuItem value="Books">Books</MenuItem>
                                        <MenuItem value="Sports">Sports</MenuItem>
                                    </Select>
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <label>Game Difficulty</label>
                                    <Select
                                        value={selectedDifficulty}
                                        onChange={(e) => handleDifficultyChange(e.target.value)}
                                        fullWidth
                                        name="difficulty">
                                        <MenuItem value="all">All Difficulties</MenuItem>
                                        <MenuItem value="Easy">Easy</MenuItem>
                                        <MenuItem value="Medium">Medium</MenuItem>
                                        <MenuItem value="Hard">Hard</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>


                            {triviaGames.slice(startIndex, endIndex).map((triviaGame) => (
                                <Grid item key={triviaGame} md={4} >
                                    <AdminGameCard triviaGame={triviaGame} onGameClick={handleGameClick} />
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