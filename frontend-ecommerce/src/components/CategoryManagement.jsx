import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Nouveaux états pour la recherche et les filtres
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch { toast.error('Erreur de chargement'); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading(editingId ? 'Mise à jour…' : 'Ajout en cours…');
        try {
            if (editingId) {
                await api.put(`/categories/${editingId}`, formData);
                toast.success('Catégorie modifiée', { id: loadingToast });
            } else {
                await api.post('/categories', formData);
                toast.success('Catégorie ajoutée', { id: loadingToast });
            }
            setFormData({ name: '', description: '' });
            setEditingId(null);
            fetchCategories();
        } catch { toast.error("Erreur lors de l'enregistrement", { id: loadingToast }); }
    };

    const handleEdit = (cat) => {
        setEditingId(cat.id);
        setFormData({ name: cat.name, description: cat.description || '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ name: '', description: '' });
    };

    // Nouvelle fonction de Désactivation/Activation
    const handleToggleStatus = async (cat) => {
        const currentStatus = cat.active !== undefined ? cat.active : cat.isActive;
        const newStatus = !currentStatus;
        const action = newStatus ? 'activer' : 'désactiver';

        const result = await Swal.fire({
            title: 'Confirmation',
            text: `Voulez-vous vraiment ${action} la catégorie "${cat.name}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: newStatus ? '#3B6D11' : '#A32D2D',
            cancelButtonColor: '#6B5B4E',
            confirmButtonText: `Oui, ${action}`,
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            const loadingToast = toast.loading('Mise à jour du statut...');
            try {
                await api.put(`/categories/${cat.id}/toggle-status`);
                toast.success(`Catégorie ${newStatus ? 'activée' : 'désactivée'}`, { id: loadingToast });
                fetchCategories();
            } catch { toast.error('Erreur lors de la modification', { id: loadingToast }); }
        }
    };

    // Filtrage des données
    const filteredCategories = categories.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const status = c.active !== undefined ? c.active : c.isActive;
        const matchesStatus = filterStatus === 'all' ? true : filterStatus === 'active' ? status === true : status === false;
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <style>{styles}</style>
            <div className="vcm-root">

                {/* HEADER */}
                <header className="vcm-header">
                    <div>
                        <div className="vcm-eyebrow">Administration</div>
                        <h1 className="vcm-title">Gestion des <em>Catégories</em></h1>
                    </div>
                    <div className="vcm-count-badge">
                        <span className="vcm-count-num">{categories.length}</span>
                        <span className="vcm-count-label">catégorie{categories.length !== 1 ? 's' : ''}</span>
                    </div>
                </header>
                <div className="vcm-divider" />

                {/* FORM */}
                <div className="vcm-panel vcm-form-panel">
                    <div className="vcm-panel-title">
                        <span className={`vcm-panel-dot${editingId ? ' editing' : ''}`} />
                        {editingId ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="vcm-form-row">
                            <div className="vcm-field">
                                <label className="vcm-label">Nom de la catégorie</label>
                                <input type="text" placeholder="Ex: Maroquinerie" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="vcm-input" />
                            </div>
                            <div className="vcm-field">
                                <label className="vcm-label">Description <span className="vcm-optional">(optionnelle)</span></label>
                                <input type="text" placeholder="Brève description..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="vcm-input" />
                            </div>
                        </div>
                        <div className="vcm-form-footer">
                            <button type="submit" className="vcm-btn-primary">
                                {editingId ? 'Mettre à jour' : 'Ajouter la catégorie'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancel} className="vcm-btn-ghost">Annuler</button>
                            )}
                        </div>
                    </form>
                </div>

                {/* NOUVEAU : FILTERS */}
                <div className="vcm-filters">
                    <div className="vcm-search-wrap">
                        <svg className="vcm-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input type="text" placeholder="Rechercher une catégorie…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="vcm-search-input" />
                    </div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="vcm-filter-select">
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actives uniquement</option>
                        <option value="inactive">Inactives uniquement</option>
                    </select>
                </div>

                {/* TABLE */}
                <div className="vcm-panel vcm-table-panel">
                    <div className="vcm-table-scroll">
                        <table className="vcm-table">
                            <thead>
                            <tr>
                                <th className="vcm-th" style={{ width: 50 }}>#</th>
                                <th className="vcm-th">Nom</th>
                                <th className="vcm-th">Description</th>
                                <th className="vcm-th">Statut</th>
                                <th className="vcm-th vcm-th-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i} className="vcm-tr">
                                        <td className="vcm-td"><div className="vcm-skel" style={{ width: 20 }} /></td>
                                        <td className="vcm-td"><div className="vcm-skel" style={{ width: 120 }} /></td>
                                        <td className="vcm-td"><div className="vcm-skel" style={{ width: 150 }} /></td>
                                        <td className="vcm-td"><div className="vcm-skel" style={{ width: 60 }} /></td>
                                        <td className="vcm-td vcm-td-right"><div className="vcm-skel" style={{ width: 100, marginLeft: 'auto' }} /></td>
                                    </tr>
                                ))
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="vcm-empty-row">Aucune catégorie trouvée.</td>
                                </tr>
                            ) : filteredCategories.map((cat, idx) => {
                                const isActive = cat.active !== undefined ? cat.active : cat.isActive;
                                return (
                                <tr key={cat.id} className={`vcm-tr${!isActive ? ' inactive' : ''}${editingId === cat.id ? ' editing' : ''}`}>
                                    <td className="vcm-td"><span className="vcm-index">{String(idx + 1).padStart(2, '0')}</span></td>
                                    <td className="vcm-td">
                                        <div className="vcm-cat-name-cell">
                                            <div className="vcm-cat-dot" />
                                            <span className="vcm-cat-name">{cat.name}</span>
                                        </div>
                                    </td>
                                    <td className="vcm-td">
                                        <span className="vcm-cat-desc">{cat.description || '—'}</span>
                                    </td>
                                    <td className="vcm-td">
                                        <span className={`vcm-status-badge${isActive ? ' active' : ' inactive'}`}>
                                            <span className="vcm-status-dot" />
                                            {isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="vcm-td vcm-td-right">
                                        <button onClick={() => handleEdit(cat)} className="vcm-action-btn edit">Modifier</button>
                                        <button onClick={() => handleToggleStatus(cat)} className={`vcm-action-btn${isActive ? ' deactivate' : ' activate'}`}>
                                            {isActive ? 'Désactiver' : 'Activer'}
                                        </button>
                                    </td>
                                </tr>
                            )})}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    );
}

const styles = `
    /* (Mêmes styles de base que précédemment) */
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    :root { --cream:#F5F0E8; --sand:#E8DDD0; --bark:#B8A898; --earth:#6B5B4E; --charcoal:#2A2420; --black:#0F0D0C; --accent:#C8472A; --gold:#C9A96E; --white:#FDFAF7; }
    .vcm-root { max-width: 950px; font-family: 'DM Sans', sans-serif; }
    .vcm-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; }
    .vcm-eyebrow { font-size: 0.65rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
    .vcm-title { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--black); line-height: 1.15; }
    .vcm-title em { font-style: italic; color: var(--earth); }
    .vcm-count-badge { display: flex; flex-direction: column; align-items: flex-end; }
    .vcm-count-num { font-family: 'Playfair Display', serif; font-size: 1.7rem; font-weight: 700; color: var(--black); line-height: 1; }
    .vcm-count-label { font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--bark); margin-top: 3px; }
    .vcm-divider { height: 1px; background: var(--sand); margin-bottom: 2rem; }
    .vcm-panel { background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 3px; margin-bottom: 1.5rem; }
    .vcm-form-panel { padding: 1.8rem; }
    .vcm-table-panel { padding: 0; overflow: hidden; }
    .vcm-panel-title { display: flex; align-items: center; gap: 0.6rem; font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--earth); font-weight: 500; margin-bottom: 1.6rem; }
    .vcm-panel-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
    .vcm-panel-dot.editing { background: var(--accent); }
    .vcm-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem; }
    .vcm-field { display: flex; flex-direction: column; }
    .vcm-label { font-size: 0.66rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--earth); margin-bottom: 0.5rem; font-weight: 500; }
    .vcm-optional { font-size: 0.62rem; color: var(--bark); text-transform: none; letter-spacing: 0; font-weight: 300; }
    .vcm-input { width: 100%; padding: 0.78rem 1rem; background: var(--cream); border: 1px solid var(--sand); border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: var(--black); outline: none; box-sizing: border-box; }
    .vcm-input:focus { border-color: var(--earth); background: var(--white); }
    .vcm-form-footer { display: flex; gap: 0.8rem; padding-top: 1.2rem; border-top: 1px solid var(--sand); }
    .vcm-btn-primary { padding: 0.78rem 1.8rem; background: var(--charcoal); color: var(--white); border: none; border-radius: 2px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.76rem; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 500; }
    .vcm-btn-ghost { padding: 0.78rem 1.4rem; background: transparent; color: var(--earth); border: 1px solid var(--bark); border-radius: 2px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.76rem; letter-spacing: 0.14em; text-transform: uppercase; }

    /* FILTERS (Nouveau) */
    .vcm-filters { display: flex; gap: 0.8rem; align-items: center; margin-bottom: 1.2rem; }
    .vcm-search-wrap { flex: 1; position: relative; display: flex; align-items: center; }
    .vcm-search-icon { position: absolute; left: 12px; color: var(--bark); }
    .vcm-search-input { width: 100%; padding: 0.72rem 1rem 0.72rem 2.2rem; background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; outline: none; }
    .vcm-filter-select { padding: 0.72rem 2rem 0.72rem 0.9rem; background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: var(--earth); outline: none; appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%236B5B4E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; }

    /* TABLE */
    .vcm-table-scroll { overflow-x: auto; }
    .vcm-table { width: 100%; border-collapse: collapse; }
    .vcm-th { padding: 1rem 1.2rem; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bark); font-weight: 500; text-align: left; border-bottom: 1px solid rgba(184,168,152,0.2); background: var(--cream); white-space: nowrap; }
    .vcm-th-right { text-align: right; }
    .vcm-tr { border-bottom: 1px solid rgba(184,168,152,0.1); transition: background 0.15s; }
    .vcm-tr:hover { background: rgba(245,240,232,0.5); }
    .vcm-tr.editing { background: rgba(201,169,110,0.07); border-left: 2px solid var(--gold); }
    .vcm-tr.inactive { opacity: 0.6; }
    .vcm-td { padding: 1rem 1.2rem; vertical-align: middle; }
    .vcm-td-right { text-align: right; }
    .vcm-index { font-size: 0.7rem; color: var(--bark); font-weight: 300; letter-spacing: 0.06em; }
    .vcm-cat-name-cell { display: flex; align-items: center; gap: 0.65rem; }
    .vcm-cat-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
    .vcm-cat-name { font-size: 0.88rem; color: var(--black); font-weight: 500; }
    .vcm-cat-desc { font-size: 0.82rem; color: var(--earth); font-weight: 300; }

    /* BADGES & BOUTONS (Nouveau) */
    .vcm-status-badge { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase; padding: 0.28rem 0.65rem; border-radius: 2px; font-weight: 500; }
    .vcm-status-badge.active { background: #EAF3DE; color: #3B6D11; }
    .vcm-status-badge.inactive { background: #FCEBEB; color: #A32D2D; }
    .vcm-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .vcm-action-btn { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.35rem 0.85rem; border-radius: 2px; border: 1px solid; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; margin-left: 6px; }
    .vcm-action-btn.edit { background: var(--cream); color: var(--earth); border-color: var(--sand); }
    .vcm-action-btn.deactivate { background: #FCEBEB; color: #A32D2D; border-color: rgba(163,45,45,0.2); }
    .vcm-action-btn.activate { background: #EAF3DE; color: #3B6D11; border-color: rgba(59,109,17,0.2); }

    .vcm-empty-row { text-align: center; padding: 3rem; color: var(--bark); }
`;