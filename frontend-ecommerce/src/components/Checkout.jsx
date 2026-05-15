import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function Checkout() {
    const { cart, cartTotal, setCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardForm, setCardForm] = useState({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
    const [addressForm, setAddressForm] = useState({ fullName: '', street: '', city: '', postalCode: '', phone: '' });

    const handleChange = (e) => setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
    const handleCardChange = (e) => {
        let { name, value } = e.target;
        if (name === 'cardNumber') { value = value.replace(/\s/g, '').replace(/\D/g, '').substring(0, 16).replace(/(\d{4})/g, '$1 ').trim(); }
        if (name === 'expiry') { value = value.replace(/\D/g, '').substring(0, 4); if (value.length > 2) value = value.substring(0, 2) + '/' + value.substring(2); }
        if (name === 'cvv') { value = value.replace(/\D/g, '').substring(0, 3); }
        setCardForm({ ...cardForm, [name]: value });
    };

    const isCardValid = () => cardForm.cardNumber.replace(/\s/g, '').length === 16 && cardForm.cardName.trim() !== '' && cardForm.expiry.length === 5 && cardForm.cvv.length === 3;
    const isFormValid = () => Object.values(addressForm).every(val => val.trim() !== '') && (paymentMethod !== 'card' || isCardValid());

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (cart.length === 0) { toast.error("Votre panier est vide."); return navigate('/dashboard'); }
        if (!isFormValid()) { toast.error("Veuillez remplir tous les champs."); return; }
        const result = await Swal.fire({
            title: 'Confirmer la commande',
            text: `Le montant total est de ${cartTotal.toFixed(2)} €. Procéder au paiement ?`,
            icon: 'question', showCancelButton: true,
            confirmButtonColor: '#FF5E00', cancelButtonColor: '#6B6B6B',
            confirmButtonText: 'Oui, commander', cancelButtonText: 'Retour'
        });
        if (result.isConfirmed) {
            setLoading(true);
            const loadingToast = toast.loading('Traitement du paiement...');
            try {
                const fullShippingAddress = `${addressForm.fullName}, ${addressForm.street}, ${addressForm.postalCode} ${addressForm.city} (Tél: ${addressForm.phone})`;
                const payload = {
                    shippingAddress: fullShippingAddress,
                    items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
                    paymentMethod: paymentMethod
                };
                if (paymentMethod === 'card') {
                    payload.cardNumber = cardForm.cardNumber;
                    payload.cardHolderName = cardForm.cardName;
                }
                const response = await api.post('/orders', payload);
                const txnId = response.data.payment?.transactionId;
                toast.success(`Paiement réussi ! Transaction: ${txnId}`, { id: loadingToast });
                setCart([]);
                Swal.fire({ title: 'Félicitations !', text: `Votre commande a été validée. Réf: ${txnId}`, icon: 'success', confirmButtonColor: '#FF5E00' }).then(() => navigate('/dashboard'));
            } catch (error) {
                toast.error(error.response?.data || "Erreur lors du paiement.", { id: loadingToast });
            } finally { setLoading(false); }
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", background: '#0A0A0A', color: '#6B6B6B' }}>
                <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>Panier vide</h2>
                <Link to="/dashboard" style={{ color: '#FF5E00' }}>Retourner au catalogue</Link>
            </div>
        );
    }

    return (
        <>
            <style>{`
                .fch-root { max-width: 1200px; margin: 0 auto; padding: 2.5rem 1.5rem; min-height: 100vh; font-family: 'Inter', sans-serif; background: #0A0A0A; color: #E0E0E0; }
                .fch-header { margin-bottom: 2rem; }
                .fch-title { font-family: 'Oswald', sans-serif; font-size: 2rem; color: #fff; text-transform: uppercase; }
                .fch-title .hl { color: #FF5E00; }
                .fch-sub { color: #6B6B6B; font-size: 0.85rem; margin-top: 0.5rem; }
                .fch-layout { display: flex; flex-direction: column; gap: 2rem; }
                @media (min-width: 1024px) { .fch-layout { flex-direction: row; } }
                .fch-form-section { flex: 2; }
                .fch-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); padding: 1.5rem; margin-bottom: 1.5rem; }
                .fch-card-title { font-family: 'Oswald', sans-serif; font-size: 0.9rem; color: #fff; text-transform: uppercase; margin-bottom: 1.2rem; padding-bottom: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
                .fch-label { display: block; font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; color: #B8B8B8; margin-bottom: 0.4rem; font-weight: 500; }
                .fch-input { width: 100%; padding: 0.75rem 1rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #D4D4D4; font-family: 'Inter', sans-serif; font-size: 0.85rem; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
                .fch-input:focus { border-color: #FF5E00; }
                .fch-input::placeholder { color: #6B6B6B; }
                .fch-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .fch-grid-3 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .fch-payment-options { display: flex; gap: 0.8rem; margin-bottom: 1.2rem; }
                .fch-payment-opt { flex: 1; padding: 0.8rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); cursor: pointer; transition: all 0.2s; }
                .fch-payment-opt.active { border-color: #FF5E00; background: rgba(255,94,0,0.08); }
                .fch-payment-opt-label { font-size: 0.75rem; color: #D4D4D4; font-weight: 500; }
                .fch-payment-opt-sub { font-size: 0.65rem; color: #6B6B6B; }
                .fch-summary { flex: 1; }
                .fch-summary-card { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.04); padding: 1.5rem; position: sticky; top: 80px; }
                .fch-summary-title { font-family: 'Oswald', sans-serif; font-size: 1rem; color: #fff; text-transform: uppercase; margin-bottom: 1.2rem; padding-bottom: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
                .fch-summary-item { display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.8rem; }
                .fch-summary-item span:last-child { color: #D4D4D4; }
                .fch-summary-total { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.06); margin: 1rem 0; }
                .fch-summary-total-label { font-family: 'Oswald', sans-serif; font-size: 0.95rem; color: #fff; text-transform: uppercase; }
                .fch-summary-total-val { font-family: 'Oswald', sans-serif; font-size: 1.6rem; color: #FF5E00; font-weight: 600; }
                .fch-pay-btn { width: 100%; padding: 1rem; background: #FF5E00; color: #0A0A0A; border: none; cursor: pointer; font-family: 'Oswald', sans-serif; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .fch-pay-btn:hover:not(:disabled) { background: #FF7A2E; box-shadow: 0 4px 16px rgba(255,94,0,0.3); }
                .fch-pay-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .fch-security { display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; color: #6B6B6B; margin-top: 1rem; }
                .fch-cash-note { background: rgba(255,94,0,0.08); padding: 1rem; font-size: 0.8rem; color: #B8B8B8; border: 1px solid rgba(255,94,0,0.15); }
                .fch-free { color: #4CAF50; font-weight: 500; }
                .fch-scroll-items { max-height: 240px; overflow-y: auto; margin-bottom: 1rem; }
                .fch-scroll-items::-webkit-scrollbar { width: 4px; }
                .fch-scroll-items::-webkit-scrollbar-thumb { background: #FF5E00; border-radius: 2px; }
            `}</style>

            <div className="fch-root">
                <div className="fch-header">
                    <h2 className="fch-title">Paiement <span className="hl">sécurisé</span></h2>
                    <p className="fch-sub">Dernière étape avant l'expédition de vos articles.</p>
                </div>

                <div className="fch-layout">
                    <div className="fch-form-section">
                        <div className="fch-card">
                            <div className="fch-card-title">Adresse de livraison</div>
                            <div className="fch-grid-2">
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label className="fch-label">Nom complet</label>
                                    <input type="text" name="fullName" value={addressForm.fullName} onChange={handleChange} className="fch-input" placeholder="Jean Dupont" />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label className="fch-label">Adresse</label>
                                    <input type="text" name="street" value={addressForm.street} onChange={handleChange} className="fch-input" placeholder="123 Avenue des Champs-Élysées" />
                                </div>
                                <div>
                                    <label className="fch-label">Code Postal</label>
                                    <input type="text" name="postalCode" value={addressForm.postalCode} onChange={handleChange} className="fch-input" placeholder="75008" />
                                </div>
                                <div>
                                    <label className="fch-label">Ville</label>
                                    <input type="text" name="city" value={addressForm.city} onChange={handleChange} className="fch-input" placeholder="Paris" />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label className="fch-label">Téléphone</label>
                                    <input type="tel" name="phone" value={addressForm.phone} onChange={handleChange} className="fch-input" placeholder="+33 6 12 34 56 78" />
                                </div>
                            </div>
                        </div>

                        <div className="fch-card">
                            <div className="fch-card-title">Mode de paiement</div>
                            <div className="fch-payment-options">
                                <div className={`fch-payment-opt ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
                                    <div className="fch-payment-opt-label">Carte bancaire</div>
                                    <div className="fch-payment-opt-sub">Visa, Mastercard...</div>
                                </div>
                                <div className={`fch-payment-opt ${paymentMethod === 'cash' ? 'active' : ''}`} onClick={() => setPaymentMethod('cash')}>
                                    <div className="fch-payment-opt-label">Espèces</div>
                                    <div className="fch-payment-opt-sub">Paiement à réception</div>
                                </div>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="fch-grid-2">
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label className="fch-label">Numéro de carte</label>
                                        <input type="text" name="cardNumber" value={cardForm.cardNumber} onChange={handleCardChange} className="fch-input" placeholder="1234 5678 9012 3456" />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label className="fch-label">Nom sur la carte</label>
                                        <input type="text" name="cardName" value={cardForm.cardName} onChange={handleCardChange} className="fch-input" placeholder="JEAN DUPONT" />
                                    </div>
                                    <div>
                                        <label className="fch-label">Expiration</label>
                                        <input type="text" name="expiry" value={cardForm.expiry} onChange={handleCardChange} className="fch-input" placeholder="MM/YY" />
                                    </div>
                                    <div>
                                        <label className="fch-label">CVV</label>
                                        <input type="text" name="cvv" value={cardForm.cvv} onChange={handleCardChange} className="fch-input" placeholder="123" />
                                    </div>
                                </div>
                            )}
                            {paymentMethod === 'cash' && (
                                <div className="fch-cash-note">
                                    Vous paierez en espèces lors de la réception de votre commande.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="fch-summary">
                        <div className="fch-summary-card">
                            <div className="fch-summary-title">Résumé</div>
                            <div className="fch-scroll-items">
                                {cart.map(item => (
                                    <div key={item.id} className="fch-summary-item">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>{(item.price * item.quantity).toFixed(2)} €</span>
                                    </div>
                                ))}
                            </div>
                            <div className="fch-summary-item"><span>Sous-total</span><span>{cartTotal.toFixed(2)} €</span></div>
                            <div className="fch-summary-item"><span>Livraison</span><span className="fch-free">Gratuite</span></div>
                            <div className="fch-summary-total">
                                <span className="fch-summary-total-label">Total</span>
                                <span className="fch-summary-total-val">{cartTotal.toFixed(2)} €</span>
                            </div>
                            <button onClick={handlePlaceOrder} disabled={!isFormValid() || loading} className="fch-pay-btn">
                                {loading ? 'Traitement...' : `Payer ${cartTotal.toFixed(2)} €`}
                            </button>
                            <div className="fch-security">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5E00" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                Paiement 100% sécurisé
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
