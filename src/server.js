import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: `Réponds uniquement en français. Crée une publicité marketing claire et attractive pour : ${prompt}`,
        },
      ],
    });

    res.json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(3001, () => {
  console.log("Serveur lancé sur http://localhost:3001");
});