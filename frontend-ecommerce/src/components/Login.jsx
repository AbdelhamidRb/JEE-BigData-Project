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
            login({ role, email });
            toast.success('Bienvenue !', { id: loadingToast });
            navigate(role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
        } catch (error) {
            toast.error('Email ou mot de passe incorrect', { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                .fl-root {
                    min-height: calc(100vh - 64px);
                    display: grid; grid-template-columns: 1fr 1fr;
                    font-family: 'Inter', sans-serif;
                    background: #0A0A0A;
                }

                .fl-panel {
                    background: #111111;
                    position: relative; display: flex;
                    flex-direction: column; justify-content: flex-end;
                    padding: 4rem; overflow: hidden;
                }
                .fl-panel-bg { position: absolute; inset: 0; background: linear-gradient(145deg, #1A1A1A 0%, #0A0A0A 100%); }
                .fl-panel-circle {
                    position: absolute; border-radius: 50%;
                    border: 1px solid rgba(255,94,0,0.08);
                }
                .fl-panel-circle.c1 { width: 420px; height: 420px; top: -100px; right: -120px; }
                .fl-panel-circle.c2 { width: 260px; height: 260px; top: 60px; right: -20px; }
                .fl-panel-circle.c3 { width: 180px; height: 180px; bottom: 120px; left: -60px; opacity: 0.5; }
                .fl-panel-decor {
                    position: absolute;
                    font-family: 'Oswald', sans-serif;
                    font-size: 9rem; font-weight: 700;
                    color: #fff; opacity: 0.025;
                    top: 50%; left: 50%; transform: translate(-50%, -50%);
                    pointer-events: none; white-space: nowrap;
                    letter-spacing: 0.05em;
                }
                .fl-panel-content { position: relative; z-index: 2; }
                .fl-panel-tag {
                    font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase;
                    color: #FF5E00; margin-bottom: 1.2rem; font-weight: 600;
                }
                .fl-panel-title {
                    font-family: 'Oswald', sans-serif;
                    font-size: clamp(2.2rem, 3.5vw, 3.2rem);
                    color: #fff; line-height: 1.05; text-transform: uppercase;
                    margin-bottom: 1.2rem;
                }
                .fl-panel-title .hl { color: #FF5E00; }
                .fl-panel-desc {
                    font-size: 0.85rem; color: #6B6B6B;
                    line-height: 1.8; font-weight: 300; max-width: 300px;
                    margin-bottom: 2.5rem;
                }
                .fl-panel-stats { display: flex; gap: 2.5rem; }
                .fl-stat-num {
                    font-family: 'Oswald', sans-serif;
                    font-size: 1.8rem; color: #FF5E00; font-weight: 700;
                }
                .fl-stat-label {
                    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
                    color: #6B6B6B; margin-top: 3px;
                }

                .fl-form-side {
                    display: flex; align-items: center; justify-content: center;
                    padding: 3rem 2rem; background: #0A0A0A;
                }
                .fl-form-wrap { width: 100%; max-width: 400px; }
                .fl-logo {
                    font-family: 'Oswald', sans-serif;
                    font-size: 1.4rem; letter-spacing: 0.1em;
                    color: #fff; text-decoration: none;
                    display: block; margin-bottom: 2.5rem;
                }
                .fl-form-eyebrow {
                    font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase;
                    color: #FF5E00; margin-bottom: 0.8rem; font-weight: 600;
                }
                .fl-form-title {
                    font-family: 'Oswald', sans-serif;
                    font-size: 2.2rem; color: #fff;
                    line-height: 1.05; text-transform: uppercase;
                    margin-bottom: 0.6rem;
                }
                .fl-form-title .hl { color: #FF5E00; }
                .fl-form-sub {
                    font-size: 0.82rem; color: #6B6B6B; font-weight: 300;
                    margin-bottom: 2.5rem; line-height: 1.65;
                }
                .fl-form-sub a {
                    color: #FF5E00; font-weight: 500;
                    text-decoration: none; border-bottom: 1px solid rgba(255,94,0,0.3);
                    padding-bottom: 1px; transition: all 0.2s;
                }
                .fl-form-sub a:hover { color: #FF7A2E; border-color: #FF7A2E; }
                .fl-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 2rem; }
                .fl-field { margin-bottom: 1.4rem; }
                .fl-label {
                    display: block; font-size: 0.65rem; letter-spacing: 0.2em;
                    text-transform: uppercase; color: #B8B8B8;
                    margin-bottom: 0.55rem; font-weight: 500;
                }
                .fl-input {
                    width: 100%; padding: 0.85rem 1.1rem;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    font-family: 'Inter', sans-serif;
                    font-size: 0.9rem; color: #D4D4D4;
                    outline: none; transition: all 0.2s;
                    box-sizing: border-box;
                }
                .fl-input::placeholder { color: #6B6B6B; font-weight: 300; }
                .fl-input:focus { border-color: #FF5E00; box-shadow: 0 0 0 3px rgba(255,94,0,0.1); }
                .fl-forgot {
                    display: block; text-align: right;
                    font-size: 0.7rem; letter-spacing: 0.1em;
                    color: #6B6B6B; text-decoration: none;
                    margin-top: -0.8rem; margin-bottom: 1.8rem;
                    transition: color 0.2s;
                }
                .fl-forgot:hover { color: #FF5E00; }
                .fl-submit {
                    width: 100%; padding: 1rem;
                    background: #FF5E00; color: #0A0A0A;
                    border: none; cursor: pointer;
                    font-family: 'Oswald', sans-serif;
                    font-size: 0.78rem; letter-spacing: 0.2em; text-transform: uppercase;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .fl-submit:hover:not(:disabled) { background: #FF7A2E; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(255,94,0,0.3); }
                .fl-submit:disabled { opacity: 0.5; cursor: not-allowed; }
                .fl-footer-note {
                    margin-top: 1.8rem; text-align: center;
                    font-size: 0.72rem; color: #6B6B6B; line-height: 1.6;
                }
                .fl-footer-note a {
                    color: #B8B8B8; text-decoration: none;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 1px; transition: color 0.2s;
                }
                .fl-footer-note a:hover { color: #FF5E00; }
                .fl-trust-row { display: flex; gap: 1.2rem; margin-top: 2.2rem; }
                .fl-trust-badge {
                    flex: 1; display: flex; align-items: center; gap: 0.5rem;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
                    padding: 0.65rem 0.8rem;
                }
                .fl-trust-badge svg { flex-shrink: 0; color: #FF5E00; }
                .fl-trust-badge span { font-size: 0.65rem; color: #6B6B6B; letter-spacing: 0.06em; line-height: 1.4; }

                @media (max-width: 768px) {
                    .fl-root { grid-template-columns: 1fr; }
                    .fl-panel { display: none; }
                }
            `}</style>

            <div className="fl-root">
                <div className="fl-panel">
                    <div className="fl-panel-bg" />
                    <div className="fl-panel-circle c1" />
                    <div className="fl-panel-circle c2" />
                    <div className="fl-panel-circle c3" />
                    <div className="fl-panel-decor">InsightCart</div>
                    <div className="fl-panel-content">
                        <div className="fl-panel-tag">Espace membre</div>
                        <h2 className="fl-panel-title">
                            Votre espace<br /><span className="hl">personnel</span><br />vous attend.
                        </h2>
                        <p className="fl-panel-desc">
                            Accédez à vos commandes, suivez vos livraisons et profitez d'offres exclusives réservées aux membres.
                        </p>
                        <div className="fl-panel-stats">
                            <div>
                                <div className="fl-stat-num">14k+</div>
                                <div className="fl-stat-label">Produits</div>
                            </div>
                            <div>
                                <div className="fl-stat-num">98%</div>
                                <div className="fl-stat-label">Satisfaction</div>
                            </div>
                            <div>
                                <div className="fl-stat-num">60+</div>
                                <div className="fl-stat-label">Pays livrés</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fl-form-side">
                    <div className="fl-form-wrap">
                        <Link to="/" className="fl-logo">InsightCart</Link>
                        <p className="fl-form-eyebrow">Connexion</p>
                        <h1 className="fl-form-title">
                            Bon retour<br /><span className="hl">parmi nous.</span>
                        </h1>
                        <p className="fl-form-sub">
                            Pas encore de compte ?{' '}
                            <Link to="/register">Créez-en un gratuitement</Link>
                        </p>
                        <div className="fl-divider" />
                        <form onSubmit={handleSubmit}>
                            <div className="fl-field">
                                <label className="fl-label">Adresse Email</label>
                                <input type="email" name="email" placeholder="votre@email.com" onChange={handleChange} required className="fl-input" />
                            </div>
                            <div className="fl-field">
                                <label className="fl-label">Mot de passe</label>
                                <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required className="fl-input" />
                            </div>
                            <a href="#" className="fl-forgot">Mot de passe oublié ?</a>
                            <button type="submit" disabled={loading} className="fl-submit">
                                {loading ? 'Connexion en cours…' : 'Se connecter'}
                            </button>
                        </form>
                        <p className="fl-footer-note">
                            En vous connectant, vous acceptez nos{' '}
                            <a href="#">conditions d'utilisation</a> et notre{' '}
                            <a href="#">politique de confidentialité</a>.
                        </p>
                        <div className="fl-trust-row">
                            <div className="fl-trust-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <span>Connexion sécurisée SSL</span>
                            </div>
                            <div className="fl-trust-badge">
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
