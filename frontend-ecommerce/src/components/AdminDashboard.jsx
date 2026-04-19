import { Link } from 'react-router-dom';

const KPI_CARDS = [
    {
        label: 'Produits Actifs',
        value: '120',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
        ),
        trend: '+8% ce mois',
        trendUp: true,
        to: '/admin/products',
    },
    {
        label: 'Commandes',
        value: '45',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
        ),
        trend: '+12% ce mois',
        trendUp: true,
        to: '/admin/orders',
    },
    {
        label: 'Clients',
        value: '300',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        trend: '+5% ce mois',
        trendUp: true,
        to: '/admin/users',
    },
    {
        label: "Chiffre d'affaires",
        value: '15 200 €',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
        ),
        trend: '+18% ce mois',
        trendUp: true,
        to: '/admin/orders',
    },
];

const QUICK_ACTIONS = [
    {
        to: '/admin/products',
        label: 'Ajouter un produit',
        desc: 'Créer une nouvelle fiche produit',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
        ),
        primary: true,
    },
    {
        to: '/admin/users',
        label: 'Gérer les utilisateurs',
        desc: 'Voir et modifier les comptes',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        primary: false,
    },
    {
        to: '/admin/categories',
        label: 'Gérer les catégories',
        desc: 'Organiser votre catalogue',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
        ),
        primary: false,
    },
    {
        to: '/admin/orders',
        label: 'Voir les commandes',
        desc: 'Suivre et traiter les commandes',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
        ),
        primary: false,
    },
];

export default function AdminDashboard() {
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

                .vad-root {
                    max-width: 1100px;
                    font-family: 'DM Sans', sans-serif;
                }

                /* HEADER */
                .vad-header { margin-bottom: 2.5rem; }
                .vad-eyebrow {
                    font-size: 0.65rem; letter-spacing: 0.24em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 0.6rem;
                }
                .vad-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.2rem; color: var(--black); line-height: 1.15;
                    margin-bottom: 0.4rem;
                }
                .vad-title em { font-style: italic; color: var(--earth); }
                .vad-sub {
                    font-size: 0.88rem; color: var(--earth); font-weight: 300;
                }

                .vad-divider { height: 1px; background: var(--sand); margin-bottom: 2.5rem; }

                /* KPI GRID */
                .vad-kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 14px;
                    margin-bottom: 2rem;
                }
                .vad-kpi-card {
                    background: var(--white);
                    border: 1px solid rgba(184,168,152,0.28);
                    border-radius: 3px;
                    padding: 1.5rem 1.4rem;
                    text-decoration: none;
                    display: block;
                    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }
                .vad-kpi-card::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0;
                    height: 2px; background: var(--gold);
                    transform: scaleX(0); transform-origin: left;
                    transition: transform 0.25s ease;
                }
                .vad-kpi-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(42,36,32,0.08);
                    border-color: var(--bark);
                }
                .vad-kpi-card:hover::before { transform: scaleX(1); }

                .vad-kpi-top {
                    display: flex; justify-content: space-between; align-items: flex-start;
                    margin-bottom: 1rem;
                }
                .vad-kpi-icon {
                    width: 38px; height: 38px;
                    background: var(--cream); border: 1px solid var(--sand);
                    border-radius: 2px;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--earth);
                }
                .vad-kpi-trend {
                    font-size: 0.65rem; letter-spacing: 0.06em;
                    color: #3B6D11; background: #EAF3DE;
                    padding: 0.25rem 0.55rem; border-radius: 2px;
                    font-weight: 500;
                }
                .vad-kpi-value {
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem; font-weight: 700;
                    color: var(--black); line-height: 1;
                    margin-bottom: 0.35rem;
                }
                .vad-kpi-label {
                    font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
                    color: var(--bark);
                }

                /* SECTION LABEL */
                .vad-section-label {
                    font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--bark); margin-bottom: 1rem;
                }

                /* QUICK ACTIONS */
                .vad-actions-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 12px;
                    margin-bottom: 2.5rem;
                }
                .vad-action-card {
                    background: var(--white);
                    border: 1px solid rgba(184,168,152,0.28);
                    border-radius: 3px;
                    padding: 1.3rem 1.2rem;
                    text-decoration: none;
                    display: flex; flex-direction: column; gap: 0.75rem;
                    transition: background 0.18s, border-color 0.18s, transform 0.18s;
                }
                .vad-action-card:hover {
                    background: var(--cream);
                    border-color: var(--bark);
                    transform: translateY(-1px);
                }
                .vad-action-card.primary {
                    background: var(--charcoal);
                    border-color: var(--charcoal);
                }
                .vad-action-card.primary:hover {
                    background: var(--black);
                    border-color: var(--black);
                }
                .vad-action-icon {
                    width: 34px; height: 34px;
                    background: var(--cream);
                    border: 1px solid var(--sand);
                    border-radius: 2px;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--earth);
                }
                .vad-action-card.primary .vad-action-icon {
                    background: rgba(253,250,247,0.1);
                    border-color: rgba(253,250,247,0.15);
                    color: var(--gold);
                }
                .vad-action-label {
                    font-size: 0.8rem; font-weight: 500;
                    color: var(--black); letter-spacing: 0.02em;
                }
                .vad-action-card.primary .vad-action-label { color: var(--white); }
                .vad-action-desc {
                    font-size: 0.73rem; color: var(--earth); font-weight: 300;
                    line-height: 1.4;
                }
                .vad-action-card.primary .vad-action-desc { color: rgba(253,250,247,0.45); }

                /* BOTTOM ROW */
                .vad-bottom {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 14px;
                }
                .vad-panel {
                    background: var(--white);
                    border: 1px solid rgba(184,168,152,0.28);
                    border-radius: 3px;
                    padding: 1.6rem 1.5rem;
                }
                .vad-panel-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.05rem; color: var(--black);
                    margin-bottom: 1.2rem;
                }
                .vad-activity-list { display: flex; flex-direction: column; gap: 0.85rem; }
                .vad-activity-item {
                    display: flex; align-items: center; gap: 0.9rem;
                    padding-bottom: 0.85rem;
                    border-bottom: 1px solid rgba(184,168,152,0.15);
                }
                .vad-activity-item:last-child { border-bottom: none; padding-bottom: 0; }
                .vad-activity-dot {
                    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
                }
                .vad-activity-text { font-size: 0.8rem; color: var(--charcoal); flex: 1; line-height: 1.4; }
                .vad-activity-time { font-size: 0.7rem; color: var(--bark); white-space: nowrap; }

                .vad-status-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .vad-status-row {
                    display: flex; align-items: center; justify-content: space-between;
                }
                .vad-status-name { font-size: 0.8rem; color: var(--charcoal); }
                .vad-status-bar-wrap {
                    flex: 1; height: 4px; background: var(--sand);
                    border-radius: 2px; margin: 0 1rem;
                }
                .vad-status-bar { height: 100%; border-radius: 2px; background: var(--gold); }
                .vad-status-val { font-size: 0.75rem; color: var(--earth); font-weight: 500; min-width: 28px; text-align: right; }

                @media (max-width: 1024px) {
                    .vad-kpi-grid { grid-template-columns: repeat(2, 1fr); }
                    .vad-actions-grid { grid-template-columns: repeat(2, 1fr); }
                    .vad-bottom { grid-template-columns: 1fr; }
                }
                @media (max-width: 640px) {
                    .vad-kpi-grid { grid-template-columns: 1fr; }
                    .vad-actions-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="vad-root">

                {/* HEADER */}
                <header className="vad-header">
                    <div className="vad-eyebrow">Espace Administration</div>
                    <h1 className="vad-title">Tableau de <em>bord</em></h1>
                    <p className="vad-sub">Bienvenue dans votre espace d'administration VAUX.</p>
                </header>

                <div className="vad-divider" />

                {/* KPI CARDS */}
                <div className="vad-section-label">Vue d'ensemble</div>
                <div className="vad-kpi-grid">
                    {KPI_CARDS.map((kpi, i) => (
                        <Link to={kpi.to} key={i} className="vad-kpi-card">
                            <div className="vad-kpi-top">
                                <div className="vad-kpi-icon">{kpi.icon}</div>
                                <span className="vad-kpi-trend">{kpi.trend}</span>
                            </div>
                            <div className="vad-kpi-value">{kpi.value}</div>
                            <div className="vad-kpi-label">{kpi.label}</div>
                        </Link>
                    ))}
                </div>

                {/* QUICK ACTIONS */}
                <div className="vad-section-label" style={{ marginTop: '2rem' }}>Actions rapides</div>
                <div className="vad-actions-grid">
                    {QUICK_ACTIONS.map((action, i) => (
                        <Link to={action.to} key={i} className={`vad-action-card${action.primary ? ' primary' : ''}`}>
                            <div className="vad-action-icon">{action.icon}</div>
                            <div>
                                <div className="vad-action-label">{action.label}</div>
                                <div className="vad-action-desc">{action.desc}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* BOTTOM PANELS */}
                <div className="vad-bottom">
                    {/* Activity feed */}
                    <div className="vad-panel">
                        <div className="vad-panel-title">Activité récente</div>
                        <div className="vad-activity-list">
                            {[
                                { color: '#639922', text: 'Nouvelle commande #1042 — 89,00 €', time: 'il y a 5 min' },
                                { color: '#C9A96E', text: 'Produit "Tote cuir" mis à jour', time: 'il y a 22 min' },
                                { color: '#6B5B4E', text: 'Nouvel utilisateur inscrit', time: 'il y a 1h' },
                                { color: '#C8472A', text: 'Stock faible — Sneakers suède (3 restants)', time: 'il y a 2h' },
                                { color: '#639922', text: 'Commande #1041 expédiée', time: 'il y a 3h' },
                            ].map((item, i) => (
                                <div className="vad-activity-item" key={i}>
                                    <div className="vad-activity-dot" style={{ background: item.color }} />
                                    <div className="vad-activity-text">{item.text}</div>
                                    <div className="vad-activity-time">{item.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category breakdown */}
                    <div className="vad-panel">
                        <div className="vad-panel-title">Ventes par catégorie</div>
                        <div className="vad-status-list">
                            {[
                                { name: 'Maroquinerie', pct: 82 },
                                { name: 'Vêtements', pct: 65 },
                                { name: 'Chaussures', pct: 48 },
                                { name: 'Accessoires', pct: 34 },
                                { name: 'Maison', pct: 21 },
                            ].map((cat, i) => (
                                <div className="vad-status-row" key={i}>
                                    <span className="vad-status-name">{cat.name}</span>
                                    <div className="vad-status-bar-wrap">
                                        <div className="vad-status-bar" style={{ width: `${cat.pct}%` }} />
                                    </div>
                                    <span className="vad-status-val">{cat.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}