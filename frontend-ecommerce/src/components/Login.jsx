import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Vérification des identifiants...');
        try {
            const response = await api.post('/auth/login', formData);
            const { role, email, token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userRole', role);
            login(role);
            toast.success('Bienvenue !', { id: loadingToast });
            navigate(role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
        } catch (error) {
            console.error('Erreur login:', error);
            toast.error('Email ou mot de passe incorrect', { id: loadingToast });
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

                .vl-root {
                    min-height: calc(100vh - 64px);
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    font-family: 'DM Sans', sans-serif;
                    background: var(--white);
                }

                /* LEFT DECORATIVE PANEL */
                .vl-panel {
                    background: var(--charcoal);
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 4rem;
                    overflow: hidden;
                }
                .vl-panel-bg {
                    position: absolute; inset: 0;
                    background: linear-gradient(145deg, #3D3530 0%, #1A1410 100%);
                }
                .vl-panel-circle {
                    position: absolute;
                    border-radius: 50%;
                    border: 1px solid rgba(201,169,110,0.12);
                }
                .vl-panel-circle.c1 { width: 420px; height: 420px; top: -100px; right: -120px; }
                .vl-panel-circle.c2 { width: 260px; height: 260px; top: 60px; right: -20px; }
                .vl-panel-circle.c3 { width: 180px; height: 180px; bottom: 120px; left: -60px; opacity: 0.5; }
                .vl-panel-decor {
                    position: absolute;
                    font-family: 'Playfair Display', serif;
                    font-size: 11rem; font-weight: 700;
                    color: white; opacity: 0.04;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none; white-space: nowrap;
                    letter-spacing: 0.05em;
                }
                .vl-panel-content { position: relative; z-index: 2; }
                .vl-panel-tag {
                    font-size: 0.65rem; letter-spacing: 0.24em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 1.2rem;
                }
                .vl-panel-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2.2rem, 3.5vw, 3.2rem);
                    color: var(--white); line-height: 1.12;
                    margin-bottom: 1.2rem;
                }
                .vl-panel-title em { font-style: italic; color: var(--gold); }
                .vl-panel-desc {
                    font-size: 0.88rem; color: rgba(253,250,247,0.38);
                    line-height: 1.8; font-weight: 300; max-width: 300px;
                    margin-bottom: 2.5rem;
                }
                .vl-panel-stats { display: flex; gap: 2.5rem; }
                .vl-stat-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.8rem; color: var(--white); font-weight: 700;
                }
                .vl-stat-label {
                    font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase;
                    color: rgba(253,250,247,0.3); margin-top: 3px;
                }

                /* RIGHT FORM PANEL */
                .vl-form-side {
                    display: flex; align-items: center; justify-content: center;
                    padding: 3rem 2rem;
                    background: var(--white);
                }
                .vl-form-wrap { width: 100%; max-width: 400px; }

                .vl-logo {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem; letter-spacing: 0.1em;
                    color: var(--black); text-decoration: none;
                    display: block; margin-bottom: 2.8rem;
                }
                .vl-form-eyebrow {
                    font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--accent); margin-bottom: 0.8rem;
                }
                .vl-form-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.2rem; color: var(--black);
                    line-height: 1.15; margin-bottom: 0.6rem;
                }
                .vl-form-title em { font-style: italic; color: var(--earth); }
                .vl-form-sub {
                    font-size: 0.85rem; color: var(--earth); font-weight: 300;
                    margin-bottom: 2.5rem; line-height: 1.65;
                }
                .vl-form-sub a {
                    color: var(--charcoal); font-weight: 500;
                    text-decoration: none; border-bottom: 1px solid var(--bark);
                    padding-bottom: 1px; transition: border-color 0.2s, color 0.2s;
                }
                .vl-form-sub a:hover { color: var(--black); border-color: var(--charcoal); }

                .vl-divider {
                    height: 1px; background: var(--sand);
                    margin-bottom: 2rem;
                }

                .vl-field { margin-bottom: 1.4rem; }
                .vl-label {
                    display: block; font-size: 0.7rem; letter-spacing: 0.16em;
                    text-transform: uppercase; color: var(--earth);
                    margin-bottom: 0.55rem; font-weight: 500;
                }
                .vl-input {
                    width: 100%; padding: 0.85rem 1.1rem;
                    background: var(--cream);
                    border: 1px solid var(--sand);
                    border-radius: 2px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.92rem; color: var(--black);
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                    box-sizing: border-box;
                }
                .vl-input::placeholder { color: var(--bark); font-weight: 300; }
                .vl-input:focus {
                    border-color: var(--earth);
                    background: var(--white);
                }

                .vl-forgot {
                    display: block; text-align: right;
                    font-size: 0.72rem; letter-spacing: 0.1em;
                    color: var(--bark); text-decoration: none;
                    margin-top: -0.8rem; margin-bottom: 1.8rem;
                    transition: color 0.2s;
                }
                .vl-forgot:hover { color: var(--earth); }

                .vl-submit {
                    width: 100%; padding: 1rem;
                    background: var(--charcoal); color: var(--white);
                    border: none; border-radius: 2px; cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem; letter-spacing: 0.18em; text-transform: uppercase;
                    font-weight: 500;
                    transition: background 0.2s, transform 0.15s, opacity 0.2s;
                }
                .vl-submit:hover:not(:disabled) { background: var(--black); transform: translateY(-1px); }
                .vl-submit:disabled { opacity: 0.55; cursor: not-allowed; }

                .vl-footer-note {
                    margin-top: 1.8rem; text-align: center;
                    font-size: 0.75rem; color: var(--bark); line-height: 1.6;
                }
                .vl-footer-note a {
                    color: var(--earth); text-decoration: none;
                    border-bottom: 1px solid var(--sand);
                    padding-bottom: 1px; transition: color 0.2s;
                }
                .vl-footer-note a:hover { color: var(--charcoal); }

                .vl-trust-row {
                    display: flex; gap: 1.2rem; margin-top: 2.2rem;
                }
                .vl-trust-badge {
                    flex: 1; display: flex; align-items: center; gap: 0.5rem;
                    background: var(--cream); border: 1px solid var(--sand);
                    border-radius: 2px; padding: 0.65rem 0.8rem;
                }
                .vl-trust-badge svg { flex-shrink: 0; color: var(--gold); }
                .vl-trust-badge span {
                    font-size: 0.68rem; color: var(--earth);
                    letter-spacing: 0.06em; line-height: 1.4;
                }

                @media (max-width: 768px) {
                    .vl-root { grid-template-columns: 1fr; }
                    .vl-panel { display: none; }
                }
            `}</style>

            <div className="vl-root">

                {/* LEFT DECORATIVE PANEL */}
                <div className="vl-panel">
                    <div className="vl-panel-bg" />
                    <div className="vl-panel-circle c1" />
                    <div className="vl-panel-circle c2" />
                    <div className="vl-panel-circle c3" />
                    <div className="vl-panel-decor">VAUX</div>
                    <div className="vl-panel-content">
                        <div className="vl-panel-tag">Espace membre</div>
                        <h2 className="vl-panel-title">
                            Votre espace<br /><em>personnel</em><br />vous attend.
                        </h2>
                        <p className="vl-panel-desc">
                            Accédez à vos commandes, suivez vos livraisons et profitez d'offres exclusives réservées aux membres.
                        </p>
                        <div className="vl-panel-stats">
                            <div>
                                <div className="vl-stat-num">14k+</div>
                                <div className="vl-stat-label">Produits</div>
                            </div>
                            <div>
                                <div className="vl-stat-num">98%</div>
                                <div className="vl-stat-label">Satisfaction</div>
                            </div>
                            <div>
                                <div className="vl-stat-num">60+</div>
                                <div className="vl-stat-label">Pays livrés</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT FORM PANEL */}
                <div className="vl-form-side">
                    <div className="vl-form-wrap">
                        <Link to="/" className="vl-logo">VAUX</Link>

                        <p className="vl-form-eyebrow">Connexion</p>
                        <h1 className="vl-form-title">
                            Bon retour<br /><em>parmi nous.</em>
                        </h1>
                        <p className="vl-form-sub">
                            Pas encore de compte ?{' '}
                            <Link to="/register">Créez-en un gratuitement</Link>
                        </p>

                        <div className="vl-divider" />

                        <form onSubmit={handleSubmit}>
                            <div className="vl-field">
                                <label className="vl-label">Adresse Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="votre@email.com"
                                    onChange={handleChange}
                                    required
                                    className="vl-input"
                                />
                            </div>

                            <div className="vl-field">
                                <label className="vl-label">Mot de passe</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    required
                                    className="vl-input"
                                />
                            </div>

                            <a href="#" className="vl-forgot">Mot de passe oublié ?</a>

                            <button
                                type="submit"
                                disabled={loading}
                                className="vl-submit"
                            >
                                {loading ? 'Connexion en cours…' : 'Se connecter'}
                            </button>
                        </form>

                        <p className="vl-footer-note">
                            En vous connectant, vous acceptez nos{' '}
                            <a href="#">conditions d'utilisation</a> et notre{' '}
                            <a href="#">politique de confidentialité</a>.
                        </p>

                        <div className="vl-trust-row">
                            <div className="vl-trust-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <span>Connexion sécurisée SSL</span>
                            </div>
                            <div className="vl-trust-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                                </svg>
                                <span>Données 100% protégées</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}