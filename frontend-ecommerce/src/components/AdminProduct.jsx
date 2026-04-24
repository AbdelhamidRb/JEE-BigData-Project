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
    const [formData, setFormData] = useState({
        id: null, name: '', description: '', price: '', stock: '', categoryId: '', active: true, imageUrl: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    const isFormValid = formData.name.trim().length >= 3 && formData.price >= 0 && formData.stock >= 0 &&
        (formData.categoryId || (isNewCategory && newCategory.name.trim().length >= 2));

    useEffect(() => { fetchProducts(); fetchCategories(); }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products/admin/all');
            setProducts(res.data);
        } catch { toast.error('Erreur lors du chargement des produits'); }
        finally { setLoading(false); }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (e) { console.error('Erreur catégories', e); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
    };

    const resetForm = () => {
        setFormData({ id: null, name: '', description: '', price: '', stock: '', categoryId: '', active: true, imageUrl: '' });
        setImageFile(null); setImagePreview(null);
        if (document.getElementById('imageInput')) document.getElementById('imageInput').value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        let finalCategoryId = formData.categoryId;
        const loadingToast = toast.loading('Sauvegarde en cours...');
        try {
            if (isNewCategory) {
                const catRes = await api.post('/categories', newCategory);
                finalCategoryId = catRes.data.id;
                fetchCategories();
                setIsNewCategory(false);
                setNewCategory({ name: '', description: '' });
            }
            const payload = {
                name: formData.name, description: formData.description,
                price: parseFloat(formData.price), stock: parseInt(formData.stock, 10),
                category: { id: parseInt(finalCategoryId, 10) }, active: formData.active !== false
            };
            const data = new FormData();
            data.append('product', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
            if (imageFile) data.append('image', imageFile);
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (formData.id) {
                await api.put(`/products/${formData.id}`, data, config);
                toast.success('Produit mis à jour', { id: loadingToast });
            } else {
                await api.post('/products', data, config);
                toast.success('Produit ajouté', { id: loadingToast });
            }
            resetForm(); fetchProducts();
        } catch { toast.error('Erreur lors de la sauvegarde', { id: loadingToast }); }
    };

    const handleEdit = (product) => {
        setIsNewCategory(false);
        setFormData({
            id: product.id, name: product.name, description: product.description || '',
            price: product.price, stock: product.stock, categoryId: product.category?.id || '',
            active: product.active, imageUrl: product.imageUrl || ''
        });
        setImageFile(null); setImagePreview(product.imageUrl || null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleStatus = async (product) => {
        // Vérifie le statut actuel (selon comment Spring le renvoie : active ou isActive)
        const currentStatus = product.active !== undefined ? product.active : product.isActive;
        const newStatus = !currentStatus;
        const action = newStatus ? 'activer' : 'désactiver';

        const result = await Swal.fire({
            title: 'Confirmation',
            text: `Voulez-vous vraiment ${action} "${product.name}" ?`,
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
                // Appel direct à la nouvelle route allégée
                await api.put(`/products/${product.id}/toggle-status`);

                toast.success(`Produit ${newStatus ? 'activé' : 'désactivé'}`, { id: loadingToast });
                fetchProducts(); // Recharge la liste
            } catch (error) {
                toast.error('Erreur lors de la modification', { id: loadingToast });
            }
        }
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
            <div className="vap-root">

                {/* HEADER */}
                <header className="vap-header">
                    <div>
                        <div className="vap-eyebrow">Administration</div>
                        <h1 className="vap-title">Gestion des <em>Produits</em></h1>
                    </div>
                    <div className="vap-header-stat">
                        <span className="vap-stat-num">{products.length}</span>
                        <span className="vap-stat-label">produits au total</span>
                    </div>
                </header>
                <div className="vap-divider" />

                {/* FORM PANEL */}
                <div className="vap-panel vap-form-panel">
                    <div className="vap-panel-title">
                        {formData.id ? (
                            <><span className="vap-panel-dot editing" />Modifier le produit</>
                        ) : (
                            <><span className="vap-panel-dot" />Ajouter un produit</>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* ROW 1 */}
                        <div className="vap-form-row vap-4col">
                            <div className="vap-field vap-span2">
                                <label className="vap-label">Nom du produit</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                       placeholder="Ex: Tote en cuir naturel" className="vap-input" />
                            </div>
                            <div className="vap-field">
                                <label className="vap-label">Prix (€)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" className="vap-input" />
                            </div>
                            <div className="vap-field">
                                <label className="vap-label">Stock</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="vap-input" />
                            </div>
                        </div>

                        {/* ROW 2 */}
                        <div className="vap-field" style={{ marginBottom: '1.2rem' }}>
                            <label className="vap-label">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="2"
                                      placeholder="Description détaillée du produit..." className="vap-input vap-textarea" />
                        </div>

                        {/* ROW 3 */}
                        <div className="vap-form-row vap-2col">
                            {/* CATEGORY */}
                            <div className="vap-field">
                                <label className="vap-label">Catégorie</label>
                                {!isNewCategory ? (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <select name="categoryId" value={formData.categoryId} onChange={handleChange}
                                                required={!isNewCategory} className="vap-input vap-select" style={{ flex: 1 }}>
                                            <option value="">Sélectionner une catégorie</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <button type="button" onClick={() => setIsNewCategory(true)} className="vap-add-cat-btn" title="Nouvelle catégorie">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="vap-new-cat-box">
                                        <div className="vap-new-cat-header">
                                            <span className="vap-new-cat-label">Nouvelle catégorie</span>
                                            <button type="button" onClick={() => { setIsNewCategory(false); setNewCategory({ name: '', description: '' }); }} className="vap-new-cat-cancel">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                Annuler
                                            </button>
                                        </div>
                                        <input type="text" placeholder="Nom de la catégorie" value={newCategory.name}
                                               onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                               required className="vap-input" style={{ marginBottom: 8 }} />
                                        <input type="text" placeholder="Description (optionnelle)" value={newCategory.description}
                                               onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                               className="vap-input" />
                                    </div>
                                )}
                            </div>

                            {/* IMAGE */}
                            <div className="vap-field">
                                <label className="vap-label">Image du produit</label>
                                <div className="vap-image-zone">
                                    <label htmlFor="imageInput" className="vap-image-label">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="vap-image-preview" />
                                        ) : (
                                            <div className="vap-image-placeholder">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                                                    <polyline points="21 15 16 10 5 21"/>
                                                </svg>
                                                <span>Cliquer pour choisir</span>
                                            </div>
                                        )}
                                    </label>
                                    <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                </div>
                            </div>
                        </div>

                        {/* FORM ACTIONS */}
                        <div className="vap-form-footer">
                            <button type="submit" disabled={loading || !isFormValid} className={`vap-btn-primary${loading || !isFormValid ? ' disabled' : ''}`}>
                                {formData.id ? 'Mettre à jour' : 'Ajouter le produit'}
                            </button>
                            {formData.id && (
                                <button type="button" onClick={resetForm} className="vap-btn-ghost">Annuler</button>
                            )}
                        </div>
                    </form>
                </div>

                {/* FILTERS */}
                <div className="vap-filters">
                    <div className="vap-search-wrap">
                        <svg className="vap-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input type="text" placeholder="Rechercher un produit…" value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)} className="vap-search-input" />
                    </div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="vap-filter-select">
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actifs uniquement</option>
                        <option value="inactive">Inactifs uniquement</option>
                    </select>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="vap-filter-select">
                        <option value="all">Toutes les catégories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="vap-filter-select">
                        <option value="id">Plus récents</option>
                        <option value="name">Nom A-Z</option>
                        <option value="price">Prix croissant</option>
                        <option value="stock">Stock croissant</option>
                    </select>
                    <div className="vap-results-count">{filteredProducts.length} résultat{filteredProducts.length !== 1 ? 's' : ''}</div>
                </div>

                {/* TABLE */}
                <div className="vap-panel vap-table-panel">
                    {loading ? (
                        <div className="vap-table-loading">
                            <div className="vap-loading-dots">
                                <div className="vap-loading-dot" style={{ animationDelay: '0ms' }} />
                                <div className="vap-loading-dot" style={{ animationDelay: '150ms' }} />
                                <div className="vap-loading-dot" style={{ animationDelay: '300ms' }} />
                            </div>
                            <p className="vap-loading-text">Chargement…</p>
                        </div>
                    ) : (
                        <div className="vap-table-scroll">
                            <table className="vap-table">
                                <thead>
                                <tr>
                                    <th className="vap-th">Image</th>
                                    <th className="vap-th">Nom</th>
                                    <th className="vap-th">Catégorie</th>
                                    <th className="vap-th">Prix</th>
                                    <th className="vap-th">Stock</th>
                                    <th className="vap-th">Statut</th>
                                    <th className="vap-th vap-th-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="vap-empty-row">Aucun produit trouvé.</td>
                                    </tr>
                                ) : filteredProducts.map(p => {
                                    const isActive = p.active !== undefined ? p.active : p.isActive;
                                    return (
                                        <tr key={p.id} className={`vap-tr${!isActive ? ' inactive' : ''}`}>
                                            <td className="vap-td">
                                                {p.imageUrl ? (
                                                    <img src={p.imageUrl} alt={p.name} className="vap-table-img" />
                                                ) : (
                                                    <div className="vap-table-img-placeholder">N/A</div>
                                                )}
                                            </td>
                                            <td className="vap-td">
                                                <span className="vap-product-name-cell">{p.name}</span>
                                            </td>
                                            <td className="vap-td">
                                                <span className="vap-cat-pill">{p.category?.name || 'N/A'}</span>
                                            </td>
                                            <td className="vap-td">
                                                <span className="vap-price-cell">{Number(p.price).toFixed(2)} €</span>
                                            </td>
                                            <td className="vap-td">
                                                <span className={`vap-stock-cell${p.stock < 5 ? ' low' : ''}`}>{p.stock}</span>
                                            </td>
                                            <td className="vap-td">
                                                    <span className={`vap-status-badge${isActive ? ' active' : ' inactive'}`}>
                                                        <span className="vap-status-dot" />
                                                        {isActive ? 'Actif' : 'Inactif'}
                                                    </span>
                                            </td>
                                            <td className="vap-td vap-td-right">
                                                <button onClick={() => handleEdit(p)} className="vap-action-btn edit">Éditer</button>
                                                <button onClick={() => handleToggleStatus(p)} className={`vap-action-btn${isActive ? ' deactivate' : ' activate'}`}>
                                                    {isActive ? 'Désactiver' : 'Activer'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
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
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    :root {
        --cream: #F5F0E8; --sand: #E8DDD0; --bark: #B8A898;
        --earth: #6B5B4E; --charcoal: #2A2420; --black: #0F0D0C;
        --accent: #C8472A; --gold: #C9A96E; --white: #FDFAF7;
    }

    .vap-root { max-width: 1100px; font-family: 'DM Sans', sans-serif; }

    .vap-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; }
    .vap-eyebrow { font-size: 0.65rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
    .vap-title { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--black); line-height: 1.15; }
    .vap-title em { font-style: italic; color: var(--earth); }
    .vap-header-stat { text-align: right; }
    .vap-stat-num { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--black); font-weight: 700; display: block; }
    .vap-stat-label { font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--bark); }
    .vap-divider { height: 1px; background: var(--sand); margin-bottom: 2rem; }

    .vap-panel {
        background: var(--white);
        border: 1px solid rgba(184,168,152,0.28);
        border-radius: 3px;
        padding: 1.8rem;
        margin-bottom: 1.5rem;
    }
    .vap-panel-title {
        display: flex; align-items: center; gap: 0.6rem;
        font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase;
        color: var(--earth); font-weight: 500;
        margin-bottom: 1.6rem;
    }
    .vap-panel-dot {
        width: 8px; height: 8px; border-radius: 50%;
        background: var(--gold); flex-shrink: 0;
    }
    .vap-panel-dot.editing { background: var(--accent); }

    /* FORM */
    .vap-form-row { display: grid; gap: 1rem; margin-bottom: 1.2rem; }
    .vap-4col { grid-template-columns: 1fr 1fr 1fr 1fr; }
    .vap-2col { grid-template-columns: 1fr 1fr; }
    .vap-span2 { grid-column: span 2; }
    .vap-field { display: flex; flex-direction: column; }
    .vap-label {
        font-size: 0.66rem; letter-spacing: 0.18em; text-transform: uppercase;
        color: var(--earth); margin-bottom: 0.5rem; font-weight: 500;
    }
    .vap-input {
        width: 100%; padding: 0.78rem 1rem;
        background: var(--cream); border: 1px solid var(--sand); border-radius: 2px;
        font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: var(--black);
        outline: none; transition: border-color 0.18s, background 0.18s;
        box-sizing: border-box;
    }
    .vap-input::placeholder { color: var(--bark); font-weight: 300; }
    .vap-input:focus { border-color: var(--earth); background: var(--white); }
    .vap-textarea { resize: vertical; min-height: 70px; }
    .vap-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B5B4E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 2.2rem; cursor: pointer; }

    .vap-add-cat-btn {
        width: 42px; flex-shrink: 0;
        background: var(--charcoal); color: var(--white);
        border: none; border-radius: 2px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.18s;
    }
    .vap-add-cat-btn:hover { background: var(--black); }

    .vap-new-cat-box {
        background: var(--cream); border: 1px solid var(--sand);
        border-radius: 2px; padding: 1rem;
        display: flex; flex-direction: column; gap: 8px;
    }
    .vap-new-cat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .vap-new-cat-label { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bark); }
    .vap-new-cat-cancel {
        display: flex; align-items: center; gap: 4px;
        font-size: 0.72rem; color: var(--accent); font-weight: 500;
        background: none; border: none; cursor: pointer;
        transition: opacity 0.18s;
    }
    .vap-new-cat-cancel:hover { opacity: 0.7; }

    .vap-image-zone { flex: 1; }
    .vap-image-label { display: block; cursor: pointer; }
    .vap-image-preview {
        width: 80px; height: 80px; object-fit: cover;
        border-radius: 2px; border: 1px solid var(--sand);
    }
    .vap-image-placeholder {
        width: 80px; height: 80px;
        background: var(--cream); border: 1px dashed var(--bark); border-radius: 2px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 5px; color: var(--bark); font-size: 0.62rem; letter-spacing: 0.1em;
        text-align: center; padding: 8px;
        transition: border-color 0.18s, background 0.18s;
    }
    .vap-image-placeholder:hover { border-color: var(--earth); background: var(--sand); }

    .vap-form-footer {
        display: flex; gap: 0.8rem; align-items: center;
        padding-top: 1.4rem; border-top: 1px solid var(--sand); margin-top: 0.4rem;
    }
    .vap-btn-primary {
        padding: 0.8rem 1.8rem; background: var(--charcoal); color: var(--white);
        border: none; border-radius: 2px; cursor: pointer;
        font-family: 'DM Sans', sans-serif; font-size: 0.76rem;
        letter-spacing: 0.14em; text-transform: uppercase; font-weight: 500;
        transition: background 0.18s, transform 0.12s;
    }
    .vap-btn-primary:hover:not(.disabled) { background: var(--black); transform: translateY(-1px); }
    .vap-btn-primary.disabled { background: var(--sand); color: var(--bark); cursor: not-allowed; }
    .vap-btn-ghost {
        padding: 0.8rem 1.4rem; background: transparent; color: var(--earth);
        border: 1px solid var(--bark); border-radius: 2px; cursor: pointer;
        font-family: 'DM Sans', sans-serif; font-size: 0.76rem;
        letter-spacing: 0.14em; text-transform: uppercase;
        transition: border-color 0.18s, color 0.18s;
    }
    .vap-btn-ghost:hover { border-color: var(--charcoal); color: var(--black); }

    /* FILTERS */
    .vap-filters { display: flex; gap: 0.8rem; align-items: center; margin-bottom: 1.2rem; }
    .vap-search-wrap {
        flex: 1; position: relative;
        display: flex; align-items: center;
    }
    .vap-search-icon { position: absolute; left: 12px; color: var(--bark); flex-shrink: 0; }
    .vap-search-input {
        width: 100%; padding: 0.72rem 1rem 0.72rem 2.2rem;
        background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 2px;
        font-family: 'DM Sans', sans-serif; font-size: 0.85rem; color: var(--black);
        outline: none; transition: border-color 0.18s;
    }
    .vap-search-input:focus { border-color: var(--earth); }
    .vap-search-input::placeholder { color: var(--bark); font-weight: 300; }
    .vap-filter-select {
        padding: 0.72rem 2rem 0.72rem 0.9rem;
        background: var(--white); border: 1px solid rgba(184,168,152,0.28); border-radius: 2px;
        font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: var(--earth);
        outline: none; appearance: none; cursor: pointer;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%236B5B4E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
        background-repeat: no-repeat; background-position: right 10px center;
        transition: border-color 0.18s;
    }
    .vap-filter-select:focus { border-color: var(--earth); }
    .vap-results-count { font-size: 0.72rem; color: var(--bark); white-space: nowrap; letter-spacing: 0.06em; }

    /* TABLE */
    .vap-table-panel { padding: 0; }
    .vap-table-scroll { overflow-x: auto; }
    .vap-table { width: 100%; border-collapse: collapse; }
    .vap-th {
        padding: 1rem 1.2rem;
        font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
        color: var(--bark); font-weight: 500; text-align: left;
        border-bottom: 1px solid rgba(184,168,152,0.2);
        background: var(--cream);
        white-space: nowrap;
    }
    .vap-th-right { text-align: right; }
    .vap-tr {
        transition: background 0.15s;
        border-bottom: 1px solid rgba(184,168,152,0.12);
    }
    .vap-tr:last-child { border-bottom: none; }
    .vap-tr:hover { background: rgba(245,240,232,0.5); }
    .vap-tr.inactive { opacity: 0.55; }
    .vap-td { padding: 1rem 1.2rem; vertical-align: middle; }
    .vap-td-right { text-align: right; }

    .vap-table-img { width: 44px; height: 44px; object-fit: cover; border-radius: 2px; border: 1px solid var(--sand); }
    .vap-table-img-placeholder {
        width: 44px; height: 44px; border-radius: 2px; border: 1px solid var(--sand);
        background: var(--cream); display: flex; align-items: center; justify-content: center;
        font-size: 0.6rem; color: var(--bark); letter-spacing: 0.05em;
    }
    .vap-product-name-cell { font-size: 0.85rem; color: var(--black); font-weight: 500; }
    .vap-cat-pill {
        font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase;
        background: var(--cream); color: var(--earth);
        border: 1px solid var(--sand); border-radius: 2px;
        padding: 0.25rem 0.6rem; white-space: nowrap;
    }
    .vap-price-cell { font-family: 'Playfair Display', serif; font-size: 0.95rem; color: var(--black); }
    .vap-stock-cell { font-size: 0.85rem; color: var(--charcoal); }
    .vap-stock-cell.low { color: var(--accent); font-weight: 500; }

    .vap-status-badge {
        display: inline-flex; align-items: center; gap: 0.4rem;
        font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase;
        padding: 0.28rem 0.65rem; border-radius: 2px; font-weight: 500;
    }
    .vap-status-badge.active { background: #EAF3DE; color: #3B6D11; }
    .vap-status-badge.inactive { background: #FCEBEB; color: #A32D2D; }
    .vap-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .vap-action-btn {
        font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
        padding: 0.35rem 0.85rem; border-radius: 2px; border: 1px solid;
        cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500;
        transition: background 0.15s, color 0.15s;
        margin-left: 6px;
    }
    .vap-action-btn.edit { background: var(--cream); color: var(--earth); border-color: var(--sand); }
    .vap-action-btn.edit:hover { background: var(--sand); border-color: var(--bark); color: var(--black); }
    .vap-action-btn.deactivate { background: #FCEBEB; color: #A32D2D; border-color: rgba(163,45,45,0.2); }
    .vap-action-btn.deactivate:hover { background: #A32D2D; color: white; }
    .vap-action-btn.activate { background: #EAF3DE; color: #3B6D11; border-color: rgba(59,109,17,0.2); }
    .vap-action-btn.activate:hover { background: #3B6D11; color: white; }

    .vap-empty-row { text-align: center; padding: 3rem; font-size: 0.85rem; color: var(--bark); font-weight: 300; }

    .vap-table-loading { padding: 3rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .vap-loading-dots { display: flex; gap: 6px; }
    .vap-loading-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--gold); animation: vap-pulse 1.2s ease-in-out infinite; }
    @keyframes vap-pulse { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1);opacity:1} }
    .vap-loading-text { font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--bark); }

    @media (max-width: 900px) {
        .vap-4col { grid-template-columns: 1fr 1fr; }
        .vap-span2 { grid-column: span 2; }
        .vap-2col { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
        .vap-4col { grid-template-columns: 1fr; }
        .vap-span2 { grid-column: span 1; }
        .vap-filters { flex-wrap: wrap; }
    }
`;