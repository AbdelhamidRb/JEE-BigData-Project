import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function AdminProduct() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('id');
    const [formData, setFormData] = useState({ id: null, name: '', description: '', price: '', stock: '', categoryId: '', active: true, imageUrl: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    const isFormValid = formData.name.trim().length >= 3 && formData.price >= 0 && formData.stock >= 0 && (formData.categoryId || (isNewCategory && newCategory.name.trim().length >= 2));

    useEffect(() => { fetchProducts(); fetchCategories(); }, []);

    const fetchProducts = async () => { setLoading(true); try { const res = await api.get('/products/admin/all'); setProducts(res.data); } catch { toast.error('Erreur'); } finally { setLoading(false); } };
    const fetchCategories = async () => { try { const res = await api.get('/categories'); setCategories(res.data); } catch {} };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImageChange = (e) => { const file = e.target.files[0]; if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); } };
    const resetForm = () => { setFormData({ id: null, name: '', description: '', price: '', stock: '', categoryId: '', active: true, imageUrl: '' }); setImageFile(null); setImagePreview(null); };

    const handleSubmit = async (e) => {
        e.preventDefault(); if (!isFormValid) return;
        let finalCategoryId = formData.categoryId;
        const loadingToast = toast.loading('Sauvegarde...');
        try {
            if (isNewCategory) { const catRes = await api.post('/categories', newCategory); finalCategoryId = catRes.data.id; fetchCategories(); setIsNewCategory(false); setNewCategory({ name: '', description: '' }); }
            const payload = { name: formData.name, description: formData.description, price: parseFloat(formData.price), stock: parseInt(formData.stock), category: { id: parseInt(finalCategoryId) }, active: formData.active !== false };
            const data = new FormData(); data.append('product', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
            if (imageFile) data.append('image', imageFile);
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (formData.id) { await api.put(`/products/${formData.id}`, data, config); toast.success('Produit mis à jour', { id: loadingToast }); }
            else { await api.post('/products', data, config); toast.success('Produit ajouté', { id: loadingToast }); }
            resetForm(); fetchProducts();
        } catch { toast.error('Erreur', { id: loadingToast }); }
    };

    const handleEdit = (product) => { setIsNewCategory(false); setFormData({ id: product.id, name: product.name, description: product.description || '', price: product.price, stock: product.stock, categoryId: product.category?.id || '', active: product.active, imageUrl: product.imageUrl || '' }); setImageFile(null); setImagePreview(product.imageUrl || null); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    const handleToggleStatus = async (product) => {
        const currentStatus = product.active !== undefined ? product.active : product.isActive;
        const newStatus = !currentStatus;
        const result = await Swal.fire({ title: 'Confirmation', text: `Voulez-vous ${newStatus ? 'activer' : 'désactiver'} "${product.name}" ?`, icon: 'warning', showCancelButton: true, confirmButtonColor: newStatus ? '#4CAF50' : '#E24B4A', cancelButtonColor: '#6B6B6B', confirmButtonText: `Oui`, cancelButtonText: 'Annuler' });
        if (result.isConfirmed) { const t = toast.loading('Mise à jour...'); try { await api.put(`/products/${product.id}/toggle-status`); toast.success(`Produit ${newStatus ? 'activé' : 'désactivé'}`, { id: t }); fetchProducts(); } catch { toast.error('Erreur', { id: t }); } }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const status = p.active !== undefined ? p.active : p.isActive;
        const matchesStatus = filterStatus === 'all' ? true : filterStatus === 'active' ? status === true : status === false;
        const matchesCategory = filterCategory === 'all' ? true : p.category?.id === parseInt(filterCategory);
        return matchesSearch && matchesStatus && matchesCategory;
    }).sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'price') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'stock') return (a.stock || 0) - (b.stock || 0);
        return b.id - a.id;
    });

    return (
        <>
            <style>{styles}</style>
            <div className="fap-root">
                <header className="fap-header">
                    <div><div className="fap-eyebrow">Administration</div><h1 className="fap-title">Gestion des <span className="hl">Produits</span></h1></div>
                    <div className="fap-header-stat"><span className="fap-stat-num">{products.length}</span><span className="fap-stat-label">produits</span></div>
                </header>
                <div className="fap-divider" />

                <div className="fap-panel">
                    <div className="fap-panel-title">{formData.id ? 'Modifier' : 'Ajouter'} un produit</div>
                    <form onSubmit={handleSubmit}>
                        <div className="fap-form-row">
                            <div className="fap-field" style={{ gridColumn: 'span 2' }}><label className="fap-label">Nom</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="fap-input" /></div>
                            <div className="fap-field"><label className="fap-label">Prix (€)</label><input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" className="fap-input" /></div>
                            <div className="fap-field"><label className="fap-label">Stock</label><input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="fap-input" /></div>
                        </div>
                        <div className="fap-field" style={{ marginBottom: '1rem' }}><label className="fap-label">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="fap-input fap-textarea" /></div>
                        <div className="fap-form-row fap-2col">
                            <div className="fap-field"><label className="fap-label">Catégorie</label>
                                {!isNewCategory ? (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="fap-input fap-select" style={{ flex: 1 }}>
                                            <option value="">Sélectionner...</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <button type="button" onClick={() => setIsNewCategory(true)} className="fap-add-cat-btn">+</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, background: 'rgba(255,255,255,0.03)', padding: '0.8rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '0.6rem', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Nouvelle catégorie</span><button type="button" onClick={() => { setIsNewCategory(false); setNewCategory({ name: '', description: '' }); }} style={{ background: 'none', border: 'none', color: '#FF5E00', cursor: 'pointer', fontSize: '0.7rem' }}>Annuler</button></div>
                                        <input type="text" placeholder="Nom" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className="fap-input" />
                                    </div>
                                )}
                            </div>
                            <div className="fap-field"><label className="fap-label">Image</label>
                                <label className="fap-image-label">
                                    {imagePreview ? <img src={imagePreview} alt="" className="fap-image-preview" /> : <div className="fap-image-placeholder">Cliquer pour choisir</div>}
                                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                </label>
                            </div>
                        </div>
                        <div className="fap-form-footer">
                            <button type="submit" disabled={loading || !isFormValid} className="fap-btn-primary">{formData.id ? 'Mettre à jour' : 'Ajouter'}</button>
                            {formData.id && <button type="button" onClick={resetForm} className="fap-btn-ghost">Annuler</button>}
                        </div>
                    </form>
                </div>

                <div className="fap-filters">
                    <div className="fap-search-wrap">
                        <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="fap-search-input" />
                    </div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="fap-filter-select">
                        <option value="all">Tous</option><option value="active">Actifs</option><option value="inactive">Inactifs</option>
                    </select>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="fap-filter-select">
                        <option value="all">Toutes catégories</option>
                        {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="fap-filter-select">
                        <option value="id">Récents</option><option value="name">Nom</option><option value="price">Prix</option><option value="stock">Stock</option>
                    </select>
                </div>

                <div className="fap-panel fap-table-panel">
                    {loading ? (<div className="fap-table-loading">Chargement...</div>) : (
                        <div className="fap-table-scroll">
                            <table className="fap-table">
                                <thead><tr><th className="fap-th">Image</th><th className="fap-th">Nom</th><th className="fap-th">Catégorie</th><th className="fap-th">Prix</th><th className="fap-th">Stock</th><th className="fap-th">Statut</th><th className="fap-th fap-th-right">Actions</th></tr></thead>
                                <tbody>
                                    {filteredProducts.length === 0 ? (<tr><td colSpan="7" className="fap-empty-row">Aucun produit trouvé.</td></tr>)
                                    : filteredProducts.map(p => {
                                        const isActive = p.active !== undefined ? p.active : p.isActive;
                                        return (<tr key={p.id} className={`fap-tr${!isActive ? ' inactive' : ''}`}>
                                            <td className="fap-td">{p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="fap-table-img" /> : <div className="fap-table-img-placeholder">N/A</div>}</td>
                                            <td className="fap-td"><span className="fap-product-name">{p.name}</span></td>
                                            <td className="fap-td"><span className="fap-cat-pill">{p.category?.name || 'N/A'}</span></td>
                                            <td className="fap-td"><span className="fap-price-cell">{Number(p.price).toFixed(2)} €</span></td>
                                            <td className="fap-td"><span className={`fap-stock-cell${p.stock < 5 ? ' low' : ''}`}>{p.stock}</span></td>
                                            <td className="fap-td"><span className={`fap-status-badge${isActive ? ' active' : ' inactive'}`}><span className="fap-status-dot" />{isActive ? 'Actif' : 'Inactif'}</span></td>
                                            <td className="fap-td fap-td-right">
                                                <button onClick={() => handleEdit(p)} className="fap-action-btn">Éditer</button>
                                                <button onClick={() => handleToggleStatus(p)} className={`fap-action-btn${isActive ? ' deactivate' : ' activate'}`}>{isActive ? 'Désactiver' : 'Activer'}</button>
                                            </td>
                                        </tr>);
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

const styles = `
    .fap-root { font-family: 'Inter', sans-serif; }
    .fap-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; }
    .fap-eyebrow { font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: #FF5E00; margin-bottom: 0.5rem; font-weight: 600; }
    .fap-title { font-family: 'Oswald', sans-serif; font-size: 2rem; color: #fff; line-height: 1.05; }
    .fap-title .hl { color: #FF5E00; }
    .fap-header-stat { text-align: right; }
    .fap-stat-num { font-family: 'Oswald', sans-serif; font-size: 1.7rem; color: #FF5E00; font-weight: 600; display: block; }
    .fap-stat-label { font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: #6B6B6B; }
    .fap-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 2rem; }
    .fap-panel { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); padding: 1.5rem; margin-bottom: 1.5rem; }
    .fap-table-panel { padding: 0; }
    .fap-panel-title { font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase; color: #B8B8B8; font-weight: 500; margin-bottom: 1.2rem; }
    .fap-label { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: #6B6B6B; margin-bottom: 0.4rem; font-weight: 500; }
    .fap-input { width: 100%; padding: 0.7rem 0.9rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #D4D4D4; font-family: 'Inter', sans-serif; font-size: 0.85rem; outline: none; transition: border-color 0.18s; box-sizing: border-box; }
    .fap-input:focus { border-color: #FF5E00; }
    .fap-textarea { resize: vertical; min-height: 60px; }
    .fap-select { appearance: none; cursor: pointer; }
    .fap-form-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0.8rem; margin-bottom: 1rem; }
    .fap-2col { grid-template-columns: 1fr 1fr; }
    .fap-field { display: flex; flex-direction: column; }
    .fap-add-cat-btn { width: 38px; flex-shrink: 0; background: #FF5E00; color: #0A0A0A; border: none; cursor: pointer; font-size: 1.2rem; font-weight: 600; }
    .fap-image-label { display: block; cursor: pointer; }
    .fap-image-preview { width: 72px; height: 72px; object-fit: cover; border: 1px solid rgba(255,255,255,0.08); }
    .fap-image-placeholder { width: 72px; height: 72px; background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: #6B6B6B; text-align: center; padding: 4px; }
    .fap-form-footer { display: flex; gap: 0.8rem; padding-top: 1.2rem; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 0.4rem; }
    .fap-btn-primary { padding: 0.75rem 1.5rem; background: #FF5E00; color: #0A0A0A; border: none; cursor: pointer; font-family: 'Oswald', sans-serif; font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; transition: background 0.18s; }
    .fap-btn-primary:hover:not(.disabled) { background: #FF7A2E; }
    .fap-btn-primary.disabled { opacity: 0.5; cursor: not-allowed; }
    .fap-btn-ghost { padding: 0.75rem 1.2rem; background: transparent; color: #6B6B6B; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; font-family: 'Inter', sans-serif; font-size: 0.72rem; }
    .fap-filters { display: flex; gap: 0.8rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; }
    .fap-search-input { padding: 0.65rem 0.9rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #D4D4D4; font-family: 'Inter', sans-serif; font-size: 0.82rem; outline: none; }
    .fap-filter-select { padding: 0.65rem 0.9rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #B8B8B8; font-family: 'Inter', sans-serif; font-size: 0.8rem; cursor: pointer; outline: none; }
    .fap-table-scroll { overflow-x: auto; }
    .fap-table { width: 100%; border-collapse: collapse; }
    .fap-th { padding: 0.9rem 1rem; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #6B6B6B; font-weight: 500; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); white-space: nowrap; }
    .fap-th-right { text-align: right; }
    .fap-tr { border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.15s; }
    .fap-tr:hover { background: rgba(255,255,255,0.02); }
    .fap-tr.inactive { opacity: 0.5; }
    .fap-td { padding: 0.9rem 1rem; vertical-align: middle; }
    .fap-td-right { text-align: right; }
    .fap-table-img { width: 40px; height: 40px; object-fit: cover; border: 1px solid rgba(255,255,255,0.06); }
    .fap-table-img-placeholder { width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 0.55rem; color: #6B6B6B; background: rgba(255,255,255,0.03); }
    .fap-product-name { font-size: 0.82rem; color: #D4D4D4; font-weight: 500; }
    .fap-cat-pill { font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase; background: rgba(255,255,255,0.04); color: #6B6B6B; border: 1px solid rgba(255,255,255,0.06); padding: 0.2rem 0.5rem; white-space: nowrap; }
    .fap-price-cell { font-family: 'Oswald', sans-serif; font-size: 0.9rem; color: #FF5E00; }
    .fap-stock-cell { font-size: 0.82rem; color: #B8B8B8; }
    .fap-stock-cell.low { color: #E24B4A; }
    .fap-status-badge { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; padding: 0.25rem 0.55rem; font-weight: 500; }
    .fap-status-badge.active { background: rgba(76,175,80,0.12); color: #4CAF50; }
    .fap-status-badge.inactive { background: rgba(226,75,74,0.12); color: #E24B4A; }
    .fap-status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
    .fap-action-btn { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.3rem 0.7rem; border: 1px solid rgba(255,255,255,0.08); cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 500; margin-left: 4px; background: transparent; color: #6B6B6B; transition: all 0.15s; }
    .fap-action-btn:hover { border-color: #FF5E00; color: #FF5E00; }
    .fap-action-btn.deactivate { border-color: rgba(226,75,74,0.2); color: #E24B4A; }
    .fap-action-btn.deactivate:hover { background: rgba(226,75,74,0.1); }
    .fap-action-btn.activate { border-color: rgba(76,175,80,0.2); color: #4CAF50; }
    .fap-action-btn.activate:hover { background: rgba(76,175,80,0.1); }
    .fap-empty-row { text-align: center; padding: 2.5rem; color: #6B6B6B; }
    .fap-table-loading { padding: 2.5rem; text-align: center; color: #6B6B6B; }
    .fap-search-wrap { flex: 1; }
    @media (max-width: 900px) { .fap-form-row { grid-template-columns: 1fr 1fr; } .fap-2col { grid-template-columns: 1fr; } }
    @media (max-width: 600px) { .fap-form-row { grid-template-columns: 1fr; } }
`;
