import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => { setLoading(true); try { setCategories((await api.get('/categories')).data); } catch { toast.error('Erreur'); } finally { setLoading(false); } };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const t = toast.loading(editingId ? 'Mise à jour...' : 'Ajout...');
        try {
            if (editingId) { await api.put(`/categories/${editingId}`, formData); toast.success('Catégorie modifiée', { id: t }); }
            else { await api.post('/categories', formData); toast.success('Catégorie ajoutée', { id: t }); }
            setFormData({ name: '', description: '' }); setEditingId(null); fetchCategories();
        } catch { toast.error('Erreur', { id: t }); }
    };

    const handleEdit = (cat) => { setEditingId(cat.id); setFormData({ name: cat.name, description: cat.description || '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const handleCancel = () => { setEditingId(null); setFormData({ name: '', description: '' }); };

    const handleToggleStatus = async (cat) => {
        const currentStatus = cat.active !== undefined ? cat.active : cat.isActive;
        const result = await Swal.fire({ title: 'Confirmation', text: `${currentStatus ? 'Désactiver' : 'Activer'} "${cat.name}" ?`, icon: 'warning', showCancelButton: true, confirmButtonColor: currentStatus ? '#E24B4A' : '#4CAF50', cancelButtonColor: '#6B6B6B', confirmButtonText: 'Oui', cancelButtonText: 'Annuler' });
        if (result.isConfirmed) { const t = toast.loading('Mise à jour...'); try { await api.put(`/categories/${cat.id}/toggle-status`); toast.success(`Catégorie ${currentStatus ? 'désactivée' : 'activée'}`, { id: t }); fetchCategories(); } catch { toast.error('Erreur', { id: t }); } }
    };

    const filtered = categories.filter(c => {
        const m = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const s = c.active !== undefined ? c.active : c.isActive;
        const fs = filterStatus === 'all' ? true : filterStatus === 'active' ? s === true : s === false;
        return m && fs;
    });

    return (
        <>
            <style>{`
                .fcm-root { font-family: 'Inter', sans-serif; }
                .fcm-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; }
                .fcm-eyebrow { font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: #FF5E00; margin-bottom: 0.5rem; font-weight: 600; }
                .fcm-title { font-family: 'Oswald', sans-serif; font-size: 2rem; color: #fff; line-height: 1.05; }
                .fcm-title .hl { color: #FF5E00; }
                .fcm-count-num { font-family: 'Oswald', sans-serif; font-size: 1.6rem; color: #FF5E00; font-weight: 600; display: block; text-align: right; }
                .fcm-count-label { font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; color: #6B6B6B; }
                .fcm-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 2rem; }
                .fcm-panel { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); margin-bottom: 1.5rem; }
                .fcm-form-panel { padding: 1.5rem; }
                .fcm-table-panel { padding: 0; overflow: hidden; }
                .fcm-panel-title { font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase; color: #B8B8B8; font-weight: 500; margin-bottom: 1.2rem; }
                .fcm-label { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: #6B6B6B; margin-bottom: 0.4rem; font-weight: 500; }
                .fcm-input { width: 100%; padding: 0.7rem 0.9rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #D4D4D4; font-family: 'Inter', sans-serif; font-size: 0.85rem; outline: none; box-sizing: border-box; }
                .fcm-input:focus { border-color: #FF5E00; }
                .fcm-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
                .fcm-form-footer { display: flex; gap: 0.8rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.06); }
                .fcm-btn-primary { padding: 0.7rem 1.5rem; background: #FF5E00; color: #0A0A0A; border: none; cursor: pointer; font-family: 'Oswald', sans-serif; font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; }
                .fcm-btn-ghost { padding: 0.7rem 1.2rem; background: transparent; color: #6B6B6B; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; font-family: 'Inter', sans-serif; font-size: 0.72rem; }
                .fcm-filters { display: flex; gap: 0.8rem; margin-bottom: 1rem; }
                .fcm-search-input { flex: 1; padding: 0.6rem 0.9rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #D4D4D4; font-family: 'Inter', sans-serif; font-size: 0.82rem; outline: none; }
                .fcm-filter-select { padding: 0.6rem 0.9rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #B8B8B8; font-family: 'Inter', sans-serif; cursor: pointer; outline: none; }
                .fcm-table-scroll { overflow-x: auto; }
                .fcm-table { width: 100%; border-collapse: collapse; }
                .fcm-th { padding: 0.8rem 1rem; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #6B6B6B; font-weight: 500; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); white-space: nowrap; }
                .fcm-th-right { text-align: right; }
                .fcm-tr { border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.15s; }
                .fcm-tr:hover { background: rgba(255,255,255,0.02); }
                .fcm-tr.inactive { opacity: 0.5; }
                .fcm-td { padding: 0.8rem 1rem; vertical-align: middle; }
                .fcm-td-right { text-align: right; }
                .fcm-cat-name { display: flex; align-items: center; gap: 0.5rem; }
                .fcm-cat-dot { width: 6px; height: 6px; border-radius: 50%; background: #FF5E00; flex-shrink: 0; }
                .fcm-cat-name-text { font-size: 0.82rem; color: #D4D4D4; font-weight: 500; }
                .fcm-cat-desc { font-size: 0.78rem; color: #6B6B6B; font-weight: 300; }
                .fcm-status-badge { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; padding: 0.25rem 0.55rem; font-weight: 500; }
                .fcm-status-badge.active { background: rgba(76,175,80,0.12); color: #4CAF50; }
                .fcm-status-badge.inactive { background: rgba(226,75,74,0.12); color: #E24B4A; }
                .fcm-status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
                .fcm-action-btn { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.3rem 0.7rem; border: 1px solid rgba(255,255,255,0.08); cursor: pointer; font-family: 'Inter', sans-serif; margin-left: 4px; background: transparent; color: #6B6B6B; transition: all 0.15s; }
                .fcm-action-btn:hover { border-color: #FF5E00; color: #FF5E00; }
                .fcm-action-btn.deactivate { border-color: rgba(226,75,74,0.2); color: #E24B4A; }
                .fcm-action-btn.activate { border-color: rgba(76,175,80,0.2); color: #4CAF50; }
                .fcm-empty-row { text-align: center; padding: 2.5rem; color: #6B6B6B; }
                @media (max-width: 600px) { .fcm-form-row { grid-template-columns: 1fr; } }
            `}</style>
            <div className="fcm-root">
                <header className="fcm-header">
                    <div><div className="fcm-eyebrow">Administration</div><h1 className="fcm-title">Gestion des <span className="hl">Catégories</span></h1></div>
                    <div><div className="fcm-count-num">{categories.length}</div><div className="fcm-count-label">catégories</div></div>
                </header>
                <div className="fcm-divider" />
                <div className="fcm-panel fcm-form-panel">
                    <div className="fcm-panel-title">{editingId ? 'Modifier' : 'Ajouter'} une catégorie</div>
                    <form onSubmit={handleSubmit}>
                        <div className="fcm-form-row">
                            <div className="fcm-field"><label className="fcm-label">Nom</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="fcm-input" /></div>
                            <div className="fcm-field"><label className="fcm-label">Description</label><input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="fcm-input" /></div>
                        </div>
                        <div className="fcm-form-footer">
                            <button type="submit" className="fcm-btn-primary">{editingId ? 'Mettre à jour' : 'Ajouter'}</button>
                            {editingId && <button type="button" onClick={handleCancel} className="fcm-btn-ghost">Annuler</button>}
                        </div>
                    </form>
                </div>
                <div className="fcm-filters">
                    <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="fcm-search-input" />
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="fcm-filter-select">
                        <option value="all">Tous</option><option value="active">Actives</option><option value="inactive">Inactives</option>
                    </select>
                </div>
                <div className="fcm-panel fcm-table-panel">
                    <div className="fcm-table-scroll">
                        <table className="fcm-table">
                            <thead><tr><th className="fcm-th" style={{width:40}}>#</th><th className="fcm-th">Nom</th><th className="fcm-th">Description</th><th className="fcm-th">Statut</th><th className="fcm-th fcm-th-right">Actions</th></tr></thead>
                            <tbody>
                                {loading ? <tr><td colSpan="5" className="fcm-empty-row">Chargement...</td></tr>
                                : filtered.length === 0 ? <tr><td colSpan="5" className="fcm-empty-row">Aucune catégorie trouvée.</td></tr>
                                : filtered.map((cat, idx) => {
                                    const isActive = cat.active !== undefined ? cat.active : cat.isActive;
                                    return <tr key={cat.id} className={`fcm-tr${!isActive ? ' inactive' : ''}`}>
                                        <td className="fcm-td" style={{color:'#6B6B6B',fontSize:'0.7rem'}}>{String(idx+1).padStart(2,'0')}</td>
                                        <td className="fcm-td"><div className="fcm-cat-name"><div className="fcm-cat-dot" /><span className="fcm-cat-name-text">{cat.name}</span></div></td>
                                        <td className="fcm-td"><span className="fcm-cat-desc">{cat.description || '—'}</span></td>
                                        <td className="fcm-td"><span className={`fcm-status-badge${isActive ? ' active' : ' inactive'}`}><span className="fcm-status-dot" />{isActive ? 'Active' : 'Inactive'}</span></td>
                                        <td className="fcm-td fcm-td-right">
                                            <button onClick={() => handleEdit(cat)} className="fcm-action-btn">Modifier</button>
                                            <button onClick={() => handleToggleStatus(cat)} className={`fcm-action-btn${isActive ? ' deactivate' : ' activate'}`}>{isActive ? 'Désactiver' : 'Activer'}</button>
                                        </td>
                                    </tr>;
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
