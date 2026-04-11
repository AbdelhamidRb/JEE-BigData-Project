import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', formData);
            setMessage({ text: "Connexion réussie !", type: 'success' });
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', formData.email);
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error) {
            setMessage({ text: "Email ou mot de passe incorrect", type: 'error' });
        }
    };

    return (
        <div className="page-container">
            <div className="auth-card">
                <h2>Bon retour</h2>

                {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form-group">
                    <input type="email" name="email" placeholder="Adresse email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
                    <button type="submit" className="btn-primary">Se connecter</button>
                </form>
            </div>
        </div>
    );
}