import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import toast from 'react-hot-toast';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const [added, setAdded] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('id');
    const [priceRange, setPriceRange] = useState('all');
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

    useEffect(() => { fetchProducts(); fetchCategories(); }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
            const initialQuantities = {};
            response.data.forEach(p => initialQuantities[p.id] = 1);
            setQuantities(initialQuantities);
        } catch { toast.error('Impossible de charger le catalogue.'); }
        finally { setLoading(false); }
    };

    const fetchCategories = async () => {
        try { const res = await api.get('/categories'); setCategories(res.data); } catch { }
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
        if (isInWishlist(product.id)) { await removeFromWishlist(product.id); }
        else { await addToWishlist(product.id); }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = filterCategory === 'all' || p.category?.id === parseInt(filterCategory);
        let matchesPrice = true;
        if (priceRange !== 'all') {
            const price = p.price || 0;
            if (priceRange === '0-50') matchesPrice = price < 50;
            else if (priceRange === '50-100') matchesPrice = price >= 50 && price < 100;
            else if (priceRange === '100-200') matchesPrice = price >= 100 && price < 200;
            else if (priceRange === '200+') matchesPrice = price >= 200;
        }
        return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'stock') return (b.stock || 0) - (a.stock || 0);
        return b.id - a.id;
    });

    if (loading) {
        return (
            <>
                <style>{baseStyles}</style>
                <div className="fpl-loading">
                    <div className="fpl-loading-inner">
                        <div className="fpl-loading-dot" style={{ animationDelay: '0ms' }} />
                        <div className="fpl-loading-dot" style={{ animationDelay: '150ms' }} />
                        <div className="fpl-loading-dot" style={{ animationDelay: '300ms' }} />
                    </div>
                    <p className="fpl-loading-text">Chargement du catalogue…</p>
                </div>
            </>
        );
    }

    return (
        <>
            <style>{baseStyles}</style>
            <div className="fpl-root">
                <header className="fpl-header">
                    <span className="fpl-eyebrow">Catalogue</span>
                    <h1 className="fpl-title">Notre <span className="hl">Collection</span></h1>
                    <p className="fpl-sub">{filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}</p>
                </header>

                <div className="fpl-filters">
                    <input type="text" placeholder="Rechercher..." value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)} className="fpl-search-input" />
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="fpl-select">
                        <option value="all">Toutes catégories</option>
                        {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                    </select>
                    <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="fpl-select">
                        <option value="all">Tous les prix</option>
                        <option value="0-50">Moins de 50€</option>
                        <option value="50-100">50€ - 100€</option>
                        <option value="100-200">100€ - 200€</option>
                        <option value="200+">200€ et plus</option>
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="fpl-select">
                        <option value="id">Plus récents</option>
                        <option value="name">Nom A-Z</option>
                        <option value="price-asc">Prix croissant</option>
                        <option value="price-desc">Prix décroissant</option>
                        <option value="stock">Stock</option>
                    </select>
                </div>

                <div className="fpl-divider" />

                {filteredProducts.length === 0 ? (
                    <div className="fpl-empty">
                        <p>Aucun produit disponible pour le moment.</p>
                    </div>
                ) : (
                    <div className="fpl-grid">
                        {filteredProducts.map((product) => {
                            const inStock = product.stock > 0;
                            const isAdded = added[product.id];
                            const qty = quantities[product.id] || 1;
                            return (
                                <div key={product.id} className="fpl-card">
                                    <Link to={`/produit/${product.id}`} className="fpl-card-img">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="fpl-img" />
                                        ) : (
                                            <div className="fpl-img-placeholder">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                                                    <polyline points="21 15 16 10 5 21"/>
                                                </svg>
                                            </div>
                                        )}
                                        {product.category?.name && <span className="fpl-cat-badge">{product.category.name}</span>}
                                        {!inStock && <div className="fpl-out-overlay">Rupture de stock</div>}
                                    </Link>
                                    <div className="fpl-card-body">
                                        <Link to={`/produit/${product.id}`} className="fpl-product-name">{product.name}</Link>
                                        <p className="fpl-product-desc">{product.description}</p>
                                        <div className="fpl-price-row">
                                            <span className="fpl-price">{product.price.toFixed(2)} €</span>
                                            <span className={`fpl-stock-badge ${inStock ? 'in' : 'out'}`}>
                                                {inStock ? 'En stock' : 'Rupture'}
                                            </span>
                                        </div>
                                        <div className="fpl-actions">
                                            <div className={`fpl-qty${!inStock ? ' disabled' : ''}`}>
                                                <button className="fpl-qty-btn" onClick={() => decrement(product.id)} disabled={!inStock || qty <= 1}>−</button>
                                                <input type="number" min="1" value={qty} onChange={(e) => handleQuantityChange(product.id, e.target.value)} disabled={!inStock} className="fpl-qty-input" />
                                                <button className="fpl-qty-btn" onClick={() => increment(product.id)} disabled={!inStock}>+</button>
                                            </div>
                                            <button onClick={() => handleAddToCart(product)} disabled={!inStock}
                                                className={`fpl-add-btn${!inStock ? ' disabled' : ''}${isAdded ? ' added' : ''}`}>
                                                {isAdded ? '✓ Ajouté !' : !inStock ? 'Indisponible' : 'Ajouter'}
                                            </button>
                                            <button onClick={() => handleWishlistToggle(product)}
                                                className={`fpl-wishlist-btn${isInWishlist(product.id) ? ' active' : ''}`}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? '#FF5E00' : 'none'} stroke="currentColor" strokeWidth="2">
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
    .fpl-root { max-width: 1200px; margin: 0 auto; padding: 2.5rem 1.5rem; font-family: 'Inter', sans-serif; }
    .fpl-header { margin-bottom: 2rem; }
    .fpl-eyebrow { font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: #FF5E00; margin-bottom: 0.55rem; font-weight: 600; }
    .fpl-title { font-family: 'Oswald', sans-serif; font-size: 2.2rem; color: #fff; line-height: 1.05; margin-bottom: 0.35rem; text-transform: uppercase; }
    .fpl-title .hl { color: #FF5E00; }
    .fpl-sub { font-size: 0.82rem; color: #6B6B6B; font-weight: 300; }
    .fpl-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 2.5rem; }
    .fpl-filters { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 1.5rem; align-items: center; }
    .fpl-search-input { flex: 1; min-width: 160px; padding: 0.65rem 1rem; border: 1px solid rgba(255,255,255,0.08); font-size: 0.82rem; background: rgba(255,255,255,0.04); color: #D4D4D4; font-family: 'Inter', sans-serif; }
    .fpl-search-input:focus { outline: none; border-color: #FF5E00; }
    .fpl-search-input::placeholder { color: #6B6B6B; }
    .fpl-select { padding: 0.65rem 1rem; border: 1px solid rgba(255,255,255,0.08); font-size: 0.78rem; background: rgba(255,255,255,0.04); color: #B8B8B8; cursor: pointer; font-family: 'Inter', sans-serif; }
    .fpl-select:focus { outline: none; border-color: #FF5E00; }
    .fpl-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .fpl-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); overflow: hidden; display: flex; flex-direction: column; transition: all 0.25s; }
    .fpl-card:hover { transform: translateY(-4px); border-color: rgba(255,94,0,0.3); box-shadow: 0 16px 32px rgba(0,0,0,0.4); }
    .fpl-card-img { position: relative; height: 200px; background: #111111; overflow: hidden; }
    .fpl-img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(60%) contrast(1.1); transition: all 0.5s ease; }
    .fpl-card:hover .fpl-img { filter: grayscale(0%) contrast(1); transform: scale(1.05); }
    .fpl-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #111111; color: #6B6B6B; }
    .fpl-cat-badge { position: absolute; top: 8px; left: 8px; font-size: 0.55rem; letter-spacing: 0.18em; text-transform: uppercase; background: rgba(10,10,10,0.85); color: #B8B8B8; padding: 0.25rem 0.5rem; border: 1px solid rgba(255,255,255,0.06); }
    .fpl-out-overlay { position: absolute; inset: 0; background: rgba(10,10,10,0.75); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #B8B8B8; }
    .fpl-card-body { padding: 1.2rem; display: flex; flex-direction: column; flex: 1; }
    .fpl-product-name { font-family: 'Oswald', sans-serif; font-size: 1rem; color: #fff; line-height: 1.3; margin-bottom: 0.45rem; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-decoration: none; }
    .fpl-product-name:hover { color: #FF5E00; }
    .fpl-product-desc { font-size: 0.75rem; color: #6B6B6B; font-weight: 300; line-height: 1.6; flex: 1; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .fpl-price-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .fpl-price { font-family: 'Oswald', sans-serif; font-size: 1.2rem; color: #FF5E00; font-weight: 600; }
    .fpl-stock-badge { font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 500; padding: 0.25rem 0.6rem; }
    .fpl-stock-badge.in { background: rgba(59,109,17,0.2); color: #4CAF50; }
    .fpl-stock-badge.out { background: rgba(163,45,45,0.2); color: #E24B4A; }
    .fpl-actions { display: flex; gap: 6px; align-items: stretch; }
    .fpl-qty { display: flex; align-items: center; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); overflow: hidden; }
    .fpl-qty.disabled { opacity: 0.4; }
    .fpl-qty-btn { width: 28px; height: 34px; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #B8B8B8; font-size: 1rem; transition: background 0.15s; }
    .fpl-qty-btn:hover:not(:disabled) { background: rgba(255,255,255,0.06); }
    .fpl-qty-btn:disabled { cursor: not-allowed; opacity: 0.4; }
    .fpl-qty-input { width: 32px; height: 34px; border: none; background: transparent; text-align: center; outline: none; font-family: 'Inter', sans-serif; font-size: 0.82rem; color: #D4D4D4; -moz-appearance: textfield; }
    .fpl-qty-input::-webkit-outer-spin-button, .fpl-qty-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    .fpl-add-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0 0.8rem; height: 34px; background: #FF5E00; color: #0A0A0A; border: none; cursor: pointer; font-family: 'Oswald', sans-serif; font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; transition: all 0.18s; white-space: nowrap; }
    .fpl-add-btn:hover:not(.disabled):not(.added) { background: #FF7A2E; }
    .fpl-add-btn.added { background: #3B6D11; color: #fff; }
    .fpl-add-btn.disabled { background: rgba(255,255,255,0.06); color: #6B6B6B; cursor: not-allowed; }
    .fpl-wishlist-btn { width: 36px; height: 34px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); cursor: pointer; transition: all 0.2s; color: #6B6B6B; }
    .fpl-wishlist-btn:hover { background: rgba(255,94,0,0.1); border-color: rgba(255,94,0,0.2); color: #FF5E00; }
    .fpl-wishlist-btn.active { background: rgba(255,94,0,0.12); border-color: #FF5E00; }
    .fpl-empty { text-align: center; padding: 5rem 0; color: #6B6B6B; }
    .fpl-loading { min-height: calc(100vh - 64px); display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0A0A0A; font-family: 'Inter', sans-serif; }
    .fpl-loading-inner { display: flex; gap: 8px; margin-bottom: 1.2rem; }
    .fpl-loading-dot { width: 8px; height: 8px; border-radius: 50%; background: #FF5E00; animation: fpl-pulse 1.2s ease-in-out infinite; }
    @keyframes fpl-pulse { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1);opacity:1} }
    .fpl-loading-text { font-size: 0.78rem; letter-spacing: 0.2em; text-transform: uppercase; color: #6B6B6B; }
    @media (max-width: 1024px) { .fpl-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 768px) { .fpl-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 480px) { .fpl-grid { grid-template-columns: 1fr; } }
`;
