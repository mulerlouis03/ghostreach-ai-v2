import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

const API_URL = "https://ghostreach-ai-v2.onrender.com/generate";

function App() {
  const [page, setPage] = useState("generator");
  const [business, setBusiness] = useState("Recharge Digicel et Natcom Haiti");
  const [type, setType] = useState("Pub Facebook");
  const [language, setLanguage] = useState("Français");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [logo, setLogo] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("copynova_history");
    return saved ? JSON.parse(saved) : [];
  });

  function saveHistory(newItem) {
    const updated = [newItem, ...history].slice(0, 20);
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
    setResult("⏳ Connexion à l’IA... cela peut prendre quelques secondes.");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business: business.trim(), type, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult("❌ Erreur IA : " + (data.result || data.error || "réessaie dans quelques secondes."));
        return;
      }

      const finalText = data.result || "❌ Aucun texte généré. Réessaie.";
      setResult(finalText);

      saveHistory({
        id: Date.now(),
        business,
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
  const siteUrl = encodeURIComponent("https://genuine-duckanoo-8d0894.netlify.app");

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>CopyNova AI</h2>
        <p>AI Content & Marketing Platform</p>

        <nav>
          <span className={page === "generator" ? "active" : ""} onClick={() => setPage("generator")}>
            ⚡ Générateur
          </span>
          <span>📊 Statistiques</span>
          <span className={page === "history" ? "active" : ""} onClick={() => setPage("history")}>
            🕘 Historique
          </span>
          <span>💎 Premium</span>
          <span>⚙️ Réglages</span>
        </nav>
      </aside>

      <main className="main">
        {page === "generator" && (
          <>
            <header className="hero">
              <div>
                <h1>Crée du contenu marketing puissant avec l’IA</h1>
                <p>
                  Génère des pubs Facebook, messages WhatsApp, scripts TikTok,
                  slogans, hashtags et contenus sociaux en français ou en créole haïtien.
                </p>
              </div>
              <button className="premium">Passer Premium</button>
            </header>

            <section className="stats">
              <div>🚀 <strong>Rapide</strong><span>Contenu prêt à publier</span></div>
              <div>🇭🇹 <strong>Bilingue</strong><span>Français & Kreyòl Ayisyen</span></div>
              <div>📱 <strong>Mobile</strong><span>Optimisé téléphone</span></div>
            </section>

            <section className="card">
              <h2>Créer un contenu</h2>

              <label>Logo du business</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} />

              {logo && (
                <div className="logoPreview">
                  <img src={logo} alt="Logo business" />
                  <span>Logo ajouté à la publicité</span>
                </div>
              )}

              <label>Nom ou idée du business</label>
              <input
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="Ex : Recharge Digicel et Natcom Haiti"
              />

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

              <button onClick={generate} disabled={loading}>
                {loading ? "Connexion IA..." : "Générer avec l’IA"}
              </button>

              {result && (
                <div className="resultBox">
                  {logo && <img className="resultLogo" src={logo} alt="Logo" />}
                  <h3>Résultat généré</h3>
                  <pre>{result}</pre>

                  <button onClick={() => copyText()}>
                    {copied ? "✅ Copié !" : "Copier le texte"}
                  </button>

                  <div className="shareButtons">
                    <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noreferrer">
                      📱 WhatsApp
                    </a>
                    <a href={`https://t.me/share/url?url=${siteUrl}&text=${shareText}`} target="_blank" rel="noreferrer">
                      ✈️ Telegram
                    </a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${siteUrl}`} target="_blank" rel="noreferrer">
                      📘 Facebook
                    </a>
                    <button onClick={() => copyText(result)}>🔗 Copier pour Instagram</button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {page === "history" && (
          <section className="card">
            <h2>Historique des générations</h2>

            {history.length > 0 && <button onClick={clearHistory}>Supprimer l’historique</button>}
            {history.length === 0 && <p className="empty">Aucun contenu sauvegardé pour le moment.</p>}

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

        <footer className="footer">
          © 2026 CopyNova AI — Powered by Artificial Intelligence
        </footer>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);