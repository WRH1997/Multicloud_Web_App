import { Box, Button, CssBaseline, Grid, Paper, ThemeProvider, Typography, } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { appTheme } from "../../../themes/theme";

export default function IndividualGameResults(){

    const { state } = useLocation();
    const totalQs = state.totalQs;
    const correctQ = state.correctQ;
    const grade = state.grade;
    const answers = state.answers;

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
                <Grid item>
                    <Typography variant="h4" align="center" gutterBottom>
                        Individual Game Results
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
            </Grid>
        </ThemeProvider>
    );
}