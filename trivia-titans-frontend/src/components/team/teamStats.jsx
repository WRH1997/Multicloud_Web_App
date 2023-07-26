import React, {useContext, useEffect, useState} from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from "@mui/icons-material/Add";
import notifyJoinTeam from "./NotifyJoinTeam";
import invokeLambdaFunction from "../common/InvokeLambda";
import {AuthContext} from "../common/AuthContext";
import {useNavigate} from "react-router";
import {fetchAllTeamMembersData, fetchCurrentTeamStatistics, fetchMemberTeamData} from "../common/teamContext";
import Chat from "../common/ChatBox";

const TeamPage = () => {
    const currentUser = useContext(AuthContext);
    const [teamName,setTeamName] = useState("");
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [isTeamPlayer,setIsTeamPlayer] = useState(false);
    const [email, setEmail] = useState("");
    const [createTeamOpen, setCreateTeamOpen] = useState(false);
    const [teamMembers,setTeamMembers] = useState(null);
    const [teamStatistics, setTeamStatistics] = useState(null);
    useEffect(() => {
        if (!currentUser) {
            // if user not logged in, navigate to login
            navigate("/login");
        }
    }, [currentUser, navigate]);
    useEffect(() => {
        const getTeamPlayerData = async () => {
            if (currentUser) {
                const teamPlayerData = await fetchMemberTeamData(currentUser.email);
                if (teamPlayerData) {
                    setTeamName(teamPlayerData.teamName);
                    setIsTeamPlayer(true);
                    const currentTeamStats = await fetchCurrentTeamStatistics(teamPlayerData.teamName)
                    console.log(currentTeamStats);
                    setTeamStatistics(currentTeamStats);
                }
            }
        }
        getTeamPlayerData();
    }, [currentUser]);
    useEffect(() => {
        const getTeamMemberList = async () => {
            if (isTeamPlayer) {
                const teamMemberData = await fetchAllTeamMembersData(teamName);
                setTeamMembers(teamMemberData);
                console.log(teamMemberData);
            }
        }
        getTeamMemberList();
    }, [teamName,currentUser]);


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
        setIsTeamPlayer(true);
    }

    const sendEmailInvite = () => {
        // Add your code here to handle the invite
        console.log(`Invitation sent to: ${email}`);
        notifyJoinTeam(email, 'TestTeam');
        setEmail("");
        setOpen(false);
    };
    const promoteTeamMember = async function (playerEmail)
    {
        const currentUserUpdatePayload =
            {
                "tableName": "teamMembers",
                "operation": "UPDATE",
                "key": {
                    "playerEmail":currentUser.email ,
                },
                "updateExpression": "set teamPermission = :teamPermission",
                "expressionAttributeValues": {
                    ":teamPermission": "MEMBER",
                   }
            }
        await invokeLambdaFunction('Update_DynamoDBClient', currentUserUpdatePayload);
        const targetUserUpdatePayload =
            {
                "tableName": "teamMembers",
                "operation": "UPDATE",
                "key": {
                    "playerEmail":playerEmail ,
                },
                "updateExpression": "set teamPermission = :teamPermission",
                "expressionAttributeValues": {
                    ":teamPermission": "MEMBER",
                }
            }
        await invokeLambdaFunction('Update_DynamoDBClient', targetUserUpdatePayload);
    }
    const removeTeamMember = async function (playerEmail) {

        const teamPlayerData = await fetchMemberTeamData(playerEmail);
        if (!teamPlayerData)
            setIsTeamPlayer(false);
        else {

            // if admin removes themselves from the team, the whole team is disbanded.
            if (teamPlayerData.teamPermission === 'ADMIN') {
                console.log("player remove requested " +teamPlayerData.playerEmail);
                for (let item of teamMembers) {
                    const deleteUser = {
                        tableName: "teamMembers",
                        operation: "DELETE",
                        key: {
                            playerEmail: item.playerEmail.S
                        }
                    };
                    await invokeLambdaFunction('Delete_DynamoDBClient', deleteUser);
                    console.log("deleted player "+ item.playerEmail.S +" from team" +item.teamName.S);
                    setTeamMembers(teamMembers.filter((team) => team.playerEmail !== item.playerEmail.S));
                    setIsTeamPlayer(false);
                }
            } else if (teamPlayerData.teamPermission.S === 'MEMBER') {
                const jsonPayload2 = {
                    tableName: "teamMembers",
                    operation: "DELETE",
                    key: {
                        playerEmail: playerEmail
                    }
                };
                await invokeLambdaFunction('lambdaDynamoDBClient', jsonPayload2);
                setTeamMembers(teamMembers.filter((team) => team.playerEmail !== playerEmail));
            }
        }
    }
    return (

        <div>
            <ToastContainer />
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
            {isTeamPlayer && teamMembers && (

                <div className="team-stats">
                <p><strong>Score:</strong> {teamStatistics.totalScore}</p>
                <p><strong>Win/Loss Ratio:</strong> {teamStatistics.winLossRatio}</p>
                <p><strong>Total Games:</strong> {teamStatistics.totalGames}</p>
                <h3>Team Members are displayed below:</h3>
            {teamMembers.map((team, index) => (
                <div key={index}>
                <p>Player Email: {team.playerEmail.S} <Button
                variant="contained"
                color="secondary"
                onClick={() => removeTeamMember(team.playerEmail.S)}
                >
                Remove From Team
                </Button></p>
                    <p>
                <Button
                variant="contained"
                color="secondary"
                onClick={() => promoteTeamMember(team.playerEmail.S)}
                >
                Promote to Team Admin
                </Button></p>
                </div>
                ))}
                <div>
                <h2>Team Chat:</h2>
                <Chat />
                </div>
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

