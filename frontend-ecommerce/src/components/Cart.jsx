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
             confirmButtonColor: '#ef4444',
             cancelButtonColor: '#6b7280',
             confirmButtonText: 'Oui, vider',
             cancelButtonText: 'Annuler'
         });
         if (result.isConfirmed) setCart([]);
     };

     if (cart.length === 0) {
         return (
             <div className="max-w-7xl mx-auto p-6 min-h-[70vh] flex flex-col items-center justify-center">
                 <div className="text-6xl mb-4">🛒</div>
                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
                 <p className="text-gray-500 mb-6">Découvrez nos produits et commencez vos achats.</p>
                 <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all">
                     Voir le catalogue
                 </Link>
             </div>
         );
     }

     return (
         <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50">
             <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Votre Panier</h2>

             <div className="flex flex-col lg:flex-row gap-8">
                 <div className="lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                     <ul className="divide-y divide-gray-100">
                         {cart.map((item) => (
                             <li key={item.id} className="p-6 flex items-center gap-6">
                                 <img
                                     src={item.imageUrl || 'https://via.placeholder.com/150'}
                                     alt={item.name}
                                     className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                 />
                                 <div className="flex-1">
                                     <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                     <p className="text-sm text-gray-500 mt-1">{item.category?.name || 'Général'}</p>
                                     <div className="text-blue-600 font-extrabold mt-2">{item.price.toFixed(2)} €</div>
                                 </div>

                                 {/* CONTRÔLES DE QUANTITÉ DANS LE PANIER */}
                                 <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                     <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded shadow-sm font-bold">-</button>
                                     <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                                     <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded shadow-sm font-bold">+</button>
                                 </div>

                                 <button onClick={() => removeFromCart(item.id)} className="ml-4 text-red-500 hover:text-red-700 p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Retirer">
                                     🗑️
                                 </button>
                             </li>
                         ))}
                     </ul>
                     <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                         <button onClick={handleClearCart} className="text-sm font-bold text-red-600 hover:underline">
                             Vider tout le panier
                         </button>
                     </div>
                 </div>

                 <div className="lg:w-1/3">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                         <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Résumé</h3>

                         <div className="flex justify-between mb-4 text-gray-600">
                             <span>Sous-total</span>
                             <span>{cartTotal.toFixed(2)} €</span>
                         </div>
                         <div className="flex justify-between mb-6 text-gray-600">
                             <span>Frais de livraison</span>
                             <span className="text-green-600 font-bold">Gratuit</span>
                         </div>

                         <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-8">
                             <span className="text-lg font-bold text-gray-900">Total TTC</span>
                             <span className="text-3xl font-black text-blue-600">{cartTotal.toFixed(2)} €</span>
                         </div>

                         <button
                             onClick={() => navigate('/checkout')}
                             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2"
                         >
                             Passer la commande <span>➔</span>
                         </button>
                     </div>
                 </div>
             </div>
         </div>
     );
 }