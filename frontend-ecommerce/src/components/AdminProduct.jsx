import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'; // Import des modales

export default function AdminProduct() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); // True par défaut pour le premier chargement

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const [formData, setFormData] = useState({
        id: null, name: '', description: '', price: '', stock: '', categoryId: '', active: true
    });

    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    // --- VALIDATION EN TEMPS RÉEL ---
    const isFormValid = formData.name.trim().length >= 3 && formData.price >= 0 && formData.stock >= 0 && (formData.categoryId || isNewCategory && newCategory.name.trim().length >= 2);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/products/admin/all');
            setProducts(response.data);
        } catch (error) {
            toast.error("Erreur lors du chargement des produits");
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

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        let finalCategoryId = formData.categoryId;
        const loadingToast = toast.loading('Sauvegarde en cours...');

        try {
            if (isNewCategory) {
                const catResponse = await api.post('/categories', newCategory);
                finalCategoryId = catResponse.data.id;
                fetchCategories();
                setIsNewCategory(false);
                setNewCategory({ name: '', description: '' });
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock, 10),
                category: { id: parseInt(finalCategoryId, 10) },
                active: formData.active !== false
            };

            if (formData.id) {
                await api.put(`/products/${formData.id}`, payload);
                toast.success("Produit mis à jour", { id: loadingToast });
            } else {
                await api.post('/products', payload);
                toast.success("Produit ajouté", { id: loadingToast });
            }

            setFormData({ id: null, name: '', description: '', price: '', stock: '', categoryId: '', active: true });
            fetchProducts();
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde", { id: loadingToast });
        }
    };

    const handleEdit = (product) => {
        setIsNewCategory(false);
        setFormData({
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            categoryId: product.category?.id || '',
            active: product.active
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- SWEETALERT2 AU LIEU DE WINDOW.CONFIRM ---
    const handleToggleStatus = async (product) => {
        const currentStatus = product.active !== undefined ? product.active : product.isActive;
        const newStatus = !currentStatus;
        const action = newStatus ? "activer" : "désactiver";

        const result = await Swal.fire({
            title: 'Confirmation',
            text: `Voulez-vous vraiment ${action} le produit "${product.name}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: newStatus ? '#22c55e' : '#ef4444', // Vert Tailwind ou Rouge Tailwind
            cancelButtonColor: '#6b7280', // Gris
            confirmButtonText: `Oui, ${action}`,
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            const loadingToast = toast.loading('Mise à jour du statut...');
            try {
                const payload = {
                    ...product,
                    category: { id: product.category?.id },
                    active: newStatus,
                    isActive: newStatus
                };

                await api.put(`/products/${product.id}`, payload);
                toast.success(`Produit ${newStatus ? 'activé' : 'désactivé'}`, { id: loadingToast });
                fetchProducts();
            } catch (error) {
                toast.error("Erreur lors de la modification", { id: loadingToast });
            }
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const status = p.active !== undefined ? p.active : p.isActive;
        const matchesStatus = filterStatus === 'all' ? true : filterStatus === 'active' ? status === true : status === false;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-200 pb-4 mb-8">
                Gestion des Produits
            </h2>

            {/* FORMULAIRE */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Ex: Ordinateur Portable" />
                            {formData.name.length > 0 && formData.name.length < 3 && <p className="text-red-500 text-xs mt-1">Le nom doit contenir au moins 3 caractères.</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                            {formData.price !== '' && formData.price < 0 && <p className="text-red-500 text-xs mt-1">Le prix ne peut pas être négatif.</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                            {formData.stock !== '' && formData.stock < 0 && <p className="text-red-500 text-xs mt-1">Le stock ne peut pas être négatif.</p>}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                            {!isNewCategory ? (
                                <div className="flex gap-2">
                                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} required={!isNewCategory}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                        <option value="">Sélectionner une catégorie</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <button type="button" onClick={() => setIsNewCategory(true)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg font-bold transition-colors shadow-sm" title="Nouvelle catégorie">+</button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Nom" value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} required={isNewCategory}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    <input type="text" placeholder="Description" value={newCategory.description} onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    <button type="button" onClick={() => setIsNewCategory(false)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-lg font-bold transition-colors shadow-sm" title="Annuler">X</button>
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnelle)</label>
                            <input type="text" name="description" value={formData.description} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Description courte..." />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <button type="submit" disabled={loading || !isFormValid}
                            className={`px-6 py-2 rounded-lg text-white font-medium shadow-sm transition-all ${loading || !isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}`}>
                            {formData.id ? 'Mettre à jour' : 'Ajouter le produit'}
                        </button>
                        {formData.id && (
                            <button type="button" onClick={() => setFormData({ id: null, name: '', description: '', price: '', stock: '', categoryId: '', active: true })}
                                className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all">
                                Annuler
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* RECHERCHE ET FILTRES */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input type="text" placeholder="🔍 Rechercher un produit..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm bg-white">
                    <option value="all">Tous les statuts</option>
                    <option value="active">🟢 Actifs uniquement</option>
                    <option value="inactive">🔴 Inactifs uniquement</option>
                </select>
            </div>

            {/* TABLEAU AVEC SKELETON LOADER */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">ID</th>
                                <th className="px-6 py-4 font-semibold">Nom</th>
                                <th className="px-6 py-4 font-semibold">Catégorie</th>
                                <th className="px-6 py-4 font-semibold">Prix</th>
                                <th className="px-6 py-4 font-semibold">Stock</th>
                                <th className="px-6 py-4 font-semibold">Statut</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                // SKELETON LOADER
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4 flex justify-end gap-2"><div className="h-8 bg-gray-200 rounded w-16"></div><div className="h-8 bg-gray-200 rounded w-20"></div></td>
                                    </tr>
                                ))
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map(p => {
                                    const isActive = p.active !== undefined ? p.active : p.isActive;
                                    return (
                                        <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${!isActive && 'bg-gray-50/50'}`}>
                                            <td className="px-6 py-4 text-gray-500">{p.id}</td>
                                            <td className={`px-6 py-4 font-medium ${!isActive ? 'text-gray-400' : 'text-gray-900'}`}>{p.name}</td>
                                            <td className="px-6 py-4 text-gray-500">
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{p.category?.name || 'N/A'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">{p.price} €</td>
                                            <td className="px-6 py-4 text-gray-700">{p.stock}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {isActive ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors text-sm font-medium">
                                                    Éditer
                                                </button>
                                                <button onClick={() => handleToggleStatus(p)} className={`${isActive ? 'text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100' : 'text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100'} px-3 py-1 rounded-md transition-colors text-sm font-medium`}>
                                                    {isActive ? 'Désactiver' : 'Activer'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                            Aucun produit trouvé.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}