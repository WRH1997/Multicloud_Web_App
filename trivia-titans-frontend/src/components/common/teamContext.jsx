import invokeLambdaFunction from "./InvokeLambda";
import {useContext} from "react";
import {AuthContext} from "./AuthContext";

export const fetchCurrentMemberTeamData = async () => {
    const currentUser = useContext(AuthContext);
    const jsonPayload = {
        tableName: "teamMembers",
        operation: "READ",
        key: {
            playerEmail: currentUser.email
        }
    };
    return await invokeLambdaFunction('lambdaDynamoDBClient', jsonPayload);
}
export const fetchCurrentMemberPermissions = async () => {
    const currentUser = useContext(AuthContext);
   const playerTeamInfo = fetchCurrentMemberPermissions(currentUser);
   return playerTeamInfo.teamPermission;
}