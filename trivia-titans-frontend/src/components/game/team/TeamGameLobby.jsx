import { Button, Grid, Typography } from "@mui/material";
import { AuthContext } from "components/common/AuthContext";
import { fetchMemberTeamData, fetchAllTeamMembersData } from "components/common/teamContext";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { addDoc, collection, doc, getFirestore, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { firebaseClientRishi } from "components/common/firebase";
import Chat from "components/common/ChatBox";
import { notifyTeamToJoinGame } from "components/admin/GameUpdateNotifications";

const db = getFirestore(firebaseClientRishi);

const TeamGameLobby = () => {
    const navigate = useNavigate();

    const { state } = useLocation();
    const triviaGame = state.triviaGame;
    const gameName = triviaGame.GameName.toString();
    const gameId = triviaGame.GameId.toString();

    const currentUser = useContext(AuthContext);
    const currentUserEmail = currentUser.email.toString();

    const [isTeamPlayer, setIsTeamPlayer] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);
    const [currentUserPermission, setCurrentUserPermission] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [teamSessionDetails, setTeamSessionDetails] = useState([]);
    const [allTeamMembersJoined, setAllTeamMembersJoined] = useState(false);


    useEffect(() => {
        getTeamPlayerData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    useEffect(() => {
        if (sessionId) {
            fetchRecordsWithSessionId(sessionId);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }, [sessionId]);

    useEffect(() => {
        // This useEffect will run whenever teamMembers state changes
        // It will ensure that the teamMembers data is updated and visible in the UI
    }, [teamMembers]);

    useEffect(() => {
        // This useEffect will run whenever teamSessionDetails state changes
        // It will check if all team members have "JOINED" status and their session details are updated
        // before setting the flag to indicate that all team members have joined
        if (teamSessionDetails.length > 0 && teamSessionDetails.length === teamMembers.length) {
            const allJoined = teamSessionDetails.every((teamMember) => teamMember.SessionStatus === "JOINED");
            setAllTeamMembersJoined(allJoined);
        }
    }, [teamSessionDetails, teamMembers]);

    useEffect(() => {
        if (allTeamMembersJoined) {
            toast.success("All Team Members have joined! Starting game in 3..2..1 ");
            setTimeout(function () {
                navigate("/TeamTriviaGame", {
                    state: {
                        triviaGame: triviaGame,
                        teamName: teamName,
                        teamMembers: teamMembers,
                        currentUserPermission: currentUserPermission,
                        sessionId: sessionId,
                        teamSessionDetails: teamSessionDetails,
                    },
                });
            }, 3000);
        }
    }, [allTeamMembersJoined]);

    const hasDisplayedExitingToastRef = useRef(false);

    const getTeamPlayerData = async () => {
        if (currentUser) {
            const teamPlayerData = await fetchMemberTeamData(currentUserEmail);
            if (teamPlayerData) {
                setIsTeamPlayer(true);
                setTeamName(teamPlayerData.teamName);
                setCurrentUserPermission(teamPlayerData.teamPermission);
                await getTeamMemberList(teamPlayerData.teamName);

                // Check if document exists based on SessionId or insert a new document to the Firestore table "TeamGameLobbySessions"
                setSessionId((teamPlayerData.teamName + gameId));

            } else {
                toast.error("You are not part of a team yet. Create one, or accept invitation in Email!!");
            }
        }
    }

    const getTeamMemberList = async (teamName) => {
        const teamMemberData = await fetchAllTeamMembersData(teamName);
        if (teamMemberData.length <= 1) {
            toast.error("Invite Members to your team first to play as a team!");
            setTimeout(function () {
                navigate("/TriviaGameLobby")
            }, 3000);
        } else {
            setTeamMembers(teamMemberData);
            return teamMemberData;
        }
    }

    //Code to wait for all team members to join the game
    const fetchRecordsWithSessionId = (sessionId) => {
        let currentUserRecord; // Declare currentUserRecord outside of onSnapshot

        const q = query(collection(db, "TeamGameLobbySessions"), where("SessionId", "==", sessionId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const records = [];
            snapshot.forEach((doc) => {
                records.push({ ...doc.data(), id: doc.id });
            });

            // Check if records with the session ID exist
            if (records.length === 0) {
                // If records do not exist, create documents for all team members
                createTeamMembersDocuments(sessionId);

                // Send SNS Email notification to all team members except the current logged in user to Join the game
                const teamEmails = [];
                for (const teamMember of teamMembers) {
                    if (teamMember.playerEmail.S != currentUserEmail) {
                        teamEmails.push(teamMember.playerEmail.S);
                        notifyTeamToJoinGame(teamEmails, teamName, gameId, gameName);
                    }
                }

            } else {
                // If records already exist, check if the current user's status is "WAITING" and update it to "JOINED"
                currentUserRecord = records.find((record) => record.UserEmail === currentUserEmail);
                if (currentUserRecord && currentUserRecord.SessionStatus === "WAITING") {
                    // Update the current user's record to "JOINED"
                    updateCurrentUserStatus(currentUserRecord.id, "JOINED");
                }

                if (currentUserRecord && currentUserRecord.SessionStatus === "SUBMITTED" && !hasDisplayedExitingToastRef.current) {
                    toast.warning("Your Team has already attempted this game! Exiting in 30 seconds..");
                    setTimeout(function () {
                        navigate("/TriviaGameLobby")
                    }, 30000);

                    // Set the ref to true to indicate that the toast has been displayed
                    hasDisplayedExitingToastRef.current = true;
                }
                setTeamSessionDetails(records)
            }
        });

        // Return a cleanup function to remove the listener when the component is unmounted
        return () => {
            // Update the current user's record to "WAITING" when the component unmounts
            if (currentUserRecord && currentUserRecord.SessionStatus === "JOINED") {
                updateCurrentUserStatus(currentUserRecord.id, "WAITING");
            }
            unsubscribe();
        };
    }

    const createTeamMembersDocuments = async (sessionId) => {
        for (const teamMember of teamMembers) {
            const { playerEmail } = teamMember;
            const userEmail = playerEmail.S;
            const docId = `${sessionId.replace(/[^a-zA-Z0-9]/g, '')}` + `${userEmail.replace(/[^a-zA-Z0-9]/g, '')}`;
            const docData = {
                GameId: gameId,
                GameName: gameName,
                SessionId: sessionId,
                SessionStatus: "WAITING",
                TeamName: teamName,
                TeamPermission: teamMember.teamPermission.S,
                Timestamp: serverTimestamp(),
                UserEmail: userEmail,
            };

            await setDoc(doc(db, `TeamGameLobbySessions/${docId}`), docData);
        }
    }

    const updateCurrentUserStatus = async (docId, sessionStatus) => {
        await updateDoc(doc(db, "TeamGameLobbySessions", docId), {
            Timestamp: serverTimestamp(),
            SessionStatus: sessionStatus,
        });
    }

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>

            <ToastContainer />
            <Grid item xs={12} md={6} style={{ textAlign: "center" }}>
                {isTeamPlayer && teamMembers && (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Team Name: {teamName}
                        </Typography>
                        <Typography variant="h4" gutterBottom>
                            Game Name: {gameName}
                        </Typography>
                        <Typography variant="h4" gutterBottom>
                            Your UserID: {currentUserEmail}
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            <br></br>
                            Waiting for Players to join the Lobby:
                            <br></br> <br></br>


                            {teamMembers.map((team, index) => {
                                // Find the corresponding teamSessionDetail for the current team member
                                const teamSessionDetail = teamSessionDetails.find(
                                    (sessionDetail) => sessionDetail.UserEmail === team.playerEmail.S
                                );

                                // Extract the status from teamSessionDetail or default to an empty string
                                const status = teamSessionDetail ? teamSessionDetail.SessionStatus : '';

                                return (
                                    <div key={index}>
                                        <Typography variant="h6" gutterBottom>Player {index + 1}: {team.playerEmail.S}</Typography>
                                        <Typography variant="h6" gutterBottom>Status: {status}</Typography>
                                    </div>
                                );
                            })}

                        </Typography>
                        <br></br>Game will start automatically once every member joins.
                    </>
                )}

                {isTeamPlayer && teamMembers && currentUserPermission === 'ADMIN' && (
                    <>
                        <br></br>If you don't want to wait, Click Start Game<br></br><br></br>
                        {teamSessionDetails.every(teamMember => teamMember.SessionStatus !== 'SUBMITTED') && (
                            <Button variant="contained" color="primary" onClick={() => navigate("/TeamTriviaGame", {
                                state: {
                                    triviaGame: triviaGame,
                                    teamName: teamName,
                                    teamMembers: teamMembers
                                }
                            })}>
                                Start Game
                            </Button>
                        )}
                    </>
                )}

                <br></br><br></br>
                <Button variant="contained" color="primary" onClick={() => navigate("/TriviaGameLobby")}>
                    Go To Lobby
                </Button>

                <Grid item xs={12} md={12} style={{ textAlign: "center" }}>
                    <Grid item sx={{ margin: 2 }}>
                        <Chat />
                    </Grid>
                </Grid>

            </Grid>
        </Grid>
    );
};

export default TeamGameLobby;