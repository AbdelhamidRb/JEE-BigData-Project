import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({}); // État pour gérer les quantités sélectionnées
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);

            // Initialise la quantité de chaque produit à 1
            const initialQuantities = {};
            response.data.forEach(p => initialQuantities[p.id] = 1);
            setQuantities(initialQuantities);
        } catch (error) {
            toast.error("Impossible de charger le catalogue.");
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (id, value) => {
        const val = parseInt(value, 10);
        setQuantities(prev => ({ ...prev, [id]: isNaN(val) || val < 1 ? 1 : val }));
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Chargement des produits...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Notre Catalogue</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                        <div className="h-48 bg-gray-200 overflow-hidden relative">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">Pas d'image</div>
                            )}
                            <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-xs font-bold text-gray-700 rounded-md shadow-sm">
                                {product.category?.name}
                            </span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">{product.description}</p>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-xl font-extrabold text-blue-600">{product.price.toFixed(2)} €</span>
                                {/* MASQUAGE DU STOCK EXACT */}
                                <span className={`text-xs font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock > 0 ? 'En stock' : 'Rupture'}
                                </span>
                            </div>

                            {/* CONTRÔLE DE QUANTITÉ AVANT AJOUT */}
                            <div className="mt-4 flex gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={quantities[product.id] || 1}
                                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                    disabled={product.stock < 1}
                                    className="w-16 px-2 py-2 border border-gray-300 rounded-lg text-center outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                                <button
                                    onClick={() => addToCart(product, quantities[product.id])}
                                    disabled={product.stock < 1}
                                    className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                                        product.stock < 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-900 hover:bg-blue-600 text-white shadow-sm'
                                    }`}
                                >
                                    {product.stock < 1 ? 'Rupture' : 'Ajouter 🛒'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-12 text-gray-500">Aucun produit disponible pour le moment.</div>
            )}
        </div>
    );
}