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

    const [formData, setFormData] = useState({
        id: null, name: '', description: '', price: '', stock: '', categoryId: '', active: true, imageUrl: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    const isFormValid = formData.name.trim().length >= 3 && formData.price >= 0 && formData.stock >= 0 && (formData.categoryId || (isNewCategory && newCategory.name.trim().length >= 2));

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setFormData({ id: null, name: '', description: '', price: '', stock: '', categoryId: '', active: true, imageUrl: '' });
        setImageFile(null);
        setImagePreview(null);
        if (document.getElementById('imageInput')) document.getElementById('imageInput').value = '';
    };

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

            const data = new FormData();
            data.append('product', new Blob([JSON.stringify(payload)], { type: "application/json" }));

            if (imageFile) {
                data.append('image', imageFile);
            }

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (formData.id) {
                await api.put(`/products/${formData.id}`, data, config);
                toast.success("Produit mis à jour", { id: loadingToast });
            } else {
                await api.post('/products', data, config);
                toast.success("Produit ajouté", { id: loadingToast });
            }

            resetForm();
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
            active: product.active,
            imageUrl: product.imageUrl || ''
        });
        setImageFile(null);
        setImagePreview(product.imageUrl || null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleStatus = async (product) => {
        const currentStatus = product.active !== undefined ? product.active : product.isActive;
        const newStatus = !currentStatus;
        const action = newStatus ? "activer" : "désactiver";

        const result = await Swal.fire({
            title: 'Confirmation',
            text: `Voulez-vous vraiment ${action} le produit "${product.name}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: newStatus ? '#22c55e' : '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Oui, ${action}`,
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            const loadingToast = toast.loading('Mise à jour du statut...');
            try {
                const payload = { ...product, category: { id: product.category?.id }, active: newStatus, isActive: newStatus };
                const data = new FormData();
                data.append('product', new Blob([JSON.stringify(payload)], { type: "application/json" }));

                await api.put(`/products/${product.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
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

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* LIGNE 1 : Nom, Prix, Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Ordinateur Portable" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>

                    {/* LIGNE 2 : Description du produit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description du produit</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Description détaillée du produit..." />
                    </div>

                    {/* LIGNE 3 : Catégorie & Image */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                            {!isNewCategory ? (
                                <div className="flex gap-2">
                                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} required={!isNewCategory}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                        <option value="">Sélectionner une catégorie</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <button type="button" onClick={() => setIsNewCategory(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg font-bold">+</button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Nouvelle Catégorie</span>
                                        <button type="button" onClick={() => { setIsNewCategory(false); setNewCategory({ name: '', description: '' }); }} className="text-red-500 hover:text-red-700 font-bold text-sm">✖ Annuler</button>
                                    </div>
                                    <input type="text" placeholder="Nom de la catégorie" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
                                    <input type="text" placeholder="Description de la catégorie (optionnelle)" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>
                            <div className="flex flex-col gap-2">
                                <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none" />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-md border border-gray-300 shadow-sm" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <button type="submit" disabled={loading || !isFormValid} className={`px-6 py-2 rounded-lg text-white font-medium ${loading || !isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            {formData.id ? 'Mettre à jour' : 'Ajouter le produit'}
                        </button>
                        {formData.id && (
                            <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">Annuler</button>
                        )}
                    </div>
                </form>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input type="text" placeholder="🔍 Rechercher un produit..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg outline-none shadow-sm" />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-lg outline-none bg-white shadow-sm">
                    <option value="all">Tous les statuts</option>
                    <option value="active">🟢 Actifs uniquement</option>
                    <option value="inactive">🔴 Inactifs uniquement</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b text-gray-600 text-sm uppercase">
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Nom</th>
                                <th className="px-6 py-4">Catégorie</th>
                                <th className="px-6 py-4">Prix</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map(p => {
                                const isActive = p.active !== undefined ? p.active : p.isActive;
                                return (
                                    <tr key={p.id} className={`hover:bg-gray-50 ${!isActive && 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            {p.imageUrl ? (
                                                <img src={p.imageUrl} alt={p.name} className="h-12 w-12 object-cover rounded-md border" />
                                            ) : (
                                                <div className="h-12 w-12 bg-gray-200 rounded-md border flex items-center justify-center text-gray-400 text-xs">N/A</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium">{p.name}</td>
                                        <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{p.category?.name || 'N/A'}</span></td>
                                        <td className="px-6 py-4">{p.price} €</td>
                                        <td className="px-6 py-4">{p.stock}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => handleEdit(p)} className="text-blue-600 bg-blue-50 px-3 py-1 rounded-md text-sm">Éditer</button>
                                            <button onClick={() => handleToggleStatus(p)} className={`${isActive ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'} px-3 py-1 rounded-md text-sm`}>
                                                {isActive ? 'Désactiver' : 'Activer'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}