import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
        setUserRole(localStorage.getItem('userRole'));
    }, []);

    const login = (role) => {
        setIsAuthenticated(true);
        setUserRole(role);
    };

    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}