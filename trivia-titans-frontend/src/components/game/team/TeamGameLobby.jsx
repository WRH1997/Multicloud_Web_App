import { Button, Grid, Typography } from "@mui/material";
import { AuthContext } from "components/common/AuthContext";
import { fetchMemberTeamData, fetchAllTeamMembersData } from "components/common/teamContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from 'react-router-dom';

const TeamGameLobby = () => {
    const navigate = useNavigate();

    const { state } = useLocation();
    const triviaGame = state.triviaGame;
    const gameName = triviaGame.GameName;

    const currentUser = useContext(AuthContext)

    const [isTeamPlayer, setIsTeamPlayer] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        getTeamPlayerData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const getTeamPlayerData = async () => {
        if (currentUser) {
            const teamPlayerData = await fetchMemberTeamData(currentUser.email.toString());
            console.log(teamPlayerData);
            if (teamPlayerData) {
                setIsTeamPlayer(true);
                setTeamName(teamPlayerData.teamName);
                await getTeamMemberList(teamPlayerData.teamName);
                console.log(teamName);
            }
        }
    }

    const getTeamMemberList = async (teamName) => {
        const teamMemberData = await fetchAllTeamMembersData(teamName);
        setTeamMembers(teamMemberData);
        console.log(teamMemberData);

    }


    //Code to wait for all team members to join the game

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
            <Grid item xs={12} md={6} style={{ textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Team Name: {teamName}
                </Typography>
                <Typography variant="h4" gutterBottom>
                    Game Name: {gameName}
                </Typography>

                {isTeamPlayer && teamMembers && (
                    <Typography variant="h5" gutterBottom>
                        <br></br>
                        Waiting for Players to join the Lobby:
                        <br></br> <br></br>
                        {teamMembers.map((team, index) => (
                            <div key={index}>
                                <Typography variant="h6" gutterBottom>Player {index + 1}: {team.playerEmail.S}</Typography>
                                <Typography variant="h6" gutterBottom>Status: Joined</Typography>
                            </div>
                        ))}
                    </Typography>
                )}
                <br></br>Game will start automatically once every member joins. If you don't want to wait, Click Start Game<br></br><br></br>
                <Button variant="contained" color="primary" onClick={() => navigate("/TeamTriviaGame", {
                    state: {
                        triviaGame: triviaGame,
                        teamName: teamName,
                        teamMembers: teamMembers
                    }
                })}>
                    Start Game
                </Button>
            </Grid>
        </Grid>
    );
};

export default TeamGameLobby;