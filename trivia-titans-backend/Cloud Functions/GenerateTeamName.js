const functions = require('@google-cloud/functions-framework');
const { Configuration, OpenAIApi } = require("openai");
const cors = require('cors');

// Configure the OpenAI API with my API key set in the cloud function's Environment Variables
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Enable CORS for all origins
const corsMiddleware = cors();

functions.http('GenerateTeamName', (req, res) => {
    // Use the CORS middleware here
    corsMiddleware(req, res, async () => {
        try {
            // Call the OpenAI API to generate a quirky team name
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: "Generate one unique, quirky team name for a team trivia game application. Just give me the one name, without any extra words in your answer." }],
                temperature: 0.8,
                max_tokens: 256,
            });

            // Extract the generated team name from the OpenAI response
            const teamName = response.data?.choices?.[0]?.message?.content || 'Quirky Team Name';

            // Send the team name as a JSON response with status code 200
            res.status(200).json({ teamName });
        } catch (error) {
            console.error("Error generating team name:", error);
            res.status(500).json({ error: "An error occurred while generating the team name.", message: error });
        }
    });
});