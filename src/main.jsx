import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  const [business, setBusiness] = useState('Recharge Digicel Haiti');
  const [type, setType] = useState('Pub Facebook');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult('⏳ Génération en cours...');

    try {
      const response = await fetch("https://ghostreach-ai-v2.onrender.com/generate", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Business : ${business}. Type de contenu demandé : ${type}.`
        }),
      });

      const data = await response.json();

      if (data.result) {
        setResult(data.result);
      } else {
        setResult('Erreur : ' + JSON.stringify(data));
      }
    } catch (error) {
      setResult('Erreur connexion serveur.');
    }

    setLoading(false);
  };

  const copyText = () => {
    navigator.clipboard.writeText(result);
    alert('Texte copié !');
  };

  return (
    <div className="app">
      <h1>GhostReach AI</h1>

      <div className="card">
        <h2>Générateur IA Marketing</h2>

        <input
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          placeholder="Ton business"
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
        

        <button onClick={generate} disabled={loading}>
          {loading ? 'Génération...' : 'Générer'}
        </button>

        {result && (
          <>
            <pre>{result}</pre>
            <button onClick={copyText}>Copier le texte</button>
          </>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);