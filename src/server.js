import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  try {
    const { business, website, type, language } = req.body;

    const languageInstruction =
      language === "Kreyòl Ayisyen"
        ? "Écris uniquement en créole haïtien naturel, vendeur et moderne."
        : "Écris uniquement en français naturel, vendeur et professionnel.";

    const prompt = `
Tu es un expert mondial du marketing digital.

${languageInstruction}

Business :
${business}

Lien web :
${website || "aucun"}

Type :
${type}

Règles :
- texte prêt à publier
- vendeur
- humain
- emojis intelligents
- appel à l'action clair
- mentionne Digicel ET Natcom seulement si le business parle de recharge mobile
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ result: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({
      result: "Erreur génération texte",
      error: error.message,
    });
  }
});

app.post("/generate-image", async (req, res) => {
  try {
    const { business, type, language } = req.body;

    const prompt = `
Create a low-cost modern social media advertising poster.

Business:
${business}

Content type:
${type}

Language:
${language}

Style:
- clean advertising poster
- mobile social media ad
- Facebook / Instagram / WhatsApp style
- modern colors
- simple layout
- no long text
- professional but lightweight
`;

    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      quality: "low",
    });

    res.json({
      image: `data:image/png;base64,${image.data[0].b64_json}`,
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