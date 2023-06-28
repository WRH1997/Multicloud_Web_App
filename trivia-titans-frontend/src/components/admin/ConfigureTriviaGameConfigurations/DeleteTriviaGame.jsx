import React from 'react';
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import invokeLambda from "../../common/InvokeLambda";

const DeleteTriviaGame = ({ triviaGameID, triviaGameTimestamp, open, onClose, setSnackbarOpen, setSnackbarMessage, setSnackbarSeverity }) => {

    const handleDelete = async () => {
        try {
            const jsonPayload =
                {
                    "tableName": "TriviaGames",
                    "operation": "DELETE",
                    "key": {
                        "GameId": triviaGameID,
                        "Timestamp": triviaGameTimestamp
                    },
                };

            const data = await invokeLambda("lambdaDynamoDBClient", jsonPayload)
            console.log(data)

            setSnackbarSeverity('success');
            setSnackbarMessage(
                'Trivia Game Deleted!',
            );
            setSnackbarOpen(true);
            onClose();

        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage(
                "Error in Deleting Trivia Games: " + error,
            );
            setSnackbarOpen(true);
        }
    };

    return (
        <Dialog open={true}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete this Game?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>No</Button>
                <Button onClick={handleDelete}>Yes</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteTriviaGame;
