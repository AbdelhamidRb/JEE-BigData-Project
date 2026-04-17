import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated, userRole, logout } = useContext(AuthContext);

    const handleLogout = () => {
        // 1. On navigue d'abord vers la home (qui est publique donc sans PrivateRoute)
        navigate('/', { replace: true });

        // 2. Puis on vide le compte
        setTimeout(() => {
            logout();
            toast.success("Déconnexion réussie");
        }, 10);
    };

    return (
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* LOGO */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
                            <span className="text-blue-600">E-Commerce</span>
                            <span className="text-gray-800">Hub</span>
                        </Link>
                    </div>

                    {/* LIENS */}
                    <div className="flex items-center gap-6">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                                    Connexion
                                </Link>
                                <Link to="/register" className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all">
                                    Inscription
                                </Link>
                            </>
                        ) : (
                            <>
                                {userRole === 'ADMIN' ? (
                                    <Link to="/admin/dashboard" className="text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
                                        ⚙️ Espace Admin
                                    </Link>
                                ) : (
                                    <Link to="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                                        Mon Espace
                                    </Link>
                                )}

                                <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-semibold text-red-600 hover:text-white border border-red-600 hover:bg-red-600 px-4 py-2 rounded-lg transition-all focus:ring-2 focus:ring-red-500 focus:outline-none"
                                >
                                    Déconnexion
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}