import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Oswald:wght@400;500;600;700&display=swap');
                .fnf-root { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 2rem; background: #0A0A0A; font-family: 'Inter', sans-serif; }
                .fnf-content { text-align: center; max-width: 480px; }
                .fnf-code { font-family: 'Oswald', sans-serif; font-size: 8rem; font-weight: 700; color: rgba(255,94,0,0.08); line-height: 1; margin-bottom: 0.5rem; }
                .fnf-title { font-family: 'Oswald', sans-serif; font-size: 2rem; color: #fff; margin-bottom: 1rem; text-transform: uppercase; }
                .fnf-text { font-size: 0.95rem; color: #6B6B6B; line-height: 1.6; margin-bottom: 2rem; }
                .fnf-actions { display: flex; gap: 1rem; justify-content: center; }
                .fnf-btn-primary { display: inline-block; padding: 0.8rem 1.6rem; background: #FF5E00; color: #0A0A0A; text-decoration: none; font-family: 'Oswald', sans-serif; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; transition: background 0.2s; }
                .fnf-btn-primary:hover { background: #FF7A2E; }
                .fnf-btn-secondary { display: inline-block; padding: 0.8rem 1.6rem; background: transparent; color: #B8B8B8; text-decoration: none; border: 1px solid rgba(255,255,255,0.15); font-family: 'Oswald', sans-serif; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; transition: all 0.2s; }
                .fnf-btn-secondary:hover { border-color: #FF5E00; color: #FF5E00; }
                @media (max-width: 480px) { .fnf-code { font-size: 5rem; } .fnf-title { font-size: 1.5rem; } .fnf-actions { flex-direction: column; } }
            `}</style>
            <div className="fnf-root">
                <div className="fnf-content">
                    <div className="fnf-code">404</div>
                    <h1 className="fnf-title">Page non trouvée</h1>
                    <p className="fnf-text">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
                    <div className="fnf-actions">
                        <Link to="/" className="fnf-btn-primary">Retour à l'accueil</Link>
                        <Link to="/produits" className="fnf-btn-secondary">Voir le catalogue</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
