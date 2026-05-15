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
                .fr-root {
                    min-height: calc(100vh - 64px);
                    display: grid; grid-template-columns: 1fr 1fr;
                    font-family: 'Inter', sans-serif;
                    background: #0A0A0A;
                }

                .fr-panel {
                    background: #111111; position: relative;
                    display: flex; flex-direction: column; justify-content: center;
                    padding: 5rem 4rem; overflow: hidden; order: 2;
                }
                .fr-panel-blob {
                    position: absolute; border-radius: 50%;
                    background: rgba(255,94,0,0.04);
                }
                .fr-panel-blob.b1 { width: 380px; height: 380px; top: -100px; left: -120px; }
                .fr-panel-blob.b2 { width: 220px; height: 220px; bottom: 80px; right: -60px; }
                .fr-panel-decor {
                    position: absolute;
                    font-family: 'Oswald', sans-serif;
                    font-size: 8rem; font-weight: 700;
                    color: #fff; opacity: 0.025;
                    bottom: 2rem; right: 2rem;
                    pointer-events: none; line-height: 1; letter-spacing: 0.05em;
                }
                .fr-panel-content { position: relative; z-index: 2; }
                .fr-panel-tag {
                    font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase;
                    color: #FF5E00; margin-bottom: 1.2rem; font-weight: 600;
                }
                .fr-panel-title {
                    font-family: 'Oswald', sans-serif;
                    font-size: clamp(2rem, 3vw, 3rem);
                    color: #fff; line-height: 1.05; text-transform: uppercase;
                    margin-bottom: 1.2rem;
                }
                .fr-panel-title .hl { color: #FF5E00; }
                .fr-panel-desc {
                    font-size: 0.85rem; color: #6B6B6B;
                    line-height: 1.8; font-weight: 300; max-width: 300px;
                    margin-bottom: 2.5rem;
                }
                .fr-perks { display: flex; flex-direction: column; gap: 1rem; }
                .fr-perk { display: flex; align-items: flex-start; gap: 0.9rem; }
                .fr-perk-icon {
                    width: 34px; height: 34px; flex-shrink: 0;
                    background: rgba(255,94,0,0.08); border: 1px solid rgba(255,94,0,0.15);
                    display: flex; align-items: center; justify-content: center;
                    color: #FF5E00; margin-top: 2px;
                }
                .fr-perk-title { font-size: 0.75rem; font-weight: 500; color: #D4D4D4; letter-spacing: 0.04em; margin-bottom: 2px; }
                .fr-perk-desc { font-size: 0.75rem; color: #6B6B6B; font-weight: 300; line-height: 1.5; }

                .fr-form-side { display: flex; align-items: center; justify-content: center; padding: 3rem 2rem; background: #0A0A0A; order: 1; }
                .fr-form-wrap { width: 100%; max-width: 420px; }
                .fr-logo {
                    font-family: 'Oswald', sans-serif;
                    font-size: 1.4rem; letter-spacing: 0.1em;
                    color: #fff; text-decoration: none; display: block; margin-bottom: 2.5rem;
                }
                .fr-form-eyebrow {
                    font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase;
                    color: #FF5E00; margin-bottom: 0.8rem; font-weight: 600;
                }
                .fr-form-title {
                    font-family: 'Oswald', sans-serif;
                    font-size: 2.2rem; color: #fff;
                    line-height: 1.05; text-transform: uppercase;
                    margin-bottom: 0.6rem;
                }
                .fr-form-title .hl { color: #FF5E00; }
                .fr-form-sub {
                    font-size: 0.82rem; color: #6B6B6B; font-weight: 300;
                    margin-bottom: 2.2rem; line-height: 1.65;
                }
                .fr-form-sub a {
                    color: #FF5E00; font-weight: 500;
                    text-decoration: none; border-bottom: 1px solid rgba(255,94,0,0.3);
                    padding-bottom: 1px; transition: all 0.2s;
                }
                .fr-form-sub a:hover { color: #FF7A2E; border-color: #FF7A2E; }
                .fr-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 2rem; }
                .fr-field { margin-bottom: 1.25rem; }
                .fr-field-row { display: flex; gap: 1rem; margin-bottom: 1.25rem; }
                .fr-field-row .fr-field { flex: 1; margin-bottom: 0; }
                .fr-label {
                    display: block; font-size: 0.65rem; letter-spacing: 0.2em;
                    text-transform: uppercase; color: #B8B8B8;
                    margin-bottom: 0.5rem; font-weight: 500;
                }
                .fr-input {
                    width: 100%; padding: 0.8rem 1rem;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    font-family: 'Inter', sans-serif;
                    font-size: 0.9rem; color: #D4D4D4;
                    outline: none; transition: all 0.2s;
                    box-sizing: border-box;
                }
                .fr-input::placeholder { color: #6B6B6B; font-weight: 300; }
                .fr-input:focus { border-color: #FF5E00; box-shadow: 0 0 0 3px rgba(255,94,0,0.1); }
                .fr-submit {
                    width: 100%; padding: 1rem;
                    background: #FF5E00; color: #0A0A0A;
                    border: none; cursor: pointer;
                    font-family: 'Oswald', sans-serif;
                    font-size: 0.78rem; letter-spacing: 0.2em; text-transform: uppercase;
                    font-weight: 600; margin-top: 0.5rem;
                    transition: all 0.2s;
                }
                .fr-submit:hover:not(:disabled) { background: #FF7A2E; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(255,94,0,0.3); }
                .fr-submit:disabled { opacity: 0.5; cursor: not-allowed; }
                .fr-footer-note {
                    margin-top: 1.6rem; text-align: center;
                    font-size: 0.72rem; color: #6B6B6B; line-height: 1.7;
                }
                .fr-footer-note a {
                    color: #B8B8B8; text-decoration: none;
                    border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1px;
                    transition: color 0.2s;
                }
                .fr-footer-note a:hover { color: #FF5E00; }

                @media (max-width: 768px) {
                    .fr-root { grid-template-columns: 1fr; }
                    .fr-panel { display: none; }
                    .fr-form-side { order: 1; }
                }
            `}</style>

            <div className="fr-root">
                <div className="fr-form-side">
                    <div className="fr-form-wrap">
                        <Link to="/" className="fr-logo">InsightCart</Link>
                        <p className="fr-form-eyebrow">Inscription</p>
                        <h1 className="fr-form-title">
                            Rejoignez<br /><span className="hl">l'expérience.</span>
                        </h1>
                        <p className="fr-form-sub">
                            Déjà membre ?{' '}
                            <Link to="/login">Connectez-vous à votre compte</Link>
                        </p>
                        <div className="fr-divider" />
                        <form onSubmit={handleSubmit}>
                            <div className="fr-field">
                                <label className="fr-label">Nom d'utilisateur</label>
                                <input type="text" name="username" placeholder="votre_pseudo" onChange={handleChange} required className="fr-input" />
                            </div>
                            <div className="fr-field">
                                <label className="fr-label">Adresse Email</label>
                                <input type="email" name="email" placeholder="votre@email.com" onChange={handleChange} required className="fr-input" />
                            </div>
                            <div className="fr-field">
                                <label className="fr-label">Mot de passe</label>
                                <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required className="fr-input" />
                            </div>
                            <div className="fr-field-row">
                                <div className="fr-field">
                                    <label className="fr-label">Ville</label>
                                    <input type="text" name="city" placeholder="Paris" onChange={handleChange} required className="fr-input" />
                                </div>
                                <div className="fr-field">
                                    <label className="fr-label">Région</label>
                                    <input type="text" name="state" placeholder="Île-de-France" onChange={handleChange} required className="fr-input" />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="fr-submit">
                                {loading ? 'Création en cours…' : "S'inscrire"}
                            </button>
                        </form>
                        <p className="fr-footer-note">
                            En créant un compte, vous acceptez nos{' '}
                            <a href="#">conditions d'utilisation</a> et notre{' '}
                            <a href="#">politique de confidentialité</a>.
                        </p>
                    </div>
                </div>

                <div className="fr-panel">
                    <div className="fr-panel-blob b1" />
                    <div className="fr-panel-blob b2" />
                    <div className="fr-panel-decor">InsightCart</div>
                    <div className="fr-panel-content">
                        <div className="fr-panel-tag">Avantages membres</div>
                        <h2 className="fr-panel-title">
                            Plus qu'une<br /><span className="hl">boutique,</span><br />une communauté.
                        </h2>
                        <p className="fr-panel-desc">
                            Rejoignez des milliers de membres qui profitent d'avantages exclusifs et d'une expérience d'achat premium.
                        </p>
                        <div className="fr-perks">
                            <div className="fr-perk">
                                <div className="fr-perk-icon">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="fr-perk-title">Livraison prioritaire</div>
                                    <div className="fr-perk-desc">Vos commandes expédiées en premier, sous 24h.</div>
                                </div>
                            </div>
                            <div className="fr-perk">
                                <div className="fr-perk-icon">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="fr-perk-title">Offres exclusives</div>
                                    <div className="fr-perk-desc">Accès anticipé aux ventes privées et nouveautés.</div>
                                </div>
                            </div>
                            <div className="fr-perk">
                                <div className="fr-perk-icon">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="fr-perk-title">Retours simplifiés</div>
                                    <div className="fr-perk-desc">30 jours pour changer d'avis, sans aucune question.</div>
                                </div>
                            </div>
                            <div className="fr-perk">
                                <div className="fr-perk-icon">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="fr-perk-title">Support dédié</div>
                                    <div className="fr-perk-desc">Une équipe disponible 24/7 rien que pour vous.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
