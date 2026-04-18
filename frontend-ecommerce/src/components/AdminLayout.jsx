import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
         // 1. On navigue d'abord vers la home (qui est publique donc sans PrivateRoute)
         navigate('/', { replace: true });

         // 2. Puis on vide le compte
         setTimeout(() => {
             logout();
             toast.success("Déconnexion réussie");
         }, 10);
     };

    const getLinkClass = (path) => {
        const baseClass = "flex items-center px-4 py-3 rounded-lg font-medium transition-colors mb-2 ";
        return location.pathname.includes(path)
            ? baseClass + "bg-blue-50 text-blue-700"
            : baseClass + "text-gray-600 hover:bg-gray-50 hover:text-blue-600";
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white shadow-sm border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 flex-1">
                    <h2 className="text-xs uppercase text-gray-400 font-bold tracking-wider mb-4">Menu Admin</h2>
                    <nav>
                        <Link to="/admin/dashboard" className={getLinkClass("dashboard")}>
                            <span className="mr-3 text-lg">📊</span> Synthèse
                        </Link>
                        <Link to="/admin/products" className={getLinkClass("products")}>
                            <span className="mr-3 text-lg">📦</span> Produits
                        </Link>
                        <Link to="/admin/users" className={getLinkClass("users")}>
                            <span className="mr-3 text-lg">👥</span> Utilisateurs
                        </Link>
                        <Link to="/admin/categories" className={getLinkClass("categories")}>
                            <span className="mr-3 text-lg">📁</span> Catégories
                        </Link>
                        <Link to="/admin/orders" className={getLinkClass("orders")}>
                            <span className="mr-3 text-lg">🛒</span> Commandes
                        </Link>
                    </nav>
                </div>

                {/* PIED DE SIDEBAR : Bouton Déconnexion */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                    >
                        <span className="mr-3 text-lg">🚪</span> Quitter l'admin
                    </button>
                </div>
            </aside>

            {/* CONTENU PRINCIPAL */}
            <main className="flex-1 p-8 w-full overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
}