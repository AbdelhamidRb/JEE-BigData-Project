import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminProduct from './components/AdminProduct';
import UsersManagement from './components/UsersManagement';
import AdminLayout from './components/AdminLayout';
import Home from './components/Home';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Route protégée : Utilisateur (Client) */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          {/* Routes protégées : ADMIN (Utilisation du Layout) */}
          <Route path="/admin" element={<PrivateRoute roleRequired="ADMIN"><AdminLayout /></PrivateRoute>}>
            {/* Ces sous-routes sont injectées dans le <Outlet /> de AdminLayout */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProduct />} />
            <Route path="users" element={<UsersManagement />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;