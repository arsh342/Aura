const PORT = process.env.PORT || 8001;
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

app.post('/gemini', async (req, res) => {
    try {
        const { history, message } = req.body;

        // Input validation
        if (!Array.isArray(history)) {
            return res.status(400).json({ error: "History should be an array" });
        }

        if (typeof message !== 'string') {
            return res.status(400).json({ error: "Message should be a string" });
        }

        // Log input for debugging
        console.log('History:', history);
        console.log('Message:', message);

        // Get the Generative model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Start a chat with the history
        const chat = model.startChat({ history });

        // Send message to the model
        const result = await chat.sendMessage(message);

        // Log the entire result object for debugging
        console.log('Full Result from model:', JSON.stringify(result, null, 2));

        // Check if result contains response text
        const responseText = result?.response?.candidates[0]?.content?.parts[0]?.text;

        if (!responseText) {
            return res.status(500).json({ error: 'Invalid response from model' });
        }

        // Send response back to the client as JSON
        res.json({ response: responseText });

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
