import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const CartIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
);

const MinusIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const PlusIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const [added, setAdded] = useState({});
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
            const initialQuantities = {};
            response.data.forEach(p => initialQuantities[p.id] = 1);
            setQuantities(initialQuantities);
        } catch {
            toast.error('Impossible de charger le catalogue.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (id, value) => {
        const val = parseInt(value, 10);
        setQuantities(prev => ({ ...prev, [id]: isNaN(val) || val < 1 ? 1 : val }));
    };

    const increment = (id) => setQuantities(prev => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
    const decrement = (id) => setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) - 1) }));

    const handleAddToCart = (product) => {
        addToCart(product, quantities[product.id]);
        setAdded(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => setAdded(prev => ({ ...prev, [product.id]: false })), 1400);
    };

    const handleWishlistToggle = async (product) => {
        if (isInWishlist(product.id)) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product.id);
        }
    };

    if (loading) {
        return (
            <>
                <style>{baseStyles}</style>
                <div className="vpl-loading">
                    <div className="vpl-loading-inner">
                        <div className="vpl-loading-dot" style={{ animationDelay: '0ms' }} />
                        <div className="vpl-loading-dot" style={{ animationDelay: '150ms' }} />
                        <div className="vpl-loading-dot" style={{ animationDelay: '300ms' }} />
                    </div>
                    <p className="vpl-loading-text">Chargement du catalogue…</p>
                </div>
            </>
        );
    }

    return (
        <>
            <style>{baseStyles}</style>
            <div className="vpl-root">

                {/* HEADER */}
                <header className="vpl-header">
                    <div className="vpl-eyebrow">Catalogue</div>
                    <h1 className="vpl-title">Notre <em>Collection</em></h1>
                    <p className="vpl-sub">{products.length} produit{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}</p>
                </header>

                <div className="vpl-divider" />

                {/* GRID */}
                {products.length === 0 ? (
                    <div className="vpl-empty">
                        <div className="vpl-empty-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            </svg>
                        </div>
                        <p className="vpl-empty-text">Aucun produit disponible pour le moment.</p>
                    </div>
                ) : (
                    <div className="vpl-grid">
                        {products.map((product) => {
                            const inStock = product.stock > 0;
                            const isAdded = added[product.id];
                            const qty = quantities[product.id] || 1;

                            return (
                                <div key={product.id} className="vpl-card">
                                    {/* IMAGE */}
                                    <Link to={`/produit/${product.id}`} className="vpl-card-img">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="vpl-img" />
                                        ) : (
                                            <div className="vpl-img-placeholder">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.25 }}>
                                                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                                                    <polyline points="21 15 16 10 5 21"/>
                                                </svg>
                                            </div>
                                        )}
                                        {product.category?.name && (
                                            <span className="vpl-cat-badge">{product.category.name}</span>
                                        )}
                                        {!inStock && (
                                            <div className="vpl-out-overlay">Rupture de stock</div>
                                        )}
                                    </Link>

                                    {/* BODY */}
                                    <div className="vpl-card-body">
                                        <Link to={`/produit/${product.id}`} className="vpl-product-name">{product.name}</Link>
                                        <p className="vpl-product-desc">{product.description}</p>

                                        <div className="vpl-price-row">
                                            <span className="vpl-price">{product.price.toFixed(2)} €</span>
                                            <span className={`vpl-stock-badge ${inStock ? 'in' : 'out'}`}>
                                                {inStock ? 'En stock' : 'Rupture'}
                                            </span>
                                        </div>

                                        {/* QUANTITY + ADD */}
                                        <div className="vpl-actions">
                                            <div className={`vpl-qty${!inStock ? ' disabled' : ''}`}>
                                                <button
                                                    className="vpl-qty-btn"
                                                    onClick={() => decrement(product.id)}
                                                    disabled={!inStock || qty <= 1}
                                                    aria-label="Diminuer"
                                                >
                                                    <MinusIcon />
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={qty}
                                                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                    disabled={!inStock}
                                                    className="vpl-qty-input"
                                                />
                                                <button
                                                    className="vpl-qty-btn"
                                                    onClick={() => increment(product.id)}
                                                    disabled={!inStock}
                                                    aria-label="Augmenter"
                                                >
                                                    <PlusIcon />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={!inStock}
                                                className={`vpl-add-btn${!inStock ? ' disabled' : ''}${isAdded ? ' added' : ''}`}
                                            >
                                                {isAdded ? (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"/>
                                                    </svg>
                                                ) : (
                                                    <CartIcon />
                                                )}
                                                <span>{!inStock ? 'Indisponible' : isAdded ? 'Ajouté !' : 'Ajouter'}</span>
                                            </button>
                                            <button
                                                onClick={() => handleWishlistToggle(product)}
                                                className={`vpl-wishlist-btn${isInWishlist(product.id) ? ' active' : ''}`}
                                                title={isInWishlist(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? '#C8472A' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                                </svg>
                                            </button>
                                        </div>
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

    .vpl-root {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2.5rem 0;
        font-family: 'DM Sans', sans-serif;
    }

    /* HEADER */
    .vpl-header { margin-bottom: 2rem; }
    .vpl-eyebrow {
        font-size: 0.65rem; letter-spacing: 0.24em; text-transform: uppercase;
        color: var(--gold); margin-bottom: 0.55rem;
    }
    .vpl-title {
        font-family: 'Playfair Display', serif;
        font-size: 2.2rem; color: var(--black); line-height: 1.15;
        margin-bottom: 0.35rem;
    }
    .vpl-title em { font-style: italic; color: var(--earth); }
    .vpl-sub { font-size: 0.85rem; color: var(--bark); font-weight: 300; }
    .vpl-divider { height: 1px; background: var(--sand); margin-bottom: 2.5rem; }

    /* GRID */
    .vpl-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
    }

    /* CARD */
    .vpl-card {
        background: var(--white);
        border: 1px solid rgba(184,168,152,0.28);
        border-radius: 3px;
        overflow: hidden;
        display: flex; flex-direction: column;
        transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
    }
    .vpl-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 32px rgba(42,36,32,0.09);
        border-color: var(--bark);
    }

    /* IMAGE */
    .vpl-card-img {
        position: relative;
        height: 200px;
        background: var(--cream);
        overflow: hidden;
    }
    .vpl-img {
        width: 100%; height: 100%; object-fit: cover;
        transition: transform 0.45s ease;
    }
    .vpl-card:hover .vpl-img { transform: scale(1.04); }
    .vpl-img-placeholder {
        width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center;
        background: var(--sand);
        color: var(--bark);
    }
    .vpl-cat-badge {
        position: absolute; top: 10px; left: 10px;
        font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase;
        background: rgba(253,250,247,0.92);
        color: var(--earth); font-weight: 500;
        padding: 0.3rem 0.7rem; border-radius: 2px;
        backdrop-filter: blur(6px);
        border: 1px solid rgba(184,168,152,0.25);
    }
    .vpl-out-overlay {
        position: absolute; inset: 0;
        background: rgba(245,240,232,0.75);
        display: flex; align-items: center; justify-content: center;
        font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase;
        color: var(--earth); font-weight: 500;
        backdrop-filter: blur(2px);
    }

    /* CARD BODY */
    .vpl-card-body {
        padding: 1.2rem 1.2rem 1.4rem;
        display: flex; flex-direction: column; flex: 1;
    }
    .vpl-product-name {
        font-family: 'Playfair Display', serif;
        font-size: 1rem; color: var(--black);
        line-height: 1.3; margin-bottom: 0.45rem;
        display: -webkit-box; -webkit-line-clamp: 1;
        -webkit-box-orient: vertical; overflow: hidden;
        text-decoration: none;
        transition: color 0.2s;
    }
    .vpl-product-name:hover { color: var(--earth); }
    .vpl-product-desc {
        font-size: 0.78rem; color: var(--earth); font-weight: 300;
        line-height: 1.6; flex: 1; margin-bottom: 1rem;
        display: -webkit-box; -webkit-line-clamp: 2;
        -webkit-box-orient: vertical; overflow: hidden;
    }
    .vpl-price-row {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 1rem;
    }
    .vpl-price {
        font-family: 'Playfair Display', serif;
        font-size: 1.25rem; color: var(--black); font-weight: 700;
    }
    .vpl-stock-badge {
        font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase;
        font-weight: 500; padding: 0.28rem 0.65rem; border-radius: 2px;
    }
    .vpl-stock-badge.in { background: #EAF3DE; color: #3B6D11; }
    .vpl-stock-badge.out { background: #FCEBEB; color: #A32D2D; }

    /* QUANTITY + ADD */
    .vpl-actions { display: flex; gap: 8px; align-items: stretch; }

    .vpl-qty {
        display: flex; align-items: center;
        border: 1px solid var(--sand); border-radius: 2px;
        background: var(--cream); overflow: hidden;
    }
    .vpl-qty.disabled { opacity: 0.45; }
    .vpl-qty-btn {
        width: 30px; height: 36px;
        background: transparent; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        color: var(--earth);
        transition: background 0.15s;
    }
    .vpl-qty-btn:hover:not(:disabled) { background: var(--sand); }
    .vpl-qty-btn:disabled { cursor: not-allowed; opacity: 0.4; }
    .vpl-qty-input {
        width: 36px; height: 36px;
        border: none; background: transparent;
        text-align: center; outline: none;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.85rem; color: var(--charcoal);
        -moz-appearance: textfield;
    }
    .vpl-qty-input::-webkit-outer-spin-button,
    .vpl-qty-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

    .vpl-add-btn {
        flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        padding: 0 1rem; height: 36px;
        background: var(--charcoal); color: var(--white);
        border: none; border-radius: 2px; cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.73rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500;
        transition: background 0.18s, transform 0.12s;
        white-space: nowrap;
    }
    .vpl-add-btn:hover:not(.disabled):not(.added) {
        background: var(--black); transform: translateY(-1px);
    }
    .vpl-add-btn.added { background: #3B6D11; }
    .vpl-add-btn.disabled {
        background: var(--sand); color: var(--bark); cursor: not-allowed;
    }

    .vpl-wishlist-btn {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--cream);
        border: 1px solid var(--sand);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .vpl-wishlist-btn:hover {
        background: var(--sand);
        transform: translateY(-1px);
    }
    .vpl-wishlist-btn.active {
        background: #FCEBEB;
        border-color: #C8472A;
    }

    /* EMPTY */
    .vpl-empty {
        text-align: center; padding: 5rem 0;
    }
    .vpl-empty-icon {
        width: 64px; height: 64px; border-radius: 50%;
        background: var(--sand);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 1.2rem; color: var(--bark);
    }
    .vpl-empty-text {
        font-size: 0.9rem; color: var(--bark); font-weight: 300;
    }

    /* LOADING */
    .vpl-loading {
        min-height: calc(100vh - 68px);
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        background: var(--cream);
        font-family: 'DM Sans', sans-serif;
    }
    .vpl-loading-inner { display: flex; gap: 8px; margin-bottom: 1.2rem; }
    .vpl-loading-dot {
        width: 8px; height: 8px; border-radius: 50%;
        background: var(--gold);
        animation: vpl-pulse 1.2s ease-in-out infinite;
    }
    @keyframes vpl-pulse {
        0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
        40% { transform: scale(1); opacity: 1; }
    }
    .vpl-loading-text {
        font-size: 0.8rem; letter-spacing: 0.18em; text-transform: uppercase;
        color: var(--bark);
    }

    @media (max-width: 1024px) { .vpl-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 768px)  { .vpl-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 480px)  { .vpl-grid { grid-template-columns: 1fr; } }
`;