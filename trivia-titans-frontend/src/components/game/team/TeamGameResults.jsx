import { Box, Button, CssBaseline, Grid, Paper, ThemeProvider, Typography, } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { appTheme } from "../../../themes/theme";
import Chat from "components/common/ChatBox";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const TeamGameResults = () => {

    const { state } = useLocation();
    const totalQs = state.totalQs;
    const correctQ = state.correctQ;
    const grade = state.grade;
    const answers = state.answers;

    // Use useEffect to reload the page once and destroy previous call stack and game session on result component mount
    useEffect(() => {
        toast.success("Game Results Submitted! Well done (Maybe?) ");
        setTimeout(function () {
            toast.success("Going Back to Lobby... ");
        }, 60000);
    }, []);

    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{ margin: 5 }}
            >

                <ToastContainer />
                <Grid item>
                    <Typography variant="h4" align="center" gutterBottom>
                        Team Game Results
                    </Typography>
                </Grid>

                <Grid item>
                    <Paper elevation={3} sx={{ padding: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Score: {correctQ}/{totalQs}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Grade: {grade.toFixed(2)}%
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item>
                    <Typography variant="h5" gutterBottom>
                        Answers:
                    </Typography>
                    <Box sx={{ marginBottom: 2 }}>
                        {answers.map((answer, index) => (
                            <Paper
                                key={index}
                                elevation={3}
                                sx={{
                                    padding: 2,
                                    backgroundColor: answer.status === "Correct" ? "#d7f5e6" : "#ffebee",
                                }}
                            >
                                <Typography variant="subtitle1" gutterBottom>
                                    Question {index + 1}:
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Your Answer: {answer.yourAnswer}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Correct Answer: {answer.correctAnswer}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    color={answer.status === "Correct" ? "primary" : "error"}
                                >
                                    Result: {answer.status}
                                </Typography>
                                {answer && answer.explanation  && (
                                    <Typography variant="body1" gutterBottom>
                                        Explanation: {answer.explanation}
                                    </Typography>
                                )}

                            </Paper>
                        ))}
                    </Box>
                </Grid>

                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/"
                        size="large"
                    >
                        Back to Home
                    </Button>
                </Grid>
                <Grid item xs={1} md={4}>
                    <Grid item sx={{ margin: 2 }}>
                        <Chat />
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default TeamGameResults;