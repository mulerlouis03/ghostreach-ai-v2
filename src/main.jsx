import { useState } from "react";
import "./style.css";

const API_URL = "https://ghostreach-ai-v2.onrender.com";

export default function App() {
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [language, setLanguage] = useState("Français");
  const [contentType, setContentType] =
    useState("Pub Facebook");

  const [styleType, setStyleType] =
    useState("Moderne premium");

  const [customStyle, setCustomStyle] =
    useState("");

  const [videoIdea, setVideoIdea] =
    useState("");

  const [generatedText, setGeneratedText] =
    useState("");

  const [videoScript, setVideoScript] =
    useState("");

  const [imageUrl, setImageUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [logo, setLogo] =
    useState(null);

  const generateContent = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            businessName,
            website,
            language,
            contentType,
            styleType,
            customStyle,
          }),
        }
      );

      const data =
        await response.json();

      setGeneratedText(data.text);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/generate-image`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            businessName,
            generatedText,
            customStyle,
          }),
        }
      );

      const data =
        await response.json();

      setImageUrl(data.imageUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const generateVideoScript =
    async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/generate-video-script`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              businessName,
              generatedText,
              videoIdea,
            }),
          }
        );

        const data =
          await response.json();

        setVideoScript(data.script);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logoMark">
            T
          </div>

          <div>
            <h2>TIKOAI</h2>
            <p>Viral Content AI</p>
          </div>
        </div>

        <nav>
          <button className="navActive">
            ⚡ Générateur
          </button>

          <button>
            📊 Statistiques
          </button>

          <button>
            🕘 Historique
          </button>

          <button>
            💎 Premium
          </button>

          <button>
            ⚙️ Réglages
          </button>
        </nav>
      </aside>

      <main className="main">
        <div className="hero">
          <h1>
            Crée des publicités IA
            complètes
          </h1>

          <p>
            Génère textes,
            images et scripts
            TikTok/Reels prêts à
            publier.
          </p>
        </div>

        <div className="workspace">
          <div className="panel">
            <h2>
              ✍️ Générateur IA
            </h2>

            <label>
              Logo du business
            </label>

            <input
              type="file"
              onChange={(e) =>
                setLogo(
                  URL.createObjectURL(
                    e.target.files[0]
                  )
                )
              }
            />

            <label>
              Nom du business
            </label>

            <input
              value={businessName}
              onChange={(e) =>
                setBusinessName(
                  e.target.value
                )
              }
            />

            <label>Site web</label>

            <input
              value={website}
              onChange={(e) =>
                setWebsite(
                  e.target.value
                )
              }
            />

            <label>Langue</label>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target.value
                )
              }
            >
              <option>
                Français
              </option>

              <option>
                English
              </option>
            </select>

            <label>
              Type de contenu
            </label>

            <select
              value={contentType}
              onChange={(e) =>
                setContentType(
                  e.target.value
                )
              }
            >
              <option>
                Pub Facebook
              </option>

              <option>
                Script TikTok Viral
              </option>

              <option>
                Story Instagram
              </option>

              <option>
                Promo Business
              </option>
            </select>

            <label>
              Style de publicité
            </label>

            <select
              value={styleType}
              onChange={(e) =>
                setStyleType(
                  e.target.value
                )
              }
            >
              <option>
                Moderne premium
              </option>

              <option>
                Luxe
              </option>

              <option>
                Urgence promo
              </option>

              <option>
                Minimaliste
              </option>
            </select>

            <label>
              Style personnalisé
            </label>

            <textarea
              className="customTextarea"
              placeholder="Ex : ajoute un code promo, ambiance Haïti, style luxe, urgent..."
              value={customStyle}
              onChange={(e) =>
                setCustomStyle(
                  e.target.value
                )
              }
            />

            <label>
              Consigne vidéo TikTok
            </label>

            <textarea
              className="customTextarea"
              placeholder="Ex : transforme le texte en vidéo TikTok avec 5 scènes, sous-titres animés, hook viral..."
              value={videoIdea}
              onChange={(e) =>
                setVideoIdea(
                  e.target.value
                )
              }
            />

            <button
              className="generateBtn"
              onClick={
                generateContent
              }
            >
              {loading
                ? "Chargement..."
                : "✨ Générer le contenu"}
            </button>

            <button
              className="imageBtn"
              onClick={
                generateImage
              }
            >
              🎨 Générer image IA
            </button>

            <button
              className="videoBtn"
              onClick={
                generateVideoScript
              }
            >
              🎬 Générer script
              vidéo TikTok
            </button>
          </div>

          <div className="panel">
            <div className="posterPreview dark">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt=""
                  className="posterBackground"
                />
              )}

              <div className="posterOverlay">
                <div className="posterTop">
                  {logo && (
                    <img
                      src={logo}
                      alt=""
                      className="posterLogo"
                    />
                  )}
                </div>

                <div className="posterContent">
                  <div className="textCard">
                    <h2>
                      {businessName}
                    </h2>

                    <pre>
                      {generatedText ||
                        "Ton contenu généré apparaîtra ici."}
                    </pre>

                    {website && (
                      <a
                        href={website}
                        target="_blank"
                      >
                        🚀 Découvrir
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {videoScript && (
              <div
                style={{
                  marginTop: 30,
                }}
              >
                <h2>
                  🎬 Script vidéo
                  TikTok
                </h2>

                <pre
                  style={{
                    whiteSpace:
                      "pre-wrap",
                    lineHeight: 1.7,
                    marginTop: 20,
                  }}
                >
                  {videoScript}
                </pre>

                <button
                  className="downloadBtn"
                  onClick={() => {
                    const blob =
                      new Blob(
                        [videoScript],
                        {
                          type: "text/plain",
                        }
                      );

                    const link =
                      document.createElement(
                        "a"
                      );

                    link.href =
                      URL.createObjectURL(
                        blob
                      );

                    link.download =
                      "tiktok-script.txt";

                    link.click();
                  }}
                >
                  ⬇ Télécharger le
                  script
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}