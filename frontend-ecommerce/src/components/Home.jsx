import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const MARQUEE_ITEMS = [
    { text: 'Livraison Rapide 24/48h', accent: false },
    { text: '✦', accent: true },
    { text: 'Paiement 100% Sécurisé', accent: false },
    { text: '✦', accent: true },
    { text: 'Support Client 24/7', accent: false },
    { text: '✦', accent: true },
    { text: 'Nouvelle Collection Disponible', accent: false },
    { text: '✦', accent: true },
    { text: 'Retours Gratuits 30 Jours', accent: false },
    { text: '✦', accent: true },
];

const TRUST_ITEMS = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        ),
        title: 'Livraison Rapide',
        desc: 'Partout dans le pays en 24/48h, sans frais cachés.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                <path d="M2 11h20" />
            </svg>
        ),
        title: 'Paiement Sécurisé',
        desc: 'Transactions chiffrées 256-bit SSL. Vos données protégées.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
        ),
        title: 'Support 24/7',
        desc: 'Une équipe dédiée à votre écoute, tous les jours.',
    },
];

export default function Home() {
    const [visible, setVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [stats, setStats] = useState({ products: 0, orders: 0 });
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        fetchData();
        return () => clearTimeout(t);
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories')
            ]);
            
            const products = productsRes.data || [];
            const cats = categoriesRes.data || [];
            
            setCategories(cats.slice(0, 3));
            setFeaturedProducts(products.slice(0, 4));
            setStats({
                products: products.length,
                orders: 0
            });
        } catch (error) {
            console.error('Error fetching home data:', error);
            try {
                const productsRes = await api.get('/products');
                setFeaturedProducts(productsRes.data?.slice(0, 4) || []);
                setStats({ products: productsRes.data?.length || 0, orders: 0 });
            } catch (e) {
                console.error('Error fetching products:', e);
            }
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        toast.success(`${product.name} ajouté au panier`);
    };

    const handleWishlistToggle = async (product) => {
        if (isInWishlist(product.id)) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product.id);
        }
    };

    const fadeStyle = (delay) => ({
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    });

    const getCategoryBg = (index) => {
        const bgs = [
            'linear-gradient(160deg, #2C3D35 0%, #111A16 100%)',
            'linear-gradient(160deg, #3D3028 0%, #1A120E 100%)',
            'linear-gradient(160deg, #2A3544 0%, #111820 100%)',
        ];
        return bgs[index % bgs.length];
    };

    return (
        <>
            <style>{`
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

        body { font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--charcoal); }

        .vaux-display { font-family: 'Playfair Display', Georgia, serif; }

        /* HERO */
        .vaux-hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding-top: 0;
        }
        .vaux-hero-left {
          background: var(--cream);
          display: flex; flex-direction: column; justify-content: center;
          padding: 5rem 4rem 5rem 5rem;
          position: relative; overflow: hidden;
        }
        .vaux-hero-left::before {
          content: '';
          position: absolute; bottom: -80px; left: -80px;
          width: 340px; height: 340px;
          border-radius: 50%; background: var(--sand); opacity: 0.55;
          pointer-events: none;
        }
        .vaux-eyebrow {
          font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 1.4rem; font-weight: 500;
        }
        .vaux-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 4.5vw, 4.5rem);
          line-height: 1.08; color: var(--black); margin-bottom: 1.6rem;
          position: relative; z-index: 1;
        }
        .vaux-hero-title em { font-style: italic; color: var(--earth); }
        .vaux-hero-sub {
          font-size: 0.98rem; line-height: 1.8; color: var(--earth);
          max-width: 360px; margin-bottom: 2.5rem; font-weight: 300;
          position: relative; z-index: 1;
        }
        .vaux-ctas { display: flex; gap: 1rem; align-items: center; position: relative; z-index: 1; }
        .vaux-btn-primary {
          background: var(--charcoal); color: var(--white);
          padding: 1rem 2.2rem; font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;
          border: none; cursor: pointer; border-radius: 2px; text-decoration: none;
          display: inline-block; transition: background 0.2s, transform 0.15s;
        }
        .vaux-btn-primary:hover { background: var(--black); transform: translateY(-1px); }
        .vaux-hero-stats {
          margin-top: 3.5rem; display: flex; gap: 2.8rem;
          position: relative; z-index: 1;
        }
        .vaux-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; color: var(--black); font-weight: 700;
        }
        .vaux-stat-label {
          font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--bark); margin-top: 3px;
        }

        /* HERO RIGHT */
        .vaux-hero-right {
          background: var(--charcoal);
          position: relative; overflow: hidden;
          display: flex; align-items: flex-end; justify-content: flex-end;
          padding: 2.5rem;
        }
        .vaux-hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #3D3530 0%, #1A1410 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .vaux-hero-badge {
          position: absolute; top: 2.5rem; left: 2.5rem; z-index: 2;
          background: var(--accent); color: white;
          font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
          padding: 0.5rem 1rem; border-radius: 2px; font-weight: 500;
        }
        .vaux-product-card {
          position: relative; z-index: 2;
          background: rgba(253,250,247,0.07);
          border: 1px solid rgba(253,250,247,0.12);
          backdrop-filter: blur(18px);
          padding: 1.3rem 1.6rem; border-radius: 4px; max-width: 210px;
        }
        .vaux-product-tag {
          font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 0.45rem;
        }
        .vaux-product-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem; color: var(--white); margin-bottom: 0.55rem;
        }
        .vaux-product-price { font-size: 0.88rem; color: rgba(253,250,247,0.55); font-weight: 300; }

        /* Featured Products Grid */
        .vaux-hero-products {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            max-width: 340px;
        }
        .vaux-hero-prod {
            background: rgba(253,250,247,0.95);
            border-radius: 4px;
            padding: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .vaux-hero-prod-img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 3px;
            background: var(--sand);
        }
        .vaux-hero-prod-info {
            flex: 1;
            min-width: 0;
        }
        .vaux-hero-prod-name {
            font-size: 0.7rem;
            color: var(--charcoal);
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .vaux-hero-prod-price {
            font-size: 0.65rem;
            color: var(--earth);
        }

        /* MARQUEE */
        .vaux-marquee { background: var(--black); padding: 0.9rem 0; overflow: hidden; white-space: nowrap; }
        .vaux-marquee-inner { display: inline-block; animation: vaux-marquee 28s linear infinite; }
        .vaux-marquee-inner span {
          font-size: 0.68rem; letter-spacing: 0.24em; text-transform: uppercase;
          color: var(--bark); margin: 0 1.8rem;
        }
        .vaux-marquee-inner span.gold { color: var(--gold); }
        @keyframes vaux-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* TRUST STRIP */
        .vaux-trust {
          background: var(--white);
          display: grid; grid-template-columns: repeat(3, 1fr);
          border-bottom: 1px solid rgba(184,168,152,0.2);
        }
        .vaux-trust-item {
          display: flex; gap: 1.2rem; align-items: flex-start;
          padding: 2.8rem 3rem;
          border-right: 1px solid rgba(184,168,152,0.2);
        }
        .vaux-trust-item:last-child { border-right: none; }
        .vaux-trust-icon {
          width: 44px; height: 44px; flex-shrink: 0;
          background: var(--cream); border: 1px solid var(--sand);
          border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          color: var(--gold);
        }
        .vaux-trust-title {
          font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--black); margin-bottom: 0.4rem; font-weight: 500;
        }
        .vaux-trust-desc { font-size: 0.83rem; color: var(--earth); line-height: 1.65; font-weight: 300; }

        /* PRODUCTS SECTION */
        .vaux-section { padding: 5.5rem 5rem; }
        .vaux-section-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 3rem;
        }
        .vaux-section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.9rem, 3vw, 2.8rem); color: var(--black); line-height: 1.15;
        }
        .vaux-section-title em { font-style: italic; color: var(--earth); }
        .vaux-section-link {
          font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--earth); text-decoration: none;
          border-bottom: 1px solid var(--bark); padding-bottom: 2px;
          transition: color 0.2s;
        }
        .vaux-section-link:hover { color: var(--black); }
        
        .vaux-products-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }
        .vaux-prod-card {
            background: var(--white);
            border: 1px solid rgba(184,168,152,0.28);
            border-radius: 3px;
            overflow: hidden;
            transition: transform 0.22s, box-shadow 0.22s;
        }
        .vaux-prod-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 32px rgba(42,36,32,0.09);
        }
        .vaux-prod-img-wrap {
            height: 180px;
            background: var(--cream);
            position: relative;
            overflow: hidden;
        }
        .vaux-prod-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .vaux-prod-img-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--bark);
        }
        .vaux-prod-cat {
            position: absolute;
            top: 8px;
            left: 8px;
            font-size: 0.55rem;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            background: rgba(253,250,247,0.92);
            color: var(--earth);
            padding: 0.25rem 0.5rem;
            border-radius: 2px;
        }
        .vaux-prod-body {
            padding: 1rem;
        }
        .vaux-prod-name {
            font-family: 'Playfair Display', serif;
            font-size: 0.95rem;
            color: var(--black);
            margin-bottom: 0.4rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .vaux-prod-desc {
            font-size: 0.72rem;
            color: var(--earth);
            margin-bottom: 0.75rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .vaux-prod-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .vaux-prod-price {
            font-family: 'Playfair Display', serif;
            font-size: 1.1rem;
            color: var(--black);
            font-weight: 700;
        }
        .vaux-prod-add { padding: 0.4rem 0.8rem;
            background: var(--charcoal);
            color: var(--white);
            border: none;
            border-radius: 2px;
            font-size: 0.65rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            cursor: pointer;
            transition: background 0.2s;
        }
        .vaux-prod-add:hover { background: var(--black); }

        .vaux-prod-wishlist {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--cream);
            border: 1px solid var(--sand);
            border-radius: 2px;
            cursor: pointer;
            transition: all 0.2s;
            margin-left: 4px;
        }
        .vaux-prod-wishlist:hover { background: var(--sand); }
        .vaux-prod-wishlist.active { background: #FCEBEB; border-color: #C8472A; }

        /* CATEGORIES */
        .vaux-cat-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
        }
        .vaux-cat-card {
          position: relative; height: 280px; border-radius: 3px;
          overflow: hidden; cursor: pointer;
        }
        .vaux-cat-bg {
          position: absolute; inset: 0;
          transition: transform 0.5s ease;
        }
        .vaux-cat-card:hover .vaux-cat-bg { transform: scale(1.05); }
        .vaux-cat-decor {
          position: absolute; font-family: 'Playfair Display', serif;
          font-size: 8rem; font-weight: 700; color: white; opacity: 0.06;
          bottom: -0.5rem; right: 0.8rem; line-height: 1; pointer-events: none;
        }
        .vaux-cat-info {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 1.4rem 1.8rem;
          background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%);
        }
        .vaux-cat-count {
          font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.5); margin-bottom: 0.3rem;
        }
        .vaux-cat-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem; color: white; font-weight: 400;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .vaux-hero { grid-template-columns: 1fr; }
          .vaux-hero-right { min-height: 300px; }
          .vaux-hero-left { padding: 3.5rem 2rem; }
          .vaux-trust { grid-template-columns: 1fr; }
          .vaux-trust-item { border-right: none; border-bottom: 1px solid rgba(184,168,152,0.2); padding: 2rem; }
          .vaux-section { padding: 4rem 1.5rem; }
          .vaux-cat-grid { grid-template-columns: 1fr 1fr; }
          .vaux-cat-grid > :last-child { grid-column: span 2; }
          .vaux-products-grid { grid-template-columns: repeat(2, 1fr); }
          .vaux-hero-products { position: relative; transform: none; top: auto; left: auto; }
        }
        @media (max-width: 640px) {
          .vaux-cat-grid { grid-template-columns: 1fr; }
          .vaux-cat-grid > :last-child { grid-column: span 1; }
          .vaux-hero-stats { gap: 1.8rem; }
          .vaux-ctas { flex-direction: column; align-items: flex-start; }
          .vaux-products-grid { grid-template-columns: 1fr; }
        }
      `}</style>

            {/* HERO */}
            <section className="vaux-hero">
                <div className="vaux-hero-left">
                    <p className="vaux-eyebrow" style={fadeStyle(100)}>Nouvelle Collection — Printemps 2026</p>
                    <h1 className="vaux-hero-title" style={fadeStyle(250)}>
                        La qualité<br /><em>premium</em><br />à portée de clic.
                    </h1>
                    <p className="vaux-hero-sub" style={fadeStyle(400)}>
                        Des produits soigneusement sélectionnés pour répondre à vos exigences. Livraison rapide, retours gratuits, satisfaction garantie.
                    </p>
                    <div className="vaux-ctas" style={fadeStyle(540)}>
                        <Link to="/produits" className="vaux-btn-primary">Voir les produits</Link>
                    </div>
                    <div className="vaux-hero-stats" style={fadeStyle(680)}>
                        <div>
                            <div className="vaux-stat-num">{stats.products > 0 ? `${stats.products}+` : '14k+'}</div>
                            <div className="vaux-stat-label">Produits</div>
                        </div>
                        <div>
                            <div className="vaux-stat-num">98%</div>
                            <div className="vaux-stat-label">Satisfaction</div>
                        </div>
                        <div>
                            <div className="vaux-stat-num">60+</div>
                            <div className="vaux-stat-label">Pays livrés</div>
                        </div>
                    </div>
                </div>
                <div className="vaux-hero-right">
                    <div className="vaux-hero-bg">
                        <svg width="280" height="280" viewBox="0 0 280 280" fill="none" opacity="0.07">
                            <rect x="50" y="35" width="180" height="210" rx="4" stroke="white" strokeWidth="2.5"/>
                            <rect x="80" y="65" width="120" height="75" rx="2" stroke="white" strokeWidth="2"/>
                            <line x1="80" y1="168" x2="200" y2="168" stroke="white" strokeWidth="2"/>
                            <line x1="80" y1="188" x2="160" y2="188" stroke="white" strokeWidth="2"/>
                            <line x1="80" y1="208" x2="140" y2="208" stroke="white" strokeWidth="2"/>
                        </svg>
                    </div>
                    <span className="vaux-hero-badge">Livraison offerte dès 80€</span>
                    
                    {featuredProducts.length > 0 ? (
                        <div className="vaux-hero-products">
                            {featuredProducts.slice(0, 4).map((product) => (
                                <Link to={`/produit/${product.id}`} key={product.id} className="vaux-hero-prod">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="vaux-hero-prod-img" />
                                    ) : (
                                        <div className="vaux-hero-prod-img" style={{ background: 'var(--sand)' }} />
                                    )}
                                    <div className="vaux-hero-prod-info">
                                        <div className="vaux-hero-prod-name">{product.name}</div>
                                        <div className="vaux-hero-prod-price">{product.price?.toFixed(2)} €</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="vaux-product-card">
                            <div className="vaux-product-tag">Article vedette</div>
                            <div className="vaux-product-name">Tote en cuir artisanal</div>
                            <div className="vaux-product-price">À partir de 245€</div>
                        </div>
                    )}
                </div>
            </section>

            {/* MARQUEE */}
            <div className="vaux-marquee">
                <div className="vaux-marquee-inner">
                    {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                        <span key={i} className={item.accent ? 'gold' : ''}>{item.text}</span>
                    ))}
                </div>
            </div>

            {/* TRUST STRIP */}
            <div className="vaux-trust">
                {TRUST_ITEMS.map((item, i) => (
                    <div className="vaux-trust-item" key={i}>
                        <div className="vaux-trust-icon">{item.icon}</div>
                        <div>
                            <div className="vaux-trust-title">{item.title}</div>
                            <div className="vaux-trust-desc">{item.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FEATURED PRODUCTS */}
            {featuredProducts.length > 0 && (
                <section className="vaux-section">
                    <div className="vaux-section-header">
                        <h2 className="vaux-section-title">Produits<br /><em>Populaires</em></h2>
                        <Link to="/produits" className="vaux-section-link">Voir tout</Link>
                    </div>
                    <div className="vaux-products-grid">
                        {featuredProducts.slice(0, 8).map((product) => (
                            <div key={product.id} className="vaux-prod-card">
                                <Link to={`/produit/${product.id}`} className="vaux-prod-img-wrap">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="vaux-prod-img" />
                                    ) : (
                                        <div className="vaux-prod-img-placeholder">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                                                <polyline points="21 15 16 10 5 21"/>
                                            </svg>
                                        </div>
                                    )}
                                    {product.category?.name && (
                                        <span className="vaux-prod-cat">{product.category.name}</span>
                                    )}
                                </Link>
                                <div className="vaux-prod-body">
                                    <Link to={`/produit/${product.id}`} className="vaux-prod-name">{product.name}</Link>
                                    <p className="vaux-prod-desc">{product.description}</p>
                                    <div className="vaux-prod-footer">
                                        <span className="vaux-prod-price">{product.price?.toFixed(2)} €</span>
                                        <button 
                                            className="vaux-prod-add"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Ajouter
                                        </button>
                                        <button 
                                            className={`vaux-prod-wishlist ${isInWishlist(product.id) ? 'active' : ''}`}
                                            onClick={() => handleWishlistToggle(product)}
                                            title={isInWishlist(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? '#C8472A' : 'none'} stroke="currentColor" strokeWidth="2">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* CATEGORIES */}
            {categories.length > 0 && (
                <section className="vaux-section">
                    <div className="vaux-section-header">
                        <h2 className="vaux-section-title">Catégories<br /><em>Populaires</em></h2>
                        <Link to="/produits" className="vaux-section-link">Voir tout</Link>
                    </div>
                    <div className="vaux-cat-grid">
                        {categories.map((cat, i) => (
                            <Link to={`/produits?category=${cat.id}`} key={cat.id} style={{ textDecoration: 'none' }}>
                                <div className="vaux-cat-card">
                                    <div className="vaux-cat-bg" style={{ background: getCategoryBg(i) }} />
                                    <div className="vaux-cat-decor">0{i + 1}</div>
                                    <div className="vaux-cat-info">
                                        <div className="vaux-cat-count">{cat.productCount || cat.products?.length || 0} articles</div>
                                        <div className="vaux-cat-name">{cat.name}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
