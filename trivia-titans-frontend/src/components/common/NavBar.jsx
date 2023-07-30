import React from 'react';
import { AppBar, Toolbar,Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NavBar = () => {
    return (
        <AppBar position="static">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Button component={RouterLink} to="/" color="inherit" >Home</Button>
                <Button component={RouterLink} to="/CreateTriviaGame" color="inherit">Create Trivia Game</Button>
                <Button component={RouterLink} to="/EditProfile" color="inherit">Edit Profile</Button>
                <Button component={RouterLink} to="/SignUp" color="inherit">Sign Up</Button>
                <Button component={RouterLink} to="/Login" color="inherit">Login</Button>
                <Button component={RouterLink} to="/Logout" color="inherit">Logout</Button>
                <Button component={RouterLink} to="/CreateTriviaQuestions" color="inherit">Create Trivia Questions</Button>
                <Button component={RouterLink} to="/Leaderboard" color="inherit">Leaderboard</Button>
                <Button component={RouterLink} to="/ManageTeams" color="inherit">Manage Teams</Button>
                <Button component={RouterLink} to="/ConfigureTriviaGames" color="inherit">Configure Trivia Games</Button>
                <Button component={RouterLink} to="/UpdateTriviaGame" color="inherit">Update Trivia Game</Button>
                <Button component={RouterLink} to="/BrowseTriviaGames" color="inherit">Browse Trivia Games</Button>
                <Button component={RouterLink} to="/TriviaGameLobby" color="inherit">Trivia Game Lobby</Button>
                <Button component={RouterLink} to="/individualGame" color="inherit">Individual Game</Button>
                <Button component={RouterLink} to="/TeamGameLobby" color="inherit">Team Game Lobby</Button>
                <Button component={RouterLink} to="/TeamTriviaGame" color="inherit">Team Trivia Game</Button>
                <Button component={RouterLink} to="/TeamGameResults" color="inherit">Team Game Results</Button>
            </Toolbar>
        </AppBar>
    );
}
export default NavBar;
