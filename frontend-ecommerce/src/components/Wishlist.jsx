import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Wishlist() {
    const { wishlist, loading, removeFromWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleMoveToCart = (product) => {
        addToCart(product, 1);
        removeFromWishlist(product.id);
        toast.success('Produit ajouté au panier !');
    };

    const handleRemove = async (productId) => {
        await removeFromWishlist(productId);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6 min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="max-w-7xl mx-auto p-6 min-h-[70vh] flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">❤️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre liste de souhaits est vide</h2>
                <p className="text-gray-500 mb-6">Ajoutez des produits que vous adorez !</p>
                <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all">
                    Découvrir les produits
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Ma Liste de Souhaits</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                    {wishlist.map((item) => {
                        const product = item.product;
                        if (!product) return null;
                        
                        return (
                            <li key={item.id} className="p-6 flex items-center gap-6">
                                <img
                                    src={product.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={product.name}
                                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 cursor-pointer"
                                    onClick={() => navigate(`/produit/${product.id}`)}
                                />
                                <div className="flex-1">
                                    <h3 
                                        className="text-lg font-bold text-gray-900 cursor-pointer hover:text-blue-600"
                                        onClick={() => navigate(`/produit/${product.id}`)}
                                    >
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{product.category?.name || 'Général'}</p>
                                    <div className="text-blue-600 font-extrabold mt-2">{product.price?.toFixed(2)} €</div>
                                </div>

                                <button 
                                    onClick={() => handleMoveToCart(product)}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                                >
                                    <span>🛒</span> Ajouter au panier
                                </button>

                                <button 
                                    onClick={() => handleRemove(product.id)} 
                                    className="ml-4 text-red-500 hover:text-red-700 p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                    title="Retirer"
                                >
                                    🗑️
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}