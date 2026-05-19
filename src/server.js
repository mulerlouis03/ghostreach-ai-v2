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
          content: `content: `Tu es un expert mondial du marketing digital, du copywriting viral et des réseaux sociaux.

Crée un contenu très professionnel, émotionnel et vendeur.

Le contenu doit :
- attirer immédiatement l’attention
- donner envie d’acheter
- utiliser un ton moderne
- être optimisé pour Facebook, Instagram, TikTok et WhatsApp
- utiliser des emojis intelligemment
- être clair et très humain
- écrire uniquement en français

Business utilisateur :
${prompt}

Le texte doit être très puissant commercialement.
`,
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});