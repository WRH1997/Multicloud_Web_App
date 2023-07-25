import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
const dbClient = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocument.from(dbClient);


/* Example of payload to lambda :
key : The partition key of the table

CREATE example
{
"tableName":"<<TABLE-NAME>>",
  "operation": "CREATE",
  "item": {
    "id": "1",
    "name": "Item 1",
    "description": "This is item 1"
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
    case 'CREATE':
      response = await createItem(event.item, tableName);
      break;
    default:
      response = `Invalid operation: ${event.operation}`;
      break;
  }
  return response;
};

async function createItem(item, tableName) {
  const params = {
    TableName: tableName,
    Item: item,
  };

  return await ddbDocClient.put(params);
}
