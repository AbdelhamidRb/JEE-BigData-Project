import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
    const { user, login } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', city: '', state: '', currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/me');
            const data = response.data;
            setFormData(prev => ({ ...prev, username: data.username || '', email: data.email || '', city: data.city || '', state: data.state || '' }));
        } catch { toast.error('Erreur lors du chargement du profil'); }
        finally { setLoading(false); }
    };

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) { toast.error('Les mots de passe ne correspondent pas'); return; }
        setSaving(true);
        try {
            const request = { username: formData.username, email: formData.email, city: formData.city, state: formData.state, currentPassword: formData.currentPassword || null, newPassword: formData.newPassword || null };
            await api.put('/users/me', request);
            if (formData.newPassword) { toast.success('Mot de passe mis à jour !'); } 
            else { toast.success('Profil mis à jour'); login({ ...user, username: formData.username, email: formData.email }); }
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (error) { toast.error(error.response?.data || 'Erreur lors de la mise à jour'); }
        finally { setSaving(false); }
    };

    if (loading) {
        return (
            <>
                <style>{baseStyles}</style>
                <div className="fp-loading"><div className="fp-loading-spinner" /><p>Chargement du profil...</p></div>
            </>
        );
    }

    return (
        <>
            <style>{baseStyles}</style>
            <div className="fp-root">
                <div className="fp-header">
                    <h1 className="fp-title">Mon <span className="hl">Profil</span></h1>
                    <p className="fp-subtitle">Gérez vos informations personnelles</p>
                </div>
                <div className="fp-divider" />
                <form onSubmit={handleSubmit} className="fp-form">
                    <div className="fp-section">
                        <h2 className="fp-section-title">Informations du compte</h2>
                        <div className="fp-field">
                            <label className="fp-label">Nom d'utilisateur</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} className="fp-input" />
                        </div>
                        <div className="fp-field">
                            <label className="fp-label">Adresse email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="fp-input" />
                        </div>
                    </div>
                    <div className="fp-section">
                        <h2 className="fp-section-title">Adresse</h2>
                        <div className="fp-field"><label className="fp-label">Ville</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="fp-input" placeholder="Paris" /></div>
                        <div className="fp-field"><label className="fp-label">Adresse (État/Pays)</label><input type="text" name="state" value={formData.state} onChange={handleChange} className="fp-input" placeholder="France" /></div>
                    </div>
                    <div className="fp-section">
                        <h2 className="fp-section-title">Changer le mot de passe</h2>
                        <p className="fp-hint">Laissez vide pour garder votre mot de passe actuel</p>
                        <div className="fp-field"><label className="fp-label">Mot de passe actuel</label><input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className="fp-input" /></div>
                        <div className="fp-field-row">
                            <div className="fp-field"><label className="fp-label">Nouveau mot de passe</label><input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="fp-input" /></div>
                            <div className="fp-field"><label className="fp-label">Confirmer</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="fp-input" /></div>
                        </div>
                    </div>
                    <div className="fp-actions">
                        <button type="submit" className="fp-save-btn" disabled={saving}>
                            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

const baseStyles = `
    .fp-root { max-width: 640px; margin: 0 auto; padding: 2.5rem 1.5rem 4rem; font-family: 'Inter', sans-serif; }
    .fp-header { margin-bottom: 1.5rem; }
    .fp-title { font-family: 'Oswald', sans-serif; font-size: 2.2rem; color: #fff; line-height: 1.05; margin-bottom: 0.35rem; text-transform: uppercase; }
    .fp-title .hl { color: #FF5E00; }
    .fp-subtitle { font-size: 0.85rem; color: #6B6B6B; font-weight: 300; }
    .fp-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 2rem; }
    .fp-form { display: flex; flex-direction: column; gap: 2rem; }
    .fp-section { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); padding: 1.5rem; }
    .fp-section-title { font-family: 'Oswald', sans-serif; font-size: 1.05rem; color: #fff; margin-bottom: 1.25rem; text-transform: uppercase; }
    .fp-hint { font-size: 0.78rem; color: #6B6B6B; margin-bottom: 1rem; margin-top: -0.75rem; }
    .fp-field { margin-bottom: 1rem; }
    .fp-field:last-child { margin-bottom: 0; }
    .fp-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .fp-label { display: block; font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; color: #B8B8B8; margin-bottom: 0.5rem; font-weight: 500; }
    .fp-input { width: 100%; padding: 0.75rem 1rem; border: 1px solid rgba(255,255,255,0.08); font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #D4D4D4; background: rgba(255,255,255,0.04); transition: border-color 0.2s; box-sizing: border-box; }
    .fp-input:focus { outline: none; border-color: #FF5E00; }
    .fp-input::placeholder { color: #6B6B6B; }
    .fp-actions { display: flex; justify-content: flex-end; }
    .fp-save-btn { padding: 0.85rem 2rem; background: #FF5E00; color: #0A0A0A; border: none; cursor: pointer; font-family: 'Oswald', sans-serif; font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; transition: all 0.2s; }
    .fp-save-btn:hover:not(:disabled) { background: #FF7A2E; }
    .fp-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .fp-loading { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; background: #0A0A0A; }
    .fp-loading-spinner { width: 36px; height: 36px; border: 3px solid rgba(255,255,255,0.06); border-top-color: #FF5E00; border-radius: 50%; animation: fp-spin 0.9s linear infinite; margin-bottom: 1rem; }
    @keyframes fp-spin { to { transform: rotate(360deg); } }
    .fp-loading p { font-size: 0.78rem; color: #6B6B6B; letter-spacing: 0.1em; }
    @media (max-width: 480px) { .fp-field-row { grid-template-columns: 1fr; } }
`;
