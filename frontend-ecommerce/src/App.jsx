import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './index.css'; // On importe notre beau fichier CSS

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <Link to="/login" className="nav-link">Connexion</Link>
          <Link to="/register" className="nav-link">Inscription</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;