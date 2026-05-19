import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

function App() {
  const [business, setBusiness] = useState("Recharge Digicel Haiti");
  const [type, setType] = useState("Pub Facebook");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setResult("⏳ Génération en cours...");

    try {
      const response = await fetch("https://ghostreach-ai-v2.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business, type }),
      });

      const data = await response.json();
      setResult(data.result || "Erreur serveur");
    } catch {
      setResult("❌ Erreur connexion serveur");
    }

    setLoading(false);
  }

  function copyText() {
    navigator.clipboard.writeText(result);
    alert("Texte copié !");
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>GhostReach</h2>
        <p>AI Marketing Studio</p>

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
            <h1>Génère du contenu marketing avec l’IA</h1>
            <p>Crée des pubs, messages WhatsApp, scripts TikTok et slogans en quelques secondes.</p>
          </div>
          <button className="premium">Passer Premium</button>
        </header>

        <section className="stats">
          <div>🚀 <strong>Rapide</strong><span>Génération instantanée</span></div>
          <div>🇫🇷 <strong>Français</strong><span>Contenu naturel</span></div>
          <div>💼 <strong>Business</strong><span>Optimisé vente</span></div>
        </section>

        <section className="card">
          <h2>Créer un contenu</h2>

          <label>Nom du business</label>
          <input value={business} onChange={(e) => setBusiness(e.target.value)} />

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
            {loading ? "Génération..." : "Générer avec l’IA"}
          </button>

          {result && (
            <div className="resultBox">
              <h3>Résultat généré</h3>
              <pre>{result}</pre>
              <button onClick={copyText}>Copier le texte</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);