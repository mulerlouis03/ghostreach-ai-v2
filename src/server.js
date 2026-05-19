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
        ? "Écris uniquement en créole haïtien naturel, vendeur et moderne."
        : "Écris uniquement en français naturel, moderne et vendeur.";

    const websiteInstruction = website
      ? `Ajoute ce lien intelligemment : ${website}`
      : "";

    const prompt = `
Tu es un expert mondial du marketing digital.

${languageInstruction}

Business :
${business}

${websiteInstruction}

Type :
${type}

Règles :
- Sois vendeur
- Moderne
- Utilise emojis intelligemment
- Fais un appel à l'action
- Texte prêt à publier
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/generate-image", async (req, res) => {
  try {
    const { business, type } = req.body;

    const imagePrompt = `
Create a premium social media advertising poster for:

${business}

Style:
- modern marketing
- ultra realistic
- social media ad
- vibrant colors
- luxury branding
- high quality
- professional lighting
- mobile marketing style
- add marketing visual effects

Content type:
${type}

Make it look like a real Facebook/Instagram advertisement.
`;

    const image = await client.images.generate({
      model: "gpt-image-1",
      prompt: imagePrompt,
      size: "1024x1024",
    });

    res.json({
      image: image.data[0].url,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Serveur lancé sur port " + PORT);
});