import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
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
READ example
{
"tableName":"<<TABLE-NAME>>",
  "operation": "READ",
  "key": {
    "id": "1"
  }
}
SCAN example
{
"tableName":"<<TABLE-NAME>>",
  "operation": "SCAN"
}
SCAN-WITH-FILTERS example
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
        case 'CREATE':
            response = await createItem(event.item, tableName);
            break;
        case 'READ':
            response = await readItem(event.key, tableName);
            break;
        case 'UPDATE':
            response = await updateItem(event.key, event.updateExpression, event.expressionAttributeValues, tableName);
            break;
        case 'DELETE':
            response = await deleteItem(event.key, tableName);
            break;
        case 'SIMPLE_SCAN':
            response = await scanTableWithoutPagination(tableName);
            break;
        case 'SCAN_WITH_PARAMS':
            response = await scanDynamoDBTableWithParams(tableName, event.scanKey, event.scanValue);
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

async function readItem(key, tableName) {
    const params = {
        TableName: tableName,
        Key: key,
    };

    const { Item } = await ddbDocClient.get(params);
    return Item;
}

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

async function deleteItem(key, tableName) {
    const params = {
        TableName: tableName,
        Key: key,

    }; return await ddbDocClient.delete(params);
}
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