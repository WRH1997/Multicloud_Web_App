import { DynamoDBClient,ScanCommand  } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
const dbClient = new DynamoDBClient({ region: "us-east-1" });
const ddbDocClient = DynamoDBDocument.from(dbClient);

export const handler = async(event) => {
    try
    {
    const teamTableName = 'teamMembers';

    const userTeamMapping = event.queryStringParameters;
    const item = {
        playerEmail:userTeamMapping.playerEmail,
        teamName: userTeamMapping.teamName,
        teamPermission:'MEMBER'
    };
    const params = {
    TableName: teamTableName,
    Item: item
  };
   ddbDocClient.put(params);
   return 200;
    }
    catch (Error)
    {
        return 500;
    }


};
