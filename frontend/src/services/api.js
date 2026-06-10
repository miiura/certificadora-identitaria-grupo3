import axios from 'axios';

// Cria uma instância do Axios com a URL base do seu backend
const api = axios.create({
    // Adapte a variável de ambiente conforme o seu bundler (Vite ou CRA)
    baseURL: process.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;