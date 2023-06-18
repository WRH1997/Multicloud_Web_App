import React, { useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import notifyJoinTeam from "./NotifyJoinTeam";

const TeamPage = () => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const sendEmailInvite = () => {
        // Add your code here to handle the invite
        console.log(`Invitation sent to: ${email}`);
        notifyJoinTeam('ad368540@dal.ca','TestTeam');
        setEmail("");
        setOpen(false);
    };

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
            >
                Create a new Team
            </Button>

            <TextField
                label="Search for Players"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>
                    )
                }}
            />

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Invite to Team</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={sendEmailInvite} color="primary">
                        Send Invite
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TeamPage;