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
    const { business, type } = req.body;

    let prompt = "";

    if (type === "Pub Facebook") {
      prompt = `Crée une publicité Facebook ultra convaincante pour le business suivant : ${business}`;
    }

    if (type === "Post Instagram") {
      prompt = `Crée un post Instagram viral pour : ${business}`;
    }

    if (type === "Message WhatsApp") {
      prompt = `Crée un message WhatsApp marketing professionnel pour : ${business}`;
    }

    if (type === "Script TikTok") {
      prompt = `Crée un script TikTok captivant pour : ${business}`;
    }

    if (type === "Script TikTok Viral") {
      prompt = `Crée un script TikTok extrêmement viral avec hook puissant, émotion et appel à l'action pour : ${business}`;
    }

    if (type === "Message WhatsApp Business") {
      prompt = `Crée un message WhatsApp Business premium pour convertir des clients pour : ${business}`;
    }

    if (type === "Slogan Business Premium") {
      prompt = `Crée 10 slogans premium modernes et puissants pour : ${business}`;
    }

    if (type === "Hashtags Instagram") {
      prompt = `Crée 20 hashtags Instagram viraux pour : ${business}`;
    }

    if (type === "Message Telegram") {
      prompt = `Crée un message Telegram marketing très engageant pour : ${business}`;
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = completion.choices[0].message.content;

    res.json({ result });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      result: "Erreur serveur",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Serveur lancé sur port " + PORT);
});