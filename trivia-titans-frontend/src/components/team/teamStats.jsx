import React, {useContext, useState} from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import notifyJoinTeam from "./NotifyJoinTeam";
import invokeLambdaFunction from "../common/InvokeLambda";
import {getAuth} from "firebase/auth";
import {AuthContext} from "../common/AuthContext";

const TeamPage = () => {
    const currentUser = useContext(AuthContext);
    console.log(currentUser);
    const [open, setOpen] = useState(false);
    const [isTeamPlayer, setIsTeamPlayer] = useState(false);
    const [email, setEmail] = useState("");
    const [teamName, setTeamName] = useState("");
    const [createTeamOpen, setCreateTeamOpen] = useState(false);
    let teamData = {};
    let teamMembers = null;
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
        invokeLambdaFunction('lambdaDynamoDBClient', jsonPayload);
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
    const fetchCurrentTeamData = () =>
    {

        const auth = getAuth();
        const jsonPayload = {
            tableName: "teamMembers",
            operation: "READ",
            key: {
                playerEmail: auth.currentUser.email,
            }
        };
        teamData = invokeLambdaFunction('lambdaDynamoDBClient', jsonPayload);
        console.log(teamData);
    }

    function removeTeamMember(member) {

    }

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
            {isTeamPlayer && (
                <div className="team-stats">
                    <p><strong>Score:</strong> {teamData.totalScore}</p>
                    <p><strong>Win/Loss Ratio:</strong> teamData.winLossRatio</p>
                    <p><strong>Total Games:</strong> teamData.winLossRatio</p>
                    <h3>Team Members:</h3>
                    {teamMembers.map((member) => (
                        <div key={member}>
                            <span>{member}</span>
                            <button onClick={() => removeTeamMember(member)}>
                                Remove from Team
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {!isTeamPlayer && (
                <div className="team-prompt">
                    <p><strong> Please join a team or create one to view Team Statistics, You can only join teams Upon invitation</strong></p>
                </div>
            )}

        </div>

    );
};
export default TeamPage;