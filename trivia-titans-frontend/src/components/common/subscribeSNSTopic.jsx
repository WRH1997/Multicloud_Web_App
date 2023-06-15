import {SNSClient, SubscribeCommand} from "@aws-sdk/client-sns";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";
import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";
// Set the AWS Region.
const REGION = "us-east-1"; //e.g. "us-east-1"

const subscribeEmailToSNSTopic = async (email) => {

    try {
        const snsClientCredentials = fromCognitoIdentityPool({
            identityPoolId: 'us-east-1:79432309-bc2e-447e-86b7-84c5b115e0e0',
            client: new CognitoIdentityClient({region: "us-east-1"})
        });
        const snsClient = await new SNSClient({ region: REGION, credentials: snsClientCredentials});

        const params = {
            Protocol: "email",
            TopicArn: "TOPIC_ARN",
            Endpoint: email
        };
        return await snsClient.send(new SubscribeCommand(params));
    } catch (err) {
        console.error(err);
    }
}
export default subscribeEmailToSNSTopic;