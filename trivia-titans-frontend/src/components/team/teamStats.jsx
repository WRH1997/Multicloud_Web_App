import React, {useContext, useEffect, useState} from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import notifyJoinTeam from "./NotifyJoinTeam";
import invokeLambdaFunction from "../common/InvokeLambda";
import {AuthContext} from "../common/AuthContext";
import {useNavigate} from "react-router";
import {fetchMemberTeamData} from "../common/teamContext";

const TeamPage = () => {
    const currentUser = useContext(AuthContext);
    const [teamName,setTeamName]=useState("");
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    let isTeamPlayer = false;
    const [email, setEmail] = useState("");
    const [createTeamOpen, setCreateTeamOpen] = useState(false);
    let teamData = {};
    let teamMembers = null;
    useEffect(() => {
        if (!currentUser) {
            // if user not logged in, navigate to login
            navigate("/login");
        }
    }, [currentUser, navigate]);
    if (!currentUser) {
        // render nothing if user not logged in
        return null;
    }

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
    const createNewTeam = async () => {
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
        await invokeLambdaFunction('lambdaDynamoDBClient', jsonPayload);
        console.log(`Joining team ${teamName} as ADMIN`);
        const jsonPayload2 = {
            tableName: "teamMembers",
            operation: "CREATE",
            item: {
                playerEmail: currentUser.email,
                teamName: teamName,
                teamPermission: 'ADMIN'
            }
        };
        await invokeLambdaFunction('lambdaDynamoDBClient', jsonPayload2);
    }

    const sendEmailInvite = () => {
        // Add your code here to handle the invite
        console.log(`Invitation sent to: ${email}`);
        notifyJoinTeam(email, 'TestTeam');
        setEmail("");
        setOpen(false);
    };
    const teamPlayerData = fetchMemberTeamData(currentUser);
    if(teamPlayerData) {
        isTeamPlayer = true;
    }
    function removeTeamMember(member) {


    }

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon/>}
                onClick={handleTeamInviteDialogOpen}
            >
                Invite Players to team
            </Button>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon/>}
                onClick={handleCreateTeamDialogOpen}
            >
                Create New Team
            </Button>
            {isTeamPlayer && (
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
            )}
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
              {/*      {teamMembers.map((member) => (
                        <div key={member}>
                            <span>{member}</span>
                            <button onClick={() => removeTeamMember(member)}>
                                Remove from Team
                            </button>
                        </div>
                    ))}*/}
                </div>
            )}
            {!isTeamPlayer && (
                <div className="team-prompt">
                    <p><strong> Please join a team or create one to view Team Statistics, You can only join teams Upon
                        invitation</strong></p>
                </div>
            )}

        </div>

    );
};
export default TeamPage;

