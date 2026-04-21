import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, userRole, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);

    const handleLogout = () => {
        navigate('/', { replace: true });
        setTimeout(() => logout(), 10);
    };

    const isActive = (path) => location.pathname === path;

    // Clear derived states — no ambiguity
    const isGuest       = !isAuthenticated;
    const isRegularUser = isAuthenticated && userRole !== 'ADMIN';
    const isAdmin       = isAuthenticated && userRole === 'ADMIN';

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

                :root {
                    --cream: #F5F0E8; --sand: #E8DDD0; --bark: #B8A898;
                    --earth: #6B5B4E; --charcoal: #2A2420; --black: #0F0D0C;
                    --accent: #C8472A; --gold: #C9A96E; --white: #FDFAF7;
                }

                .vn-nav {
                    position: sticky; top: 0; z-index: 100;
                    background: rgba(253,250,247,0.93);
                    backdrop-filter: blur(14px);
                    border-bottom: 1px solid rgba(184,168,152,0.28);
                    font-family: 'DM Sans', sans-serif;
                }
                .vn-inner {
                    max-width: 1280px; margin: 0 auto;
                    padding: 0 3rem; height: 68px;
                    display: flex; align-items: center; justify-content: space-between;
                }

                .vn-logo {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.55rem; letter-spacing: 0.1em;
                    color: var(--black); text-decoration: none; flex-shrink: 0;
                    transition: opacity 0.2s;
                }
                .vn-logo:hover { opacity: 0.75; }

                .vn-links {
                    display: flex; gap: 2.2rem;
                    list-style: none; margin: 0; padding: 0;
                }
                .vn-links a {
                    font-size: 0.73rem; letter-spacing: 0.14em; text-transform: uppercase;
                    color: var(--earth); text-decoration: none; transition: color 0.2s;
                    position: relative; padding-bottom: 2px;
                }
                .vn-links a:hover { color: var(--black); }
                .vn-links a.active { color: var(--black); }
                .vn-links a.active::after {
                    content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
                    height: 1px; background: var(--gold);
                }

                .vn-actions { display: flex; align-items: center; gap: 0.8rem; }

                .vn-divider {
                    width: 1px; height: 20px;
                    background: rgba(184,168,152,0.4); margin: 0 0.4rem;
                }

                .vn-link {
                    font-size: 0.73rem; letter-spacing: 0.13em; text-transform: uppercase;
                    color: var(--earth); text-decoration: none;
                    transition: color 0.2s; white-space: nowrap;
                }
                .vn-link:hover { color: var(--black); }

                .vn-btn-ghost {
                    font-size: 0.72rem; letter-spacing: 0.13em; text-transform: uppercase;
                    padding: 0.52rem 1.2rem;
                    background: transparent; color: var(--charcoal);
                    border: 1px solid var(--bark); border-radius: 2px;
                    text-decoration: none; display: inline-block; cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    transition: border-color 0.2s, color 0.2s; white-space: nowrap;
                }
                .vn-btn-ghost:hover { border-color: var(--charcoal); color: var(--black); }

                .vn-btn-solid {
                    font-size: 0.72rem; letter-spacing: 0.13em; text-transform: uppercase;
                    padding: 0.52rem 1.2rem;
                    background: var(--charcoal); color: var(--white);
                    border: 1px solid var(--charcoal); border-radius: 2px;
                    text-decoration: none; display: inline-block; cursor: pointer;
                    font-family: 'DM Sans', sans-serif; transition: background 0.2s;
                    white-space: nowrap;
                }
                .vn-btn-solid:hover { background: var(--black); border-color: var(--black); }

                .vn-btn-logout {
                    font-size: 0.72rem; letter-spacing: 0.13em; text-transform: uppercase;
                    padding: 0.52rem 1.2rem;
                    background: transparent; color: var(--accent);
                    border: 1px solid rgba(200,71,42,0.35); border-radius: 2px;
                    cursor: pointer; font-family: 'DM Sans', sans-serif;
                    transition: background 0.2s, color 0.2s, border-color 0.2s; white-space: nowrap;
                }
                .vn-btn-logout:hover { background: var(--accent); color: var(--white); border-color: var(--accent); }

                .vn-admin-badge {
                    font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase;
                    padding: 0.52rem 1.1rem;
                    background: var(--cream); color: var(--earth);
                    border: 1px solid var(--sand); border-radius: 2px;
                    text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;
                    font-family: 'DM Sans', sans-serif; font-weight: 500;
                    transition: background 0.2s, border-color 0.2s; white-space: nowrap;
                }
                .vn-admin-badge:hover { background: var(--sand); border-color: var(--bark); }
                .vn-admin-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }

                .vn-cart {
                    position: relative;
                    display: inline-flex; align-items: center; justify-content: center;
                    width: 38px; height: 38px;
                    background: var(--cream); border: 1px solid var(--sand);
                    border-radius: 2px; text-decoration: none; color: var(--charcoal);
                    transition: background 0.2s, border-color 0.2s;
                }
                .vn-cart:hover { background: var(--sand); border-color: var(--bark); }
                .vn-cart svg { width: 16px; height: 16px; stroke: var(--charcoal); fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
                .vn-cart-badge {
                    position: absolute; top: -7px; right: -7px;
                    min-width: 18px; height: 18px; padding: 0 4px;
                    background: var(--accent); color: white;
                    font-size: 0.6rem; font-weight: 500; letter-spacing: 0; border-radius: 9px;
                    display: flex; align-items: center; justify-content: center;
                    border: 2px solid var(--white); font-family: 'DM Sans', sans-serif;
                }

                @media (max-width: 768px) {
                    .vn-inner { padding: 0 1.2rem; }
                    .vn-links { display: none; }
                }
            `}</style>

            <nav className="vn-nav">
                <div className="vn-inner">

                    {/* LOGO — always */}
                    <Link to="/" className="vn-logo">VAUX</Link>

                    {/* CENTER LINKS — regular users only */}
                    {isRegularUser && (
                        <ul className="vn-links">
                            <li><Link to="/" className={isActive('/') ? 'active' : ''}>Accueil</Link></li>
                            <li><Link to="/produits" className={isActive('/produits') ? 'active' : ''}>Catalogue</Link></li>
                            <li><Link to="/mes-commandes" className={isActive('/mes-commandes') ? 'active' : ''}>Mes Commandes</Link></li>
                            <li><Link to="/profil" className={isActive('/profil') ? 'active' : ''}>Profil</Link></li>
                            <li><Link to="/apropos" className={isActive('/apropos') ? 'active' : ''}>À Propos</Link></li>
                        </ul>
                    )}

                    {/* RIGHT ACTIONS */}
                    <div className="vn-actions">

                    {/* ── GUEST ── login + register only */}
                    {isGuest && (
                        <>
                            <Link to="/login" className="vn-link">Connexion</Link>
                            <Link to="/register" className="vn-btn-solid">Créer un compte</Link>
                        </>
                    )}

                    {/* ── APROPOS ── visible to all users for easy access (moved into center links above) */}

                        {/* ── ADMIN ── admin panel + logout only */}
                        {isAdmin && (
                            <>
                                <Link to="/admin/dashboard" className="vn-admin-badge">
                                    <span className="vn-admin-dot" />
                                    Espace Admin
                                </Link>
                                <div className="vn-divider" />
                                <button onClick={handleLogout} className="vn-btn-logout">
                                    Déconnexion
                                </button>
                            </>
                        )}

                        {/* ── REGULAR USER ── cart + logout only */}
                        {isRegularUser && (
                            <>
                                <Link to="/cart" className="vn-cart" title="Mon panier">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                        <line x1="3" y1="6" x2="21" y2="6"/>
                                        <path d="M16 10a4 4 0 0 1-8 0"/>
                                    </svg>
                                    {cartCount > 0 && (
                                        <span className="vn-cart-badge">{cartCount}</span>
                                    )}
                                </Link>
                                <div className="vn-divider" />
                                <button onClick={handleLogout} className="vn-btn-logout">
                                    Déconnexion
                                </button>
                            </>
                        )}

                    </div>
                </div>
            </nav>
        </>
    );
}
