import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

const API_URL = "https://ghostreach-ai-v2.onrender.com/generate";

function App() {
  const [business, setBusiness] = useState("Recharge Digicel et Natcom Haiti");
  const [type, setType] = useState("Pub Facebook");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          business: business.trim(),
          type
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setResult("❌ Erreur IA : " + (data.result || data.error || "réessaie dans quelques secondes."));
        return;
      }

      setResult(data.result || "❌ Aucun texte généré. Réessaie.");
    } catch (error) {
      setResult(
        "❌ Impossible de contacter l’IA. Si tu es sur téléphone, attends 30 secondes puis réessaie."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyText() {
    if (!result) return;

    await navigator.clipboard.writeText(result);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>CopyNova AI</h2>
        <p>AI Content & Marketing Platform</p>

        <nav>
          <span className="active">⚡ Générateur</span>
          <span>📊 Statistiques</span>
          <span>🕘 Historique</span>
          <span>💎 Premium</span>
          <span>⚙️ Réglages</span>
        </nav>
      </aside>

      <main className="main">
        <header className="hero">
          <div>
            <h1>Crée du contenu marketing puissant avec l’IA</h1>
            <p>
              Génère des pubs Facebook, messages WhatsApp, scripts TikTok,
              slogans, hashtags et contenus sociaux en quelques secondes.
            </p>
          </div>

          <button className="premium">Passer Premium</button>
        </header>

        <section className="stats">
          <div>
            🚀 <strong>Rapide</strong>
            <span>Contenu prêt à publier</span>
          </div>

          <div>
            🇫🇷 <strong>Français</strong>
            <span>Textes naturels et vendeurs</span>
          </div>

          <div>
            📱 <strong>Mobile</strong>
            <span>Utilisable depuis ton téléphone</span>
          </div>
        </section>

        <section className="card">
          <h2>Créer un contenu</h2>

          <label>Nom ou idée du business</label>
          <input
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="Ex : Recharge Digicel et Natcom Haiti"
          />

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
              <h3>Résultat généré</h3>
              <pre>{result}</pre>

              <button onClick={copyText}>
                {copied ? "✅ Copié !" : "Copier le texte"}
              </button>
            </div>
          )}
        </section>

        <footer className="footer">
          © 2026 CopyNova AI — Powered by Artificial Intelligence
        </footer>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);