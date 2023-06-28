import React from "react";
import { Route, Routes } from 'react-router-dom';
import LandingPage from '../components/common/LandingPage';
import DefaultNotFound from '../components/common/DefaultNotFound';
import CreateTriviaGame from "../components/admin/ConfigureTriviaGameConfigurations/CreateTriviaGame";
import HandleSignUp from "../components/login/Signup";
import Logout from "../components/login/Logout";
import Login from "../components/login/Login";
import ConfigureTriviaGames from "../components/admin/ConfigureTriviaGames";
import {UpdateTriviaGame} from "../components/admin/ConfigureTriviaGameConfigurations/UpdateTriviaGame";
import BrowseTriviaGames from "../components/admin/BrowseTriviaGames"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path='*' element={<DefaultNotFound />} />
            <Route path='CreateTriviaGame' element={<CreateTriviaGame />} />
            <Route path='SignUp' element={<HandleSignUp/>} />
            <Route path='Login' element={<Login/>} />
            <Route path='Logout' element={<Logout/>} />
            <Route path='ConfigureTriviaGames' element={<ConfigureTriviaGames />} />
            <Route path="/UpdateTriviaGame" element={<UpdateTriviaGame />} />
            <Route path="/BrowseTriviaGames" element={<BrowseTriviaGames />} />
        </Routes>
    );
};

export default AppRoutes;