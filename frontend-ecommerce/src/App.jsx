import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import de la nouvelle Navbar
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminProduct from './components/AdminProduct';
import UsersManagement from './components/UsersManagement';
function App() {
  return (
    <Router>
      <Navbar /> {/* Elle est ici, en dehors des Routes pour être visible partout */}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProduct />} />
        <Route path="/admin/users" element={<UsersManagement />} />
      </Routes>
    </Router>
  );
}

export default App;