import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  try {
    const { business, website, type, language } = req.body;

    const languageInstruction =
      language === "Kreyòl Ayisyen"
        ? "Écris uniquement en créole haïtien naturel, vendeur et moderne."
        : "Écris uniquement en français naturel, moderne et vendeur.";

    const prompt = `
Tu es un expert en marketing digital.

${languageInstruction}

Business : ${business}
Lien web : ${website || "aucun lien"}
Type de contenu : ${type}

Règles :
- texte prêt à publier
- vendeur
- simple
- humain
- emojis intelligents
- appel à l'action clair
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ result: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({
      result: "Erreur texte IA",
      error: error.message,
    });
  }
});

app.post("/generate-image", async (req, res) => {
  try {
    const { business, type, language } = req.body;

    const prompt = `
Crée une affiche publicitaire moderne pour les réseaux sociaux.

Business : ${business}
Type : ${type}
Langue : ${language}

Style :
- design premium
- affiche marketing professionnelle
- adaptée Facebook, Instagram, WhatsApp
- couleurs modernes bleu, blanc, violet
- visuel propre et attractif
- sans texte trop long
- style startup / Canva / publicité mobile
`;

    const image = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const base64 = image.data[0].b64_json;

    res.json({
      image: `data:image/png;base64,${base64}`,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Serveur lancé sur port " + PORT);
});