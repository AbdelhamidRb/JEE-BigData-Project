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

    const [cardForm, setCardForm] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
    });

    const [addressForm, setAddressForm] = useState({
        fullName: '',
        street: '',
        city: '',
        postalCode: '',
        phone: ''
    });

    const handleChange = (e) => {
        setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
    };

    const handleCardChange = (e) => {
        let { name, value } = e.target;
        
        if (name === 'cardNumber') {
            value = value.replace(/\s/g, '').replace(/\D/g, '');
            value = value.substring(0, 16);
            value = value.replace(/(\d{4})/g, '$1 ').trim();
        }
        
        if (name === 'expiry') {
            value = value.replace(/\D/g, '');
            value = value.substring(0, 4);
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
        }
        
        if (name === 'cvv') {
            value = value.replace(/\D/g, '').substring(0, 3);
        }
        
        setCardForm({ ...cardForm, [name]: value });
    };

    const isCardValid = () => {
        const rawNumber = cardForm.cardNumber.replace(/\s/g, '');
        return rawNumber.length === 16 && 
               cardForm.cardName.trim() !== '' && 
               cardForm.expiry.length === 5 && 
               cardForm.cvv.length === 3;
    };

    const isFormValid = () => {
        const addressValid = Object.values(addressForm).every(val => val.trim() !== '');
        if (paymentMethod === 'card') {
            return addressValid && isCardValid();
        }
        return addressValid;
    };

    const processPayment = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { transactionId: 'TXN-' + Date.now(), status: 'success' };
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            toast.error("Votre panier est vide.");
            return navigate('/dashboard');
        }

        if (!isFormValid()) {
            toast.error("Veuillez remplir tous les champs.");
            return;
        }

        const result = await Swal.fire({
            title: 'Confirmer la commande',
            text: `Le montant total est de ${cartTotal.toFixed(2)} €. Procéder au paiement ?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Oui, commander',
            cancelButtonText: 'Retour'
        });

        if (result.isConfirmed) {
            setLoading(true);
            const loadingToast = toast.loading('Traitement du paiement...');

            try {
                await processPayment();
                
                const fullShippingAddress = `${addressForm.fullName}, ${addressForm.street}, ${addressForm.postalCode} ${addressForm.city} (Tél: ${addressForm.phone})`;
                
                const payload = {
                    shippingAddress: fullShippingAddress,
                    items: cart.map(item => ({
                        productId: item.id,
                        quantity: item.quantity
                    }))
                };

                await api.post('/orders', payload);

                toast.success("Paiement réussi ! Commande validée.", { id: loadingToast });
                setCart([]);

                Swal.fire({
                    title: 'Félicitations !',
                    text: 'Votre paiement a été accepté et votre commande est en cours de préparation.',
                    icon: 'success',
                    confirmButtonColor: '#2563eb'
                }).then(() => {
                    navigate('/dashboard');
                });

            } catch (error) {
                const errorMsg = error.response?.data || "Erreur lors du paiement.";
                toast.error(errorMsg, { id: loadingToast });
            } finally {
                setLoading(false);
            }
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto p-6 min-h-[70vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Panier vide</h2>
                <Link to="/dashboard" className="text-blue-600 hover:underline">Retourner au catalogue</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Paiement sécurisé</h2>
                <p className="text-gray-500 mt-2">Dernière étape avant l'expédition de vos articles.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Adresse de livraison</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                    <input type="text" name="fullName" value={addressForm.fullName} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jean Dupont" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                                    <input type="text" name="street" value={addressForm.street} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123 Avenue des Champs-Élysées" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Code Postal</label>
                                    <input type="text" name="postalCode" value={addressForm.postalCode} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="75008" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                                    <input type="text" name="city" value={addressForm.city} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Paris" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                    <input type="tel" name="phone" value={addressForm.phone} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+33 6 12 34 56 78" />
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Mode de paiement</h3>
                        
                        <div className="flex gap-4 mb-6">
                            <button type="button"
                                onClick={() => setPaymentMethod('card')}
                                className={`flex-1 p-4 rounded-lg border-2 transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="font-bold">Carte bancaire</div>
                                        <div className="text-xs text-gray-500">Visa, Mastercard...</div>
                                    </div>
                                </div>
                            </button>
                            
                            <button type="button"
                                onClick={() => setPaymentMethod('cash')}
                                className={`flex-1 p-4 rounded-lg border-2 transition-all ${paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6m0 0h6m6 0v6a2 2 0 002 2h2a2 2 0 002-2v-6m0 0H9" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="font-bold">Espèces</div>
                                        <div className="text-xs text-gray-500">Paiement à réception</div>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {paymentMethod === 'card' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
                                    <input type="text" name="cardNumber" value={cardForm.cardNumber} onChange={handleCardChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1234 5678 9012 3456" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom sur la carte</label>
                                    <input type="text" name="cardName" value={cardForm.cardName} onChange={handleCardChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="JEAN DUPONT" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
                                        <input type="text" name="expiry" value={cardForm.expiry} onChange={handleCardChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="MM/YY" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                        <input type="text" name="cvv" value={cardForm.cvv} onChange={handleCardChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>Paiement 100% sécurisé - Vos données sont chiffrées</span>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'cash' && (
                            <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800">
                                Vous paierez en espèces lors de la réception de votre commande. Un acompte de 10% sera demandé pour confirmer la commande.
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Résumé</h3>

                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-gray-500">{item.quantity}x</span>
                                        <span className="text-gray-800 line-clamp-1">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)} €</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-4 mb-8 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Sous-total</span>
                                <span>{cartTotal.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Livraison</span>
                                <span className="text-green-600 font-bold">Gratuite</span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-black text-blue-600">{cartTotal.toFixed(2)} €</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={!isFormValid() || loading}
                            className={`w-full py-4 rounded-lg font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2 ${
                                !isFormValid() || loading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Traitement...
                                </>
                            ) : (
                                <>Payer {cartTotal.toFixed(2)} € 🔒</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}