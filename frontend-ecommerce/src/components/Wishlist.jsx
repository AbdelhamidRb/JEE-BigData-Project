import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Wishlist() {
    const { wishlist, loading, removeFromWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleMoveToCart = (product) => { addToCart(product, 1); removeFromWishlist(product.id); toast.success('Produit ajouté au panier !'); };
    const handleRemove = async (productId) => { await removeFromWishlist(productId); };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: '#6B6B6B', fontFamily: "'Inter', sans-serif" }}>Chargement...</div>;

    return (
        <>
            <style>{`
                .fwl-root { max-width: 900px; margin: 2.5rem auto; padding: 0 1.5rem; font-family: 'Inter', sans-serif; }
                .fwl-title { font-family: 'Oswald', sans-serif; font-size: 2.2rem; color: #fff; margin-bottom: 2rem; text-align: center; text-transform: uppercase; }
                .fwl-title .hl { color: #FF5E00; }
                .fwl-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); }
                .fwl-item { display: flex; align-items: center; gap: 1.2rem; padding: 1.2rem; border-bottom: 1px dashed rgba(255,255,255,0.04); }
                .fwl-item:last-child { border-bottom: none; }
                .fwl-item-img { width: 72px; height: 72px; object-fit: cover; border: 1px solid rgba(255,255,255,0.06); cursor: pointer; filter: grayscale(40%); transition: filter 0.3s; }
                .fwl-item-img:hover { filter: grayscale(0%); }
                .fwl-item-details { flex: 1; }
                .fwl-item-name { font-family: 'Oswald', sans-serif; font-size: 1rem; font-weight: 500; color: #fff; margin-bottom: 4px; cursor: pointer; transition: color 0.2s; text-transform: uppercase; }
                .fwl-item-name:hover { color: #FF5E00; }
                .fwl-item-meta { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em; color: #6B6B6B; margin-bottom: 8px; }
                .fwl-item-price { font-weight: 600; color: #FF5E00; font-size: 1rem; font-family: 'Oswald', sans-serif; }
                .fwl-actions { display: flex; align-items: center; gap: 0.8rem; }
                .fwl-btn-cart { padding: 0.55rem 1.1rem; background: #FF5E00; color: #0A0A0A; border: none; text-transform: uppercase; font-family: 'Oswald', sans-serif; letter-spacing: 0.12em; font-size: 0.7rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
                .fwl-btn-cart:hover { background: #FF7A2E; }
                .fwl-btn-remove { background: transparent; border: none; color: #6B6B6B; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; padding: 0.4rem; transition: color 0.2s; font-weight: 500; }
                .fwl-btn-remove:hover { color: #E24B4A; }
                .fwl-empty { text-align: center; padding: 4rem 0; color: #6B6B6B; }
                .fwl-btn { display: inline-block; margin-top: 1.2rem; padding: 0.6rem 1.5rem; background: #FF5E00; color: #0A0A0A; text-decoration: none; text-transform: uppercase; font-family: 'Oswald', sans-serif; letter-spacing: 0.12em; font-size: 0.72rem; font-weight: 600; }
            `}</style>
            <div className="fwl-root">
                <h1 className="fwl-title">Ma Liste de <span className="hl">Souhaits</span></h1>
                {wishlist.length === 0 ? (
                    <div className="fwl-empty">
                        <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3 }}>♡</div>
                        <p>Votre liste de souhaits est vide.</p>
                        <Link to="/dashboard" className="fwl-btn">Découvrir les produits</Link>
                    </div>
                ) : (
                    <div className="fwl-card">
                        {wishlist.map((item) => {
                            const product = item.product;
                            if (!product) return null;
                            return (
                                <div key={item.id} className="fwl-item">
                                    <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name}
                                        className="fwl-item-img" onClick={() => navigate(`/produit/${product.id}`)} />
                                    <div className="fwl-item-details">
                                        <div className="fwl-item-name" onClick={() => navigate(`/produit/${product.id}`)}>{product.name}</div>
                                        <div className="fwl-item-meta">{product.category?.name || 'Général'}</div>
                                        <div className="fwl-item-price">{product.price?.toFixed(2)} €</div>
                                    </div>
                                    <div className="fwl-actions">
                                        <button onClick={() => handleMoveToCart(product)} className="fwl-btn-cart">Ajouter au panier</button>
                                        <button onClick={() => handleRemove(product.id)} className="fwl-btn-remove">Retirer</button>
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
