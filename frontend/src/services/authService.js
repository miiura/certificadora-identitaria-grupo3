import api from './api';

const ROLE_MAP = {
    ADMIN: 'admin',
    COORDENADOR: 'admin',
    VOLUNTARIO: 'volunteer',
};

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, usuario } = response.data;

        const user = {
            id: usuario.id,
            email: usuario.email,
            name: usuario.name || usuario.email,
            role: ROLE_MAP[usuario.role] || 'volunteer',
            avatar: (usuario.name || usuario.email)
                .split(' ')
                .map(w => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase(),
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return user;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    getCurrentUser: () => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    },
};
