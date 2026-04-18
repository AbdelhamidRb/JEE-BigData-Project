import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantityToAdd = 1) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === product.id);

            if (existingItem) {
                const newTotalQuantity = existingItem.quantity + quantityToAdd;
                if (newTotalQuantity > product.stock) {
                    toast.error("Stock insuffisant pour satisfaire cette demande.");
                    return prevCart;
                }
                toast.success("Quantité mise à jour dans le panier !");
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: newTotalQuantity } : item
                );
            } else {
                if (quantityToAdd > product.stock) {
                    toast.error("Stock insuffisant pour satisfaire cette demande.");
                    return prevCart;
                }
                toast.success("Produit ajouté au panier !");
                return [...prevCart, { ...product, quantity: quantityToAdd }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
        toast.success("Article retiré du panier");
    };

    const updateQuantity = (productId, amount) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === productId) {
                const newQuantity = item.quantity + amount;
                if (newQuantity > item.stock) {
                    toast.error("Stock disponible insuffisant.");
                    return item;
                }
                if (newQuantity < 1) return item;
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};