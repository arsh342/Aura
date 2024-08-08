const PORT = process.env.PORT || 8000;
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

        if (!Array.isArray(history)) {
            return res.status(400).json({ error: "History should be an array" });
        }

        if (typeof message !== 'string') {
            return res.status(400).json({ error: "Message should be a string" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const chat = model.startChat({ history });

        const result = await chat.sendMessage(message);
        const response = await result.response;

        if (!response || !response.text) {
            throw new Error('Invalid response from model');
        }

        const text = response.text();
        res.send(text);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
