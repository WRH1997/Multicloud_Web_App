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
{
"tableName":"<<TABLE-NAME>>",
  "operation": "CREATE",
  "item": {
    "id": "1",
    "name": "Item 1",
    "description": "This is item 1"
  }
}
{
"tableName":"<<TABLE-NAME>>",
  "operation": "READ",
  "key": {
    "id": "1"
  }
}

 */

exports.handler = async (event) => {
  const tableName = event.tableName;
  const operation =event.operation.toUpperCase();
  let response;
  switch (operation) {
    case 'CREATE':
      response = await createItem(event.item,tableName);
      break;
    case 'READ':
      response = await readItem(event.key,tableName);
      break;
    case 'UPDATE':
      response = await updateItem(event.key, event.updateExpression, event.expressionAttributeValues,tableName);
      break;
    case 'DELETE':
      response = await deleteItem(event.key,tableName);
      break;
    default:
      response = `Invalid operation: ${event.operation}`;
      break;
  }
  return response;
};

async function createItem(item,tableName) {
  const params = {
    TableName: tableName,
    Item: item,
  };

  return ddbDocClient.put(params);
}

async function readItem(key,tableName) {
  const params = {
    TableName: tableName,
    Key: key,
  };

  const { Item } = await ddbDocClient.get(params);
  return Item;
}

async function updateItem(key, updateExpression, expressionAttributeValues,tableName) {
  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues:"UPDATED_NEW"
  };

  return ddbDocClient.update(params);
}

async function deleteItem(key,tableName) {
  const params = {
    TableName: tableName,
    Key: key,
  };

  return ddbDocClient.delete(params);
}