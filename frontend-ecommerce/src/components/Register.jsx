import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '', city: '', state: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Création de votre compte...');
        try {
            await api.post('/auth/register', formData);
            toast.success('Compte créé avec succès !', { id: loadingToast });
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            toast.error(error.response?.data || "Erreur lors de l'inscription", { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

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

                .vr-root {
                    min-height: calc(100vh - 64px);
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    font-family: 'DM Sans', sans-serif;
                    background: var(--white);
                }

                /* RIGHT decorative panel (reversed from Login) */
                .vr-panel {
                    background: var(--cream);
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 5rem 4rem;
                    overflow: hidden;
                    order: 2;
                }
                .vr-panel-blob {
                    position: absolute;
                    border-radius: 50%;
                    background: var(--sand);
                }
                .vr-panel-blob.b1 { width: 380px; height: 380px; top: -100px; left: -120px; opacity: 0.7; }
                .vr-panel-blob.b2 { width: 220px; height: 220px; bottom: 80px; right: -60px; opacity: 0.5; }
                .vr-panel-decor {
                    position: absolute;
                    font-family: 'Playfair Display', serif;
                    font-size: 10rem; font-weight: 700;
                    color: var(--bark); opacity: 0.07;
                    bottom: 2rem; right: 2rem;
                    pointer-events: none; line-height: 1;
                }
                .vr-panel-content { position: relative; z-index: 2; }
                .vr-panel-tag {
                    font-size: 0.65rem; letter-spacing: 0.24em; text-transform: uppercase;
                    color: var(--accent); margin-bottom: 1.2rem;
                }
                .vr-panel-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 3vw, 3rem);
                    color: var(--black); line-height: 1.12; margin-bottom: 1.2rem;
                }
                .vr-panel-title em { font-style: italic; color: var(--earth); }
                .vr-panel-desc {
                    font-size: 0.88rem; color: var(--earth);
                    line-height: 1.8; font-weight: 300; max-width: 300px;
                    margin-bottom: 2.5rem;
                }
                .vr-perks { display: flex; flex-direction: column; gap: 1rem; }
                .vr-perk {
                    display: flex; align-items: flex-start; gap: 0.9rem;
                }
                .vr-perk-icon {
                    width: 34px; height: 34px; flex-shrink: 0;
                    background: var(--white); border: 1px solid var(--sand);
                    border-radius: 2px;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--gold);
                    margin-top: 2px;
                }
                .vr-perk-title {
                    font-size: 0.78rem; font-weight: 500; color: var(--black);
                    letter-spacing: 0.04em; margin-bottom: 2px;
                }
                .vr-perk-desc { font-size: 0.78rem; color: var(--earth); font-weight: 300; line-height: 1.5; }

                /* LEFT FORM PANEL */
                .vr-form-side {
                    display: flex; align-items: center; justify-content: center;
                    padding: 3rem 2rem;
                    background: var(--white);
                    order: 1;
                }
                .vr-form-wrap { width: 100%; max-width: 420px; }

                .vr-logo {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem; letter-spacing: 0.1em;
                    color: var(--black); text-decoration: none;
                    display: block; margin-bottom: 2.8rem;
                }
                .vr-form-eyebrow {
                    font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--accent); margin-bottom: 0.8rem;
                }
                .vr-form-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.2rem; color: var(--black);
                    line-height: 1.15; margin-bottom: 0.6rem;
                }
                .vr-form-title em { font-style: italic; color: var(--earth); }
                .vr-form-sub {
                    font-size: 0.85rem; color: var(--earth); font-weight: 300;
                    margin-bottom: 2.2rem; line-height: 1.65;
                }
                .vr-form-sub a {
                    color: var(--charcoal); font-weight: 500;
                    text-decoration: none; border-bottom: 1px solid var(--bark);
                    padding-bottom: 1px; transition: border-color 0.2s, color 0.2s;
                }
                .vr-form-sub a:hover { color: var(--black); border-color: var(--charcoal); }

                .vr-divider { height: 1px; background: var(--sand); margin-bottom: 2rem; }

                .vr-field { margin-bottom: 1.25rem; }
                .vr-field-row { display: flex; gap: 1rem; margin-bottom: 1.25rem; }
                .vr-field-row .vr-field { flex: 1; margin-bottom: 0; }

                .vr-label {
                    display: block; font-size: 0.68rem; letter-spacing: 0.16em;
                    text-transform: uppercase; color: var(--earth);
                    margin-bottom: 0.5rem; font-weight: 500;
                }
                .vr-input {
                    width: 100%; padding: 0.82rem 1.05rem;
                    background: var(--cream);
                    border: 1px solid var(--sand);
                    border-radius: 2px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.92rem; color: var(--black);
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                    box-sizing: border-box;
                }
                .vr-input::placeholder { color: var(--bark); font-weight: 300; }
                .vr-input:focus { border-color: var(--earth); background: var(--white); }

                .vr-submit {
                    width: 100%; padding: 1rem;
                    background: var(--charcoal); color: var(--white);
                    border: none; border-radius: 2px; cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem; letter-spacing: 0.18em; text-transform: uppercase;
                    font-weight: 500; margin-top: 0.5rem;
                    transition: background 0.2s, transform 0.15s, opacity 0.2s;
                }
                .vr-submit:hover:not(:disabled) { background: var(--black); transform: translateY(-1px); }
                .vr-submit:disabled { opacity: 0.55; cursor: not-allowed; }

                .vr-footer-note {
                    margin-top: 1.6rem; text-align: center;
                    font-size: 0.75rem; color: var(--bark); line-height: 1.7;
                }
                .vr-footer-note a {
                    color: var(--earth); text-decoration: none;
                    border-bottom: 1px solid var(--sand); padding-bottom: 1px;
                    transition: color 0.2s;
                }
                .vr-footer-note a:hover { color: var(--charcoal); }

                @media (max-width: 768px) {
                    .vr-root { grid-template-columns: 1fr; }
                    .vr-panel { display: none; }
                    .vr-form-side { order: 1; }
                }
            `}</style>

            <div className="vr-root">

                {/* FORM PANEL — LEFT */}
                <div className="vr-form-side">
                    <div className="vr-form-wrap">
                        <Link to="/" className="vr-logo">InsightCart</Link>

                        <p className="vr-form-eyebrow">Inscription</p>
                        <h1 className="vr-form-title">
                            Rejoignez<br /><em>l'expérience.</em>
                        </h1>
                        <p className="vr-form-sub">
                            Déjà membre ?{' '}
                            <Link to="/login">Connectez-vous à votre compte</Link>
                        </p>

                        <div className="vr-divider" />

                        <form onSubmit={handleSubmit}>
                            <div className="vr-field">
                                <label className="vr-label">Nom d'utilisateur</label>
                                <input
                                    type="text" name="username"
                                    placeholder="votre_pseudo"
                                    onChange={handleChange} required
                                    className="vr-input"
                                />
                            </div>

                            <div className="vr-field">
                                <label className="vr-label">Adresse Email</label>
                                <input
                                    type="email" name="email"
                                    placeholder="votre@email.com"
                                    onChange={handleChange} required
                                    className="vr-input"
                                />
                            </div>

                            <div className="vr-field">
                                <label className="vr-label">Mot de passe</label>
                                <input
                                    type="password" name="password"
                                    placeholder="••••••••"
                                    onChange={handleChange} required
                                    className="vr-input"
                                />
                            </div>

                            <div className="vr-field-row">
                                <div className="vr-field">
                                    <label className="vr-label">Ville</label>
                                    <input
                                        type="text" name="city"
                                        placeholder="Paris"
                                        onChange={handleChange} required
                                        className="vr-input"
                                    />
                                </div>
                                <div className="vr-field">
                                    <label className="vr-label">Région</label>
                                    <input
                                        type="text" name="state"
                                        placeholder="Île-de-France"
                                        onChange={handleChange} required
                                        className="vr-input"
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="vr-submit">
                                {loading ? 'Création en cours…' : "S'inscrire"}
                            </button>
                        </form>

                        <p className="vr-footer-note">
                            En créant un compte, vous acceptez nos{' '}
                            <a href="#">conditions d'utilisation</a> et notre{' '}
                            <a href="#">politique de confidentialité</a>.
                        </p>
                    </div>
                </div>

                {/* DECORATIVE PANEL — RIGHT */}
                <div className="vr-panel">
                    <div className="vr-panel-blob b1" />
                    <div className="vr-panel-blob b2" />
                    <div className="vr-panel-decor">InsightCart</div>
                    <div className="vr-panel-content">
                        <div className="vr-panel-tag">Avantages membres</div>
                        <h2 className="vr-panel-title">
                            Plus qu'une<br /><em>boutique,</em><br />une communauté.
                        </h2>
                        <p className="vr-panel-desc">
                            Rejoignez des milliers de membres qui profitent d'avantages exclusifs et d'une expérience d'achat premium.
                        </p>
                        <div className="vr-perks">
                            <div className="vr-perk">
                                <div className="vr-perk-icon">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="vr-perk-title">Livraison prioritaire</div>
                                    <div className="vr-perk-desc">Vos commandes expédiées en premier, sous 24h.</div>
                                </div>
                            </div>
                            <div className="vr-perk">
                                <div className="vr-perk-icon">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="vr-perk-title">Offres exclusives</div>
                                    <div className="vr-perk-desc">Accès anticipé aux ventes privées et nouveautés.</div>
                                </div>
                            </div>
                            <div className="vr-perk">
                                <div className="vr-perk-icon">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="vr-perk-title">Retours simplifiés</div>
                                    <div className="vr-perk-desc">30 jours pour changer d'avis, sans aucune question.</div>
                                </div>
                            </div>
                            <div className="vr-perk">
                                <div className="vr-perk-icon">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="vr-perk-title">Support dédié</div>
                                    <div className="vr-perk-desc">Une équipe disponible 24/7 rien que pour vous.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}