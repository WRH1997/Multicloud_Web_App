import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
const dbClient = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocument.from(dbClient);
import { unmarshall } from '@aws-sdk/util-dynamodb';

/*
Sample Request:
{
  "tableName": "TriviaGames",
  "operation": "SCAN_WITH_FILTER_EXPR",
  "filterExpression": "StartDate <= :currentDate AND EndDate >= :currentDate",
  "expressionAttributeValues": {
    ":currentDate": {
      "S": "2023-06-29"
    }
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
    case 'SCAN_WITH_FILTER_EXPR':
      response = await scanDynamoDBTableWithFilterExpr(tableName, event.filterExpression, event.expressionAttributeValues);
      break;
    default:
      response = `Invalid operation: ${event.operation}`;
      break;
  }
  return response;
};

async function scanDynamoDBTableWithFilterExpr(tableName, filterExpression, expressionAttributeValues) {
  const params = {
    TableName: tableName,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues
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

  return results.map((item) => unmarshall(item)); // Return collected results
}