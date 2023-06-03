const AWS = require('aws-sdk');

class DynamoDBCRUDClient{
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamoDB = new AWS.DynamoDB.DocumentClient();
  }

  async createItem(item) {
    const params = {
      TableName: this.tableName,
      Item: item,
    };

    try {
      await this.dynamoDB.put(params).promise();
      console.log('Item created successfully');
      return true;
    } catch (error) {
      console.error('Error creating item:', error);
      return false;
    }
  }

  async getItem(key) {
    const params = {
      TableName: this.tableName,
      Key: key,
    };

    try {
      const result = await this.dynamoDB.get(params).promise();
      const item = result.Item;
      if (item) {
        console.log('Item retrieved successfully:', item);
      } else {
        console.log('Item not found');
      }
      return item;
    } catch (error) {
      console.error('Error retrieving item:', error);
    }

  }
/* example:
const updateExpression = 'SET age = :newAge';
const expressionAttributeValues = {
  ':newAge': 31,
};
 */
  async updateItem(key, updateExpression, expressionAttributeValues) {
    const params = {
      TableName: this.tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };

    try {
      const result = await this.dynamoDB.update(params).promise();
      const updatedItem = result.Attributes;
      console.log('Item updated successfully:', updatedItem);
      return result;
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }

  async deleteItem(key) {
    const params = {
      TableName: this.tableName,
      Key: key,
    };

    try {
      await this.dynamoDB.delete(params).promise();
      console.log('Item deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  }
}

module.exports = DynamoDBCRUDClient;