
import { SESClient, SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
export const handler = async(event) => {
    const sesClient = new SESClient({ region: 'us-east-1' });
    
const messageBody = JSON.parse(event['Records'][0]['body'])


async function sendTemplatedEmail() {
    const messageAttributes = messageBody.MessageAttributes
    const teamName = messageAttributes.teamName.Value.toString()
    const playerEmail = messageAttributes.playerName.Value.toString()
    const lambdaTeamJoinURL = 'https://ftloi7ufag7wos7wrjvq6fw7su0cdozw.lambda-url.us-east-1.on.aws/?playerEmail='+playerEmail+'&teamName='+teamName
    const params = {
        "Destination": { 
            "ToAddresses": [
                playerEmail
            ]
        },
        "Source": 'ad368540@dal.ca', 
        "Template": 'joinTeamEmail', 
        "TemplateData": "{ \"name\":\""+playerEmail+"\", \"lambdaTeamJoinURL\":\""+ lambdaTeamJoinURL+"\",\"invitedTeam\":\""+teamName+"\" }", // Replace with your template data
    };
    const templateData = params
    try {
        const data = await sesClient.send(new SendTemplatedEmailCommand(templateData));
        console.log("Email sent, ID: ", data.$metadata.requestId);
    } catch (err) {
        console.error(err);
    }
}
await sendTemplatedEmail();
    // TODO implement
    const response = {
        statusCode: 200
    };
    return response;
};
