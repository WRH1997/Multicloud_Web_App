import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
const dbClient = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocument.from(dbClient);

/* Example of payload to lambda :
key : The partition key of the table

UPDATE Example
{
  "tableName": "TriviaGames",
  "operation": "UPDATE",
  "key": {
    "GameId": "8dc344e9-6667-47d8-8935-8b209bf881a2",
    "StartDate":"date"
  },
  "updateExpression": "set GameName = :GameName, GameCategory = :GameCategory, GameDifficulty = :GameDifficulty,EndDate = :EndDate",
  "expressionAttributeValues": {
    ":GameName": "GameName",
    ":GameCategory": "GameCategory",
    ":GameDifficulty": "GameDifficulty",
    ":EndDate": "EndDate"
  }
}
*/


export const handler = async (event) => {
  console.log(event)
  const tableName = event.tableName;
  console.log(tableName)
  const operation = event.operation.toUpperCase();
  let response;
  switch (operation) {
    case 'UPDATE':
      response = await updateItem(event.key, event.updateExpression, event.expressionAttributeValues, tableName);
      break;
    default:
      response = `Invalid operation: ${event.operation}`;
      break;
  }
  return response;
};

async function updateItem(key, updateExpression, expressionAttributeValues, tableName) {
  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "UPDATED_NEW"
  };
  return await ddbDocClient.update(params);
}
