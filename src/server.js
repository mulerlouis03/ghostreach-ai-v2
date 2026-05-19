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
    const { business, website, type, language } = req.body;

    const languageInstruction =
      language === "Kreyòl Ayisyen"
        ? "Écris uniquement en créole haïtien naturel, clair, vendeur et facile à comprendre en Haïti."
        : "Écris uniquement en français naturel, professionnel et vendeur.";

    const websiteInstruction = website
      ? `Lien web du business à intégrer intelligemment si utile : ${website}`
      : "Aucun lien web fourni.";

    const prompt = `
Tu es un expert mondial en marketing digital, publicité, copywriting viral et vente sur les réseaux sociaux.

${languageInstruction}

Business :
${business}

${websiteInstruction}

Type de contenu demandé :
${type}

Règles importantes :
- Si un lien web est fourni, ajoute-le naturellement comme appel à l'action.
- Mentionne Digicel ET Natcom seulement si le business parle de recharge mobile.
- Ne force jamais Digicel si l'utilisateur demande Natcom.
- Sois moderne, humain, convaincant et simple.
- Utilise des emojis avec intelligence.
- Ajoute un appel à l'action clair.
- Le texte doit être prêt à publier.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      result: "Erreur serveur",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Serveur lancé sur port " + PORT);
});