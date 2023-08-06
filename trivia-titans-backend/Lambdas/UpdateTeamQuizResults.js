import { DynamoDBClient, PutItemCommand, UpdateItemCommand, GetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';

const dynamoDBClient = new DynamoDBClient();

export const handler = async (event) => {
    try {

        const { gameId, teamName, grade, winIncrement, teamEmails } = event;

        await Promise.all([
            updateLeaderboard(gameId, teamName, grade),
            updateTeamStats(teamName, grade, winIncrement),
            ...teamEmails.map((userEmail) => updateUserStats(userEmail, grade, winIncrement)),
        ]);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Quiz results successfully updated." }),
        };
    } catch (error) {
        console.error("Error while updating quiz results", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "An error occurred while updating quiz results.", error: error }),
        };
    }
};


async function updateLeaderboard(gameId, teamName, grade) {
    const Timestamp = new Date().toISOString();
    const params = {
        TableName: "TriviaLeaderboard",
        Item: {
            gameId: { S: gameId },
            teamName: { S: teamName },
            score: { N: grade.toString() },
            timestamp: { S: Timestamp },
        },
    };

    await dynamoDBClient.send(new PutItemCommand(params));
}

async function updateTeamStats(teamName, grade, winIncrement) {

    // First, fetch the existing teamStats data
    const existingTeamStatsParams = {
        TableName: "teamStats",
        Key: { teamName: { S: teamName } },
    };

    const existingTeamStats = await dynamoDBClient.send(new GetItemCommand(existingTeamStatsParams));

    const totalGames = Number(existingTeamStats.Item.totalGames.N) + 1;
    const totalWins = Number(existingTeamStats.Item.totalWins.N) + Number(winIncrement);
    const totalScore = Number(existingTeamStats.Item.totalScore.N) + Number(grade);
    const winLossRatio = totalWins / totalGames;

    const params = {
        TableName: "teamStats",
        Key: { teamName: { S: teamName } },
        UpdateExpression: `SET totalGames = :totalGames,
                           totalScore = :totalScore,
                           totalWins = :totalWins,
                           winLossRatio = :winLossRatio`,
        ExpressionAttributeValues: {
            ":totalGames": { N: totalGames.toString() },
            ":totalScore": { N: totalScore.toString() },
            ":totalWins": { N: totalWins.toString() },
            ":winLossRatio": { N: winLossRatio.toString() },
        },
    };

    await dynamoDBClient.send(new UpdateItemCommand(params));
}

async function updateUserStats(userEmail, grade, winIncrement) {
    // First, query the GSI to get the uid based on userEmail
    const queryParams = {
        TableName: "User",
        IndexName: "Email-index",  // Global Secondary Index
        KeyConditionExpression: "Email = :email",
        ExpressionAttributeValues: {
            ":email": { S: userEmail },
        },
    };

    const queryResult = await dynamoDBClient.send(new QueryCommand(queryParams));

    if (queryResult.Items.length === 0) {
        throw new Error(`User with email ${userEmail} not found.`);
    }

    const uid = queryResult.Items[0].uid.S;

    const params = {
        TableName: "User",
        Key: { uid: { S: uid } },
        UpdateExpression: `SET games_played = games_played + :one,
                           total_points_earned = total_points_earned + :grade,
                           win = win + :winIncrement`,
        ExpressionAttributeValues: {
            ":one": { N: "1" },
            ":grade": { N: grade.toString() },
            ":winIncrement": { N: winIncrement.toString() },
        },
    };

    await dynamoDBClient.send(new UpdateItemCommand(params));
}