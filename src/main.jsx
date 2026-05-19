import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

function App() {
  const [business, setBusiness] = useState("");
  const [type, setType] = useState("Pub Facebook");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setResult("⏳ Génération en cours...");

    try {
      const response = await fetch("https://ghostreach-ai-v2.onrender.com/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business,
          type,
        }),
      });

      const data = await response.json();

      setResult(data.result);
    } catch (error) {
      setResult("❌ Erreur serveur");
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <h1>GhostReach AI</h1>

      <div className="card">
        <h2>Générateur IA Marketing</h2>

        <input
          type="text"
          placeholder="Nom du business"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
        />

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
          {loading ? "Génération..." : "Générer"}
        </button>

        <div className="result">
          {result}
        </div>

        <button
          className="copy-btn"
          onClick={() => navigator.clipboard.writeText(result)}
        >
          Copier le texte
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);