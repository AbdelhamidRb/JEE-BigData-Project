import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
    {
        path: 'dashboard',
        label: 'Synthèse',
        to: '/admin/dashboard',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
        ),
    },
    {
        path: 'products',
        label: 'Produits',
        to: '/admin/products',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
        ),
    },
    {
        path: 'users',
        label: 'Utilisateurs',
        to: '/admin/users',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
    },
    {
        path: 'categories',
        label: 'Catégories',
        to: '/admin/categories',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
        ),
    },
    {
        path: 'orders',
        label: 'Commandes',
        to: '/admin/orders',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
        ),
    },
];

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        navigate('/', { replace: true });
        setTimeout(() => {
            logout();
            toast.success('Déconnexion réussie');
        }, 10);
    };

    const isActive = (path) => location.pathname.includes(path);

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

                .va-layout {
                    display: flex;
                    min-height: 100vh;
                    background: var(--cream);
                    font-family: 'DM Sans', sans-serif;
                }

                /* SIDEBAR */
                .va-sidebar {
                    width: 240px;
                    flex-shrink: 0;
                    background: var(--white);
                    border-right: 1px solid rgba(184,168,152,0.28);
                    display: flex;
                    flex-direction: column;
                    position: sticky;
                    top: 0;
                    height: 100vh;
                    overflow-y: auto;
                }

                .va-sidebar-top {
                    padding: 2rem 1.5rem 1rem;
                    border-bottom: 1px solid rgba(184,168,152,0.2);
                }
                .va-sidebar-logo {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.35rem;
                    letter-spacing: 0.1em;
                    color: var(--black);
                    display: block;
                    text-decoration: none;
                    margin-bottom: 0.3rem;
                }
                .va-sidebar-role {
                    font-size: 0.62rem;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: var(--gold);
                }

                .va-sidebar-nav {
                    flex: 1;
                    padding: 1.4rem 1rem;
                }
                .va-nav-label {
                    font-size: 0.6rem;
                    letter-spacing: 0.24em;
                    text-transform: uppercase;
                    color: var(--bark);
                    padding: 0 0.75rem;
                    margin-bottom: 0.75rem;
                }

                .va-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.7rem 0.85rem;
                    border-radius: 2px;
                    text-decoration: none;
                    font-size: 0.8rem;
                    letter-spacing: 0.06em;
                    margin-bottom: 2px;
                    transition: background 0.18s, color 0.18s;
                    color: var(--earth);
                    position: relative;
                }
                .va-nav-item:hover {
                    background: var(--cream);
                    color: var(--charcoal);
                }
                .va-nav-item.active {
                    background: var(--cream);
                    color: var(--black);
                    font-weight: 500;
                }
                .va-nav-item.active::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 20%; bottom: 20%;
                    width: 2px;
                    background: var(--gold);
                    border-radius: 0 1px 1px 0;
                }
                .va-nav-item svg { flex-shrink: 0; opacity: 0.7; }
                .va-nav-item.active svg { opacity: 1; }

                /* SIDEBAR FOOTER */
                .va-sidebar-footer {
                    padding: 1rem;
                    border-top: 1px solid rgba(184,168,152,0.2);
                }
                .va-logout-btn {
                    width: 100%;
                    display: flex; align-items: center; gap: 0.75rem;
                    padding: 0.7rem 0.85rem;
                    background: transparent;
                    border: none; border-radius: 2px; cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem; letter-spacing: 0.08em;
                    color: var(--accent);
                    transition: background 0.18s, color 0.18s;
                    text-align: left;
                }
                .va-logout-btn:hover {
                    background: rgba(200,71,42,0.07);
                }
                .va-logout-btn svg { flex-shrink: 0; }

                /* MAIN */
                .va-main {
                    flex: 1;
                    padding: 2.5rem 3rem;
                    overflow-x: hidden;
                    min-width: 0;
                }

                @media (max-width: 768px) {
                    .va-sidebar { display: none; }
                    .va-main { padding: 1.5rem 1rem; }
                }
            `}</style>

            <div className="va-layout">

                {/* SIDEBAR */}
                <aside className="va-sidebar">
                    <div className="va-sidebar-top">
                        <Link to="/" className="va-sidebar-logo">InsightCart</Link>
                        <div className="va-sidebar-role">Panneau Admin</div>
                    </div>

                    <nav className="va-sidebar-nav">
                        <div className="va-nav-label">Navigation</div>
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.path}
                                to={item.to}
                                className={`va-nav-item${isActive(item.path) ? ' active' : ''}`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="va-sidebar-footer">
                        <button onClick={handleLogout} className="va-logout-btn">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            Quitter l'admin
                        </button>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="va-main">
                    <Outlet />
                </main>

            </div>
        </>
    );
}