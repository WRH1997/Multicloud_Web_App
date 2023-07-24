import React from "react";
import { Route, Routes } from 'react-router-dom';
import LandingPage from '../components/common/LandingPage';
import DefaultNotFound from '../components/common/DefaultNotFound';
import CreateTriviaGame from "../components/admin/CreateTriviaGame";
import EditProfile from "../components/userProfile/EditProfile"
import HandleSignUp from "../components/login/Signup";
import Logout from "../components/login/Logout";
import Login from "../components/login/Login";
import QuestForm from "components/admin/QuestForm";
import Leaderboard from "../components/leaderboard/Leaderboard";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path='*' element={<DefaultNotFound />} />
            <Route path='CreateTriviaGame' element={<CreateTriviaGame />} />
            <Route path='/EditProfile' element={<EditProfile />} />
            <Route path='SignUp' element={<HandleSignUp/>} />
            <Route path='Login' element={<Login/>} />
            <Route path='Logout' element={<Logout/>} />
            <Route path='CreateTriviaQuestions' element={<QuestForm/>} />
            <Route path='Leaderboard' element={<Leaderboard/>} />
        </Routes>
    );
};

export default AppRoutes;