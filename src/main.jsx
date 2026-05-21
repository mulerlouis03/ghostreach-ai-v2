import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import html2canvas from "html2canvas";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "./style.css";

const API_URL = "https://ghostreach-ai-v2.onrender.com";
const ADMIN_EMAIL = "gayeplaisir@gmail.com";

const firebaseConfig = {
  apiKey: "AIzaSyC3_Y5KCiPqOOCqrKqVa6AnDPt52De8RvM",
  authDomain: "copynova-ai-5027c.firebaseapp.com",
  projectId: "copynova-ai-5027c",
  storageBucket: "copynova-ai-5027c.firebasestorage.app",
  messagingSenderId: "360133301945",
  appId: "1:360133301945:web:11e19c8b88bf5e971e6d68",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState(null);
  const isAdmin = user?.email === ADMIN_EMAIL;

  const [business, setBusiness] = useState("Recharge Digicel et Natcom Haiti");
  const [website, setWebsite] = useState("");
  const [type, setType] = useState("Script TikTok Viral");
  const [videoTemplate, setVideoTemplate] = useState("Hook 3 secondes");
  const [language, setLanguage] = useState("Français");
  const [adStyle, setAdStyle] = useState("Moderne premium");
  const [customStyle, setCustomStyle] = useState("");
  const [palette, setPalette] = useState("dark");

  const [result, setResult] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [logo, setLogo] = useState(null);

  const [imageCount, setImageCount] = useState(() => {
    return Number(localStorage.getItem("daily_image_count")) || 0;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  async function loginWithGoogle() {
    await signInWithPopup(auth, provider);
  }

  async function logout() {
    await signOut(auth);
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  }

  async function generateText() {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business,
          website,
          type,
          language,
          adStyle,
          customStyle,
          videoTemplate,
        }),
      });

      const data = await response.json();
      setResult(data.result || data.error || "Erreur génération texte.");
    } catch {
      setResult("Erreur serveur.");
    } finally {
      setLoading(false);
    }
  }

  async function generateImage() {
    if (!user) {
      alert("Connecte-toi avec Google pour générer une image.");
      return;
    }

    if (!isAdmin && imageCount >= 3) {
      alert("⚠️ Limite gratuite atteinte. Passe Premium pour générer plus d’images.");
      return;
    }

    setImageLoading(true);

    try {
      const response = await fetch(`${API_URL}/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business,
          type,
          language,
          adStyle,
          customStyle,
          videoTemplate,
        }),
      });

      const data = await response.json();

      if (data.image) {
        setGeneratedImage(data.image);

        if (!isAdmin) {
          const newCount = imageCount + 1;
          setImageCount(newCount);
          localStorage.setItem("daily_image_count", newCount);
        }
      } else {
        alert("Erreur image : " + (data.error || "image non générée"));
      }
    } catch {
      alert("Erreur serveur image.");
    } finally {
      setImageLoading(false);
    }
  }

  function downloadPoster() {
    const poster = document.getElementById("posterPreview");

    html2canvas(poster, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "copynova-pub.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logoMark">✦</div>
          <div>
            <h2>TIKOAI</h2>
            <p>Viral Content AI</p>
          </div>
        </div>

        <nav>
          <button className="navActive">⚡ Générateur</button>
          <button>📊 Statistiques</button>
          <button>🕘 Historique</button>
          <button>💎 Premium</button>
          <button>⚙️ Réglages</button>
        </nav>

        <div className="authBox">
          {!user ? (
            <button onClick={loginWithGoogle}>Connexion Google</button>
          ) : (
            <>
              <p>{user.email}</p>
              {isAdmin && <strong>Admin illimité ✅</strong>}
              {!isAdmin && <small>Utilisateur gratuit</small>}
              <button onClick={logout}>Déconnexion</button>
            </>
          )}
        </div>
      </aside>

      <main className="main">
        <header className="hero">
          <div>
            <h1>Crée des publicités IA complètes</h1>
            <p>
              Génère textes, images et scripts TikTok/Reels prêts à publier.
            </p>
          </div>
        </header>

        <section className="workspace">
          <div className="panel">
            <h2>✍️ Générateur IA</h2>

            <label>Logo du business</label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} />

            <label>Nom du business</label>
            <input value={business} onChange={(e) => setBusiness(e.target.value)} />

            <label>Lien web</label>
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://monsite.com"
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
              <option>Reel Instagram</option>
              <option>Story Instagram</option>
              <option>Short YouTube</option>
              <option>Message WhatsApp Business</option>
              <option>Slogan Business Premium</option>
              <option>Hashtags Instagram</option>
              <option>Message Telegram</option>
            </select>

            {(type.includes("TikTok") ||
              type.includes("Reel") ||
              type.includes("Story") ||
              type.includes("Short")) && (
              <>
                <label>Template vidéo TikTok/Reels</label>
                <select
                  value={videoTemplate}
                  onChange={(e) => setVideoTemplate(e.target.value)}
                >
                  <option>Hook 3 secondes</option>
                  <option>Problème → Solution</option>
                  <option>Avant / Après</option>
                  <option>Promo urgente</option>
                  <option>Storytelling client</option>
                  <option>Vidéo courte 15 secondes</option>
                  <option>Témoignage client</option>
                  <option>Top 3 raisons d’acheter</option>
                </select>
              </>
            )}

            <label>Style de publicité</label>
            <select value={adStyle} onChange={(e) => setAdStyle(e.target.value)}>
              <option>Moderne premium</option>
              <option>Flashy réseaux sociaux</option>
              <option>Luxe minimaliste</option>
              <option>Promotion urgente</option>
              <option>Style jeune TikTok</option>
              <option>Corporate professionnel</option>
              <option>Haïtien local chaleureux</option>
            </select>

            <label>Style personnalisé</label>
            <textarea
              className="customTextarea"
              value={customStyle}
              onChange={(e) => setCustomStyle(e.target.value)}
              placeholder="Ex : Fais apparaître le code promo NOVA20, style urgent rouge et jaune, ambiance Haïti..."
            />

            <label>Lisibilité du texte</label>
            <select value={palette} onChange={(e) => setPalette(e.target.value)}>
              <option value="dark">Texte blanc sur fond sombre</option>
              <option value="light">Texte noir sur carte claire</option>
              <option value="blue">Palette bleue premium</option>
              <option value="gold">Palette dorée luxe</option>
            </select>

            <button className="generateBtn" onClick={generateText} disabled={loading}>
              {loading ? "Génération texte..." : "✨ Générer le contenu"}
            </button>

            {!isAdmin && (
              <p className="freeLimit">
                Images gratuites restantes : {Math.max(0, 3 - imageCount)}
              </p>
            )}

            {isAdmin && (
              <p className="freeLimit adminLimit">
                Admin : images illimitées activées ✅
              </p>
            )}

            <button className="imageBtn" onClick={generateImage} disabled={imageLoading}>
              {imageLoading ? "Création image..." : "🎨 Générer image IA low-cost"}
            </button>
          </div>

          <div className="panel">
            <div className={`posterPreview ${palette}`} id="posterPreview">
              {generatedImage && (
                <img className="posterBackground" src={generatedImage} alt="Background" />
              )}

              <div className="posterOverlay">
                <div className="posterTop">
                  {logo && <img className="posterLogo" src={logo} alt="Logo" />}
                </div>

                <div className="posterContent">
                  <div className="textCard">
                    <h2>{business}</h2>
                    <pre>{result || "Ton contenu généré apparaîtra ici."}</pre>

                    {website && (
                      <a href={website} target="_blank" rel="noreferrer">
                        Visiter le site
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {(generatedImage || result) && (
              <button className="downloadBtn" onClick={downloadPoster}>
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