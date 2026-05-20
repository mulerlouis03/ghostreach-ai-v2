import React, { useState } from "react";import html2canvas from "html2canvas";
import ReactDOM from "react-dom/client";
import "./style.css";

const API_URL = "https://ghostreach-ai-v2.onrender.com";

function App() {
  const [business, setBusiness] = useState("Recharge Digicel et Natcom Haiti");
  const [website, setWebsite] = useState("");
  const [type, setType] = useState("Pub Facebook");
  const [language, setLanguage] = useState("Français");

  const [result, setResult] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [logo, setLogo] = useState(null);

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setLogo(reader.result);
    };

    reader.readAsDataURL(file);
  }

  async function generateText() {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business,
          website,
          type,
          language,
        }),
      });

      const data = await response.json();

      setResult(data.result || "Erreur génération texte.");
    } catch {
      setResult("Erreur serveur.");
    } finally {
      setLoading(false);
    }
  }

  async function generateImage() {
    setImageLoading(true);

    try {
      const response = await fetch(`${API_URL}/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business,
          type,
          language,
        }),
      });

      const data = await response.json();

      if (data.image) {
        setGeneratedImage(data.image);
      }
    } catch {
      console.log("Erreur image");
    } finally {
      setImageLoading(false);
    }
  }

  function downloadPoster() {
    const poster = document.getElementById("posterPreview");

    html2canvas(poster).then((canvas) => {
      const link = document.createElement("a");
      link.download = "copynova-poster.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logoMark">✦</div>

          <div>
            <h2>CopyNova AI</h2>
            <p>AI Marketing Generator</p>
          </div>
        </div>

        <nav>
          <button className="navActive">⚡ Générateur</button>
          <button>📊 Statistiques</button>
          <button>🕘 Historique</button>
          <button>💎 Premium</button>
          <button>⚙️ Réglages</button>
        </nav>
      </aside>

      <main className="main">
        <header className="hero">
          <div>
            <h1>Crée des publicités IA complètes</h1>

            <p>
              Génère textes, images publicitaires et affiches professionnelles
              automatiquement.
            </p>
          </div>
        </header>

        <section className="workspace">
          <div className="panel">
            <h2>✍️ Générateur IA</h2>

            <label>Logo du business</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
            />

            <label>Nom du business</label>

            <input
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            />

            <label>Lien web</label>

            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://monsite.com"
            />

            <label>Langue</label>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>Français</option>
              <option>Kreyòl Ayisyen</option>
            </select>

            <label>Type de contenu</label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Pub Facebook</option>
              <option>Post Instagram</option>
              <option>Message WhatsApp</option>
              <option>Script TikTok</option>
              <option>Script TikTok Viral</option>
            </select>

            <button
              className="generateBtn"
              onClick={generateText}
              disabled={loading}
            >
              {loading ? "Génération..." : "✨ Générer le texte"}
            </button>

            <button
              className="imageBtn"
              onClick={generateImage}
              disabled={imageLoading}
            >
              {imageLoading
                ? "Création image..."
                : "🎨 Générer image IA"}
            </button>
          </div>

          <div className="panel">
            <div className="posterPreview" id="posterPreview">
              {generatedImage && (
                <img
                  className="posterBackground"
                  src={generatedImage}
                  alt="Background"
                />
              )}

              <div className="posterOverlay">
                {logo && (
                  <img
                    className="posterLogo"
                    src={logo}
                    alt="Logo"
                  />
                )}

                <div className="posterContent">
                  <h2>{business}</h2>

                  <pre>{result}</pre>

                  {website && (
                    <a href={website} target="_blank">
                      Visiter le site
                    </a>
                  )}
                </div>
              </div>
            </div>

            {(generatedImage || result) && (
              <button
                className="downloadBtn"
                onClick={downloadPoster}
              >
                ⬇️ Télécharger la pub
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);