import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const invokeLambdaFunction = async (functionName,payload) => {
        const lambdaClient = new LambdaClient({ region: "us-east-1" });
        const params = {
            FunctionName: functionName,
            Payload: JSON.stringify(payload),
        };

        try {
            const { Payload } = await lambdaClient.send(new InvokeCommand(params));
            console.log('Lambda function output:', Payload);
        } catch (err) {
            console.error('Error invoking lambda function:', err);
        }
    }
    export default invokeLambdaFunction;