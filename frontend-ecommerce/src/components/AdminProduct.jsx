import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminProduct() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [formData, setFormData] = useState({
        id: null, name: '', description: '', price: '', stock: '', categoryId: ''
    });

    // --- NOUVEAUX ÉTATS POUR LA CRÉATION DE CATÉGORIE ---
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            setMessage({ text: "Erreur lors du chargement des produits", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Erreur catégories", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        let finalCategoryId = formData.categoryId;

        try {
            // --- LOGIQUE DE CRÉATION DE LA NOUVELLE CATÉGORIE AVANT LE PRODUIT ---
            if (isNewCategory) {
                const catResponse = await api.post('/categories', newCategory);
                finalCategoryId = catResponse.data.id;

                // Rafraîchir les catégories et reset l'état
                fetchCategories();
                setIsNewCategory(false);
                setNewCategory({ name: '', description: '' });
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock, 10),
                category: { id: parseInt(finalCategoryId, 10) }
            };

            if (formData.id) {
                await api.put(`/products/${formData.id}`, payload);
                setMessage({ text: "Produit mis à jour", type: 'success' });
            } else {
                await api.post('/products', payload);
                setMessage({ text: "Produit ajouté", type: 'success' });
            }

            setFormData({ id: null, name: '', description: '', price: '', stock: '', categoryId: '' });
            fetchProducts();
        } catch (error) {
            setMessage({ text: "Erreur lors de la sauvegarde", type: 'error' });
        }
    };

    const handleEdit = (product) => {
        setIsNewCategory(false); // S'assurer qu'on affiche le select classique
        setFormData({
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            categoryId: product.category?.id || ''
        });
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
            try {
                await api.delete(`/products/${id}`);
                setMessage({ text: "Produit supprimé", type: 'success' });
                fetchProducts();
            } catch (error) {
                setMessage({ text: "Erreur lors de la suppression", type: 'error' });
            }
        }
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                Gestion des Produits
            </h2>

            {message.text && (
                <div style={{ color: message.type === 'success' ? 'green' : 'red', marginBottom: '15px', fontWeight: 'bold' }}>
                    {message.text}
                </div>
            )}

            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>

                    <input type="text" name="name" placeholder="Nom du produit" value={formData.name} onChange={handleChange} required style={{ flex: '1 1 200px', padding: '10px' }} />
                    <input type="number" name="price" placeholder="Prix" value={formData.price} onChange={handleChange} required step="0.01" style={{ flex: '1 1 100px', padding: '10px' }} />
                    <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required style={{ flex: '1 1 100px', padding: '10px' }} />

                    {/* --- GESTION DYNAMIQUE DE LA CATÉGORIE --- */}
                    <div style={{ flex: '1 1 300px', display: 'flex', gap: '5px' }}>
                        {!isNewCategory ? (
                            <>
                                <select name="categoryId" value={formData.categoryId} onChange={handleChange} required={!isNewCategory} style={{ width: '100%', padding: '10px' }}>
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <button type="button" onClick={() => setIsNewCategory(true)} style={{ padding: '0 10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} title="Nouvelle catégorie">
                                    +
                                </button>
                            </>
                        ) : (
                            <div style={{ display: 'flex', gap: '5px', width: '100%' }}>
                                <input type="text" placeholder="Nom catégorie" value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} required={isNewCategory} style={{ flex: 1, padding: '10px' }} />
                                <input type="text" placeholder="Description catégorie" value={newCategory.description} onChange={(e) => setNewCategory({...newCategory, description: e.target.value})} style={{ flex: 1, padding: '10px' }} />
                                <button type="button" onClick={() => setIsNewCategory(false)} style={{ padding: '0 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} title="Annuler">
                                    X
                                </button>
                            </div>
                        )}
                    </div>

                    <input type="text" name="description" placeholder="Description du produit" value={formData.description} onChange={handleChange} style={{ flex: '2 1 300px', padding: '10px' }} />

                    <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '10px 20px', height: '100%' }}>
                        {formData.id ? 'Mettre à jour' : 'Ajouter'}
                    </button>

                    {formData.id && (
                        <button type="button" onClick={() => setFormData({ id: null, name: '', description: '', price: '', stock: '', categoryId: '' })} style={{ padding: '10px 20px' }}>
                            Annuler
                        </button>
                    )}
                </form>
            </div>

            {loading ? <p>Chargement des produits...</p> : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '12px' }}>ID</th>
                                <th style={{ padding: '12px' }}>Nom</th>
                                <th style={{ padding: '12px' }}>Catégorie</th>
                                <th style={{ padding: '12px' }}>Prix</th>
                                <th style={{ padding: '12px' }}>Stock</th>
                                <th style={{ padding: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{p.id}</td>
                                    <td style={{ padding: '12px' }}>{p.name}</td>
                                    <td style={{ padding: '12px' }}>{p.category?.name || 'N/A'}</td>
                                    <td style={{ padding: '12px' }}>{p.price} €</td>
                                    <td style={{ padding: '12px' }}>{p.stock}</td>
                                    <td style={{ padding: '12px' }}>
                                        <button onClick={() => handleEdit(p)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Éditer</button>
                                        <button onClick={() => handleDelete(p.id)} className="btn-danger" style={{ padding: '5px 10px', cursor: 'pointer' }}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}