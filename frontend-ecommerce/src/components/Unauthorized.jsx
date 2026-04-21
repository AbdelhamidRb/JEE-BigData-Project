import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Unauthorized() {
    const { isAuthenticated, userRole } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                navigate('/login');
            } else if (userRole === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [isAuthenticated, userRole, navigate]);

    return (
        <>
            <style>{baseStyles}</style>
            <div className="vuf-root">
                <div className="vuf-content">
                    <div className="vuf-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                    </div>
                    <h1 className="vuf-title">Accès non autorisé</h1>
                    <p className="vuf-text">
                        Vous n'avez pas la permission d'accéder à cette page.
                        <br />
                        Redirection automatique dans quelques instants...
                    </p>
                    <div className="vuf-actions">
                        {!isAuthenticated ? (
                            <Link to="/login" className="vuf-btn-primary">Se connecter</Link>
                        ) : userRole === 'ADMIN' ? (
                            <Link to="/admin/dashboard" className="vuf-btn-primary">Retour au tableau de bord admin</Link>
                        ) : (
                            <Link to="/dashboard" className="vuf-btn-primary">Retour au tableau de bord</Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

const baseStyles = `
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

    .vuf-root {
        min-height: calc(100vh - 68px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: var(--cream);
        font-family: 'DM Sans', sans-serif;
    }

    .vuf-content {
        text-align: center;
        max-width: 480px;
    }

    .vuf-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: var(--sand);
        color: var(--earth);
        margin-bottom: 1.5rem;
    }

    .vuf-title {
        font-family: 'Playfair Display', serif;
        font-size: 2rem;
        color: var(--black);
        margin-bottom: 1rem;
    }

    .vuf-text {
        font-size: 1rem;
        color: var(--earth);
        line-height: 1.6;
        margin-bottom: 2rem;
    }

    .vuf-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .vuf-btn-primary {
        display: inline-block;
        padding: 0.85rem 1.75rem;
        background: var(--charcoal);
        color: var(--white);
        text-decoration: none;
        border-radius: 3px;
        font-size: 0.8rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-weight: 500;
        transition: background 0.2s, transform 0.12s;
    }

    .vuf-btn-primary:hover {
        background: var(--black);
        transform: translateY(-1px);
    }

    @media (max-width: 480px) {
        .vuf-title { font-size: 1.5rem; }
        .vuf-icon { width: 80px; height: 80px; }
        .vuf-icon svg { width: 48px; height: 48px; }
    }
`;
