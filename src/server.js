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

/* ======================
   TEXTE PUBLICITAIRE
====================== */

app.post("/generate", async (req, res) => {
  try {
    const {
      businessName,
      website,
      language,
      contentType,
      styleType,
      customStyle,
    } = req.body;

    const prompt = `
Tu es un expert mondial du marketing digital, TikTok, Facebook Ads, Instagram Reels et copywriting viral.

Business :
${businessName}

Site web :
${website || "aucun"}

Langue :
${language}

Type de contenu :
${contentType}

Style :
${styleType}

Instruction personnalisée obligatoire :
${customStyle || "aucune"}

Règles :
- respecte absolument l’instruction personnalisée
- si l’utilisateur demande un code promo, il doit apparaître clairement
- texte court, puissant, prêt à publier
- maximum 5 à 7 lignes
- accroche forte
- offre claire
- appel à l’action
- emojis intelligents
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      text: completion.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* ======================
   IMAGE PUBLICITAIRE
====================== */

app.post("/generate-image", async (req, res) => {
  try {
    const { businessName, generatedText, customStyle } = req.body;

    const prompt = `
Create a modern advertising image for social media.

Business:
${businessName}

Generated ad text:
${generatedText || ""}

Custom visual instructions:
${customStyle || "modern premium style"}

Style:
- professional social media poster
- TikTok / Instagram / Facebook ad
- modern layout
- vibrant colors
- clean design
- no long paragraphs
- leave space for overlay text
`;

    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      quality: "low",
    });

    res.json({
      imageUrl: `data:image/png;base64,${image.data[0].b64_json}`,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* ======================
   SCRIPT VIDÉO TIKTOK
====================== */

app.post("/generate-video-script", async (req, res) => {
  try {
    const { businessName, generatedText, videoIdea } = req.body;

    const prompt = `
Tu es un expert TikTok, Reels Instagram et vidéos courtes virales.

Transforme ce texte publicitaire en script vidéo TikTok léger et prêt à tourner.

Business :
${businessName}

Texte publicitaire :
${generatedText}

Consigne vidéo :
${videoIdea || "Vidéo dynamique, moderne, facile à réaliser."}

Crée un script avec :

1. HOOK 3 SECONDES
2. SCÈNE 1
3. SCÈNE 2
4. SCÈNE 3
5. SCÈNE 4
6. SCÈNE 5
7. SOUS-TITRES ANIMÉS À AFFICHER
8. IDÉE DE MUSIQUE OU AMBIANCE
9. APPEL À L’ACTION FINAL
10. HASHTAGS

Format clair, court, pratique et directement utilisable.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      script: completion.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* ======================
   SERVER
====================== */

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Serveur lancé sur port " + PORT);
});