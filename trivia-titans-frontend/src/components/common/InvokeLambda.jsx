import {InvokeCommand, LambdaClient} from '@aws-sdk/client-lambda';
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

const invokeLambdaFunction = async (functionName,payload) => {

    try {
        const lambdaClientCredentials = fromCognitoIdentityPool({
            identityPoolId: 'us-east-1:79432309-bc2e-447e-86b7-84c5b115e0e0',
            client: new CognitoIdentityClient({region: "us-east-1"})
        });
        const lambdaClient = await new LambdaClient({region: 'us-east-1', credentials: lambdaClientCredentials});

        const params = {
            FunctionName: functionName,
            Payload: JSON.stringify(payload),
        };

        const {Payload} = await lambdaClient.send(new InvokeCommand(params));
        console.log('Lambda function output:', Payload);
        console.log(lambdaClientCredentials);
    } catch (err) {
        console.error(err);
    }
}
export default invokeLambdaFunction;