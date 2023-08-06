
import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";
import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";

const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

export default async function notifyJoinTeam(player,team) {
   const snsClientCredentials = fromCognitoIdentityPool({
       identityPoolId: 'us-east-1:79432309-bc2e-447e-86b7-84c5b115e0e0',
       client: new CognitoIdentityClient({region: "us-east-1"})
   });
    const snsClient = new SNSClient({ region: 'us-east-1',credentials:snsClientCredentials });
    const params = {

        TopicArn: 'arn:aws:sns:us-east-1:940444391781:JoinTeam', // Replace with your Topic ARN
        Message: 'Player is invited to team',
        MessageAttributes: {
            'playerName': {
                DataType: 'String',
                StringValue: player
            },
            'teamName': {
                DataType: 'String',
                StringValue: team
            }
        }
    };

    try {
        const data = await snsClient.send(new PublishCommand(params));
        console.log("Message sent, ID: ", data.MessageId);
    } catch (err) {
        console.error(err, err.stack);
    }
}

