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

    // État pour l'adresse complète
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

    const isFormValid = Object.values(addressForm).every(val => val.trim() !== '');

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            toast.error("Votre panier est vide.");
            return navigate('/dashboard');
        }

        // Formatage de l'adresse en une seule chaîne (comme attendu par le Backend)
        const fullShippingAddress = `${addressForm.fullName}, ${addressForm.street}, ${addressForm.postalCode} ${addressForm.city} (Tél: ${addressForm.phone})`;

        // Préparation du payload selon ton DTO OrderRequest
        const payload = {
            shippingAddress: fullShippingAddress,
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }))
        };

        const result = await Swal.fire({
            title: 'Confirmer la commande',
            text: `Le montant total est de ${cartTotal.toFixed(2)} €. Procéder au paiement ?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb', // blue-600
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Oui, commander',
            cancelButtonText: 'Retour'
        });

        if (result.isConfirmed) {
            setLoading(true);
            const loadingToast = toast.loading('Traitement de votre commande...');

            try {
                // Envoi de la commande avec le token JWT automatiquement géré par ton instance axios
                const token = localStorage.getItem('token');
                await api.post('/orders', payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                toast.success("Commande validée avec succès !", { id: loadingToast });

                // Vider le panier
                setCart([]);

                // Rediriger vers l'accueil ou un futur espace "Mes Commandes"
                Swal.fire({
                    title: 'Félicitations !',
                    text: 'Votre commande a été enregistrée et est en cours de préparation.',
                    icon: 'success',
                    confirmButtonColor: '#2563eb'
                }).then(() => {
                    navigate('/dashboard');
                });

            } catch (error) {
                console.error("Erreur de commande:", error);
                const errorMsg = error.response?.data || "Erreur lors de la validation. Vérifiez les stocks.";
                toast.error(errorMsg, { id: loadingToast });
            } finally {
                setLoading(false);
            }
        }
    };

    // Sécurité : si le panier est vide, on ne peut pas être sur cette page
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
                <h2 className="text-3xl font-extrabold text-gray-900">Validation de la commande</h2>
                <p className="text-gray-500 mt-2">Dernière étape avant l'expédition de vos articles.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* FORMULAIRE D'ADRESSE */}
                <div className="lg:w-2/3">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Adresse de livraison</h3>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                    <input type="text" name="fullName" value={addressForm.fullName} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jean Dupont" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse (Numéro et Rue)</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                                    <input type="tel" name="phone" value={addressForm.phone} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+33 6 12 34 56 78" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RÉSUMÉ ET PAIEMENT */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Résumé du panier</h3>

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
                                <span className="text-lg font-bold text-gray-900">Total TTC</span>
                                <span className="text-2xl font-black text-blue-600">{cartTotal.toFixed(2)} €</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={!isFormValid || loading}
                            className={`w-full py-4 rounded-lg font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2 ${
                                !isFormValid || loading
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                            }`}
                        >
                            {loading ? 'Traitement...' : 'Payer et Commander 🔒'}
                        </button>
                        {!isFormValid && (
                            <p className="text-xs text-red-500 text-center mt-3">
                                Veuillez remplir tous les champs de l'adresse.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}