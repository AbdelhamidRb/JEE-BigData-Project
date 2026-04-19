import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
// On a retiré l'ancien 'Dashboard' qui ne sert plus
import AdminDashboard from './components/AdminDashboard';
import AdminProduct from './components/AdminProduct';
import UsersManagement from './components/UsersManagement';
import AdminLayout from './components/AdminLayout';
import Home from './components/Home';
import ProductList from './components/ProductList';
import Apropos from './components/Apropos';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import CategoryManagement from './components/CategoryManagement';
import OrderManagement from './components/OrderManagement';


function App() {
  return (
    <AuthProvider>
        <CartProvider>
          <Router>
            <Toaster position="top-right" />
            <Navbar />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />


              {/* Route protégée : Utilisateur Standard (Catalogue des produits) */}
              <Route path="/dashboard" element={<PrivateRoute><ProductList /></PrivateRoute>} />
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} /> {/* <-- ICI */}

              {/* NOUVELLE ROUTE : Checkout */}
              <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />

              {/* Produits route (alias to catalogue) */}
              <Route path="/produits" element={<PrivateRoute><ProductList /></PrivateRoute>} />

              {/* Apropos route (case-insensitive alias) */}
              <Route path="/apropos" element={<Apropos />} />
              <Route path="/Apropos" element={<Navigate to="/apropos" />} />



              {/* Routes protégées : ADMIN (Utilisation du Layout) */}
              <Route path="/admin" element={<PrivateRoute roleRequired="ADMIN"><AdminLayout /></PrivateRoute>}>
                {/* Ces sous-routes s'injectent dans AdminLayout (SANS slash devant) */}
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProduct />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="users" element={<UsersManagement />} />
                <Route path="orders" element={<OrderManagement />} />
              </Route>

            </Routes>
          </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
