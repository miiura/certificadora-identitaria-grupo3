import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data; // Aqui deve vir o seu token e os dados do usuário
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    logout: async () => {
        // Chama a rota que adiciona o token atual à blacklist
        const response = await api.post('/auth/logout');
        return response.data;
    }
};