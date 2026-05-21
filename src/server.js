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
    const { business, website, type, language, adStyle, customStyle } = req.body;

    const languageInstruction =
      language === "Kreyòl Ayisyen"
        ? "Écris uniquement en créole haïtien naturel, vendeur et facile à comprendre en Haïti."
        : "Écris uniquement en français naturel, vendeur et professionnel.";

    const customInstruction = customStyle?.trim()
      ? `
INSTRUCTION PERSONNALISÉE OBLIGATOIRE DE L'UTILISATEUR :
${customStyle}

Tu dois absolument respecter cette instruction.
Si l'utilisateur demande un code promo, une phrase précise, une offre, un ton ou un détail spécifique, il doit apparaître clairement dans le texte final.
`
      : "Aucune instruction personnalisée fournie.";

    const prompt = `
Tu es un expert mondial du marketing digital, du copywriting et de la vente.

${languageInstruction}

Business :
${business}

Lien web :
${website || "aucun"}

Type de contenu :
${type}

Style général choisi :
${adStyle}

${customInstruction}

Règles obligatoires :
- Le texte doit être prêt à publier.
- Respecte absolument l'instruction personnalisée si elle existe.
- Si l'utilisateur demande un code promo, écris-le clairement.
- Si l'utilisateur demande un style précis, adapte tout le texte à ce style.
- Sois vendeur, humain, moderne et simple.
- Utilise des emojis intelligemment.
- Ajoute un appel à l'action clair.
- Mentionne Digicel ET Natcom seulement si le business parle de recharge mobile.
- Ne force jamais Digicel si l'utilisateur demande Natcom uniquement.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({
      result: "Erreur génération texte",
      error: error.message,
    });
  }
});

app.post("/generate-image", async (req, res) => {
  try {
    const { business, type, language, adStyle, customStyle } = req.body;

    const customImageInstruction = customStyle?.trim()
      ? `
USER CUSTOM IMAGE INSTRUCTION - MUST FOLLOW:
${customStyle}

If the user asks for a promo code, coupon, specific visual style, color, mood, object, text, layout, country vibe, or branding detail, include it visually in the poster.
`
      : "";

    const prompt = `
Create a low-cost modern social media advertising poster.

Business:
${business}

Content type:
${type}

Language:
${language}

Selected ad style:
${adStyle}

${customImageInstruction}

Mandatory visual rules:
- Follow the selected ad style.
- Follow the custom user instruction if provided.
- If a promo code is requested, include a visible promo-code style element on the poster.
- Make it look like a real Facebook / Instagram / WhatsApp advertisement.
- Modern colors.
- Simple clean layout.
- No long paragraphs of text.
- Professional marketing poster.
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