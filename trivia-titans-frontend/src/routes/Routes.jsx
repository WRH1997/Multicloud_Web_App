import React from "react";
import { Route, Routes } from 'react-router-dom';
import LandingPage from '../components/common/LandingPage';
import DefaultNotFound from '../components/common/DefaultNotFound';
import CreateTriviaGame from "../components/admin/CreateTriviaGame";
import HandleSignUp from "../components/login/Signup";
import {Logout} from "../components/login/Logout";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path='*' element={<DefaultNotFound />} />
            <Route path='CreateTriviaGame' element={<CreateTriviaGame />} />
            <Route path='SignUp' element={<HandleSignUp/>} />
            <Route path='Logout' element={<Logout/>} />
        </Routes>
    );
};

export default AppRoutes;