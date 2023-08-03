import React from "react";
import { Route, Routes } from 'react-router-dom';
import LandingPage from '../components/common/LandingPage';
import DefaultNotFound from '../components/common/DefaultNotFound';
import CreateTriviaGame from "../components/admin/ConfigureTriviaGameConfigurations/CreateTriviaGame";
import EditProfile from "../components/userProfile/EditProfile"
import HandleSignUp from "../components/login/Signup";
import Logout from "../components/login/Logout";
import Login from "../components/login/Login";
import QuestForm from "components/admin/QuestForm";
import Leaderboard from "../components/leaderboard/Leaderboard";
import {AuthProvider} from "../components/common/AuthContext";
import ConfigureTriviaGames from "../components/admin/ConfigureTriviaGames";
import {UpdateTriviaGame} from "../components/admin/ConfigureTriviaGameConfigurations/UpdateTriviaGame";
import BrowseTriviaGames from "../components/admin/BrowseTriviaGames"
import TeamPage from "../components/team/teamStats";
import TriviaGameLobby from "../components/game/TriviaGameLobby";
import IndividualGame from "../components/game/individual/IndividualGame";
import TeamGameLobby from "../components/game/team/TeamGameLobby"
import TeamTriviaGame from "../components/game/team/TeamTriviaGame"
import TeamGameResults from "components/game/team/TeamGameResults";
import Chatbot from '../components/common/Chatbot';
import GetUserStatistics from "../components/statistics/userStatistics";
import UserLeaderboardPage from "components/leaderboard/UserLeaderboard";
import NavBar from "../components/common/NavBar";
import IndividualGameResults from "../components/game/individual/IndividualGameResults";
import Report from "../components/report/viewReport";

const AppRoutes = () => {
    return (
        <AuthProvider>
            <NavBar />
        <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path='*' element={<DefaultNotFound />} />
            <Route path='CreateTriviaGame' element={<CreateTriviaGame />} />
            <Route path='EditProfile' element={<EditProfile/>} />
            <Route path='/GetUserStatistics' element={<GetUserStatistics />} />
            <Route path='SignUp' element={<HandleSignUp/>} />
            <Route path='Login' element={<Login/>} />
            <Route path='Logout' element={<Logout/>} />
            <Route path='CreateTriviaQuestions' element={<QuestForm/>} />
            <Route path='Leaderboard' element={<Leaderboard/>} />
            <Route path = 'ManageTeams' element = {<TeamPage/>} />
            <Route path='ConfigureTriviaGames' element={<ConfigureTriviaGames />} />
            <Route path="/UpdateTriviaGame" element={<UpdateTriviaGame />} />
            <Route path="/BrowseTriviaGames" element={<BrowseTriviaGames />} />
            <Route path="/TriviaGameLobby" element={<TriviaGameLobby />} />
            <Route path='/individualGame' element={<IndividualGame />} />
            <Route path='/TeamGameLobby' element={<TeamGameLobby />} />
            <Route path='/TeamTriviaGame' element={<TeamTriviaGame />} />
            <Route path='/TeamGameResults' element={<TeamGameResults />} />
            <Route path='/UserLeaderboard' element={<UserLeaderboardPage />} />
            <Route path='/IndividualGameResults' element={<IndividualGameResults />} />
            <Route path='/Report' element={<Report />} />
        </Routes>
        <Chatbot />
        </AuthProvider>
    );
};

export default AppRoutes;