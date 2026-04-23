import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [added, setAdded] = useState(false);
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch {
            toast.error('Produit non trouvé');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const handleWishlistToggle = async (productId) => {
        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    const increment = () => setQuantity(q => Math.min(q + 1, product?.stock || 1));
    const decrement = () => setQuantity(q => Math.max(1, q - 1));

    const images = product?.imageUrl 
        ? [product.imageUrl, product.imageUrl, product.imageUrl].slice(0, 3)
        : [];

    if (loading) {
        return (
            <>
                <style>{baseStyles}</style>
                <div className="vpd-loading">
                    <div className="vpd-loading-spinner" />
                    <p>Chargement du produit...</p>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <style>{baseStyles}</style>
                <div className="vpd-error">
                    <h2>Produit non trouvé</h2>
                    <Link to="/produits" className="vpd-back-link">← Retour au catalogue</Link>
                </div>
            </>
        );
    }

    const inStock = product.stock > 0;

    return (
        <>
            <style>{baseStyles}</style>
            <div className="vpd-root">
                <div className="vpd-breadcrumb">
                    <Link to="/">Accueil</Link>
                    <span>/</span>
                    <Link to="/produits">Catalogue</Link>
                    <span>/</span>
                    <span className="vpd-breadcrumb-current">{product.name}</span>
                </div>

                <div className="vpd-main">
                    <div className="vpd-gallery">
                        <div className="vpd-main-image">
                            {images.length > 0 ? (
                                <img src={images[selectedImage]} alt={product.name} />
                            ) : (
                                <div className="vpd-img-placeholder">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                                        <polyline points="21 15 16 10 5 21"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="vpd-thumbnails">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        className={`vpd-thumb ${selectedImage === idx ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(idx)}
                                    >
                                        <img src={img} alt={`${product.name} ${idx + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="vpd-info">
                        <div className="vpd-category">
                            {product.category?.name || 'Non catégorisé'}
                        </div>
                        <h1 className="vpd-title">{product.name}</h1>
                        
                        <div className="vpd-price-row">
                            <span className="vpd-price">{product.price?.toFixed(2)} €</span>
                            <span className={`vpd-stock ${inStock ? 'in' : 'out'}`}>
                                {inStock ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
                            </span>
                        </div>

                        <div className="vpd-description">
                            <h3>Description</h3>
                            <p>{product.description || 'Aucune description disponible.'}</p>
                        </div>

                        <div className="vpd-actions">
                            <div className="vpd-quantity">
                                <button onClick={decrement} disabled={quantity <= 1} className="vpd-qty-btn">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                </button>
                                <span className="vpd-qty-value">{quantity}</span>
                                <button onClick={increment} disabled={quantity >= product.stock} className="vpd-qty-btn">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                </button>
                            </div>
                            <button 
                                onClick={handleAddToCart} 
                                disabled={!inStock}
                                className={`vpd-add-btn ${added ? 'added' : ''}`}
                            >
                                {added ? (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                        Ajouté !
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                                        Ajouter au panier
                                    </>
                                )}
                            </button>
                            <button 
                                onClick={() => handleWishlistToggle(product.id)}
                                className={`vpd-wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                                title={isInWishlist(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? '#C8472A' : 'none'} stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                            </button>
                        </div>

                        <div className="vpd-meta">
                            <div className="vpd-meta-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span>Référence: {product.id}</span>
                            </div>
                            {product.category && (
                                <div className="vpd-meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                                    <span>Catégorie: {product.category.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <section className="vpd-reviews">
                    <h2 className="vpd-reviews-title">Avis Clients</h2>
                    <div className="vpd-reviews-empty">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <p>Aucun avis pour ce produit pour le moment.</p>
                        <p className="vpd-reviews-hint">Soyez le premier à donner votre avis !</p>
                    </div>
                </section>
            </div>
        </>
    );
}

const baseStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

    :root {
        --cream: #F5F0E8;
        --sand: #E8DDD0;
        --bark: #B8A898;
        --earth: #6B5B4E;
        --charcoal: #2A2420;
        --black: #0F0D0C;
        --accent: #C8472A;
        --gold: #C9A96E;
        --white: #FDFAF7;
    }

    .vpd-root {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1.5rem 4rem;
        font-family: 'DM Sans', sans-serif;
    }

    .vpd-breadcrumb {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.75rem;
        color: var(--bark);
        margin-bottom: 2rem;
    }
    .vpd-breadcrumb a {
        color: var(--earth);
        text-decoration: none;
        transition: color 0.2s;
    }
    .vpd-breadcrumb a:hover { color: var(--black); }
    .vpd-breadcrumb-current {
        color: var(--charcoal);
        font-weight: 500;
    }

    .vpd-main {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        margin-bottom: 4rem;
    }

    .vpd-gallery {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .vpd-main-image {
        aspect-ratio: 1;
        background: var(--cream);
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .vpd-main-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .vpd-img-placeholder {
        color: var(--bark);
        background: var(--sand);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .vpd-thumbnails {
        display: flex;
        gap: 0.75rem;
    }
    .vpd-thumb {
        width: 80px;
        height: 80px;
        border: 2px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        padding: 0;
        background: var(--cream);
        transition: border-color 0.2s;
    }
    .vpd-thumb.active {
        border-color: var(--gold);
    }
    .vpd-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .vpd-info {
        display: flex;
        flex-direction: column;
    }

    .vpd-category {
        font-size: 0.7rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 0.5rem;
    }

    .vpd-title {
        font-family: 'Playfair Display', serif;
        font-size: 2.2rem;
        color: var(--black);
        line-height: 1.2;
        margin-bottom: 1.25rem;
    }

    .vpd-price-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--sand);
    }

    .vpd-price {
        font-family: 'Playfair Display', serif;
        font-size: 1.85rem;
        font-weight: 700;
        color: var(--black);
    }

    .vpd-stock {
        font-size: 0.7rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        padding: 0.4rem 0.8rem;
        border-radius: 2px;
        font-weight: 500;
    }
    .vpd-stock.in { background: #EAF3DE; color: #3B6D11; }
    .vpd-stock.out { background: #FCEBEB; color: #A32D2D; }

    .vpd-description {
        margin-bottom: 2rem;
    }
    .vpd-description h3 {
        font-size: 0.75rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--earth);
        margin-bottom: 0.75rem;
    }
    .vpd-description p {
        font-size: 0.95rem;
        color: var(--charcoal);
        line-height: 1.7;
        font-weight: 300;
    }

    .vpd-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .vpd-quantity {
        display: flex;
        align-items: center;
        border: 1px solid var(--sand);
        border-radius: 3px;
        background: var(--cream);
    }
    .vpd-qty-btn {
        width: 44px;
        height: 48px;
        background: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--earth);
        transition: background 0.15s;
    }
    .vpd-qty-btn:hover:not(:disabled) { background: var(--sand); }
    .vpd-qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .vpd-qty-value {
        width: 48px;
        text-align: center;
        font-size: 1rem;
        font-weight: 500;
        color: var(--charcoal);
    }

    .vpd-add-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        height: 48px;
        padding: 0 2rem;
        background: var(--charcoal);
        color: var(--white);
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.8rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-weight: 500;
        transition: background 0.2s, transform 0.12s;
    }
    .vpd-add-btn:hover:not(:disabled) { background: var(--black); transform: translateY(-1px); }
    .vpd-add-btn.added { background: #3B6D11; }
    .vpd-add-btn:disabled { background: var(--sand); color: var(--bark); cursor: not-allowed; }

    .vpd-wishlist-btn {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--cream);
        border: 1px solid var(--sand);
        border-radius: 3px;
        cursor: pointer;
        transition: background 0.2s, border-color 0.2s, transform 0.12s;
    }
    .vpd-wishlist-btn:hover { background: var(--sand); border-color: var(--bark); transform: translateY(-1px); }
    .vpd-wishlist-btn.active { background: #FCEBEB; border-color: #C8472A; }

    .vpd-meta {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    .vpd-meta-item {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-size: 0.8rem;
        color: var(--earth);
    }
    .vpd-meta-item svg { color: var(--bark); }

    .vpd-reviews {
        border-top: 1px solid var(--sand);
        padding-top: 2.5rem;
    }
    .vpd-reviews-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.5rem;
        color: var(--black);
        margin-bottom: 1.5rem;
    }
    .vpd-reviews-empty {
        text-align: center;
        padding: 3rem;
        background: var(--cream);
        border-radius: 4px;
        color: var(--bark);
    }
    .vpd-reviews-empty svg { margin-bottom: 1rem; opacity: 0.5; }
    .vpd-reviews-empty p { font-size: 0.9rem; }
    .vpd-reviews-hint { font-size: 0.8rem; margin-top: 0.5rem; }

    .vpd-loading {
        min-height: 60vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'DM Sans', sans-serif;
    }
    .vpd-loading-spinner {
        width: 36px;
        height: 36px;
        border: 3px solid var(--sand);
        border-top-color: var(--gold);
        border-radius: 50%;
        animation: vpd-spin 0.9s linear infinite;
        margin-bottom: 1rem;
    }
    @keyframes vpd-spin { to { transform: rotate(360deg); } }
    .vpd-loading p { font-size: 0.8rem; color: var(--bark); letter-spacing: 0.1em; }

    .vpd-error {
        min-height: 60vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'DM Sans', sans-serif;
        text-align: center;
    }
    .vpd-error h2 { font-family: 'Playfair Display', serif; color: var(--charcoal); margin-bottom: 1rem; }
    .vpd-back-link { color: var(--earth); text-decoration: none; font-size: 0.9rem; }
    .vpd-back-link:hover { color: var(--black); }

    @media (max-width: 768px) {
        .vpd-main { grid-template-columns: 1fr; gap: 2rem; }
        .vpd-title { font-size: 1.8rem; }
    }
`;
