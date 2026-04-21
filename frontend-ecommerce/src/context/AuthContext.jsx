import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
    const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole'));
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = (roleOrUser) => {
        setIsAuthenticated(true);
        if (typeof roleOrUser === 'string') {
            setUserRole(roleOrUser);
        } else {
            setUserRole(roleOrUser.role);
            setUser(roleOrUser);
            localStorage.setItem('userRole', roleOrUser.role);
        }
    };

    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setUserRole(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}