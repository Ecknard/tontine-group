import { useState } from 'react';

const MEMBRES = ['Pionz', 'Ado', 'Zyggy', 'Ced', 'Diplo', 'Sam', 'Stone'];
const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'];
const MOT_DE_PASSE = 'tontine2025';

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState('');
  const [erreur, setErreur] = useState(false);
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function login(e) {
    e.preventDefault();
    if (pwd === MOT_DE_PASSE) {
      const res = await fetch('/api/get');
      const json = await res.json();
      setData(json.data || {});
      setAuth(true);
    } else {
      setErreur(true);
      setTimeout(() => setErreur(false), 1500);
    }
  }

  function toggle(nom, i) {
    setData(prev => {
      const next = { ...prev };
      if (!next[nom]) next[nom] = {};
      next[nom] = { ...next[nom], [i]: !next[nom][i] };
      return next;
    });
    setSaved(false);
  }

  async function sauvegarder() {
    setSaving(true);
    await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const isPaid = (nom, i) => !!(data[nom] && data[nom][i]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #0a0a0f;
          color: #e8e6f0;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .noise {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
        }
        .glow {
          position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 700px; height: 500px; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse at center, rgba(130,80,255,0.15) 0%, transparent 70%);
        }
        .wrap {
          position: relative; z-index: 1;
          width: 100%; max-width: 560px;
          padding: 40px 20px 60px;
          margin: 0 auto;
        }

        /* Login */
        .login-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
        }
        .login-box h2 {
          font-family: 'Syne', sans-serif;
          font-size: 28px; font-weight: 800;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #fff 30%, #a78bfa 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .login-box p { color: #6b6880; font-size: 14px; margin-bottom: 28px; }
        .input-wrap { position: relative; margin-bottom: 16px; }
        input[type=password] {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 14px 16px;
          color: #e8e6f0;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        input[type=password]:focus { border-color: rgba(167,139,250,0.5); }
        input[type=password].err { border-color: rgba(239,68,68,0.5); animation: shake 0.3s; }
        @keyframes shake {
          0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)}
        }
        .btn {
          width: 100%;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 14px;
          font-size: 15px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
        }
        .btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn:active { transform: translateY(0); }
        .btn.save {
          width: auto;
          padding: 12px 28px;
          margin-top: 24px;
          display: block;
          margin-left: auto;
        }
        .btn.saved { background: linear-gradient(135deg, #059669, #34d399); }

        /* Admin table */
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 28px;
        }
        .admin-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 32px; font-weight: 800;
          background: linear-gradient(135deg, #fff 30%, #a78bfa 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .admin-header p { color: #6b6880; font-size: 13px; margin-top: 4px; }
        .back-link { color: #6b6880; font-size: 13px; text-decoration: none; }
        .back-link:hover { color: #a78bfa; }

        .membre-row {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px 18px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .membre-row:hover { border-color: rgba(167,139,250,0.2); }
        .membre-nom {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 700;
          color: #f0eeff;
          width: 72px;
          flex-shrink: 0;
        }
        .pills { display: flex; gap: 6px; flex-wrap: wrap; }
        .pill {
          padding: 5px 12px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s;
          user-select: none;
        }
        .pill.ok {
          background: rgba(52,211,153,0.15);
          color: #34d399;
          border-color: rgba(52,211,153,0.25);
        }
        .pill.non {
          background: rgba(255,255,255,0.04);
          color: #3d3a4e;
          border-color: rgba(255,255,255,0.08);
        }
        .pill:hover { transform: scale(1.05); }
        .pill.ok:hover { background: rgba(52,211,153,0.25); }
        .pill.non:hover { background: rgba(255,255,255,0.08); color: #6b6880; }
      `}</style>

      <div className="noise" />
      <div className="glow" />

      <div className="wrap">
        {!auth ? (
          <div className="login-box">
            <h2>Zone Admin</h2>
            <p>Entrez le mot de passe pour gérer les cotisations</p>
            <form onSubmit={login}>
              <div className="input-wrap">
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={pwd}
                  onChange={e => setPwd(e.target.value)}
                  className={erreur ? 'err' : ''}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn">Accéder →</button>
            </form>
          </div>
        ) : (
          <>
            <div className="admin-header">
              <div>
                <h2>Admin</h2>
                <p>Cliquez sur un mois pour basculer payé / non payé</p>
              </div>
              <a href="/" className="back-link">← Voir la page publique</a>
            </div>

            {MEMBRES.map(nom => (
              <div className="membre-row" key={nom}>
                <span className="membre-nom">{nom}</span>
                <div className="pills">
                  {MOIS.map((m, i) => (
                    <span
                      key={i}
                      className={`pill ${isPaid(nom, i) ? 'ok' : 'non'}`}
                      onClick={() => toggle(nom, i)}
                    >
                      {isPaid(nom, i) ? '✓' : '·'} {m.slice(0, 3)}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <button
              className={`btn save ${saved ? 'saved' : ''}`}
              onClick={sauvegarder}
              disabled={saving}
            >
              {saving ? 'Sauvegarde...' : saved ? '✓ Sauvegardé !' : 'Sauvegarder'}
            </button>
          </>
        )}
      </div>
    </>
  );
}
