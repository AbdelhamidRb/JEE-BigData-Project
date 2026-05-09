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
        return <div style={{ textAlign: 'center', padding: '5rem', color: '#6B5B4E' }}>Chargement...</div>;
    }

    return (
        <>
            <style>{`
                .vwl-root { max-width: 900px; margin: 3rem auto; padding: 0 1.5rem; font-family: 'DM Sans', sans-serif; }
                .vwl-title { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: #0F0D0C; margin-bottom: 2rem; text-align: center; }
                .vwl-title em { font-style: italic; color: #6B5B4E; }

                .vwl-card { background: #FDFAF7; border: 1px solid #E8DDD0; border-radius: 3px; padding: 1.5rem; }

                .vwl-item { display: flex; align-items: center; gap: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px dashed #E8DDD0; margin-bottom: 1.5rem; }
                .vwl-item:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }

                .vwl-item-img { width: 80px; height: 80px; object-fit: cover; border-radius: 2px; border: 1px solid #E8DDD0; cursor: pointer; }
                .vwl-item-details { flex: 1; }
                .vwl-item-name { font-size: 1.1rem; font-family: 'Playfair Display', serif; font-weight: 500; color: #0F0D0C; margin-bottom: 4px; cursor: pointer; transition: color 0.2s; }
                .vwl-item-name:hover { color: #6B5B4E; }
                .vwl-item-meta { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #B8A898; margin-bottom: 8px; }
                .vwl-item-price { font-weight: 600; color: #2A2420; font-size: 1.1rem; }

                .vwl-actions { display: flex; align-items: center; gap: 1rem; }

                .vwl-btn-cart { padding: 0.6rem 1.2rem; background: #2A2420; color: #FFF; border: none; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.75rem; border-radius: 2px; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 8px; }
                .vwl-btn-cart:hover { background: #0F0D0C; }

                .vwl-btn-remove { background: transparent; border: none; color: #A32D2D; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; padding: 0.5rem; transition: opacity 0.2s; font-weight: 500; }
                .vwl-btn-remove:hover { opacity: 0.7; }

                .vwl-empty { text-align: center; padding: 4rem 0; color: #B8A898; }
                .vwl-btn { display: inline-block; margin-top: 1.5rem; padding: 0.6rem 1.5rem; background: #2A2420; color: #FFF; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.75rem; border-radius: 2px; }
            `}</style>

            <div className="vwl-root">
                <h1 className="vwl-title">Ma Liste de <em>Souhaits</em></h1>

                {wishlist.length === 0 ? (
                    <div className="vwl-empty">
                        <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}>♡</div>
                        <p>Votre liste de souhaits est vide.</p>
                        <Link to="/dashboard" className="vwl-btn">Découvrir les produits</Link>
                    </div>
                ) : (
                    <div className="vwl-card">
                        {wishlist.map((item) => {
                            const product = item.product;
                            if (!product) return null;

                            return (
                                <div key={item.id} className="vwl-item">
                                    <img
                                        src={product.imageUrl || 'https://via.placeholder.com/150'}
                                        alt={product.name}
                                        className="vwl-item-img"
                                        onClick={() => navigate(`/produit/${product.id}`)}
                                    />

                                    <div className="vwl-item-details">
                                        <div
                                            className="vwl-item-name"
                                            onClick={() => navigate(`/produit/${product.id}`)}
                                        >
                                            {product.name}
                                        </div>
                                        <div className="vwl-item-meta">
                                            {product.category?.name || 'Général'}
                                        </div>
                                        <div className="vwl-item-price">
                                            {product.price?.toFixed(2)} €
                                        </div>
                                    </div>

                                    <div className="vwl-actions">
                                        <button
                                            onClick={() => handleMoveToCart(product)}
                                            className="vwl-btn-cart"
                                        >
                                            Ajouter au panier
                                        </button>
                                        <button
                                            onClick={() => handleRemove(product.id)}
                                            className="vwl-btn-remove"
                                            title="Retirer"
                                        >
                                            Retirer
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}