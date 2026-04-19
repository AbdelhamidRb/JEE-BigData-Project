import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

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

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette catégorie ?')) return;
        setDeleting(id);
        try {
            await api.delete(`/categories/${id}`);
            toast.success('Catégorie supprimée');
            fetchCategories();
        } catch { toast.error('Erreur lors de la suppression'); }
        finally { setDeleting(null); }
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
                                <input
                                    type="text"
                                    placeholder="Ex: Maroquinerie"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="vcm-input"
                                />
                            </div>
                            <div className="vcm-field">
                                <label className="vcm-label">Description <span className="vcm-optional">(optionnelle)</span></label>
                                <input
                                    type="text"
                                    placeholder="Brève description de la catégorie"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="vcm-input"
                                />
                            </div>
                        </div>
                        <div className="vcm-form-footer">
                            <button type="submit" className="vcm-btn-primary">
                                {editingId ? 'Mettre à jour' : 'Ajouter la catégorie'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancel} className="vcm-btn-ghost">
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>
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
                                <th className="vcm-th vcm-th-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i} className="vcm-tr">
                                        <td className="vcm-td"><div className="vcm-skel" style={{ width: 20 }} /></td>
                                        <td className="vcm-td"><div className="vcm-skel" style={{ width: 120 }} /></td>
                                        <td className="vcm-td"><div className="vcm-skel" style={{ width: 220 }} /></td>
                                        <td className="vcm-td vcm-td-right"><div className="vcm-skel" style={{ width: 100, marginLeft: 'auto' }} /></td>
                                    </tr>
                                ))
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="vcm-empty-row">
                                        <div className="vcm-empty-inner">
                                            <div className="vcm-empty-icon">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                                                    <line x1="8" y1="18" x2="21" y2="18"/>
                                                    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                                                </svg>
                                            </div>
                                            <span>Aucune catégorie pour le moment.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : categories.map((cat, idx) => (
                                <tr key={cat.id} className={`vcm-tr${editingId === cat.id ? ' editing' : ''}`}>
                                    <td className="vcm-td">
                                        <span className="vcm-index">{String(idx + 1).padStart(2, '0')}</span>
                                    </td>
                                    <td className="vcm-td">
                                        <div className="vcm-cat-name-cell">
                                            <div className="vcm-cat-dot" />
                                            <span className="vcm-cat-name">{cat.name}</span>
                                        </div>
                                    </td>
                                    <td className="vcm-td">
                                            <span className="vcm-cat-desc">
                                                {cat.description || <em style={{ color: 'var(--bark)', fontStyle: 'normal', opacity: 0.6 }}>—</em>}
                                            </span>
                                    </td>
                                    <td className="vcm-td vcm-td-right">
                                        <button onClick={() => handleEdit(cat)} className="vcm-action-btn edit">
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            disabled={deleting === cat.id}
                                            className="vcm-action-btn delete"
                                        >
                                            {deleting === cat.id ? '…' : 'Supprimer'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    );
}

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    :root {
        --cream:#F5F0E8; --sand:#E8DDD0; --bark:#B8A898;
        --earth:#6B5B4E; --charcoal:#2A2420; --black:#0F0D0C;
        --accent:#C8472A; --gold:#C9A96E; --white:#FDFAF7;
    }

    .vcm-root { max-width: 860px; font-family: 'DM Sans', sans-serif; }

    /* HEADER */
    .vcm-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; }
    .vcm-eyebrow { font-size: 0.65rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
    .vcm-title { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--black); line-height: 1.15; }
    .vcm-title em { font-style: italic; color: var(--earth); }
    .vcm-count-badge {
        display: flex; flex-direction: column; align-items: flex-end;
    }
    .vcm-count-num { font-family: 'Playfair Display', serif; font-size: 1.7rem; font-weight: 700; color: var(--black); line-height: 1; }
    .vcm-count-label { font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--bark); margin-top: 3px; }
    .vcm-divider { height: 1px; background: var(--sand); margin-bottom: 2rem; }

    /* PANEL */
    .vcm-panel { background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 3px; margin-bottom: 1.5rem; }
    .vcm-form-panel { padding: 1.8rem; }
    .vcm-table-panel { padding: 0; overflow: hidden; }

    .vcm-panel-title {
        display: flex; align-items: center; gap: 0.6rem;
        font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase;
        color: var(--earth); font-weight: 500; margin-bottom: 1.6rem;
    }
    .vcm-panel-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
    .vcm-panel-dot.editing { background: var(--accent); }

    /* FORM */
    .vcm-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem; }
    .vcm-field { display: flex; flex-direction: column; }
    .vcm-label {
        font-size: 0.66rem; letter-spacing: 0.18em; text-transform: uppercase;
        color: var(--earth); margin-bottom: 0.5rem; font-weight: 500;
    }
    .vcm-optional { font-size: 0.62rem; color: var(--bark); text-transform: none; letter-spacing: 0; font-weight: 300; }
    .vcm-input {
        width: 100%; padding: 0.78rem 1rem;
        background: var(--cream); border: 1px solid var(--sand); border-radius: 2px;
        font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: var(--black);
        outline: none; transition: border-color 0.18s, background 0.18s; box-sizing: border-box;
    }
    .vcm-input::placeholder { color: var(--bark); font-weight: 300; }
    .vcm-input:focus { border-color: var(--earth); background: var(--white); }

    .vcm-form-footer { display: flex; gap: 0.8rem; padding-top: 1.2rem; border-top: 1px solid var(--sand); }
    .vcm-btn-primary {
        padding: 0.78rem 1.8rem; background: var(--charcoal); color: var(--white);
        border: none; border-radius: 2px; cursor: pointer;
        font-family: 'DM Sans', sans-serif; font-size: 0.76rem;
        letter-spacing: 0.14em; text-transform: uppercase; font-weight: 500;
        transition: background 0.18s, transform 0.12s;
    }
    .vcm-btn-primary:hover { background: var(--black); transform: translateY(-1px); }
    .vcm-btn-ghost {
        padding: 0.78rem 1.4rem; background: transparent; color: var(--earth);
        border: 1px solid var(--bark); border-radius: 2px; cursor: pointer;
        font-family: 'DM Sans', sans-serif; font-size: 0.76rem;
        letter-spacing: 0.14em; text-transform: uppercase;
        transition: border-color 0.18s, color 0.18s;
    }
    .vcm-btn-ghost:hover { border-color: var(--charcoal); color: var(--black); }

    /* TABLE */
    .vcm-table-scroll { overflow-x: auto; }
    .vcm-table { width: 100%; border-collapse: collapse; }
    .vcm-th {
        padding: 1rem 1.2rem;
        font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
        color: var(--bark); font-weight: 500; text-align: left;
        border-bottom: 1px solid rgba(184,168,152,0.2);
        background: var(--cream); white-space: nowrap;
    }
    .vcm-th-right { text-align: right; }
    .vcm-tr { border-bottom: 1px solid rgba(184,168,152,0.1); transition: background 0.15s; }
    .vcm-tr:last-child { border-bottom: none; }
    .vcm-tr:hover { background: rgba(245,240,232,0.5); }
    .vcm-tr.editing { background: rgba(201,169,110,0.07); border-left: 2px solid var(--gold); }
    .vcm-td { padding: 1rem 1.2rem; vertical-align: middle; }
    .vcm-td-right { text-align: right; }

    .vcm-index { font-size: 0.7rem; color: var(--bark); font-weight: 300; letter-spacing: 0.06em; }

    .vcm-cat-name-cell { display: flex; align-items: center; gap: 0.65rem; }
    .vcm-cat-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
    .vcm-cat-name { font-size: 0.88rem; color: var(--black); font-weight: 500; }
    .vcm-cat-desc { font-size: 0.82rem; color: var(--earth); font-weight: 300; }

    .vcm-action-btn {
        font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
        padding: 0.35rem 0.85rem; border-radius: 2px; border: 1px solid;
        cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500;
        transition: background 0.15s, color 0.15s; margin-left: 6px;
    }
    .vcm-action-btn.edit { background: var(--cream); color: var(--earth); border-color: var(--sand); }
    .vcm-action-btn.edit:hover { background: var(--sand); border-color: var(--bark); color: var(--black); }
    .vcm-action-btn.delete { background: #FCEBEB; color: #A32D2D; border-color: rgba(163,45,45,0.2); }
    .vcm-action-btn.delete:hover:not(:disabled) { background: #A32D2D; color: white; border-color: #A32D2D; }
    .vcm-action-btn.delete:disabled { opacity: 0.5; cursor: not-allowed; }

    /* SKELETON */
    .vcm-skel {
        height: 13px; border-radius: 2px;
        background: linear-gradient(90deg, var(--sand) 25%, var(--cream) 50%, var(--sand) 75%);
        background-size: 200% 100%;
        animation: vcm-shimmer 1.4s ease-in-out infinite;
    }
    @keyframes vcm-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    /* EMPTY */
    .vcm-empty-row { padding: 3rem 1rem; }
    .vcm-empty-inner { display: flex; flex-direction: column; align-items: center; gap: 0.8rem; }
    .vcm-empty-icon {
        width: 50px; height: 50px; border-radius: 50%;
        background: var(--cream); border: 1px solid var(--sand);
        display: flex; align-items: center; justify-content: center; color: var(--bark);
    }
    .vcm-empty-inner span { font-size: 0.85rem; color: var(--bark); font-weight: 300; }

    @media (max-width: 640px) {
        .vcm-form-row { grid-template-columns: 1fr; }
        .vcm-header { flex-direction: column; align-items: flex-start; gap: 0.8rem; }
    }
`;