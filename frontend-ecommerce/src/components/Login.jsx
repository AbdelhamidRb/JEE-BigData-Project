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
            const { role, email, token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userRole', role);

            setMessage({ text: "Connexion réussie !", type: 'success' });
            setTimeout(() => {
                window.location.href = role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
            }, 1000);
        } catch (error) {
            setMessage({ text: "Email ou mot de passe incorrect", type: 'error' });
        }
    };

    return (
        <div className="page-container">
            <div className="auth-card">
                <h2>Espace de Connexion</h2>
                {message.text && <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>{message.text}</div>}

                <form onSubmit={handleSubmit} className="form-group">
                    <input type="email" name="email" placeholder="Adresse email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
                    <button type="submit" className="btn-primary">Se connecter</button>
                </form>
            </div>
        </div>
    );
}