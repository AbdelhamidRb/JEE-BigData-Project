import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Vérification des identifiants...');

        try {
            const response = await api.post('/auth/login', formData);
            const { role, email, token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userRole', role);

            login(role);

            toast.success(`Bienvenue !`, { id: loadingToast });
            navigate(role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');

        } catch (error) {
            console.error("Erreur login:", error);
            toast.error("Email ou mot de passe incorrect", { id: loadingToast });
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Connectez-vous
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ou{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                        créez un compte gratuitement
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* CHAMP EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="votre@email.com"
                                onChange={handleChange}
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* CHAMP MOT DE PASSE */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                onChange={handleChange}
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* BOUTON SOUMETTRE */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                            >
                                Se connecter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}