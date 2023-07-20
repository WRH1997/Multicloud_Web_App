import { SNSClient, SubscribeCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ region: 'us-east-1' });

export const handler = async (event) => {
    console.log(event);
    const userEmail = event.userEmail;

    const params = {
        Protocol: 'EMAIL',
        TopicArn: 'arn:aws:sns:us-east-1:940444391781:GameUpdates',
        Endpoint: event.userEmail,
    };

    try {

        await snsClient.send(new SubscribeCommand(params));
        const response = {
            statusCode: 200,
            body: JSON.stringify({ message: 'Successfully Added Subscription!' }),
        };
        return response;
    } catch (error) {
        console.error(error, error.stack);
        let response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error in Subscribing User to GameUpdates Topic!',
                error: error.message,
            }),
        };
        return response;
    }
};
