import { useState, useEffect } from 'react';
import api from '../api/axios'; // Adjust path to your axios file
import toast from 'react-hot-toast';

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) { toast.error("Erreur de chargement"); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/categories/${editingId}`, formData);
                toast.success("Catégorie modifiée");
            } else {
                await api.post('/categories', formData);
                toast.success("Catégorie ajoutée");
            }
            setFormData({ name: '', description: '' });
            setEditingId(null);
            fetchCategories();
        } catch (err) { toast.error("Erreur lors de l'enregistrement"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cette catégorie ?")) {
            await api.delete(`/categories/${id}`);
            fetchCategories();
            toast.success("Supprimé");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Gestion des Catégories</h1>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        className="border p-2 rounded"
                        placeholder="Nom"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                    />
                    <input
                        className="border p-2 rounded"
                        placeholder="Description"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                </div>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {editingId ? 'Mettre à jour' : 'Ajouter la catégorie'}
                </button>
            </form>

            {/* TABLE */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="p-4">Nom</th>
                        <th className="p-4">Description</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map(cat => (
                        <tr key={cat.id} className="border-b last:border-0">
                            <td className="p-4 font-medium">{cat.name}</td>
                            <td className="p-4 text-gray-500">{cat.description}</td>
                            <td className="p-4 text-right">
                                <button onClick={() => {setEditingId(cat.id); setFormData(cat)}} className="text-blue-600 mr-3">Modifier</button>
                                <button onClick={() => handleDelete(cat.id)} className="text-red-600">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}