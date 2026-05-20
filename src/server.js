import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* TEXTE AVEC GEMINI */
app.post("/generate", async (req, res) => {
  try {
    const { business, website, type, language } = req.body;

    const languageInstruction =
      language === "Kreyòl Ayisyen"
        ? "Écris uniquement en créole haïtien naturel, clair, vendeur et moderne."
        : "Écris uniquement en français naturel, clair, vendeur et professionnel.";

    const prompt = `
Tu es un expert mondial du marketing digital, du copywriting et de la vente sur les réseaux sociaux.

${languageInstruction}

Business :
${business}

Lien web :
${website || "aucun"}

Type de contenu :
${type}

Règles :
- texte prêt à publier
- moderne
- vendeur
- humain
- simple
- emojis intelligents
- appel à l’action clair
- ne force jamais Digicel si l’utilisateur demande Natcom
- mentionne Digicel ET Natcom seulement si le business parle de recharge mobile
`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      result: response.text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      result: "Erreur génération texte Gemini",
      error: error.message,
    });
  }
});

/* IMAGE AVEC OPENAI */
app.post("/generate-image", async (req, res) => {
  try {
    const { business, type, language } = req.body;

    const prompt = `
Create a modern social media advertising poster.

Business:
${business}

Content type:
${type}

Language:
${language}

Style:
- premium advertisement
- professional social media poster
- Facebook / Instagram / WhatsApp quality
- modern startup design
- vibrant colors
- clean layout
- mobile-first advertising
- realistic marketing visual
- no long text
`;

    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const base64 = image.data[0].b64_json;

    res.json({
      image: `data:image/png;base64,${base64}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

/* SERVEUR */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Serveur lancé sur port " + PORT);
});