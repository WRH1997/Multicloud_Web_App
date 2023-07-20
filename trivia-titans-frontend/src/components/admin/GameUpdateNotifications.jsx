import invokeLambdaFunction from "../common/InvokeLambda";

export const subscribeToGameUpdates = async (userEmail) => {
    const jsonPayload = {
        userEmail: userEmail
    };
    return await invokeLambdaFunction('SubscribeToGameUpdates_SNSTopic', jsonPayload);
}