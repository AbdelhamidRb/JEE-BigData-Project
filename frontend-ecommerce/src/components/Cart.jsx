import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Swal from 'sweetalert2';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal, setCart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleClearCart = async () => {
        const result = await Swal.fire({
            title: 'Vider le panier ?',
            text: "Tous vos articles seront retirés.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF5E00',
            cancelButtonColor: '#6B6B6B',
            confirmButtonText: 'Oui, vider',
            cancelButtonText: 'Annuler'
        });
        if (result.isConfirmed) setCart([]);
    };

    if (cart.length === 0) {
        return (
            <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", background: '#0A0A0A', color: '#6B6B6B' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>🛒</div>
                <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Votre panier est vide</h2>
                <p style={{ marginBottom: '1.5rem', color: '#6B6B6B' }}>Découvrez nos produits et commencez vos achats.</p>
                <Link to="/dashboard" style={{ padding: '0.75rem 1.5rem', background: '#FF5E00', color: '#0A0A0A', textDecoration: 'none', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.75rem', fontWeight: 600 }}>
                    Voir le catalogue
                </Link>
            </div>
        );
    }

    return (
        <>
            <style>{`
                .fc-root { max-width: 1200px; margin: 0 auto; padding: 2.5rem 1.5rem; min-height: 100vh; font-family: 'Inter', sans-serif; background: #0A0A0A; }
                .fc-title { font-family: 'Oswald', sans-serif; font-size: 2rem; color: #fff; margin-bottom: 2rem; text-transform: uppercase; }
                .fc-title .hl { color: #FF5E00; }
                .fc-layout { display: flex; flex-direction: column; gap: 2rem; }
                @media (min-width: 1024px) { .fc-layout { flex-direction: row; } }
                .fc-items { flex: 2; background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); }
                .fc-summary { flex: 1; }
                .fc-summary-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); padding: 1.5rem; position: sticky; top: 80px; }
                .fc-item { display: flex; align-items: center; gap: 1.2rem; padding: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.04); }
                .fc-item:last-child { border-bottom: none; }
                .fc-item-img { width: 80px; height: 80px; object-fit: cover; border: 1px solid rgba(255,255,255,0.06); filter: grayscale(40%); }
                .fc-item-info { flex: 1; }
                .fc-item-name { font-family: 'Oswald', sans-serif; font-size: 0.95rem; color: #fff; text-transform: uppercase; }
                .fc-item-cat { font-size: 0.65rem; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.12em; margin: 4px 0 8px; }
                .fc-item-price { font-family: 'Oswald', sans-serif; color: #FF5E00; font-weight: 600; font-size: 1rem; }
                .fc-qty { display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 0.2rem; }
                .fc-qty-btn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; cursor: pointer; color: #B8B8B8; font-size: 1rem; transition: background 0.15s; }
                .fc-qty-btn:hover { background: rgba(255,255,255,0.06); }
                .fc-qty-val { min-width: 24px; text-align: center; color: #D4D4D4; font-size: 0.85rem; }
                .fc-item-remove { background: rgba(163,45,45,0.15); border: none; color: #E24B4A; cursor: pointer; padding: 0.4rem 0.7rem; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'Inter', sans-serif; transition: background 0.15s; }
                .fc-item-remove:hover { background: rgba(163,45,45,0.3); }
                .fc-clear { padding: 1rem 1.2rem; text-align: right; border-top: 1px solid rgba(255,255,255,0.04); }
                .fc-clear-btn { background: transparent; border: none; color: #6B6B6B; cursor: pointer; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; font-family: 'Inter', sans-serif; transition: color 0.2s; }
                .fc-clear-btn:hover { color: #E24B4A; }
                .fc-summary-title { font-family: 'Oswald', sans-serif; font-size: 1.1rem; color: #fff; text-transform: uppercase; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
                .fc-summary-row { display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.85rem; color: #B8B8B8; }
                .fc-summary-total { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.06); margin-bottom: 1.5rem; }
                .fc-summary-total-label { font-family: 'Oswald', sans-serif; font-size: 1rem; color: #fff; text-transform: uppercase; }
                .fc-summary-total-val { font-family: 'Oswald', sans-serif; font-size: 1.8rem; color: #FF5E00; font-weight: 600; }
                .fc-checkout-btn { width: 100%; padding: 1rem; background: #FF5E00; color: #0A0A0A; border: none; cursor: pointer; font-family: 'Oswald', sans-serif; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; transition: all 0.2s; }
                .fc-checkout-btn:hover { background: #FF7A2E; box-shadow: 0 4px 16px rgba(255,94,0,0.3); }
                .fc-free { color: #4CAF50; font-weight: 500; }
            `}</style>
            <div className="fc-root">
                <h2 className="fc-title">Votre <span className="hl">Panier</span></h2>
                <div className="fc-layout">
                    <div className="fc-items">
                        {cart.map((item) => (
                            <div key={item.id} className="fc-item">
                                <img src={item.imageUrl || 'https://via.placeholder.com/150'} alt={item.name} className="fc-item-img" />
                                <div className="fc-item-info">
                                    <div className="fc-item-name">{item.name}</div>
                                    <div className="fc-item-cat">{item.category?.name || 'Général'}</div>
                                    <div className="fc-item-price">{item.price.toFixed(2)} €</div>
                                </div>
                                <div className="fc-qty">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="fc-qty-btn">−</button>
                                    <span className="fc-qty-val">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="fc-qty-btn">+</button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="fc-item-remove">Retirer</button>
                            </div>
                        ))}
                        <div className="fc-clear">
                            <button onClick={handleClearCart} className="fc-clear-btn">Vider tout le panier</button>
                        </div>
                    </div>
                    <div className="fc-summary">
                        <div className="fc-summary-card">
                            <div className="fc-summary-title">Résumé</div>
                            <div className="fc-summary-row">
                                <span>Sous-total</span>
                                <span>{cartTotal.toFixed(2)} €</span>
                            </div>
                            <div className="fc-summary-row">
                                <span>Livraison</span>
                                <span className="fc-free">Gratuite</span>
                            </div>
                            <div className="fc-summary-total">
                                <span className="fc-summary-total-label">Total TTC</span>
                                <span className="fc-summary-total-val">{cartTotal.toFixed(2)} €</span>
                            </div>
                            <button onClick={() => navigate('/checkout')} className="fc-checkout-btn">
                                Passer la commande →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
