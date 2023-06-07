const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const dbClient = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocument.from(dbClient);


/* Example of json to lambda :
{
  "tableName":"<<TABLE-NAME>>",
  "operation": "UPDATE",
  "key": {
    "id": "1"
  },
  "updateExpression": "set #name = :name, description = :description",
  "expressionAttributeValues": {
    ":name": "Updated Item 1",
    ":description": "This is updated item 1"
  }
}
 */

exports.handler = async (event) => {
  const tableName = event.tableName;
  const operation =event.operation.toUpperCase();
  let response;
  switch (operation) {
    case 'CREATE':
      response = await createItem(event.item);
      break;
    case 'READ':
      response = await readItem(event.key);
      break;
    case 'UPDATE':
      response = await updateItem(event.key, event.updateExpression, event.expressionAttributeValues);
      break;
    case 'DELETE':
      response = await deleteItem(event.key);
      break;
    default:
      response = `Invalid operation: ${event.operation}`;
      break;
  }
  return response;
};

async function createItem(item) {
  const params = {
    TableName: 'your-table-name',
    Item: item,
  };

  return ddbDocClient.put(params);
}

async function readItem(key) {
  const params = {
    TableName: 'your-table-name',
    Key: key,
  };

  const { Item } = await ddbDocClient.get(params);
  return Item;
}

async function updateItem(key, updateExpression, expressionAttributeValues) {
  const params = {
    TableName: 'your-table-name',
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues:"UPDATED_NEW"
  };

  return ddbDocClient.update(params);
}

async function deleteItem(key) {
  const params = {
    TableName: 'your-table-name',
    Key: key,
  };

  return ddbDocClient.delete(params);
}