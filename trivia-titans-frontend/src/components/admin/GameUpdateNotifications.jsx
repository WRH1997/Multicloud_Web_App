import invokeLambdaFunction from "../common/InvokeLambda";

export const subscribeToGameUpdates = async (userEmail) => {
    const jsonPayload = {
        userEmail: userEmail
    };
    return await invokeLambdaFunction('SubscribeToGameUpdates_SNSTopic', jsonPayload);
}

export const notifyTeamToJoinGame = async (teamEmails, teamName, gameId, gameName) => {
    const jsonPayload = {
        teamEmails: teamEmails,
        teamName: teamName,
        gameId: gameId,
        gameName: gameName
    };
    return await invokeLambdaFunction('NotifyTeamToJoinGame', jsonPayload);
}