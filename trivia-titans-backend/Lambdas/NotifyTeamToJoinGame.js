import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ region: 'us-east-1' });

export const handler = async (event) => {
    try {
        const { teamEmails, teamName, gameId, gameName } = event;
        const message = `Hello Trivia Titan! Join your team - ${teamName} team to play the new game - ${gameName}. They are waiting for you!`;

        for (const email of teamEmails) {

            const snsParams = {
                TopicArn: "arn:aws:sns:us-east-1:940444391781:GameUpdates",
                Message: message,
                Subject: `Join ${teamName} for ${gameName}`,
                MessageAttributes: {
                    Targets: {
                        DataType: 'String',
                        StringValue: email,
                    }
                }
            };

            const publishCommand = new PublishCommand(snsParams);
            await snsClient.send(publishCommand);

            console.log(`Notification sent to ${email}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Game Lobby Notifications sent successfully" })
        };
    } catch (error) {
        console.error("Error sending notifications:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" })
        };
    }
};