import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
    { path: 'dashboard', label: 'Synthèse', to: '/admin/dashboard' },
    { path: 'products', label: 'Produits', to: '/admin/products' },
    { path: 'users', label: 'Utilisateurs', to: '/admin/users' },
    { path: 'categories', label: 'Catégories', to: '/admin/categories' },
    { path: 'orders', label: 'Commandes', to: '/admin/orders' },
    { path: 'analytics', label: 'Analytics', to: '/admin/analytics' },
    { path: 'profile', label: 'Mon Profil', to: '/admin/profile' },
];

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        navigate('/', { replace: true });
        setTimeout(() => { logout(); toast.success('Déconnexion réussie'); }, 10);
    };

    const isActive = (path) => location.pathname.includes(path);

    return (
        <>
            <style>{`
                .fa-layout { display: flex; min-height: 100vh; background: #0A0A0A; font-family: 'Inter', sans-serif; }
                .fa-sidebar { width: 230px; flex-shrink: 0; background: #111111; border-right: 1px solid rgba(255,255,255,0.04); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
                .fa-sidebar-top { padding: 1.5rem 1.2rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
                .fa-sidebar-logo { font-family: 'Oswald', sans-serif; font-size: 1.3rem; letter-spacing: 0.08em; color: #fff; display: flex; align-items: center; gap: 8px; text-decoration: none; margin-bottom: 0.2rem; }
                .fa-sidebar-logo-mark { width: 24px; height: 24px; background: #FF5E00; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; color: #0A0A0A; }
                .fa-sidebar-role { font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: #FF5E00; margin-left: 32px; }
                .fa-sidebar-nav { flex: 1; padding: 1rem; }
                .fa-nav-item { display: flex; align-items: center; gap: 0.7rem; padding: 0.65rem 0.8rem; text-decoration: none; font-size: 0.78rem; letter-spacing: 0.06em; margin-bottom: 2px; transition: all 0.18s; color: #6B6B6B; position: relative; }
                .fa-nav-item:hover { background: rgba(255,255,255,0.03); color: #D4D4D4; }
                .fa-nav-item.active { background: rgba(255,94,0,0.08); color: #FF5E00; }
                .fa-nav-item.active::before { content: ''; position: absolute; left: 0; top: 20%; bottom: 20%; width: 2px; background: #FF5E00; }
                .fa-nav-icon { width: 16px; height: 16px; flex-shrink: 0; opacity: 0.5; }
                .fa-nav-item.active .fa-nav-icon { opacity: 1; }
                .fa-sidebar-footer { padding: 1rem; border-top: 1px solid rgba(255,255,255,0.04); }
                .fa-logout-btn { width: 100%; display: flex; align-items: center; gap: 0.7rem; padding: 0.65rem 0.8rem; background: transparent; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 0.75rem; color: #6B6B6B; transition: all 0.18s; text-align: left; }
                .fa-logout-btn:hover { background: rgba(226,75,74,0.08); color: #E24B4A; }
                .fa-main { flex: 1; padding: 2rem 2.5rem; overflow-x: hidden; min-width: 0; }

                @media (max-width: 768px) { .fa-sidebar { display: none; } .fa-main { padding: 1.5rem 1rem; } }
            `}</style>

            <div className="fa-layout">
                <aside className="fa-sidebar">
                    <div className="fa-sidebar-top">
                        <Link to="/" className="fa-sidebar-logo">
                            <div className="fa-sidebar-logo-mark">I</div> InsightCart
                        </Link>
                        <div className="fa-sidebar-role">Panneau Admin</div>
                    </div>
                    <nav className="fa-sidebar-nav">
                        {NAV_ITEMS.map((item) => (
                            <Link key={item.path} to={item.to} className={`fa-nav-item${isActive(item.path) ? ' active' : ''}`}>
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="fa-sidebar-footer">
                        <button onClick={handleLogout} className="fa-logout-btn">← Quitter</button>
                    </div>
                </aside>
                <main className="fa-main">
                    <Outlet />
                </main>
            </div>
        </>
    );
}
