import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const VALUES = [
    { num: '01', title: 'Artisanat', desc: 'Chaque produit est sélectionné selon des critères stricts de fabrication. Nous privilégions les ateliers qui travaillent à la main, avec des matériaux nobles et durables.' },
    { num: '02', title: 'Durabilité', desc: "Nous travaillons exclusivement avec des fournisseurs engagés dans des pratiques responsables. Moins mais mieux — c'est notre philosophie d'approvisionnement." },
    { num: '03', title: 'Transparence', desc: 'Nos prix reflètent le coût réel de la qualité. Pas de marges cachées, pas de compromis sur les matières. Vous savez exactement ce pour quoi vous payez.' },
    { num: '04', title: 'Service', desc: "Notre équipe est disponible avant, pendant et après votre achat. Nous croyons qu'un excellent service est aussi important que le produit lui-même." },
];

const STATS = [
    { value: '2019', label: 'Année de création' },
    { value: '14k+', label: 'Produits référencés' },
    { value: '60+', label: 'Pays livrés' },
    { value: '98%', label: 'Clients satisfaits' },
];

const TEAM = [
    { initials: 'SA', name: 'Sophie Arnaud', role: 'Fondatrice & Directrice' },
    { initials: 'MR', name: 'Marc Renaud', role: 'Directeur des Achats' },
    { initials: 'LC', name: 'Léa Chevalier', role: 'Responsable Client' },
];

export default function APropos() {
    const [visible, setVisible] = useState(false);
    const heroRef = useRef(null);

    useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') { document.querySelectorAll('.fa-reveal').forEach(el => el.classList.add('fa-revealed')); return; }
        const observer = new IntersectionObserver((entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('fa-revealed'); }), { threshold: 0.12 });
        document.querySelectorAll('.fa-reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const fade = (delay) => ({ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` });

    return (
        <>
            <style>{styles}</style>
            <div className="fa-page">
                <section className="fa-hero" ref={heroRef}>
                    <div className="fa-hero-bg"><div className="fa-hero-circle c1" /><div className="fa-hero-circle c2" /><div className="fa-hero-circle c3" /><div className="fa-hero-decor">InsightCart</div></div>
                    <div className="fa-hero-content">
                        <span className="fa-accent-line" style={fade(80)} />
                        <p className="fa-eyebrow" style={fade(100)}>À Propos de InsightCart</p>
                        <h1 className="fa-hero-title" style={fade(260)}>L'excellence<br /><span className="hl">au quotidien.</span></h1>
                        <p className="fa-hero-desc" style={fade(420)}>InsightCart est né d'une conviction simple : les objets du quotidien méritent d'être beaux, durables et pensés avec soin.</p>
                        <div style={fade(560)} className="fa-hero-actions">
                            <Link to="/dashboard" className="fa-btn-primary">Découvrir la boutique</Link>
                            <Link to="/register" className="fa-btn-ghost">Rejoindre InsightCart</Link>
                        </div>
                    </div>
                </section>

                <section className="fa-stats-strip">
                    {STATS.map((s, i) => (<div key={i} className="fa-stat-item fa-reveal"><div className="fa-stat-value">{s.value}</div><div className="fa-stat-label">{s.label}</div></div>))}
                </section>

                <section className="fa-section">
                    <div className="fa-story-grid">
                        <div className="fa-story-left fa-reveal">
                            <div className="fa-section-eyebrow">Notre Histoire</div>
                            <h2 className="fa-section-title">Née d'une<br /><span className="hl">passion</span><br />pour le détail.</h2>
                        </div>
                        <div className="fa-story-right fa-reveal">
                            <p className="fa-body-text">Tout a commencé dans un appartement parisien, autour d'une frustration partagée : impossible de trouver des produits à la fois bien faits, esthétiques et accessibles.</p>
                            <p className="fa-body-text">Sophie Arnaud, ancienne directrice artistique, et Marc Renaud, expert en sourcing international, ont décidé de combler ce vide.</p>
                            <p className="fa-body-text">Aujourd'hui, chaque produit que vous trouvez sur InsightCart a été tenu en main, testé, questionné. Rien n'entre dans notre catalogue par hasard.</p>
                        </div>
                    </div>
                </section>

                <section className="fa-manifesto fa-reveal">
                    <div className="fa-manifesto-inner">
                        <div className="fa-manifesto-quote">"Nous ne vendons pas des produits. Nous défendons une façon de consommer — consciente, durable, et sans compromis sur la beauté."</div>
                        <div className="fa-manifesto-attr">— Sophie Arnaud, Fondatrice</div>
                    </div>
                </section>

                <section className="fa-section fa-values-section">
                    <div className="fa-section-header fa-reveal"><div className="fa-section-eyebrow">Nos Engagements</div><h2 className="fa-section-title-center">Ce qui nous <span className="hl">définit</span></h2></div>
                    <div className="fa-values-grid">
                        {VALUES.map((v, i) => (
                            <div key={i} className="fa-value-card fa-reveal">
                                <div className="fa-value-top"><div className="fa-value-num">{v.num}</div></div>
                                <div className="fa-value-title">{v.title}</div>
                                <p className="fa-value-desc">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="fa-section fa-team-section">
                    <div className="fa-section-header fa-reveal"><div className="fa-section-eyebrow">L'Équipe</div><h2 className="fa-section-title-center">Les visages<br /><span className="hl">derrière InsightCart</span></h2></div>
                    <div className="fa-team-grid">
                        {TEAM.map((m, i) => (
                            <div key={i} className="fa-team-card fa-reveal">
                                <div className="fa-team-avatar"><span>{m.initials}</span></div>
                                <div className="fa-team-name">{m.name}</div>
                                <div className="fa-team-role">{m.role}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="fa-cta fa-reveal">
                    <div className="fa-cta-content">
                        <div className="fa-section-eyebrow" style={{ color: '#FF5E00' }}>Rejoignez-nous</div>
                        <h2 className="fa-cta-title">Prêt à découvrir<br /><span className="hl">l'expérience InsightCart ?</span></h2>
                        <p className="fa-cta-desc">Des milliers de clients nous font confiance. Rejoignez la communauté et accédez à une sélection de produits premium livrés chez vous.</p>
                        <div className="fa-cta-actions">
                            <Link to="/register" className="fa-btn-white">Créer un compte</Link>
                            <Link to="/dashboard" className="fa-btn-outline-white">Voir la boutique</Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Oswald:wght@400;500;600;700&display=swap');
    .fa-page { font-family: 'Inter', sans-serif; background: #0A0A0A; overflow-x: hidden; }
    .fa-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .fa-revealed { opacity: 1; transform: translateY(0); }
    .fa-accent-line { width: 50px; height: 3px; background: #FF5E00; display: inline-block; margin-bottom: 1rem; }
    .fa-eyebrow { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: #FF5E00; margin-bottom: 1.3rem; font-weight: 600; }

    .fa-hero { min-height: 88vh; background: #111111; position: relative; overflow: hidden; display: flex; align-items: center; padding: 7rem 5rem 5rem; }
    .fa-hero-bg { position: absolute; inset: 0; pointer-events: none; }
    .fa-hero-circle { position: absolute; border-radius: 50%; border: 1px solid rgba(255,94,0,0.06); }
    .fa-hero-circle.c1 { width: 600px; height: 600px; top: -150px; right: -150px; }
    .fa-hero-circle.c2 { width: 380px; height: 380px; top: -50px; right: 50px; }
    .fa-hero-circle.c3 { width: 200px; height: 200px; bottom: 80px; left: -60px; opacity: 0.5; }
    .fa-hero-decor { position: absolute; font-family: 'Oswald', sans-serif; font-size: 18rem; font-weight: 700; color: #fff; opacity: 0.02; right: -2rem; bottom: -3rem; line-height: 1; letter-spacing: 0.05em; pointer-events: none; }
    .fa-hero-content { position: relative; z-index: 2; max-width: 620px; }
    .fa-hero-title { font-family: 'Oswald', sans-serif; font-size: clamp(3rem, 5.5vw, 5rem); color: #fff; line-height: 0.95; margin-bottom: 1.8rem; text-transform: uppercase; }
    .fa-hero-title .hl { color: #FF5E00; }
    .fa-hero-desc { font-size: 0.95rem; color: #6B6B6B; line-height: 1.85; font-weight: 300; max-width: 480px; margin-bottom: 2.8rem; }
    .fa-hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

    .fa-btn-primary { padding: 0.9rem 2rem; background: #FF5E00; color: #0A0A0A; font-family: 'Oswald', sans-serif; font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; border: none; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; }
    .fa-btn-primary:hover { background: #FF7A2E; }
    .fa-btn-ghost { padding: 0.9rem 2rem; background: transparent; color: #B8B8B8; font-family: 'Oswald', sans-serif; font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; }
    .fa-btn-ghost:hover { border-color: #FF5E00; color: #FF5E00; }

    .fa-stats-strip { background: #0A0A0A; display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.03); }
    .fa-stat-item { padding: 2.5rem 2rem; text-align: center; border-right: 1px solid rgba(255,255,255,0.03); }
    .fa-stat-item:last-child { border-right: none; }
    .fa-stat-value { font-family: 'Oswald', sans-serif; font-size: 2.2rem; font-weight: 700; color: #FF5E00; margin-bottom: 0.4rem; display: block; }
    .fa-stat-label { font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: #6B6B6B; }

    .fa-section { padding: 5rem 5rem; }
    .fa-section-eyebrow { font-size: 0.62rem; letter-spacing: 0.28em; text-transform: uppercase; color: #FF5E00; margin-bottom: 1rem; display: block; font-weight: 600; }
    .fa-section-title { font-family: 'Oswald', sans-serif; font-size: clamp(2.2rem, 3.5vw, 3.2rem); color: #fff; line-height: 1; text-transform: uppercase; }
    .fa-section-title .hl { color: #FF5E00; }
    .fa-section-title-center { font-family: 'Oswald', sans-serif; font-size: clamp(2rem, 3vw, 2.8rem); color: #fff; line-height: 1.05; text-align: center; text-transform: uppercase; }
    .fa-section-title-center .hl { color: #FF5E00; }
    .fa-section-header { text-align: center; margin-bottom: 3.5rem; }

    .fa-story-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 5rem; align-items: start; }
    .fa-body-text { font-size: 0.9rem; color: #B8B8B8; line-height: 1.9; font-weight: 300; margin-bottom: 1.4rem; }

    .fa-manifesto { background: #1A1A1A; padding: 4rem 5rem; border-top: 1px solid rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.04); }
    .fa-manifesto-inner { max-width: 780px; margin: 0 auto; text-align: center; }
    .fa-manifesto-quote { font-family: 'Oswald', sans-serif; font-size: clamp(1.3rem, 2.5vw, 2rem); color: #fff; line-height: 1.55; text-transform: uppercase; margin-bottom: 1.5rem; }
    .fa-manifesto-attr { font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase; color: #6B6B6B; }

    .fa-values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .fa-value-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); padding: 1.5rem; transition: all 0.25s; }
    .fa-value-card:hover { transform: translateY(-3px); border-color: rgba(255,94,0,0.2); }
    .fa-value-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .fa-value-num { font-family: 'Oswald', sans-serif; font-size: 1.5rem; font-weight: 700; color: rgba(255,255,255,0.06); line-height: 1; }
    .fa-value-title { font-family: 'Oswald', sans-serif; font-size: 1rem; color: #fff; margin-bottom: 0.75rem; text-transform: uppercase; }
    .fa-value-desc { font-size: 0.78rem; color: #6B6B6B; line-height: 1.75; font-weight: 300; }

    .fa-team-section { background: #111111; }
    .fa-team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; max-width: 600px; margin: 0 auto; }
    .fa-team-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); padding: 2rem 1.5rem; text-align: center; transition: all 0.25s; }
    .fa-team-card:hover { transform: translateY(-2px); border-color: rgba(255,94,0,0.2); }
    .fa-team-avatar { width: 60px; height: 60px; border-radius: 50%; background: rgba(255,94,0,0.1); border: 1.5px solid rgba(255,94,0,0.2); margin: 0 auto 1.1rem; display: flex; align-items: center; justify-content: center; font-family: 'Oswald', sans-serif; font-size: 1.1rem; font-weight: 700; color: #FF5E00; }
    .fa-team-name { font-family: 'Oswald', sans-serif; font-size: 0.95rem; color: #fff; margin-bottom: 0.35rem; text-transform: uppercase; }
    .fa-team-role { font-size: 0.7rem; color: #6B6B6B; font-weight: 300; letter-spacing: 0.06em; }

    .fa-cta { background: #111111; padding: 5rem 5rem; position: relative; overflow: hidden; }
    .fa-cta-content { position: relative; z-index: 1; max-width: 560px; }
    .fa-cta-title { font-family: 'Oswald', sans-serif; font-size: clamp(2.2rem, 4vw, 3.4rem); color: #fff; line-height: 1; text-transform: uppercase; margin-bottom: 1.2rem; }
    .fa-cta-title .hl { color: #FF5E00; }
    .fa-cta-desc { font-size: 0.9rem; color: #6B6B6B; line-height: 1.85; font-weight: 300; margin-bottom: 2.5rem; max-width: 420px; }
    .fa-cta-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .fa-btn-white { padding: 0.9rem 2rem; background: #FF5E00; color: #0A0A0A; font-family: 'Oswald', sans-serif; font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; border: none; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; }
    .fa-btn-white:hover { background: #FF7A2E; }
    .fa-btn-outline-white { padding: 0.9rem 2rem; background: transparent; color: #B8B8B8; font-family: 'Oswald', sans-serif; font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; }
    .fa-btn-outline-white:hover { border-color: #FF5E00; color: #FF5E00; }

    @media (max-width: 1024px) {
        .fa-hero { padding: 6rem 2.5rem 4rem; }
        .fa-section { padding: 4rem 2.5rem; }
        .fa-cta { padding: 4rem 2.5rem; }
        .fa-values-grid { grid-template-columns: repeat(2, 1fr); }
        .fa-stats-strip { grid-template-columns: repeat(2, 1fr); }
        .fa-manifesto { padding: 3rem 2rem; }
    }
    @media (max-width: 768px) {
        .fa-hero { padding: 5rem 1.5rem 3.5rem; min-height: auto; }
        .fa-section { padding: 3rem 1.5rem; }
        .fa-cta { padding: 3rem 1.5rem; }
        .fa-story-grid { grid-template-columns: 1fr; gap: 2.5rem; }
        .fa-values-grid { grid-template-columns: 1fr; }
        .fa-team-grid { grid-template-columns: 1fr; max-width: 280px; }
        .fa-stats-strip { grid-template-columns: 1fr 1fr; }
        .fa-hero-decor { font-size: 10rem; }
    }
`;
