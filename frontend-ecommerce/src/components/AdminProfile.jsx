import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminProfile() {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        city: user?.city || '',
        state: user?.state || '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                city: user.city || '',
                state: user.state || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.put('/users/me', formData);
            setUser(response.data);
            toast.success('Profil mis à jour avec succès');
        } catch (error) {
            toast.error(error.response?.data || 'Erreur lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }
        setLoading(true);
        try {
            await api.put('/users/me', {
                newPassword: passwordData.newPassword,
                currentPassword: passwordData.currentPassword,
            });
            toast.success('Mot de passe modifié avec succès');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data || 'Erreur lors du changement de mot de passe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                .vap-root {
                    max-width: 800px;
                    font-family: 'DM Sans', sans-serif;
                }
                .vap-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.8rem;
                    color: #2A2420;
                    margin-bottom: 0.5rem;
                }
                .vap-subtitle {
                    font-size: 0.8rem;
                    color: #B8A898;
                    margin-bottom: 2rem;
                }
                .vap-card {
                    background: #FDFAF7;
                    border: 1px solid rgba(184,168,152,0.28);
                    border-radius: 4px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                }
                .vap-card-title {
                    font-size: 0.7rem;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: #6B5B4E;
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid rgba(184,168,152,0.2);
                }
                .vap-form-group {
                    margin-bottom: 1.25rem;
                }
                .vap-label {
                    display: block;
                    font-size: 0.7rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #6B5B4E;
                    margin-bottom: 0.5rem;
                }
                .vap-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #E8DDD0;
                    border-radius: 2px;
                    font-size: 0.9rem;
                    background: #F5F0E8;
                    transition: border-color 0.2s;
                }
                .vap-input:focus {
                    outline: none;
                    border-color: #C9A96E;
                }
                .vap-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .vap-btn {
                    padding: 0.75rem 1.5rem;
                    background: #2A2420;
                    color: white;
                    border: none;
                    border-radius: 2px;
                    font-size: 0.72rem;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .vap-btn:hover {
                    background: #0F0D0C;
                }
                .vap-btn:disabled {
                    background: #B8A898;
                    cursor: not-allowed;
                }
                .vap-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #F5F0E8;
                    border-radius: 2px;
                    margin-bottom: 1.5rem;
                }
                .vap-avatar {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: #C9A96E;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    color: white;
                    font-weight: 500;
                }
                .vap-info-text {
                    flex: 1;
                }
                .vap-info-name {
                    font-size: 1.1rem;
                    font-weight: 500;
                    color: #2A2420;
                }
                .vap-info-email {
                    font-size: 0.8rem;
                    color: #6B5B4E;
                }
                .vap-role {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    background: #C9A96E;
                    color: white;
                    font-size: 0.6rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    border-radius: 2px;
                    margin-top: 0.25rem;
                }
            `}</style>
            <div className="vap-root">
                <h1 className="vap-title">Mon Profil</h1>
                <p className="vap-subtitle">Gérez vos informations personnelles</p>

                <div className="vap-card">
                    <h2 className="vap-card-title">Informations du compte</h2>
                    
                    <div className="vap-info">
                        <div className="vap-avatar">
                            {formData.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="vap-info-text">
                            <div className="vap-info-name">{user?.username || 'Admin'}</div>
                            <div className="vap-info-email">{user?.email || ''}</div>
                            <span className="vap-role">{user?.roles?.[0]?.name || 'ADMIN'}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="vap-row">
                            <div className="vap-form-group">
                                <label className="vap-label">Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="vap-input"
                                />
                            </div>
                            <div className="vap-form-group">
                                <label className="vap-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="vap-input"
                                />
                            </div>
                        </div>
                        <div className="vap-row">
                            <div className="vap-form-group">
                                <label className="vap-label">Ville</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="vap-input"
                                />
                            </div>
                            <div className="vap-form-group">
                                <label className="vap-label">État / Région</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="vap-input"
                                />
                            </div>
                        </div>
                        <button type="submit" className="vap-btn" disabled={loading}>
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </form>
                </div>

                <div className="vap-card">
                    <h2 className="vap-card-title">Changer le mot de passe</h2>
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="vap-form-group">
                            <label className="vap-label">Mot de passe actuel</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="vap-input"
                            />
                        </div>
                        <div className="vap-row">
                            <div className="vap-form-group">
                                <label className="vap-label">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="vap-input"
                                />
                            </div>
                            <div className="vap-form-group">
                                <label className="vap-label">Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="vap-input"
                                />
                            </div>
                        </div>
                        <button type="submit" className="vap-btn" disabled={loading}>
                            {loading ? 'Modification...' : 'Changer le mot de passe'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}