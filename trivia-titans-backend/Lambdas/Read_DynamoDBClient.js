import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
const dbClient = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocument.from(dbClient);

/* Example of payload to lambda :
key : The partition key of the table

READ example
{
"tableName":"<<TABLE-NAME>>",
  "operation": "READ",
  "key": {
    "id": "1"
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
    case 'READ':
      response = await readItem(event.key, tableName);
      break;
    default:
      response = `Invalid operation: ${event.operation}`;
      break;
  }
  return response;
};


async function readItem(key, tableName) {
  const params = {
    TableName: tableName,
    Key: key,
  };

  const { Item } = await ddbDocClient.get(params);
  return Item;
};