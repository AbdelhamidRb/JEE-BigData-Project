import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MARQUEE_ITEMS = [
    'Livraison Rapide 24/48h', '✦', 'Paiement 100% Sécurisé', '✦',
    'Support Client 24/7', '✦', 'Nouvelle Collection Disponible', '✦',
    'Retours Gratuits 30 Jours', '✦',
];

const TESTIMONIALS = [
    {
        initials: 'DK', name: 'David Kim', role: 'Software Engineer • 34 ans',
        text: 'Commande passée un dimanche soir, reçue le mardi matin. Le produit est encore plus beau en vrai. InsightCart, c\'est ma nouvelle référence.',
        tags: ['Livraison Rapide', 'Qualité'], result: '+18 kg', resultLabel: 'perdus',
    },
    {
        initials: 'AL', name: 'Amanda Lin', role: 'Marketing Director • 29 ans',
        text: 'Je cherchais des articles de qualité sans me ruiner. InsightCart m\'a fait redécouvrir le plaisir d\'acheter des objets qui durent. Service client exceptionnel.',
        tags: ['Qualité', 'Service'], result: '98%', resultLabel: 'satisfaite',
    },
    {
        initials: 'RP', name: 'Ryan Park', role: 'Entrepreneur • 41 ans',
        text: 'Je commande régulièrement sur InsightCart pour mes besoins pros et persos. La constance dans la qualité est impressionnante. Jamais déçu.',
        tags: ['Fidélité', 'Professionnel'], result: '60+', resultLabel: 'commandes',
    },
];

const CONTACT_INFO = {
    address: '123 Avenue des Champs-Élysées, 75008 Paris',
    email: 'contact@insightcart.fr',
    phone: '+33 1 23 45 67 89',
    hours: [
        { day: 'Lun – Ven', time: '9:00 – 19:00' },
        { day: 'Samedi', time: '10:00 – 18:00' },
    ],
};

export default function Home() {
    const [visible, setVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [stats, setStats] = useState({ products: 0, orders: 0 });
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
    const { isAuthenticated } = useContext(AuthContext);

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
            setCategories(categoriesRes.data?.slice(0, 3) || []);
            setFeaturedProducts(products.slice(0, 4));
            setStats({ products: products.length, orders: 0 });
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

    return (
        <>
            <style>{`
                .fh-root { background: #0A0A0A; font-family: 'Inter', sans-serif; color: #E0E0E0; overflow-x: hidden; }

                /* HERO */
                .fh-hero { min-height: 90vh; display: grid; grid-template-columns: 1fr 480px; position: relative; overflow: hidden; }
                .fh-hero-left { padding: 5rem 4rem; display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 2; background: #0A0A0A; }
                .fh-hero-label { display: inline-flex; align-items: center; gap: 10px; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #FF5E00; margin-bottom: 1.5rem; font-weight: 600; }
                .fh-hero-label::before { content: ''; width: 40px; height: 2px; background: #FF5E00; }
                .fh-hero-title { font-family: 'Oswald', sans-serif; font-size: clamp(3.5rem, 6vw, 5.5rem); font-weight: 700; line-height: 0.9; letter-spacing: -0.02em; color: #fff; margin-bottom: 0.5rem; text-transform: uppercase; }
                .fh-hero-title .hl { color: #FF5E00; }
                .fh-hero-sub { font-size: 0.9rem; color: #B8B8B8; max-width: 480px; line-height: 1.75; margin-bottom: 2.5rem; font-weight: 300; }
                .fh-hero-meta { display: flex; gap: 1.5rem; margin-bottom: 2.5rem; }
                .fh-hero-meta-box { border: 1px solid rgba(255,255,255,0.08); padding: 1rem 1.5rem; position: relative; background: rgba(255,255,255,0.02); }
                .fh-hero-meta-box::before { content: ''; position: absolute; top: 0; left: 0; width: 12px; height: 12px; border-top: 2px solid #FF5E00; border-left: 2px solid #FF5E00; }
                .fh-hero-meta-box::after { content: ''; position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; border-bottom: 2px solid #FF5E00; border-right: 2px solid #FF5E00; }
                .fh-hero-meta-val { font-family: 'Oswald', sans-serif; font-size: 1.75rem; font-weight: 700; color: #fff; line-height: 1; margin-bottom: 4px; }
                .fh-hero-meta-key { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: #6B6B6B; }
                .fh-hero-ctas { display: flex; gap: 1rem; }
                .fh-hero-btn-primary { background: #FF5E00; color: #0A0A0A; font-family: 'Oswald', sans-serif; font-weight: 600; font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 1rem 2.5rem; border: none; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; }
                .fh-hero-btn-primary:hover { background: #FF7A2E; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,94,0,0.3); }
                .fh-hero-btn-ghost { background: transparent; color: #D4D4D4; font-family: 'Oswald', sans-serif; font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 1rem 2rem; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; }
                .fh-hero-btn-ghost:hover { border-color: #FF5E00; color: #FF5E00; }

                .fh-hero-right { position: relative; border-left: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; overflow: hidden; background: #111111; }
                .fh-hero-right-bg { position: absolute; inset: 0; background: radial-gradient(circle at 50% 60%, rgba(255,94,0,0.06) 0%, transparent 65%); }
                .fh-hero-product-wrap { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 2.5rem; width: 100%; }
                .fh-hero-product-img { width: 100%; max-width: 320px; height: 320px; object-fit: contain; display: block; margin: 0 auto; }
                .fh-hero-product-img-placeholder { width: 100%; max-width: 320px; height: 320px; display: flex; align-items: center; justify-content: center; background: #1A1A1A; color: #6B6B6B; margin: 0 auto; }
                .fh-hero-product-tag { position: absolute; top: 30px; right: 30px; border: 1px solid #FF5E00; padding: 6px 12px; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: #FF5E00; background: rgba(255,94,0,0.08); }
                .fh-hero-product-info { text-align: center; }
                .fh-hero-product-name { font-family: 'Oswald', sans-serif; font-size: 1.1rem; font-weight: 600; color: #fff; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
                .fh-hero-product-price { font-family: 'Oswald', sans-serif; font-size: 1.8rem; font-weight: 700; color: #FF5E00; }
                .fh-hero-product-desc { font-size: 0.7rem; color: #6B6B6B; margin-top: 4px; }

                /* MARQUEE */
                .fh-marquee { background: #1A1A1A; padding: 0.8rem 0; overflow: hidden; white-space: nowrap; border-top: 1px solid rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.03); }
                .fh-marquee-inner { display: inline-block; animation: fh-marquee 28s linear infinite; }
                .fh-marquee-inner span { font-family: 'Oswald', sans-serif; font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase; color: #6B6B6B; margin: 0 1.5rem; font-weight: 400; }
                .fh-marquee-inner span.accent { color: #FF5E00; }
                @keyframes fh-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

                /* TRUST STRIP */
                .fh-trust { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid rgba(255,255,255,0.04); }
                .fh-trust-item { display: flex; gap: 1.2rem; align-items: flex-start; padding: 2.5rem 3rem; border-right: 1px solid rgba(255,255,255,0.04); }
                .fh-trust-item:last-child { border-right: none; }
                .fh-trust-icon { width: 44px; height: 44px; flex-shrink: 0; background: rgba(255,94,0,0.08); border: 1px solid rgba(255,94,0,0.15); display: flex; align-items: center; justify-content: center; color: #FF5E00; }
                .fh-trust-title { font-family: 'Oswald', sans-serif; font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; color: #fff; margin-bottom: 0.4rem; font-weight: 500; }
                .fh-trust-desc { font-size: 0.8rem; color: #6B6B6B; line-height: 1.65; font-weight: 300; }

                /* PRODUCTS SECTION */
                .fh-section { padding: 5rem 5rem; }
                .fh-section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
                .fh-section-eyebrow { font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: #FF5E00; margin-bottom: 0.6rem; font-weight: 600; }
                .fh-section-title { font-family: 'Oswald', sans-serif; font-size: clamp(2rem, 3vw, 2.8rem); color: #fff; line-height: 1.05; text-transform: uppercase; }
                .fh-section-title .hl { color: #FF5E00; }
                .fh-section-link { font-family: 'Oswald', sans-serif; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #B8B8B8; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 2px; transition: color 0.2s; }
                .fh-section-link:hover { color: #FF5E00; border-color: #FF5E00; }

                .fh-products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
                .fh-prod-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; transition: all 0.3s ease; cursor: pointer; }
                .fh-prod-card:hover { transform: translateY(-4px); border-color: rgba(255,94,0,0.4); box-shadow: 0 20px 40px rgba(255,94,0,0.1); }
                .fh-prod-img-wrap { height: 256px; background: #111111; position: relative; overflow: hidden; display: block; }
                .fh-prod-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
                .fh-prod-card:hover .fh-prod-img { transform: scale(1.05); }
                .fh-prod-img-gradient { position: absolute; inset: 0; background: linear-gradient(to top, #1A1A1A 0%, rgba(26,26,26,0.5) 50%, transparent 100%); pointer-events: none; z-index: 1; }
                .fh-prod-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #6B6B6B; background: #111111; }
                .fh-prod-cat { position: absolute; top: 16px; left: 16px; z-index: 2; display: flex; align-items: center; gap: 6px; background: rgba(10,10,10,0.8); padding: 0.375rem 0.75rem; backdrop-filter: blur(4px); }
                .fh-prod-cat-dot { width: 6px; height: 6px; border-radius: 50%; background: #FF5E00; flex-shrink: 0; }
                .fh-prod-cat-text { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #fff; }
                .fh-prod-wishlist-overlay { position: absolute; top: 16px; right: 16px; z-index: 2; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: rgba(10,10,10,0.8); backdrop-filter: blur(4px); cursor: pointer; border: none; color: #D4D4D4; transition: color 0.2s; }
                .fh-prod-wishlist-overlay:hover { color: #FF5E00; }
                .fh-prod-body { padding: 1.5rem; }
                .fh-prod-name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 0.75rem; }
                .fh-prod-icon { width: 18px; height: 18px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #FF5E00; }
                .fh-prod-name { font-family: 'Oswald', sans-serif; font-size: 1.25rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.025em; color: #fff; text-decoration: none; }
                .fh-prod-desc { font-size: 0.75rem; color: #B8B8B8; line-height: 1.625; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .fh-prod-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 1.25rem; }
                .fh-prod-tag { font-size: 9px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; background: rgba(255,255,255,0.05); color: #B8B8B8; padding: 0.25rem 0.625rem; }
                .fh-prod-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); }
                .fh-prod-price { font-family: 'Oswald', sans-serif; font-size: 1.5rem; font-weight: 700; color: #fff; }
                .fh-prod-price-unit { font-size: 0.75rem; color: #6B6B6B; margin-left: 4px; }
                .fh-prod-add { background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; color: #FF5E00; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; font-family: 'Inter', sans-serif; padding: 0; transition: gap 0.2s; }
                .fh-prod-add:hover { gap: 12px; }

                /* CATEGORIES */
                .fh-cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
                .fh-cat-card { position: relative; height: 280px; overflow: hidden; cursor: pointer; border: 1px solid rgba(255,255,255,0.04); }
                .fh-cat-bg { position: absolute; inset: 0; transition: transform 0.5s ease; }
                .fh-cat-card:hover .fh-cat-bg { transform: scale(1.05); }
                .fh-cat-decor { position: absolute; font-family: 'Oswald', sans-serif; font-size: 8rem; font-weight: 700; color: #fff; opacity: 0.04; bottom: -0.5rem; right: 0.8rem; line-height: 1; pointer-events: none; }
                .fh-cat-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.4rem 1.8rem; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%); }
                .fh-cat-count { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #6B6B6B; margin-bottom: 0.3rem; }
                .fh-cat-name { font-family: 'Oswald', sans-serif; font-size: 1.3rem; color: #fff; font-weight: 500; text-transform: uppercase; }

                /* TESTIMONIALS */
                .fh-testimonials { padding: 5rem 5rem; background: #111111; border-top: 1px solid rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.04); }
                .fh-testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
                .fh-testimonial-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); padding: 1.8rem; transition: all 0.25s; }
                .fh-testimonial-card:hover { border-color: rgba(255,94,0,0.2); transform: translateY(-3px); }
                .fh-testimonial-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
                .fh-testimonial-avatar { width: 44px; height: 44px; border-radius: 50%; background: rgba(255,94,0,0.1); border: 1px solid rgba(255,94,0,0.15); display: flex; align-items: center; justify-content: center; font-family: 'Oswald', sans-serif; font-size: 0.9rem; font-weight: 700; color: #FF5E00; flex-shrink: 0; }
                .fh-testimonial-name { font-size: 0.9rem; font-weight: 500; color: #fff; }
                .fh-testimonial-role { font-size: 0.68rem; color: #6B6B6B; }
                .fh-testimonial-text { font-size: 0.82rem; color: #B8B8B8; line-height: 1.75; font-weight: 300; margin-bottom: 1rem; font-style: italic; }
                .fh-testimonial-tags { display: flex; gap: 6px; flex-wrap: wrap; }
                .fh-testimonial-tag { font-size: 0.55rem; letter-spacing: 0.16em; text-transform: uppercase; background: rgba(255,94,0,0.08); color: #FF5E00; padding: 0.2rem 0.55rem; font-weight: 500; }

                /* CTA BANNER */
                .fh-cta-banner { padding: 5rem 5rem; background: #0A0A0A; position: relative; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.04); }
                .fh-cta-banner::before { content: ''; position: absolute; top: -100px; right: -100px; width: 500px; height: 500px; border-radius: 50%; border: 1px solid rgba(255,94,0,0.05); pointer-events: none; }
                .fh-cta-banner::after { content: ''; position: absolute; bottom: -150px; left: -150px; width: 400px; height: 400px; border-radius: 50%; border: 1px solid rgba(255,94,0,0.04); pointer-events: none; }
                .fh-cta-banner-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; text-align: center; }
                .fh-cta-banner-title { font-family: 'Oswald', sans-serif; font-size: clamp(2rem, 3.5vw, 3rem); color: #fff; line-height: 1.05; text-transform: uppercase; margin-bottom: 1rem; }
                .fh-cta-banner-title .hl { color: #FF5E00; }
                .fh-cta-banner-desc { font-size: 0.9rem; color: #6B6B6B; line-height: 1.8; margin-bottom: 2rem; max-width: 480px; margin-left: auto; margin-right: auto; }
                .fh-cta-banner-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

                /* FOOTER */
                .fh-footer { padding: 3rem 5rem 2rem; background: #111111; border-top: 1px solid rgba(255,255,255,0.04); }
                .fh-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 2.5rem; }
                .fh-footer-brand { font-family: 'Oswald', sans-serif; font-size: 1.3rem; color: #fff; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 8px; }
                .fh-footer-brand-mark { width: 26px; height: 26px; background: #FF5E00; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; color: #0A0A0A; }
                .fh-footer-desc { font-size: 0.78rem; color: #6B6B6B; line-height: 1.7; max-width: 280px; }
                .fh-footer-title { font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: #FF5E00; margin-bottom: 1rem; font-weight: 600; }
                .fh-footer-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
                .fh-footer-links a { font-size: 0.78rem; color: #6B6B6B; text-decoration: none; transition: color 0.2s; }
                .fh-footer-links a:hover { color: #FF5E00; }
                .fh-footer-contact { font-size: 0.78rem; color: #6B6B6B; line-height: 1.8; }
                .fh-footer-contact strong { color: #B8B8B8; font-weight: 500; }
                .fh-footer-bottom { padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.04); display: flex; justify-content: space-between; align-items: center; }
                .fh-footer-copy { font-size: 0.7rem; color: #6B6B6B; }
                .fh-footer-social { display: flex; gap: 0.8rem; }
                .fh-footer-social a { width: 36px; height: 36px; border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; color: #6B6B6B; transition: all 0.2s; }
                .fh-footer-social a:hover { border-color: #FF5E00; color: #FF5E00; }

                .fh-accent-line { width: 50px; height: 3px; background: #FF5E00; display: inline-block; margin-bottom: 0.6rem; }

                @media (max-width: 1024px) {
                    .fh-hero { grid-template-columns: 1fr; }
                    .fh-hero-right { min-height: 420px; padding: 2rem; }
                    .fh-hero-left { padding: 3.5rem 2rem; }
                    .fh-hero-meta { flex-wrap: wrap; gap: 1rem; }
                    .fh-trust { grid-template-columns: 1fr; }
                    .fh-trust-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.04); padding: 2rem; }
                    .fh-section { padding: 4rem 1.5rem; }
                    .fh-cat-grid { grid-template-columns: 1fr 1fr; }
                    .fh-cat-grid > :last-child { grid-column: span 2; }
                    .fh-products-grid { grid-template-columns: repeat(2, 1fr); }
                    .fh-testimonials { padding: 4rem 1.5rem; }
                    .fh-testimonials-grid { grid-template-columns: 1fr; }
                    .fh-cta-banner { padding: 4rem 1.5rem; }
                    .fh-footer { padding: 3rem 1.5rem 2rem; }
                    .fh-footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
                }
                @media (max-width: 640px) {
                    .fh-cat-grid { grid-template-columns: 1fr; }
                    .fh-cat-grid > :last-child { grid-column: span 1; }
                    .fh-hero-meta { flex-direction: column; gap: 0.75rem; }
                    .fh-hero-ctas { flex-direction: column; align-items: stretch; }
                    .fh-hero-ctas a { text-align: center; }
                    .fh-products-grid { grid-template-columns: 1fr; }
                    .fh-footer-grid { grid-template-columns: 1fr; }
                    .fh-footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
                }
            `}</style>

            <div className="fh-root">
                {/* ─── HERO ─── */}
                <section className="fh-hero">
                    <div className="fh-hero-left">
                        <div className="fh-hero-label" style={fadeStyle(100)}>
                            E-commerce Premium — Est. 2024
                        </div>
                        <h1 className="fh-hero-title" style={fadeStyle(250)}>
                            La qualité<br /><span className="hl">premium</span><br />à portée de clic.
                        </h1>
                        <p className="fh-hero-sub" style={fadeStyle(400)}>
                            Des produits soigneusement sélectionnés pour répondre à vos exigences. Livraison rapide, retours gratuits, satisfaction garantie.
                        </p>
                        <div className="fh-hero-meta" style={fadeStyle(540)}>
                            <div className="fh-hero-meta-box">
                                <div className="fh-hero-meta-val">{stats.products > 0 ? `${stats.products}+` : '14k+'}</div>
                                <div className="fh-hero-meta-key">Produits</div>
                            </div>
                            <div className="fh-hero-meta-box">
                                <div className="fh-hero-meta-val" style={{ color: '#FF5E00' }}>98%</div>
                                <div className="fh-hero-meta-key">Satisfaction</div>
                            </div>
                            <div className="fh-hero-meta-box">
                                <div className="fh-hero-meta-val" style={{ color: '#B8B8B8' }}>60+</div>
                                <div className="fh-hero-meta-key">Pays livrés</div>
                            </div>
                        </div>
                        <div className="fh-hero-ctas" style={fadeStyle(680)}>
                            <Link to="/produits" className="fh-hero-btn-primary">Découvrir les produits</Link>
                        </div>
                    </div>

                    <div className="fh-hero-right">
                        <div className="fh-hero-right-bg" />
                        {featuredProducts[0] ? (
                            <div className="fh-hero-product-wrap">
                                <div style={{ position: 'relative', width: '100%', maxWidth: 320, margin: '0 auto' }}>
                                    {featuredProducts[0].imageUrl ? (
                                        <img src={featuredProducts[0].imageUrl} alt={featuredProducts[0].name} className="fh-hero-product-img" />
                                    ) : (
                                        <div className="fh-hero-product-img-placeholder">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                        </div>
                                    )}
                                    <div className="fh-hero-product-tag">En Vedette</div>
                                </div>
                                <div className="fh-hero-product-info">
                                    <div className="fh-hero-product-name">{featuredProducts[0].name}</div>
                                    <div className="fh-hero-product-price">{featuredProducts[0].price?.toFixed(2)} €</div>
                                    {featuredProducts[0].category?.name && (
                                        <div className="fh-hero-product-desc">{featuredProducts[0].category.name}</div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: '#6B6B6B', fontSize: '0.85rem', zIndex: 2, position: 'relative' }}>Chargement des produits...</div>
                        )}
                    </div>
                </section>

                {/* ─── MARQUEE ─── */}
                <div className="fh-marquee">
                    <div className="fh-marquee-inner">
                        {[...Array(2)].flatMap(() => MARQUEE_ITEMS).map((item, i) => (
                            <span key={i} className={item === '✦' ? 'accent' : ''}>{item}</span>
                        ))}
                    </div>
                </div>

                {/* ─── TRUST STRIP ─── */}
                <div className="fh-trust">
                    {[
                        { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>, title: 'Livraison Rapide', desc: 'Partout dans le pays en 24/48h, sans frais cachés.' },
                        { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" /><path d="M2 11h20" /></svg>, title: 'Paiement Sécurisé', desc: 'Transactions chiffrées 256-bit SSL. Vos données protégées.' },
                        { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>, title: 'Support 24/7', desc: 'Une équipe dédiée à votre écoute, tous les jours.' },
                    ].map((item, i) => (
                        <div className="fh-trust-item" key={i}>
                            <div className="fh-trust-icon">{item.icon}</div>
                            <div>
                                <div className="fh-trust-title">{item.title}</div>
                                <div className="fh-trust-desc">{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ─── FEATURED PRODUCTS ─── */}
                {featuredProducts.length > 0 && (
                    <section className="fh-section">
                        <div className="fh-section-header">
                            <div>
                                <div className="fh-section-eyebrow">Collection</div>
                                <h2 className="fh-section-title">Produits <span className="hl">Populaires</span></h2>
                            </div>
                            <Link to="/produits" className="fh-section-link">Voir tout</Link>
                        </div>
                        <div className="fh-products-grid">
                            {featuredProducts.slice(0, 8).map((product) => (
                                <div key={product.id} className="fh-prod-card group">
                                    <Link to={`/produit/${product.id}`} className="fh-prod-img-wrap">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="fh-prod-img" />
                                        ) : (
                                            <div className="fh-prod-img-placeholder">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                            </div>
                                        )}
                                        <div className="fh-prod-img-gradient" />
                                        {product.category?.name && (
                                            <div className="fh-prod-cat">
                                                <div className="fh-prod-cat-dot" />
                                                <span className="fh-prod-cat-text">{product.category.name}</span>
                                            </div>
                                        )}
                                        <button className="fh-prod-wishlist-overlay"
                                            onClick={(e) => { e.preventDefault(); handleWishlistToggle(product); }}
                                            title={isInWishlist(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? '#FF5E00' : 'none'} stroke="currentColor" strokeWidth="2">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                            </svg>
                                        </button>
                                    </Link>
                                    <div className="fh-prod-body">
                                        <div className="fh-prod-name-row">
                                            <div className="fh-prod-icon">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                                            </div>
                                            <Link to={`/produit/${product.id}`} className="fh-prod-name">{product.name}</Link>
                                        </div>
                                        <p className="fh-prod-desc">{product.description}</p>
                                        {product.category?.name && (
                                            <div className="fh-prod-tags">
                                                <span className="fh-prod-tag">{product.category.name}</span>
                                            </div>
                                        )}
                                        <div className="fh-prod-footer">
                                            <div>
                                                <span className="fh-prod-price">{product.price?.toFixed(2)}</span>
                                                <span className="fh-prod-price-unit">€</span>
                                            </div>
                                            <button className="fh-prod-add" onClick={() => handleAddToCart(product)}>
                                                <span>Ajouter</span>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ─── CATEGORIES ─── */}
                {categories.length > 0 && (
                    <section className="fh-section">
                        <div className="fh-section-header">
                            <div>
                                <div className="fh-section-eyebrow">Catégories</div>
                                <h2 className="fh-section-title">Explorez <span className="hl">nos gammes</span></h2>
                            </div>
                            <Link to="/produits" className="fh-section-link">Voir tout</Link>
                        </div>
                        <div className="fh-cat-grid">
                            {categories.map((cat, i) => {
                                const bgs = [
                                    'linear-gradient(160deg, #2C3D35 0%, #111A16 100%)',
                                    'linear-gradient(160deg, #3D3028 0%, #1A120E 100%)',
                                    'linear-gradient(160deg, #2A3544 0%, #111820 100%)',
                                ];
                                return (
                                    <Link to={`/produits?category=${cat.id}`} key={cat.id} style={{ textDecoration: 'none' }}>
                                        <div className="fh-cat-card">
                                            <div className="fh-cat-bg" style={{ background: bgs[i % bgs.length] }} />
                                            <div className="fh-cat-decor">0{i + 1}</div>
                                            <div className="fh-cat-info">
                                                <div className="fh-cat-count">{cat.productCount || cat.products?.length || 0} articles</div>
                                                <div className="fh-cat-name">{cat.name}</div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ─── TESTIMONIALS ─── */}
                <section className="fh-testimonials">
                    <div className="fh-section-header" style={{ marginBottom: '3rem' }}>
                        <div>
                            <div className="fh-section-eyebrow">Témoignages</div>
                            <h2 className="fh-section-title">Ce qu'ils <span className="hl">disent</span></h2>
                        </div>
                    </div>
                    <div className="fh-testimonials-grid">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="fh-testimonial-card">
                                <div className="fh-testimonial-header">
                                    <div className="fh-testimonial-avatar">{t.initials}</div>
                                    <div>
                                        <div className="fh-testimonial-name">{t.name}</div>
                                        <div className="fh-testimonial-role">{t.role}</div>
                                    </div>
                                </div>
                                <p className="fh-testimonial-text">"{t.text}"</p>
                                <div className="fh-testimonial-tags">
                                    {t.tags.map((tag, j) => (
                                        <span key={j} className="fh-testimonial-tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── CTA BANNER ─── */}
                {!isAuthenticated && (
                    <section className="fh-cta-banner">
                        <div className="fh-cta-banner-inner">
                            <span className="fh-accent-line" style={{ margin: '0 auto 1rem' }} />
                            <div className="fh-section-eyebrow" style={{ textAlign: 'center' }}>Rejoignez-nous</div>
                            <h2 className="fh-cta-banner-title">
                                Prêt à découvrir<br /><span className="hl">l'expérience InsightCart ?</span>
                            </h2>
                            <p className="fh-cta-banner-desc">
                                Créez votre compte gratuitement et accédez à des milliers de produits premium, livrés chez vous en 24/48h.
                            </p>
                            <div className="fh-cta-banner-actions">
                                <Link to="/register" className="fh-btn-primary">Créer un compte gratuit</Link>
                                <Link to="/login" className="fh-btn-ghost">Déjà membre ? Se connecter</Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* ─── FOOTER ─── */}
                <footer className="fh-footer">
                    <div className="fh-footer-grid">
                        <div>
                            <div className="fh-footer-brand">
                                <div className="fh-footer-brand-mark">I</div>
                                InsightCart
                            </div>
                            <p className="fh-footer-desc">
                                Votre destination pour des produits premium sélectionnés avec soin. Livraison rapide, service irréprochable.
                            </p>
                        </div>
                        <div>
                            <div className="fh-footer-title">Liens Rapides</div>
                            <ul className="fh-footer-links">
                                <li><Link to="/produits">Catalogue</Link></li>
                                <li><Link to="/apropos">À Propos</Link></li>
                                <li><Link to="/login">Connexion</Link></li>
                                <li><Link to="/register">Inscription</Link></li>
                            </ul>
                        </div>
                        <div>
                            <div className="fh-footer-title">Aide</div>
                            <ul className="fh-footer-links">
                                <li><a href="#">FAQ</a></li>
                                <li><a href="#">Livraison & Retours</a></li>
                                <li><a href="#">Paiement Sécurisé</a></li>
                                <li><a href="#">Service Client</a></li>
                            </ul>
                        </div>
                        <div>
                            <div className="fh-footer-title">Contact</div>
                            <div className="fh-footer-contact">
                                <strong>Adresse</strong><br />
                                {CONTACT_INFO.address}<br /><br />
                                <strong>Email</strong><br />
                                {CONTACT_INFO.email}<br /><br />
                                <strong>Téléphone</strong><br />
                                {CONTACT_INFO.phone}<br /><br />
                                {CONTACT_INFO.hours.map((h, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.75rem' }}>
                                        <span>{h.day}</span>
                                        <span style={{ color: '#B8B8B8' }}>{h.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="fh-footer-bottom">
                        <div className="fh-footer-copy">© 2026 InsightCart. Tous droits réservés.</div>
                        <div className="fh-footer-social">
                            <a href="#" aria-label="Instagram">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                            </a>
                            <a href="#" aria-label="Twitter">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                            </a>
                            <a href="#" aria-label="YouTube">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
