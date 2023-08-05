import invokeLambdaFunction from "./InvokeLambda";

export const fetchMemberTeamData = async (currentUserEmail) => {
    const jsonPayload = {
        tableName: "teamMembers",
        operation: "READ",
        key: {
            playerEmail: currentUserEmail
        }
    };
    return await invokeLambdaFunction('lambdaDynamoDBClient', jsonPayload);
}
export const fetchCurrentMemberPermissions = async (currentUser) => {
   const playerTeamInfo = await fetchMemberTeamData(currentUser.email);
   return playerTeamInfo.teamPermission;
}
export const fetchAllTeamMembersData = async (playerTeamName) => {
    const jsonPayload = {
        tableName: "teamMembers",
        operation: "SCAN_WITH_PARAMS",
        "scanKey":"teamName",
        "scanValue": playerTeamName
    };
    return await invokeLambdaFunction('lambdaDynamoDBClient', jsonPayload);
}
export const fetchCurrentTeamStatistics = async (teamName) =>
{
    const jsonPayload = {
        tableName: "teamStats",
        operation: "READ",
        key: {
            teamName: teamName
        }
    };
    return await invokeLambdaFunction('lambdaDynamoDBClient', jsonPayload);
}