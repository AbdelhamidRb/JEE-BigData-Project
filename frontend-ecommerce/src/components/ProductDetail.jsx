import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [hasUserReviewed, setHasUserReviewed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

    useEffect(() => { fetchProductData(); }, [id]);

    const fetchProductData = async () => {
        setLoading(true);
        try {
            const [productRes, reviewsRes] = await Promise.all([
                api.get(`/products/${id}`),
                api.get(`/products/${id}/reviews`).catch(() => ({ data: [] }))
            ]);
            if (productRes.data) {
                setProduct(productRes.data);
                const reviewsData = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];
                setReviews(reviewsData);
                const storedUser = localStorage.getItem('user');
                if (storedUser && reviewsData.length > 0) {
                    let currentUser;
                    try { currentUser = JSON.parse(storedUser); } catch (e) { currentUser = storedUser; }
                    const alreadyReviewed = reviewsData.some(r => {
                        if (!r.user) return false;
                        if (typeof currentUser === 'object') {
                            return r.user.id == currentUser.id || r.user.username === currentUser.username || r.user.email === currentUser.email;
                        } else {
                            return r.user.username === currentUser || r.user.email === currentUser;
                        }
                    });
                    setHasUserReviewed(alreadyReviewed);
                }
            }
        } catch (error) {
            toast.error('Erreur de connexion au serveur');
        } finally { setLoading(false); }
    };

    const handleAddToCart = () => { addToCart(product, quantity); setAdded(true); setTimeout(() => setAdded(false), 1500); };
    const handleWishlistToggle = async (productId) => {
        if (isInWishlist(productId)) { await removeFromWishlist(productId); }
        else { await addToWishlist(productId); }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return toast.error('Veuillez écrire un commentaire');
        setSubmitting(true);
        try {
            const response = await api.post(`/products/${id}/reviews`, { rating, comment });
            setReviews([response.data, ...reviews]);
            setHasUserReviewed(true);
            setComment(''); setRating(5);
            toast.success('Votre avis a été publié !');
        } catch (error) {
            if (error.response?.status === 400) { toast.error(error.response.data || 'Vous avez déjà publié un avis.'); setHasUserReviewed(true); }
            else { toast.error('Erreur lors de la publication.'); }
        } finally { setSubmitting(false); }
    };

    const increment = () => setQuantity(q => Math.min(q + 1, product?.stock || 1));
    const decrement = () => setQuantity(q => Math.max(1, q - 1));
    const images = product?.imageUrl ? [product.imageUrl, product.imageUrl, product.imageUrl].slice(0, 3) : [];

    if (loading) {
        return (
            <>
                <style>{baseStyles}</style>
                <div className="fpd-loading">
                    <div className="fpd-loading-spinner" />
                    <p>Chargement du produit...</p>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <style>{baseStyles}</style>
                <div className="fpd-error">
                    <h2>Produit non trouvé</h2>
                    <Link to="/produits">← Retour au catalogue</Link>
                </div>
            </>
        );
    }

    const inStock = product.stock > 0;

    return (
        <>
            <style>{baseStyles}</style>
            <div className="fpd-root">
                <div className="fpd-breadcrumb">
                    <Link to="/">Accueil</Link> <span>/</span>
                    <Link to="/produits">Catalogue</Link> <span>/</span>
                    <span>{product.name}</span>
                </div>

                <div className="fpd-main">
                    <div className="fpd-gallery">
                        <div className="fpd-main-image">
                            {images.length > 0 ? (
                                <img src={images[0]} alt={product.name} />
                            ) : (
                                <div className="fpd-img-placeholder">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                                        <polyline points="21 15 16 10 5 21"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="fpd-info">
                        <div className="fpd-category">{product.category?.name || 'Non catégorisé'}</div>
                        <h1 className="fpd-title">{product.name}</h1>
                        <div className="fpd-price-row">
                            <span className="fpd-price">{product.price?.toFixed(2)} €</span>
                            <span className={`fpd-stock ${inStock ? 'in' : 'out'}`}>
                                {inStock ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
                            </span>
                        </div>

                        <div className="fpd-description">
                            <h3>Description</h3>
                            <p>{product.description || 'Aucune description disponible.'}</p>
                        </div>

                        <div className="fpd-actions">
                            <div className="fpd-quantity">
                                <button onClick={decrement} disabled={quantity <= 1} className="fpd-qty-btn">−</button>
                                <span className="fpd-qty-value">{quantity}</span>
                                <button onClick={increment} disabled={quantity >= product.stock} className="fpd-qty-btn">+</button>
                            </div>
                            <button onClick={handleAddToCart} disabled={!inStock}
                                className={`fpd-add-btn ${added ? 'added' : ''}`}>
                                {added ? '✓ Ajouté !' : 'Ajouter au panier'}
                            </button>
                            <button onClick={() => handleWishlistToggle(product.id)}
                                className={`fpd-wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? '#FF5E00' : 'none'} stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                            </button>
                        </div>

                        <div className="fpd-meta">
                            <div className="fpd-meta-item">Référence: {product.id}</div>
                            {product.category && <div className="fpd-meta-item">Catégorie: {product.category.name}</div>}
                        </div>
                    </div>
                </div>

                <section className="fpd-reviews">
                    <h2 className="fpd-reviews-title">Avis Clients ({reviews.length})</h2>
                    {!hasUserReviewed ? (
                        <form className="fpd-review-form" onSubmit={handleSubmitReview}>
                            <h3>Laisser un avis</h3>
                            <div className="fpd-rating-input">
                                <label>Note :</label>
                                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                    <option value={5}>5 ★ - Excellent</option>
                                    <option value={4}>4 ★ - Très bien</option>
                                    <option value={3}>3 ★ - Bien</option>
                                    <option value={2}>2 ★ - Moyen</option>
                                    <option value={1}>1 ★ - Décevant</option>
                                </select>
                            </div>
                            <textarea placeholder="Partagez votre expérience avec ce produit..." value={comment}
                                onChange={(e) => setComment(e.target.value)} rows="4" required />
                            <button type="submit" disabled={submitting} className="fpd-submit-review">
                                {submitting ? 'Envoi en cours...' : 'Publier mon avis'}
                            </button>
                        </form>
                    ) : (
                        <div className="fpd-already-reviewed">
                            <p>Vous avez déjà partagé votre avis sur ce produit. Merci !</p>
                        </div>
                    )}
                    <div className="fpd-reviews-list">
                        {reviews.length > 0 ? reviews.map((review, index) => (
                            <div key={index} className="fpd-review-card">
                                <div className="fpd-review-header">
                                    <span className="fpd-review-author">{review.user?.username || 'Client'}</span>
                                    <span className="fpd-review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                </div>
                                <p className="fpd-review-text">{review.comment}</p>
                                <span className="fpd-review-date">{new Date(review.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                        )) : (
                            <div className="fpd-reviews-empty">
                                <p>Aucun avis pour ce produit. Soyez le premier !</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}

const baseStyles = `
    .fpd-root { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem 4rem; font-family: 'Inter', sans-serif; }
    .fpd-breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.72rem; color: #6B6B6B; margin-bottom: 2rem; }
    .fpd-breadcrumb a { color: #B8B8B8; text-decoration: none; transition: color 0.2s; }
    .fpd-breadcrumb a:hover { color: #FF5E00; }
    .fpd-main { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 4rem; }
    .fpd-gallery { display: flex; flex-direction: column; gap: 1rem; }
    .fpd-main-image { aspect-ratio: 1; background: #1A1A1A; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.04); }
    .fpd-main-image img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(40%); transition: filter 0.5s ease; }
    .fpd-main-image img:hover { filter: grayscale(0%); }
    .fpd-img-placeholder { color: #6B6B6B; background: #1A1A1A; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
    .fpd-category { font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: #FF5E00; margin-bottom: 0.5rem; font-weight: 600; }
    .fpd-title { font-family: 'Oswald', sans-serif; font-size: 2.2rem; color: #fff; line-height: 1.05; margin-bottom: 1.25rem; text-transform: uppercase; }
    .fpd-price-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .fpd-price { font-family: 'Oswald', sans-serif; font-size: 1.85rem; font-weight: 600; color: #FF5E00; }
    .fpd-stock { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; padding: 0.35rem 0.7rem; font-weight: 500; }
    .fpd-stock.in { background: rgba(59,109,17,0.2); color: #4CAF50; }
    .fpd-stock.out { background: rgba(163,45,45,0.2); color: #E24B4A; }
    .fpd-description { margin-bottom: 2rem; }
    .fpd-description h3 { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #B8B8B8; margin-bottom: 0.75rem; font-weight: 500; }
    .fpd-description p { font-size: 0.9rem; color: #B8B8B8; line-height: 1.7; font-weight: 300; }
    .fpd-actions { display: flex; gap: 0.8rem; margin-bottom: 2rem; }
    .fpd-quantity { display: flex; align-items: center; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); }
    .fpd-qty-btn { width: 42px; height: 46px; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #B8B8B8; font-size: 1.2rem; transition: background 0.15s; }
    .fpd-qty-btn:hover:not(:disabled) { background: rgba(255,255,255,0.06); }
    .fpd-qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .fpd-qty-value { width: 44px; text-align: center; font-size: 1rem; font-weight: 500; color: #D4D4D4; }
    .fpd-add-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.6rem; height: 46px; padding: 0 2rem; background: #FF5E00; color: #0A0A0A; border: none; cursor: pointer; font-family: 'Oswald', sans-serif; font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; transition: all 0.2s; }
    .fpd-add-btn:hover:not(:disabled) { background: #FF7A2E; }
    .fpd-add-btn.added { background: #3B6D11; color: #fff; }
    .fpd-add-btn:disabled { background: rgba(255,255,255,0.06); color: #6B6B6B; cursor: not-allowed; }
    .fpd-wishlist-btn { width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); cursor: pointer; transition: all 0.2s; color: #6B6B6B; }
    .fpd-wishlist-btn:hover { background: rgba(255,94,0,0.1); border-color: rgba(255,94,0,0.2); color: #FF5E00; }
    .fpd-wishlist-btn.active { background: rgba(255,94,0,0.12); border-color: #FF5E00; }
    .fpd-meta { display: flex; flex-direction: column; gap: 0.75rem; }
    .fpd-meta-item { font-size: 0.78rem; color: #6B6B6B; }
    .fpd-reviews { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 2.5rem; }
    .fpd-reviews-title { font-family: 'Oswald', sans-serif; font-size: 1.5rem; color: #fff; margin-bottom: 1.5rem; text-transform: uppercase; }
    .fpd-review-form { background: #1A1A1A; padding: 1.5rem; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.04); }
    .fpd-review-form h3 { margin-bottom: 1rem; color: #D4D4D4; font-size: 0.85rem; font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.12em; }
    .fpd-rating-input { margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; color: #D4D4D4; }
    .fpd-rating-input select { padding: 0.4rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #D4D4D4; font-family: 'Inter', sans-serif; }
    .fpd-review-form textarea { width: 100%; padding: 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #D4D4D4; font-family: 'Inter', sans-serif; resize: vertical; box-sizing: border-box; }
    .fpd-submit-review { background: #FF5E00; color: #0A0A0A; padding: 0.8rem 1.5rem; border: none; cursor: pointer; font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.75rem; font-weight: 600; transition: background 0.2s; }
    .fpd-submit-review:hover { background: #FF7A2E; }
    .fpd-submit-review:disabled { opacity: 0.6; cursor: not-allowed; }
    .fpd-already-reviewed { background: rgba(59,109,17,0.15); color: #4CAF50; padding: 1.2rem; margin-bottom: 2rem; font-weight: 500; }
    .fpd-reviews-list { display: flex; flex-direction: column; gap: 1rem; }
    .fpd-review-card { padding: 1.5rem; border: 1px solid rgba(255,255,255,0.06); background: #1A1A1A; }
    .fpd-review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
    .fpd-review-author { font-weight: 500; color: #D4D4D4; }
    .fpd-review-rating { color: #FF5E00; letter-spacing: 0.1em; }
    .fpd-review-text { color: #B8B8B8; line-height: 1.6; margin-bottom: 1rem; font-size: 0.9rem; }
    .fpd-review-date { font-size: 0.72rem; color: #6B6B6B; }
    .fpd-reviews-empty { text-align: center; padding: 3rem; background: #1A1A1A; color: #6B6B6B; }
    .fpd-loading { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; background: #0A0A0A; }
    .fpd-loading-spinner { width: 36px; height: 36px; border: 3px solid rgba(255,255,255,0.06); border-top-color: #FF5E00; border-radius: 50%; animation: fpd-spin 0.9s linear infinite; margin-bottom: 1rem; }
    @keyframes fpd-spin { to { transform: rotate(360deg); } }
    .fpd-loading p { font-size: 0.78rem; color: #6B6B6B; }
    .fpd-error { text-align: center; padding: 5rem; font-family: 'Inter', sans-serif; }
    .fpd-error h2 { color: #fff; font-family: 'Oswald', sans-serif; margin-bottom: 1rem; }
    .fpd-error a { color: #FF5E00; text-decoration: none; }
    @media (max-width: 768px) { .fpd-main { grid-template-columns: 1fr; gap: 2rem; } .fpd-title { font-size: 1.8rem; } }
`;
