import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useEffect, useRef, useState } from 'react';

const MARQUEE_ITEMS = [
    { text: 'Livraison Rapide 24/48h', accent: false },
    { text: '✦', accent: true },
    { text: 'Paiement 100% Sécurisé', accent: false },
    { text: '✦', accent: true },
    { text: 'Support Client 24/7', accent: false },
    { text: '✦', accent: true },
    { text: 'Nouvelle Collection Disponible', accent: false },
    { text: '✦', accent: true },
    { text: 'Retours Gratuits 30 Jours', accent: false },
    { text: '✦', accent: true },
];

const CATEGORIES = [
    {
        name: 'Électronique',
        sub: 'Smartphones, PC, Accessoires',
        count: '240+ articles',
        decor: '01',
        bg: 'linear-gradient(160deg, #2C3D35 0%, #111A16 100%)',
    },
    {
        name: 'Mode & Vêtements',
        sub: 'Nouvelle collection hiver',
        count: '180+ articles',
        decor: '02',
        bg: 'linear-gradient(160deg, #3D3028 0%, #1A120E 100%)',
    },
    {
        name: 'Maison & Déco',
        sub: 'Mobilier et aménagement',
        count: '120+ articles',
        decor: '03',
        bg: 'linear-gradient(160deg, #2A3544 0%, #111820 100%)',
    },
];

const TRUST_ITEMS = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        ),
        title: 'Livraison Rapide',
        desc: 'Partout dans le pays en 24/48h, sans frais cachés.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                <path d="M2 11h20" />
            </svg>
        ),
        title: 'Paiement Sécurisé',
        desc: 'Transactions chiffrées 256-bit SSL. Vos données protégées.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
        ),
        title: 'Support 24/7',
        desc: 'Une équipe dédiée à votre écoute, tous les jours.',
    },
];

export default function Home() {
    const [visible, setVisible] = useState(false);
    const heroRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    const fadeStyle = (delay) => ({
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    });

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --cream: #F5F0E8;
          --sand: #E8DDD0;
          --bark: #B8A898;
          --earth: #6B5B4E;
          --charcoal: #2A2420;
          --black: #0F0D0C;
          --accent: #C8472A;
          --gold: #C9A96E;
          --white: #FDFAF7;
        }

        body { font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--charcoal); }

        .vaux-display { font-family: 'Playfair Display', Georgia, serif; }

        /* NAV */
        .vaux-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 3rem;
          background: rgba(253,250,247,0.93);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(184,168,152,0.3);
        }
        .vaux-nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.55rem;
          letter-spacing: 0.1em;
          color: var(--black);
          text-decoration: none;
        }
        .vaux-nav-links { display: flex; gap: 2.2rem; list-style: none; padding: 0; margin: 0; }
        .vaux-nav-links a {
          font-size: 0.75rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--earth); text-decoration: none; transition: color 0.2s;
        }
        .vaux-nav-links a:hover { color: var(--black); }
        .vaux-nav-actions { display: flex; gap: 1rem; align-items: center; }
        .vaux-nav-btn {
          font-size: 0.75rem; letter-spacing: 0.13em; text-transform: uppercase;
          padding: 0.55rem 1.3rem; border-radius: 2px;
          text-decoration: none; display: inline-block; cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .vaux-nav-btn.ghost {
          background: transparent; color: var(--charcoal);
          border: 1px solid var(--bark);
        }
        .vaux-nav-btn.ghost:hover { border-color: var(--charcoal); color: var(--black); }
        .vaux-nav-btn.solid {
          background: var(--charcoal); color: var(--white); border: 1px solid var(--charcoal);
        }
        .vaux-nav-btn.solid:hover { background: var(--black); }

        /* HERO */
        .vaux-hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding-top: 72px;
        }
        .vaux-hero-left {
          background: var(--cream);
          display: flex; flex-direction: column; justify-content: center;
          padding: 5rem 4rem 5rem 5rem;
          position: relative; overflow: hidden;
        }
        .vaux-hero-left::before {
          content: '';
          position: absolute; bottom: -80px; left: -80px;
          width: 340px; height: 340px;
          border-radius: 50%; background: var(--sand); opacity: 0.55;
          pointer-events: none;
        }
        .vaux-eyebrow {
          font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 1.4rem; font-weight: 500;
        }
        .vaux-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 4.5vw, 4.5rem);
          line-height: 1.08; color: var(--black); margin-bottom: 1.6rem;
          position: relative; z-index: 1;
        }
        .vaux-hero-title em { font-style: italic; color: var(--earth); }
        .vaux-hero-sub {
          font-size: 0.98rem; line-height: 1.8; color: var(--earth);
          max-width: 360px; margin-bottom: 2.5rem; font-weight: 300;
          position: relative; z-index: 1;
        }
        .vaux-ctas { display: flex; gap: 1rem; align-items: center; position: relative; z-index: 1; }
        .vaux-btn-primary {
          background: var(--charcoal); color: var(--white);
          padding: 1rem 2.2rem; font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;
          border: none; cursor: pointer; border-radius: 2px; text-decoration: none;
          display: inline-block; transition: background 0.2s, transform 0.15s;
        }
        .vaux-btn-primary:hover { background: var(--black); transform: translateY(-1px); }
        .vaux-btn-ghost {
          background: transparent; color: var(--charcoal);
          padding: 1rem 2rem; font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;
          border: 1px solid var(--bark); cursor: pointer; border-radius: 2px;
          text-decoration: none; display: inline-block;
          transition: border-color 0.2s, color 0.2s;
        }
        .vaux-btn-ghost:hover { border-color: var(--charcoal); color: var(--black); }
        .vaux-hero-stats {
          margin-top: 3.5rem; display: flex; gap: 2.8rem;
          position: relative; z-index: 1;
        }
        .vaux-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; color: var(--black); font-weight: 700;
        }
        .vaux-stat-label {
          font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--bark); margin-top: 3px;
        }

        /* HERO RIGHT */
        .vaux-hero-right {
          background: var(--charcoal);
          position: relative; overflow: hidden;
          display: flex; align-items: flex-end; justify-content: flex-end;
          padding: 2.5rem;
        }
        .vaux-hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #3D3530 0%, #1A1410 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .vaux-hero-badge {
          position: absolute; top: 2.5rem; left: 2.5rem; z-index: 2;
          background: var(--accent); color: white;
          font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
          padding: 0.5rem 1rem; border-radius: 2px; font-weight: 500;
        }
        .vaux-product-card {
          position: relative; z-index: 2;
          background: rgba(253,250,247,0.07);
          border: 1px solid rgba(253,250,247,0.12);
          backdrop-filter: blur(18px);
          padding: 1.3rem 1.6rem; border-radius: 4px; max-width: 210px;
        }
        .vaux-product-tag {
          font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 0.45rem;
        }
        .vaux-product-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem; color: var(--white); margin-bottom: 0.55rem;
        }
        .vaux-product-price { font-size: 0.88rem; color: rgba(253,250,247,0.55); font-weight: 300; }

        /* MARQUEE */
        .vaux-marquee { background: var(--black); padding: 0.9rem 0; overflow: hidden; white-space: nowrap; }
        .vaux-marquee-inner { display: inline-block; animation: vaux-marquee 28s linear infinite; }
        .vaux-marquee-inner span {
          font-size: 0.68rem; letter-spacing: 0.24em; text-transform: uppercase;
          color: var(--bark); margin: 0 1.8rem;
        }
        .vaux-marquee-inner span.gold { color: var(--gold); }
        @keyframes vaux-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* TRUST STRIP */
        .vaux-trust {
          background: var(--white);
          display: grid; grid-template-columns: repeat(3, 1fr);
          border-bottom: 1px solid rgba(184,168,152,0.2);
        }
        .vaux-trust-item {
          display: flex; gap: 1.2rem; align-items: flex-start;
          padding: 2.8rem 3rem;
          border-right: 1px solid rgba(184,168,152,0.2);
        }
        .vaux-trust-item:last-child { border-right: none; }
        .vaux-trust-icon {
          width: 44px; height: 44px; flex-shrink: 0;
          background: var(--cream); border: 1px solid var(--sand);
          border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          color: var(--gold);
        }
        .vaux-trust-title {
          font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--black); margin-bottom: 0.4rem; font-weight: 500;
        }
        .vaux-trust-desc { font-size: 0.83rem; color: var(--earth); line-height: 1.65; font-weight: 300; }

        /* CATEGORIES */
        .vaux-section { padding: 5.5rem 5rem; }
        .vaux-section-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 3rem;
        }
        .vaux-section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.9rem, 3vw, 2.8rem); color: var(--black); line-height: 1.15;
        }
        .vaux-section-title em { font-style: italic; color: var(--earth); }
        .vaux-section-link {
          font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--earth); text-decoration: none;
          border-bottom: 1px solid var(--bark); padding-bottom: 2px;
          transition: color 0.2s;
        }
        .vaux-section-link:hover { color: var(--black); }
        .vaux-cat-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
        }
        .vaux-cat-card {
          position: relative; height: 280px; border-radius: 3px;
          overflow: hidden; cursor: pointer;
        }
        .vaux-cat-bg {
          position: absolute; inset: 0;
          transition: transform 0.5s ease;
        }
        .vaux-cat-card:hover .vaux-cat-bg { transform: scale(1.05); }
        .vaux-cat-decor {
          position: absolute; font-family: 'Playfair Display', serif;
          font-size: 8rem; font-weight: 700; color: white; opacity: 0.06;
          bottom: -0.5rem; right: 0.8rem; line-height: 1; pointer-events: none;
        }
        .vaux-cat-info {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 1.4rem 1.8rem;
          background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%);
        }
        .vaux-cat-count {
          font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.5); margin-bottom: 0.3rem;
        }
        .vaux-cat-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem; color: white; font-weight: 400;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .vaux-nav { padding: 1.1rem 1.5rem; }
          .vaux-nav-links { display: none; }
          .vaux-hero { grid-template-columns: 1fr; }
          .vaux-hero-right { min-height: 300px; }
          .vaux-hero-left { padding: 3.5rem 2rem; }
          .vaux-trust { grid-template-columns: 1fr; }
          .vaux-trust-item { border-right: none; border-bottom: 1px solid rgba(184,168,152,0.2); padding: 2rem; }
          .vaux-section { padding: 4rem 1.5rem; }
          .vaux-cat-grid { grid-template-columns: 1fr 1fr; }
          .vaux-cat-grid > :last-child { grid-column: span 2; }
        }
        @media (max-width: 640px) {
          .vaux-cat-grid { grid-template-columns: 1fr; }
          .vaux-cat-grid > :last-child { grid-column: span 1; }
          .vaux-hero-stats { gap: 1.8rem; }
          .vaux-ctas { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

            { /* Navbar is provided by App.jsx for unified navigation across pages */ }

            {/* HERO */}
            <section className="vaux-hero">
                <div className="vaux-hero-left" ref={heroRef}>
                    <p className="vaux-eyebrow" style={fadeStyle(100)}>Nouvelle Collection — Printemps 2026</p>
                    <h1 className="vaux-hero-title" style={fadeStyle(250)}>
                        La qualité<br /><em>premium</em><br />à portée de clic.
                    </h1>
                    <p className="vaux-hero-sub" style={fadeStyle(400)}>
                        Des produits soigneusement sélectionnés pour répondre à vos exigences. Livraison rapide, retours gratuits, satisfaction garantie.
                    </p>
                    <div className="vaux-ctas" style={fadeStyle(540)}>
                        <Link to="/dashboard" className="vaux-btn-primary">Voir les produits</Link>
                    </div>
                    <div className="vaux-hero-stats" style={fadeStyle(680)}>
                        <div>
                            <div className="vaux-stat-num">14k+</div>
                            <div className="vaux-stat-label">Produits</div>
                        </div>
                        <div>
                            <div className="vaux-stat-num">98%</div>
                            <div className="vaux-stat-label">Satisfaction</div>
                        </div>
                        <div>
                            <div className="vaux-stat-num">60+</div>
                            <div className="vaux-stat-label">Pays livrés</div>
                        </div>
                    </div>
                </div>
                <div className="vaux-hero-right">
                    <div className="vaux-hero-bg">
                        <svg width="280" height="280" viewBox="0 0 280 280" fill="none" opacity="0.07">
                            <rect x="50" y="35" width="180" height="210" rx="4" stroke="white" strokeWidth="2.5"/>
                            <rect x="80" y="65" width="120" height="75" rx="2" stroke="white" strokeWidth="2"/>
                            <line x1="80" y1="168" x2="200" y2="168" stroke="white" strokeWidth="2"/>
                            <line x1="80" y1="188" x2="160" y2="188" stroke="white" strokeWidth="2"/>
                            <line x1="80" y1="208" x2="140" y2="208" stroke="white" strokeWidth="2"/>
                        </svg>
                    </div>
                    <span className="vaux-hero-badge">Livraison offerte dès 80€</span>
                    <div className="vaux-product-card">
                        <div className="vaux-product-tag">Article vedette</div>
                        <div className="vaux-product-name">Tote en cuir artisanal</div>
                        <div className="vaux-product-price">À partir de 245€</div>
                    </div>
                </div>
            </section>

            {/* MARQUEE */}
            <div className="vaux-marquee">
                <div className="vaux-marquee-inner">
                    {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                        <span key={i} className={item.accent ? 'gold' : ''}>{item.text}</span>
                    ))}
                </div>
            </div>

            {/* TRUST STRIP */}
            <div className="vaux-trust">
                {TRUST_ITEMS.map((item, i) => (
                    <div className="vaux-trust-item" key={i}>
                        <div className="vaux-trust-icon">{item.icon}</div>
                        <div>
                            <div className="vaux-trust-title">{item.title}</div>
                            <div className="vaux-trust-desc">{item.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CATEGORIES */}
            <section className="vaux-section">
                <div className="vaux-section-header">
                    <h2 className="vaux-section-title">Catégories<br /><em>Populaires</em></h2>
                    <Link to="/dashboard" className="vaux-section-link">Voir tout</Link>
                </div>
                <div className="vaux-cat-grid">
                    {CATEGORIES.map((cat, i) => (
                        <Link to="/dashboard" key={i} style={{ textDecoration: 'none' }}>
                            <div className="vaux-cat-card">
                                <div className="vaux-cat-bg" style={{ background: cat.bg }} />
                                <div className="vaux-cat-decor">{cat.decor}</div>
                                <div className="vaux-cat-info">
                                    <div className="vaux-cat-count">{cat.count}</div>
                                    <div className="vaux-cat-name">{cat.name}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}
