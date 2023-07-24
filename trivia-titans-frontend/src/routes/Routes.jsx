import React from "react";
import { Route, Routes } from 'react-router-dom';
import LandingPage from '../components/common/LandingPage';
import DefaultNotFound from '../components/common/DefaultNotFound';
import CreateTriviaGame from "../components/admin/ConfigureTriviaGameConfigurations/CreateTriviaGame";
import EditProfile from "../components/userProfile/EditProfile"
import HandleSignUp from "../components/login/Signup";
import Logout from "../components/login/Logout";
import Login from "../components/login/Login";
import {AuthProvider} from "../components/common/AuthContext";
import ConfigureTriviaGames from "../components/admin/ConfigureTriviaGames";
import {UpdateTriviaGame} from "../components/admin/ConfigureTriviaGameConfigurations/UpdateTriviaGame";
import BrowseTriviaGames from "../components/admin/BrowseTriviaGames"
import TeamPage from "../components/team/teamStats";
import Chat from "../components/common/ChatBox";
import TriviaGameLobby from "../components/game/TriviaGameLobby";
import IndividualGame from "../components/game/individual/IndividualGame";
import TeamGameLobby from "../components/game/team/TeamGameLobby"
import TeamTriviaGame from "../components/game/team/TeamTriviaGame"
import TeamGameResults from "components/game/team/TeamGameResults";
import Chatbot from '../components/common/Chatbot';

const AppRoutes = () => {
    return (
        <AuthProvider>
        <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path='*' element={<DefaultNotFound />} />
            <Route path='CreateTriviaGame' element={<CreateTriviaGame />} />
            <Route path='EditProfile' element={<EditProfile/>} />
            <Route path='SignUp' element={<HandleSignUp/>} />
            <Route path='Login' element={<Login/>} />
            <Route path='Logout' element={<Logout/>} />
            <Route path = 'ManageTeams' element = {<TeamPage/>} />
            <Route path='ConfigureTriviaGames' element={<ConfigureTriviaGames />} />
            <Route path="/UpdateTriviaGame" element={<UpdateTriviaGame />} />
            <Route path="/BrowseTriviaGames" element={<BrowseTriviaGames />} />
            <Route path="/TriviaGameLobby" element={<TriviaGameLobby />} />
            <Route path='/individualGame' element={<IndividualGame />} />
            <Route path='/TeamGameLobby' element={<TeamGameLobby />} />
            <Route path='/TeamTriviaGame' element={<TeamTriviaGame />} />
            <Route path='/TeamGameResults' element={<TeamGameResults />} />
        </Routes>
        <Chatbot />
        </AuthProvider>
    );
};

export default AppRoutes;