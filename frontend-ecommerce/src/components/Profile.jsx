import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
    const { user, login } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        city: '',
        state: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/me');
            const data = response.data;
            setFormData(prev => ({
                ...prev,
                username: data.username || '',
                email: data.email || '',
                city: data.city || '',
                state: data.state || ''
            }));
        } catch {
            toast.error('Erreur lors du chargement du profil');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }

        setSaving(true);
        try {
            const request = {
                username: formData.username,
                email: formData.email,
                city: formData.city,
                state: formData.state,
                currentPassword: formData.currentPassword || null,
                newPassword: formData.newPassword || null
            };

            const response = await api.put('/users/me', request);

            if (formData.newPassword) {
                toast.success('Mot de passe mis à jour ! Veuillez vous reconnecter');
            } else {
                toast.success('Profil mis à jour avec succès');
                login({ ...user, username: formData.username, email: formData.email });
            }

            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            toast.error(error.response?.data || 'Erreur lors de la mise à jour');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <style>{baseStyles}</style>
                <div className="vp-loading">
                    <div className="vp-loading-spinner" />
                    <p>Chargement du profil...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <style>{baseStyles}</style>
            <div className="vp-root">
                <div className="vp-header">
                    <h1 className="vp-title">Mon <em>Profil</em></h1>
                    <p className="vp-subtitle">Gérez vos informations personnelles</p>
                </div>

                <div className="vp-divider" />

                <form onSubmit={handleSubmit} className="vp-form">
                    <div className="vp-section">
                        <h2 className="vp-section-title">Informations du compte</h2>

                        <div className="vp-field">
                            <label className="vp-label">Nom d'utilisateur</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="vp-input"
                            />
                        </div>

                        <div className="vp-field">
                            <label className="vp-label">Adresse email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="vp-input"
                            />
                        </div>
                    </div>

                    <div className="vp-section">
                        <h2 className="vp-section-title">Adresse</h2>

                        <div className="vp-field">
                            <label className="vp-label">Ville</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="vp-input"
                                placeholder="Paris"
                            />
                        </div>

                        <div className="vp-field">
                            <label className="vp-label">Adresse (État/Pays)</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="vp-input"
                                placeholder="France"
                            />
                        </div>
                    </div>

                    <div className="vp-section">
                        <h2 className="vp-section-title">Changer le mot de passe</h2>
                        <p className="vp-hint">Laissez vide pour garder votre mot de passe actuel</p>

                        <div className="vp-field">
                            <label className="vp-label">Mot de passe actuel</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="vp-input"
                            />
                        </div>

                        <div className="vp-field-row">
                            <div className="vp-field">
                                <label className="vp-label">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="vp-input"
                                />
                            </div>

                            <div className="vp-field">
                                <label className="vp-label">Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="vp-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="vp-actions">
                        <button type="submit" className="vp-save-btn" disabled={saving}>
                            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                    </div>
                </form>
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

    .vp-root {
        max-width: 640px;
        margin: 0 auto;
        padding: 2.5rem 1.5rem 4rem;
        font-family: 'DM Sans', sans-serif;
    }

    .vp-header { margin-bottom: 1.5rem; }
    .vp-title {
        font-family: 'Playfair Display', serif;
        font-size: 2.2rem;
        color: var(--black);
        line-height: 1.15;
        margin-bottom: 0.35rem;
    }
    .vp-title em { font-style: italic; color: var(--earth); }
    .vp-subtitle {
        font-size: 0.9rem;
        color: var(--bark);
        font-weight: 300;
    }
    .vp-divider { height: 1px; background: var(--sand); margin-bottom: 2rem; }

    .vp-form { display: flex; flex-direction: column; gap: 2rem; }

    .vp-section {
        background: var(--white);
        border: 1px solid rgba(184,168,152,0.28);
        border-radius: 4px;
        padding: 1.5rem;
    }

    .vp-section-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.1rem;
        color: var(--black);
        margin-bottom: 1.25rem;
    }

    .vp-hint {
        font-size: 0.8rem;
        color: var(--bark);
        margin-bottom: 1rem;
        margin-top: -0.75rem;
    }

    .vp-field { margin-bottom: 1rem; }
    .vp-field:last-child { margin-bottom: 0; }

    .vp-field-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .vp-label {
        display: block;
        font-size: 0.72rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--earth);
        margin-bottom: 0.5rem;
        font-weight: 500;
    }

    .vp-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid var(--sand);
        border-radius: 3px;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.95rem;
        color: var(--charcoal);
        background: var(--cream);
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    .vp-input:focus {
        outline: none;
        border-color: var(--gold);
        box-shadow: 0 0 0 3px rgba(201,169,110,0.15);
    }

    .vp-input::placeholder { color: var(--bark); opacity: 0.6; }

    .vp-actions {
        display: flex;
        justify-content: flex-end;
    }

    .vp-save-btn {
        padding: 0.85rem 2rem;
        background: var(--charcoal);
        color: var(--white);
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.8rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-weight: 500;
        transition: background 0.2s, transform 0.12s;
    }

    .vp-save-btn:hover:not(:disabled) {
        background: var(--black);
        transform: translateY(-1px);
    }

    .vp-save-btn:disabled {
        background: var(--sand);
        color: var(--bark);
        cursor: not-allowed;
    }

    .vp-loading {
        min-height: 60vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'DM Sans', sans-serif;
        background: var(--cream);
    }

    .vp-loading-spinner {
        width: 36px;
        height: 36px;
        border: 3px solid var(--sand);
        border-top-color: var(--gold);
        border-radius: 50%;
        animation: vp-spin 0.9s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes vp-spin { to { transform: rotate(360deg); } }
    .vp-loading p { font-size: 0.8rem; color: var(--bark); letter-spacing: 0.1em; }

    @media (max-width: 480px) {
        .vp-field-row { grid-template-columns: 1fr; }
    }
`;
