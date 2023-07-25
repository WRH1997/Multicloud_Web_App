import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid, Card, Typography, List, ListItem, IconButton, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, Snackbar, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, ThemeProvider, CssBaseline } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DeleteTriviaGame from "./DeleteTriviaGame";
import invokeLambdaFunction from "../../common/InvokeLambda";
import MuiAlert from "@mui/material/Alert";
import { appTheme } from '../../../themes/theme';

const UpdateTriviaGame = () => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const [triviaGames, setTriviaGames] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deletingTriviaGameId, setDeletingTriviaGameId] = useState(null);
    const [deletingTriviaTimestamp, setDeletingTriviaTimestamp] = useState(null);

    const [formData, setFormData] = useState({
        GameId: '',
        Timestamp: '',
        GameName: '',
        Description: '',
        GameCategory: '',
        GameDifficulty: '',
        QuizTime: '',
        StartDate: '',
        EndDate: '',
    });

    useEffect(() => {
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
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage(
                "Error in fetching Trivia Games: " + error,
            );
            setSnackbarOpen(true);
        }
    };

    const handleEditClick = (id) => {
        // Find the selected game from the games array
        const selectedTriviaGame = triviaGames.find(triviaGame => triviaGame.GameId === id);

        // Populate the form with the game data
        const initialFormData = {
            GameId: selectedTriviaGame.GameId,
            Timestamp: selectedTriviaGame.Timestamp,
            GameName: selectedTriviaGame.GameName,
            Description: selectedTriviaGame.Description,
            GameCategory: selectedTriviaGame.GameCategory,
            GameDifficulty: selectedTriviaGame.GameDifficulty,
            QuizTime: selectedTriviaGame.QuizTime,
            StartDate: selectedTriviaGame.StartDate,
            EndDate: selectedTriviaGame.EndDate,
        };
        setFormData(initialFormData);
        setOpenEditForm(true);
    };

    const handleDeleteClick = (id, timestamp) => {
        setDeletingTriviaGameId(id);
        setDeletingTriviaTimestamp(timestamp);
        setOpenDeleteModal(true);
    };

    const handleDeleteModalClose = () => {
        setDeletingTriviaGameId(null);
        setDeletingTriviaTimestamp(null);
        setOpenDeleteModal(false);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const handleFormClose = () => {
        setOpenEditForm(false);
        setFormData({
            GameId: '',
            Timestamp: '',
            GameName: '',
            Description: '',
            GameCategory: '',
            GameDifficulty: '',
            QuizTime: '',
            StartDate: '',
            EndDate: '',
        });
    };

    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <Grid container sx={{ margin: 5 }}>
                <Grid item xs={1} md={4}></Grid>
                <Grid item xs={10} md={4}>
                    <Card sx={{ padding: 2 }}>
                        <Grid container direction="column" spacing={2}>

                            <Grid item>
                                <Typography variant="h3" align="center" gutterBottom>
                                    Edit/Delete Trivia Game
                                </Typography>
                            </Grid>

                            <Grid item>
                                <TextField
                                    fullWidth
                                    label="Search Games"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </Grid>

                            <Grid item>
                                <ConfigurableListOfGames triviaGames={triviaGames} searchTerm={searchTerm} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                {openDeleteModal && (
                    <DeleteTriviaGame triviaGameID={deletingTriviaGameId} triviaGameTimestamp={deletingTriviaTimestamp} open={openDeleteModal} onClose={handleDeleteModalClose} setSnackbarOpen={setSnackbarOpen} setSnackbarMessage={setSnackbarMessage} setSnackbarSeverity={setSnackbarSeverity} />
                )}
                <EditTriviaGameForm open={openEditForm} onClose={handleFormClose} formData={formData} setFormData={setFormData} setSnackbarOpen={setSnackbarOpen} setSnackbarMessage={setSnackbarMessage} setSnackbarSeverity={setSnackbarSeverity} />

                <Snackbar open={snackbarOpen} autoHideDuration={10000} onClose={handleSnackbarClose}>
                    <MuiAlert elevation={6} variant="filled" // @ts-ignore
                        severity={snackbarSeverity} onClose={handleSnackbarClose}>
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>

            </Grid>
        </ThemeProvider >
    )
};


const ConfigurableListOfGames = ({ triviaGames, searchTerm, onEditClick, onDeleteClick }) => {
    let filteredTriviaGames = []
    if (triviaGames && triviaGames.length > 0) {
        filteredTriviaGames = triviaGames.filter((triviaGames) =>
            triviaGames.GameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            triviaGames.GameCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
            triviaGames.GameDifficulty.toLowerCase().includes(searchTerm.toLowerCase())
        );

    }
    return (
        <List sx={{ padding: 0 }}>
            {filteredTriviaGames.map((triviaGame) => (
                <ListItem key={triviaGame.GameId} sx={{ paddingLeft: 0 }}>
                    <ListItemText primary={<Typography noWrap>{triviaGame.GameName}</Typography>}
                        secondary={triviaGame.GameCategory} />
                    <ListItemSecondaryAction sx={{ marginRight: 0 }}>
                        <IconButton onClick={() => onEditClick(triviaGame.GameId)} edge="end" aria-label="edit">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => onDeleteClick(triviaGame.GameId, triviaGame.Timestamp)} edge="end" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
};

const EditTriviaGameForm = ({ open, onClose, formData, setFormData, setSnackbarOpen, setSnackbarMessage, setSnackbarSeverity }) => {

    const handleChange = async (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        update();
        onClose();
    };

    const update = async () => {
        try {
            const jsonPayload =
            {
                "tableName": "TriviaGames",
                "operation": "UPDATE",
                "key": {
                    "GameId": formData.GameId,
                    "Timestamp": formData.Timestamp
                },
                "updateExpression": "set GameName = :GameName, Description = :Description, GameCategory = :GameCategory, GameDifficulty = :GameDifficulty, QuizTime = :QuizTime, StartDate = :StartDate, EndDate = :EndDate",
                "expressionAttributeValues": {
                    ":GameName": formData.GameName,
                    ":Description": formData.Description,
                    ":GameCategory": formData.GameCategory,
                    ":GameDifficulty": formData.GameDifficulty,
                    ":QuizTime": formData.QuizTime,
                    ":StartDate": formData.StartDate,
                    ":EndDate": formData.EndDate
                }
            }

            const data = await invokeLambdaFunction("Update_DynamoDBClient", jsonPayload)
            console.log(data)

            setSnackbarSeverity('success');
            setSnackbarMessage(
                'Trivia Game Updated!',
            );
            setSnackbarOpen(true);

            setFormData({ GameName: "", Description: "", GameCategory: "", GameDifficulty: "", QuizTime: "", StartDate: "", EndDate: "" })

        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage(
                "Error in Updating Trivia Games: " + error,
            );
            setSnackbarOpen(true);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs">
            <DialogTitle>Edit Trivia Game</DialogTitle>
            <DialogContent>
                <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sx={{ margin: 2 }}>
                            <TextField
                                required
                                fullWidth
                                label="Game Name"
                                name="GameName"
                                value={formData.GameName}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ margin: 2 }}>
                            <TextField
                                required
                                fullWidth
                                minRows={4}
                                label="Game Description"
                                name="Description"
                                value={formData.Description}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ margin: 2 }}>
                            <TextField
                                required
                                fullWidth
                                label="Game Availability Start Date"
                                name="StartDate"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={formData.StartDate}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ margin: 2 }}>
                            <TextField
                                required
                                fullWidth
                                label="Game Availability End Date"
                                name="EndDate"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={formData.EndDate}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ margin: 2 }}>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                label="Quiz Time Limit (in minutes)"
                                name="QuizTime"
                                value={formData.QuizTime}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ margin: 2 }}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Game Category</FormLabel>
                                <RadioGroup row name="GameCategory" value={formData.GameCategory} onChange={handleChange}>
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
                                <FormLabel component="legend">Game Difficulty Level</FormLabel>
                                <RadioGroup row name="GameDifficulty" value={formData.GameDifficulty} onChange={handleChange}>
                                    <FormControlLabel value="Easy" control={<Radio />} label="Easy" />
                                    <FormControlLabel value="Medium" control={<Radio />} label="Medium" />
                                    <FormControlLabel value="Hard" control={<Radio />} label="Hard" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>Update</Button>
                        </Grid>
                    </Grid>

                </form>
            </DialogContent>
        </Dialog>
    );
};


export {
    UpdateTriviaGame,
    ConfigurableListOfGames,
    EditTriviaGameForm,
}