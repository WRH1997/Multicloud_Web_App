import React, {useEffect, useState} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import invokeLambdaFunction from "./InvokeLambda";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";
import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";
import { SESClient, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses";
export const AuthContext = React.createContext(null);

// Common files for User statistics, Authentication and permission management.
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
    const response = await invokeLambdaFunction('lambdaDynamoDBClient', jsonPayload);
    if(response)
        return response.type
    else
        return response
}


export async function createEmailIdentity(userEmail) {
    const sesClientCredentials = fromCognitoIdentityPool({
        identityPoolId: 'us-east-1:79432309-bc2e-447e-86b7-84c5b115e0e0',
        client: new CognitoIdentityClient({region: "us-east-1"})
    });
    const ses = new SESClient({ region: "us-east-1",credentials: sesClientCredentials });
    const params = {
        EmailAddress: userEmail
    };
    try {
        const data = await ses.send(new VerifyEmailIdentityCommand(params));
        console.log("Identity Created in SES", data);
    } catch (err) {
        console.error(err, err.stack);
    }
}
