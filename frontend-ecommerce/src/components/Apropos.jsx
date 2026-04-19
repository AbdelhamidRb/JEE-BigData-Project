import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const VALUES = [
    {
        num: '01',
        title: 'Artisanat',
        desc: 'Chaque produit est sélectionné selon des critères stricts de fabrication. Nous privilégions les ateliers qui travaillent à la main, avec des matériaux nobles et durables.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
        ),
    },
    {
        num: '02',
        title: 'Durabilité',
        desc: "Nous travaillons exclusivement avec des fournisseurs engagés dans des pratiques responsables. Moins mais mieux — c'est notre philosophie d'approvisionnement.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
            </svg>
        ),
    },
    {
        num: '03',
        title: 'Transparence',
        desc: 'Nos prix reflètent le coût réel de la qualité. Pas de marges cachées, pas de compromis sur les matières. Vous savez exactement ce pour quoi vous payez.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
        ),
    },
    {
        num: '04',
        title: 'Service',
        desc: "Notre équipe est disponible avant, pendant et après votre achat. Nous croyons qu'un excellent service est aussi important que le produit lui-même.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
    },
];

const STATS = [
    { value: '2019', label: 'Année de création' },
    { value: '14k+', label: 'Produits référencés' },
    { value: '60+', label: 'Pays livrés' },
    { value: '98%', label: 'Clients satisfaits' },
];

const TEAM = [
    { initials: 'SA', name: 'Sophie Arnaud', role: 'Fondatrice & Directrice', color: '#C9A96E' },
    { initials: 'MR', name: 'Marc Renaud', role: 'Directeur des Achats', color: '#6B5B4E' },
    { initials: 'LC', name: 'Léa Chevalier', role: 'Responsable Client', color: '#B8A898' },
];

export default function APropos() {
    const [visible, setVisible] = useState(false);
    const heroRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    // Intersection observer for scroll reveals
    useEffect(() => {
        // Guard for environments without IntersectionObserver (e.g., SSR)
        if (typeof IntersectionObserver === 'undefined') {
            // Fallback: reveal all immediately
            document.querySelectorAll('.vap-reveal').forEach(el => el.classList.add('vap-revealed'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vap-revealed'); }),
            { threshold: 0.12 }
        );
        document.querySelectorAll('.vap-reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const fade = (delay) => ({
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    });

    return (
        <>
            <style>{styles}</style>
            <div className="vap-page">

                {/* ─── HERO ─── */}
                <section className="vap-hero" ref={heroRef}>
                    <div className="vap-hero-bg">
                        <div className="vap-hero-circle c1" />
                        <div className="vap-hero-circle c2" />
                        <div className="vap-hero-circle c3" />
                        <div className="vap-hero-decor">VAUX</div>
                    </div>
                    <div className="vap-hero-content">
                        <p className="vap-eyebrow" style={fade(100)}>À Propos de VAUX</p>
                        <h1 className="vap-hero-title" style={fade(260)}>
                            L'excellence<br />
                            <em>au quotidien.</em>
                        </h1>
                        <p className="vap-hero-desc" style={fade(420)}>
                            VAUX est né d'une conviction simple : les objets du quotidien méritent d'être beaux, durables et pensés avec soin. Depuis 2019, nous sélectionnons les meilleures créations à travers le monde pour les mettre à portée de tous.
                        </p>
                        <div style={fade(560)} className="vap-hero-actions">
                            <Link to="/dashboard" className="vap-btn-primary">Découvrir la boutique</Link>
                            <Link to="/register" className="vap-btn-ghost">Rejoindre VAUX</Link>
                        </div>
                    </div>
                </section>

                {/* ─── STATS STRIP ─── */}
                <section className="vap-stats-strip">
                    {STATS.map((s, i) => (
                        <div key={i} className="vap-stat-item vap-reveal">
                            <div className="vap-stat-value">{s.value}</div>
                            <div className="vap-stat-label">{s.label}</div>
                        </div>
                    ))}
                </section>

                {/* ─── STORY ─── */}
                <section className="vap-section">
                    <div className="vap-story-grid">
                        <div className="vap-story-left vap-reveal">
                            <div className="vap-section-eyebrow">Notre Histoire</div>
                            <h2 className="vap-section-title">
                                Née d'une<br /><em>passion</em><br />pour le détail.
                            </h2>
                        </div>
                        <div className="vap-story-right vap-reveal">
                            <p className="vap-body-text">
                                Tout a commencé dans un appartement parisien, autour d'une frustration partagée : impossible de trouver des produits à la fois bien faits, esthétiques et accessibles. Les grandes marques surfacturaient le logo. Les alternatives bon marché sacrifiaient la qualité. Il manquait quelque chose entre les deux.
                            </p>
                            <p className="vap-body-text">
                                Sophie Arnaud, ancienne directrice artistique, et Marc Renaud, expert en sourcing international, ont décidé de combler ce vide. VAUX est le résultat de trois ans de voyages, de rencontres avec des artisans, et d'un processus de sélection implacable.
                            </p>
                            <p className="vap-body-text">
                                Aujourd'hui, chaque produit que vous trouvez sur VAUX a été tenu en main, testé, questionné. Rien n'entre dans notre catalogue par hasard.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ─── MANIFESTO BANNER ─── */}
                <section className="vap-manifesto vap-reveal">
                    <div className="vap-manifesto-inner">
                        <div className="vap-manifesto-quote">
                            "Nous ne vendons pas des produits. Nous défendons une façon de consommer — consciente, durable, et sans compromis sur la beauté."
                        </div>
                        <div className="vap-manifesto-attr">— Sophie Arnaud, Fondatrice</div>
                    </div>
                </section>

                {/* ─── VALUES ─── */}
                <section className="vap-section vap-values-section">
                    <div className="vap-section-header vap-reveal">
                        <div className="vap-section-eyebrow">Nos Engagements</div>
                        <h2 className="vap-section-title-center">Ce qui nous <em>définit</em></h2>
                    </div>
                    <div className="vap-values-grid">
                        {VALUES.map((v, i) => (
                            <div key={i} className="vap-value-card vap-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                                <div className="vap-value-top">
                                    <div className="vap-value-icon">{v.icon}</div>
                                    <span className="vap-value-num">{v.num}</span>
                                </div>
                                <div className="vap-value-title">{v.title}</div>
                                <p className="vap-value-desc">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── TEAM ─── */}
                <section className="vap-section vap-team-section">
                    <div className="vap-section-header vap-reveal">
                        <div className="vap-section-eyebrow">L'Équipe</div>
                        <h2 className="vap-section-title-center">Les visages<br /><em>derrière VAUX</em></h2>
                    </div>
                    <div className="vap-team-grid">
                        {TEAM.map((m, i) => (
                            <div key={i} className="vap-team-card vap-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                                <div className="vap-team-avatar" style={{ background: m.color + '22', borderColor: m.color + '44' }}>
                                    <span style={{ color: m.color }}>{m.initials}</span>
                                </div>
                                <div className="vap-team-name">{m.name}</div>
                                <div className="vap-team-role">{m.role}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── CTA BANNER ─── */}
                <section className="vap-cta vap-reveal">
                    <div className="vap-cta-content">
                        <div className="vap-section-eyebrow" style={{ color: 'var(--gold)' }}>Rejoignez-nous</div>
                        <h2 className="vap-cta-title">
                            Prêt à découvrir<br /><em>l'expérience VAUX ?</em>
                        </h2>
                        <p className="vap-cta-desc">
                            Des milliers de clients nous font confiance. Rejoignez la communauté et accédez à une sélection de produits premium livrés chez vous.
                        </p>
                        <div className="vap-cta-actions">
                            <Link to="/register" className="vap-btn-white">Créer un compte</Link>
                            <Link to="/dashboard" className="vap-btn-outline-white">Voir la boutique</Link>
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
}

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

    :root {
        --cream: #F5F0E8; --sand: #E8DDD0; --bark: #B8A898;
        --earth: #6B5B4E; --charcoal: #2A2420; --black: #0F0D0C;
        --accent: #C8472A; --gold: #C9A96E; --white: #FDFAF7;
    }

    .vap-page { font-family: 'DM Sans', sans-serif; background: var(--white); overflow-x: hidden; }

    /* ── SCROLL REVEAL ── */
    .vap-reveal {
        opacity: 0; transform: translateY(28px);
        transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .vap-revealed { opacity: 1; transform: translateY(0); }

    /* ── HERO ── */
    .vap-hero {
        min-height: 88vh;
        background: var(--charcoal);
        position: relative; overflow: hidden;
        display: flex; align-items: center;
        padding: 7rem 5rem 5rem;
    }
    .vap-hero-bg { position: absolute; inset: 0; pointer-events: none; }
    .vap-hero-circle {
        position: absolute; border-radius: 50%;
        border: 1px solid rgba(201,169,110,0.1);
    }
    .vap-hero-circle.c1 { width: 600px; height: 600px; top: -150px; right: -150px; }
    .vap-hero-circle.c2 { width: 380px; height: 380px; top: -50px; right: 50px; }
    .vap-hero-circle.c3 { width: 200px; height: 200px; bottom: 80px; left: -60px; opacity: 0.5; }
    .vap-hero-decor {
        position: absolute; font-family: 'Playfair Display', serif;
        font-size: 18rem; font-weight: 700; color: white; opacity: 0.025;
        right: -2rem; bottom: -3rem; line-height: 1; letter-spacing: 0.05em;
        pointer-events: none; user-select: none;
    }
    .vap-hero-content { position: relative; z-index: 2; max-width: 620px; }
    .vap-eyebrow {
        font-size: 0.68rem; letter-spacing: 0.26em; text-transform: uppercase;
        color: var(--gold); margin-bottom: 1.3rem; display: block;
    }
    .vap-hero-title {
        font-family: 'Playfair Display', serif;
        font-size: clamp(3rem, 5.5vw, 5rem);
        color: var(--white); line-height: 1.08; margin-bottom: 1.8rem;
    }
    .vap-hero-title em { font-style: italic; color: var(--gold); }
    .vap-hero-desc {
        font-size: 1rem; color: rgba(253,250,247,0.55);
        line-height: 1.85; font-weight: 300; max-width: 480px;
        margin-bottom: 2.8rem;
    }
    .vap-hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

    .vap-btn-primary {
        padding: 1rem 2.2rem; background: var(--white); color: var(--black);
        font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
        letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500;
        border: none; border-radius: 2px; cursor: pointer; text-decoration: none;
        display: inline-block; transition: opacity 0.2s, transform 0.15s;
    }
    .vap-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
    .vap-btn-ghost {
        padding: 1rem 2rem; background: transparent; color: rgba(253,250,247,0.65);
        font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
        letter-spacing: 0.15em; text-transform: uppercase;
        border: 1px solid rgba(253,250,247,0.2); border-radius: 2px;
        cursor: pointer; text-decoration: none; display: inline-block;
        transition: border-color 0.2s, color 0.2s;
    }
    .vap-btn-ghost:hover { border-color: rgba(253,250,247,0.5); color: var(--white); }

    /* ── STATS STRIP ── */
    .vap-stats-strip {
        background: var(--black);
        display: grid; grid-template-columns: repeat(4, 1fr);
    }
    .vap-stat-item {
        padding: 2.8rem 2rem; text-align: center;
        border-right: 1px solid rgba(255,255,255,0.06);
    }
    .vap-stat-item:last-child { border-right: none; }
    .vap-stat-value {
        font-family: 'Playfair Display', serif;
        font-size: 2.2rem; font-weight: 700; color: var(--white);
        margin-bottom: 0.4rem; display: block;
    }
    .vap-stat-label {
        font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase;
        color: rgba(255,255,255,0.3);
    }

    /* ── SECTIONS ── */
    .vap-section { padding: 6rem 5rem; }
    .vap-section-eyebrow {
        font-size: 0.65rem; letter-spacing: 0.26em; text-transform: uppercase;
        color: var(--gold); margin-bottom: 1rem; display: block;
    }
    .vap-section-title {
        font-family: 'Playfair Display', serif;
        font-size: clamp(2.2rem, 3.5vw, 3.2rem); color: var(--black); line-height: 1.12;
    }
    .vap-section-title em { font-style: italic; color: var(--earth); }
    .vap-section-title-center {
        font-family: 'Playfair Display', serif;
        font-size: clamp(2rem, 3vw, 2.8rem); color: var(--black); line-height: 1.15;
        text-align: center;
    }
    .vap-section-title-center em { font-style: italic; color: var(--earth); }
    .vap-section-header { text-align: center; margin-bottom: 3.5rem; }

    /* ── STORY ── */
    .vap-story-grid {
        display: grid; grid-template-columns: 1fr 1.6fr; gap: 5rem;
        align-items: start;
    }
    .vap-body-text {
        font-size: 0.95rem; color: var(--earth); line-height: 1.9;
        font-weight: 300; margin-bottom: 1.4rem;
    }
    .vap-body-text:last-child { margin-bottom: 0; }

    /* ── MANIFESTO ── */
    .vap-manifesto {
        background: var(--cream);
        padding: 5rem;
        border-top: 1px solid var(--sand);
        border-bottom: 1px solid var(--sand);
    }
    .vap-manifesto-inner { max-width: 780px; margin: 0 auto; text-align: center; }
    .vap-manifesto-quote {
        font-family: 'Playfair Display', serif;
        font-size: clamp(1.3rem, 2.5vw, 2rem);
        color: var(--black); line-height: 1.55;
        font-style: italic; margin-bottom: 1.5rem;
    }
    .vap-manifesto-attr {
        font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
        color: var(--bark);
    }

    /* ── VALUES ── */
    .vap-values-section { background: var(--white); }
    .vap-values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .vap-value-card {
        background: var(--cream); border: 1px solid var(--sand); border-radius: 3px;
        padding: 1.8rem 1.6rem;
        transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
    }
    .vap-value-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(42,36,32,0.08); border-color: var(--bark); }
    .vap-value-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem; }
    .vap-value-icon {
        width: 40px; height: 40px;
        background: var(--white); border: 1px solid var(--sand); border-radius: 2px;
        display: flex; align-items: center; justify-content: center; color: var(--gold);
    }
    .vap-value-num {
        font-family: 'Playfair Display', serif;
        font-size: 1.6rem; font-weight: 700; color: var(--sand); line-height: 1;
    }
    .vap-value-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.1rem; color: var(--black); margin-bottom: 0.75rem;
    }
    .vap-value-desc { font-size: 0.82rem; color: var(--earth); line-height: 1.75; font-weight: 300; }

    /* ── TEAM ── */
    .vap-team-section { background: var(--cream); }
    .vap-team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 700px; margin: 0 auto; }
    .vap-team-card {
        background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 3px;
        padding: 2rem 1.5rem; text-align: center;
        transition: transform 0.22s, box-shadow 0.22s;
    }
    .vap-team-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(42,36,32,0.08); }
    .vap-team-avatar {
        width: 64px; height: 64px; border-radius: 50%;
        border: 1.5px solid; margin: 0 auto 1.1rem;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700;
    }
    .vap-team-name {
        font-family: 'Playfair Display', serif;
        font-size: 1rem; color: var(--black); margin-bottom: 0.35rem;
    }
    .vap-team-role { font-size: 0.72rem; color: var(--bark); font-weight: 300; letter-spacing: 0.06em; line-height: 1.5; }

    /* ── CTA ── */
    .vap-cta {
        background: var(--charcoal);
        padding: 6rem 5rem;
        position: relative; overflow: hidden;
    }
    .vap-cta::before {
        content: '';
        position: absolute; top: -80px; right: -80px;
        width: 400px; height: 400px;
        border-radius: 50%; border: 1px solid rgba(201,169,110,0.1);
        pointer-events: none;
    }
    .vap-cta::after {
        content: '';
        position: absolute; bottom: -120px; right: 80px;
        width: 260px; height: 260px;
        border-radius: 50%; border: 1px solid rgba(201,169,110,0.07);
        pointer-events: none;
    }
    .vap-cta-content { position: relative; z-index: 1; max-width: 560px; }
    .vap-cta-title {
        font-family: 'Playfair Display', serif;
        font-size: clamp(2.2rem, 4vw, 3.4rem);
        color: var(--white); line-height: 1.1; margin-bottom: 1.2rem;
    }
    .vap-cta-title em { font-style: italic; color: var(--gold); }
    .vap-cta-desc {
        font-size: 0.95rem; color: rgba(253,250,247,0.45);
        line-height: 1.85; font-weight: 300; margin-bottom: 2.5rem; max-width: 420px;
    }
    .vap-cta-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .vap-btn-white {
        padding: 1rem 2.2rem; background: var(--white); color: var(--black);
        font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
        letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500;
        border: none; border-radius: 2px; cursor: pointer; text-decoration: none;
        display: inline-block; transition: opacity 0.2s;
    }
    .vap-btn-white:hover { opacity: 0.88; }
    .vap-btn-outline-white {
        padding: 1rem 2rem; background: transparent; color: rgba(253,250,247,0.6);
        font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
        letter-spacing: 0.15em; text-transform: uppercase;
        border: 1px solid rgba(253,250,247,0.18); border-radius: 2px;
        cursor: pointer; text-decoration: none; display: inline-block;
        transition: border-color 0.2s, color 0.2s;
    }
    .vap-btn-outline-white:hover { border-color: rgba(253,250,247,0.45); color: var(--white); }

    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
        .vap-hero { padding: 6rem 2.5rem 4rem; }
        .vap-section { padding: 4.5rem 2.5rem; }
        .vap-manifesto { padding: 4rem 2.5rem; }
        .vap-cta { padding: 4.5rem 2.5rem; }
        .vap-values-grid { grid-template-columns: repeat(2, 1fr); }
        .vap-stats-strip { grid-template-columns: repeat(2, 1fr); }
        .vap-stat-item:nth-child(2) { border-right: none; }
        .vap-stat-item:nth-child(3),
        .vap-stat-item:nth-child(4) { border-top: 1px solid rgba(255,255,255,0.06); }
    }
    @media (max-width: 768px) {
        .vap-hero { padding: 5rem 1.5rem 3.5rem; min-height: auto; }
        .vap-section { padding: 3.5rem 1.5rem; }
        .vap-manifesto { padding: 3rem 1.5rem; }
        .vap-cta { padding: 3.5rem 1.5rem; }
        .vap-story-grid { grid-template-columns: 1fr; gap: 2.5rem; }
        .vap-values-grid { grid-template-columns: 1fr; }
        .vap-team-grid { grid-template-columns: 1fr; max-width: 280px; }
        .vap-stats-strip { grid-template-columns: 1fr 1fr; }
        .vap-hero-decor { font-size: 10rem; }
    }
`;
