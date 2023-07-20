import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
const dbClient = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocument.from(dbClient);

/* Example of payload to lambda :
key : The partition key of the table

Example:
{
    "tableName": "TriviaGames",
    "operation": "DELETE",
    "key": {
        "GameId": triviaGameID,
        "Timestamp": triviaGameTimestamp
    },
};
*/

export const handler = async (event) => {
  console.log(event)
  const tableName = event.tableName;
  console.log(tableName)
  const operation = event.operation.toUpperCase();
  let response;
  switch (operation) {
    case 'DELETE':
      response = await deleteItem(event.key, tableName);
      break;
    default:
      response = `Invalid operation: ${event.operation}`;
      break;
  }
  return response;
};

async function deleteItem(key, tableName) {
  const params = {
    TableName: tableName,
    Key: key,

  }; return await ddbDocClient.delete(params);
}