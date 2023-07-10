import React, {useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import invokeLambdaFunction from "./InvokeLambda";

export const AuthContext = React.createContext(null);

export const  AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
    }, [auth]);

    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    );
};

export const getCurrentUserPermissionLevel = async (userEmail) => {

    // returns USER or ADMIN as the permission level.
    const jsonPayload = {
        tableName: "userLoginInfo",
        operation: "READ",
        key: {
            userEmail: userEmail
        }
    };
    return invokeLambdaFunction('lambdaDynamoDBClient', jsonPayload).type.toString();
}

