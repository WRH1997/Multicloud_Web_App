import invokeLambdaFunction from "./InvokeLambda";

// Common file for handling team statistics and team member permissions.

export const fetchMemberTeamData = async (currentUserEmail) => {
    // get data about specific user from the team.
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
    // Get all team members in a team.
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
    // get all statistics for the current team.
    const jsonPayload = {
        tableName: "teamStats",
        operation: "READ",
        key: {
            teamName: teamName
        }
    };
    return await invokeLambdaFunction('lambdaDynamoDBClient', jsonPayload);
}