import { useState } from 'react';
import api from '../api/axios';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', formData);

            // On déstructure la réponse du backend
            // Assure-toi que ton backend renvoie bien ces champs dans l'objet response.data
            const { role, email, token } = response.data;

            // Stockage des informations de session
            localStorage.setItem('token', token);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email); // Crucial pour le filtrage dans UsersManagement
            localStorage.setItem('userRole', role);

            setMessage({ text: "Connexion réussie ! Redirection...", type: 'success' });

            // Redirection après un court délai
            setTimeout(() => {
                window.location.href = role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
            }, 1000);
        } catch (error) {
            console.error("Erreur login:", error);
            setMessage({ text: "Email ou mot de passe incorrect", type: 'error' });
        }
    };

    return (
        <div className="page-container">
            <div className="auth-card">
                <h2>Espace de Connexion</h2>

                {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form-group">
                    <div className="input-field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="votre@email.com"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-field">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
}