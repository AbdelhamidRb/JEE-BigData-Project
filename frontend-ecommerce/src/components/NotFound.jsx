import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <>
            <style>{baseStyles}</style>
            <div className="vnf-root">
                <div className="vnf-content">
                    <div className="vnf-code">404</div>
                    <h1 className="vnf-title">Page non trouvée</h1>
                    <p className="vnf-text">
                        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                    </p>
                    <div className="vnf-actions">
                        <Link to="/" className="vnf-btn-primary">Retour à l'accueil</Link>
                        <Link to="/produits" className="vnf-btn-secondary">Voir le catalogue</Link>
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

    .vnf-root {
        min-height: calc(100vh - 68px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: var(--cream);
        font-family: 'DM Sans', sans-serif;
    }

    .vnf-content {
        text-align: center;
        max-width: 480px;
    }

    .vnf-code {
        font-family: 'Playfair Display', serif;
        font-size: 8rem;
        font-weight: 700;
        color: var(--sand);
        line-height: 1;
        margin-bottom: 0.5rem;
    }

    .vnf-title {
        font-family: 'Playfair Display', serif;
        font-size: 2rem;
        color: var(--black);
        margin-bottom: 1rem;
    }

    .vnf-text {
        font-size: 1rem;
        color: var(--earth);
        line-height: 1.6;
        margin-bottom: 2rem;
    }

    .vnf-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .vnf-btn-primary {
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

    .vnf-btn-primary:hover {
        background: var(--black);
        transform: translateY(-1px);
    }

    .vnf-btn-secondary {
        display: inline-block;
        padding: 0.85rem 1.75rem;
        background: transparent;
        color: var(--charcoal);
        text-decoration: none;
        border: 1px solid var(--bark);
        border-radius: 3px;
        font-size: 0.8rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-weight: 500;
        transition: border-color 0.2s, color 0.2s;
    }

    .vnf-btn-secondary:hover {
        border-color: var(--charcoal);
        color: var(--black);
    }

    @media (max-width: 480px) {
        .vnf-code { font-size: 5rem; }
        .vnf-title { font-size: 1.5rem; }
        .vnf-actions { flex-direction: column; }
    }
`;
