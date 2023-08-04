import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext, getCurrentUserPermissionLevel } from './AuthContext';


const NavBar = () => {

    const [loggedInUserRole, setLoggedInUserRole] = useState('LOGOUT');
    const currentUser = useContext(AuthContext);
    useEffect(() => {
        checkUserStatus();
    }, [currentUser]);

    async function checkUserStatus() {
        if (currentUser) {
            const userPermissionLevel = await getCurrentUserPermissionLevel(currentUser.email);
            if (userPermissionLevel) {
                setLoggedInUserRole(userPermissionLevel)
            }
        }
    }

    return (
        <AppBar position="static">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Button component={RouterLink} to="/" color="inherit" >Home</Button>

                {loggedInUserRole === 'LOGOUT' && (
                    <>
                        <Button component={RouterLink} to="/SignUp" color="inherit">Sign Up</Button>
                        <Button component={RouterLink} to="/Login" color="inherit">Login</Button>
                    </>
                )}

                {loggedInUserRole === 'USER' && (
                    <>
                        <Button component={RouterLink} to="/ManageTeams" color="inherit">Manage Teams</Button>
                        <Button component={RouterLink} to="/TriviaGameLobby" color="inherit">Trivia Game Lobby</Button>
                        <Button component={RouterLink} to="/EditProfile" color="inherit">Edit Profile</Button>
                        <Button component={RouterLink} to="/GetUserStatistics" color="inherit">Statistics</Button>
                    </>
                )}

                {loggedInUserRole === 'ADMIN' && (
                    <>
                        <Button component={RouterLink} to="/ConfigureTriviaGames" color="inherit">Configure Trivia Games</Button>
                        <Button component={RouterLink} to="/CreateTriviaQuestions" color="inherit">Create Trivia Questions</Button>
                        <Button component={RouterLink} to="/Report" color="inherit">Reports</Button>
                    </>
                )}

                {(loggedInUserRole === 'USER' || loggedInUserRole === 'ADMIN') && (
                    <>
                        <Button component={RouterLink} to="/Leaderboard" color="inherit">Teams Leaderboard</Button>
                        <Button component={RouterLink} to="/UserLeaderboard" color="inherit">Users Leaderboard</Button>
                        <Button component={RouterLink} to="/Logout" color="inherit">Logout</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}
export default NavBar;
