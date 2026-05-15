import { useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminProfile() {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ username: user?.username || '', email: user?.email || '', city: user?.city || '', state: user?.state || '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        if (user) setFormData({ username: user.username || '', email: user.email || '', city: user.city || '', state: user.state || '' });
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try { const response = await api.put('/users/me', formData); setUser(response.data); toast.success('Profil mis à jour'); }
        catch (error) { toast.error(error.response?.data || 'Erreur'); }
        finally { setLoading(false); }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error('Les mots de passe ne correspondent pas'); return; }
        if (passwordData.newPassword.length < 6) { toast.error('Le mot de passe doit contenir au moins 6 caractères'); return; }
        setLoading(true);
        try { await api.put('/users/me', { newPassword: passwordData.newPassword, currentPassword: passwordData.currentPassword }); toast.success('Mot de passe modifié'); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
        catch (error) { toast.error(error.response?.data || 'Erreur'); }
        finally { setLoading(false); }
    };

    return (
        <>
            <style>{`
                .fap-root { font-family: 'Inter', sans-serif; }
                .fap-title { font-family: 'Oswald', sans-serif; font-size: 1.8rem; color: #fff; text-transform: uppercase; margin-bottom: 0.5rem; }
                .fap-title .hl { color: #FF5E00; }
                .fap-subtitle { font-size: 0.8rem; color: #6B6B6B; margin-bottom: 2rem; }
                .fap-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); padding: 1.5rem; margin-bottom: 1.5rem; }
                .fap-card-title { font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase; color: #B8B8B8; margin-bottom: 1.2rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.06); font-weight: 500; }
                .fap-info { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.03); margin-bottom: 1.5rem; }
                .fap-avatar { width: 56px; height: 56px; border-radius: 50%; background: rgba(255,94,0,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: #FF5E00; font-weight: 600; font-family: 'Oswald', sans-serif; flex-shrink: 0; }
                .fap-info-name { font-size: 1rem; font-weight: 500; color: #fff; }
                .fap-info-email { font-size: 0.78rem; color: #6B6B6B; }
                .fap-role { display: inline-block; padding: 0.2rem 0.5rem; background: rgba(255,94,0,0.15); color: #FF5E00; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 0.25rem; }
                .fap-form-group { margin-bottom: 1.25rem; }
                .fap-label { display: block; font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; color: #B8B8B8; margin-bottom: 0.5rem; }
                .fap-input { width: 100%; padding: 0.7rem 1rem; border: 1px solid rgba(255,255,255,0.08); font-size: 0.85rem; background: rgba(255,255,255,0.04); color: #D4D4D4; font-family: 'Inter', sans-serif; transition: border-color 0.2s; box-sizing: border-box; }
                .fap-input:focus { outline: none; border-color: #FF5E00; }
                .fap-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .fap-btn { padding: 0.7rem 1.5rem; background: #FF5E00; color: #0A0A0A; border: none; font-family: 'Oswald', sans-serif; font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; cursor: pointer; transition: background 0.2s; }
                .fap-btn:hover { background: #FF7A2E; }
                .fap-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                @media (max-width: 600px) { .fap-row { grid-template-columns: 1fr; } }
            `}</style>
            <div className="fap-root">
                <h1 className="fap-title">Mon <span className="hl">Profil</span></h1>
                <p className="fap-subtitle">Gérez vos informations personnelles</p>
                <div className="fap-card">
                    <div className="fap-card-title">Informations du compte</div>
                    <div className="fap-info">
                        <div className="fap-avatar">{formData.username?.charAt(0).toUpperCase() || 'A'}</div>
                        <div>
                            <div className="fap-info-name">{user?.username || 'Admin'}</div>
                            <div className="fap-info-email">{user?.email || ''}</div>
                            <span className="fap-role">{user?.roles?.[0]?.name || 'ADMIN'}</span>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="fap-row">
                            <div className="fap-form-group"><label className="fap-label">Nom</label><input type="text" name="username" value={formData.username} onChange={handleChange} className="fap-input" /></div>
                            <div className="fap-form-group"><label className="fap-label">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="fap-input" /></div>
                        </div>
                        <div className="fap-row">
                            <div className="fap-form-group"><label className="fap-label">Ville</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="fap-input" /></div>
                            <div className="fap-form-group"><label className="fap-label">Région</label><input type="text" name="state" value={formData.state} onChange={handleChange} className="fap-input" /></div>
                        </div>
                        <button type="submit" className="fap-btn" disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
                    </form>
                </div>
                <div className="fap-card">
                    <div className="fap-card-title">Changer le mot de passe</div>
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="fap-form-group"><label className="fap-label">Mot de passe actuel</label><input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="fap-input" /></div>
                        <div className="fap-row">
                            <div className="fap-form-group"><label className="fap-label">Nouveau mot de passe</label><input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="fap-input" /></div>
                            <div className="fap-form-group"><label className="fap-label">Confirmer</label><input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="fap-input" /></div>
                        </div>
                        <button type="submit" className="fap-btn" disabled={loading}>{loading ? 'Modification...' : 'Changer le mot de passe'}</button>
                    </form>
                </div>
            </div>
        </>
    );
}
