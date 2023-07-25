import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const dbClient = new DynamoDBClient();

export const handler = async (event) => {
  try {
    const params = {
      TableName: event.tableName,
    };

    const scanResult = await dbClient.send(new ScanCommand(params));

    const teamScores = new Map();

    scanResult.Items.forEach(item => {
      const teamName = item.teamName.S;
      const score = parseInt(item.score.N);

      if (!teamScores.has(teamName)) {
        teamScores.set(teamName, 0);
      }

      teamScores.set(teamName, teamScores.get(teamName) + score);
    });

    const leaderboard = [];
    teamScores.forEach((score, teamName) => {
      leaderboard.push({ teamName, score });
    });

    const sortedLeaderboard = leaderboard.sort((a, b) => b.score - a.score);

    return sortedLeaderboard;
  } catch (error) {
    console.error('Error retrieving leaderboard:', error);
    throw error;
  }
};
