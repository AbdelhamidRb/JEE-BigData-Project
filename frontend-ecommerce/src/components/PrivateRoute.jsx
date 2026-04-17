import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children, roleRequired }) {
    const { isAuthenticated, userRole } = useContext(AuthContext);
    const location = useLocation();

    // 1. Si l'utilisateur n'est pas connecté
    if (!isAuthenticated) {
        // Optionnel : On peut sauvegarder l'endroit où il voulait aller
        // pour le rediriger après sa prochaine connexion.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Si un rôle spécifique est requis (ex: ADMIN) et que l'user ne l'a pas
    if (roleRequired && userRole !== roleRequired) {
        // On le renvoie vers son dashboard autorisé au lieu du login
        const redirectPath = userRole === 'ADMIN' ? "/admin/dashboard" : "/dashboard";
        return <Navigate to={redirectPath} replace />;
    }

    // 3. Si tout est OK, on affiche la page demandée
    return children;
}