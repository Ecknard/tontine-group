import { kv } from '@vercel/kv';

const MEMBRES = ['Pionz', 'Ado', 'Zyggy', 'Ced', 'Diplo', 'Sam', 'Stone'];
const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'];

export async function getServerSideProps() {
  let data = {};
  try {
    const raw = await kv.get('tontine');
    if (raw) data = raw;
  } catch (e) {}

  const membres = MEMBRES.map(nom => {
    const cotis = MOIS.map((_, i) => !!(data[nom] && data[nom][i]));
    const total = cotis.filter(Boolean).length;
    return { nom, cotis, total };
  });

  return { props: { membres, mois: MOIS, updatedAt: new Date().toISOString() } };
}

export default function Home({ membres, mois, updatedAt }) {
  const date = new Date(updatedAt).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

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
          padding: 0;
          overflow-x: hidden;
        }

        .noise {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
        }

        .glow {
          position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 700px; height: 500px; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse at center, rgba(130,80,255,0.18) 0%, transparent 70%);
        }

        .wrap {
          position: relative; z-index: 1;
          max-width: 560px; margin: 0 auto;
          padding: 48px 20px 64px;
        }

        header { margin-bottom: 48px; }

        .badge {
          display: inline-block;
          background: rgba(130,80,255,0.15);
          border: 1px solid rgba(130,80,255,0.3);
          color: #a78bfa;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 99px;
          margin-bottom: 16px;
        }

        h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px, 8vw, 58px);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #fff 30%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .subtitle {
          color: #6b6880;
          font-size: 14px;
          font-weight: 300;
          margin-top: 10px;
        }

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 20px 22px;
          margin-bottom: 12px;
          transition: border-color 0.2s;
        }
        .card:hover { border-color: rgba(167,139,250,0.25); }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .nom {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #f0eeff;
          letter-spacing: -0.02em;
        }

        .score {
          font-size: 12px;
          font-weight: 500;
          color: #6b6880;
        }
        .score span {
          color: #a78bfa;
          font-weight: 600;
        }

        .track {
          height: 6px;
          background: rgba(255,255,255,0.06);
          border-radius: 99px;
          overflow: hidden;
          margin-bottom: 14px;
        }

        .fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #7c3aed, #a78bfa);
          transition: width 1s cubic-bezier(.16,1,.3,1);
        }

        .fill.complet { background: linear-gradient(90deg, #059669, #34d399); }
        .fill.zero { background: rgba(255,255,255,0.1); }

        .mois-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .mois-pill {
          font-size: 11px;
          font-weight: 500;
          padding: 3px 10px;
          border-radius: 99px;
          letter-spacing: 0.02em;
        }

        .mois-pill.ok {
          background: rgba(52,211,153,0.12);
          color: #34d399;
          border: 1px solid rgba(52,211,153,0.2);
        }

        .mois-pill.non {
          background: rgba(255,255,255,0.04);
          color: #3d3a4e;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .footer {
          text-align: center;
          margin-top: 40px;
          font-size: 12px;
          color: #3d3a4e;
        }

        .footer a {
          color: #6b6880;
          text-decoration: none;
        }
        .footer a:hover { color: #a78bfa; }
      `}</style>

      <div className="noise" />
      <div className="glow" />

      <div className="wrap">
        <header>
          <div className="badge">Tontine 2025</div>
          <h1>Cotisations</h1>
          <p className="subtitle">15€ / mois · Janvier → Juin · {membres.length} membres</p>
        </header>

        {membres.map(({ nom, cotis, total }) => {
          const pct = Math.round((total / mois.length) * 100);
          const cls = total === mois.length ? 'complet' : total === 0 ? 'zero' : '';
          return (
            <div className="card" key={nom}>
              <div className="card-top">
                <span className="nom">{nom}</span>
                <span className="score"><span>{total}</span>/{mois.length} mois</span>
              </div>
              <div className="track">
                <div className={`fill ${cls}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="mois-row">
                {mois.map((m, i) => (
                  <span key={i} className={`mois-pill ${cotis[i] ? 'ok' : 'non'}`}>
                    {cotis[i] ? '✓' : '·'} {m.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        <div className="footer">
          Mis à jour le {date} · <a href="/admin">Admin</a>
        </div>
      </div>
    </>
  );
}
