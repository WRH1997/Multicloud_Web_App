import React, { useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import notifyJoinTeam from "./NotifyJoinTeam";
import invokeLambdaFunction from "../common/InvokeLambda";
import {getAuth} from "firebase/auth";

const TeamPage = () => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [teamName, setTeamName] = useState("");
    const [createTeamOpen, setCreateTeamOpen] = useState(false);
    const handleTeamInviteDialogOpen = () => {
        setOpen(true);
    };

    const handleTeamInviteDialogClose = () => {
        setOpen(false);
    };
    const handleCreateTeamDialogOpen = () => {
        setCreateTeamOpen(true);
    };
    const handleCreateTeamDialogClose = () => {
        setCreateTeamOpen(false);
    };
    const createNewTeam = () =>
    {
        console.log(`creating new team with name ${teamName}`);
        const jsonPayload = {
            tableName: "teamStats",
            operation: "CREATE",
            item: {
                teamName: teamName,
                totalGames: 0,
                winLossRatio: -1,
                totalScore: 0
            }
        };
        console.log(`Joining team ${teamName} as ADMIN`);
        const auth = getAuth();
        const jsonPayload2 = {
            tableName: "teamMembers",
            operation: "CREATE",
            item: {
                playerEmail: auth.currentUser.email,
                teamName: teamName,
                teamPermission : 'ADMIN'
            }
        };
        const lambdaResponse=invokeLambdaFunction('lambdaDynamoDBClient', jsonPayload2);
        setTeamName("");
        setCreateTeamOpen(false);
    }

    const sendEmailInvite = () => {
        // Add your code here to handle the invite
        console.log(`Invitation sent to: ${email}`);
        notifyJoinTeam(email,'TestTeam');
        setEmail("");
        setOpen(false);
    };

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleTeamInviteDialogOpen}
            >
                Invite Players to team
            </Button>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateTeamDialogOpen}
            >
                Create New Team
            </Button>
            <Dialog open={open} onClose={handleTeamInviteDialogClose} aria-labelledby="form-dialog-title">
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
                    <Button onClick={handleTeamInviteDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={sendEmailInvite} color="primary">
                        Send Invite
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={createTeamOpen} onClose={handleCreateTeamDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create New Team</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="teamName"
                        label="Team Name"
                        type="email"
                        fullWidth
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreateTeamDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={createNewTeam} color="primary">
                        Create new Team
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
export default TeamPage;