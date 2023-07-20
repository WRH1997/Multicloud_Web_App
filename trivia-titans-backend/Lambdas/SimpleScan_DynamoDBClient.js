import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
const dbClient = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocument.from(dbClient);

/* Example of payload to lambda :
key : The partition key of the table

SIMPLE_SCAN example
{
"tableName":"<<TABLE-NAME>>",
  "operation": "SIMPLE_SCAN"
}
*/

export const handler = async (event) => {
  console.log(event)
  const tableName = event.tableName;
  console.log(tableName)
  const operation = event.operation.toUpperCase();
  let response;
  switch (operation) {
    case 'SIMPLE_SCAN':
      response = await scanTableWithoutPagination(tableName);
      break;
    default:
      response = `Invalid operation: ${event.operation}`;
      break;
  }
  return response;
};

async function scanTableWithoutPagination(tableName) {
  const params = {
    TableName: tableName,
  };

  try {
    const data = await ddbDocClient.scan(params);
    console.log('Success', data);
    return data.Items;
  } catch (err) {
    console.log('Error', err);
    throw err;
  }
};