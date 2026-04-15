import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">E-Commerce Hub</Link>
            </div>

            <div className="nav-links">
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className="nav-link">Connexion</Link>
                        <Link to="/register" className="nav-link">Inscription</Link>
                    </>
                ) : (
                    <>
                        {userRole === 'ADMIN' && (
                            <>
                                <Link to="/admin/products" className="nav-link">Gestion Produits</Link>
                                <Link to="/admin/users" className="nav-link">Gérer Utilisateurs</Link>
                            </>
                        )}
                        <Link to={userRole === 'ADMIN' ? "/admin/dashboard" : "/dashboard"} className="nav-link">
                            Dashboard
                        </Link>
                        <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
                    </>
                )}
            </div>
        </nav>
    );
}