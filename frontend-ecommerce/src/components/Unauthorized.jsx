import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Unauthorized() {
    const { isAuthenticated, userRole } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAuthenticated) navigate('/login');
            else if (userRole === 'ADMIN') navigate('/admin/dashboard');
            else navigate('/dashboard');
        }, 5000);
        return () => clearTimeout(timer);
    }, [isAuthenticated, userRole, navigate]);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Oswald:wght@400;500;600;700&display=swap');
                .fuf-root { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 2rem; background: #0A0A0A; font-family: 'Inter', sans-serif; }
                .fuf-content { text-align: center; max-width: 480px; }
                .fuf-icon { display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; border: 1px solid rgba(255,94,0,0.15); background: rgba(255,94,0,0.06); color: #FF5E00; margin-bottom: 1.5rem; }
                .fuf-title { font-family: 'Oswald', sans-serif; font-size: 2rem; color: #fff; margin-bottom: 1rem; text-transform: uppercase; }
                .fuf-text { font-size: 0.95rem; color: #6B6B6B; line-height: 1.6; margin-bottom: 2rem; }
                .fuf-actions { display: flex; gap: 1rem; justify-content: center; }
                .fuf-btn-primary { display: inline-block; padding: 0.8rem 1.6rem; background: #FF5E00; color: #0A0A0A; text-decoration: none; font-family: 'Oswald', sans-serif; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; transition: background 0.2s; }
                .fuf-btn-primary:hover { background: #FF7A2E; }
                @media (max-width: 480px) { .fuf-title { font-size: 1.5rem; } }
            `}</style>
            <div className="fuf-root">
                <div className="fuf-content">
                    <div className="fuf-icon">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                    </div>
                    <h1 className="fuf-title">Accès non autorisé</h1>
                    <p className="fuf-text">Vous n'avez pas la permission d'accéder à cette page. Redirection automatique dans quelques instants...</p>
                    <div className="fuf-actions">
                        {!isAuthenticated ? (
                            <Link to="/login" className="fuf-btn-primary">Se connecter</Link>
                        ) : userRole === 'ADMIN' ? (
                            <Link to="/admin/dashboard" className="fuf-btn-primary">Tableau de bord admin</Link>
                        ) : (
                            <Link to="/dashboard" className="fuf-btn-primary">Tableau de bord</Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
