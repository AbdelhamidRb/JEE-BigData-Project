import axios from 'axios';

// On configure l'URL de base vers votre Spring Boot
const api = axios.create({
    baseURL: 'http://localhost:8080/api/auth',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;