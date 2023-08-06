import {InvokeCommand, LambdaClient} from '@aws-sdk/client-lambda';
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

// Generic code to invoke ANY lambda function, given the function name and payload.
const invokeLambdaFunction = async (functionName,payload) => {

    // uses AWS cognito to get sample credentials as the Browser-based SDKs don't have access to any session or persistent storage.
    // References : https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_credential_provider_cognito_identity.html
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
        const Payload = await lambdaClient.send(new InvokeCommand(params));
        const asciiDecoder = new TextDecoder('ascii');
        return JSON.parse(asciiDecoder.decode(Payload.Payload));
    } catch (err) {
        console.error(err);
    }
}
export default invokeLambdaFunction;