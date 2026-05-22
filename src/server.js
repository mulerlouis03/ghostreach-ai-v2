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
    const {
      business,
      website,
      type,
      language,
      adStyle,
      customStyle,
      videoTemplate,
    } = req.body;

    const languageInstruction =
      language === "Kreyòl Ayisyen"
        ? "Écris uniquement en créole haïtien naturel, vendeur et facile à comprendre en Haïti."
        : "Écris uniquement en français naturel, vendeur et professionnel.";

    const isVideo =
      type?.includes("TikTok") ||
      type?.includes("Reel") ||
      type?.includes("Story") ||
      type?.includes("Short");

    const videoInstruction = isVideo
      ? `
FORMAT VIDÉO COURTE :
Template demandé : ${videoTemplate}

Structure obligatoire :
1. Hook très fort dans les 3 premières secondes
2. Scène 1
3. Scène 2
4. Texte à afficher à l’écran
5. Voix off courte
6. Appel à l’action final
7. Hashtags adaptés- IMPORTANT : pour une affiche publicitaire, génère un texte court : maximum 5 à 7 lignes.
- Ne fais pas un long post complet.
- Mets seulement : accroche + offre + code promo si demandé + appel à l’action.
`
      : "";

    const customInstruction = customStyle?.trim()
      ? `
INSTRUCTION PERSONNALISÉE OBLIGATOIRE :
${customStyle}

Tu dois absolument respecter cette instruction dans le texte final.
`
      : "Aucune instruction personnalisée.";

    const prompt = `
Tu es un expert mondial du marketing digital, du copywriting, des publicités sociales et des vidéos courtes.

${languageInstruction}

Business :
${business}

Lien web :
${website || "aucun"}

Type de contenu demandé :
${type}

Style général :
${adStyle}

${videoInstruction}

${customInstruction}

Règles obligatoires :
- Le contenu doit être prêt à publier.
- Respecte absolument le style personnalisé.
- Si l'utilisateur demande un code promo, il doit apparaître clairement.
- Si l'utilisateur demande un style visuel ou émotionnel, adapte le contenu à ce style.
- Sois vendeur, humain, moderne, simple et convaincant.
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
    const {
      business,
      type,
      language,
      adStyle,
      customStyle,
      videoTemplate,
    } = req.body;

    const isVideo =
      type?.includes("TikTok") ||
      type?.includes("Reel") ||
      type?.includes("Story") ||
      type?.includes("Short");

    const customImageInstruction = customStyle?.trim()
      ? `
USER CUSTOM IMAGE INSTRUCTION - MUST FOLLOW:
${customStyle}

If the user asks for a promo code, coupon, visual style, color, mood, object, layout, local Haitian vibe, or branding detail, include it visually in the poster.
`
      : "";

    const videoImageInstruction = isVideo
      ? `
This poster should look like a vertical short-video cover / TikTok-Reels thumbnail.
Video template:
${videoTemplate}
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

Selected style:
${adStyle}

${videoImageInstruction}

${customImageInstruction}

Mandatory visual rules:
- Follow the selected ad style.
- Follow the custom user instruction if provided.
- If a promo code is requested, show it clearly as a promo badge.
- Make it look like a real Facebook / Instagram / WhatsApp / TikTok advertisement.
- Use modern colors.
- Simple clean layout.
- Professional marketing poster.
- No long paragraphs of text.
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