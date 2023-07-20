import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ region: 'us-east-1' });

const dbClient = new DynamoDBClient({ region: "us-east-1" });
const dbDocumentClient = DynamoDBDocument.from(dbClient);

var dynamoDBTable = 'TriviaGames';


export const handler = async (event) => {

    try {
        // Parse Parameters from the Request
        const {
            GameId,
            GameName,
            Description,
            GameCategory,
            GameDifficulty,
            QuizTime,
            StartDate,
            EndDate,
            Questions
        } = event;
        const Timestamp = new Date().toISOString();


        // Insert to DynamoDB
        const params = {
            TableName: dynamoDBTable,
            Item: {
                GameId: GameId,
                GameName: GameName,
                Description: Description,
                GameCategory: GameCategory,
                GameDifficulty: GameDifficulty,
                QuizTime: QuizTime,
                StartDate: StartDate,
                EndDate: EndDate,
                Timestamp: Timestamp,
                Questions: Questions
            },
        };

        await dbDocumentClient.put(params);
        await publishNotificationToSNSTopic(GameName, Description, GameCategory, GameDifficulty, StartDate, EndDate)

        const response = {
            statusCode: 200,
            message: "Successfully Created Trivia Game!"
        };
        console.log("Response: " + JSON.stringify(response))
        return response;

    }
    catch (error) {
        let response = {
            statusCode: 500,
            message: "Error in Creating Trivia Game!",
            error: error.message
        };
        console.log("Response: " + JSON.stringify(response))
        return response;
    }
};

const publishNotificationToSNSTopic = async (GameName, Description, GameCategory, GameDifficulty, StartDate, EndDate) => {
    const topicArn = 'arn:aws:sns:us-east-1:940444391781:GameUpdates';
    const message = `Hey, Titan! A new game is available for you and your teammates to play:
    Game Name: ${GameName}
    Description: ${Description}
    Game Category: ${GameCategory}
    Game Difficulty: ${GameDifficulty}
    Start Date: ${StartDate}
    End Date: ${EndDate}
Play now!`;

    const params = {
        TopicArn: topicArn,
        Message: message,
        Subject: "Trivia Titans SPD10 - New Game Available to Play!"
    };

    try {
        await snsClient.send(new PublishCommand(params));
        console.log('Message published successfully.');
        return { success: true, message: 'Message published successfully.' };
    }
    catch (error) {
        console.error('Error publishing message:', error);
        return { success: false, message: 'Error publishing message.', error: error.message };
    }
};