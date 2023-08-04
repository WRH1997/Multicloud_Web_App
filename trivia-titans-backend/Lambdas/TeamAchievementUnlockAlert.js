import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const dbClient = new DynamoDBClient();
const snsClient = new SNSClient({ region: 'us-east-1' });

const sendTeamEmails = async (teamName, playerEmails, oldRank, newRank) => {
    const message = `Hello ${teamName}, your rank just went from ${oldRank} to ${newRank}.`;

    for (const email of playerEmails) {

        const snsParams = {
            TopicArn: "arn:aws:sns:us-east-1:940444391781:GameUpdates",
            Message: message,
            Subject: `Congratulations ${teamName}!`,
            MessageAttributes: {
                Targets: {
                    DataType: 'String',
                    StringValue: email,
                }
            }
        };

        const publishCommand = new PublishCommand(snsParams);
        await snsClient.send(publishCommand);

        console.log(`Notification sent to ${email}`);
    }
}

const getPlayerEmailsByTeamName = async (teamName) => {
  try {
    const params = {
      TableName: 'teamMembers',
    };

    const result = await dbClient.send(new ScanCommand(params));
    console.log('result',result.Items)

    if (result && result.Items) {
      const playerEmails = result.Items.filter((item) => item.teamName.S === teamName).map((item) => item.playerEmail.S);
      return playerEmails;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
}


const getMeScores = (data) => {
  const teamScores = {};

  data.Items.forEach(entry => {
    let { teamName, score } = entry;
    teamName = teamName.S;
    score = parseInt(score.N);
    
   
    if (!teamScores[teamName]) {
      teamScores[teamName] = 0;
    }
    
    teamScores[teamName] +=  score;
  });

  return teamScores;
}

const calculateRank = (teamScores, targetTeamName) => {
  const sortedTeams = Object.entries(teamScores).sort((a, b) => b[1] - a[1]);
  console.log('sortedTeams', sortedTeams);
  const rank = sortedTeams.findIndex(([teamName]) => teamName === targetTeamName) + 1;
  return parseInt(rank);
}


const publishMessage = async (teamName, oldRank, newRank) => {
  const param = {
    teamName, 
    oldRank, 
    newRank
  };
  
  console.log('param', param);
  
  const playerEmails = await getPlayerEmailsByTeamName(teamName);
  await sendTeamEmails(teamName, playerEmails, oldRank, newRank);
  
  const response = {
    statusCode: 200,
    body: playerEmails,
  };
  
  return response;
  
}

export const handler = async (event) => {
  
  const params = {
      TableName: 'TriviaLeaderboard'
    };

    const scanResult = await dbClient.send(new ScanCommand(params));

    const teamScores = getMeScores(scanResult);
    console.log('teamScores', teamScores);
  
    const streamEvent = event.Records[0];
    if(streamEvent.eventName === 'INSERT'){
      const newImage = streamEvent.dynamodb.NewImage;
      const teamName = newImage.teamName.S;
      let newScore = newImage.score.N;
      newScore = parseInt(newScore);
      
      const newRank = calculateRank(teamScores, teamName);

      teamScores[teamName] -= newScore;
      const oldRank = calculateRank(teamScores, teamName);

      console.log("newRank", newRank, "oldRank", oldRank);
      if(oldRank > newRank){
        return await publishMessage(teamName, oldRank, newRank);
      }
    }
};