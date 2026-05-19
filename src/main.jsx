import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

const API_URL = "https://ghostreach-ai-v2.onrender.com";
const SITE_URL = "https://ghostreach-ai.netlify.app";

function App() {
  const [page, setPage] = useState("generator");
  const [business, setBusiness] = useState("Recharge Digicel et Natcom Haiti");
  const [website, setWebsite] = useState("");
  const [type, setType] = useState("Pub Facebook");
  const [language, setLanguage] = useState("Français");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [logo, setLogo] = useState(null);
  const [generatedImage, setGeneratedImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("copynova_history");
    return saved ? JSON.parse(saved) : [];
  });

  function saveHistory(item) {
    const updated = [item, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem("copynova_history", JSON.stringify(updated));
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogo(URL.createObjectURL(file));
  }

  async function generate() {
    if (!business.trim()) {
      setResult("⚠️ Écris d’abord le nom ou l’idée de ton business.");
      return;
    }

    setLoading(true);
    setCopied(false);
    setResult("⏳ Connexion à l’IA...");

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business: business.trim(), website, type, language }),
      });

      const data = await response.json();
      const finalText = data.result || data.error || "Erreur serveur";

      setResult(finalText);

      saveHistory({
        id: Date.now(),
        business,
        website,
        type,
        language,
        text: finalText,
        logo,
        date: new Date().toLocaleString(),
      });
    } catch {
      setResult("❌ Impossible de contacter l’IA. Attends 30 secondes puis réessaie.");
    } finally {
      setLoading(false);
    }
  }

  async function generateImage() {
    setImageLoading(true);
    setImageError("");
    setGeneratedImage("");

    try {
      const response = await fetch(`${API_URL}/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business, type, language }),
      });

      const data = await response.json();

      if (data.image) {
        setGeneratedImage(data.image);
      } else {
        setImageError("❌ Image non générée : " + (data.error || "erreur inconnue"));
      }
    } catch {
      setImageError("❌ Impossible de contacter le serveur image.");
    } finally {
      setImageLoading(false);
    }
  }

  async function copyText(text = result) {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function clearHistory() {
    if (!confirm("Supprimer tout l’historique ?")) return;
    setHistory([]);
    localStorage.removeItem("copynova_history");
  }

  const shareText = encodeURIComponent(result);
  const siteUrl = encodeURIComponent(SITE_URL);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logoMark">✦</div>
          <div>
            <h2>CopyNova AI</h2>
            <p>AI Content & Marketing Platform</p>
          </div>
        </div>

        <nav>
          <button className={page === "generator" ? "navActive" : ""} onClick={() => setPage("generator")}>⚡ Générateur</button>
          <button>📊 Statistiques</button>
          <button className={page === "history" ? "navActive" : ""} onClick={() => setPage("history")}>🕘 Historique</button>
          <button>💎 Premium</button>
          <button>⚙️ Réglages</button>
        </nav>
      </aside>

      <main className="main">
        {page === "generator" && (
          <>
            <header className="hero">
              <div>
                <h1>Crée du contenu marketing puissant avec l’IA</h1>
                <p>Génère textes et affiches publicitaires pour Facebook, WhatsApp, Instagram et TikTok.</p>
              </div>
              <button className="premiumTop">👑 Passer Premium</button>
            </header>

            <section className="workspace">
              <div className="panel">
                <h2>✍️ Créer un contenu</h2>

                <label>Logo du business</label>
                <input type="file" accept="image/*" onChange={handleLogoUpload} />

                {logo && (
                  <div className="logoPreview">
                    <img src={logo} alt="Logo business" />
                    <span>Logo ajouté à la publicité</span>
                  </div>
                )}

                <label>Nom ou idée du business</label>
                <input value={business} onChange={(e) => setBusiness(e.target.value)} />

                <label>Lien web du business</label>
                <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://monsite.com" />

                <label>Langue</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option>Français</option>
                  <option>Kreyòl Ayisyen</option>
                </select>

                <label>Type de contenu</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option>Pub Facebook</option>
                  <option>Post Instagram</option>
                  <option>Message WhatsApp</option>
                  <option>Script TikTok</option>
                  <option>Script TikTok Viral</option>
                  <option>Message WhatsApp Business</option>
                  <option>Slogan Business Premium</option>
                  <option>Hashtags Instagram</option>
                  <option>Message Telegram</option>
                </select>

                <button className="generateBtn" onClick={generate} disabled={loading}>
                  {loading ? "Connexion IA..." : "✨ Générer le texte"}
                </button>
              </div>

              <div className="panel resultPanel">
                <div className="resultHeader">
                  <h2>✦ Résultat généré</h2>
                  {result && <button className="smallBtn" onClick={() => copyText()}>{copied ? "✅ Copié" : "📋 Copier"}</button>}
                </div>

                {!result && <div className="emptyState"><p>Ton contenu généré apparaîtra ici.</p></div>}

                {result && (
                  <>
                    <div className="generatedAd">
                      {logo && <img className="resultLogo" src={logo} alt="Logo" />}
                      <pre>{result}</pre>
                    </div>

                    <div className="imageAiSection">
                      <button className="generateImageBtn" onClick={generateImage} disabled={imageLoading}>
                        {imageLoading ? "Création image IA..." : "🎨 Générer une image publicitaire IA"}
                      </button>

                      {imageError && <p className="imageError">{imageError}</p>}

                      {generatedImage && (
                        <img className="generatedImage" src={generatedImage} alt="Publicité IA" />
                      )}
                    </div>

                    <div className="shareArea">
                      <strong>Partager sur</strong>
                      <div className="shareButtons">
                        <a className="whatsapp" href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noreferrer">WhatsApp</a>
                        <a className="facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${siteUrl}`} target="_blank" rel="noreferrer">Facebook</a>
                        <button className="instagram" onClick={() => copyText(result)}>Instagram</button>
                        <a className="telegram" href={`https://t.me/share/url?url=${siteUrl}&text=${shareText}`} target="_blank" rel="noreferrer">Telegram</a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>
          </>
        )}

        {page === "history" && (
          <section className="panel historyPanel">
            <div className="resultHeader">
              <h2>🕘 Historique des générations</h2>
              {history.length > 0 && <button className="smallBtn" onClick={clearHistory}>Supprimer</button>}
            </div>

            {history.length === 0 && <p className="emptyText">Aucun contenu sauvegardé.</p>}

            <div className="historyList">
              {history.map((item) => (
                <div className="historyItem" key={item.id}>
                  {item.logo && <img src={item.logo} alt="logo" />}
                  <strong>{item.type}</strong>
                  <span>{item.business}</span>
                  <small>{item.language} • {item.date}</small>
                  <pre>{item.text}</pre>
                  <button onClick={() => copyText(item.text)}>Copier</button>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer>© 2026 CopyNova AI — Powered by Artificial Intelligence</footer>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);