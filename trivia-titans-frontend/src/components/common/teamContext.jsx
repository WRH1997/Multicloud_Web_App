import invokeLambdaFunction from "./InvokeLambda";

export const fetchMemberTeamData = async (currentUser) => {
    const jsonPayload = {
        tableName: "teamMembers",
        operation: "READ",
        key: {
            playerEmail: currentUser.email
        }
    };
    return await invokeLambdaFunction('lambdaDynamoDBClient', jsonPayload);
}
export const fetchCurrentMemberPermissions = async (currentUser) => {
   const playerTeamInfo = fetchCurrentMemberPermissions(currentUser);
   return playerTeamInfo.teamPermission;
}