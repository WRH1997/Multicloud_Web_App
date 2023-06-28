import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const dbClient = new DynamoDBClient({ region: "us-east-1" });
const dbDocumentClient = DynamoDBDocument.from(dbClient);

var dynamoDBTable = 'TriviaGames';


export const handler = async (event) => {

    try {
        // Parse Parameters from the Request
        const {
            GameId,
            GameName,
            GameCategory,
            GameDifficulty,
            PerQuestionTime,
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
                GameCategory: GameCategory,
                GameDifficulty: GameDifficulty,
                PerQuestionTime: PerQuestionTime,
                StartDate: StartDate,
                EndDate: EndDate,
                Timestamp: Timestamp,
                Questions: Questions
            },
        };

        await dbDocumentClient.put(params);

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