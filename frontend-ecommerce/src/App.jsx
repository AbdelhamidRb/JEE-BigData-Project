import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import AdminProduct from './components/AdminProduct';
import UsersManagement from './components/UsersManagement';
import AdminLayout from './components/AdminLayout';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Apropos from './components/Apropos';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import CategoryManagement from './components/CategoryManagement';
import OrderManagement from './components/OrderManagement';
import MyOrders from './components/MyOrders';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import Unauthorized from './components/Unauthorized';

function App() {
  return (
    <AuthProvider>
        <CartProvider>
          <Router>
            <Toaster position="top-right" />

            <Routes>
              <Route path="/" element={<><Navbar /><Home /></>} />
              <Route path="/login" element={<><Navbar /><Login /></>} />
              <Route path="/register" element={<><Navbar /><Register /></>} />


              {/* Route protégée : Utilisateur Standard (Catalogue des produits) */}
              <Route path="/dashboard" element={<PrivateRoute><Navbar /><ProductList /></PrivateRoute>} />
              <Route path="/cart" element={<PrivateRoute><Navbar /><Cart /></PrivateRoute>} />
              <Route path="/mes-commandes" element={<PrivateRoute><Navbar /><MyOrders /></PrivateRoute>} />
              <Route path="/profil" element={<PrivateRoute><Navbar /><Profile /></PrivateRoute>} />

              {/* NOUVELLE ROUTE : Checkout */}
              <Route path="/checkout" element={<PrivateRoute><Navbar /><Checkout /></PrivateRoute>} />

              {/* Produits route (alias to catalogue) */}
              <Route path="/produits" element={<PrivateRoute><Navbar /><ProductList /></PrivateRoute>} />
              <Route path="/produit/:id" element={<PrivateRoute><Navbar /><ProductDetail /></PrivateRoute>} />

              {/* Apropos route (case-insensitive alias) */}
              <Route path="/apropos" element={<><Navbar /><Apropos /></>} />
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

              {/* 404 Not Found */}
              <Route path="*" element={<><Navbar /><NotFound /></>} />

              {/* Unauthorized (403) */}
              <Route path="/unauthorized" element={<><Navbar /><Unauthorized /></>} />

            </Routes>
          </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
