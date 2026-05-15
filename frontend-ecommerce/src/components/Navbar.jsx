import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, userRole, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const { wishlistCount } = useContext(WishlistContext);

    const handleLogout = () => {
        navigate('/', { replace: true });
        setTimeout(() => logout(), 10);
    };

    const isActive = (path) => location.pathname === path;
    const isGuest = !isAuthenticated;
    const isRegularUser = isAuthenticated && userRole !== 'ADMIN';
    const isAdmin = isAuthenticated && userRole === 'ADMIN';

    return (
        <>
            <style>{`
                .fn-nav {
                    position: sticky; top: 0; z-index: 100;
                    background: rgba(10,10,10,0.92);
                    backdrop-filter: blur(14px);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    font-family: 'Inter', sans-serif;
                }
                .fn-inner {
                    max-width: 1280px; margin: 0 auto;
                    padding: 0 3rem; height: 64px;
                    display: flex; align-items: center; justify-content: space-between;
                }
                .fn-logo {
                    font-family: 'Oswald', sans-serif;
                    font-size: 1.4rem; letter-spacing: 0.08em;
                    color: #fff; text-decoration: none; flex-shrink: 0;
                    display: flex; align-items: center; gap: 8px;
                }
                .fn-logo-mark {
                    width: 28px; height: 28px;
                    background: #FF5E00;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 700; font-size: 0.9rem; color: #0A0A0A; line-height: 1;
                }
                .fn-links {
                    display: flex; gap: 2rem;
                    list-style: none; margin: 0; padding: 0;
                }
                .fn-links a {
                    font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase;
                    color: #B8B8B8; text-decoration: none; transition: color 0.2s;
                    position: relative; padding-bottom: 2px;
                }
                .fn-links a:hover { color: #fff; }
                .fn-links a::after {
                    content: ''; position: absolute; bottom: -2px; left: 0;
                    width: 0; height: 2px; background: #FF5E00;
                    transition: width 0.3s ease;
                }
                .fn-links a:hover::after { width: 100%; }
                .fn-actions { display: flex; align-items: center; gap: 0.6rem; }
                .fn-divider { width: 1px; height: 18px; background: rgba(255,255,255,0.1); margin: 0 0.3rem; }
                .fn-link {
                    font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
                    color: #B8B8B8; text-decoration: none;
                    transition: color 0.2s; white-space: nowrap;
                }
                .fn-link:hover { color: #fff; }
                .fn-btn-ghost {
                    font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase;
                    padding: 0.45rem 1.1rem;
                    background: transparent; color: #D4D4D4;
                    border: 1px solid rgba(255,255,255,0.15);
                    text-decoration: none; display: inline-block; cursor: pointer;
                    font-family: 'Inter', sans-serif; transition: all 0.2s; white-space: nowrap;
                }
                .fn-btn-ghost:hover { border-color: #FF5E00; color: #FF5E00; }
                .fn-btn-solid {
                    font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase;
                    padding: 0.45rem 1.1rem;
                    background: #FF5E00; color: #0A0A0A;
                    border: 1px solid #FF5E00;
                    text-decoration: none; display: inline-block; cursor: pointer;
                    font-family: 'Inter', sans-serif; transition: all 0.2s; white-space: nowrap;
                    font-weight: 600;
                }
                .fn-btn-solid:hover { background: #FF7A2E; border-color: #FF7A2E; }
                .fn-btn-logout {
                    font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase;
                    padding: 0.45rem 1.1rem;
                    background: transparent; color: rgba(255,255,255,0.4);
                    border: 1px solid rgba(255,255,255,0.1);
                    cursor: pointer; font-family: 'Inter', sans-serif;
                    transition: all 0.2s; white-space: nowrap;
                }
                .fn-btn-logout:hover { border-color: rgba(255,94,0,0.4); color: #FF5E00; }
                .fn-admin-badge {
                    font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase;
                    padding: 0.45rem 1rem;
                    background: rgba(255,94,0,0.1); color: #FF5E00;
                    border: 1px solid rgba(255,94,0,0.2);
                    text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;
                    font-family: 'Inter', sans-serif; font-weight: 500;
                    transition: all 0.2s; white-space: nowrap;
                }
                .fn-admin-badge:hover { background: rgba(255,94,0,0.15); border-color: rgba(255,94,0,0.3); }
                .fn-admin-dot { width: 6px; height: 6px; border-radius: 50%; background: #FF5E00; flex-shrink: 0; }
                .fn-cart {
                    position: relative;
                    display: inline-flex; align-items: center; justify-content: center;
                    width: 36px; height: 36px;
                    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                    text-decoration: none; color: #D4D4D4;
                    transition: all 0.2s;
                }
                .fn-cart:hover { background: rgba(255,94,0,0.1); border-color: rgba(255,94,0,0.3); color: #FF5E00; }
                .fn-cart svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
                .fn-cart-badge {
                    position: absolute; top: -6px; right: -6px;
                    min-width: 16px; height: 16px; padding: 0 4px;
                    background: #FF5E00; color: #0A0A0A;
                    font-size: 0.55rem; font-weight: 700; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Inter', sans-serif;
                }
                .fn-wishlist {
                    position: relative;
                    display: inline-flex; align-items: center; justify-content: center;
                    width: 36px; height: 36px;
                    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                    text-decoration: none; color: #D4D4D4;
                    transition: all 0.2s;
                }
                .fn-wishlist:hover { background: rgba(255,94,0,0.1); border-color: rgba(255,94,0,0.3); color: #FF5E00; }
                .fn-wishlist svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
                @media (max-width: 768px) {
                    .fn-inner { padding: 0 1.2rem; }
                    .fn-links { display: none; }
                }
            `}</style>

            <nav className="fn-nav">
                <div className="fn-inner">
                    <Link to="/" className="fn-logo">
                        <div className="fn-logo-mark">I</div>
                        <span>InsightCart</span>
                    </Link>

                    {isRegularUser && (
                        <ul className="fn-links">
                            <li><Link to="/">Accueil</Link></li>
                            <li><Link to="/produits">Catalogue</Link></li>
                            <li><Link to="/wishlist">Favoris</Link></li>
                            <li><Link to="/mes-commandes">Mes Commandes</Link></li>
                            <li><Link to="/profil">Profil</Link></li>
                            <li><Link to="/apropos">À Propos</Link></li>
                        </ul>
                    )}

                    <div className="fn-actions">
                        {isGuest && (
                            <>
                                <Link to="/login" className="fn-link">Connexion</Link>
                                <Link to="/register" className="fn-btn-solid">S'inscrire</Link>
                            </>
                        )}

                        {isAdmin && (
                            <>
                                <Link to="/admin/dashboard" className="fn-admin-badge">
                                    <span className="fn-admin-dot" />
                                    Admin
                                </Link>
                                <div className="fn-divider" />
                                <button onClick={handleLogout} className="fn-btn-logout">
                                    Déconnexion
                                </button>
                            </>
                        )}

                        {isRegularUser && (
                            <>
                                <Link to="/cart" className="fn-cart" title="Mon panier">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                        <line x1="3" y1="6" x2="21" y2="6"/>
                                        <path d="M16 10a4 4 0 0 1-8 0"/>
                                    </svg>
                                    {cartCount > 0 && (
                                        <span className="fn-cart-badge">{cartCount}</span>
                                    )}
                                </Link>
                                <Link to="/wishlist" className="fn-wishlist" title="Ma liste de souhaits">
                                    <svg viewBox="0 0 24 24" style={{ fill: wishlistCount > 0 ? '#FF5E00' : 'none' }}>
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                    </svg>
                                    {wishlistCount > 0 && (
                                        <span className="fn-cart-badge">{wishlistCount}</span>
                                    )}
                                </Link>
                                <div className="fn-divider" />
                                <button onClick={handleLogout} className="fn-btn-logout">
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
