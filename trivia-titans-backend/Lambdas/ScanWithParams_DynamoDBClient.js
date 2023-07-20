import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
const dbClient = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocument.from(dbClient);

/* Example of payload to lambda :
key : The partition key of the table

SCAN_WITH_PARAMS example
{
"tableName":"<<TABLE-NAME>>",
  "operation": "SCAN_WITH_PARAMS",
  "scanKey":"<<KEY>>",
  "scanValue":"<<VALUE>>"
}
*/

export const handler = async (event) => {
  console.log(event)
  const tableName = event.tableName;
  console.log(tableName)
  const operation = event.operation.toUpperCase();
  let response;
  switch (operation) {
    case 'SCAN_WITH_PARAMS':
      response = await scanDynamoDBTableWithParams(tableName, event.scanKey, event.scanValue);
      break;
    default:
      response = `Invalid operation: ${event.operation}`;
      break;
  }
  return response;
};

async function scanDynamoDBTableWithParams(tableName, scanKey, scanValue) {
  const params = {
    TableName: tableName,
    FilterExpression: "#attr = :val",
    ExpressionAttributeNames: {
      "#attr": scanKey
    },
    ExpressionAttributeValues: {
      ":val": { S: scanValue }
    }
  };


  const command = new ScanCommand(params);
  const results = []; // Array to collect all items

  try {
    let data;
    do {
      data = await dbClient.send(command);
      results.push(...data.Items); // Add items to results array
      command.input.ExclusiveStartKey = data.LastEvaluatedKey;
    } while (data.LastEvaluatedKey);
  } catch (err) {
    console.error("Error", err);
  }

  return results; // Return collected results
}